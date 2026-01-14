import React, { useState } from 'react';
import { Upload, Search, FileSpreadsheet, GraduationCap, Building2, MapPin, DollarSign, Home, ChevronRight, Sparkles } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [studentData, setStudentData] = useState(null); 
  const [uploadedFileName, setUploadedFileName] = useState(''); 
  const [collegeList, setCollegeList] = useState('');

  const categories = [
    { id: 'undergraduate', name: 'Undergraduate', icon: GraduationCap },
    { id: 'graduate', name: 'Graduate', icon: Building2 },
    { id: 'transfer', name: 'Transfer', icon: FileSpreadsheet }
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('http://127.0.0.1:5001/api/upload', { 
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStudentData(data.studentData); 
        setUploadedFileName(data.fileName); 
        console.log('Student data:', data.studentData);
      }
      
      setUploading(false);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error.message);
      setUploading(false);
    }
  };
  
  const handleProceed = async () => {
    setProcessing(true);
    
    try {
      const response = await fetch('http://127.0.0.1:5001/api/colleges/generate', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentData })
      });
      
      const data = await response.json();
      setCollegeList(data.collegeList);
      console.log('College list:', data.collegeList);
      
      setProcessing(false);
      setStep(3);
    } catch (error) {
      console.error('Processing failed:', error);
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Collegio</h1>
                <p className="text-sm text-gray-500">AI-powered college search and application management</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= num 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {num}
                </div>
                <span className={`mt-2 text-sm font-medium ${step >= num ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {num === 1 ? 'Setup' : num === 2 ? 'Process' : 'Export'}
                </span>
              </div>
              {num < 3 && (
                <div className={`flex-1 h-1 mx-4 rounded transition-all ${
                  step > num ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Category Selection & Upload */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Select Your Category</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                        category === cat.id
                          ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                      }`}
                    >
                      <Icon className={`w-12 h-12 mx-auto mb-4 ${
                        category === cat.id ? 'text-indigo-600' : 'text-gray-400'
                      }`} />
                      <h3 className={`text-lg font-semibold ${
                        category === cat.id ? 'text-indigo-900' : 'text-gray-700'
                      }`}>
                        {cat.name}
                      </h3>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Your Information</h3>
                <p className="text-gray-600 mb-6">Upload your resume, transcripts, or any relevant documents</p>
                
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-indigo-400 transition-all cursor-pointer bg-gray-50 hover:bg-indigo-50">
                    <Upload className={`w-16 h-16 mx-auto mb-4 ${uploading ? 'text-indigo-600 animate-bounce' : 'text-gray-400'}`} />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-500">PDF, DOCX, TXT up to 10MB</p>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.docx,.txt"
                    />
                  </div>
                </label>

                {/* Upload Success Display */}
                {uploadedFileName && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <p className="font-semibold text-green-900">File Uploaded Successfully!</p>
                    </div>
                    <p className="text-sm text-green-700 mb-3">📄 {uploadedFileName}</p>
                    
                    {studentData && (
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <p className="font-semibold text-gray-900 mb-3">Extracted Information:</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">GPA:</span>
                            <span className="ml-2 font-medium text-gray-900">{studentData.gpa || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">SAT:</span>
                            <span className="ml-2 font-medium text-gray-900">{studentData.sat || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">ACT:</span>
                            <span className="ml-2 font-medium text-gray-900">{studentData.act || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Major:</span>
                            <span className="ml-2 font-medium text-gray-900">{studentData.major || 'N/A'}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500">Location:</span>
                            <span className="ml-2 font-medium text-gray-900">{studentData.location || 'N/A'}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500">Extracurriculars:</span>
                            <span className="ml-2 font-medium text-gray-900">{studentData.extracurriculars || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!category || !uploadedFileName}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: AI Processing */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Analysis & College Matching</h2>
              
              <div className="space-y-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-indigo-100">
                  <div className="flex items-start space-x-4">
                    <Search className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Step 1: Understanding Your Profile</h3>
                      <p className="text-gray-600 text-sm">GPT-4o analyzes your resume and generates targeted search queries</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-start space-x-4">
                    <Building2 className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Step 2: Searching Universities</h3>
                      <p className="text-gray-600 text-sm">Google Search API retrieves comprehensive data for matching schools</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-pink-100">
                  <div className="flex items-start space-x-4">
                    <Sparkles className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Step 3: Intelligent Filtering</h3>
                      <p className="text-gray-600 text-sm">AI validates results and categorizes schools as Reach, Target, or Safety</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-6 border border-red-100">
                  <div className="flex items-start space-x-4">
                    <FileSpreadsheet className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Step 4: Creating Your Spreadsheet</h3>
                      <p className="text-gray-600 text-sm">Perplexity API enriches data with majors, costs, dorms, and campus insights</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Your Spreadsheet Will Include:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { icon: GraduationCap, label: 'Major Programs' },
                    { icon: DollarSign, label: 'Living Costs' },
                    { icon: Home, label: 'Dorm Quality' },
                    { icon: MapPin, label: 'Location' },
                    { icon: Building2, label: 'Campus Facilities' },
                    { icon: Search, label: 'Study Spots' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-gray-200">
                      <item.icon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleProceed}
                  disabled={processing}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 flex items-center space-x-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Analysis</span>
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Export */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-4">
                  <FileSpreadsheet className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Your College List is Ready!</h2>
                <p className="text-gray-600">We've analyzed and created your personalized spreadsheet</p>
              </div>

              {/* Display College List */}
              {collegeList && (
                <div className="bg-gray-50 rounded-xl p-6 mb-8 max-h-96 overflow-y-auto">
                  <h3 className="font-semibold text-gray-900 mb-4">College Results:</h3>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{collegeList}</pre>
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-indigo-100">
                <h3 className="font-semibold text-gray-900 mb-4">Spreadsheet Features:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Filterable columns for custom views (hide/show specific data)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">In-state vs out-of-state filters</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Categorized as Reach, Target, and Safety schools</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Individual school pages with campus photos and insights</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Best study spots and popular campus locations</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Major-specific information and facilities</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  <FileSpreadsheet className="w-6 h-6" />
                  <span>Download Spreadsheet</span>
                </button>
                <button className="flex items-center justify-center space-x-3 p-4 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all">
                  <Search className="w-6 h-6" />
                  <span>View in Google Sheets</span>
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    setStep(1);
                    setUploadedFileName('');
                    setStudentData(null);
                    setCollegeList('');
                  }}
                  className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                >
                  Create Another List
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            Powered by GPT-4o mini, Google Search API, and Perplexity API
          </p>
        </div>
      </footer>
    </div>
  );
}