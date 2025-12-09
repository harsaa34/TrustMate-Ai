// src/components/Groups.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
// import { api } from '../lib/api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus, 
  Settings,
  DollarSign,
  TrendingUp,
  Calendar
} from 'lucide-react';
import Modal from './Modal';

const Groups = () => {
  const { data: user } = useAuth();
  const { groupId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  // Fetch all groups
  const { data: groups, isLoading } = useQuery({
    queryKey: ['user-groups'],
    queryFn: async () => {
      const response = await api.get('/groups');
      return response.data;
    },
    enabled: !!user,
  });

  // Fetch specific group details if groupId is provided
  const { data: groupDetails } = useQuery({
    queryKey: ['group-details', groupId],
    queryFn: async () => {
      if (groupId) {
        const response = await api.get(`/groups/${groupId}`);
        return response.data;
      }
      return null;
    },
    enabled: !!groupId,
  });

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: async (groupData: { name: string; description: string }) => {
      const response = await api.post('/groups', groupData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-groups'] });
      setShowCreateModal(false);
    },
  });

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      await api.delete(`/groups/${groupId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-groups'] });
    },
  });

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: async ({ groupId, userId }: { groupId: string; userId: string }) => {
      const response = await api.post(`/groups/${groupId}/members`, { userId, role: 'member' });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-details', selectedGroup?.id] });
      setShowInviteModal(false);
    },
  });

  const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    await createGroupMutation.mutateAsync({ name, description });
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      await deleteGroupMutation.mutateAsync(groupId);
    }
  };

  const handleInviteMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userId = formData.get('userId') as string;

    if (selectedGroup) {
      await addMemberMutation.mutateAsync({ groupId: selectedGroup.id, userId });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If viewing specific group
  if (groupId && groupDetails) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Group Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{groupDetails.name}</h1>
              <p className="text-gray-600 mt-2">{groupDetails.description}</p>
              <div className="flex items-center space-x-4 mt-4">
                <span className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  {groupDetails.members?.length || 0} members
                </span>
                <span className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  Created {new Date(groupDetails.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedGroup(groupDetails);
                  setShowInviteModal(true);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Invite Member
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Group Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">₹0</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Balance</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">₹0</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{groupDetails.members?.length || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Group Members</h2>
          <div className="space-y-4">
            {groupDetails.members?.map((member: any) => (
              <div key={member.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">{member.userName}</h3>
                    <p className="text-sm text-gray-600">{member.userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    member.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.role}
                  </span>
                  <span className="text-sm text-gray-500">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main groups list view
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
          <p className="text-gray-600 mt-2">Manage your expense sharing groups</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Group
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups && groups.length > 0 ? (
          groups.map((group: any) => (
            <div key={group.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{group.description || 'No description'}</p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/groups/${group.id}`}
                    className="text-indigo-600 hover:text-indigo-800 p-2"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{group.members?.length || 0} members</span>
                </div>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                  {group.createdBy?.id === user?.id ? 'Admin' : 'Member'}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">{new Date(group.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to={`/groups/${group.id}`}
                  className="block w-full bg-indigo-50 text-indigo-600 text-center py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                >
                  View Group
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
            <p className="text-gray-600 mb-6">Create your first group to start sharing expenses</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Group
            </button>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Group">
        <form onSubmit={handleCreateGroup}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Goa Trip 2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Optional description for your group"
              />
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
              disabled={createGroupMutation.isPending}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {createGroupMutation.isPending ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Invite Member Modal */}
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Member">
        <form onSubmit={handleInviteMember}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID *
              </label>
              <input
                type="text"
                name="userId"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter user ID to invite"
              />
              <p className="text-sm text-gray-500 mt-2">
                Note: User must be registered in the system
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addMemberMutation.isPending}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {addMemberMutation.isPending ? 'Inviting...' : 'Invite Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Groups;