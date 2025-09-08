import React, { useState } from 'react';
import axios from 'axios';

const Compare = () => {
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');
  const [leftPost, setLeftPost] = useState(null);
  const [rightPost, setRightPost] = useState(null);
  const [leftResults, setLeftResults] = useState([]);
  const [rightResults, setRightResults] = useState([]);
  const [error, setError] = useState('');

  const searchPosts = async (title, side) => {
    if (!title.trim()) return;
    
    try {
      const response = await axios.get(`/api/posts/search?title=${title}`);
      const results = response.data;
      
      if (side === 'left') {
        setLeftResults(results);
      } else {
        setRightResults(results);
      }
      
      setError('');
    } catch (error) {
      setError('Error searching posts');
    }
  };

  const selectPost = (post, side) => {
    if (side === 'left') {
      setLeftPost(post);
      setLeftResults([]);
      setLeftSearch(post.title);
    } else {
      setRightPost(post);
      setRightResults([]);
      setRightSearch(post.title);
    }
  };

  const renderPostCard = (post) => {
    if (!post) {
      return (
        <div style={{ textAlign: 'center', color: '#666', padding: '50px' }}>
          Search for a post to compare
        </div>
      );
    }

    return (
      <div className="post-card">
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
      </div>
    );
  };

  const renderSearchResults = (results, side) => {
    if (results.length === 0) return null;

    return (
      <div style={{ marginTop: '10px', maxHeight: '200px', overflowY: 'auto' }}>
        {results.map(post => (
          <div 
            key={post._id} 
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              margin: '5px 0',
              cursor: 'pointer',
              backgroundColor: '#f9f9f9'
            }}
            onClick={() => selectPost(post, side)}
          >
            <strong>{post.title}</strong> - ${post.price}
            <br />
            <small>{post.location}</small>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Compare Properties</h1>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="compare-container">
        <div className="compare-section">
          <h3>Property 1</h3>
          <input
            type="text"
            className="search-input"
            placeholder="Search by title..."
            value={leftSearch}
            onChange={(e) => {
              setLeftSearch(e.target.value);
              if (e.target.value.length > 2) {
                searchPosts(e.target.value, 'left');
              } else {
                setLeftResults([]);
              }
            }}
          />
          {renderSearchResults(leftResults, 'left')}
          {renderPostCard(leftPost)}
        </div>

        <div className="compare-section">
          <h3>Property 2</h3>
          <input
            type="text"
            className="search-input"
            placeholder="Search by title..."
            value={rightSearch}
            onChange={(e) => {
              setRightSearch(e.target.value);
              if (e.target.value.length > 2) {
                searchPosts(e.target.value, 'right');
              } else {
                setRightResults([]);
              }
            }}
          />
          {renderSearchResults(rightResults, 'right')}
          {renderPostCard(rightPost)}
        </div>
      </div>

      {leftPost && rightPost && (
        <div style={{ marginTop: '30px', background: 'white', padding: '20px', borderRadius: '10px' }}>
          <h3>Comparison Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', textAlign: 'center' }}>
            <div><strong>Feature</strong></div>
            <div><strong>{leftPost.title}</strong></div>
            <div><strong>{rightPost.title}</strong></div>
            
            <div>Price</div>
            <div>${leftPost.price}</div>
            <div>${rightPost.price}</div>
            
            <div>Bedrooms</div>
            <div>{leftPost.bedroomCount}</div>
            <div>{rightPost.bedroomCount}</div>
            
            <div>Bathrooms</div>
            <div>{leftPost.bathroomCount}</div>
            <div>{rightPost.bathroomCount}</div>
            
            <div>Location</div>
            <div>{leftPost.location}</div>
            <div>{rightPost.location}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
