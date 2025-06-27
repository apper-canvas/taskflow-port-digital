import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { categoryService } from '@/services/api/categoryService'

const predefinedColors = [
  '#5B4FE9', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3',
  '#FF9F43', '#EE5A24', '#0ABDE3', '#10AC84', '#F79F1F'
]

const availableIcons = [
  'Tag', 'Briefcase', 'Home', 'User', 'Heart', 'Star',
  'BookOpen', 'Coffee', 'Camera', 'Music', 'Gamepad2',
  'Dumbbell', 'Car', 'Plane', 'ShoppingBag', 'Gift'
]

const CategoryForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: predefinedColors[0],
    icon: 'Tag'
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters'
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Category name must be less than 50 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        color: formData.color,
        icon: formData.icon
      })
      
      // Reset form
      setFormData({
        name: '',
        color: predefinedColors[0],
        icon: 'Tag'
      })
      setErrors({})
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Plus" size={18} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Add New Category</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter category name..."
              error={errors.name}
              className="w-full"
              maxLength={50}
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <ApperIcon name="AlertCircle" size={14} />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Color
            </label>
            <div className="grid grid-cols-5 gap-3">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleInputChange('color', color)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                    formData.color === color
                      ? 'border-gray-400 ring-2 ring-purple-500 ring-offset-2'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-3 max-h-32 overflow-y-auto">
              {availableIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleInputChange('icon', icon)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                    formData.icon === icon
                      ? 'border-purple-500 bg-purple-50 text-purple-600'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ApperIcon name={icon} size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !formData.name.trim()}
              loading={isSubmitting}
              icon="Plus"
            >
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default CategoryForm