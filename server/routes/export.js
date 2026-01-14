const express = require('express');
const router = express.Router();
const { generateCollegeList } = require('../services/gptService');

// Endpoint that returns structured data for Excel export
router.post('/prepare', async (req, res) => {
  try {
    const { studentData } = req.body;
    
    if (!studentData) {
      return res.status(400).json({ error: 'Missing studentData' });
    }

    // Get the GPT response
    const collegeListString = await generateCollegeList(studentData);
    
    // Parse the string into structured array
    const colleges = parseCollegeString(collegeListString);
    
    res.json({
      success: true,
      colleges: colleges,
      totalCount: colleges.length
    });
  } catch (error) {
    console.error('Export preparation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to parse GPT string response into array of objects
function parseCollegeString(gptResponse) {
  const colleges = [];
  const lines = gptResponse.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip headers and section labels
    if (!trimmed || 
        trimmed.includes('College | Major') ||
        trimmed.toUpperCase().includes('REACH') ||
        trimmed.toUpperCase().includes('TARGET') ||
        trimmed.toUpperCase().includes('SAFETY')) {
      continue;
    }
    
    // Split by pipe and trim each value
    const columns = trimmed.split('|').map(col => col.trim());
    
    // Only add if we have a college name
    if (columns.length > 0 && columns[0]) {
      colleges.push({
        College: columns[0] || 'N/A',
        Major: columns[1] || 'N/A',
        SchoolRanking: columns[2] || 'N/A',
        MajorRanking: columns[3] || 'N/A',
        AvgNetCost: columns[4] || 'N/A',
        Location: columns[5] || 'N/A',
        AvgAcceptanceRate: columns[6] || 'N/A',
        MajorAcceptanceRate: columns[7] || 'N/A',
        SAT25: columns[8] || 'N/A',
        SAT75: columns[9] || 'N/A',
        YourSAT: columns[10] || 'N/A',
        YourAcademics: columns[11] || 'N/A',
        YourECL: columns[12] || 'N/A',
        AvgAid: columns[13] || 'N/A',
        Scholarship: columns[14] || 'N/A',
        DiningRanking: columns[15] || 'N/A',
        AvgLivingCost: columns[16] || 'N/A'
      });
    }
  }
  
  return colleges;
}

module.exports = router;