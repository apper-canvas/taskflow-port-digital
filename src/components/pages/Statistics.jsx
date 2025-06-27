import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Chart from 'react-apexcharts'
import { taskService } from '@/services/api/taskService'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const Statistics = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await taskService.getStatistics()
      setStats(data)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadStatistics} />
  if (!stats) return null

  // Chart configurations
  const completionTrendOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: { show: false }
    },
    colors: ['#3b82f6'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: stats.completionTrend.map(item => {
        const date = new Date(item.date)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })
    },
    yaxis: {
      title: { text: 'Tasks Completed' }
    },
    grid: {
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} tasks`
      }
    }
  }

  const completionTrendSeries = [{
    name: 'Completed Tasks',
    data: stats.completionTrend.map(item => item.completed)
  }]

  const categoryDistributionOptions = {
    chart: {
      type: 'donut',
      height: 300
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    labels: Object.keys(stats.categoryStats),
    legend: {
      position: 'bottom'
    }
  }

  const categoryDistributionSeries = Object.values(stats.categoryStats)

  const priorityDistributionOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false }
    },
    colors: ['#ef4444', '#f59e0b', '#10b981'],
    xaxis: {
      categories: ['High', 'Medium', 'Low']
    },
    yaxis: {
      title: { text: 'Number of Tasks' }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false
      }
    }
  }

  const priorityDistributionSeries = [{
    name: 'Tasks',
    data: [
      stats.priorityStats.high || 0,
      stats.priorityStats.medium || 0,
      stats.priorityStats.low || 0
    ]
  }]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Statistics Dashboard</h1>
            <p className="text-muted-foreground">Track your productivity and task completion metrics</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Tasks
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ApperIcon name="CheckCircle" size={24} className="text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{stats.completionRate}%</div>
                <div className="text-sm text-muted-foreground">Overall Completion</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {stats.completedTasks} of {stats.totalTasks} tasks completed
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <ApperIcon name="TrendingUp" size={24} className="text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{stats.monthlyCompletionRate}%</div>
                <div className="text-sm text-muted-foreground">Monthly Rate</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Last 30 days completion rate
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <ApperIcon name="AlertCircle" size={24} className="text-red-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{stats.overdueTasks}</div>
                <div className="text-sm text-muted-foreground">Overdue Tasks</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Tasks past their due date
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ApperIcon name="Clock" size={24} className="text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{stats.avgCompletionTimeHours}h</div>
                <div className="text-sm text-muted-foreground">Avg. Time</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Average completion time
            </div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completion Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <ApperIcon name="TrendingUp" size={20} />
              Completion Trend (Last 7 Days)
            </h3>
            <Chart
              options={completionTrendOptions}
              series={completionTrendSeries}
              type="line"
              height={300}
            />
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <ApperIcon name="PieChart" size={20} />
              Category Distribution
            </h3>
            <Chart
              options={categoryDistributionOptions}
              series={categoryDistributionSeries}
              type="donut"
              height={300}
            />
          </motion.div>

          {/* Priority Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <ApperIcon name="BarChart3" size={20} />
              Priority Distribution
            </h3>
            <Chart
              options={priorityDistributionOptions}
              series={priorityDistributionSeries}
              type="bar"
              height={300}
            />
          </motion.div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <ApperIcon name="Target" size={20} />
              Productivity Insights
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Most Active Category</span>
                <span className="text-sm text-muted-foreground capitalize">
                  {Object.entries(stats.categoryStats).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Most Common Priority</span>
                <span className="text-sm text-muted-foreground capitalize">
                  {Object.entries(stats.priorityStats).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Completion Status</span>
                <span className={`text-sm font-medium ${
                  stats.completionRate >= 70 ? 'text-green-600' : 
                  stats.completionRate >= 40 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {stats.completionRate >= 70 ? 'Excellent' : 
                   stats.completionRate >= 40 ? 'Good' : 'Needs Improvement'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Overdue Status</span>
                <span className={`text-sm font-medium ${
                  stats.overdueTasks === 0 ? 'text-green-600' : 
                  stats.overdueTasks <= 2 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {stats.overdueTasks === 0 ? 'On Track' : 
                   stats.overdueTasks <= 2 ? 'Minor Issues' : 'Attention Needed'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Statistics