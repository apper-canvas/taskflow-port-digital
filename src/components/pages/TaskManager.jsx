import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import TaskList from '@/components/organisms/TaskList'
import TaskForm from '@/components/organisms/TaskForm'
import CategoryForm from '@/components/organisms/CategoryForm'
import FilterBar from '@/components/molecules/FilterBar'
import CategoryFilter from '@/components/molecules/CategoryFilter'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { useTaskManager } from '@/hooks/useTaskManager'
import { categoryService } from '@/services/api/categoryService'

const TaskManager = () => {
const {
    // Data
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
    loadData
  } = useTaskManager()

  // Category form state
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [categorySubmitting, setCategorySubmitting] = useState(false)

  const handleAddCategory = () => {
    setShowCategoryForm(true)
  }

  const handleCloseCategoryForm = () => {
    setShowCategoryForm(false)
  }

  const handleCategorySubmit = async (categoryData) => {
    setCategorySubmitting(true)
    try {
      const newCategory = await categoryService.create(categoryData)
      toast.success(`Category "${newCategory.name}" created successfully!`)
      setShowCategoryForm(false)
      // Trigger a data reload to refresh categories
      loadData()
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Failed to create category. Please try again.')
    } finally {
      setCategorySubmitting(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={handleSearch}
        onAddTask={handleAddTask}
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        showCalendarNav={true}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
<CategoryFilter
              categories={categories}
              activeCategory={filters.category}
              onCategoryChange={handleCategoryChange}
              taskCounts={taskCounts}
              onAddCategory={handleAddCategory}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <FilterBar
              activeFilters={filters}
              onFilterChange={handleFilterChange}
              totalTasks={totalTasks}
              completedTasks={completedTasks}
            />

            <TaskList
              searchQuery={searchQuery}
              filters={filters}
              categories={categories}
              onTaskEdit={handleEditTask}
              onAddTask={handleAddTask}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </div>

{/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <TaskForm
            task={editingTask}
            categories={categories}
            onSubmit={handleTaskSubmit}
            onCancel={handleCloseTaskForm}
            isSubmitting={submitting}
          />
        )}
      </AnimatePresence>

      {/* Category Form Modal */}
      <AnimatePresence>
        {showCategoryForm && (
          <CategoryForm
            onSubmit={handleCategorySubmit}
            onCancel={handleCloseCategoryForm}
            isSubmitting={categorySubmitting}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default TaskManager