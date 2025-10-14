import { BuildingIcon, UserIcon } from "lucide-react";

const ContentGrid = ({
  isDark,
  getInsuranceIcon,
  selectedInsuranceType,
  policyData = {},
  isLoading,
  error,
}) => {
  console.log("===============", policyData)
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className={`text-center py-8 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
        Error loading policy data: {error.message || 'Unknown error occurred'}
      </div>
    );
  }

  // Handle case when no company is selected or no data is available
  if (!policyData || Object.keys(policyData).length === 0) {
    return (
      <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {policyData === null ? 
          'Please select a company to view details.' : 
          'No policy data available for the selected company and year.'}
      </div>
    );
  }

  // Normalize any missing/placeholder values to a dash for display
  const toDash = (v) => {
    const raw = v == null ? '' : String(v).trim();
    if (!raw || raw === 'N/A' || raw === 'Not Available' || raw === 'Invalid Date' || raw === '-') return '-';
    if (raw.startsWith('£') && raw.toLowerCase().includes('nan')) return '-';
    return raw;
  };

  // Helper function to parse date string in DD/MM/YYYY format
  const parseDate = (dateStr) => {
    if (!dateStr || dateStr === 'N/A') return null;
    
    try {
   
      
      // Handle DD/MM/YYYY format
      if (typeof dateStr === 'string' && dateStr.includes('/')) {
        const parts = dateStr.split('/').map(Number);
        if (parts.length === 3) {
          const [day, month, year] = parts;
          // Create date in UTC to avoid timezone issues
          const date = new Date(Date.UTC(year, month - 1, day));
          return isNaN(date.getTime()) ? null : date;
        }
      }
      
      // Try ISO format
      let date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
      
      // Try timestamp
      if (!isNaN(dateStr)) {
        date = new Date(Number(dateStr));
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
      
      
      return null;
    } catch (error) {
      return null;
    }
  };

  // Format date to display string
  const formatDateForDisplay = (date) => {
    if (!date) return '-';
    
    try {
      // Ensure we have a valid Date object
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return '-';
      
      // Format in UTC to avoid timezone issues
      return dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
        timeZoneName: 'short'
      });
    } catch (error) {
      return '-';
    }
  };

  // Get policy dates based on insurance type and company details
  const getPolicyDates = (insuranceType) => {
    if (!policyData) return { startDate: '-', endDate: '-' };
    
    let renewalDateStr;
    
    // Get the renewal date string based on insurance type
    switch(insuranceType) {
      case 'Property':
        renewalDateStr = policyData.RenewalDate || policyData.renewalDate;
        break;
        
      case 'Commercial Liability':
        renewalDateStr = policyData.CommercialRenewalDate || policyData.commercialRenewalDate;
        break;
        
      case 'Marine':
        renewalDateStr = policyData.MarineRenewal || policyData.marineRenewal;
        break;
        
      case 'Fleet':
        renewalDateStr = policyData.RenewalDate2 || policyData.renewalDate2;
        break;
        
      default:
        return { startDate: '-', endDate: '-' };
    }
    
    // Parse the end date from the renewal date string
    const endDateObj = parseDate(renewalDateStr);
    
    if (!endDateObj) {
      return { startDate: '-', endDate: '-' };
    }
    
    // Calculate start date (end date - 364 days)
    const startDateObj = new Date(endDateObj);
    
    // Use UTC methods to avoid timezone issues
    const utcYear = startDateObj.getUTCFullYear();
    const utcMonth = startDateObj.getUTCMonth();
    const utcDate = startDateObj.getUTCDate();
    
    // Create new date in UTC
    const calculatedStartDate = new Date(Date.UTC(utcYear, utcMonth, utcDate - 364));
    
    // Use the calculated date
    startDateObj.setTime(calculatedStartDate.getTime());
    
    const formattedStartDate = formatDateForDisplay(startDateObj);
    const formattedEndDate = formatDateForDisplay(endDateObj);
    return { startDate: formattedStartDate, endDate: formattedEndDate };
  };
  
  // Get dates based on selected insurance type
  const policyDates = getPolicyDates(selectedInsuranceType);

  // Function to get the correct data for the selected insurance type
  const getInsuranceDetails = (type) => {
    
    if (!policyData || Object.keys(policyData).length === 0) {
      return {
        policyNumber: '-',
        status: 'Inactive',
        startDate: '-',
        endDate: '-',
        premiumPaid: '-',
        sumAssured: '-',
        location: '-',
        excessPerClaim: '-',
        claimsMade: '-',
        coverage: {}
      };
    }
    
    // Helper function to format a date range from a single date
    const formatDateRange = (dateString) => {
      try {
        // Try to parse the date
        const parsedDate = new Date(dateString);
        
        if (isNaN(parsedDate.getTime())) {
          return { startDate: '-', endDate: '-' };
        }
        
        const formattedStartDate = formatDate(parsedDate, 364); // 364 days before end date
        const formattedEndDate = formatDate(parsedDate);
      
        return {
          startDate: formattedStartDate,
          endDate: formattedEndDate
        };
      } catch (error) {
        console.error('Error in formatDateRange:', { 
          error: error.message,
          dateString,
          type: typeof dateString 
        });
        return { startDate: '-', endDate: '-' };
      }
    };

    // Helper function to get policy period
    const getPolicyPeriod = (policyType) => {
      // Map policy types to their respective date fields in the API response
      const dateFieldMap = {
        'Commercial Liability': 'commercialRenewalDate',
        'Marine': 'marineRenewal',
        'Property': 'renewalDate',
        'Fleet': 'renewalDate2'
      };
      
      const fieldName = dateFieldMap[policyType];
      
      // Check if the field exists and has a value
      const fieldValue = policyData[fieldName];
      
      // If the field is empty or invalid, try alternative field names
      if (!fieldValue || fieldValue.trim() === '' || fieldValue === 'N/A' || fieldValue === 'Invalid Date' || fieldValue === '-') {
        
        // Define alternative field names for each policy type
        const alternativeFields = {
          'Commercial Liability': ['commercialRenewalDate', 'empLiabilityRenewalDate'],
          'Marine': ['marineRenewalDate', 'marineRenewal'],
          'Property': ['renewalDate', 'buildingRenewalDate'],
          'Fleet': ['renewalDate2', 'fleetRenewalDate']
        };
        
        // Try each alternative field until we find a valid date
        const alternatives = alternativeFields[policyType] || [];
        for (const altField of alternatives) {
          const altValue = policyData[altField];
          if (altValue && altValue.trim() !== '' && altValue !== 'N/A' && altValue !== 'Invalid Date' && altValue !== '-') {
            return formatDateRange(altValue);
          }
        }
        return { startDate: '-', endDate: '-' };
      }
      
      // If we have a valid field value, format it
      return formatDateRange(fieldValue);
    };
    
    switch (type) {
      case 'Commercial Liability': {
        const { startDate, endDate } = getPolicyPeriod('Commercial Liability');
        
        return {
          policyNumber: policyData['commercialPolicy'] || '-',
          status: 'Active',
          startDate,
          endDate,
          premiumPaid: policyData['commercialPremiumPaid'] || '-',
          sumAssured: policyData['employeeLiabilityCover'] || '-',
          location: policyData['stockLocation'] || '-',
          excessPerClaim: policyData['commercialExcessPerClaim'] || '-',
          claimsMade: policyData['noOfClaimCommercial'] || '0',
          coverage: {
            'Employee Liability Cover': policyData['employeeLiabilityCover'] || '-',
            'Floating Stock': policyData['floatingStock'] || '-',
            'Product Liability': policyData['productLiability'] || '-'
          }
        };
      }
      case 'Marine': {
        const { startDate, endDate } = getPolicyPeriod('Marine');
        return {
          policyNumber: policyData['marine'] || '-',
          status: 'Active',
          startDate,
          endDate,
          premiumPaid: policyData['marinePremiumPaid'] || '-',
          sumAssured: policyData['perTransitCover'] || '-',
          location: 'Multiple Locations',
          excessPerClaim: policyData['cargoExcessPerClaim'] || '-',
          claimsMade: policyData['noOfClaimCargo'] || '0',
          coverage: {
            'Per Transit Cover': policyData['perTransitCover'] || '-',
            'UK-UK/EU-EU/USA-USA': policyData['ukUkEuEuUsaUsa'] || '-',
            'UK-EU': policyData['ukEu'] || '-',
            'Cross Voyage': policyData['crossVoyage'] || '-',
            'Air/Sea/Rail': policyData['airSeaRail'] || '-',
            'Road': policyData['road'] || '-'
          }
        };
      }
      case 'Property': {
        const { startDate, endDate } = getPolicyPeriod('Property');
        return {
          policyNumber: policyData['buildingInsurance'] || '-',
          status: 'Active',
          startDate,
          endDate,
          premiumPaid: policyData['buildingPremiumPaid'] || '-',
          sumAssured: policyData['sumAssuredValueOfPremises'] || '-',
          location: policyData['buildingLocation'] || '-',
          excessPerClaim: policyData['buildingExcessPerClaim'] || '-',
          claimsMade: policyData['noOfClaimBuilding'] || '0',
          coverage: {
            'Building Value': policyData['sumAssuredValueOfPremises'] || '-',
            'Declared Value': policyData['declareValue'] || '-',
            'Location': policyData['buildingLocation'] || '-'
          }
        };
      }
      case 'Fleet': {
        const { startDate, endDate } = getPolicyPeriod('Fleet');
        console.log('Fleet policy data:', {
          policyNumber: policyData['fleetPolicy'],
          premiumPaid: policyData['fleetPremiumPaid'], 
          sumAssured: policyData['fleetSumAssured'], 
          location: policyData['fleetLocation'],    
          excessPerClaim: policyData['fleetExcessPerClaim'] || 'N/A', 
          claimsMade: policyData['noOfClaimMadeFleet'] || 'N/A'     
        });
        
        return {
          policyNumber: policyData['fleetPolicy'] || '-',
          status: 'Active',
          startDate,
          endDate,
          premiumPaid: policyData['fleetPremiumPaid'] || '-',
          sumAssured: policyData['fleetSumAssured'] || '-',
          location: policyData['fleetLocation'] || 'Multiple Locations',
          excessPerClaim: policyData['fleetExcessPerClaim'] || '-',
          claimsMade: policyData['noOfClaimMadeFleet'] || '-',
          coverage: {
            'Registration Numbers': policyData['regNo2'] || '-',
            'Coverage Type': 'Comprehensive',
            'Policy Type': 'Fleet'
          }
        };
      }
      default:
        return {};
    }
  };

  // Get the insurance details based on the selected type with a default empty object
  const insuranceDetails = selectedInsuranceType 
    ? (getInsuranceDetails(selectedInsuranceType) || {}) 
    : {};

  return (
    <>
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Company Details */}
        <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-green-900' : 'bg-green-100'}`}>
              <BuildingIcon className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Company Details</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Comprehensive company information</p>
            </div>
          </div>

          {/* Use policyData directly for company details */}
          {policyData.companyName ? (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <BuildingIcon className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>REG. ADDRESS</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.regAddress}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <BuildingIcon className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>WAREHOUSE ADDRESS</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.warehouseOfficeAddress}</p>
                </div>
              </div>
              
              {/* Other fields... */}
              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <svg className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>REG NO</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.regNo}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <svg className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>VAT NO</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.vatNumber}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <svg className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>COMMODITIES</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.commodity}</p>
                </div>
              </div>


              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <svg className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>REG DATE</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.regDate}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <UserIcon className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>DIRECTOR NAME</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.directorOwnerName}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <UserIcon className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>INSURANCE AGENT</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.insuranceAgent}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <BuildingIcon className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>COUNTRY</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.country}</p>
                </div>
              </div>

              

              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <UserIcon className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>EMPLOYEE COUNT</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.employeeCount}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <svg className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>TURNOVER (£)</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.turnoverGBP}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Please select a company to view details</p>
          )}
        </div>
        
        {/* Insurance Details */}
        <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
              {getInsuranceIcon(selectedInsuranceType)}
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedInsuranceType} Insurance</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Detailed policy information and coverage</p>
            </div>
          </div>

          {insuranceDetails ? (
            <div className="space-y-4">
              <div className={`flex justify-between items-center p-3 rounded-lg border-l-4 ${isDark ? 'bg-red-900/20 border-red-500' : 'bg-red-50 border-red-400'}`}>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Policy Number</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{
                    selectedInsuranceType === 'Property' ? policyData.buildingInsurance :
                    selectedInsuranceType === 'Commercial Liability' ? policyData.commercialPolicy :
                    selectedInsuranceType === 'Marine' ? policyData.marine :
                    selectedInsuranceType === 'Fleet' ? policyData.fleetPolicy :
                    'N/A'
                  }</span>
                  {/* <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800'}`}>
                    {insuranceDetails.status}
                  </span> */}
                </div>
              </div>

              {/* Other Insurance Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
                    <svg className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-xs font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Policy Start Date</p>
                    <p className={`text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                      {policyDates.startDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
                    <svg className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-xs font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Policy End Date</p>
                    <p className={`text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                      {policyDates.endDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
                    <svg className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-xs font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Premium Paid</p>
                    <p className={`text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {selectedInsuranceType === 'Property' && (policyData['buildingPremiumPaid'] || 'N/A')}
                    {selectedInsuranceType === 'Commercial Liability' && (policyData['commercialPremiumPaid'] || 'N/A')}
                    {selectedInsuranceType === 'Marine' && (policyData['marinePremiumPaid'] || 'N/A')}
                    {selectedInsuranceType === 'Fleet' && (policyData['fleetPremiumPaid'] || 'N/A')}
                  </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
                    <svg className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-xs font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Sum Assured</p>
                    <p className={`text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{insuranceDetails.sumAssured}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
                    <svg className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-xs font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Location</p>
                    <p className={`text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{insuranceDetails.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
                    <svg className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-xs font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Excess Per Claim</p>
                    <p className={`text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{insuranceDetails.excessPerClaim}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
                    <svg className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-xs font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Claims Made</p>
                    <p className={`text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{insuranceDetails.claimsMade}</p>
                  </div>
                </div>
              </div>

              {/* Coverage Breakdown */}
              <div className="mt-6">
                <h4 className={`text-sm font-medium mb-3 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Coverage Breakdown
                </h4>
                <div className="space-y-3">
                  {insuranceDetails.coverage && Object.entries(insuranceDetails.coverage).map(([type, amount]) => (
                    <div key={type} className={`flex justify-between items-center p-3 rounded-lg ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{type}:</span>
                      <span className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Please select an insurance type to view details</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ContentGrid;