import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Edit, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await updateProfile(formData)
    
    if (result.success) {
      setIsEditing(false)
    }
    
    setLoading(false)
  }

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      bio: user?.bio || ''
    })
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Edit size={18} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-6 mb-8">
          {user.profile_picture ? (
            <img
              src={`http://127.0.0.1:8000${user.profile_picture}`}
              alt={user.username}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={32} className="text-gray-600" />
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user.username}
            </h2>
            <p className="text-gray-600 flex items-center mt-1">
              <Mail size={16} className="mr-2" />
              {user.email}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Member since {new Date(user.date_joined).toLocaleDateString()}
            </p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="input-field resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                <Save size={18} />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary flex items-center space-x-2"
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Bio</h3>
              <p className="text-gray-900">
                {user.bio || 'No bio available'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {user.posts_count || 0}
                  </div>
                  <div className="text-sm text-blue-600">Posts</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-green-600">Likes Received</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-purple-600">Comments Made</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile