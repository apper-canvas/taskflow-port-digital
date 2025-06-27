import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center p-8"
    >
      <div className="w-20 h-20 bg-gradient-to-r from-error to-red-500 rounded-full flex items-center justify-center mb-6 shadow-floating">
        <ApperIcon name="AlertTriangle" size={40} className="text-white" />
      </div>
      
      <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {message}. Don't worry, your tasks are safe. Let's try again.
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" size={18} />
          <span>Try Again</span>
        </button>
      )}
    </motion.div>
  )
}

export default Error