import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentSubmission = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const response = await axios.get('/api/verification/status');
      setVerificationStatus(response.data);
    } catch (error) {
      console.error('Error fetching verification status:', error);
    }
  };

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file only');
      e.target.value = '';
      return;
    }
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      e.target.value = '';
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('cv', file);

    try {
      await axios.post('/api/verification/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('CV submitted successfully for verification!');
      setFile(null);
      document.getElementById('cv-file').value = '';
      fetchVerificationStatus();
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting CV');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'approved': return '#27ae60';
      case 'rejected': return '#e74c3c';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Under Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Document Submission</h1>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Current Status */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3>Verification Status</h3>
          <div style={{ marginTop: '15px' }}>
            <p><strong>Account Status:</strong> 
              <span style={{ 
                color: verificationStatus?.isVerified ? '#27ae60' : '#e74c3c',
                marginLeft: '10px'
              }}>
                {verificationStatus?.isVerified ? 'Verified ✓' : 'Not Verified'}
              </span>
            </p>
            
            {verificationStatus?.hasRequest && (
              <p><strong>Submission Status:</strong> 
                <span style={{ 
                  color: getStatusColor(verificationStatus.requestStatus),
                  marginLeft: '10px'
                }}>
                  {getStatusText(verificationStatus.requestStatus)}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Submission Form */}
        {!verificationStatus?.isVerified && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
            <h3>Submit CV for Verification</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Upload your CV (PDF format only, max 5MB) to get verified. 
              Verified users get a blue tick next to their name.
            </p>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            {verificationStatus?.requestStatus === 'pending' ? (
              <div style={{ 
                background: '#fff3cd', 
                padding: '15px', 
                borderRadius: '5px', 
                border: '1px solid #ffeaa7' 
              }}>
                <p style={{ margin: 0, color: '#856404' }}>
                  ⏳ Your CV is currently under review. Please wait for admin approval.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="cv-file">
                    Choose CV File (PDF only)
                  </label>
                  <input
                    type="file"
                    id="cv-file"
                    accept=".pdf"
                    onChange={onFileChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px dashed #ddd',
                      borderRadius: '5px',
                      backgroundColor: '#fafafa'
                    }}
                  />
                  {file && (
                    <p style={{ marginTop: '10px', color: '#27ae60' }}>
                      ✓ Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="btn" 
                  disabled={loading || !file}
                  style={{ width: '100%' }}
                >
                  {loading ? 'Submitting...' : 'Submit CV for Verification'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Info Section */}
        <div style={{ 
          background: '#e8f4f8', 
          padding: '20px', 
          borderRadius: '10px', 
          marginTop: '20px' 
        }}>
          <h4>📋 Verification Guidelines</h4>
          <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
            <li>Only PDF files are accepted</li>
            <li>Maximum file size: 5MB</li>
            <li>CV should include your professional information</li>
            <li>Admin will review and approve within 24-48 hours</li>
            <li>Verified users get a blue checkmark ✓</li>
            <li>Verification helps build trust in the community</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DocumentSubmission;
