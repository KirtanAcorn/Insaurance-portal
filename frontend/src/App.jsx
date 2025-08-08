// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import UserManagement from './pages/UserManagement';
import TestPage from './pages/TestPage';


const App = () => {
  return (
    <Router>
      <Routes>

        <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: { background: '#4caf50', color: '#fff' },
          },
          error: {
            style: { background: '#f44336', color: '#fff' },
          },
        }}
      />
      
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<UserManagement/>} />
        <Route path="/test" element={<TestPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
