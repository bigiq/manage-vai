import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    bedroomCount: '',
    bathroomCount: '',
    location: '',
    mobileNumber: '',
    price: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/posts', formData);
      setSuccess('Post created successfully!');
      setFormData({
        title: '',
        bedroomCount: '',
        bathroomCount: '',
        location: '',
        mobileNumber: '',
        price: ''
      });
      setShowCreateForm(false);
      fetchPosts();
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating post');
    }
  };

  const confirmRent = async (postId) => {
    try {
      await axios.post(`/api/posts/${postId}/confirm`);
      setSuccess('Rent confirmed successfully!');
      fetchPosts();
    } catch (error) {
      setError(error.response?.data?.message || 'Error confirming rent');
    }
  };

  const addToCommunity = async (postId) => {
    try {
      await axios.post(`/api/posts/${postId}/add-to-community`);
      setSuccess('User added to community successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding to community');
    }
  };

  const deletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/api/posts/${postId}`);
        setSuccess('Post deleted successfully!');
        fetchPosts();
      } catch (error) {
        setError(error.response?.data?.message || 'Error deleting post');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>House Rental Posts</h1>
        {user?.userType === 'user' && (
          <button 
            className="btn" 
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Make a Post'}
          </button>
        )}
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {showCreateForm && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3>Create New Post</h3>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={onChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label htmlFor="bedroomCount">Bedroom Count</label>
                <input
                  type="number"
                  id="bedroomCount"
                  name="bedroomCount"
                  value={formData.bedroomCount}
                  onChange={onChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bathroomCount">Bathroom Count</label>
                <input
                  type="number"
                  id="bathroomCount"
                  name="bathroomCount"
                  value={formData.bathroomCount}
                  onChange={onChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={onChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label htmlFor="mobileNumber">Mobile Number</label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={onChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn">Create Post</button>
          </form>
        </div>
      )}

      <div className="post-grid">
        {posts.map(post => (
          <div key={post._id} className="post-card">
            <h3>{post.title}</h3>
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
            </div>
            <div className="post-actions">
              {user?.userType === 'user' && (
                <>
                  <button 
                    className="btn btn-success" 
                    onClick={() => confirmRent(post._id)}
                  >
                    Confirm
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => addToCommunity(post._id)}
                  >
                    Add to Community
                  </button>
                </>
              )}
              {user?.userType === 'admin' && (
                <button 
                  className="btn btn-danger" 
                  onClick={() => deletePost(post._id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>No posts available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
