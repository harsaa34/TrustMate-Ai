// src/components/Expenses.tsx
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
// import { api } from '../lib/api';
import { Link, useParams } from 'react-router-dom';
import {
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Filter,
  Users,
  Tag,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Modal from './Modal';
import { Calendar } from 'lucide-react'; // Add this

const Expenses = () => {
  const { data: user } = useAuth();
  const { groupId } = useParams();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [filters, setFilters] = useState({
    category: '',
    fromDate: '',
    toDate: '',
    search: ''
  });

  // Fetch user's groups for dropdown
  const { data: groups } = useQuery({
    queryKey: ['user-groups'],
    queryFn: async () => {
      const response = await api.get('/groups');
      return response.data;
    },
    enabled: !!user,
  });

  // Fetch expenses
  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses', groupId, filters],
    queryFn: async () => {
      let url = '/expenses';
      if (groupId) {
        url = `/groups/${groupId}/expenses`;
      }
      
      // Build query params
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.fromDate) params.append('fromDate', filters.fromDate);
      if (filters.toDate) params.append('toDate', filters.toDate);
      if (filters.search) params.append('search', filters.search);
      
      const queryString = params.toString();
      const finalUrl = queryString ? `${url}?${queryString}` : url;
      
      const response = await api.get(finalUrl);
      return response.data;
    },
    enabled: !!user,
  });

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: async (expenseData: any) => {
      const groupId = expenseData.groupId || (groups && groups[0]?.id);
      const response = await api.post(`/groups/${groupId}/expenses`, expenseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setShowCreateModal(false);
    },
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId: string) => {
      const groupId = selectedExpense?.groupId;
      await api.delete(`/groups/${groupId}/expenses/${expenseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const handleCreateExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Get splits from form
    const splitUsers = formData.getAll('splitUserId[]');
    const splitNotes = formData.getAll('splitNote[]');
    
    const splits = splitUsers.map((userId, index) => ({
      userId,
      note: splitNotes[index] || ''
    }));

    const expenseData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      amount: parseFloat(formData.get('amount') as string),
      paidByUserId: formData.get('paidByUserId') as string,
      date: new Date(formData.get('date') as string).toISOString(),
      category: formData.get('category') as string,
      splitType: formData.get('splitType') as string,
      splits: splits.length >= 2 ? splits : [{ userId: user?.id, note: 'Your share' }]
    };

    await createExpenseMutation.mutateAsync(expenseData);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpenseMutation.mutateAsync(expenseId);
    }
  };

  const categories = [
    'food', 'transport', 'accommodation', 'shopping', 
    'entertainment', 'bills', 'health', 'education', 'other'
  ];

  const splitTypes = [
    { value: 'equal', label: 'Equal Split' },
    { value: 'exact', label: 'Exact Amounts' },
    { value: 'percentage', label: 'Percentage Split' },
    { value: 'shares', label: 'By Shares' }
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-2">Track and manage shared expenses</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </h2>
          <button
            onClick={() => setFilters({ category: '', fromDate: '', toDate: '', search: '' })}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Clear Filters
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters({...filters, toDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              placeholder="Search expenses..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {expenses && expenses.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {expenses.map((expense: any) => (
              <div key={expense.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">{expense.title}</h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {expense.category}
                      </span>
                      {expense.verified && (
                        <span className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                    {expense.description && (
                      <p className="text-gray-600 mt-1">{expense.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        ₹{expense.amount.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {expense.paidByUserName}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {expense.splitType} split
                      </span>
                    </div>

                    {/* Splits */}
                    {expense.splits && expense.splits.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Split Details:</p>
                        <div className="space-y-2">
                          {expense.splits.map((split: any, index: number) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{split.userName}</span>
                              <span className="font-medium">₹{split.amount?.toLocaleString() || '0'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedExpense(expense)}
                      className="text-indigo-600 hover:text-indigo-800 p-2"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
            <p className="text-gray-600 mb-6">
              {groupId ? 'This group has no expenses yet' : 'You have no expenses across all groups'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Expense
            </button>
          </div>
        )}
      </div>

      {/* Create Expense Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        title="Add New Expense"
        size="lg"
      >
        <form onSubmit={handleCreateExpense}>
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Dinner at Beach Shack"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  name="amount"
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Optional description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paid By *
                </label>
                <select
                  name="paidByUserId"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select payer</option>
                  <option value={user?.id}>You ({user?.name})</option>
                  {/* Add other group members here */}
                </select>
              </div>
            </div>

            {/* Split Configuration */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Split Configuration</h3>
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Split Type:</label>
                  <select
                    name="splitType"
                    required
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {splitTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {/* Dynamic splits will go here */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Member</label>
                    <select
                      name="splitUserId[]"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value={user?.id}>You ({user?.name})</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                    <input
                      type="text"
                      name="splitNote[]"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Optional note"
                    />
                  </div>
                </div>

                {/* Add more splits button */}
                <button
                  type="button"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Another Member
                </button>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> At least 2 members must be included in expense splits.
                  The payer must be included in the splits.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createExpenseMutation.isPending}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {createExpenseMutation.isPending ? 'Creating...' : 'Create Expense'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;