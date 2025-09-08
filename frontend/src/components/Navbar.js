import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={navStyle}>
      <div style={navContainer}>
        <Link to="/home" style={logoStyle}>
          MANAGE VAI
        </Link>
        
        <div style={navLinks}>
          <Link 
            to="/home" 
            style={{...linkStyle, ...(isActive('/home') ? activeLinkStyle : {})}}
          >
            Home
          </Link>
          
          <Link 
            to="/compare" 
            style={{...linkStyle, ...(isActive('/compare') ? activeLinkStyle : {})}}
          >
            Compare
          </Link>

          {user?.userType === 'user' && (
            <>
              <Link 
                to="/rent-history" 
                style={{...linkStyle, ...(isActive('/rent-history') ? activeLinkStyle : {})}}
              >
                Rent Profile
              </Link>
              
              <Link 
                to="/community" 
                style={{...linkStyle, ...(isActive('/community') ? activeLinkStyle : {})}}
              >
                Community
              </Link>
              
              <Link 
                to="/document-submission" 
                style={{...linkStyle, ...(isActive('/document-submission') ? activeLinkStyle : {})}}
              >
                Document Submission
              </Link>
            </>
          )}

          {user?.userType === 'admin' && (
            <Link 
              to="/document-verification" 
              style={{...linkStyle, ...(isActive('/document-verification') ? activeLinkStyle : {})}}
            >
              Document Verification
            </Link>
          )}

          <Link 
            to="/profile" 
            style={{...linkStyle, ...(isActive('/profile') ? activeLinkStyle : {})}}
          >
            Profile
          </Link>

          <button onClick={logout} style={logoutButtonStyle}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

const navStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '1rem 0',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};

const navContainer = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 20px'
};

const logoStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: 'white',
  textDecoration: 'none'
};

const navLinks = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px'
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: '8px 16px',
  borderRadius: '5px',
  transition: 'background-color 0.3s'
};

const activeLinkStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)'
};

const logoutButtonStyle = {
  background: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px'
};

export default Navbar;
