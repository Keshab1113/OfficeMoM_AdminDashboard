import React, { useState, useEffect } from 'react';
import { Users, HelpCircle, CreditCard, TrendingUp, Eye, UserPlus, FileText, Settings, ArrowUpRight, Calendar, Clock, Activity } from 'lucide-react';
import { usersService, faqsService, pricingService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, trend, description }) => (
  <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-[1.02] group">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-white mb-2">{value}</p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
        {trend && (
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            trend > 0 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            <TrendingUp className={`h-3 w-3 mr-1 ${trend > 0 ? '' : 'rotate-180'}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

const ActivityItem = ({ icon: Icon, title, time, description, color }) => (
  <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-800/30 hover:bg-gray-700/30 transition-colors duration-200 group">
    <div className={`p-2 rounded-lg ${color} mt-1 group-hover:scale-110 transition-transform duration-200`}>
      <Icon className="h-4 w-4 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
        {title}
      </p>
      {description && (
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      )}
      <p className="text-xs text-gray-500 mt-2 flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        {time}
      </p>
    </div>
  </div>
);

const QuickAction = ({ icon: Icon, title, description, color, onClick }) => (
  <button
    onClick={onClick}
    className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-700/30 transition-all duration-300 group text-left"
  >
    <div className={`p-3 rounded-lg ${color} w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
    <p className="text-xs text-gray-400">{description}</p>
    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <ArrowUpRight className="h-4 w-4 text-gray-400" />
    </div>
  </button>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFaqs: 0,
    totalPlans: 0,
    verifiedUsers: 0,
    activeUsers: 0
  });
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [usersRes, faqsRes, plansRes] = await Promise.all([
        usersService.getUsers({ limit: 1 }),
        faqsService.getFaqs(),
        pricingService.getPlans()
      ]);

      // Calculate verified users from your actual data
      const verifiedUsersCount = usersRes.data.users?.filter(user => user.isVerified)?.length || 0;

      setStats({
        totalUsers: usersRes.data.pagination?.totalUsers || 0,
        totalFaqs: faqsRes.data.length,
        totalPlans: plansRes.data.length,
        verifiedUsers: verifiedUsersCount,
        activeUsers: Math.floor((usersRes.data.pagination?.totalUsers || 0) * 0.75) // Mock active users
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentActivities = [
    {
      icon: UserPlus,
      title: 'New user registration',
      description: 'Keshab Das joined the platform',
      time: '2 minutes ago',
      color: 'bg-green-500/20'
    },
    {
      icon: FileText,
      title: 'FAQ content updated',
      description: 'Pricing section modified',
      time: '1 hour ago',
      color: 'bg-blue-500/20'
    },
    {
      icon: Settings,
      title: 'System maintenance',
      description: 'Database optimization completed',
      time: '3 hours ago',
      color: 'bg-purple-500/20'
    },
    {
      icon: Activity,
      title: 'Performance improved',
      description: 'API response time decreased by 15%',
      time: '5 hours ago',
      color: 'bg-orange-500/20'
    }
  ];

  const quickActions = [
    {
      icon: Users,
      title: 'Manage Users',
      description: 'View and manage all users',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      onClick: () => navigate('/users')
    },
    {
      icon: HelpCircle,
      title: 'FAQ System',
      description: 'Manage help content',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      onClick: () => navigate('/faqs')
    },
    {
      icon: CreditCard,
      title: 'Pricing Plans',
      description: 'Configure subscriptions',
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
      onClick: () => navigate('/pricing')
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'View detailed reports',
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      onClick: () => navigate('/analytics')
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-400">
            Welcome back, Administrator. Here's what's happening with your platform today.
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <div className="flex items-center px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-300">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="from-blue-500 to-blue-600"
          trend={12.5}
          description="Active platform users"
        />
        <StatCard
          title="Verified Users"
          value={stats.verifiedUsers}
          icon={Eye}
          color="from-green-500 to-green-600"
          trend={8.2}
          description="Email verified accounts"
        />
        <StatCard
          title="FAQs"
          value={stats.totalFaqs}
          icon={HelpCircle}
          color="from-purple-500 to-purple-600"
          description="Help articles published"
        />
        <StatCard
          title="Pricing Plans"
          value={stats.totalPlans}
          icon={CreditCard}
          color="from-orange-500 to-orange-600"
          trend={5.7}
          description="Active subscription plans"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activity & Quick Actions */}
        <div className="xl:col-span-2 space-y-8">
          {/* Recent Activity */}
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
              <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <ActivityItem
                  key={index}
                  icon={activity.icon}
                  title={activity.title}
                  description={activity.description}
                  time={activity.time}
                  color={activity.color}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <QuickAction
                  key={index}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  color={action.color}
                  onClick={action.onClick}
                />
              ))}
            </div>
          </div>
        </div>

        {/* System Status & Performance */}
        <div className="space-y-8">
          {/* System Status */}
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-semibold text-white mb-6">System Status</h3>
            <div className="space-y-4">
              {[
                { name: 'API Server', status: 'operational', response: '45ms' },
                { name: 'Database', status: 'operational', response: '12ms' },
                { name: 'File Storage', status: 'degraded', response: '230ms' },
                { name: 'Email Service', status: 'operational', response: '89ms' }
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30">
                  <div>
                    <p className="text-sm font-medium text-white">{service.name}</p>
                    <p className="text-xs text-gray-400">Response: {service.response}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.status === 'operational' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {service.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Performance</h3>
            <div className="space-y-4">
              {[
                { metric: 'Uptime', value: '99.9%', trend: 'positive' },
                { metric: 'Load Time', value: '1.2s', trend: 'positive' },
                { metric: 'Error Rate', value: '0.2%', trend: 'neutral' },
                { metric: 'Active Sessions', value: stats.activeUsers, trend: 'positive' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{item.metric}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">{item.value}</span>
                    {item.trend === 'positive' && (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}