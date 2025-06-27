import { useState, useEffect, useCallback } from 'react'
import { taskService } from '@/services/api/taskService'
import { categoryService } from '@/services/api/categoryService'
import { toast } from 'react-toastify'

export const useTaskManager = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    priority: null,
    category: null
  })

  // Task form
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  // Task operations
  const handleCreateTask = async (taskData) => {
    try {
      setSubmitting(true)
      const newTask = await taskService.create(taskData)
      setTasks(prev => [newTask, ...prev])
      setShowTaskForm(false)
      setEditingTask(null)
      toast.success('Task created successfully! 🎉')
    } catch (err) {
      toast.error('Failed to create task')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateTask = async (taskData) => {
    try {
      setSubmitting(true)
      const updatedTask = await taskService.update(editingTask.id, taskData)
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? updatedTask : task
      ))
      setShowTaskForm(false)
      setEditingTask(null)
      toast.success('Task updated successfully!')
    } catch (err) {
      toast.error('Failed to update task')
    } finally {
      setSubmitting(false)
    }
  }

  const handleTaskSubmit = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData)
    } else {
      handleCreateTask(taskData)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setShowTaskForm(true)
  }

  const handleCloseTaskForm = () => {
    setShowTaskForm(false)
    setEditingTask(null)
  }

  // Filter operations
  const handleFilterChange = (type, value) => {
    if (typeof type === 'string' && value === undefined) {
      // Handle status filter (all, pending, completed)
      setFilters(prev => ({ ...prev, status: type }))
    } else {
      // Handle other filters
      setFilters(prev => ({ ...prev, [type]: value }))
    }
  }

  const handleCategoryChange = (categoryId) => {
    setFilters(prev => ({ ...prev, category: categoryId }))
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Calculate stats
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const pendingTasks = totalTasks - completedTasks

  const taskCounts = {
    all: totalTasks,
    ...categories.reduce((acc, category) => {
      acc[category.id] = tasks.filter(task => task.category === category.id).length
      return acc
    }, {})
  }

  return {
    // Data
    tasks,
    categories,
    loading,
    error,
    refreshTrigger,
    
    // Stats
    totalTasks,
    completedTasks,
    pendingTasks,
    taskCounts,
    
    // Filters and search
    searchQuery,
    filters,
    handleSearch,
    handleFilterChange,
    handleCategoryChange,
    
    // Task form
    showTaskForm,
    editingTask,
    submitting,
    handleTaskSubmit,
    handleEditTask,
    handleAddTask,
    handleCloseTaskForm,
    
    // Actions
    refreshData,
    loadData
  }
}