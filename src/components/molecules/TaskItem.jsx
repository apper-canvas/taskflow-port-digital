import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  categories = [],
  className = '',
  selected = false,
  onSelectionChange
}) => {
  const [isCompleting, setIsCompleting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const category = categories.find(c => c.id === task.category)
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed

  const handleToggleComplete = async () => {
    if (!task.completed) {
      setIsCompleting(true)
      setShowConfetti(true)
      
      // Create confetti effect
      createConfetti()
      
      setTimeout(() => {
        onToggleComplete?.(task.id)
        setIsCompleting(false)
        setTimeout(() => setShowConfetti(false), 1000)
      }, 600)
    } else {
      onToggleComplete?.(task.id)
    }
  }

  const createConfetti = () => {
    const colors = ['#5B4FE9', '#FF6B6B', '#4ECDC4', '#FFD93D']
    const confettiContainer = document.createElement('div')
    confettiContainer.className = 'fixed inset-0 pointer-events-none z-50'
    document.body.appendChild(confettiContainer)

    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'absolute w-2 h-2 rounded-full'
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.left = Math.random() * window.innerWidth + 'px'
      confetti.style.top = Math.random() * window.innerHeight + 'px'
      confetti.style.animation = `confetti 1s ease-out forwards`
      confetti.style.animationDelay = Math.random() * 0.5 + 's'
      confettiContainer.appendChild(confetti)
    }

    setTimeout(() => {
      document.body.removeChild(confettiContainer)
    }, 1500)
  }

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null
    const date = new Date(dueDate)
    
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM d')
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'high'
      case 'medium': return 'medium'
      case 'low': return 'low'
      default: return 'default'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isCompleting ? 1.02 : 1 
      }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
className={`card p-4 group ${task.completed ? 'opacity-70' : ''} ${isOverdue ? 'border-l-4 border-error' : ''} ${selected ? 'ring-2 ring-primary' : ''} ${className}`}
    >
      <div className="flex items-center space-x-4">
        {onSelectionChange && (
          <Checkbox
            checked={selected}
            onChange={(checked) => onSelectionChange(task.id, checked)}
            size="sm"
            className="text-primary"
          />
        )}
        
        <Checkbox
          checked={task.completed}
          onChange={handleToggleComplete}
          disabled={isCompleting}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className={`text-base font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'} truncate`}>
              {task.title}
            </h3>
            
            {isOverdue && (
              <Badge variant="error" size="sm" icon="AlertTriangle">
                Overdue
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <Badge variant={getPriorityColor(task.priority)} size="sm">
              {task.priority.toUpperCase()}
            </Badge>
            
            {category && (
              <Badge 
                variant="default" 
                size="sm" 
                icon={category.icon}
                className="text-gray-600"
                style={{ 
                  backgroundColor: category.color + '20',
                  color: category.color 
                }}
              >
{category.name}
              </Badge>
            )}
            
            {task.isRecurring && (
              <Badge variant="default" size="sm" icon="Repeat" className="text-purple-600">
                {task.recurrencePattern === 'daily' && 'Daily'}
                {task.recurrencePattern === 'weekly' && 'Weekly'}
                {task.recurrencePattern === 'monthly' && 'Monthly'}
                {task.recurrenceFrequency > 1 && ` (${task.recurrenceFrequency}x)`}
              </Badge>
            )}
            
            {task.dueDate && (
              <div className={`flex items-center space-x-1 ${isOverdue ? 'text-error' : 'text-gray-500'}`}>
                <ApperIcon name="Calendar" size={14} />
                <span>{formatDueDate(task.dueDate)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            icon="Edit2"
            onClick={() => onEdit?.(task)}
            className="text-gray-400 hover:text-primary"
          />
          
          <Button
            variant="ghost"
            size="sm"
            icon="Trash2"
            onClick={() => onDelete?.(task.id)}
            className="text-gray-400 hover:text-error"
          />
        </div>
      </div>

      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            <div className="text-4xl">🎉</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default TaskItem