import { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search tasks...",
  showAddButton = false,
  onAdd,
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleClear = () => {
    setSearchQuery('')
    onSearch?.('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center space-x-4 ${className}`}
    >
      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearch}
          icon="Search"
          iconPosition="left"
          className="pr-10"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="sr-only">Clear search</span>
            ✕
          </button>
        )}
      </div>
      
      {showAddButton && (
        <Button
          variant="primary"
          icon="Plus"
          onClick={onAdd}
          className="flex-shrink-0"
        >
          Add Task
        </Button>
      )}
    </motion.div>
  )
}

export default SearchBar