import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';

const DocumentSummarizer = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Check file type
    const validTypes = ['application/pdf', 'text/plain'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or text file');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/summarize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setSummary(data.summary);
      setLanguage(data.language);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Legal Document Summarizer
          </h1>
          
          {/* Upload Section */}
          <div className="mt-8">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-white">
              <div className="mb-4">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.txt"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              {file && (
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <FileText className="mr-2 h-4 w-4" />
                  {file.name}
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Summarize Document'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Results Section */}
          {summary && (
            <div className="mt-8 bg-white shadow rounded-lg p-6 text-left">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Summary</h2>
              <p className="text-sm text-gray-600 mb-4">
                Detected Language: {language}
              </p>
              <div className="prose max-w-none">
                <p className="text-gray-800">{summary}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentSummarizer;