import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Subtask utilities
const getNextSubtaskId = (task) => {
  if (!task.subtasks || task.subtasks.length === 0) return 1
  return Math.max(...task.subtasks.map(s => s.Id)) + 1
}

const calculateTaskProgress = (task) => {
  if (!task.subtasks || task.subtasks.length === 0) return { completed: 0, total: 0, percentage: 0 }
  
  const total = task.subtasks.length
  const completed = task.subtasks.filter(s => s.completed).length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  return { completed, total, percentage }
}

const shouldAutoCompleteTask = (task) => {
  if (!task.subtasks || task.subtasks.length === 0) return false
  return task.subtasks.every(s => s.completed)
}
// Date utility functions
const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const addWeeks = (date, weeks) => {
  const result = new Date(date)
  result.setDate(result.getDate() + (weeks * 7))
  return result
}

const addMonths = (date, months) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

const isBefore = (date1, date2) => {
  return new Date(date1).getTime() < new Date(date2).getTime()
}

export const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(t => t.id === id)
    if (!task) throw new Error('Task not found')
    return { ...task }
  },

async create(taskData) {
    await delay(400)
    const maxId = Math.max(...tasks.map(t => parseInt(t.id)), 0)
    const newTask = {
      id: (maxId + 1).toString(),
      title: taskData.title,
      completed: false,
      priority: taskData.priority || 'medium',
      category: taskData.category || 'personal',
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      subtasks: taskData.subtasks ? taskData.subtasks.map((subtask, index) => ({
        Id: index + 1,
        title: subtask.title,
        completed: false
      })) : []
    }
    tasks.push(newTask)
    return { ...newTask }
  },

async update(id, updateData) {
    await delay(300)
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    const currentTask = tasks[index]
    
    const updatedTask = {
      ...currentTask,
      ...updateData,
      subtasks: updateData.subtasks !== undefined ? updateData.subtasks : currentTask.subtasks,
      completedAt: updateData.completed && !currentTask.completed 
        ? new Date().toISOString() 
        : updateData.completed === false ? null : currentTask.completedAt
    }
    
    // Auto-complete task if all subtasks are completed
    if (updatedTask.subtasks && updatedTask.subtasks.length > 0 && shouldAutoCompleteTask(updatedTask) && !updatedTask.completed) {
      updatedTask.completed = true
      updatedTask.completedAt = new Date().toISOString()
    }
    
    tasks[index] = updatedTask
    return { ...updatedTask }
  },

  async delete(id) {
    await delay(250)
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    const deletedTask = tasks[index]
    tasks.splice(index, 1)
    return { ...deletedTask }
  },

  async bulkDelete(ids) {
    await delay(400)
    const deletedTasks = []
    
    ids.forEach(id => {
      const index = tasks.findIndex(t => t.id === id)
      if (index !== -1) {
        deletedTasks.push({ ...tasks[index] })
        tasks.splice(index, 1)
      }
    })
    
    return deletedTasks
  },

  async toggleComplete(id) {
    await delay(200)
    const task = tasks.find(t => t.id === id)
if (!task) throw new Error('Task not found')
    
    return this.update(id, { completed: !task.completed })
  },

  async generateRecurringTasks(parentTask) {
    await delay(200)
    const generatedTasks = []
    const maxId = Math.max(...tasks.map(t => parseInt(t.id)), 0)
    let nextId = maxId + 1
    
    if (!parentTask.dueDate || !parentTask.recurrencePattern) return generatedTasks
    
    const startDate = new Date(parentTask.dueDate)
    const endDate = parentTask.recurrenceEndDate ? new Date(parentTask.recurrenceEndDate) : null
    let currentDate = new Date(startDate)
    
    // Generate up to 50 recurring tasks or until end date
    const maxRecurrences = 50
    let count = 0
    
    while (count < maxRecurrences) {
      // Calculate next occurrence
      switch (parentTask.recurrencePattern) {
        case 'daily':
          currentDate = addDays(currentDate, parentTask.recurrenceFrequency)
          break
        case 'weekly':
          currentDate = addWeeks(currentDate, parentTask.recurrenceFrequency)
          break
        case 'monthly':
          currentDate = addMonths(currentDate, parentTask.recurrenceFrequency)
          break
        default:
          return generatedTasks
      }
      
      // Stop if we've reached the end date
      if (endDate && !isBefore(currentDate, endDate)) break
      
      // Stop if we're generating too far in the future (1 year max)
      const oneYearFromNow = addMonths(new Date(), 12)
      if (!isBefore(currentDate, oneYearFromNow)) break
      
      const recurringTask = {
        id: nextId.toString(),
        title: parentTask.title,
        completed: false,
        priority: parentTask.priority,
        category: parentTask.category,
        dueDate: currentDate.toISOString(),
        createdAt: new Date().toISOString(),
        completedAt: null,
        isRecurring: false, // Individual instances are not recurring
        recurrencePattern: null,
        recurrenceFrequency: 1,
        recurrenceEndDate: null,
        parentTaskId: parentTask.id
      }
      
      tasks.push(recurringTask)
      generatedTasks.push(recurringTask)
      nextId++
      count++
    }
return generatedTasks
  },

  async getStatistics() {
    await delay(200)
    const now = new Date()
    const allTasks = [...tasks]
    
    // Basic stats
    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter(t => t.completed).length
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    
    // Overdue tasks
    const overdueTasks = allTasks.filter(t => 
      !t.completed && t.dueDate && new Date(t.dueDate) < now
    ).length
    
    // Category distribution
    const categoryStats = allTasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    }, {})
    
    // Priority distribution
    const priorityStats = allTasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    }, {})
    
    // Completion trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      date.setHours(0, 0, 0, 0)
      return date
    })
    
    const completionTrend = last7Days.map(date => {
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      
      const completedOnDay = allTasks.filter(t => {
        if (!t.completedAt) return false
        const completedDate = new Date(t.completedAt)
        return completedDate >= date && completedDate < nextDay
      }).length
      
      return {
        date: date.toISOString().split('T')[0],
        completed: completedOnDay
      }
    })
    
    // Monthly completion rate
    const last30Days = new Date(now)
    last30Days.setDate(last30Days.getDate() - 30)
    
    const tasksLast30Days = allTasks.filter(t => 
      new Date(t.createdAt) >= last30Days
    )
    const completedLast30Days = tasksLast30Days.filter(t => t.completed).length
    const monthlyCompletionRate = tasksLast30Days.length > 0 
      ? (completedLast30Days / tasksLast30Days.length) * 100 
      : 0
    
    // Average completion time
    const completedTasksWithTime = allTasks.filter(t => 
      t.completed && t.completedAt && t.createdAt
    )
    
    const avgCompletionTime = completedTasksWithTime.length > 0
      ? completedTasksWithTime.reduce((sum, task) => {
          const created = new Date(task.createdAt)
          const completed = new Date(task.completedAt)
          return sum + (completed - created)
        }, 0) / completedTasksWithTime.length
      : 0
    
    return {
      totalTasks,
      completedTasks,
      completionRate: Math.round(completionRate * 10) / 10,
      overdueTasks,
      monthlyCompletionRate: Math.round(monthlyCompletionRate * 10) / 10,
      avgCompletionTimeHours: Math.round((avgCompletionTime / (1000 * 60 * 60)) * 10) / 10,
      categoryStats,
      priorityStats,
completionTrend
    }
  },

  async bulkComplete(ids) {
    await delay(400)
    const updatedTasks = []
    
    ids.forEach(id => {
      const index = tasks.findIndex(t => t.id === id)
      if (index !== -1 && !tasks[index].completed) {
        tasks[index] = {
          ...tasks[index],
          completed: true,
          completedAt: new Date().toISOString()
        }
        updatedTasks.push({ ...tasks[index] })
      }
    })
return updatedTasks
  },

  async getTasksByDateRange(startDate, endDate) {
    await delay(200)
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return tasks.filter(task => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return taskDate >= start && taskDate <= end
    }).map(task => ({ ...task }))
  },

  async getTasksByDate(date) {
    await delay(150)
    const targetDate = new Date(date)
    const startOfDay = new Date(targetDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(targetDate)
    endOfDay.setHours(23, 59, 59, 999)
    
    return tasks.filter(task => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return taskDate >= startOfDay && taskDate <= endOfDay
    }).map(task => ({ ...task }))
},

  // Subtask operations
  async getSubtasks(taskId) {
    await delay(150)
    const task = tasks.find(t => t.id === taskId)
    if (!task) throw new Error('Task not found')
    return task.subtasks || []
  },

  async createSubtask(taskId, subtaskData) {
    await delay(250)
    const taskIndex = tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) throw new Error('Task not found')
    
    const task = tasks[taskIndex]
    if (!task.subtasks) task.subtasks = []
    
    const newSubtask = {
      Id: getNextSubtaskId(task),
      title: subtaskData.title,
      completed: false
    }
    
    task.subtasks.push(newSubtask)
    tasks[taskIndex] = { ...task }
    
    return { ...newSubtask }
  },

  async updateSubtask(taskId, subtaskId, updateData) {
    await delay(200)
    const taskIndex = tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) throw new Error('Task not found')
    
    const task = tasks[taskIndex]
    if (!task.subtasks) throw new Error('No subtasks found')
    
    const subtaskIndex = task.subtasks.findIndex(s => s.Id === subtaskId)
    if (subtaskIndex === -1) throw new Error('Subtask not found')
    
    const updatedSubtask = {
      ...task.subtasks[subtaskIndex],
      ...updateData
    }
    
    task.subtasks[subtaskIndex] = updatedSubtask
    
    // Auto-complete parent task if all subtasks are completed
    if (shouldAutoCompleteTask(task) && !task.completed) {
      task.completed = true
      task.completedAt = new Date().toISOString()
    }
    // Auto-uncomplete parent task if any subtask is uncompleted
    else if (task.completed && !shouldAutoCompleteTask(task)) {
      task.completed = false
      task.completedAt = null
    }
    
    tasks[taskIndex] = { ...task }
    return { ...updatedSubtask }
  },

  async deleteSubtask(taskId, subtaskId) {
    await delay(200)
    const taskIndex = tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) throw new Error('Task not found')
    
    const task = tasks[taskIndex]
    if (!task.subtasks) throw new Error('No subtasks found')
    
    const subtaskIndex = task.subtasks.findIndex(s => s.Id === subtaskId)
    if (subtaskIndex === -1) throw new Error('Subtask not found')
    
    const deletedSubtask = task.subtasks[subtaskIndex]
    task.subtasks.splice(subtaskIndex, 1)
    
    // Update parent task completion status
    if (task.completed && task.subtasks.length > 0 && !shouldAutoCompleteTask(task)) {
      task.completed = false
      task.completedAt = null
    }
    
    tasks[taskIndex] = { ...task }
    return { ...deletedSubtask }
  },

  async reorderSubtasks(taskId, subtaskIds) {
    await delay(200)
    const taskIndex = tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) throw new Error('Task not found')
    
    const task = tasks[taskIndex]
    if (!task.subtasks) throw new Error('No subtasks found')
    
    const reorderedSubtasks = subtaskIds.map(id => 
      task.subtasks.find(s => s.Id === id)
    ).filter(Boolean)
    
    task.subtasks = reorderedSubtasks
    tasks[taskIndex] = { ...task }
    
    return task.subtasks
  },

  getTaskProgress(taskId) {
    const task = tasks.find(t => t.id === taskId)
    if (!task) throw new Error('Task not found')
    return calculateTaskProgress(task)
  }
}