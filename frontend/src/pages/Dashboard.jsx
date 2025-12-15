import { useState, useEffect } from 'react';
import { FileText, ChevronDownIcon, UserIcon, Sun, Moon, Monitor, ChevronDown, BarChart3, FileCheck, Shield, Users, UserPlus, Mail, MapPin, Clock, Edit, Trash2, X, User, Building, Key, Eye, Settings, ClipboardList, BuildingIcon, TruckIcon, ShipIcon, AlertCircle, DollarSign, Activity, CheckCircle, Home, AlertTriangle, Truck, Globe } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import NavigationTabs from '../components/NavigationTabs';
import Userr from "./tabs/Userr"
import Claims from './tabs/Claims';
import toast from 'react-hot-toast';
import Policies from './tabs/Policies';
import DashboardTab from './tabs/DashboardTab'
import AddPolicyModal from '../components/policies/AddPolicyModal';
import EditPolicyModal from '../components/policies/EditPolicyModal';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";

const Dashboard = () => {
  const [theme, setTheme] = useState('system');
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpenClaim, setIsEditModalOpenClaim] = useState(false)
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [activeTabClaim, setActiveTabClaim] = useState('claim')
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCompanyPolicy, setSelectedCompanyPolicy] = useState('');
  const [selectedInsuranceType, setSelectedInsuranceType] = useState('Property');
  const [policyYear, setPolicyYear] = useState('2025-2026');
  const [availableYears, setAvailableYears] = useState(['2024-2025', '2025-2026', '2026-2027', '2027-2028']);
  const [isOpenNewClaim, setIsOpenNewClaim] = useState(false);
  const [isModalOpenNew, setIsModalOpenNew] = useState(false);
  const [openIsModalOpenNew, setOpenIsModalOpenNew] = useState(false);
  const [isEditPolicyModalOpen, setIsEditPolicyModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [users, setUsers] = useState([]); 
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isPoliciesLoading, setIsPoliciesLoading] = useState(false);
  const [policiesError, setPoliciesError] = useState(null);
  const [latestYearSummary, setLatestYearSummary] = useState({ year: null, policyCount: 0, totalPremiumGBP: 0 });
  const [companyPolicies, setCompanyPolicies] = useState([]);
  const [error, setError] = useState(null);
  const [quickStatsData, setQuickStatsData] = useState({ claimSuccess: 0, globalCoverage: 0, dataSecurity: 0 });
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role;
  const userData = location.state?.userData;
  const userCompanyAccess = userData?.companyAccess || [];

  // Live FX rates (GBP base) for converting premiums to GBP on the dashboard
  const [fxRates, setFxRates] = useState({});
  const [fxLastUpdated, setFxLastUpdated] = useState(null);
  const [fxError, setFxError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchRates = async () => {
      try {
        // Using Frankfurter (ECB) - no API key required.
        // Query with base GBP so rates are: 1 GBP -> X foreign currency
        // To convert foreign -> GBP, divide by rates[currency].
        const { data } = await axios.get('https://api.frankfurter.app/latest', {
          params: { from: 'GBP' }
        });
        if (isMounted && data && data.rates) {
          setFxRates(data.rates);
          setFxLastUpdated(new Date().toISOString());
          setFxError(null);
        }
      } catch (e) {
        if (isMounted) setFxError(e.message || 'Failed to load FX rates');
      }
    };
    fetchRates();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        const { data } = await axios.get('/api/dashboard/quick-stats');
        setQuickStatsData(data);
      } catch (error) {
        console.error('Error fetching quick stats:', error);
      }
    };

    fetchQuickStats();
  }, []);

  // Fetch available years from database
  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const { data } = await axios.get('/api/policies/available-years');
        if (data.years && data.years.length > 0) {
          setAvailableYears(data.years);
          // Set the first year as default if current policyYear is not in the list
          if (!data.years.includes(policyYear)) {
            setPolicyYear(data.years[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching available years:', error);
        // Keep default years if fetch fails
      }
    };

    fetchAvailableYears();
  }, []);

  // Fetch all policies for latest renewal year to drive dashboard-wide totals
  useEffect(() => {
    let cancelled = false;

    const parseAmount = (v) => {
      if (v === null || v === undefined || v === '' || v === '-') return 0;
      const num = typeof v === 'string' ? parseFloat(v.replace(/[^0-9.-]+/g, '')) : Number(v);
      return isFinite(num) ? num : 0;
    };

    const normalizeCurrency = (c) => {
      if (!c) return 'GBP';
      const onlyLetters = String(c).toUpperCase().replace(/[^A-Z]/g, '');
      // Common symbol/labels to ISO
      if (!onlyLetters) return 'GBP';
      if (onlyLetters.startsWith('GBP')) return 'GBP';
      if (onlyLetters.startsWith('USD')) return 'USD';
      if (onlyLetters.startsWith('EUR')) return 'EUR';
      if (onlyLetters.startsWith('INR')) return 'INR';
      if (onlyLetters.startsWith('AUD')) return 'AUD';
      if (onlyLetters.startsWith('CAD')) return 'CAD';
      if (onlyLetters.startsWith('JPY')) return 'JPY';
      if (onlyLetters.startsWith('CNY')) return 'CNY';
      // Fallback: take first 3 letters
      return onlyLetters.slice(0, 3);
    };

    const toGBP = (amount, currency) => {
      const num = parseAmount(amount);
      const cur = normalizeCurrency(currency);
      if (!num) return 0;
      if (cur === 'GBP') return num;
      const rate = fxRates[cur];
      if (!rate || !isFinite(rate)) return num; // assume already GBP when we don't know the rate
      // fxRates is 1 GBP -> X CUR, so CUR -> GBP is divide
      return num / rate;
    };

    const fetchLatestYearPolicies = async () => {
      try {
        const { data } = await axios.get('/api/policies/by-year', { params: { _t: Date.now() } });
        if (cancelled || !data || !Array.isArray(data.rows)) return;
        const allRows = data.rows;
        const year = data.renewalYear || null;

        // Filter rows based on user's company access
        const accessibleCompanyNames = policyCompanies.map(company => company.name);
        const rows = allRows.filter(row => {
          const companyName = row['Company Name'] || row.companyName || '';
          return accessibleCompanyNames.includes(companyName);
        });

        // Count = number of rows for companies user has access to
        const policyCount = rows.length;

        // Calculate total premium from filtered rows (user's accessible companies only)
        let totalPremiumGBP = 0;
        
        // Always use row-by-row calculation to ensure we only include accessible companies
        totalPremiumGBP = rows.reduce((sum, row) => {
          const currency = row['Currency'] || row.currency || 'GBP';
          const premiums = [
            row['Commercial Premium Paid'],
            row['Marine Premium Paid'],
            row['Building Premium Paid'],
            row['Fleet Premium Paid']
          ];
          const rowSum = premiums.reduce((s, p) => s + toGBP(p, currency), 0);
          return sum + rowSum;
        }, 0);

        if (!cancelled) {
          setLatestYearSummary({ year, policyCount, totalPremiumGBP });
        }
      } catch (e) {
        if (!cancelled) setLatestYearSummary({ year: null, policyCount: 0, totalPremiumGBP: 0 });
      }
    };

    // Only fetch once FX rates are available to avoid recompute issues
    fetchLatestYearPolicies();

    return () => { cancelled = true; };
  }, [fxRates]);

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
    ukUk: '',
    ukEu: '',
    ukUsaCanada: '',
    ukMiddleEastDubai: '',
    usaMiddleEastDubai: '',
    euMiddleEastDubai: '',
    euEu: '',
    euUsa: '',
    usaUsa: '',
    ukRow: '',
    usaRow: '',
    euRow: '',
    rowRow: '',
    crossVoyage: '',
    airSeaRail: '',
    road: '',
    anyoneLocationInOrdinaryCourseOfTransit: '',
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

  // All available companies
  const allPolicyCompanies = [
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

  // Filter companies based on user access (Admin sees all, others see only assigned companies)
  const policyCompanies = role === 'Admin' 
    ? allPolicyCompanies 
    : allPolicyCompanies.filter(company => userCompanyAccess.includes(company.name));

  const [policyData, setPolicyData] = useState(policyDataShape);
  const [isLoadingPolicy, setIsLoadingPolicy] = useState(false);
  const [policyError, setPolicyError] = useState(null);
  
  // Log policyData changes
  useEffect(() => {
  }, [policyData]);
  
  // Fetch data when selected company or year changes
  useEffect(() => {
    if (selectedCompanyPolicy && policyYear) {
      fetchPolicyData(selectedCompanyPolicy, policyYear);
    }
  }, [selectedCompanyPolicy, policyYear]);

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
    description: '',
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

  const companiesData = {};

  // Fetch policy data for selected company and year
  const fetchPolicyData = async (companyName, year) => {
    if (!companyName || !year) {
      console.error("Company name or year is missing.");
      setPolicyData(policyDataShape); 
      setIsLoadingPolicy(false);
      setPolicyError(null);
      return;
    }
  
    setIsLoadingPolicy(true);
    setPolicyError(null);
  
    try {
      // Use the year as is from the dropdown
      const apiUrl = `/api/policies/company-details?companyName=${encodeURIComponent(companyName)}&renewalYear=${year}`;

      const response = await axios.get(apiUrl);
  
      if (response.status === 200 && response.data && response.data.length > 0) {
          const apiData = response.data[0];

              // Helper functions for data formatting
              const formatCurrency = (value) => {
                  if (value === null || value === undefined || value === '' || value === '-') return '-';
                  // Return the value as-is from backend (already contains currency symbol)
                  return String(value).trim();
              };

              const formatDate = (dateString) => {
                  if (!dateString || dateString === 'N/A' || dateString === '-') return '-';
                  const date = new Date(dateString);
                  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                  });
              };

              // Map API data to the frontend state shape
              const transformedData = {
                  companyName: apiData['Company Name'] || '-',
                  country: apiData['Country'] || '-',
                  regAddress: apiData['Reg Address'] || '-',
                  warehouseOfficeAddress: apiData['Warehouse/Office Address/es'] || '-',
                  regNo: apiData['Reg No'] || '-',
                  regDate: formatDate(apiData['Reg Date']),
                  companyFirstTimePolicy: apiData['Company first Time Policy'] || '-',
                  directorOwnerName: apiData['Director/Owner Name'] || '-',
                  companyHandledBy: apiData['Company Handle By'] || '-',
                  vatNumber: apiData['VAT Number'] || '-',
                  commodity: apiData['Comodity'] || '-',
                  currency: apiData['Currency'] || '-',
                  turnoverGBP: apiData['Turnover in £ Mn'] || '-',
                  insuranceAgent: apiData['Insurance Agent'] || '-',
                  accountHandler: apiData['A/C HANDLER'] || '-',
                  employeeCount: apiData['Emp Count'] || '-',
                  commercialPolicy: apiData['Commercial Policy'] || '-',
                  commercialRenewalDate: formatDate(apiData['Commercial Renewal Date']),
                  commercialPolicyLink: apiData['Commercial Policy Link'] || '-',
                  commercialPremiumPaid: allPolicies.find(p => p.type === 'Commercial Liability')?.premium || (apiData['Commercial Premium Paid'] || '-'),
                  employeeLiabilityCover: apiData['Employee Liability Cover'] || '-',
                  empLiabilityRenewalDate: formatDate(apiData['Emp_Liabality Renewal Date']),
                  floatingStock: apiData['Floting stock'] || '-',
                  stockCover: apiData['Stock Cover'] || '-',
                  stockLocation: apiData['Stock Location'] || '-',
                  productLiability: apiData['Product Liability'] || '-',
                  commercialExcessPerClaim: apiData['Commercial Excess Per claim'] || '-',
                  noOfClaimCommercial: apiData['No Of claim Commercial'] || '-',
                  marine: apiData['Marine'] || '-',
                  marinePolicyLink: apiData['Marine Policy Link'] || '-',
                  marineRenewal: formatDate(apiData['Marine Renewal']),
                  marinePremiumPaid: allPolicies.find(p => p.type === 'Marine')?.premium || (apiData['Marine Premium Paid'] || '-'),
                  perTransitCover: apiData['Per Transit Cover'] || '-',
                  ukUk: apiData['UK-UK'] || '-',
                  ukEu: apiData['UK-EU'] || '-',
                  ukUsaCanada: apiData['UK-USA/Canada'] || '-',
                  ukMiddleEastDubai: apiData['UK-MiddelEast(Dubai)'] || '-',
                  usaMiddleEastDubai: apiData['USA-Middeleast(Dubai)'] || '-',
                  euMiddleEastDubai: apiData['EU-Middeleast(Dubai)'] || '-',
                  euEu: apiData['EU-EU'] || '-',
                  euUsa: apiData['EU-USA'] || '-',
                  usaUsa: apiData['USA-USA'] || '-',
                  ukRow: apiData['UK-ROW'] || '-',
                  usaRow: apiData['USA-ROW'] || '-',
                  euRow: apiData['EU-ROW'] || '-',
                  rowRow: apiData['ROW-ROW'] || '-',
                  crossVoyage: apiData['CROSS VOYAGE'] || '-',
                  airSeaRail: apiData['AIR/SEA/RAIL'] || '-',
                  road: apiData['ROAD'] || '-',
                  anyoneLocationInOrdinaryCourseOfTransit: apiData['ANYONE LOACTION IN ORDINARY COURSE OF TRANSIT'] || '-',
                  cargoExcessPerClaim: apiData['Cargo Excess Excess Per claim'] || '-',
                  noOfClaimCargo: apiData['No Of claim Cargo'] || '-',
                  buildingInsurance: apiData['Building Insurance'] || '-',
                  propertyPolicyLink: apiData['Property Policy Link'] || '-',
                  renewalDate: formatDate(apiData['Renewal Date']),
                  buildingPremiumPaid: allPolicies.find(p => p.type === 'Property')?.premium || (apiData['Building Premium Paid'] || '-'),
                  sumAssuredValueOfPremises: apiData['Sume Assure(Value of )Premises'] || '-',
                  declareValue: apiData['Declare Value'] || '-',
                  buildingLocation: apiData['Building Location'] || '-',
                  buildingExcessPerClaim: apiData['Building Excess Per claim'] || '-',
                  noOfClaimBuilding: apiData['No Of claim Building'] || '-',
                  fleetPolicy: apiData['Fleet Policy'] || '-',
                  fleetPolicyLink: apiData['Fleet Policy Link'] || '-',
                  renewalDate2: formatDate(apiData['Renewal Date2']),
                  fleetPremiumPaid: allPolicies.find(p => p.type === 'Fleet')?.premium || (apiData['Fleet Premium Paid'] || '-'),
                  regNo2: apiData['Reg No2'] || '-',
                  fleetExcessPerClaim: apiData['Fleet Excess Per claim '] || '-',
                  noOfClaimMadeFleet: apiData['No Of claim made fleet'] || '-',
                  renewalYear: apiData['Year '] || apiData['Year'] || year // Using [Year ] field (note trailing space)
              };
              setPolicyData(transformedData);
              setPolicyError(null);
          } else {
              console.log('No policy data found for the selected company and year');
              setPolicyData(policyDataShape);
              setPolicyError(new Error('No policy data found for the selected company and year'));
              toast.error('No policy data found for the selected company and year');
          }
      } catch (error) {
          console.error('Error fetching policy data:', error);
          setPolicyError(error);
          setPolicyData(policyDataShape);
          toast.error(`Error loading policy data: ${error.message}`);
          setPolicyError('Failed to load policy data');
          setPolicyData({
              ...policyDataShape,
              companyName: companyName,
              renewalYear: year
          });
      } finally {
          setIsLoadingPolicy(false);
      }
  };

  // Effect to fetch policy data when company or year changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
        
        if (selectedCompanyPolicy && policyYear) {
            // policyCompanies is accessible here because it's in a higher scope
            const company = policyCompanies.find(c => c.id === selectedCompanyPolicy);            
            if (company) {
                try {
                    await fetchPolicyData(company.name, policyYear);
                } catch (error) {
                    if (isMounted) {
                        console.error('Error in fetchPolicyData:', error);
                        setPolicyError('Failed to fetch policy data');
                    }
                }
            } else if (isMounted) {
                console.error("Selected company not found in list.");
                setPolicyData(policyDataShape);
            }
        } else if (isMounted) {
            console.log('Missing required data for fetch:', { 
                hasSelectedCompany: !!selectedCompanyPolicy, 
                hasPolicyYear: !!policyYear 
            });
        }
    };
    
    fetchData();
    
    // Cleanup function
    return () => {
        isMounted = false;
    };
}, [selectedCompanyPolicy, policyYear]);

  const insuranceData = {};

  const allPolicies = useMemo(() => {
    if (!companyPolicies || companyPolicies.length === 0) {
      return [];
    }
    
    // Get the first company's policies (assuming one company at a time)
    const policy = companyPolicies[0];
    const policies = [];
    
    // Helper function to format date
    const formatDate = (dateString) => {
      if (!dateString) return '-';
      try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) 
          ? '-' 
          : date.toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            });
      } catch (error) {
        console.error('Error formatting date:', error);
        return '-';
      }
    };
    
    // Since we're already filtering by year in the API call, we don't need to filter again
    // Just check if the policy has data
    const policyYearMatch = (dateString) => {
      // Always return true since the API already filters by year
      return true;
    };
    
    // Helper function to format currency
    const formatCurrency = (amount) => {
      if (amount === null || amount === undefined || amount === '' || amount === '-') return '-';
      try {
        // Return the value as-is from backend (already contains currency symbol)
        return String(amount).trim();
      } catch (error) {
        console.error('Error formatting currency:', error);
        return '-';
      }
    };
    
    // Property Policy - Check if policy number exists (primary indicator)
    if (policy['Building Insurance'] && policy['Building Insurance'].trim() !== '') {
      policies.push({
        id: policy['Building Insurance'],
        type: 'Property',
        status: 'Active',
        premium: formatCurrency(policy['Building Premium Paid']),
        coverage: formatCurrency(policy['Sume Assure(Value of )Premises']) || '-',
        endDate: formatDate(policy['Renewal Date'])
      });
    }
    
    // Commercial Liability Policy - Check if policy number exists (primary indicator)
    if (policy['Commercial Policy'] && policy['Commercial Policy'].trim() !== '') {
      policies.push({
        id: policy['Commercial Policy'],
        type: 'Commercial Liability',
        status: 'Active',
        premium: formatCurrency(policy['Commercial Premium Paid']),
        coverage: formatCurrency(policy['Employee Liability Cover']) || '-',
        endDate: formatDate(policy['Commercial Renewal Date'])
      });
    }
    
    // Fleet Policy - Check if policy number exists (primary indicator)
    if (policy['Fleet Policy'] && policy['Fleet Policy'].trim() !== '') {
      policies.push({
        id: policy['Fleet Policy'],
        type: 'Fleet',
        status: 'Active',
        premium: formatCurrency(policy['Fleet Premium Paid']),
        coverage: '-',
        endDate: formatDate(policy['Renewal Date2'])
      });
    }
    
    // Marine Policy - Check if policy number exists (primary indicator)
    if (policy['Marine'] && policy['Marine'].trim() !== '') {
      policies.push({
        id: policy['Marine'],
        type: 'Marine',
        status: 'Active',
        premium: formatCurrency(policy['Marine Premium Paid']),
        coverage: formatCurrency(policy['Per Transit Cover']) || '-',
        endDate: formatDate(policy['Marine Renewal'])
      });
    }
    return policies;
  }, [companyPolicies, policyYear]);

  // Log when allPolicies changes
  useEffect(() => {
  }, [allPolicies]);

  // Find the selected company data using the ID
  const selectedCompanyData = policyCompanies.find(c => c.id === selectedCompanyPolicy) || {};
  const currentInsuranceData = insuranceData[selectedInsuranceType];

  // Memoize the policy companies to prevent unnecessary re-renders
  const memoizedPolicyCompanies = useMemo(() => policyCompanies, [JSON.stringify(policyCompanies)]);

  // Fetch company policies when selected company or year changes
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchCompanyPolicies = async () => {
      if (!selectedCompanyPolicy || !policyYear) {
        if (isMounted) {
          setCompanyPolicies([]);
          setPoliciesError(null);
          setIsPoliciesLoading(false);
        }
        return;
      }
      
      // Find the selected company to get its name
      const selectedCompany = memoizedPolicyCompanies.find(c => c.id === selectedCompanyPolicy);
      if (!selectedCompany) {
        if (isMounted) {
          setCompanyPolicies([]);
          setPoliciesError('Selected company not found');
          setIsPoliciesLoading(false);
        }
        return;
      }
      
      const companyName = selectedCompany.name;      
      if (isMounted) {
        setIsPoliciesLoading(true);
        setPoliciesError(null);
      }
      
      try {
        // Use the company-details endpoint that filters by both company and year
        const response = await axios.get(
          `/api/policies/company-details`,
          { 
            signal,
            params: { 
              companyName: companyName,
              renewalYear: policyYear,
              _t: Date.now() 
            }
          }
        );
        
        if (isMounted) {
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            setCompanyPolicies(response.data);
            setPoliciesError(null);
          } else {
            setCompanyPolicies([]);
            setPoliciesError(`No policies found for ${companyName} in ${policyYear}`);
          }
        }
      } catch (error) {
        if (isMounted && !signal.aborted) {
          console.error('Error fetching company policies:', error);
          setPoliciesError(error.response?.data?.message || 'Failed to load policies. Please try again later.');
          setCompanyPolicies([]);
        }
      } finally {
        if (isMounted) {
          setIsPoliciesLoading(false);
        }
      }
    };

    // Add a small debounce to prevent rapid successive calls
    const debounceTimer = setTimeout(fetchCompanyPolicies, 300);

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort('Component unmounted or effect re-running');
      clearTimeout(debounceTimer);
    };
  }, [selectedCompanyPolicy, policyYear, memoizedPolicyCompanies]);

  const getInsuranceIcon = (type) => {
    switch (type) {
      case 'Property': return <BuildingIcon className="w-5 h-5" />;
      case 'Commercial Liability': return <UserIcon className="w-5 h-5" />;
      case 'Fleet': return <TruckIcon className="w-5 h-5" />;
      case 'Marine': return <ShipIcon className="w-5 h-5" />;
      default: return <BuildingIcon className="w-5 h-5" />;
    }
  };


  const handleFormChangeClaim = (fieldOrData, value) => {
    setEditFormDataClaim(prev => {
      // Handle case where an object is passed (from ClaimsEditModal)
      if (typeof fieldOrData === 'object' && fieldOrData !== null) {
        return { ...prev, ...fieldOrData };
      }
      // Handle case where field and value are passed separately
      return {
        ...prev,
        [fieldOrData]: value
      };
    });
  };

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
      companyName: '',
      policyType: '',
      incidentDate: '',
      excess: '',
      netAmount: '',
      supportingDocuments: null
    });
  };
  
  // Function to open edit modal with claim data
  const handleEditClaim = (claim) => {
    console.log('Editing claim:', claim); // Debug log to see the actual claim data
    setSelectedClaim(claim);
    setEditFormDataClaim({
      claimId: claim.claimId,
      claimType: claim.claimType,
      claimAmount: claim.claimAmount,
      status: claim.status,
      assignedToUserID: claim.assignedToUserID || claim.assignedTo || '', // Use the correct field name
      description: claim.description || '',
      policyId: claim.policyId || '',
      companyName: claim.companyName || claim.company || '', // Handle both old and new field names
      policyType: claim.policyType || '',
      incidentDate: claim.incidentDate || '',
      excess: claim.excess || '',
      netAmount: claim.netAmount || claim.netClaimAmount || '', // Handle both old and new field names
      supportingDocuments: claim.supportingDocuments || claim.supportingDocument || null // Handle both old and new field names
    });
    setIsEditModalOpenClaim(true);
  };

  const handleUpdateClaim = async (updatedClaimData) => {
    try {
      const { claimId, ...claimData } = updatedClaimData;
      
      // Get the original claim to compare changes
      const originalClaim = claims.find(c => c.claimId === claimId) || {};
      
      // Only include fields that have changed
      const changedFields = {};
      
      // Check each field for changes
      Object.keys(claimData).forEach(key => {
        const newValue = claimData[key];
        const oldValue = originalClaim[key];
        
        // Handle different data types and empty strings
        const hasChanged = (
          (newValue !== oldValue) && 
          (newValue !== '' || oldValue !== '') && // Don't treat empty string as a change if both are empty
          (newValue !== undefined) &&
          (newValue !== null)
        );

        if (hasChanged) {
          // Convert numeric fields
          if (['claimAmount', 'excess', 'netAmount', 'companyId', 'policyId'].includes(key)) {
            const value = parseFloat(newValue);
            if (!isNaN(value)) {
              changedFields[key] = key.includes('Id') ? parseInt(newValue, 10) : value;
            } else if (newValue === '') {
              // Handle empty numeric fields by setting them to null or 0 as needed
              changedFields[key] = key.includes('Id') ? null : 0;
            }
          } else {
            // For non-numeric fields, preserve empty strings
            changedFields[key] = newValue === '' ? '' : newValue;
          }
        }
      });
      
      // If no fields were changed, return early
      if (Object.keys(changedFields).length === 0) {
        toast.info('No changes detected');
        return false;
      }
      
      const response = await axios.put(
        `/api/claims/${claimId}`,
        changedFields,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Update the claims list with only the changed fields
        setClaims(prevClaims => 
          prevClaims.map(claim => 
            claim.claimId === claimId 
              ? { ...claim, ...changedFields, claimId } 
              : claim
          )
        );
        
        // Show success message with number of fields updated
        const updatedFieldsCount = Object.keys(changedFields).length;
        toast.success(`Successfully updated ${updatedFieldsCount} field${updatedFieldsCount > 1 ? 's' : ''}`);
        return true;
      }
    } catch (error) {
      console.error('Error updating claim:', error);
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(errorMessage);
      return false;
    }
  };

  const timelineEvents = []

  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
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
      console.log('Fetching users from /api/users...'); // Debug log
      const response = await axios.get('/api/users');
      console.log('Users API response:', response.data); // Debug log
      if (response.data && Array.isArray(response.data)) {
        console.log('Setting users:', response.data); // Debug log
        setUsers(response.data);
      } else {
        console.log('Invalid users data format:', response.data); // Debug log
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
  const statsClaim = [];

  const tabs = [
    { name: 'Dashboard', icon: BarChart3, active: activeTab === 'Dashboard', color: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
    { name: 'Claims', icon: FileCheck, active: activeTab === 'Claims', color: 'bg-gradient-to-br from-orange-600 via-red-600 to-pink-600' },
    { name: 'Policies', icon: Shield, active: activeTab === 'Policies', color: 'bg-gradient-to-r from-purple-600 to-pink-600' },
    { name: 'Users', icon: Users, active: activeTab === 'Users', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  ];

  const statsData = [];

  const recentActivity = [];

  const policies = [];

  const quickStats = [];

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
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user) => {
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
      const updatedUser = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        department: editFormData.department || null,
        location: editFormData.location || null,
        userRole: editFormData.userRole || 'Client',
        isActive: editFormData.accountStatus === 'Active' ? 1 : 0
      };

      await axios.put(
        `/api/users/${editFormData.id}`,
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
  const changeUsers = (formattedUsers) => {
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

      const response = await axios.post(
        "/api/users", formData
      );
      fetchUsers();
      setIsCreateModalOpen(false);
      toast.success('User created successfully!');

      if (response.status === 201 || response.status === 200) {
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
    console.log("inside handle confirm delete", selectedUser);


    if (!selectedUser?.id) {
      console.log("userid is not found");
      return;
    }
    try {
      await axios.delete(`/api/users/${selectedUser.id}`);


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
      // Use the correct case that matches the form field name (description with lowercase d)
      formData.append('description', formValues.description || '');
      formData.append('incidentDate', formValues.incidentDate);
      formData.append('createdByUserId', userData?.id || '');
      console.log('Creating claim with user ID:', userData?.id); // Debug log

      if (file) {
        formData.append('supportingDocuments', file);
      }

      // Send request via Axios
      const response = await axios.post(
        '/api/claims',
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
        description: '', // Changed from Description to description
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

  const handleCreatePolicy = async (policyFormData) => {
    try {
      if (!policyFormData.companyName || !policyFormData.year || !policyFormData.propertyType) {
        toast.error('Please fill in all required fields (Company, Year, Property Type)', {
          duration: 3000,
          position: 'top-center'
        });
        return;
      }

      const response = await axios.post('/api/policies/create', policyFormData);

      toast.success('Policy created successfully!', {
        duration: 3000,
        position: 'top-center'
      });

      setOpenIsModalOpenNew(false);

      // Refresh policy data if we're on the policies tab
      if (activeTab === 'Policies' && selectedCompanyPolicy && policyYear) {
        const company = policyCompanies.find(c => c.id === selectedCompanyPolicy);
        if (company) {
          await fetchPolicyData(company.name, policyYear);
        }
      }

    } catch (error) {
      // Handle duplicate policy error (409 Conflict)
      if (error.response?.status === 409) {
        const message = error.response?.data?.message || 'A policy for this company and year already exists.';
        toast.error(message, {
          duration: 6000,
          position: 'top-center',
          style: {
            background: '#FEF3C7',
            color: '#92400E',
            border: '1px solid #F59E0B'
          }
        });
      } else {
        const errorMsg = error.response?.data?.error || error.message;
        toast.error('Error creating policy: ' + errorMsg, {
          duration: 5000,
          position: 'top-center'
        });
      }
    }
  };

  const handleEditPolicy = (policy) => {
    setSelectedPolicy(policy);
    setIsEditPolicyModalOpen(true);
  };

  const handleUpdatePolicy = async (policyFormData) => {
    try {
      const response = await axios.put('/api/policies/update', policyFormData);

      toast.success('Policy updated successfully!', {
        duration: 3000,
        position: 'top-center'
      });

      setIsEditPolicyModalOpen(false);
      setSelectedPolicy(null);

      // Refresh policy data if we're on the policies tab
      if (activeTab === 'Policies' && selectedCompanyPolicy && policyYear) {
        const company = policyCompanies.find(c => c.id === selectedCompanyPolicy);
        if (company) {
          await fetchPolicyData(company.name, policyYear);
        }
      }

      // Reload the page to show updated values
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error('Error updating policy: ' + errorMsg, {
        duration: 5000,
        position: 'top-center'
      });
    }
  };


  const companies = allPolicyCompanies.map(company => company.name);

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
      const response = await axios.get('/api/users');

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
      const response = await axios.get('/api/claims', {
        params: {
          userRole: role,
          userEmail: userData?.email
        }
      });
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


  // Convert an amount in a given currency to GBP using live FX
  const toGBP = (amount, currency) => {
    if (!amount) return 0;
    const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : Number(amount);
    if (isNaN(num)) return 0;
    const code = (currency || 'GBP').toString().trim().toUpperCase();
    if (code === 'GBP') return num;
    const rate = fxRates?.[code];
    // With base=GBP, rate = 1 GBP -> rate units of foreign; foreign -> GBP = amount / rate
    return rate ? num / rate : num; // fallback: treat as GBP if unknown
  };

  // Calculate total premium across known premium columns and convert to GBP
  const calculateTotalPremium = () => {
    if (!companyPolicies || companyPolicies.length === 0) return '£0';

    const sumGBP = companyPolicies.reduce((sum, row) => {
      const currency = row['Currency'] || row['currency'] || 'GBP';
      const premiums = [
        row['Commercial Premium Paid'],
        row['Marine Premium Paid'],
        row['Building Premium Paid'],
        row['Fleet Premium Paid'],
        row['Premium Paid'] // fallback if present
      ];
      const rowTotalGBP = premiums.reduce((s, p) => s + toGBP(p, currency), 0);
      return sum + rowTotalGBP;
    }, 0);

    // Get currency symbol from first row or default to £
    const currencySymbol = companyPolicies[0]?.['Currency']?.match(/[£$€]/)?.[0] || '£';
    
    // Format: show K/M if large
    if (sumGBP >= 1_000_000) return `${currencySymbol}${(sumGBP / 1_000_000).toFixed(1)}M`;
    if (sumGBP >= 1_000) return `${currencySymbol}${(sumGBP / 1_000).toFixed(1)}K`;
    return `${currencySymbol}${sumGBP.toFixed(2)}`;
  };

  const statsDataDashboard = [
    {
      title: 'Total Policies',
      value: (latestYearSummary.policyCount || 0).toString(),
      // change: '+12%',
      // changeText: 'from last month',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Active Claims',
      value: claims
        ?.filter(claim => {
          const s = (claim?.status || '').toString().toLowerCase();
          return !(s.includes('approved') || s.includes('rejected'));
        })
        ?.length
        ?.toString() || '0',
      // change: '+5%',
      // changeText: 'from last month',
      icon: AlertCircle,
      color: 'orange'
    },
    {
      title: 'Total Premium',
      value: (() => {
        const sumGBP = latestYearSummary.totalPremiumGBP || 0;
        // Get currency symbol from latest year data or default to £
        const currencySymbol = latestYearSummary.currency?.match(/[£$€]/)?.[0] || '£';
        if (sumGBP >= 1_000_000) return `${currencySymbol}${(sumGBP / 1_000_000).toFixed(1)}M`;
        if (sumGBP >= 1_000) return `${currencySymbol}${(sumGBP / 1_000).toFixed(1)}K`;
        return `${currencySymbol}${sumGBP.toFixed(2)}`;
      })(),
      // change: '+18%',
      // changeText: 'from last month',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Registered Users',
      value: users?.length?.toString() || '0',
      // change: '+8%',
      // changeText: 'from last month',
      icon: Users,
      color: 'purple'
    }
  ];

  const recentActivityDashboard = useMemo(() => {
    if (!Array.isArray(claims) || claims.length === 0) {
      return [
        {
          type: 'info',
          title: 'No recent activities',
          subtitle: 'System',
          date: new Date().toISOString().split('T')[0],
          icon: AlertCircle
        }
      ];
    }

    const getType = (status) => {
      const s = (status || '').toString().toLowerCase();
      if (s.includes('approve')) return 'success';
      if (s.includes('reject') || s.includes('deny')) return 'error';
      if (s.includes('under') || s.includes('review') || s.includes('pending')) return 'warning';
      return 'info';
    };

    const getIcon = (status) => {
      const s = (status || '').toString().toLowerCase();
      if (s.includes('approve')) return CheckCircle;
      if (s.includes('reject') || s.includes('deny')) return X;
      if (s.includes('under') || s.includes('review') || s.includes('pending')) return AlertCircle;
      return Activity;
    };

    const parseDate = (d) => {
      if (!d) return null;
      try {
        const dt = new Date(d);
        return isNaN(dt.getTime()) ? null : dt;
      } catch {
        return null;
      }
    };
    const toISODate = (dt) => dt?.toISOString?.().split('T')[0];

    const items = claims
      .map((c) => {
        const updated = c.updatedAt || c.updated_on || c.modifiedAt || c.modified_on;
        const created = c.createdAt || c.created_on || c.createdDate;
        const incident = c.incidentDate;
        const updatedDt = parseDate(updated);
        const createdDt = parseDate(created);
        const incidentDt = parseDate(incident);
        // Sort by most recent change; fall back to created; finally incident
        const when = updatedDt || createdDt || incidentDt || new Date(0);
        // Display date: incidentDate preferred
        const displayDate = toISODate(incidentDt) || toISODate(when) || '';
        return {
          type: getType(c.status),
          title: `${c.status || 'Updated'} - ${c.claimType || 'Claim'}`,
          subtitle: c.companyName || c.company || c.assignedTo || 'System',
          date: displayDate,
          icon: getIcon(c.status),
          _sort: when.getTime()
        };
      })
      .sort((a, b) => b._sort - a._sort)
      .slice(0, 5)
      .map(({ _sort, ...rest }) => rest);

    return items.length > 0 ? items : [
      {
        type: 'info',
        title: 'No recent activities',
        subtitle: 'System',
        date: new Date().toISOString().split('T')[0],
        icon: AlertCircle
      }
    ];
  }, [claims]);
   
  const policiesDashboard = [];

  const quickStatsDashboard = [{
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
  }];
    
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
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'
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

        {activeTab === 'Dashboard' && (
        <DashboardTab 
          isDark={isDark}
          statsDataDashboard={statsDataDashboard}
          recentActivityDashboard={recentActivityDashboard}
          policiesDashboard={policiesDashboard}
          quickStats={quickStatsData}
          getColorClassesDashbaord={getColorClassesDashbaord}
        />
      )}
        {activeTab === 'Users' && (
        <Userr 
          openCreateModal={openCreateModal}
          stats={stats}
          isDark={isDark}
          users={users}
          changeUsers={changeUsers}
          getRoleDarkColor={getRoleDarkColor}
          getRoleColor={getRoleColor}
          getStatusDarkColor={getStatusDarkColor}
          getStatusColor={getStatusColorr}
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

        />)}

        {activeTab === 'Claims' && <Claims 
        role={role} 
        isDark={isDark}
        policyCompanies={policyCompanies}
        claims={claims}
        getStatusColorr={getStatusColorr}
        getPolicyTypeColorr={getPolicyTypeColorr}
        getClaimTypeColorr={getClaimTypeColorr}
        getStatusDarkColorr={getStatusDarkColorr}
        statsClaim={statsClaim}
        editFormDataClaim={editFormDataClaim}
        handleCloseModalClaim={handleCloseModalClaim}
        activeTabClaim={activeTabClaim}
        openActiveTabClaim={setActiveTabClaim}
        handleFormChangeClaim={handleFormChangeClaim}
        timelineEvents={timelineEvents}
        handleUpdateClaim={handleUpdateClaim}
        openEditModalOpenClaim={handleEditClaim}
        isEditModalOpenClaim={isEditModalOpenClaim}
        isModalOpenNew={isModalOpenNew}
        openIsModalOpenNew={setIsModalOpenNew}
        isOpenNewClaim={isOpenNewClaim}
        openIsOpenNewClaim={setIsOpenNewClaim}
        handleSubmitNewClaim={handleSubmitNewClaim}
        formDataNewClaim={formDataNewClaim}
        handleInputChangeNewClaim={handleInputChangeNewClaim}
        handleCloseNewClaim={handleCloseNewClaim}
        handleCancelNewClaim={handleCancelNewClaim}
        setActiveTabClaim={setActiveTabClaim}
        setIsEditModalOpenClaim={setIsEditModalOpenClaim}
        setIsOpenNewClaim={setIsOpenNewClaim}
        setIsModalOpenNew={setIsModalOpenNew}
        policyYear={policyYear}
        users={users}
        />}

        {activeTab === 'Policies' && <Policies
          isDark={isDark}
          role={role}
          selectedCompanyPolicy={selectedCompanyPolicy}
          changeSelectedCompanyPolicy={setSelectedCompanyPolicy}
          policyCompanies={policyCompanies}
          policyYear={policyYear}
          changePolicyYear={setPolicyYear}
          availableYears={availableYears}
          chooseSelectedInsuranceType={setSelectedInsuranceType}
          getInsuranceIcon={getInsuranceIcon}
          selectedInsuranceType={selectedInsuranceType}
          statsDataDashboard={statsDataDashboard}
          recentActivityDashboard={recentActivityDashboard}
          policiesDashboard={policiesDashboard}
          quickStatsDashboard={quickStatsDashboard}
          getColorClassesDashbaord={getColorClassesDashbaord}
          companyPolicies={companyPolicies}
          isPoliciesLoading={isPoliciesLoading}
          policiesError={policiesError}
          selectedCompanyData={selectedCompanyData}
          policyData={policyData}
          isLoading={isLoading}
          error={error}
          openIsModalOpenNew={setOpenIsModalOpenNew}
          allPolicies={allPolicies}
          rawPolicyRow={companyPolicies && companyPolicies.length > 0 ? companyPolicies[0] : null}
          onEditPolicy={handleEditPolicy}
        />}

      </main>

      {/* Add Policy Modal */}
      <AddPolicyModal
        isDark={isDark}
        isOpen={openIsModalOpenNew}
        onClose={() => setOpenIsModalOpenNew(false)}
        onSubmit={handleCreatePolicy}
        companies={companies}
      />

      {/* Edit Policy Modal */}
      <EditPolicyModal
        isDark={isDark}
        isOpen={isEditPolicyModalOpen}
        onClose={() => {
          setIsEditPolicyModalOpen(false);
          setSelectedPolicy(null);
        }}
        onSubmit={handleUpdatePolicy}
        policyData={selectedPolicy}
      />
    </div>
  );
};

export default Dashboard;

