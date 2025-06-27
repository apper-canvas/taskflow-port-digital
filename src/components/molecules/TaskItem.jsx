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
  const [isExpanded, setIsExpanded] = useState(false)
  const [editingSubtask, setEditingSubtask] = useState(null)
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

  const ProgressBar = ({ completed, total }) => {
    const percentage = total > 0 ? (completed / total) * 100 : 0
    
    return (
      <div className="flex items-center space-x-2 text-xs text-gray-600">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <span className="min-w-0 whitespace-nowrap">
          {completed}/{total}
        </span>
      </div>
    )
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

  const hasSubtasks = task.subtasks && task.subtasks.length > 0
  const subtaskProgress = hasSubtasks ? {
    completed: task.subtasks.filter(s => s.completed).length,
    total: task.subtasks.length,
    percentage: Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100)
  } : { completed: 0, total: 0, percentage: 0 }

  const handleSubtaskToggle = async (subtaskId) => {
    const subtask = task.subtasks.find(s => s.Id === subtaskId)
    if (!subtask) return
    
    try {
      // This would be handled by parent component
      onToggleComplete?.(task.id, subtaskId, !subtask.completed)
    } catch (err) {
      console.error('Failed to toggle subtask:', err)
    }
  }

  const handleSubtaskEdit = (subtask) => {
    setEditingSubtask(subtask)
  }

  const handleSubtaskSave = async (subtaskId, newTitle) => {
    if (!newTitle.trim()) return
    
    try {
      // This would be handled by parent component
      onEdit?.(task, { type: 'subtask', subtaskId, title: newTitle.trim() })
      setEditingSubtask(null)
    } catch (err) {
      console.error('Failed to update subtask:', err)
    }
  }

  const handleSubtaskDelete = async (subtaskId) => {
    if (!window.confirm('Are you sure you want to delete this subtask?')) return
    
    try {
      // This would be handled by parent component
      onDelete?.(task.id, subtaskId)
    } catch (err) {
      console.error('Failed to delete subtask:', err)
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
            
            {hasSubtasks && (
              <Button
                variant="ghost"
                size="sm"
                icon={isExpanded ? "ChevronUp" : "ChevronDown"}
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-primary p-1"
              />
            )}
            
            {isOverdue && (
              <Badge variant="error" size="sm" icon="AlertTriangle">
                Overdue
              </Badge>
            )}
          </div>
          
          {hasSubtasks && (
            <div className="mb-3">
              <ProgressBar completed={subtaskProgress.completed} total={subtaskProgress.total} />
            </div>
          )}
          
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

      {/* Subtasks Section */}
      <AnimatePresence>
        {isExpanded && hasSubtasks && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pl-6 border-l-2 border-gray-100"
          >
            <div className="space-y-2">
              {task.subtasks.map((subtask) => (
                <motion.div
                  key={subtask.Id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-3 group/subtask"
                >
                  <Checkbox
                    checked={subtask.completed}
                    onChange={() => handleSubtaskToggle(subtask.Id)}
                    size="sm"
                    className="text-primary"
                  />
                  
                  {editingSubtask?.Id === subtask.Id ? (
                    <div className="flex-1 flex items-center space-x-2">
                      <input
                        type="text"
                        defaultValue={subtask.title}
                        className="flex-1 text-sm bg-transparent border-b border-primary focus:outline-none"
                        onBlur={(e) => handleSubtaskSave(subtask.Id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSubtaskSave(subtask.Id, e.target.value)
                          }
                          if (e.key === 'Escape') {
                            setEditingSubtask(null)
                          }
                        }}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <span 
                      className={`flex-1 text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}
                      onDoubleClick={() => handleSubtaskEdit(subtask)}
                    >
                      {subtask.title}
                    </span>
                  )}
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover/subtask:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit2"
                      onClick={() => handleSubtaskEdit(subtask)}
                      className="text-gray-400 hover:text-primary p-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handleSubtaskDelete(subtask.Id)}
                      className="text-gray-400 hover:text-error p-1"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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