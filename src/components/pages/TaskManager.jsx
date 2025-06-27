import { AnimatePresence } from 'framer-motion'
import Header from '@/components/organisms/Header'
import TaskList from '@/components/organisms/TaskList'
import TaskForm from '@/components/organisms/TaskForm'
import FilterBar from '@/components/molecules/FilterBar'
import CategoryFilter from '@/components/molecules/CategoryFilter'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { useTaskManager } from '@/hooks/useTaskManager'

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
    </div>
  )
}

export default TaskManager