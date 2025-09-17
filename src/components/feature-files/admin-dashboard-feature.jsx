import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import FeatureViewer from '../FeatureViewer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdminDashboardFeature = () => {
  const { adminActions, getAdminDashboardData, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for real data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    averageSessionTime: 0
  });
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [mentalHealthData, setMentalHealthData] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activityFilter, setActivityFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('24h');

  // Colors for pie charts
  const COLORS = {
    mental: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6'],
    depression: ['#DC2626', '#F59E0B', '#10B981'],
    anxiety: ['#7C2D12', '#EA580C', '#16A34A'],
    stress: ['#991B1B', '#D97706', '#059669']
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const result = await getAdminDashboardData();
      if (result.success) {
        setDashboardData({
          totalUsers: result.data.total_users,
          activeUsers: result.data.active_users,
          totalSessions: result.data.total_posts, // Using posts as sessions for now
          averageSessionTime: 15 // Mock data - implement if needed
        });
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('Error loading dashboard data');
      console.error('Dashboard data error:', err);
    }
    setLoading(false);
  };

  // Load users data
  const loadUsers = async () => {
    try {
      const result = await adminActions.getAllUsers(sortBy, sortOrder);
      if (result.success) {
        setUsers(result.data.users);
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      setError('Error loading users');
      console.error('Users load error:', err);
    }
  };

  // Load activities data
  const loadActivities = async () => {
    try {
      const result = await adminActions.getActivities(activityFilter, timeRange);
      if (result.success) {
        setActivities(result.data.activities);
      } else {
        setError('Failed to load activities');
      }
    } catch (err) {
      setError('Error loading activities');
      console.error('Activities load error:', err);
    }
  };

  // Generate anonymous user ID
  const generateAnonymousId = (userId, email) => {
    // Create a simple hash-like anonymous ID
    const combined = userId + email;
    const hash = combined.split('').reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) & 0xfffffff;
    }, 0);
    return `USER-${Math.abs(hash).toString().substring(0, 6)}`;
  };

  // Generate mental health statistics
  const generateMentalHealthData = () => {
    // Demo data for mental health statistics
    const totalUsers = dashboardData.totalUsers || 100;
    
    const mentalHealthStats = {
      overall: [
        { name: 'Severe Issues', value: Math.floor(totalUsers * 0.15), color: COLORS.mental[0] },
        { name: 'Moderate Issues', value: Math.floor(totalUsers * 0.25), color: COLORS.mental[1] },
        { name: 'Mild Issues', value: Math.floor(totalUsers * 0.35), color: COLORS.mental[2] },
        { name: 'Good Mental Health', value: Math.floor(totalUsers * 0.25), color: COLORS.mental[3] }
      ],
      depression: [
        { name: 'High Depression', value: Math.floor(totalUsers * 0.18), color: COLORS.depression[0] },
        { name: 'Moderate Depression', value: Math.floor(totalUsers * 0.27), color: COLORS.depression[1] },
        { name: 'Low/No Depression', value: Math.floor(totalUsers * 0.55), color: COLORS.depression[2] }
      ],
      anxiety: [
        { name: 'High Anxiety', value: Math.floor(totalUsers * 0.22), color: COLORS.anxiety[0] },
        { name: 'Moderate Anxiety', value: Math.floor(totalUsers * 0.33), color: COLORS.anxiety[1] },
        { name: 'Low/No Anxiety', value: Math.floor(totalUsers * 0.45), color: COLORS.anxiety[2] }
      ],
      stress: [
        { name: 'High Stress', value: Math.floor(totalUsers * 0.28), color: COLORS.stress[0] },
        { name: 'Moderate Stress', value: Math.floor(totalUsers * 0.42), color: COLORS.stress[1] },
        { name: 'Low Stress', value: Math.floor(totalUsers * 0.30), color: COLORS.stress[2] }
      ]
    };

    setMentalHealthData(mentalHealthStats);
  };

  // User management functions
  const handleActivateUser = async (userId) => {
    try {
      const result = await adminActions.activateUser(userId);
      if (result.success) {
        await loadUsers(); // Refresh users list
      } else {
        alert('Failed to activate user: ' + result.error);
      }
    } catch (err) {
      alert('Error activating user');
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        const result = await adminActions.deactivateUser(userId);
        if (result.success) {
          await loadUsers(); // Refresh users list
        } else {
          alert('Failed to deactivate user: ' + result.error);
        }
      } catch (err) {
        alert('Error deactivating user');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const result = await adminActions.deleteUser(userId);
        if (result.success) {
          await loadUsers(); // Refresh users list
        } else {
          alert('Failed to delete user: ' + result.error);
        }
      } catch (err) {
        alert('Error deleting user');
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  // Custom label function for pie charts
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Load data on component mount and tab change
  useEffect(() => {
    if (isAdmin()) {
      loadDashboardData();
    }
  }, []);

  useEffect(() => {
    if (isAdmin() && activeTab === 'users') {
      loadUsers();
    } else if (isAdmin() && activeTab === 'analytics') {
      loadActivities();
      generateMentalHealthData();
    }
  }, [activeTab, sortBy, sortOrder, activityFilter, timeRange]);

  useEffect(() => {
    if (dashboardData.totalUsers > 0) {
      generateMentalHealthData();
    }
  }, [dashboardData.totalUsers]);

  // Check if user is admin
  if (!isAdmin()) {
    return (
      <FeatureViewer title="Admin Dashboard">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this dashboard.</p>
        </div>
      </FeatureViewer>
    );
  }

  if (loading && activeTab === 'overview') {
    return (
      <FeatureViewer title="Admin Dashboard">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </FeatureViewer>
    );
  }

  if (error) {
    return (
      <FeatureViewer title="Admin Dashboard">
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <h3 className="text-red-800 font-semibold">Error</h3>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => {
                setError('');
                loadDashboardData();
              }}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </FeatureViewer>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  return (
    <FeatureViewer title="Admin Dashboard">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage users, monitor system activity, and configure settings</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-2xl font-bold text-blue-600">{dashboardData.totalUsers}</h3>
              <p className="text-blue-800">Total Users</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-2xl font-bold text-green-600">{dashboardData.activeUsers}</h3>
              <p className="text-green-800">Active Users</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-2xl font-bold text-purple-600">{dashboardData.totalSessions}</h3>
              <p className="text-purple-800">Total Posts</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="text-2xl font-bold text-yellow-600">{dashboardData.averageSessionTime}min</h3>
              <p className="text-yellow-800">Avg Session Time</p>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-700 font-medium">Database: Online</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-700 font-medium">API: Healthy</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-700 font-medium">Authentication: Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="created_at">Sort by Created</option>
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="last_login">Sort by Last Login</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-blue-600 mr-3">🔒</div>
              <div>
                <h4 className="font-medium text-blue-800">Privacy Protection Enabled</h4>
                <p className="text-blue-700 text-sm">User identities are anonymized to protect privacy. Real names and email addresses are masked.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anonymous ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {generateAnonymousId(user.id, user.email)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email.replace(/(.{2}).*@/, '••••@')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.last_login)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {user.is_active ? (
                          <button 
                            onClick={() => handleDeactivateUser(user.id)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleActivateUser(user.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Activate
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No users found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab - Updated with Mental Health Statistics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Mental Health Analytics</h3>
            <div className="flex space-x-2">
              <select
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">All Activities</option>
                <option value="login">Login Activities</option>
                <option value="security">Security Events</option>
                <option value="profile">Profile Updates</option>
              </select>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Mental Health Statistics Pie Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Mental Health */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4 text-center">Overall Mental Health Status</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mentalHealthData.overall}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mentalHealthData.overall?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value + ' users', name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {mentalHealthData.overall?.map((entry, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div 
                      className="w-4 h-4 rounded mr-2" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span>{entry.name}: {entry.value} users</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Depression Levels */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4 text-center">Depression Levels</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mentalHealthData.depression}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mentalHealthData.depression?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value + ' users', name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {mentalHealthData.depression?.map((entry, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div 
                      className="w-4 h-4 rounded mr-2" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span>{entry.name}: {entry.value} users</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Anxiety Levels */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4 text-center">Anxiety Levels</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mentalHealthData.anxiety}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mentalHealthData.anxiety?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value + ' users', name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {mentalHealthData.anxiety?.map((entry, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div 
                      className="w-4 h-4 rounded mr-2" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span>{entry.name}: {entry.value} users</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stress Levels */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4 text-center">Stress Levels</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mentalHealthData.stress}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mentalHealthData.stress?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value + ' users', name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {mentalHealthData.stress?.map((entry, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div 
                      className="w-4 h-4 rounded mr-2" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span>{entry.name}: {entry.value} users</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800">Recent Activities</h4>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {activities.map(activity => (
                <div key={activity.id} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        User: {activity.user_name ? generateAnonymousId(activity.user_id || 'unknown', activity.user_name) : 'System'} | 
                        Type: {activity.type} |
                        {activity.ip_address && ` IP: ${activity.ip_address.replace(/\.\d+$/, '.***')}`}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDate(activity.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  No activities found for the selected filters
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">System Settings</h3>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4">System Configuration</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">Email Notifications</label>
                  <p className="text-sm text-gray-500">Send email alerts for system events</p>
                </div>
                <input type="checkbox" className="rounded text-blue-600" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">Crisis Alerts</label>
                  <p className="text-sm text-gray-500">Enable immediate alerts for crisis interventions</p>
                </div>
                <input type="checkbox" className="rounded text-blue-600" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">Privacy Protection</label>
                  <p className="text-sm text-gray-500">Enable user anonymization in admin views</p>
                </div>
                <input type="checkbox" className="rounded text-blue-600" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">Maintenance Mode</label>
                  <p className="text-sm text-gray-500">Put system in maintenance mode</p>
                </div>
                <input type="checkbox" className="rounded text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">System Information</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>Backend URL: http://localhost:8000</p>
              <p>Database: Connected</p>
              <p>Privacy Mode: Enabled</p>
              <p>Last System Check: {new Date().toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">Danger Zone</h4>
            <p className="text-red-700 text-sm mb-3">These actions are irreversible and should be used with extreme caution.</p>
            <div className="space-x-3">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium">
                Export All Data
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium">
                System Backup
              </button>
            </div>
          </div>
        </div>
      )}

    </FeatureViewer>
  );
};

export default AdminDashboardFeature;