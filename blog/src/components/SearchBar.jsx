import React, { useState, useEffect } from 'react'
import { Search, Filter, X } from 'lucide-react'

const SearchBar = ({ onSearch, onFilter }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    author: '',
    ordering: '-created_at'
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      onSearch(searchQuery)
    }, 500)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery, onSearch])

  useEffect(() => {
    onFilter(filters)
  }, [filters, onFilter])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      author: '',
      ordering: '-created_at'
    })
    setSearchQuery('')
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search posts by title, content, or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Filter size={18} />
          <span>Advanced Filters</span>
        </button>

        {(searchQuery || filters.author || filters.ordering !== '-created_at') && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
          >
            <X size={16} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              placeholder="Filter by author username"
              value={filters.author}
              onChange={(e) => handleFilterChange('author', e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={filters.ordering}
              onChange={(e) => handleFilterChange('ordering', e.target.value)}
              className="input-field"
            >
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="-title">Title Z-A</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar