import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/users/profile');
      setProfile(response.data);
    } catch (error) {
      setError('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Profile</h1>
      </div>

      <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <h3>Personal Information</h3>
            <div style={{ marginTop: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <strong>Name:</strong> {profile?.name}
                {profile?.isVerified && <span className="verified-badge"> ✓ Verified</span>}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Email:</strong> {profile?.email}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>User Type:</strong> {profile?.userType}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Verification Status:</strong> 
                <span style={{ color: profile?.isVerified ? '#27ae60' : '#e74c3c', marginLeft: '10px' }}>
                  {profile?.isVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Member Since:</strong> {new Date(profile?.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div>
            <h3>Account Statistics</h3>
            <div style={{ marginTop: '20px' }}>
              {user?.userType === 'user' && (
                <>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Total Rentals:</strong> {profile?.rentHistory?.length || 0}
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Community Members:</strong> {profile?.community?.length || 0}
                  </div>
                </>
              )}
              <div style={{ marginBottom: '15px' }}>
                <strong>Account Status:</strong> 
                <span style={{ color: '#27ae60', marginLeft: '10px' }}>Active</span>
              </div>
            </div>
          </div>
        </div>

        {user?.userType === 'user' && profile?.community?.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h3>Community Members</h3>
            <div style={{ marginTop: '15px' }}>
              {profile.community.map(member => (
                <div 
                  key={member._id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '15px',
                    border: '1px solid #eee',
                    borderRadius: '5px',
                    marginBottom: '10px'
                  }}
                >
                  <div>
                    <strong>{member.name}</strong>
                    {member.isVerified && <span className="verified-badge"> ✓</span>}
                    <br />
                    <small>{member.email}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {user?.userType === 'user' && profile?.rentHistory?.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h3>Recent Rentals</h3>
            <div style={{ marginTop: '15px' }}>
              {profile.rentHistory.slice(-3).map((rental, index) => (
                <div 
                  key={index} 
                  style={{ 
                    padding: '15px',
                    border: '1px solid #eee',
                    borderRadius: '5px',
                    marginBottom: '10px'
                  }}
                >
                  <div><strong>{rental.title}</strong></div>
                  <div>Location: {rental.location}</div>
                  <div>Price: ${rental.price}</div>
                  <div>Date: {new Date(rental.rentDate).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
