import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { 
  Heart, 
  MessageCircle, 
  Calendar, 
  User, 
  Send,
  Edit,
  Trash2,
  ArrowLeft
} from 'lucide-react'

const PostDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${id}/`)
      setPost(response.data)
      console.log(response.data);
      
      setComments(response.data.comments)
      setIsLiked(response.data.is_liked)
      setLikesCount(response.data.likes_count)
    } catch (error) {
      toast.error('Failed to fetch post')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like posts')
      return
    }

    try {
      const response = await api.post(`/posts/${id}/like/`)
      setIsLiked(response.data.is_liked)
      setLikesCount(response.data.likes_count)
    } catch (error) {
      toast.error('Failed to like post')
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to comment')
      return
    }

    if (!newComment.trim()) return

    setCommentLoading(true)
    try {
      const response = await api.post(`/posts/${id}/comment/`, {
        content: newComment
      })
      setComments([response.data, ...comments])
      setNewComment('')
      toast.success('Comment added successfully!')
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setCommentLoading(false)
    }
  }

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      await api.delete(`/posts/${id}/`)
      toast.success('Post deleted successfully')
      navigate('/')
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    )
  }

  const canEdit = user && user.id === post.author.id

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Posts</span>
      </button>

      {/* Post Content */}
      <article className="card mb-6">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {post.author.profile_picture ? (
              <img
                src={`http://127.0.0.1:8000${post.author.profile_picture}`}
                alt={post.author.username}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <User size={24} className="text-gray-600" />
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900 text-lg">
                {post.author.username}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={14} className="mr-1" />
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {canEdit && (
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Edit size={18} />
              </button>
              <button
                onClick={handleDeletePost}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Post Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        {/* Post Image */}
        {post.image && (
          <div className="mb-6">
            <img
              src={`${post.image}`}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="prose max-w-none mb-6">
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
            {post.caption}
          </p>
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked
                  ? 'text-red-600 bg-red-50 hover:bg-red-100'
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <Heart 
                size={20} 
                className={isLiked ? 'fill-current' : ''} 
              />
              <span className="font-medium">{likesCount}</span>
              <span>{likesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>

            <div className="flex items-center space-x-2 text-gray-600">
              <MessageCircle size={20} />
              <span className="font-medium">{comments.length}</span>
              <span>{comments.length === 1 ? 'Comment' : 'Comments'}</span>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Comments ({comments.length})
        </h2>

        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="flex space-x-4">
              {user.profile_picture ? (
                <img
                  src={`http://127.0.0.1:8000${user.profile_picture}`}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-gray-600" />
                </div>
              )}
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    {newComment.length}/1000 characters
                  </span>
                  <button
                    type="submit"
                    disabled={commentLoading || !newComment.trim()}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Send size={16} />
                    <span>
                      {commentLoading ? 'Posting...' : 'Post Comment'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600 mb-2">
              Please login to join the conversation
            </p>
            <Link to="/login" className="btn-primary inline-flex">
              Login to Comment
            </Link>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                {comment.user.profile_picture ? (
                  <img
                    src={`http://127.0.0.1:8000${comment.user.profile_picture}`}
                    alt={comment.user.username}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-gray-600" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">
                        {comment.user.username}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostDetail;