import { motion } from 'framer-motion'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const CategoryFilter = ({ 
  categories = [], 
  activeCategory, 
  onCategoryChange,
  taskCounts = {},
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`space-y-2 ${className}`}
    >
      <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
        Categories
      </h3>
      
      {/* All Tasks */}
      <Button
        variant={!activeCategory ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onCategoryChange?.(null)}
        className="w-full justify-between text-left"
      >
        <div className="flex items-center space-x-2">
          <ApperIcon name="Inbox" size={16} />
          <span>All Tasks</span>
        </div>
        <Badge size="sm" variant={!activeCategory ? 'default' : 'primary'}>
          {taskCounts.all || 0}
        </Badge>
      </Button>

      {/* Categories */}
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onCategoryChange?.(category.id)}
          className="w-full justify-between text-left"
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name={category.icon} size={16} />
            <span>{category.name}</span>
          </div>
          <Badge 
            size="sm" 
            variant={activeCategory === category.id ? 'default' : 'primary'}
          >
            {taskCounts[category.id] || 0}
          </Badge>
        </Button>
      ))}
    </motion.div>
  )
}

export default CategoryFilter