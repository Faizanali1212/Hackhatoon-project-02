import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from '../pages/register'
import LoginPage from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard'
import PublicAsset from '../pages/PubliceAssest.jsx'
import Home from '../pages/Home'

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/public-assets" element={<PublicAsset />} />
      <Route path="/asset/:assetId" element={<PublicAsset />} />
    </Routes>
  )
}

export default Routing