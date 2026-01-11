const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateCollegeList(studentData) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a college admissions expert with access to comprehensive college data. Provide accurate, current information about colleges."
      },
      {
        role: "user",
        content: `Based on this student profile, generate a college list with 5 reach, 5 target, and 5 safety schools.

Student Profile:
- GPA: ${studentData.gpa || 'N/A'}
- SAT: ${studentData.sat || 'N/A'}
- ACT: ${studentData.act || 'N/A'}
- Major Interest: ${studentData.major || 'N/A'}
- Location Preference: ${studentData.location || 'Any'}
- Extracurriculars: ${studentData.extracurriculars || 'N/A'}
- Awards/Honors: ${studentData.awards || 'N/A'}
- AP/IB Courses: ${studentData.advancedCourses || 'N/A'}

Output a list of colleges in the following format with each college separated by a new line and no column labels (5 reach, 5 target, 5 safety). If the resume is missing info put NA and pick all sources:

College | Major | School Ranking | School Major Ranking | Avg Net Cost | Location | Avg. Accept Rt. | Major accept Rt. | 25%SAT | 75%SAT | Your SAT (User's SAT compared to university's average SAT, output: Poor, Average, Excellent) | Your Academics (User's Academics compared to university's average Academics, output: Poor, Average, Excellent) | Your ECLs (User's Extracurriculars compared to university's average Extracurriculars, output: Poor, Average, Excellent)

Start with REACH schools, then TARGET schools, then SAFETY schools. Label each section.`
      }
    ],
    temperature: 0.7,
    max_tokens: 3000
  });

  return response.choices[0].message.content;
}

async function parseResumeWithGPT(resumeText) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert at extracting student information from resumes and transcripts."
      },
      {
        role: "user",
        content: `Extract the following information from this resume/transcript and return ONLY valid JSON:

Resume/Transcript:
${resumeText}

Return in this exact format:
{
  "gpa": "3.8",
  "sat": "1450",
  "act": "32",
  "major": "Computer Science",
  "location": "California",
  "extracurriculars": "Robotics Club President, Math Team Captain, Volunteer Tutor",
  "awards": "National Merit Scholar, AP Scholar",
  "advancedCourses": "AP Calculus BC, AP Physics C, AP Computer Science A"
}

If any field is not found, use "N/A".`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1000
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { 
  generateCollegeList,
  parseResumeWithGPT
};