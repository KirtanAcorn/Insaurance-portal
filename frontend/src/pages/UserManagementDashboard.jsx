import React, { useState, useEffect } from 'react';
import { 
  FileText, Sun, Moon, Monitor, ChevronDown, BarChart3, FileCheck, Shield, Users, UserPlus, Mail, MapPin, Clock, Edit, Trash2, X, User, Building, Key, Eye, Settings, } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import NavigationTabs from '../components/NavigationTabs';
import UserManagementHeader from '../components/UserManagementHeader';
import UserStatsGrid from '../components/UserStatsGrid';
import UserTable from '../components/UserTable';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import DeleteUserModal from '../components/DeleteUserModal';

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
  // deleteUser(selectedUser.id); // Or however your function is set
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

        {/* Create User Modal */}

        <AddUserModal
        isCreateModalOpen={isCreateModalOpen}
        isDark={isDark}
        handleCloseModalCreateUser={handleCloseModalCreateUser}
        formData={formData}
        handleFormChangeCreateUser={handleFormChangeCreateUser}
        companies={companies}
        handleCompanyAccessChange={handleCompanyAccessChange}
        handlePermissionChange={handlePermissionChange}
        handleCreateUser={handleCreateUser}
        />


        {/* Edit User Modal */}
        <EditUserModal
        isEditModalOpen={isEditModalOpen}
        isDark={isDark}
        selectedUser={selectedUser}
        handleCloseModal={handleCloseModal}
        editFormData={editFormData}
        handleFormChange={handleFormChange}
        handleUpdateUser={handleUpdateUser}
        />


      
      {/*Delete Modal*/}
      <DeleteUserModal
      isDeleteModalOpen={isDeleteModalOpen}
      isDark={isDark}
      handleCloseDeleteModal={handleCloseDeleteModal}
      handleConfirmDelete={handleConfirmDelete}
      />
      </main>
    </div>
  );
};

export default UserManagementDashboard;

