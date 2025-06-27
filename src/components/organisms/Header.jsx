import { motion } from 'framer-motion'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ 
  onSearch, 
  onAddTask,
  totalTasks = 0,
  completedTasks = 0,
  className = '' 
}) => {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border-b border-gray-100 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          {/* Logo and Stats */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="CheckSquare" size={24} className="text-white" />
              </div>
              
              <div>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-sm text-gray-600">
                  Organize and complete daily tasks
                </p>
              </div>
            </div>

            {/* Stats */}
            {totalTasks > 0 && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 relative">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155 A 15.9155 15.9155 0 0 1 18 2.0845"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155 A 15.9155 15.9155 0 0 1 18 2.0845"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        strokeDasharray={`${completionRate}, 100`}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#5B4FE9" />
                          <stop offset="100%" stopColor="#8B7FF0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{completionRate}%</span>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {completedTasks} of {totalTasks}
                    </div>
                    <div className="text-gray-500">completed</div>
                  </div>
                </div>

                <Badge variant="success" icon="TrendingUp">
                  {completionRate >= 80 ? 'Excellent' : completionRate >= 60 ? 'Good' : 'Keep Going'}
                </Badge>
              </div>
            )}
          </div>

          {/* Search and Actions */}
          <div className="flex-1 lg:max-w-md">
            <SearchBar
              onSearch={onSearch}
              placeholder="Search tasks..."
              showAddButton={true}
              onAdd={onAddTask}
            />
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header