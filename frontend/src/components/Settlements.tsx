// src/components/Settlements.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
// import { api } from '../lib/api';
import { Link, useParams } from 'react-router-dom';
import {
  CreditCard,
  Plus,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  DollarSign,
  RefreshCw,
  Download
} from 'lucide-react';
import Modal from './Modal';

const Settlements = () => {
  const { data: user } = useAuth();
  const { groupId } = useParams();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<any>(null);

  // Fetch settlements
  const { data: settlements, isLoading } = useQuery({
    queryKey: ['settlements', groupId],
    queryFn: async () => {
      let url = '/settlements';
      if (groupId) {
        url = `/groups/${groupId}/settlements`;
      }
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!user,
  });

  // Fetch balances
  const { data: balances } = useQuery({
    queryKey: ['balances', groupId],
    queryFn: async () => {
      let url = '/expenses/balances';
      if (groupId) {
        url = `/groups/${groupId}/expenses/balances`;
      }
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!user,
  });

  // Fetch optimized settlements
  const { data: optimizedSettlements } = useQuery({
    queryKey: ['optimized-settlements', groupId],
    queryFn: async () => {
      let url = '/settlements/optimize';
      if (groupId) {
        url = `/groups/${groupId}/settlements/optimize`;
      }
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!user,
  });

  // Create settlement mutation
  const createSettlementMutation = useMutation({
    mutationFn: async (settlementData: any) => {
      const groupId = settlementData.groupId || (settlements && settlements[0]?.groupId);
      const response = await api.post(`/groups/${groupId}/settlements`, settlementData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      setShowCreateModal(false);
    },
  });

  // Auto-create settlements mutation
  const autoCreateSettlementsMutation = useMutation({
    mutationFn: async () => {
      let url = '/settlements/optimize/auto-create';
      if (groupId) {
        url = `/groups/${groupId}/settlements/optimize/auto-create`;
      }
      const response = await api.post(url);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      setShowOptimizeModal(false);
    },
  });

  const handleCreateSettlement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const settlementData = {
      fromUserId: formData.get('fromUserId') as string,
      toUserId: formData.get('toUserId') as string,
      amount: parseFloat(formData.get('amount') as string),
      date: new Date(formData.get('date') as string).toISOString(),
      description: formData.get('description') as string,
      paymentMethod: formData.get('paymentMethod') as string,
    };

    await createSettlementMutation.mutateAsync(settlementData);
  };

  const handleAutoCreateSettlements = async () => {
    if (window.confirm('This will automatically create settlements to clear all balances. Continue?')) {
      await autoCreateSettlementsMutation.mutateAsync();
    }
  };

  const paymentMethods = [
    'cash', 'bank_transfer', 'upi', 'credit_card', 'debit_card', 'paypal', 'other'
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
          <h1 className="text-3xl font-bold text-gray-900">Settlements</h1>
          <p className="text-gray-600 mt-2">Manage debt settlements between members</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowOptimizeModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 flex items-center"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Optimize
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Settlement
          </button>
        </div>
      </div>

      {/* Current Balances */}
      {balances && balances.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Current Balances
            </h2>
            <span className="text-sm text-gray-600">
              Positive = you owe money, Negative = you are owed money
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {balances.map((balance: any, index: number) => (
              <div key={index} className={`p-4 rounded-lg ${
                balance.netBalance > 0 ? 'bg-red-50' : 
                balance.netBalance < 0 ? 'bg-green-50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{balance.userName}</p>
                    <p className="text-sm text-gray-600">{balance.userEmail}</p>
                  </div>
                  <div className={`text-lg font-bold ${
                    balance.netBalance > 0 ? 'text-red-600' : 
                    balance.netBalance < 0 ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {balance.netBalance > 0 ? '+' : ''}
                    ₹{Math.abs(balance.netBalance).toLocaleString()}
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>You owe:</span>
                    <span className="font-medium">₹{balance.totalOwed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Owes you:</span>
                    <span className="font-medium">₹{balance.totalOwedToYou.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimized Settlements */}
      {optimizedSettlements && optimizedSettlements.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Optimized Settlements</h2>
            <button
              onClick={handleAutoCreateSettlements}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center"
              disabled={autoCreateSettlementsMutation.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${autoCreateSettlementsMutation.isPending ? 'animate-spin' : ''}`} />
              {autoCreateSettlementsMutation.isPending ? 'Creating...' : 'Auto-create All'}
            </button>
          </div>
          <div className="space-y-4">
            {optimizedSettlements.map((settlement: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">
                      {settlement.fromUserName} → {settlement.toUserName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Suggested settlement to minimize transactions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ₹{settlement.amount.toLocaleString()}
                  </p>
                  <button
                    onClick={() => {
                      // Pre-fill create form with this settlement
                      // setFormData(settlement);
                      setShowCreateModal(true);
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Use this
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settlements History */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Settlement History</h2>
        </div>
        
        {settlements && settlements.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {settlements.map((settlement: any) => (
              <div key={settlement.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {settlement.fromUserName} → {settlement.toUserName}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        settlement.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : settlement.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {settlement.status}
                      </span>
                    </div>
                    
                    {settlement.description && (
                      <p className="text-gray-600 mt-1">{settlement.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        ₹{settlement.amount.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(settlement.date).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {settlement.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    {settlement.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            // Mark as completed
                          }}
                          className="text-green-600 hover:text-green-800 p-2"
                          title="Mark as completed"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            // Cancel settlement
                          }}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Cancel"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No settlements yet</h3>
            <p className="text-gray-600 mb-6">
              Settle outstanding balances between group members
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First Settlement
            </button>
          </div>
        )}
      </div>

      {/* Create Settlement Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        title="Create Settlement"
      >
        <form onSubmit={handleCreateSettlement}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From User *
                </label>
                <select
                  name="fromUserId"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select payer</option>
                  {/* Populate with group members */}
                  <option value={user?.id}>You ({user?.name})</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To User *
                </label>
                <select
                  name="toUserId"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select receiver</option>
                  {/* Populate with group members */}
                </select>
              </div>
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
                Description
              </label>
              <input
                type="text"
                name="description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Settling dinner bill"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <select
                name="paymentMethod"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select method</option>
                {paymentMethods.map(method => (
                  <option key={method} value={method}>
                    {method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
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
              disabled={createSettlementMutation.isPending}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {createSettlementMutation.isPending ? 'Creating...' : 'Create Settlement'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Optimize Modal */}
      <Modal 
        isOpen={showOptimizeModal} 
        onClose={() => setShowOptimizeModal(false)} 
        title="Optimize Settlements"
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">How optimization works:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Calculates minimum number of transactions to settle all debts</li>
              <li>• Reduces total money movement between members</li>
              <li>• Automatically creates settlements to clear balances</li>
            </ul>
          </div>

          {optimizedSettlements && optimizedSettlements.length > 0 ? (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Recommended Settlements:</h4>
              <div className="space-y-3">
                {optimizedSettlements.map((settlement: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {settlement.fromUserName} → {settlement.toUserName}
                      </p>
                      <p className="text-sm text-gray-600">Clears ₹{settlement.amount.toLocaleString()} debt</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{settlement.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  This will create {optimizedSettlements.length} settlement(s) to clear all outstanding balances.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No optimization needed. All balances are settled.</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={() => setShowOptimizeModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAutoCreateSettlements}
              disabled={!optimizedSettlements || optimizedSettlements.length === 0 || autoCreateSettlementsMutation.isPending}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {autoCreateSettlementsMutation.isPending ? 'Creating...' : 'Auto-create Settlements'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settlements;