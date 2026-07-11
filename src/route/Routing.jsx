import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Register from '../pages/register'
import LoginPage from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard'
import PublicAsset from '../pages/PubliceAssest'
import Home from '../pages/Home'

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/public-assets" element={<PublicAsset />} />
      
      {/* Dynamic exact route path for QR access */}
      <Route path="/asset/:assetId" element={<PublicAsset />} />
      
      {/* Catch-all route for safe fallback */}
      <Route path="*" element={<Navigate to="/public-assets" replace />} />
    </Routes>
  )
}

export default Routing