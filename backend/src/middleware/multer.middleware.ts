import multer from 'multer';

const storage = multer.memoryStorage();

export const singleUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB Limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',                                                        // .pdf
      'application/msword',                                                     // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      // Custom error message for clarity
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.') as any, false);
    }
  }
});