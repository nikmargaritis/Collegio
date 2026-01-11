const express = require('express');
const router = express.Router();
const { generateCollegeList } = require('../services/gptService');

router.post('/generate', async (req, res) => {
  try {
    const { studentData } = req.body;
    
    if (!studentData) {
      return res.status(400).json({ error: 'Missing studentData' });
    }

    const collegeList = await generateCollegeList(studentData);
    
    res.json({
      success: true,
      collegeList: collegeList,
      rawData: studentData
    });
  } catch (error) {
    console.error('College generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;