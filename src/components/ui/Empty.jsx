import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No tasks yet", 
  message = "Create your first task and start being productive!",
  actionText = "Add Your First Task",
  onAction,
  icon = "CheckCircle2"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center p-8"
    >
      <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-8 shadow-floating">
        <ApperIcon name={icon} size={48} className="text-white" />
      </div>
      
      <h3 className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md text-lg">
        {message}
      </p>

      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
        >
          <ApperIcon name="Plus" size={20} />
          <span>{actionText}</span>
        </button>
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-accent rounded-full opacity-20 animate-pulse delay-300"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-success rounded-full opacity-20 animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-warning rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
    </motion.div>
  )
}

export default Empty