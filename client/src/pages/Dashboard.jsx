import React, { useState, useEffect } from 'react';
import { Users, HelpCircle, CreditCard, TrendingUp } from 'lucide-react';
import { usersService, faqsService, pricingService } from '../services/api';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFaqs: 0,
    totalPlans: 0,
    verifiedUsers: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [usersRes, faqsRes, plansRes] = await Promise.all([
        usersService.getUsers({ limit: 1 }),
        faqsService.getFaqs(),
        pricingService.getPlans()
      ]);

      setStats({
        totalUsers: usersRes.data.pagination?.totalUsers || 0,
        totalFaqs: faqsRes.data.length,
        totalPlans: plansRes.data.length,
        verifiedUsers: 0 // You might want to add this to your API
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to OfficeMoM Admin Panel</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="Verified Users"
          value={stats.verifiedUsers}
          icon={TrendingUp}
          color="text-green-600"
        />
        <StatCard
          title="FAQs"
          value={stats.totalFaqs}
          icon={HelpCircle}
          color="text-purple-600"
        />
        <StatCard
          title="Pricing Plans"
          value={stats.totalPlans}
          icon={CreditCard}
          color="text-orange-600"
        />
      </div>

      {/* Recent Activity & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">New user registered</p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">FAQ updated</p>
                <p className="text-sm text-gray-500">1 hour ago</p>
              </div>
              <HelpCircle className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-primary-50 rounded-lg text-primary-700 hover:bg-primary-100 transition-colors text-center">
              <Users className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Manage Users</span>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors text-center">
              <HelpCircle className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Manage FAQs</span>
            </button>
            <button className="p-4 bg-orange-50 rounded-lg text-orange-700 hover:bg-orange-100 transition-colors text-center">
              <CreditCard className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Pricing Plans</span>
            </button>
            <button className="p-4 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition-colors text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}