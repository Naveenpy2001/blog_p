import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { 
  Heart, 
  MessageCircle, 
  Calendar, 
  User,
  Edit,
  Trash2
} from 'lucide-react'

const PostCard = ({ post, onPostUpdate, onPostDelete }) => {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(post.is_liked)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [loading, setLoading] = useState(false)

  const handleLike = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to like posts')
      return
    }

    setLoading(true)
    try {
      const response = await api.post(`/posts/${post.id}/like/`)
      setIsLiked(response.data.is_liked)
      setLikesCount(response.data.likes_count)
    } catch (error) {
      toast.error('Failed to like post')
      console.error(error);
      
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      await api.delete(`/posts/${post.id}/`)
      toast.success('Post deleted successfully')
      onPostDelete && onPostDelete(post.id)
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  const canEdit = user && user.id === post.author.id

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {post.author.profile_picture ? (
            <img
              src={`http://127.0.0.1:8000${post.author.profile_picture}`}
              alt={post.author.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-600" />
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900">
              {post.author.username}
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar size={14} className="mr-1" />
              {new Date(post.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center space-x-2">
            <Link
              to={`/posts/${post.id}/edit`}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit size={16} />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Post Content */}
      <Link to={`/posts/${post.id}`} className="block">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
          {post.title}
        </h2>

        {post.image && (
          <div className="mb-4">
            <img
              src={`${post.image}`}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <p className="text-gray-700 mb-4 line-clamp-3">
          {post.caption}
        </p>
      </Link>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
              isLiked
                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Heart 
              size={18} 
              className={isLiked ? 'fill-current' : ''} 
            />
            <span>{likesCount}</span>
          </button>

          <Link
            to={`/posts/${post.id}`}
            className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <MessageCircle size={18} />
            <span>{post.comments_count}</span>
          </Link>
        </div>

        <Link
          to={`/posts/${post.id}`}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Read More
        </Link>
      </div>
    </div>
  )
}

export default PostCard;