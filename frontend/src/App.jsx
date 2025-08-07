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
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<UserManagement/>} />
        <Route path="/test" element={<TestPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
