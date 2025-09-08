import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Community = () => {
  const [communityMembers, setCommunityMembers] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      const [membersResponse, postsResponse] = await Promise.all([
        axios.get('/api/users/community'),
        axios.get('/api/posts/community')
      ]);
      
      setCommunityMembers(membersResponse.data);
      setCommunityPosts(postsResponse.data);
    } catch (error) {
      setError('Error fetching community data');
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (userId) => {
    if (window.confirm('Are you sure you want to remove this member from your community?')) {
      try {
        await axios.delete(`/api/users/community/${userId}`);
        setSuccess('Member removed from community');
        fetchCommunityData();
      } catch (error) {
        setError('Error removing member');
      }
    }
  };

  const confirmRent = async (postId) => {
    try {
      await axios.post(`/api/posts/${postId}/confirm`);
      setSuccess('Rent confirmed successfully!');
      fetchCommunityData();
    } catch (error) {
      setError(error.response?.data?.message || 'Error confirming rent');
    }
  };

  if (loading) {
    return <div className="loading">Loading community...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Community</h1>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        <div>
          <div className="community-list">
            <h3>Community Members ({communityMembers.length})</h3>
            {communityMembers.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                No community members yet. Add members by clicking "Add to Community" on posts!
              </p>
            ) : (
              <div style={{ marginTop: '20px' }}>
                {communityMembers.map(member => (
                  <div key={member._id} className="community-item">
                    <div>
                      <strong>{member.name}</strong>
                      {member.isVerified && <span className="verified-badge"> ✓</span>}
                      <br />
                      <small>{member.email}</small>
                    </div>
                    <button 
                      className="btn btn-danger" 
                      style={{ fontSize: '12px', padding: '5px 10px' }}
                      onClick={() => removeMember(member._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3>Posts from Community ({communityPosts.length})</h3>
          {communityPosts.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
              <p>No posts from community members yet.</p>
              <p>Posts from your community members will appear here!</p>
            </div>
          ) : (
            <div className="post-grid">
              {communityPosts.map(post => (
                <div key={post._id} className="post-card">
                  <h4>{post.title}</h4>
                  <div className="post-details">
                    <p><strong>Bedrooms:</strong> {post.bedroomCount}</p>
                    <p><strong>Bathrooms:</strong> {post.bathroomCount}</p>
                    <p><strong>Location:</strong> {post.location}</p>
                    <p><strong>Mobile:</strong> {post.mobileNumber}</p>
                    <p><strong>Price:</strong> ${post.price}</p>
                    <p>
                      <strong>Owner:</strong> {post.ownerName}
                      {post.owner?.isVerified && <span className="verified-badge"> ✓</span>}
                    </p>
                    <p><strong>Posted:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="post-actions">
                    <button 
                      className="btn btn-success" 
                      onClick={() => confirmRent(post._id)}
                    >
                      Confirm Rent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
