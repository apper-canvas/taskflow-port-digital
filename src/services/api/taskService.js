import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

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
      completedAt: null
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updateData) {
    await delay(300)
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    const updatedTask = {
      ...tasks[index],
      ...updateData,
      completedAt: updateData.completed && !tasks[index].completed 
        ? new Date().toISOString() 
        : updateData.completed === false ? null : tasks[index].completedAt
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
  }
}