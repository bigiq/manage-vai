import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import HousePostForm from './components/posts/HousePostForm';
import CommunityPage from './components/community/CommunityPage'; // Import the new component
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="main-nav">
          {/* We'll add logic later to show/hide links based on auth status */}
          <Link to="/">Home</Link>
          <Link to="/post-rent">Post for Rent</Link>
          <Link to="/community">Communities</Link> {/* Add new link */}
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post-rent" element={<HousePostForm />} />
            <Route path="/community" element={<CommunityPage />} /> {/* Add the new route */}
            {/* We'll make a proper home page later */}
            <Route path="/" element={<h2>Welcome to Manage VAI!</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
