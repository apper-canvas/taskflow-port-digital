import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday } from 'date-fns'
import { toast } from 'react-toastify'
import { taskService } from '@/services/api/taskService'
import { categoryService } from '@/services/api/categoryService'
import Header from '@/components/organisms/Header'
import TaskForm from '@/components/organisms/TaskForm'
import CalendarCell from '@/components/molecules/CalendarCell'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Calendar = () => {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTask, setSelectedTask] = useState(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadCalendarData()
  }, [currentDate])

  const loadCalendarData = async () => {
    try {
      setError('')
      setLoading(true)
      
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)
      const calendarStart = startOfWeek(monthStart)
      const calendarEnd = endOfWeek(monthEnd)
      
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getTasksByDateRange(calendarStart, calendarEnd),
        categoryService.getAll()
      ])
      
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load calendar data')
    } finally {
      setLoading(false)
    }
  }

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setShowTaskForm(true)
  }

  const handleAddTask = (date = null) => {
    setSelectedTask(date ? { dueDate: date.toISOString() } : null)
    setShowTaskForm(true)
  }

  const handleTaskSubmit = async (taskData) => {
    try {
      setSubmitting(true)
      if (selectedTask?.id) {
        await taskService.update(selectedTask.id, taskData)
        toast.success('Task updated successfully!')
      } else {
        await taskService.create(taskData)
        toast.success('Task created successfully! 🎉')
      }
      setShowTaskForm(false)
      setSelectedTask(null)
      loadCalendarData()
    } catch (err) {
      toast.error(selectedTask?.id ? 'Failed to update task' : 'Failed to create task')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseTaskForm = () => {
    setShowTaskForm(false)
    setSelectedTask(null)
  }

  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)

    const days = []
    let day = calendarStart

    while (day <= calendarEnd) {
      days.push(day)
      day = addDays(day, 1)
    }

    const weeks = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    return weeks.map((week, weekIndex) => (
      <div key={weekIndex} className="grid grid-cols-7 gap-1">
        {week.map((day, dayIndex) => {
          const dayTasks = tasks.filter(task => 
            task.dueDate && isSameDay(new Date(task.dueDate), day)
          )
          
          return (
            <CalendarCell
              key={dayIndex}
              date={day}
              tasks={dayTasks}
              categories={categories}
              isCurrentMonth={isSameMonth(day, currentDate)}
              isToday={isToday(day)}
              onTaskClick={handleTaskClick}
              onAddTask={handleAddTask}
            />
          )
        })}
      </div>
    ))
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadCalendarData} />

  return (
    <div className="min-h-screen bg-background">
      <Header
        onAddTask={() => handleAddTask()}
        totalTasks={tasks.length}
        completedTasks={tasks.filter(t => t.completed).length}
        showCalendarNav={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              leftIcon="ArrowLeft"
            >
              Back to Tasks
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToday}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousMonth}
              leftIcon="ChevronLeft"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              leftIcon="ChevronRight"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleAddTask()}
              leftIcon="Plus"
            >
              Add Task
            </Button>
          </div>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-4 text-center text-sm font-medium text-gray-700">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="divide-y divide-gray-200">
            {renderCalendarGrid()}
          </div>
        </motion.div>

        {/* Calendar Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600"
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Pending Tasks</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Completed Tasks</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Overdue Tasks</span>
          </div>
        </motion.div>
      </div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <TaskForm
            task={selectedTask}
            categories={categories}
            onSubmit={handleTaskSubmit}
            onCancel={handleCloseTaskForm}
            isSubmitting={submitting}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Calendar