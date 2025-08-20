import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import PostCard from '../components/PostCard'
import SearchBar from '../components/SearchBar'
import { PlusCircle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

const Home = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [pagination, setPagination] = useState({
    next: null,
    previous: null,
    count: 0
  })

  const fetchPosts = async (params = {}) => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        ...params,
        ...(searchQuery && { search: searchQuery }),
        ...filters
      })

      const response = await api.get(`/posts/?${queryParams}`)
      setPosts(response.data.results)
      setPagination({
        next: response.data.next,
        previous: response.data.previous,
        count: response.data.count
      })
    } catch (error) {
      toast.error('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [searchQuery, filters])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
  }

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(post => post.id !== postId))
  }

  const loadMore = async () => {
    if (!pagination.next) return

    try {
      const response = await api.get(pagination.next)
      setPosts(prev => [...prev, ...response.data.results])
      setPagination({
        next: response.data.next,
        previous: response.data.previous,
        count: response.data.count
      })
    } catch (error) {
      toast.error('Failed to load more posts')
    }
  }

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to BlogApp
          </h1>
          <p className="text-gray-600 mt-2">
            Discover amazing stories and share your thoughts
          </p>
        </div>

        {user && (
          <Link
            to="/create-post"
            className="btn-primary flex items-center space-x-2"
          >
            <PlusCircle size={20} />
            <span>Create Post</span>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <SearchBar onSearch={handleSearch} onFilter={handleFilter} />

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostDelete={handlePostDelete}
            />
          ))}

          {/* Load More Button */}
          {pagination.next && (
            <div className="text-center pt-8">
              <button
                onClick={loadMore}
                className="btn-secondary flex items-center space-x-2 mx-auto"
              >
                <RefreshCw size={18} />
                <span>Load More Posts</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <PlusCircle size={64} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No posts found</h3>
            <p>Be the first to share your story!</p>
          </div>
          {user && (
            <Link to="/create-post" className="btn-primary mt-4 inline-flex items-center space-x-2">
              <PlusCircle size={18} />
              <span>Create Your First Post</span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default Home