// src/components/Dashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
// import { api } from '../api/generated';
import { Link } from 'react-router-dom';
import { Users, DollarSign, TrendingUp, CreditCard, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
  {/* TAILWIND TEST - Remove this after testing */}
  <div className="p-6 bg-red-500 text-white rounded-lg mb-6 shadow-lg">
    <h2 className="text-xl font-bold">?? Tailwind CSS Test</h2>
    <p>If this box is red with white text, Tailwind is working!</p>
    <div className="flex space-x-4 mt-4">
      <div className="w-20 h-20 bg-blue-500 rounded"></div>
      <div className="w-20 h-20 bg-green-500 rounded"></div>
      <div className="w-20 h-20 bg-yellow-500 rounded"></div>
    </div>
    <button className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
      Test Button
    </button>
  </div>
  const { data: user } = useAuth();

  // Fetch user's groups
  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['user-groups'],
    queryFn: async () => {
      const response = await api.get('/groups');
      return response.data;
    },
    enabled: !!user,
  });

  // Fetch recent expenses
  const { data: recentExpenses, isLoading: expensesLoading } = useQuery({
    queryKey: ['recent-expenses'],
    queryFn: async () => {
      // Get first group's expenses
      if (groups && groups.length > 0) {
        const response = await api.get(`/groups/${groups[0].id}/expenses?limit=5`);
        return response.data;
      }
      return [];
    },
    enabled: !!groups && groups.length > 0,
  });

  // Calculate stats
  const totalGroups = groups?.length || 0;
  const totalExpenses = recentExpenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0;
  const pendingSettlements = 1000; // Hardcoded for now - you owe ₹1000 from earlier test

  const isLoading = groupsLoading || expensesLoading;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Groups',
      value: totalGroups,
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      color: 'bg-indigo-50',
      link: '/groups',
      change: '+2 this month',
      trend: 'up'
    },
    {
      title: 'Total Expenses',
      value: `₹${totalExpenses.toLocaleString()}`,
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      color: 'bg-green-50',
      link: '/expenses',
      change: '₹15,000 this month',
      trend: 'up'
    },
    {
      title: 'Pending Settlements',
      value: `₹${pendingSettlements.toLocaleString()}`,
      icon: <CreditCard className="h-8 w-8 text-yellow-600" />,
      color: 'bg-yellow-50',
      link: '/settlements',
      change: '1 pending',
      trend: 'neutral'
    },
    {
      title: 'Active Members',
      value: '2',
      icon: <Activity className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-50',
      link: '/groups',
      change: 'Across all groups',
      trend: 'neutral'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              {card.icon}
            </div>
            <div className="flex items-center text-sm">
              {card.trend === 'up' && <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />}
              {card.trend === 'down' && <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />}
              <span className="text-gray-600">{card.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/groups/new"
            className="bg-indigo-600 text-white px-6 py-4 rounded-lg font-medium text-center hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Users className="h-5 w-5" />
            <span>Create New Group</span>
          </Link>
          <Link
            to="/expenses/new"
            className="bg-green-600 text-white px-6 py-4 rounded-lg font-medium text-center hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <DollarSign className="h-5 w-5" />
            <span>Add Expense</span>
          </Link>
          <Link
            to="/settlements/new"
            className="bg-yellow-600 text-white px-6 py-4 rounded-lg font-medium text-center hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-2"
          >
            <CreditCard className="h-5 w-5" />
            <span>Create Settlement</span>
          </Link>
        </div>
      </div>

      {/* Recent Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Groups</h2>
            <Link to="/groups" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {groups && groups.length > 0 ? (
              groups.slice(0, 3).map((group: any) => (
                <Link
                  key={group.id}
                  to={`/groups/${group.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-600">{group.description || 'No description'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{group.members?.length || 0} members</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No groups yet</p>
                <Link
                  to="/groups/new"
                  className="inline-block mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Create your first group
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Expenses</h2>
            <Link to="/expenses" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentExpenses && recentExpenses.length > 0 ? (
              recentExpenses.map((expense: any) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{expense.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>₹{expense.amount.toLocaleString()}</span>
                      <span>•</span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="px-2 py-1 bg-gray-200 rounded text-xs">{expense.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{expense.paidByUserName}</p>
                    <p className="text-xs text-gray-500">Paid by</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No expenses yet</p>
                <p className="text-sm text-gray-500 mt-2">Add expenses to track shared costs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
