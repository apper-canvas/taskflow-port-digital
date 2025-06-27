import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { isFuture, isPast, isToday, isTomorrow } from "date-fns";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import TaskItem from "@/components/molecules/TaskItem";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const TaskList = ({ 
  searchQuery = '', 
  filters = {}, 
  categories = [],
  onTaskEdit,
  onAddTask,
  refreshTrigger = 0 
}) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTasks()
  }, [refreshTrigger])

  const loadTasks = async () => {
    try {
      setError('')
      setLoading(true)
      const data = await taskService.getAll()
      setTasks(data)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId)
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? updatedTask : task
        )
      )
      
      if (updatedTask.completed) {
        toast.success('Task completed! 🎉')
      } else {
        toast.info('Task marked as pending')
      }
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    
    try {
      await taskService.delete(taskId)
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
      toast.success('Task deleted successfully')
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Status filter
    if (filters.status === 'completed' && !task.completed) return false
    if (filters.status === 'pending' && task.completed) return false

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) return false

    // Category filter
    if (filters.category && task.category !== filters.category) return false

    return true
  })

  // Group tasks by time periods
  const groupedTasks = {
    overdue: filteredTasks.filter(task => 
      task.dueDate && isPast(new Date(task.dueDate)) && !task.completed
    ),
    today: filteredTasks.filter(task => 
      task.dueDate && isToday(new Date(task.dueDate))
    ),
    tomorrow: filteredTasks.filter(task => 
      task.dueDate && isTomorrow(new Date(task.dueDate))
    ),
    upcoming: filteredTasks.filter(task => 
      task.dueDate && isFuture(new Date(task.dueDate)) && 
      !isToday(new Date(task.dueDate)) && !isTomorrow(new Date(task.dueDate))
    ),
    noDueDate: filteredTasks.filter(task => !task.dueDate),
    completed: filteredTasks.filter(task => task.completed)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadTasks} />
  if (filteredTasks.length === 0) {
    return (
      <Empty
        title={searchQuery ? "No tasks found" : "No tasks yet"}
        message={searchQuery ? 
          `No tasks match "${searchQuery}". Try adjusting your search or filters.` : 
          "Create your first task and start being productive!"
        }
        actionText="Add Your First Task"
        onAction={onAddTask}
        icon={searchQuery ? "Search" : "CheckCircle2"}
      />
    )
  }

  const TaskGroup = ({ title, tasks: groupTasks, variant = 'default' }) => {
    if (groupTasks.length === 0) return null

    const variants = {
      overdue: 'text-error',
      today: 'text-primary',
      tomorrow: 'text-secondary',
      upcoming: 'text-gray-700',
      completed: 'text-success',
      default: 'text-gray-700'
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <h3 className={`text-lg font-display font-semibold ${variants[variant]} flex items-center space-x-2`}>
          <span>{title}</span>
          <span className="text-sm font-normal">({groupTasks.length})</span>
        </h3>
        
        <div className="space-y-3">
          <AnimatePresence>
            {groupTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                categories={categories}
                onToggleComplete={handleToggleComplete}
                onEdit={onTaskEdit}
                onDelete={handleDeleteTask}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      <TaskGroup title="Overdue" tasks={groupedTasks.overdue} variant="overdue" />
      <TaskGroup title="Today" tasks={groupedTasks.today} variant="today" />
      <TaskGroup title="Tomorrow" tasks={groupedTasks.tomorrow} variant="tomorrow" />
      <TaskGroup title="Upcoming" tasks={groupedTasks.upcoming} variant="upcoming" />
      <TaskGroup title="No Due Date" tasks={groupedTasks.noDueDate} variant="default" />
      <TaskGroup title="Completed" tasks={groupedTasks.completed} variant="completed" />
    </div>
</div>
  )
}

export default TaskList