import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const TaskForm = ({ 
  task = null, 
  categories = [],
  onSubmit, 
  onCancel,
  isSubmitting = false 
}) => {
const [formData, setFormData] = useState({
    title: '',
    priority: 'medium',
    category: '',
    dueDate: '',
    isRecurring: false,
    recurrencePattern: 'daily',
    recurrenceFrequency: 1,
    recurrenceEndDate: '',
    subtasks: []
  })
  
  const [newSubtask, setNewSubtask] = useState('')
  const [showSubtasks, setShowSubtasks] = useState(false)
  const [errors, setErrors] = useState({})

useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        priority: task.priority || 'medium',
        category: task.category || '',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd\'T\'HH:mm') : '',
        isRecurring: task.isRecurring || false,
        recurrencePattern: task.recurrencePattern || 'daily',
        recurrenceFrequency: task.recurrenceFrequency || 1,
        recurrenceEndDate: task.recurrenceEndDate || '',
        subtasks: task.subtasks ? [...task.subtasks] : []
      })
      setShowSubtasks(task.subtasks && task.subtasks.length > 0)
    }
  }, [task])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const submitData = {
      ...formData,
      title: formData.title.trim(),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    }
    
    onSubmit?.(submitData)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
}

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return
    
    const newSubtaskObj = {
      Id: Math.max(...formData.subtasks.map(s => s.Id || 0), 0) + 1,
      title: newSubtask.trim(),
      completed: false
    }
    
    setFormData(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtaskObj]
    }))
    setNewSubtask('')
  }

  const handleRemoveSubtask = (subtaskId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(s => s.Id !== subtaskId)
    }))
  }

  const handleSubtaskTitleChange = (subtaskId, newTitle) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(s => 
        s.Id === subtaskId ? { ...s, title: newTitle } : s
      )
    }))
  }
  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
]

  const recurrenceOptions = [
    { value: 'daily', label: 'Day(s)' },
    { value: 'weekly', label: 'Week(s)' },
    { value: 'monthly', label: 'Month(s)' },
    { value: 'yearly', label: 'Year(s)' }
  ]

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name
  }))
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl shadow-floating p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Task Title"
            type="text"
            placeholder="What needs to be done?"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            error={errors.title}
            icon="Edit3"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              options={priorityOptions}
              placeholder="Select priority"
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              options={categoryOptions}
              placeholder="Select category"
            />
          </div>

<Input
            label="Due Date"
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            icon="Calendar"
            error={errors.dueDate}
          />

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => handleChange('isRecurring', e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
                Make this a recurring task
              </label>
            </div>

            {formData.isRecurring && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Repeat Pattern"
                    value={formData.recurrencePattern}
                    onChange={(e) => handleChange('recurrencePattern', e.target.value)}
                    options={recurrenceOptions}
                    placeholder="Select pattern"
                  />

                  <Input
                    label="Every"
                    type="number"
                    min="1"
                    max="30"
                    value={formData.recurrenceFrequency}
                    onChange={(e) => handleChange('recurrenceFrequency', parseInt(e.target.value) || 1)}
                    placeholder="1"
                    error={errors.recurrenceFrequency}
                  />
                </div>

                <Input
                  label="End Date (Optional)"
                  type="date"
                  value={formData.recurrenceEndDate}
                  onChange={(e) => handleChange('recurrenceEndDate', e.target.value)}
                  icon="Calendar"
                />
              </div>
)}
          </div>

          {/* Subtasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Subtasks
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon={showSubtasks ? "ChevronUp" : "ChevronDown"}
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="text-gray-500 hover:text-primary"
              >
                {showSubtasks ? 'Hide' : 'Add'} Subtasks
              </Button>
            </div>

            {showSubtasks && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Add a subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddSubtask()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    icon="Plus"
                    onClick={handleAddSubtask}
                    disabled={!newSubtask.trim()}
                  >
                    Add
                  </Button>
                </div>

                {formData.subtasks.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.subtasks.map((subtask) => (
                      <div
                        key={subtask.Id}
                        className="flex items-center space-x-3 p-2 bg-white rounded border"
                      >
                        <ApperIcon name="GripVertical" size={16} className="text-gray-400" />
                        <input
                          type="text"
                          value={subtask.title}
                          onChange={(e) => handleSubtaskTitleChange(subtask.Id, e.target.value)}
                          className="flex-1 text-sm bg-transparent border-none focus:outline-none"
                          placeholder="Subtask title..."
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => handleRemoveSubtask(subtask.Id)}
                          className="text-gray-400 hover:text-error"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {formData.subtasks.length > 0 && (
                  <div className="text-xs text-gray-500 flex items-center space-x-1">
                    <ApperIcon name="Info" size={12} />
                    <span>Drag to reorder, double-click to edit</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              icon={task ? "Save" : "Plus"}
              className="flex-1"
            >
              {task ? 'Update Task' : 'Create Task'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default TaskForm