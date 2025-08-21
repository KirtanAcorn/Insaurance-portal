import { useState, useEffect } from 'react';
import { FileText, ChevronDownIcon, UserIcon, Sun, Moon, Monitor, ChevronDown, BarChart3, FileCheck, Shield,Users, UserPlus, Mail, MapPin, Clock, Edit, Trash2, X, User, Building, Key, Eye, Settings, ClipboardList, BuildingIcon, TruckIcon, ShipIcon, AlertCircle, DollarSign, Activity, CheckCircle, Home, AlertTriangle, Truck, Globe } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import NavigationTabs from '../components/NavigationTabs';
import Userr from "./tabs/Userr"
import Claims from './tabs/Claims';
import toast from 'react-hot-toast';
import Policies from './tabs/Policies';
import DashboardTab from './tabs/DashboardTab'
import axios from "axios";
import { useLocation, useNavigate,} from "react-router-dom";

const Dashboard = () => {
  const [theme, setTheme] = useState('system');
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('Users');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpenClaim, setIsEditModalOpenClaim] = useState(false)
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [activeTabClaim, setActiveTabClaim] = useState('claim')
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCompanyPolicy, setSelectedCompanyPolicy] = useState('');
  const [selectedInsuranceType, setSelectedInsuranceType] = useState('Property');
  const [policyYear, setPolicyYear] = useState('2024-2025');
  const [isOpenNewClaim, setIsOpenNewClaim] = useState(false);
  const [users, setUsers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role;

   if (!role) {
    // No role found (direct access), redirect to login
    navigate("/login");
    return null;
  }
   const [formDataNewClaim, setFormDataNewClaim] = useState({
    companyName: '',
    policyName: '',
    claimType: '',
    claimAmount: '',
    Description: '',
    incidentDate: '',
    status: 'Under Review',
    supportingDocument: null
    });

  const [editFormDataClaim, setEditFormDataClaim] = useState({
    claimId: '',
    claimType: '',
    claimAmount: '',
    description: '',
    status: '',
    assignedTo: '',
    policyId: '',
    company: '',
    claimAmountPolicy: '',
    excess: '',
    netAmount: ''
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

  // Policy data shape that matches the SQL table structure
  const policyDataShape = {
    // Company Information
    companyName: '',
    country: '',
    regAddress: '',
    warehouseOfficeAddress: '',
    regNo: '',
    regDate: '',
    companyFirstTimePolicy: '',
    directorOwnerName: '',
    companyHandledBy: '',
    vatNumber: '',
    commodity: '',
    currency: '',
    turnoverGBP: '',
    insuranceAgent: '',
    accountHandler: '',
    employeeCount: '',
    
    // Commercial Policy
    commercialPolicy: '',
    commercialRenewalDate: '',
    commercialPolicyLink: '',
    commercialPremiumPaid: '',
    employeeLiabilityCover: '',
    empLiabilityRenewalDate: '',
    floatingStock: '',
    stockCover: '',
    stockLocation: '',
    productLiability: '',
    commercialExcessPerClaim: '',
    noOfClaimCommercial: '',
    
    // Marine Policy
    marine: '',
    marinePolicyLink: '',
    marineRenewal: '',
    marinePremiumPaid: '',
    perTransitCover: '',
    ukUkEuEuUsaUsa: '',
    ukEu: '',
    ukUsaMiddleEast: '',
    ukRowUsaRow: '',
    crossVoyage: '',
    airSeaRail: '',
    road: '',
    anyLocationInOrdinaryCourseOfTransit: '',
    cargoExcessPerClaim: '',
    noOfClaimCargo: '',
    
    // Building/Property Insurance
    buildingInsurance: '',
    propertyPolicyLink: '',
    renewalDate: '',
    buildingPremiumPaid: '',
    sumAssuredValueOfPremises: '',
    declareValue: '',
    buildingLocation: '',
    buildingExcessPerClaim: '',
    noOfClaimBuilding: '',
    
    // Fleet Policy
    fleetPolicy: '',
    fleetPolicyLink: '',
    renewalDate2: '',
    fleetPremiumPaid: '',
    regNo2: '',
    fleetExcessPerClaim: '',
    noOfClaimMadeFleet: '',
    
    // Additional Fields
    renewalYear: ''
  };

  // State for policy data
  const [policyData, setPolicyData] = useState({});
  const [isLoadingPolicy, setIsLoadingPolicy] = useState(false);
  const [policyError, setPolicyError] = useState(null);

  // Fetch policy data for selected company and year
  const fetchPolicyData = async (companyName, year) => {
    if (!companyName) return;
    
    setIsLoadingPolicy(true);
    setPolicyError(null);
    
    try {
      const response = await axios.get(`http://localhost:7001/api/policies`, {
        params: { companyName, year }
      });
      
      if (response.data) {
        // Format the data for display
        const formatCurrency = (value) => {
          if (!value) return 'N/A';
          const num = parseFloat(value);
          return isNaN(num) ? value : `£${num.toLocaleString()}`;
        };

        const formatDate = (dateString) => {
          if (!dateString) return 'N/A';
          const date = new Date(dateString);
          return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-GB');
        };

        const transformedData = {
          ...response.data,
          policyNumber: response.data.policyNumber || 'N/A',
          status: response.data.status || 'Inactive',
          startDate: formatDate(response.data.startDate),
          endDate: formatDate(response.data.endDate),
          premiumPaid: formatCurrency(response.data.premiumPaid),
          sumAssured: formatCurrency(response.data.sumAssured),
          excessPerClaim: formatCurrency(response.data.excessPerClaim),
          location: response.data.location || 'Multiple Locations',
          claimsMade: response.data.claimsMade || 0,
          coverage: {
            'Building Cover': formatCurrency(response.data.buildingInsurance),
            'Fleet Cover': response.data.fleetPolicy || 'N/A',
            'Sum Insured': formatCurrency(response.data.sumAssured)
          }
        };
        
        setPolicyData(transformedData);
      } else {
        // If no data, set default values
        setPolicyData({
          ...policyDataShape,
          companyName: policyCompanies.find(c => c.name === companyName)?.name || companyName,
          renewalYear: year
        });
      }
    } catch (error) {
      console.error('Error fetching policy data:', error);
      setPolicyError('Failed to load policy data');
      // Fallback to default values if API fails
      setPolicyData({
        ...policyDataShape,
        companyName: policyCompanies.find(c => c.name === companyName)?.name || companyName,
        renewalYear: year
      });
    } finally {
      setIsLoadingPolicy(false);
    }
  };

  // Effect to fetch policy data when company or year changes
  useEffect(() => {
    if (selectedCompanyPolicy && policyYear) {
      fetchPolicyData(selectedCompanyPolicy, policyYear);
    }
  }, [selectedCompanyPolicy, policyYear]);

  // Company data with id and name for dropdown
  const policyCompanies = [
    { id: 'astute-healthcare', name: 'Astute Healthcare limited' },
    { id: 'beauty-magasin', name: 'Beauty Magasin Ltd' },
    { id: 'future-center', name: 'The Future Center Storage and Distribution Limited' },
    { id: 'jambo-supplies', name: 'Jambo Supplies Limited' },
    { id: 'virtual-works', name: 'Virtual Works 360 Limited' },
    { id: 'acme-pharma', name: 'Acme Pharma Ltd' },
    { id: 'london-luxury', name: 'London Luxury Product' },
    { id: 'activecare', name: 'Activecare Online' },
    { id: 'hardlow', name: 'Hardlow Lubricants Limited' },
    { id: 'safe-storage', name: 'Safe Storage and Distribution Limited' },
    { id: 'jambo-bv', name: 'Jambo BV' },
    { id: 'doc-pharm', name: 'Doc Pharm GmbH' },
    { id: 'beauty-care', name: 'Beauty Care Global sp. Zoo' },
    { id: 'lifexa', name: 'Lifexa BVBA' },
    { id: 'beauty-store', name: 'Beauty Store LLC' },
    { id: 'beyondtrend', name: 'Beyondtrend USA LLC' },
    { id: 'jambo-wholesale', name: 'Jambo Wholesale Corporation LLC' },
    { id: 'global-brand', name: 'Global Brand Storage & Distribution LLC' },
    { id: 'aha-goods', name: 'AHA Goods Wholeseller LLC' },
    { id: 'a2z', name: 'A2Z (Acorn USA)' },
    { id: 'jd-business', name: 'J & D International Business' },
    { id: 'acorn-solution', name: 'Acorn Solution Ltd' },
    { id: 'astute-wholesale', name: 'Astute Wholesale Limited' },
    { id: 'gcet', name: 'GCET Limited' },
    { id: 'future-center-property', name: 'The Future Center Property Management Limited' },
    { id: 'landlord', name: 'Hetasveeben & Pratibhakumari - Landlord' },
    { id: 'aucllp', name: 'AUCLLP' }
  ];
    
  const insuranceData = {
        Property: {
          policyNumber: '45057501202A',
          status: 'Expired',
          startDate: '1 May 2024',
          endDate: '30 April 2025',
          premiumPaid: '£3,950.06',
          sumAssured: '£2,087,097',
          location: 'Unit 1 Hitchin (Bluepuffin)',
          excessPerClaim: '£1,000',
          claimsMade: '0',
          coverage: {
            'Building Cover': '£1,500,000',
            'Contents Cover': '£587,097',
            'Business Interruption': '£500,000'
          }
        },
        'Commercial Liability': {
          policyNumber: 'APP650950COM-24',
          status: 'Expired',
          startDate: '15 March 2024',
          endDate: '22 April 2025',
          premiumPaid: '£1,825.62',
          sumAssured: '£4,000,000',
          location: 'All UK Locations',
          excessPerClaim: '£2,500',
          claimsMade: '1',
          coverage: {
            'Public Liability': '£2,000,000',
            'Products Liability': '£2,000,000',
            'Professional Indemnity': '£1,000,000'
          }
        },
        Fleet: {
          policyNumber: 'FC380567',
          status: 'Expired',
          startDate: '1 January 2024',
          endDate: '7 April 2025',
          premiumPaid: '£16,036.98',
          sumAssured: '£500,000',
          location: 'UK Wide',
          excessPerClaim: '£750',
          claimsMade: '2',
          coverage: {
            'Comprehensive Cover': '£300,000',
            'Third Party': '£150,000',
            'Personal Accident': '£50,000'
          }
        },
        Marine: {
          policyNumber: 'LMC306726501',
          status: 'Expired',
          startDate: '1 June 2024',
          endDate: '15 June 2025',
          premiumPaid: '£99,999.88',
          sumAssured: '£46,100,000',
          location: 'International Waters',
          excessPerClaim: '£10,000',
          claimsMade: '0',
          coverage: {
            'Hull Cover': '£40,000,000',
            'Cargo Cover': '£5,000,000',
            'P&I Cover': '£1,100,000'
          }
        }
      };
    
      const allPolicies = [
        { id: '45057501202A', type: 'Property', status: 'Expired', premium: '£3,950.06', coverage: '£2,087,097', endDate: '30 April 2025' },
        { id: 'APP650950COM-24', type: 'Commercial Liability', status: 'Expired', premium: '£1,825.62', coverage: '£4,000,000', endDate: '22 April 2025' },
        { id: 'FC380567', type: 'Fleet', status: 'Expired', premium: '£16,036.98', coverage: '£500,000', endDate: '7 April 2025' },
        { id: 'LMC306726501', type: 'Marine', status: 'Expired', premium: '£99,999.88', coverage: '£46,100,000', endDate: '15 June 2025' }
      ];
    
      // Find the selected company data using the ID
      const selectedCompanyData = policyCompanies.find(c => c.id === selectedCompanyPolicy) || {};
      const currentInsuranceData = insuranceData[selectedInsuranceType];
    
      const getInsuranceIcon = (type) => {
        switch(type) {
          case 'Property': return <BuildingIcon className="w-5 h-5" />;
          case 'Commercial Liability': return <UserIcon className="w-5 h-5" />;
          case 'Fleet': return <TruckIcon className="w-5 h-5" />;
          case 'Marine': return <ShipIcon className="w-5 h-5" />;
          default: return <BuildingIcon className="w-5 h-5" />;
        }
      };


  const handleFormChangeClaim = (field, value) => {
    setEditFormDataClaim(prev => ({
      ...prev,
      [field]: value
    }))
  }

    const handleInputChangeNewClaim = (field, value) => {
    setFormDataNewClaim(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCloseNewClaim = () => {
    setIsOpenNewClaim(false);
  };

    const handleCancelNewClaim = () => {
    setIsOpenNewClaim(false);
  };

  const handleCloseModalClaim = () => {
    setIsEditModalOpenClaim(false);
    setSelectedClaim(null);
    // Reset the form data when closing the modal
    setEditFormDataClaim({
      claimId: '',
      claimType: '',
      claimAmount: '',
      status: 'Under Review',
      assignedTo: '',
      description: '',
      policyId: '',
      company: '',
      policyType: '',
      incidentDate: '',
      excess: '',
      netClaimAmount: ''
    });
  };

  const handleUpdateClaim = async (e) => {
    e.preventDefault();
    try {
      // Prepare the form data
      const formData = new FormData();
      
      // Add all the form fields that the backend expects
      formData.append('claimId', editFormDataClaim.claimId);
      formData.append('company', editFormDataClaim.company || '');
      formData.append('policyId', editFormDataClaim.policyId || '');
      formData.append('policyType', editFormDataClaim.policyType || '');
      formData.append('claimType', editFormDataClaim.claimType || '');
      formData.append('claimAmount', editFormDataClaim.claimAmount || 0);
      formData.append('description', editFormDataClaim.description || '');
      formData.append('incidentDate', editFormDataClaim.incidentDate || '');
      formData.append('netClaimAmount', editFormDataClaim.netClaimAmount || 0);
      formData.append('status', editFormDataClaim.status || 'Under Review');
      
      // If there's a supporting document, append it
      if (editFormDataClaim.supportingDocument) {
        formData.append('supportingDocuments', editFormDataClaim.supportingDocument);
      }

      console.log('==============', formData);

      const response = await axios.post(
        `http://localhost:7001/api/claims/${editFormDataClaim.claimId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.status === 200) {
        // Refresh claims data
        fetchClaims();
        // Close the modal
        setIsEditModalOpenClaim(false);
        // Show success message
        toast.success('Claim updated successfully');
      }
    } catch (error) {
      console.error('Error updating claim:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update claim';
      toast.error(errorMessage);
    }
  };

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
    firstName:'',
    lastName:'',
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

  // Fetch users from the API
  const fetchUsersClaim = async () => {
    try {
      setIsUsersLoading(true);
      const response = await axios.get('http://localhost:7001/api/users');
      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    // Set up theme
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

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsersClaim();
  }, []);

  const [stats, setStats] = useState([
    {
      title: 'Total Users',
      value: '0',
      changeType: 'neutral',
      color: 'bg-blue-500'
    },
    {
      title: 'Active Users',
      value: '0',
      changeType: 'neutral',
      color: 'bg-green-500'
    },
    {
      title: 'Team Members',
      value: '0',
      changeType: 'neutral',
      color: 'bg-purple-500'
    },
    {
      title: 'Clients',
      value: '0',
      changeType: 'neutral',
      color: 'bg-orange-500'
    }
  ]);
  

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

  const tabs = [
    { name: 'Dashboard', icon: BarChart3, color:"bg-gradient-to-br from-blue-500 to-cyan-500"},
    { name: 'Claims', icon: FileCheck, color: "bg-gradient-to-br from-orange-600 via-red-600 to-pink-600"},
    { name: 'Policies', icon: Shield, color:"bg-gradient-to-r from-purple-600 to-pink-600"},
    { name: 'Users', icon: Users, active: true, color:"bg-gradient-to-r from-purple-500 to-pink-500"}
  ];

    const statsData = [
    {
      title: 'Total Policies',
      value: '6',
      change: '+12%',
      changeText: 'from last month',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Active Claims',
      value: '1',
      change: '+5%',
      changeText: 'from last month',
      icon: AlertCircle,
      color: 'orange'
    },
    {
      title: 'Total Premium',
      value: '£134K',
      change: '+18%',
      changeText: 'from last month',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Registered Users',
      value: '4',
      change: '+8%',
      changeText: 'from last month',
      icon: Users,
      color: 'purple'
    }
  ];

  const recentActivity = [
    {
      type: 'warning',
      title: 'Under Review - Water Damage',
      subtitle: 'Sarah Johnson',
      date: '2024-01-17',
      icon: AlertCircle
    },
    {
      type: 'info',
      title: 'Assigned to Agent - Water Damage',
      subtitle: 'System',
      date: '2024-01-16',
      icon: Activity
    },
    {
      type: 'info',
      title: 'Claim Submitted - Water Damage',
      subtitle: 'John Smith',
      date: '2024-01-15',
      icon: Activity
    },
    {
      type: 'success',
      title: 'Approved - Public Liability',
      subtitle: 'Sarah Johnson',
      date: '2024-01-14',
      icon: CheckCircle
    },
    {
      type: 'info',
      title: 'Payment Processed - Equipment Damage',
      subtitle: 'Finance Team',
      date: '2024-01-12',
      icon: Activity
    }
  ];

  const policies = [
    {
      title: 'Property Insurance',
      status: 'Active',
      coverage: '£2,087,097',
      icon: Home,
      statusColor: 'green'
    },
    {
      title: 'Liability Insurance',
      status: 'Expired',
      coverage: 'Renewal required',
      icon: AlertTriangle,
      statusColor: 'red'
    },
    {
      title: 'Fleet Insurance',
      status: 'Active',
      coverage: '£500,000',
      icon: Truck,
      statusColor: 'green'
    }
  ];

  const quickStats = [
    {
      title: 'Global Coverage',
      value: '98.5%',
      icon: Globe,
      color: 'blue'
    },
    {
      title: 'Claim Success',
      value: '94.2%',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Data Security',
      value: '99.9%',
      icon: Shield,
      color: 'purple'
    }
  ];

  const getColorClasses = (color, variant = 'bg') => {
    const colors = {
      blue: {
        bg: isDark ? 'bg-blue-900/30' : 'bg-blue-50',
        text: 'text-blue-600',
        icon: isDark ? 'text-blue-400' : 'text-blue-500'
      },
      orange: {
        bg: isDark ? 'bg-orange-900/30' : 'bg-orange-50',
        text: 'text-orange-600',
        icon: isDark ? 'text-orange-400' : 'text-orange-500'
      },
      green: {
        bg: isDark ? 'bg-green-900/30' : 'bg-green-50',
        text: 'text-green-600',
        icon: isDark ? 'text-green-400' : 'text-green-500'
      },
      purple: {
        bg: isDark ? 'bg-purple-900/30' : 'bg-purple-50',
        text: 'text-purple-600',
        icon: isDark ? 'text-purple-400' : 'text-purple-500'
      },
      red: {
        bg: isDark ? 'bg-red-900/30' : 'bg-red-50',
        text: 'text-red-600',
        icon: isDark ? 'text-red-400' : 'text-red-500'
      }
    };
    return colors[color] || colors.blue;
  };

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
    console.log('Editing user:', user); // Debug log
    setSelectedUser(user);
    
    // Use userRole if available, otherwise fall back to role
    const userRole = user.userRole || user.role;
    // Determine account status, checking multiple possible properties
    const accountStatus = user.accountStatus || 
                         (user.isActive === 1 || user.isActive === true || user.status === 'Active' ? 'Active' : 'Inactive');
    
    setEditFormData({
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '', 
      phoneNumber: user.phoneNumber || '', 
      department: user.department || '',
      location: user.location || '',
      userRole: userRole || 'Client', // Default to 'Client' if no role is set
      accountStatus: accountStatus,
      isActive: accountStatus === 'Active'
    });
    
    console.log('Edit form data set to:', {
      ...editFormData,
      userRole: userRole || 'Client',
      accountStatus: accountStatus,
      isActive: accountStatus === 'Active'
    });
    
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    console.log(" inside handledeleteuser setselected user is ....",user);
    setSelectedUser(user);
    setDeleteModalOpen(true)
  }



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
  const handleUpdateUser = async (e) => {
    if (e) e.preventDefault();
    
    if (!editFormData.id) {
      console.error("No user ID to update");
      return;
    }
    
    try {
      console.log('Updating user with data:', editFormData);
      
      const updatedUser = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        department: editFormData.department || null,
        location: editFormData.location || null,
        userRole: editFormData.userRole || 'Client',
        isActive: editFormData.accountStatus === 'Active' ? 1 : 0
      };
      
      console.log('Sending update request with:', updatedUser);
      
      await axios.put(
        `http://localhost:7001/api/users/${editFormData.id}`,
        updatedUser
      );
      
      // Refresh the users list and close the modal
      await fetchUsers();
      setIsEditModalOpen(false);
      toast.success('User updated successfully!');
    } catch (error) {
      console.error("Error updating user:", error);
      alert(`Failed to update user: ${error.response?.data?.message || error.message}`);
    }
  };


const getInitials = (name) => {
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[1][0]).toUpperCase();
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
  const changeUsers = (formattedUsers) =>{
    fetchUsers(formattedUsers)
  }

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

  const handleCreateUser = async () => {
    try {
      
      console.log("Creating user:", formData);
 
      const response = await axios.post(
        "http://localhost:7001/api/users", formData
      );
      fetchUsers();
      setIsCreateModalOpen(false);
      toast.success('User created successfully!');
 
      if (response.status === 201 || response.status === 200) {
        console.log("User created successfully:", response.data);
        
        setFormData({});
       
      } else {
        console.warn("Unexpected response:", response);
      }
      
    } catch (error) {
      console.error("Error creating user:", error);
     
    }
  };


  const handleCloseDeleteModal = () => setDeleteModalOpen(false);
  const handleConfirmDelete = async (selectedUser) => {
  console.log("inside handle confirm delete",selectedUser);

    
    if (!selectedUser?.id) {
    console.log("userid is not found");
    return; 
    }
  try {
    await axios.delete(`http://localhost:7001/api/users/${selectedUser.id}`);
   
    
    fetchUsers();
    setDeleteModalOpen(false);
    setSelectedUser(null);
    toast.success('User deleted successfully!');

  } 
   catch (err) {
    console.error("Error deleting user:", err);
    alert("Failed to delete user. Please try again.");
  }
}


  const handleSubmitNewClaim = async (formValues, file) => {
  try {
    const formData = new FormData();
    formData.append('companyName', formValues.companyName);
    formData.append('policyName', formValues.policyName);
    formData.append('claimType', formValues.claimType);
    
    // Set default status to 'Under Review' if not provided
    const status = formValues.status || 'Under Review';
    formData.append('status', status);
    
    const claimAmount = formValues.claimAmount;
    
    if (!claimAmount || isNaN(Number(claimAmount))) {
      alert('Please enter a valid claim amount.');
      return;
    }
    
    formData.append('claimAmount', claimAmount);
    formData.append('Description', formValues.Description);
    formData.append('incidentDate', formValues.incidentDate);
    
    if (file) {
      formData.append('supportingDocuments', file);
    }
    
    // Send request via Axios
    const response = await axios.post(
      'http://localhost:7001/api/claims',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Show success message
    toast.success('Claim created successfully!', {
      duration: 3000,
      position: 'top-center'
    });
    
    // Reset form data
    setFormDataNewClaim({
      companyName: '',
      policyName: '',
      claimType: '',
      claimAmount: '',
      Description: '',
      incidentDate: '',
      status: 'Under Review',
      supportingDocument: null
    });
    
    // Close the Submit New Claim modal
    setIsOpenNewClaim(false);
    
    // Redirect to claims tab after a short delay
    setTimeout(() => {
      setActiveTab('Claims');
    }, 500);
    
    // Refresh claims data
    fetchClaims();
 
  } catch (error) {
    // Handle axios error correctly
    const errorMsg = error.response?.data?.error || error.message;
    toast.error('Error: ' + errorMsg, {
      duration: 5000,
      position: 'top-center'
    });
  }
};


  const companies = [
    'Astute Healthcare limited',
    'Beauty Magasin Ltd',
    'The Future Center Storage and Distribution Limited',
    'Jambo Supplies Limited',
    'Virtual Works 360 Limited',
    'Acme Pharma Ltd',
    'London Luxury Product',
    'Activecare Online',
    'Hardlow Lubricants Limited',
    'Safe Storage and Distribution Limited',
    'Jambo BV',
    'Doc Pharm GmbH',
    'Beauty Care Global sp. Zoo',
    'Lifexa BVBA',
    'Beauty Store LLC',
    'Beyondtrend USA LLC',
    'Jambo Wholesale Corporation LLC',
    'Global Brand Storage & Ditribution LLC',
    'AHA Goods Wholeseller LLC',
    'A2Z (Acorn USA)',
    'J & D International Business',
    'Acorn Solution Ltd',
    'Astute Wholesale Limited',
    'GCET Limited',
    'The Future Center Property Management Limited',
    'Hetasveeben & Pratibhakumari - Landlord',
    'AUCLLP'
  ];

  const updateStats = (users) => {
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'Active').length;

  const teamMembers = users.filter(user => user.role === 'Team Member').length;
  const clients = users.filter(user => user.role === 'Client').length;

  setStats([
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      changeType: totalUsers > 0 ? 'positive' : 'neutral',
      color: 'bg-blue-500'
    },
    {
      title: 'Active Users',
      value: activeUsers.toString(),
      changeType: activeUsers > 0 ? 'positive' : 'neutral',
      color: 'bg-green-500'
    },
    {
      title: 'Team Members',
      value: teamMembers.toString(),
      changeType: teamMembers > 0 ? 'positive' : 'neutral',
      color: 'bg-purple-500'
    },
    {
      title: 'Clients',
      value: clients.toString(),
      changeType: clients > 0 ? 'positive' : 'neutral',
      color: 'bg-orange-500'
    }
  ]);
};

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:7001/api/users');
  
      const formattedUsers = response.data.map((user, index) => ({
        id: user.id,
        avatar: getInitials(user.firstName || user.name || ""),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        location: user.location || 'N/A',
        role: user.userRole,          
        status: user.accountStatus,   
        phoneNumber: user.phoneNumber,
        department: user.department,
        policies: user.policies || 0,
        claims: user.claims || 0,
      }));
  
      setUsers(formattedUsers);
      updateStats(formattedUsers);
  
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchClaims = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:7001/api/claims');
      setClaims(response.data);
    } catch (err) {
      console.error('Error fetching claims:', err);
      setError('Failed to load claims. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
    fetchClaims();
  }, []);

 const openCreateModal = (flag) => {
  if (flag) {
    setFormData({
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
        viewClaims: false,
        processClaims: false,
        createPolicies: false,
        manageUsers: false
      },
      additionalNotes: ''
    });
  }
  setIsCreateModalOpen(flag);
};
  

  const statsDataDashboard = [
    {
      title: 'Total Policies',
      value: '6',
      change: '+12%',
      changeText: 'from last month',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Active Claims',
      value: '1',
      change: '+5%',
      changeText: 'from last month',
      icon: AlertCircle,
      color: 'orange'
    },
    {
      title: 'Total Premium',
      value: '£134K',
      change: '+18%',
      changeText: 'from last month',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Registered Users',
      value: '4',
      change: '+8%',
      changeText: 'from last month',
      icon: Users,
      color: 'purple'
    }
  ];

  const recentActivityDashboard = [
    {
      type: 'warning',
      title: 'Under Review - Water Damage',
      subtitle: 'Sarah Johnson',
      date: '2024-01-17',
      icon: AlertCircle
    },
    {
      type: 'info',
      title: 'Assigned to Agent - Water Damage',
      subtitle: 'System',
      date: '2024-01-16',
      icon: Activity
    },
    {
      type: 'info',
      title: 'Claim Submitted - Water Damage',
      subtitle: 'John Smith',
      date: '2024-01-15',
      icon: Activity
    },
    {
      type: 'success',
      title: 'Approved - Public Liability',
      subtitle: 'Sarah Johnson',
      date: '2024-01-14',
      icon: CheckCircle
    },
    {
      type: 'info',
      title: 'Payment Processed - Equipment Damage',
      subtitle: 'Finance Team',
      date: '2024-01-12',
      icon: Activity
    }
  ];

  const policiesDashboard = [
    {
      title: 'Property Insurance',
      status: 'Active',
      coverage: '£2,087,097',
      icon: Home,
      statusColor: 'green'
    },
    {
      title: 'Liability Insurance',
      status: 'Expired',
      coverage: 'Renewal required',
      icon: AlertTriangle,
      statusColor: 'red'
    },
    {
      title: 'Fleet Insurance',
      status: 'Active',
      coverage: '£500,000',
      icon: Truck,
      statusColor: 'green'
    }
  ];

  const quickStatsDashboard = [
    {
      title: 'Global Coverage',
      value: '98.5%',
      icon: Globe,
      color: 'blue'
    },
    {
      title: 'Claim Success',
      value: '94.2%',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Data Security',
      value: '99.9%',
      icon: Shield,
      color: 'purple'
    }
  ];

  const getColorClassesDashbaord = (color, variant = 'bg') => {
    const colors = {
      blue: {
        bg: isDark ? 'bg-blue-900/30' : 'bg-blue-50',
        text: 'text-blue-600',
        icon: isDark ? 'text-blue-400' : 'text-blue-500'
      },
      orange: {
        bg: isDark ? 'bg-orange-900/30' : 'bg-orange-50',
        text: 'text-orange-600',
        icon: isDark ? 'text-orange-400' : 'text-orange-500'
      },
      green: {
        bg: isDark ? 'bg-green-900/30' : 'bg-green-50',
        text: 'text-green-600',
        icon: isDark ? 'text-green-400' : 'text-green-500'
      },
      purple: {
        bg: isDark ? 'bg-purple-900/30' : 'bg-purple-50',
        text: 'text-purple-600',
        icon: isDark ? 'text-purple-400' : 'text-purple-500'
      },
      red: {
        bg: isDark ? 'bg-red-900/30' : 'bg-red-50',
        text: 'text-red-600',
        icon: isDark ? 'text-red-400' : 'text-red-500'
      }
    };
    return colors[color] || colors.blue;
  };


  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      
      {/* Header */}
      <DashboardHeader
      isDark={isDark}
      theme={theme}
      setTheme={setTheme}
      role={role}
      />

      {/* Navigation Tabs */}
      <NavigationTabs
      role={role}
      isDark={isDark}
      tabs={tabs.map((tab) => ({
    ...tab,
    active: activeTab === tab.name
  }))}
  activeTabChanger={setActiveTab}

      />

      {/* Main Content */}
      <main className="p-6">

       {activeTab === "Users" && (<Userr
        openCreateModal={openCreateModal}
        stats={stats}
        isDark={isDark}
        users={users}
        changeUsers={changeUsers}
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
        handleDeleteUser={handleDeleteUser}

        />) } 
     
        {activeTab === "Claims" &&  <Claims
        role={role}
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
        isOpenNewClaim={isOpenNewClaim}  
        openIsOpenNewClaim={setIsOpenNewClaim}  
        handleSubmitNewClaim={handleSubmitNewClaim} 
        formDataNewClaim={formDataNewClaim}
        handleInputChangeNewClaim={handleInputChangeNewClaim}
        handleCloseNewClaim={handleCloseNewClaim}
        handleCancelNewClaim={handleCancelNewClaim}
        />}

       {activeTab === "Policies" && <Policies
       isDark={isDark}
       selectedCompanyPolicy={selectedCompanyPolicy}
       changeSelectedCompanyPolicy={setSelectedCompanyPolicy}
       policyCompanies={policyCompanies}
       policyYear={policyYear}
       changePolicyYear={setPolicyYear}
       chooseSelectedInsuranceType={setSelectedInsuranceType}
       getInsuranceIcon={getInsuranceIcon}
       selectedInsuranceType={selectedInsuranceType}
       selectedCompanyData={selectedCompanyData}
       currentInsuranceData={currentInsuranceData}
       allPolicies={allPolicies}
       openIsModalOpenNew={setIsOpenNewClaim}
       />}

       {activeTab === "Dashboard" && <DashboardTab
       isDark={isDark}
       statsDataDashboard={statsDataDashboard}
       recentActivityDashboard={recentActivityDashboard}
       policiesDashboard={policiesDashboard}
       quickStatsDashboard={quickStatsDashboard}
       getColorClassesDashbaord={getColorClassesDashbaord}
       />}
        
      </main>
    </div>
  );
};

export default Dashboard;

