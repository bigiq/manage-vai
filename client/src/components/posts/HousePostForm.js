import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HousePostForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    rent: '',
    bedrooms: '',
    bathrooms: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { title, description, address, city, rent, bedrooms, bathrooms } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!title || !rent || !address || !city || !bedrooms || !bathrooms) {
        setError('Please fill out all required fields.');
        return;
    }

    // Set token in headers before making the request
    const token = localStorage.getItem('token');
    if (!token) {
        setError('You must be logged in to create a post.');
        navigate('/login');
        return;
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    };

    try {
      const res = await axios.post('/api/posts', formData, config);
      console.log('Post created:', res.data);
      alert('Your house rent post has been created successfully!');
      // Redirect to a dashboard or the new post's page in the future
      navigate('/');
    } catch (err) {
      console.error(err.response.data);
      setError(err.response.data.msg || 'Failed to create post. Please try again.');
    }
  };

  return (
    <div className="form-container" style={{maxWidth: '600px'}}>
      <h2>Create a House Rent Post</h2>
      <p>Fill out the details below to list your property.</p>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Post Title *</label>
          <input type="text" name="title" value={title} onChange={onChange} placeholder="e.g., 2 Bedroom Apartment in Mirpur" />
        </div>
        <div className="form-group">
          <label>Full Address *</label>
          <input type="text" name="address" value={address} onChange={onChange} placeholder="e.g., House 123, Road 4, Section 10" />
        </div>
        <div className="form-group">
          <label>City *</label>
          <input type="text" name="city" value={city} onChange={onChange} placeholder="e.g., Dhaka" />
        </div>
         <div className="form-group">
          <label>Monthly Rent (BDT) *</label>
          <input type="number" name="rent" value={rent} onChange={onChange} placeholder="e.g., 25000" />
        </div>
        <div className="form-group">
          <label>Number of Bedrooms *</label>
          <input type="number" name="bedrooms" value={bedrooms} onChange={onChange} placeholder="e.g., 2" />
        </div>
        <div className="form-group">
          <label>Number of Bathrooms *</label>
          <input type="number" name="bathrooms" value={bathrooms} onChange={onChange} placeholder="e.g., 2" />
        </div>
        <div className="form-group">
          <label>Detailed Description</label>
          <textarea name="description" value={description} onChange={onChange} rows="5" placeholder="Describe your property, nearby amenities, rules, etc."></textarea>
        </div>

        {error && <p className="error-message">{error}</p>}
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default HousePostForm;
