import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentVerification = () => {
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    try {
      const response = await axios.get('/api/verification/requests');
      setVerificationRequests(response.data);
    } catch (error) {
      setError('Error fetching verification requests');
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (requestId) => {
    try {
      await axios.post(`/api/verification/approve/${requestId}`);
      setSuccess('User verified successfully!');
      fetchVerificationRequests();
    } catch (error) {
      setError(error.response?.data?.message || 'Error approving request');
    }
  };

  const deleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this verification request?')) {
      try {
        await axios.delete(`/api/verification/${requestId}`);
        setSuccess('Verification request deleted successfully!');
        fetchVerificationRequests();
      } catch (error) {
        setError(error.response?.data?.message || 'Error deleting request');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading verification requests...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Document Verification</h1>
        <span style={{ color: '#666' }}>
          {verificationRequests.length} pending requests
        </span>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {verificationRequests.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>No pending verification requests.</p>
        </div>
      ) : (
        <div>
          {verificationRequests.map(request => (
            <div key={request._id} className="verification-card">
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div>
                  <h4>{request.userName}</h4>
                  <p><strong>Email:</strong> {request.userEmail}</p>
                  <p><strong>Submitted:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> 
                    <span style={{ 
                      background: '#f39c12', 
                      color: 'white', 
                      padding: '3px 8px', 
                      borderRadius: '3px', 
                      fontSize: '12px',
                      marginLeft: '10px'
                    }}>
                      {request.status.toUpperCase()}
                    </span>
                  </p>
                  
                  <div style={{ marginTop: '15px' }}>
                    <p><strong>CV Document:</strong></p>
                    <a 
                      href={`http://localhost:5000/${request.cvPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        color: '#667eea', 
                        textDecoration: 'none',
                        border: '1px solid #667eea',
                        padding: '8px 12px',
                        borderRadius: '5px',
                        display: 'inline-block',
                        fontSize: '14px'
                      }}
                    >
                      📄 View CV (PDF)
                    </a>
                  </div>
                </div>

                <div>
                  <div className="verification-actions">
                    <button 
                      className="btn btn-success" 
                      onClick={() => approveRequest(request._id)}
                      style={{ width: '100%', marginBottom: '10px' }}
                    >
                      ✓ Approve & Verify User
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => deleteRequest(request._id)}
                      style={{ width: '100%' }}
                    >
                      ✕ Delete Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        background: '#e8f4f8', 
        padding: '20px', 
        borderRadius: '10px', 
        marginTop: '30px' 
      }}>
        <h4>🔒 Admin Guidelines</h4>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Review each CV carefully before approval</li>
          <li>Approved users will get a blue verification checkmark</li>
          <li>Delete requests that don't meet verification standards</li>
          <li>Click "View CV" to download and review the document</li>
          <li>Verification helps build trust in the platform</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentVerification;
