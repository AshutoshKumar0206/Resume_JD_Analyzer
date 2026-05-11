import importlib
import importlib.util
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import tempfile
import os
pdfplumber_spec = importlib.util.find_spec("pdfplumber")
pdfplumber = importlib.import_module("pdfplumber") if pdfplumber_spec is not None else None
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

app = Flask(__name__)
CORS(app)

stop_words = set(stopwords.words('english')) - {"no", "not", "without"}  # keep important negatives
lemmatizer = WordNetLemmatizer()

headers = {
    "User-Agent": "Mozilla/5.0"
}

model = joblib.load("resume_match_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")

def clean_text(text):
    text = str(text)

    # remove links
    text = re.sub(r'http\S+', '', text)

    # keep + and # (important for tech like C++, C#)
    text = re.sub(r'[^a-zA-Z\s\+#\.]', '', text)

    text = text.lower()

    tokens = text.split()

    # remove stopwords + lemmatize
    tokens = [
        lemmatizer.lemmatize(t)
        for t in tokens
        if t not in stop_words and len(t) > 2
    ]

    return " ".join(tokens)

def extract_text_from_pdf(pdf_path):
    text = ""

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "

    return text


def predict_resume_jd_score(pdf_path, jd_text):
    resume_text = extract_text_from_pdf(pdf_path)

    resume_clean = clean_text(resume_text)
    jd_clean = clean_text(jd_text)

    final_text = resume_clean + " " + jd_clean

    final_tfidf = vectorizer.transform([final_text])

    prediction = model.predict(final_tfidf)[0]
    probability = model.predict_proba(final_tfidf)[0][1]

    score = round(probability * 100, 2)

    return {
        "result": "Good Fit" if prediction == 1 else "No Fit",
        "match_score": score,
        "resume_text": resume_text[:500]
    }

@app.route("/ai/analyze", methods=["POST"])
def predict_match():
    try:
        print(request)
        data = request.get_json()
        print(data)

        pdf_url = data.get("resumeUrl")
        jd_text = data.get("jdText")
        print(pdf_url, jd_text)

        if not pdf_url or not jd_text:
            return jsonify({
                "success": False,
                "message": "pdf_url and jd_text are required"
            }), 400

        if pdfplumber is None:
            return jsonify({
                "success": False,
                "message": "pdfplumber is not installed"
            }), 500

        # Download PDF from Cloudinary
        response = requests.get(pdf_url, headers=headers, timeout=30)
        print(response)

        if response.status_code != 200:
            return jsonify({
                "success": False,
                "message": "Failed to download PDF from Cloudinary"
            }), 400

        # Save PDF temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
            temp_pdf.write(response.content)
            temp_pdf_path = temp_pdf.name

        try:
            result = predict_resume_jd_score(temp_pdf_path, jd_text)

            return jsonify({
                "success": True,
                "data": result
            }), 200

        finally:
            if os.path.exists(temp_pdf_path):
                os.remove(temp_pdf_path)

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(port=5000)