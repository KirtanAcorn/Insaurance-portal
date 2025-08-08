import { useState, useEffect } from 'react';
import { FileText, ChevronDownIcon, UserIcon, Sun, Moon, Monitor, ChevronDown, BarChart3, FileCheck, Shield, Users, UserPlus, Mail, MapPin, Clock, Edit, Trash2, X, User, Building, Key, Eye, Settings, ClipboardList, BuildingIcon, TruckIcon, ShipIcon } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import NavigationTabs from '../components/NavigationTabs';
import Userr from "./tabs/Userr"
import Claims from './tabs/Claims';
import toast from 'react-hot-toast';
import Policies from './tabs/Policies';

const Dashboard = () => {
  const [theme, setTheme] = useState('system');
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('Users');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpenClaim, setIsEditModalOpenClaim] = useState(false)
  const [activeTabClaim, setActiveTabClaim] = useState('claim')
  const [isModalOpenNew, setIsModalOpenNew] = useState(false);
  const [activeTabNew, setActiveTabNew] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [formDataNew, setFormDataNew] = useState({
    company: '',
    policy: '',
    claimType: '',
    claimAmount: '',
    incidentDescription: '',
    incidentDate: ''
  });
  const [editFormDataClaim, setEditFormDataClaim] = useState({
    claimId: 'CLM-2024-001',
    claimType: 'Water Damage',
    claimAmount: '15000',
    description: 'Water damage to building foundation due to burst pipe',
    status: 'Under Review',
    assignedTo: 'Sarah Johnson',
    policyId: '45857501282A',
    company: 'Astute Healthcare Limited',
    claimAmountPolicy: '£15,000',
    excess: '£1,000',
    netAmount: '£14,000'
  })

  

  
    const companiesData = {
    'manufacturing-co': {
      name: 'Manufacturing Co Ltd',
      policies: {
        'property-insurance': {
          name: 'Property Insurance',
          id: 'MC2024001',
          status: 'Active',
          sumAssured: '£5,500,000',
          excessPerClaim: '£5,000',
          location: 'Birmingham & Coventry Sites',
          claimsMade: 2,
          coverageBreakdown: {
            buildingCover: '£3,000,000',
            contentsCover: '£2,500,000',
            businessInterruption: '£1,000,000'
          }
        },
        'liability-insurance': {
          name: 'Public Liability Insurance',
          id: 'MC2024002',
          status: 'Active',
          sumAssured: '£2,000,000',
          excessPerClaim: '£1,000',
          location: 'All UK Sites',
          claimsMade: 0,
          coverageBreakdown: {
            publicLiability: '£2,000,000',
            productLiability: '£1,500,000',
            employersLiability: '£10,000,000'
          }
        }
      }
    },
    'tech-solutions': {
      name: 'Tech Solutions Inc',
      policies: {
        'cyber-insurance': {
          name: 'Cyber Liability Insurance',
          id: 'TS2024001',
          status: 'Active',
          sumAssured: '£1,000,000',
          excessPerClaim: '£2,500',
          location: 'London Office',
          claimsMade: 1,
          coverageBreakdown: {
            dataProtection: '£500,000',
            cyberCrime: '£300,000',
            businessInterruption: '£200,000'
          }
        }
      }
    },
    'retail-group': {
      name: 'Retail Group Ltd',
      policies: {
        'commercial-insurance': {
          name: 'Commercial Combined Insurance',
          id: 'RG2024001',
          status: 'Active',
          sumAssured: '£3,000,000',
          excessPerClaim: '£3,500',
          location: 'Multiple Retail Locations',
          claimsMade: 5,
          coverageBreakdown: {
            buildingCover: '£1,500,000',
            stockCover: '£1,000,000',
            publicLiability: '£500,000'
          }
        }
      }
    }
  };

    const getSelectedCompany = () => companiesData[formDataNew.company];

  
    const tabsNew = [
      {
        id: 0,
        title: 'Company & Policy',
        icon: FileText,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      {
        id: 1,
        title: 'Claim Information',
        icon: ClipboardList,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      {
        id: 2,
        title: 'Policy Details',
        icon: Shield,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      }
    ];
  
    const handleInputChange = (field, value) => {
      setFormDataNew(prev => {
        // If company changes, reset policy
        if (field === 'company') {
          return {
            ...prev,
            company: value,
            policy: ''
          };
        }
        return {
          ...prev,
          [field]: value
        };
      });
    };
  
    const handleCloseModalNew = () => {
      setIsModalOpenNew(false);
    };
  
    const handleSubmitNew = () => {
      console.log('Submitting claim:', formDataNew);
      setIsModalOpenNew(false);
      toast.success('Claim updated successfully!');

      // Handle form submission
    };

  
  const handleFormChangeClaim = (field, value) => {
    setEditFormDataClaim(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCloseModalClaim = () => {
    setIsEditModalOpenClaim(false)
  }

  const handleUpdateClaim = () => {
    console.log('Updating claim:', editFormDataClaim)
    handleCloseModalClaim();
    toast.success('Claim created successfully!');
  }

  const timelineEvents = [
    {
      title: 'Claim Submitted',
      subtitle: 'John Smith',
      date: '2024-01-15',
      active: true
    },
    {
      title: 'Assigned to Agent',
      subtitle: 'System',
      date: '2024-01-16',
      description: 'Assigned to Sarah Johnson',
      active: true
    },
    {
      title: 'Under Review',
      subtitle: 'Sarah Johnson',
      date: '2024-01-17',
      active: true
    }
  ]
  
  const [editFormData, setEditFormData] = useState({
    firstname:'',
    lastname:'',
    email: '',
    phoneNumber: '',
    department: '',
    location: '',
    userRole: '',
    accountActive: true
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
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

    // Statistics data
  const statsClaim = [
    {
      title: 'Pending Claims',
      value: '1',
      subtitle: 'Awaiting review',
      color: 'bg-orange-500',
      // icon: Clock
    },
    {
      title: 'Approved Claims',
      value: '2',
      subtitle: 'This month',
      color: 'bg-green-500',
      // icon: CheckCircle
    },
    {
      title: 'Total Payout',
      value: '£20K',
      subtitle: 'Net amount paid',
      color: 'bg-blue-500',
      // icon: DollarSign
    },
    {
      title: 'Total Excess',
      value: '£9K',
      subtitle: 'Collected excess',
      color: 'bg-pink-500',
      // icon: AlertCircle
    }
  ];

  const users = [
    {
      id: 1,
      firstname: 'John',
      lastname: 'Smith',
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
      firstname: 'Sarah',
      lastname: 'Johnson',
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
      firstname: 'Mike',
      lastname: 'Wilson',
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
      firstname: 'Emma',
      lastname: 'Davis',
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

    // Sample claims data
  const claims = [
    {
      id: 'CLM-2024-001',
      company: 'Astute Healthcare Limited',
      policyType: 'Property',
      type: 'Water Damage',
      status: 'Under Review',
      claimAmount: '£15,000',
      excess: '£1,000',
      netAmount: '£14,000',
      date: '2024-01-15',
      statusColor: 'orange',
      companyIcon: '🏥'
    },
    {
      id: 'CLM-2024-002',
      company: 'Tech Solutions Ltd',
      policyType: 'Commercial Liability',
      type: 'Public Liability',
      status: 'Approved',
      claimAmount: '£8,500',
      excess: '£2,500',
      netAmount: '£6,000',
      date: '2024-01-10',
      statusColor: 'green',
      companyIcon: '💻'
    },
    {
      id: 'CLM-2024-003',
      company: 'Manufacturing Co Ltd',
      policyType: 'Property',
      type: 'Equipment Damage',
      status: 'Paid',
      claimAmount: '£25,000',
      excess: '£5,000',
      netAmount: '£20,000',
      date: '2024-01-05',
      statusColor: 'blue',
      companyIcon: '🏭'
    }
  ];

    const getStatusColorr = (status) => {
    switch (status) {
      case 'Under Review':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Paid':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusDarkColorr = (status) => {
    switch (status) {
      case 'Under Review':
        return 'bg-orange-900 text-orange-200 border-orange-700';
      case 'Approved':
        return 'bg-green-900 text-green-200 border-green-700';
      case 'Paid':
        return 'bg-blue-900 text-blue-200 border-blue-700';
      case 'Rejected':
        return 'bg-red-900 text-red-200 border-red-700';
      default:
        return 'bg-gray-700 text-gray-200 border-gray-600';
    }
  };

  const getPolicyTypeColorr = (type) => {
    switch (type) {
      case 'Property':
        return isDark ? 'bg-purple-900 text-purple-200 border-purple-700' : 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Commercial Liability':
        return isDark ? 'bg-blue-900 text-blue-200 border-blue-700' : 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Motor':
        return isDark ? 'bg-green-900 text-green-200 border-green-700' : 'bg-green-100 text-green-800 border-green-200';
      default:
        return isDark ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getClaimTypeColorr = (type) => {
    switch (type) {
      case 'Water Damage':
        return isDark ? 'bg-cyan-900 text-cyan-200 border-cyan-700' : 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Public Liability':
        return isDark ? 'bg-indigo-900 text-indigo-200 border-indigo-700' : 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Equipment Damage':
        return isDark ? 'bg-amber-900 text-amber-200 border-amber-700' : 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return isDark ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
      firstname: user.firstname,
      lastname: user.lastname,
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
    toast.success('User updated successfully!');
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
    toast.success('User created successfully!');
  };

  const handleCloseDeleteModal = () => setDeleteModalOpen(false);
const handleConfirmDelete = () => {
  // your delete logic here
  // deleteUser(selectedUser.id); // Or however your function is set
  setDeleteModalOpen(false);
  toast.success('User deleted successfully!');
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

       {true &&  <Userr
        openCreateModal={setIsCreateModalOpen}
        stats={stats}
        isDark={isDark}
        users={users}
        getRoleDarkColor={getRoleDarkColor}
        getRoleColor={getRoleColor}
        getStatusDarkColor={getStatusDarkColor}
        getStatusColor={getStatusColor}
        handleEditUser={handleEditUser}
        openDeleteModal={setDeleteModalOpen}
        isCreateModalOpen={isCreateModalOpen}
        handleCloseModalCreateUser={handleCloseModalCreateUser}
        formData={formData}
        handleFormChangeCreateUser={handleFormChangeCreateUser}
        companies={companies}
        handleCompanyAccessChange={handleCompanyAccessChange}
        handlePermissionChange={handlePermissionChange}
        handleCreateUser={handleCreateUser}
        isEditModalOpen={isEditModalOpen}
        selectedUser={selectedUser}
        handleCloseModal={handleCloseModal}
        editFormData={editFormData}
        handleFormChange={handleFormChange}
        handleUpdateUser={handleUpdateUser}
        isDeleteModalOpen={isDeleteModalOpen}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleConfirmDelete={handleConfirmDelete}
        /> } 
     
        {false && <Claims
        isDark={isDark}
        claims={claims}
        getStatusColorr={getStatusColorr}
        getPolicyTypeColorr={getPolicyTypeColorr}
        getClaimTypeColorr={getClaimTypeColorr}
        getStatusDarkColorr={getStatusDarkColorr}
        statsClaim={statsClaim}
        isEditModalOpenClaim={isEditModalOpenClaim}
        editFormDataClaim={editFormDataClaim}
        handleCloseModalClaim={handleCloseModalClaim}
        activeTabClaim={activeTabClaim} 
        openActiveTabClaim={setActiveTabClaim}
        handleFormChangeClaim={handleFormChangeClaim}
        timelineEvents={timelineEvents}
        handleUpdateClaim={handleUpdateClaim}
        openEditModalOpenClaim={setIsEditModalOpenClaim}     
        isModalOpenNew={isModalOpenNew}  
        openIsModalOpenNew={setIsModalOpenNew}  
        handleCloseModalNew={handleCloseModalNew} 
        tabsNew={tabsNew}
        openActiveTabNew={setActiveTabNew}
        activeTabNew={activeTabNew}
        formDataNew={formDataNew}
        handleInputChange={handleInputChange}
        getSelectedCompany={getSelectedCompany}
        handleSubmitNew={handleSubmitNew}
        />}
       {false && <Policies/>}
        
      </main>
    </div>
  );
};

export default Dashboard;

