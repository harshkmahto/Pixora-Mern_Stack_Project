import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Edit2, 
  Users, 
  Shield, 
  User,
  RefreshCw,
  X,
  Calendar,
  Mail,
  UserCircle,
  PieChart
} from 'lucide-react';
import SummaryApi from '../../common';
import apiRequest from '../../utils/apiRequest';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    users: 0,
    active: 0
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiRequest(SummaryApi.auth.allUsers);
      
      setUsers(response.users);
      
      // Calculate stats
      const admins = response.users.filter(u => u.role === 'admin').length;
      const normalUsers = response.users.filter(u => u.role === 'user').length;
      const active = response.users.filter(u => u.status === 'active').length;
      
      setStats({
        total: response.totalUsers,
        admins,
        users: normalUsers,
        active
      });
      
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  // Open view modal
  const openViewModal = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (user, e) => {
    e.stopPropagation();
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 text-center mb-4">{error}</p>
        <button
          onClick={fetchUsers}
          className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw size={18} className="mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Manage All Users
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage all users in the system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Users */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              +{stats.total}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.total}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
        </div>

        {/* Admin Users */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.admins}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Admin Users</p>
        </div>

        {/* Normal Users */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.users}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Normal Users</p>
        </div>

        {/* Active Users */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <PieChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.active}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-1 items-center space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchUsers}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 sm:mt-0">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">User</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Email</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Role</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Joined</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr 
                  key={user._id} 
                  onClick={() => openViewModal(user)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.profile || `https://ui-avatars.com/api/?name=${user.name}&background=8B5CF6&color=fff`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {user._id?.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {user.role === 'admin' ? <Shield size={12} className="mr-1" /> : <User size={12} className="mr-1" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar size={14} />
                      <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={(e) => openEditModal(user, e)}
                      className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                      title="Edit user"
                    >
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View User Modal */}
      {isViewModalOpen && selectedUser && (
        <ViewUserModal
          user={selectedUser}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

// View User Modal Component
const ViewUserModal = ({ user, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Profile</h3>
        <button 
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={user.profile || `https://ui-avatars.com/api/?name=${user.name}&background=8B5CF6&color=fff&size=128`}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 dark:border-purple-900 mb-4"
          />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h2>
          <div className="flex items-center space-x-2">
            <Mail size={14} className="text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{user.email}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Role</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              user.role === 'admin' 
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {user.role === 'admin' ? <Shield size={12} className="mr-1" /> : <User size={12} className="mr-1" />}
              {user.role}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              user.status === 'active'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {user.status || 'inactive'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Joined</span>
            <span className="text-sm text-gray-900 dark:text-white">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">User ID</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {user._id}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

// Edit User Modal Component (Coming Soon)
const EditUserModal = ({ user, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit User</h3>
        <button 
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 text-center">
        <div className="mb-4">
          <img
            src={user.profile || `https://ui-avatars.com/api/?name=${user.name}&background=8B5CF6&color=fff&size=128`}
            alt={user.name}
            className="w-20 h-20 rounded-full mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{user.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>

        <div className="py-8">
          <UserCircle className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Coming Soon!</h4>
          <p className="text-gray-600 dark:text-gray-400">
            The edit user feature is currently under development.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default AllUsers;