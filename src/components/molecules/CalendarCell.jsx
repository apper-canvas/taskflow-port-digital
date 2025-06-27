import { motion } from 'framer-motion'
import { format, isPast, isToday } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const CalendarCell = ({ 
  date, 
  tasks = [], 
  categories = [], 
  isCurrentMonth, 
  isToday: isTodayDate,
  onTaskClick,
  onAddTask 
}) => {
  const handleTaskClick = (e, task) => {
    e.stopPropagation()
    onTaskClick(task)
  }

  const handleCellClick = () => {
    onAddTask(date)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTaskStatusColor = (task) => {
    if (task.completed) return 'bg-green-500'
    if (task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))) {
      return 'bg-red-500'
    }
    return 'bg-blue-500'
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.name || 'Personal'
  }

  return (
    <motion.div
      whileHover={{ backgroundColor: '#f8fafc' }}
      className={`
        relative min-h-[120px] p-2 border-r border-gray-200 cursor-pointer
        ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
        ${isTodayDate ? 'bg-blue-50 border-blue-200' : ''}
      `}
      onClick={handleCellClick}
    >
      {/* Date Number */}
      <div className={`
        text-sm font-medium mb-1
        ${isTodayDate ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
      `}>
        {format(date, 'd')}
      </div>

      {/* Tasks */}
      <div className="space-y-1">
        {tasks.slice(0, 3).map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`
              px-2 py-1 rounded text-xs cursor-pointer border
              ${getPriorityColor(task.priority)}
              hover:shadow-sm transition-shadow
            `}
            onClick={(e) => handleTaskClick(e, task)}
            title={`${task.title} - ${getCategoryName(task.category)}`}
          >
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${getTaskStatusColor(task)}`} />
              <span className="truncate font-medium">
                {task.title}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Show more indicator */}
        {tasks.length > 3 && (
          <div className="text-xs text-gray-500 px-2 py-1">
            +{tasks.length - 3} more
          </div>
        )}
      </div>

      {/* Add task button (shows on hover) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity"
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddTask(date)
          }}
          className="w-5 h-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
          title="Add task for this date"
        >
          <ApperIcon name="Plus" size={12} />
        </button>
      </motion.div>

      {/* Today indicator */}
      {isTodayDate && (
        <div className="absolute bottom-2 left-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </div>
      )}
    </motion.div>
  )
}

export default CalendarCell