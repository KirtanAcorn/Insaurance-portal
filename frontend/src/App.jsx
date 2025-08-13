// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <Router>
      
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: { background: '#4caf50', color: '#fff' },
          },
          error: {
            style: { background: '#f44336', color: '#fff' },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  );
};

export default App;
