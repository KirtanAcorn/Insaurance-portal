import React, { useState, useEffect } from 'react';
import { 
  FileText, Sun, Moon, Monitor, ChevronDown, BarChart3, FileCheck, Shield, Users, UserPlus, Mail, MapPin, Clock, Edit, Trash2, X, User, Building, Key, Eye, Settings, } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import NavigationTabs from '../components/NavigationTabs';
import UserManagementHeader from '../components/UserManagementHeader';
import UserStatsGrid from '../components/UserStatsGrid';
import UserTable from '../components/UserTable';

const UserManagementDashboard = () => {
  const [theme, setTheme] = useState('system');
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('Users');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    department: '',
    location: '',
    userRole: '',
    accountActive: true
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    location: '',
    userRole: '',
    accountStatus: 'Active',
    temporaryPassword: '',
    companyAccess: [],
    permissions: {
      viewClaims: true,
      processClaims: false,
      createPolicies: false,
      manageUsers: false
    },
    additionalNotes: ''
  });
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(systemDark);
      } else {
        setIsDark(theme === 'dark');
      }
    };

    updateTheme();
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  const stats = [
    {
      title: 'Total Users',
      value: '4',
      change: '+2 from last month',
      changeType: 'positive',
      color: 'bg-blue-500'
    },
    {
      title: 'Active Users',
      value: '3',
      change: '+1 from last month',
      changeType: 'positive',
      color: 'bg-green-500'
    },
    {
      title: 'Agents',
      value: '1',
      change: '0 from last month',
      changeType: 'neutral',
      color: 'bg-purple-500'
    },
    {
      title: 'Clients',
      value: '2',
      change: '+1 from last month',
      changeType: 'positive',
      color: 'bg-orange-500'
    }
  ];

  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@astutehealth.com',
      location: 'London, UK',
      role: 'Client',
      status: 'Active',
      department: 'Operations',
      lastLogin: '2024-01-15',
      policies: 3,
      claims: 1,
      avatar: 'JS',
      phoneNumber: '+44 20 7123 4567'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@plb.com',
      location: 'Manchester, UK',
      role: 'Agent',
      status: 'Active',
      department: 'Insurance',
      lastLogin: '2024-01-14',
      policies: 45,
      claims: 12,
      avatar: 'SJ',
      phoneNumber: '+44 20 7123 4568'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@insurance.com',
      location: 'Birmingham, UK',
      role: 'Admin',
      status: 'Active',
      department: 'Administration',
      lastLogin: '2024-01-13',
      policies: 234,
      claims: 89,
      avatar: 'MW',
      phoneNumber: '+44 20 7123 4569'
    },
    {
      id: 4,
      name: 'Emma Davis',
      email: 'emma.davis@client.com',
      location: 'Leeds, UK',
      role: 'Client',
      status: 'Inactive',
      department: 'Finance',
      lastLogin: '2024-01-01',
      policies: 2,
      claims: 0,
      avatar: 'ED',
      phoneNumber: '+44 20 7123 4570'
    }
  ];

  const tabs = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Claims', icon: FileCheck },
    { name: 'Policies', icon: Shield },
    { name: 'Users', icon: Users, active: true }
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'Client': return 'bg-green-100 text-green-800 border-green-200';
      case 'Agent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleDarkColor = (role) => {
    switch (role) {
      case 'Client': return 'bg-green-900 text-green-200 border-green-700';
      case 'Agent': return 'bg-blue-900 text-blue-200 border-blue-700';
      case 'Admin': return 'bg-purple-900 text-purple-200 border-purple-700';
      default: return 'bg-gray-800 text-gray-200 border-gray-600';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'text-green-600 bg-green-50 border-green-200' 
      : 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusDarkColor = (status) => {
    return status === 'Active' 
      ? 'text-green-400 bg-green-900 border-green-700' 
      : 'text-red-400 bg-red-900 border-red-700';
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      fullName: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      department: user.department,
      location: user.location,
      userRole: user.role,
      accountActive: user.status === 'Active'
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setEditFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      department: '',
      location: '',
      userRole: '',
      accountActive: true
    });
  };

  const handleUpdateUser = () => {
    console.log('Updating user:', editFormData);
    // Here you would typically make an API call to update the user
    handleCloseModal();
  };

  const handleFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFormChangeCreateUser = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCompanyAccessChange = (company) => {
    setFormData(prev => ({
      ...prev,
      companyAccess: prev.companyAccess.includes(company)
        ? prev.companyAccess.filter(c => c !== company)
        : [...prev.companyAccess, company]
    }));
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  const handleCloseModalCreateUser = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateUser = () => {
    console.log('Creating user:', formData);
    // Handle user creation logic here
    setIsCreateModalOpen(false);
  };

  const handleCloseDeleteModal = () => setDeleteModalOpen(false);
const handleConfirmDelete = () => {
  // your delete logic here
  deleteUser(selectedUser.id); // Or however your function is set
  setDeleteModalOpen(false);
};

  const companies = [
    'Astute Healthcare Limited',
    'Tech Solutions Ltd',
    'Manufacturing Co Ltd'
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      
      {/* Header */}
      <DashboardHeader
      isDark={isDark}
      theme={theme}
      setTheme={setTheme}
      />

      {/* Navigation Tabs */}
      <NavigationTabs
      isDark={isDark}
      tabs={tabs}
      activeTabChanger={setActiveTab}

      />

      {/* Main Content */}
      <main className="p-6">
        {/* User Management Header */}
        <UserManagementHeader
        openCreateModal={setIsCreateModalOpen}
        />

        {/* Stats Grid */}
        <UserStatsGrid
        stats={stats}
        isDark={isDark}
        />

        {/* All Users Section */}
        <UserTable
        isDark={isDark}
        users={users}
        getRoleDarkColor={getRoleDarkColor}
        getRoleColor={getRoleColor}
        getStatusDarkColor={getStatusDarkColor}
        getStatusColor={getStatusColor}
        handleEditUser={handleEditUser}
        openDeleteModal={setDeleteModalOpen}
        />

        {/* Edit User Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <div className={`w-full max-w-2xl rounded-xl shadow-2xl transition-colors ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              {/* Modal Header */}
              <div className={`px-6 py-4 border-b flex items-center justify-between ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Edit className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Edit User: {selectedUser?.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Update user information, permissions, and access levels
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-6">
                {/* Personal Information Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Personal Information
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Full Name */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editFormData.fullName}
                        onChange={(e) => handleFormChange('fullName', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        disabled
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={editFormData.phoneNumber}
                        onChange={(e) => handleFormChange('phoneNumber', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    {/* Department */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Department
                      </label>
                      <select
                        value={editFormData.department}
                        onChange={(e) => handleFormChange('department', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="Operations">Operations</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Administration">Administration</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Location
                      </label>
                      <input
                        type="text"
                        value={editFormData.location}
                        onChange={(e) => handleFormChange('location', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    {/* User Role */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        User Role
                      </label>
                      <select
                        value={editFormData.userRole}
                        onChange={(e) => handleFormChange('userRole', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="Client">👤 Client</option>
                        <option value="Agent">⚡ Agent</option>
                        <option value="Admin">👑 Admin</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Account Status Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Shield className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                    <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Account Status
                    </h4>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="accountActive"
                        checked={editFormData.accountActive}
                        onChange={(e) => handleFormChange('accountActive', e.target.checked)}
                        className="sr-only"
                      />
                      <label
                        htmlFor="accountActive"
                        className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                          editFormData.accountActive ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          editFormData.accountActive ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}></div>
                      </label>
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Account Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`px-6 py-4 border-t flex items-center justify-end space-x-3 ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <button
                  onClick={handleCloseModal}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isDark 
                      ? 'text-gray-300 border border-gray-600 hover:bg-gray-700' 
                      : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                >
                  Update User
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <div className="flex min-h-full items-start justify-center p-4 py-8">
            <div className={`fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between rounded-xl ${
              isDark ? 'border-gray-700 bg-gray-800' : 'border-white bg-white'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Create New User
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Add a new user to the system with appropriate permissions and access levels
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModalCreateUser}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              {/* Personal Information Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Personal Information
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* First Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => handleFormChangeCreateUser('firstName', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter last name"
                      value={formData.lastName}
                                              onChange={(e) => handleFormChangeCreateUser('lastName', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                                              onChange={(e) => handleFormChangeCreateUser('email', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter phone number"
                      value={formData.phoneNumber}
                                              onChange={(e) => handleFormChangeCreateUser('phoneNumber', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Department
                    </label>
                    <select
                      value={formData.department}
                                              onChange={(e) => handleFormChangeCreateUser('department', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Select department</option>
                      <option value="Operations">Operations</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Administration">Administration</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Enter location"
                      value={formData.location}
                                              onChange={(e) => handleFormChangeCreateUser('location', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Role and Access Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Role and Access
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* User Role */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      User Role
                    </label>
                    <select
                      value={formData.userRole}
                                              onChange={(e) => handleFormChangeCreateUser('userRole', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Select user role</option>
                      <option value="Client">👤 Client</option>
                      <option value="Agent">⚡ Agent</option>
                      <option value="Admin">👑 Admin</option>
                    </select>
                  </div>

                  {/* Account Status */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Account Status
                    </label>
                    <select
                      value={formData.accountStatus}
                                              onChange={(e) => handleFormChangeCreateUser('accountStatus', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="Active">🟢 Active</option>
                      <option value="Inactive">🔴 Inactive</option>
                      <option value="Pending">🟡 Pending</option>
                    </select>
                  </div>
                </div>

                {/* Temporary Password */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Temporary Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter temporary password"
                    value={formData.temporaryPassword}
                                          onChange={(e) => handleFormChangeCreateUser('temporaryPassword', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>

              {/* Company Access Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Building className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Company Access
                  </h4>
                </div>
                
                <div className={`space-y-3 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  {companies.map((company) => (
                    <div key={company} className="flex items-center space-x-3">
                      <div className="relative">
                        <input
                          type="radio"
                          id={company}
                          name="companyAccess"
                          checked={formData.companyAccess.includes(company)}
                          onChange={() => handleCompanyAccessChange(company)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                      <label
                        htmlFor={company}
                        className={`flex items-center space-x-2 cursor-pointer ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        <Building className="w-4 h-4 text-blue-500" />
                        <span>{company}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permissions Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Key className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                  <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Permissions
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* View Claims */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Eye className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        View Claims
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="viewClaims"
                        checked={formData.permissions.viewClaims}
                        onChange={() => handlePermissionChange('viewClaims')}
                        className="sr-only"
                      />
                      <label
                        htmlFor="viewClaims"
                        className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                          formData.permissions.viewClaims ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          formData.permissions.viewClaims ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}></div>
                      </label>
                    </div>
                  </div>

                  {/* Process Claims */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Settings className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Process Claims
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="processClaims"
                        checked={formData.permissions.processClaims}
                        onChange={() => handlePermissionChange('processClaims')}
                        className="sr-only"
                      />
                      <label
                        htmlFor="processClaims"
                        className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                          formData.permissions.processClaims ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          formData.permissions.processClaims ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}></div>
                      </label>
                    </div>
                  </div>

                  {/* Create Policies */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Create Policies
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="createPolicies"
                        checked={formData.permissions.createPolicies}
                        onChange={() => handlePermissionChange('createPolicies')}
                        className="sr-only"
                      />
                      <label
                        htmlFor="createPolicies"
                        className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                          formData.permissions.createPolicies ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          formData.permissions.createPolicies ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}></div>
                      </label>
                    </div>
                  </div>

                  {/* Manage Users */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Manage Users
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="manageUsers"
                        checked={formData.permissions.manageUsers}
                        onChange={() => handlePermissionChange('manageUsers')}
                        className="sr-only"
                      />
                      <label
                        htmlFor="manageUsers"
                        className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                          formData.permissions.manageUsers ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          formData.permissions.manageUsers ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes Section */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Add any additional notes or comments about this user..."
                  value={formData.additionalNotes}
                                      onChange={(e) => handleFormChangeCreateUser('additionalNotes', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t flex items-center justify-end space-x-3 rounded-xl ${
              isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
              <button
                onClick={handleCloseModalCreateUser}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  isDark 
                    ? 'text-gray-300 border-gray-600 hover:bg-gray-700' 
                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create User</span>
              </button>
            </div>
           </div>
          </div>
        </div>
      )}
      
      {/*Delete Modal*/}
      {isDeleteModalOpen && (
  <div className="fixed flex justify-center items-center inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
    <div
      className={`w-full max-w-md rounded-xl shadow-2xl p-6 transition-colors ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Delete User</h3>
          </div>
        </div>
        <button
          onClick={handleCloseDeleteModal}
          className={`p-2 rounded-lg ${
            isDark
              ? "text-gray-400 hover:text-white hover:bg-gray-700"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
        >
          ×
        </button>
      </div>

      {/* Modal Body */}
      <p className="text-sm mb-6">
        Are you sure you want to delete this user? This action cannot be undone and will remove all associated data.
      </p>

      {/* Modal Footer */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={handleCloseDeleteModal}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            isDark
              ? "text-gray-300 border border-gray-600 hover:bg-gray-700"
              : "text-gray-700 border border-gray-300 hover:bg-gray-100"
          }`}
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmDelete}
          className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
        >
          Delete User
        </button>
      </div>
    </div>
  </div>
)}



      </main>
    </div>
  );
};

export default UserManagementDashboard;

