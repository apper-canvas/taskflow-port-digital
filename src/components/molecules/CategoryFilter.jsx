import { motion } from 'framer-motion'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const CategoryFilter = ({ categories, activeCategory, onCategoryChange, taskCounts, onAddCategory }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
        <Badge variant="secondary" className="bg-gray-50">
          {categories.length}
        </Badge>
      </div>

      <div className="space-y-2">
        {/* All Categories Option */}
        <button
          onClick={() => onCategoryChange('all')}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              activeCategory === 'all' ? 'bg-white' : 'bg-gradient-to-r from-purple-500 to-indigo-600'
            }`} />
            <span className="font-medium">All Categories</span>
          </div>
          <Badge 
            variant={activeCategory === 'all' ? 'primary' : 'secondary'}
            className={activeCategory === 'all' ? 'bg-white/20 text-white' : ''}
          >
            {taskCounts.all || 0}
          </Badge>
        </button>

        {/* Individual Categories */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              activeCategory === category.id
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
<span className="font-medium">{category.name}</span>
            </div>
            <Badge 
              variant={activeCategory === category.id ? 'primary' : 'secondary'}
              className={activeCategory === category.id ? 'bg-white/20 text-white' : ''}
            >
              {taskCounts[category.id] || 0}
            </Badge>
          </button>
        ))}
      </div>

      {/* Add Category Button */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddCategory}
          className="w-full justify-start text-gray-600 hover:text-purple-600 hover:bg-purple-50"
          icon="Plus"
        >
          Add Category
        </Button>
      </div>
    </motion.div>
  )
}

export default CategoryFilter