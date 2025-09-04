import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import PostDetail from './pages/PostDetail'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" /> : <Register />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/create-post" 
            element={user ? <CreatePost /> : <Navigate to="/login" />} 
          />
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App