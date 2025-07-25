import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* Login page */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Dashboard page */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Catch all unmatched routes */}
      <Route path="*" element={<div>404 Page Not Found</div>} />
    </Routes>
  );
};

export default App;
