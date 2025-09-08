import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Compare from './pages/Compare';
import Profile from './pages/Profile';
import RentHistory from './pages/RentHistory';
import Community from './pages/Community';
import DocumentSubmission from './pages/DocumentSubmission';
import DocumentVerification from './pages/DocumentVerification';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/home" />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to="/home" />} 
        />
        <Route 
          path="/home" 
          element={user ? <Home /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/compare" 
          element={user ? <Compare /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={user ? <Profile /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/rent-history" 
          element={user && user.userType === 'user' ? <RentHistory /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/community" 
          element={user && user.userType === 'user' ? <Community /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/document-submission" 
          element={user && user.userType === 'user' ? <DocumentSubmission /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/document-verification" 
          element={user && user.userType === 'admin' ? <DocumentVerification /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
      </Routes>
    </>
  );
}

export default App;
