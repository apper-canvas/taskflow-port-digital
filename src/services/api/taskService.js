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
  }
}