const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const { parseResumeWithGPT } = require('../services/gptService');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// For PDF parsing
const pdfParse = require('pdf-parse');

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let fileText = '';

    // Parse PDF
    if (file.mimetype === 'application/pdf') {
      const dataBuffer = await fs.readFile(file.path);
      const pdfData = await pdfParse(dataBuffer);
      fileText = pdfData.text;
    } 
    // Parse plain text
    else if (file.mimetype === 'text/plain') {
      fileText = await fs.readFile(file.path, 'utf8');
    }
    else {
      return res.status(400).json({ error: 'Unsupported file type. Use PDF or TXT.' });
    }

    // Use GPT to extract student data
    const studentData = await parseResumeWithGPT(fileText);

    // Clean up uploaded file
    await fs.unlink(file.path);

    res.json({ 
      success: true, 
      fileName: file.originalname,
      studentData: studentData
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;