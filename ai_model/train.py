import pandas as pd
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.ensemble import RandomForestClassifier
from scipy.sparse import hstack
import joblib
# import tensorflow as tf
# from tensorflow.keras import layers, models

stop_words = set(stopwords.words('english')) - {"no", "not", "without"}  # keep important negatives
lemmatizer = WordNetLemmatizer()
# Preprocessing Function
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

def extract_components(combined_text):
    # Regex to find everything between the markers << and >>
    # .dotall ensures it captures multi-line text
    matches = re.findall(r'<<(.*?)>>', combined_text, re.DOTALL)
    
    
    if len(matches) >= 2:
        return matches[0].strip(), matches[1].strip() # Returns (JD, Resume)
    return None, None

def extract_resume_sections(resume_text):
    text = str(resume_text).lower()

    sections = {
        "skills": "",
        "projects": "",
        "experience": "",
        "education": "",
        "achievements": "",
        "certifications": ""
    }

    section_headers = {
        "skills": r"(skills|technical skills|technologies|tools)",
        "projects": r"(projects|personal projects|academic projects)",
        "experience": r"(experience|work experience|internship|employment)",
        "education": r"(education|academic background)",
        "achievements": r"(achievements|awards|accomplishments)",
        "certifications": r"(certifications|certificates)"
    }

    for section, header_pattern in section_headers.items():
        pattern = (
            header_pattern +
            r"(.*?)(skills|technical skills|technologies|tools|projects|personal projects|academic projects|experience|work experience|internship|employment|education|academic background|achievements|awards|accomplishments|certifications|certificates|$)"
        )

        match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)

        if match:
            sections[section] = match.group(2).strip()

    return sections


def create_resume_jd_features(resume_text, job_description):
    sections = extract_resume_sections(resume_text)

    jd_clean = clean_text(job_description)

    skills = clean_text(sections.get("skills", ""))
    projects = clean_text(sections.get("projects", ""))
    experience = clean_text(sections.get("experience", ""))
    education = clean_text(sections.get("education", ""))
    achievements = clean_text(sections.get("achievements", ""))
    certifications = clean_text(sections.get("certifications", ""))

    final_text = f"""
    job_description {jd_clean}

    skills_match {skills} {jd_clean}
    projects_match {projects} {jd_clean}
    experience_match {experience} {jd_clean}
    education_match {education} {jd_clean}
    achievements_match {achievements} {jd_clean}
    certifications_match {certifications} {jd_clean}
    full_resume_match {clean_text(resume_text)} {jd_clean}
    """

    return clean_text(final_text)

def predict_resume_match(resume_text, job_description):
    final_text = create_resume_jd_features(resume_text, job_description)

    final_tfidf = vectorizer.transform([final_text])

    prediction = model.predict(final_tfidf)[0]
    probability = model.predict_proba(final_tfidf)[0][1]

    return {
        "result": "Good Fit" if prediction == 1 else "No Fit",
        "match_percentage": round(probability * 100, 2)
    }

def keyword_overlap(resume, jd):
    resume_words = set(str(resume).lower().split())
    jd_words = set(str(jd).lower().split())

    if len(jd_words) == 0:
        return 0

    return len(resume_words.intersection(jd_words)) / len(jd_words)


    # Apply the separation
# Load dataset (Assume 'resume_text', 'jd_text', and 'score' columns)
df = pd.read_parquet('train.parquet')


df[['job_description', 'resume_text']] = df['text'].apply(
    lambda x: pd.Series(extract_components(x))
)
df = df.dropna(subset=['job_description', 'resume_text'])

df['job_description'] = df['job_description'].apply(clean_text)
df['resume_text'] = df['resume_text'].apply(clean_text)

df['label'] = df['label'].str.strip().str.lower()
df["label_num"] = df["label"].map({
    "good fit": 1,
    "no fit": 0
})

# print(df['resume_text'].head())

# Drop rows with missing labels
df = df.dropna(subset=['label_num'])

# Convert to integer
df['label_num'] = df['label_num'].astype(int)

df["resume_jd"] = df.apply(
    lambda row: create_resume_jd_features(
        row["resume_text"],
        row["job_description"]
    ),
    axis=1
)


df["keyword_overlap"] = [
    keyword_overlap(resume, jd)
    for resume, jd in zip(df["resume_text"], df["job_description"])
]

df["resume_length"] = df["resume_text"].apply(lambda x: len(str(x).split()))
df["jd_length"] = df["job_description"].apply(lambda x: len(str(x).split()))

x = df['resume_jd']
y = df['label_num'].values

manual_features = df[[
    "keyword_overlap",
    "resume_length",
    "jd_length"
]].values
print(df.columns)
# print(df.head())
# print(df['label_num'].value_counts())
# print(df['label'].value_counts())

#train test splitting
x_train, x_test, y_train, y_test, manual_train, manual_test = train_test_split(x, y, manual_features, test_size=0.2, random_state=42, stratify=y)
# Initialize TF-IDF
vectorizer = TfidfVectorizer(
    max_features=50000,
    ngram_range=(1, 3),
    min_df=2,
    max_df=0.85,
    sublinear_tf=True,
    stop_words="english"
)

X_train_tfidf = vectorizer.fit_transform(x_train)
X_test_tfidf = vectorizer.transform(x_test)

X_train_final = hstack([X_train_tfidf, manual_train])
X_test_final = hstack([X_test_tfidf, manual_test])

# Model
model = RandomForestClassifier(
    n_estimators=1200,
    max_depth=None,
    min_samples_split=2,
    min_samples_leaf=1,
    max_features="sqrt",
    bootstrap=True,
    class_weight="balanced_subsample",
    random_state=42,
    n_jobs=-1
)

# Training
model.fit(X_train_tfidf, y_train)

# Prediction
y_pred = model.predict(X_test_tfidf)

# Evaluation
# print("Accuracy:", accuracy_score(y_test, y_pred))
# print(classification_report(y_test, y_pred))
# print(df["label_num"].value_counts(normalize=True))
joblib.dump(model, "resume_match_model.pkl")
joblib.dump(vectorizer, "tfidf_vectorizer.pkl")
# We fit on combined text to ensure the same vocabulary for both
# tfidf.fit(pd.concat([df['clean_resume'], df['clean_jd']]))