import { motion } from 'framer-motion'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const FilterBar = ({ 
  activeFilters = {}, 
  onFilterChange,
  totalTasks = 0,
  completedTasks = 0,
  className = '' 
}) => {
  const filters = [
    { key: 'all', label: 'All Tasks', count: totalTasks },
    { key: 'pending', label: 'Pending', count: totalTasks - completedTasks },
    { key: 'completed', label: 'Completed', count: completedTasks },
  ]

  const priorityFilters = [
    { key: 'high', label: 'High Priority', variant: 'high' },
    { key: 'medium', label: 'Medium Priority', variant: 'medium' },
    { key: 'low', label: 'Low Priority', variant: 'low' },
  ]

  const handleFilterClick = (filterKey) => {
    onFilterChange?.(filterKey)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-4 ${className}`}
    >
      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            variant={activeFilters.status === filter.key ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleFilterClick(filter.key)}
            className="flex items-center space-x-2"
          >
            <span>{filter.label}</span>
            {filter.count > 0 && (
              <Badge size="sm" variant={activeFilters.status === filter.key ? 'default' : 'primary'}>
                {filter.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Priority Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-600 flex items-center mr-2">
          Priority:
        </span>
        {priorityFilters.map((filter) => (
          <Button
            key={filter.key}
            variant={activeFilters.priority === filter.key ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onFilterChange?.('priority', filter.key)}
          >
            <Badge variant={filter.variant} size="sm" className="mr-2">
              {filter.key.toUpperCase()}
            </Badge>
            {filter.label.split(' ')[0]}
          </Button>
        ))}
        
        {activeFilters.priority && (
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={() => onFilterChange?.('priority', null)}
            className="text-gray-400 hover:text-gray-600"
          >
            Clear
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default FilterBar