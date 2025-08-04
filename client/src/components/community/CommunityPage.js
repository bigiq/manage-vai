import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CommunityPage = () => {
  const [communities, setCommunities] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await axios.get('/api/community');
        setCommunities(res.data);
      } catch (err) {
        console.error('Failed to fetch communities:', err);
        setError('Could not load communities.');
      }
    };
    fetchCommunities();
  }, []);

  const { name, description } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    setError('');
    if (!token) {
      setError('Please log in to create a community.');
      navigate('/login');
      return;
    }
    try {
      const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
      const res = await axios.post('/api/community', formData, config);
      setCommunities([res.data, ...communities]); // Add new community to the top of the list
      setFormData({ name: '', description: '' }); // Clear form
    } catch (err) {
      setError(err.response.data.msg || 'Failed to create community.');
    }
  };

  const handleJoinCommunity = async (id) => {
    setError('');
    if (!token) {
        setError('Please log in to join a community.');
        navigate('/login');
        return;
    }
    try {
        const config = { headers: { 'x-auth-token': token } };
        await axios.put(`/api/community/join/${id}`, {}, config);
        alert('Successfully joined community!');
        // You could update the UI to show the user is a member
    } catch (err) {
        setError(err.response.data.msg || 'Failed to join community.');
    }
  };

  return (
    <div className="community-page-container">
      <div className="create-community-form form-container">
        <h3>Create a New Community</h3>
        <form onSubmit={handleCreateCommunity}>
          <div className="form-group">
            <input type="text" name="name" value={name} onChange={onChange} placeholder="Community Name" required />
          </div>
          <div className="form-group">
            <textarea name="description" value={description} onChange={onChange} placeholder="What is this community about?" required />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Create Community</button>
        </form>
      </div>

      <div className="community-list">
        <h2>All Communities</h2>
        {communities.length > 0 ? (
          communities.map((community) => (
            <div key={community._id} className="community-card">
              <h4>{community.name}</h4>
              <p>{community.description}</p>
              <div className="community-meta">
                <span>Created by: {community.creator ? community.creator.name : 'Unknown'}</span>
                <span>Members: {community.members.length}</span>
              </div>
              <button onClick={() => handleJoinCommunity(community._id)} className="join-btn">Join</button>
            </div>
          ))
        ) : (
          <p>No communities found. Why not create one?</p>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
