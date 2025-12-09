// src/components/Analytics.tsx
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
// import { api } from '../lib/api';
import { Link, useParams } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Download,
  Filter
} from 'lucide-react';

const Analytics = () => {
  const { data: user } = useAuth();
  const { groupId } = useParams();
  const [timeRange, setTimeRange] = useState('month');

  // Fetch expenses summary
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['expenses-summary', groupId, timeRange],
    queryFn: async () => {
      let url = '/expenses/summary';
      if (groupId) {
        url = `/groups/${groupId}/expenses/summary`;
      }
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!user,
  });

  // Fetch expenses insights
  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ['expenses-insights', groupId],
    queryFn: async () => {
      let url = '/expenses/insights';
      if (groupId) {
        url = `/groups/${groupId}/expenses/insights`;
      }
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!user,
  });

  // Fetch settlements statistics
  const { data: settlementStats, isLoading: statsLoading } = useQuery({
    queryKey: ['settlements-statistics', groupId],
    queryFn: async () => {
      let url = '/settlements/statistics';
      if (groupId) {
        url = `/groups/${groupId}/settlements/statistics`;
      }
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!user,
  });

  const isLoading = summaryLoading || insightsLoading || statsLoading;

  // Prepare data for charts
  const categoryData = summary?.categoryBreakdown?.map((item: any) => ({
    name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    value: item.totalAmount,
    percentage: item.percentage
  })) || [];

  const monthlyData = summary?.monthlyBreakdown?.map((item: any) => ({
    name: item.month,
    expenses: item.totalAmount,
    average: item.averageAmount
  })) || [];

  const userContributionData = summary?.userContributions?.map((item: any) => ({
    name: item.userName,
    paid: item.totalPaid,
    owed: item.totalOwed,
    balance: item.netBalance
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Insights and reports for your expense sharing</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ₹{summary?.totalAmount?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">{summary?.expenseCount || 0} expenses</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average per Expense</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ₹{summary?.averageAmount?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Across all categories</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {summary?.activeMembers || 0}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Involved in expenses</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Settlements</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {settlementStats?.totalSettlements || 0}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">₹{settlementStats?.totalSettledAmount?.toLocaleString() || '0'} settled</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2" />
              Expenses by Category
            </h2>
            <span className="text-sm text-gray-600">{categoryData.length} categories</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <BarChartIcon className="h-5 w-5 mr-2" />
              Monthly Expenses Trend
            </h2>
            <span className="text-sm text-gray-600">{monthlyData.length} months</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                />
                <Legend />
                <Bar dataKey="expenses" name="Total Expenses" fill="#8884d8" />
                <Bar dataKey="average" name="Average per Expense" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Contributions */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">User Contributions</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userContributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
              />
              <Legend />
              <Bar dataKey="paid" name="Total Paid" fill="#0088FE" />
              <Bar dataKey="owed" name="Total Owed" fill="#00C49F" />
              <Bar dataKey="balance" name="Net Balance" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Cards */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Insights</h3>
            <ul className="space-y-3">
              {insights.topSpenders?.map((spender: any, index: number) => (
                <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{spender.userName}</p>
                    <p className="text-sm text-gray-600">Top spender in group</p>
                  </div>
                  <span className="font-bold text-gray-900">₹{spender.totalPaid.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <ul className="space-y-3">
              {insights.recentActivity?.map((activity: any, index: number) => (
                <li key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    {activity.type === 'expense' ? (
                      <DollarSign className="h-4 w-4 text-indigo-600" />
                    ) : (
                      <CreditCard className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-600">{activity.date}</p>
                  </div>
                  <span className={`font-bold ${
                    activity.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₹{Math.abs(activity.amount).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;