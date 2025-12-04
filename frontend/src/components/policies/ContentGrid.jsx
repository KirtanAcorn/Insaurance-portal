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
  
  // Helper function to check if a value is empty/null/undefined or just a dash
  const hasValue = (value) => {
    if (value === null || value === undefined || value === '') return false;
    const strValue = String(value).trim();
    return strValue !== '' && strValue !== '-' && strValue !== 'N/A' && strValue !== 'null' && strValue !== 'undefined';
  };
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
    
    switch (type) {
      case 'Commercial Liability': {
        const commercialCoverage = {};
        
        // Only add fields that have values
        if (hasValue(policyData['employeeLiabilityCover'])) commercialCoverage['Employee Liability Cover'] = policyData['employeeLiabilityCover'];
        if (hasValue(policyData['floatingStock'])) commercialCoverage['Floating Stock'] = policyData['floatingStock'];
        if (hasValue(policyData['productLiability'])) commercialCoverage['Product Liability'] = policyData['productLiability'];
        if (hasValue(policyData['stockLocation'])) commercialCoverage['Stock Location'] = policyData['stockLocation'];
        if (hasValue(policyData['stockCover'])) commercialCoverage['Stock Cover'] = policyData['stockCover'];
        if (hasValue(policyData['amazonVendorLiability'])) commercialCoverage['Amazon Vendor Liability'] = policyData['amazonVendorLiability'];
        if (hasValue(policyData['legalExpenseCover'])) commercialCoverage['Legal Expense Cover'] = policyData['legalExpenseCover'];
        
        return {
          policyNumber: policyData['commercialPolicy'] || '-',
          status: 'Active',
          premiumPaid: policyData['commercialPremiumPaid'] || '-',
          sumAssured: policyData['employeeLiabilityCover'] || '-',
          location: policyData['stockLocation'] || '-',
          excessPerClaim: policyData['commercialExcessPerClaim'] || '-',
          claimsMade: policyData['noOfClaimCommercial'] || '0',
          coverage: commercialCoverage
        };
      }
      case 'Marine': {
        const marineCoverage = {};
        
        // Only add fields that have values
        if (hasValue(policyData['perTransitCover'])) marineCoverage['Per Transit Cover'] = policyData['perTransitCover'];
        if (hasValue(policyData['ukUk'])) marineCoverage['UK-UK'] = policyData['ukUk'];
        if (hasValue(policyData['ukEu'])) marineCoverage['UK-EU'] = policyData['ukEu'];
        if (hasValue(policyData['ukUsaCanada'])) marineCoverage['UK-USA/Canada'] = policyData['ukUsaCanada'];
        if (hasValue(policyData['ukMiddleEastDubai'])) marineCoverage['UK-MiddleEast(Dubai)'] = policyData['ukMiddleEastDubai'];
        if (hasValue(policyData['usaMiddleEastDubai'])) marineCoverage['USA-MiddleEast(Dubai)'] = policyData['usaMiddleEastDubai'];
        if (hasValue(policyData['euMiddleEastDubai'])) marineCoverage['EU-MiddleEast(Dubai)'] = policyData['euMiddleEastDubai'];
        if (hasValue(policyData['euEu'])) marineCoverage['EU-EU'] = policyData['euEu'];
        if (hasValue(policyData['euUsa'])) marineCoverage['EU-USA'] = policyData['euUsa'];
        if (hasValue(policyData['usaUsa'])) marineCoverage['USA-USA'] = policyData['usaUsa'];
        if (hasValue(policyData['ukRow'])) marineCoverage['UK-ROW'] = policyData['ukRow'];
        if (hasValue(policyData['usaRow'])) marineCoverage['USA-ROW'] = policyData['usaRow'];
        if (hasValue(policyData['euRow'])) marineCoverage['EU-ROW'] = policyData['euRow'];
        if (hasValue(policyData['rowRow'])) marineCoverage['ROW-ROW'] = policyData['rowRow'];
        if (hasValue(policyData['crossVoyage'])) marineCoverage['Cross Voyage'] = policyData['crossVoyage'];
        if (hasValue(policyData['airSeaRail'])) marineCoverage['Air/Sea/Rail'] = policyData['airSeaRail'];
        if (hasValue(policyData['road'])) marineCoverage['Road'] = policyData['road'];
        if (hasValue(policyData['anyoneLocationInOrdinaryCourseOfTransit'])) marineCoverage['Anyone Location In Ordinary Course Of Transit'] = policyData['anyoneLocationInOrdinaryCourseOfTransit'];
        if (hasValue(policyData['cargoExcessPerClaim'])) marineCoverage['Cargo Excess Per Claim'] = policyData['cargoExcessPerClaim'];
        
        return {
          policyNumber: policyData['marine'] || '-',
          status: 'Active',
          premiumPaid: policyData['marinePremiumPaid'] || '-',
          sumAssured: policyData['perTransitCover'] || '-',
          location: '-',
          excessPerClaim: policyData['cargoExcessPerClaim'] || '-',
          claimsMade: policyData['noOfClaimCargo'] || '0',
          coverage: marineCoverage
        };
      }
      case 'Property': {
        const propertyCoverage = {};
        
        // Only add fields that have values
        if (hasValue(policyData['sumAssuredValueOfPremises'])) propertyCoverage['Building Value'] = policyData['sumAssuredValueOfPremises'];
        if (hasValue(policyData['declareValue'])) propertyCoverage['Declared Value'] = policyData['declareValue'];
        if (hasValue(policyData['buildingLocation'])) propertyCoverage['Location'] = policyData['buildingLocation'];
        
        return {
          policyNumber: policyData['buildingInsurance'] || '-',
          status: 'Active',
          premiumPaid: policyData['buildingPremiumPaid'] || '-',
          sumAssured: policyData['sumAssuredValueOfPremises'] || '-',
          location: policyData['buildingLocation'] || '-',
          excessPerClaim: policyData['buildingExcessPerClaim'] || '-',
          claimsMade: policyData['noOfClaimBuilding'] || '0',
          coverage: propertyCoverage
        };
      }
      case 'Fleet': {
        const fleetCoverage = {};
        
        // Only add fields that have values
        if (hasValue(policyData['regNo2'])) fleetCoverage['Registration Numbers'] = policyData['regNo2'];
        if (hasValue(policyData['fleetExcessPerClaim'])) fleetCoverage['Excess Per Claim'] = policyData['fleetExcessPerClaim'];
        
        return {
          policyNumber: policyData['fleetPolicy'] || '-',
          status: 'Active',
          premiumPaid: policyData['fleetPremiumPaid'] || '-',
          sumAssured: policyData['fleetSumAssured'] || '-',
          location: policyData['fleetLocation'] || '-',
          excessPerClaim: policyData['fleetExcessPerClaim'] || '-',
          claimsMade: policyData['noOfClaimMadeFleet'] || '-',
          coverage: fleetCoverage
        };
      }
      default:
        return {};
    }
  };

  // Check if a policy exists for the selected insurance type
  const policyExists = (type) => {
    if (!policyData || Object.keys(policyData).length === 0) return false;
    
    switch (type) {
      case 'Commercial Liability':
        return hasValue(policyData['commercialPolicy']);
      case 'Marine':
        return hasValue(policyData['marine']);
      case 'Property':
        return hasValue(policyData['buildingInsurance']);
      case 'Fleet':
        return hasValue(policyData['fleetPolicy']);
      default:
        return false;
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
              {hasValue(policyData.regAddress) && (
                <div className="flex items-start space-x-3">
                  <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <BuildingIcon className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>REG. ADDRESS</p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.regAddress}</p>
                  </div>
                </div>
              )}

              {hasValue(policyData.warehouseOfficeAddress) && (
                <div className="flex items-start space-x-3">
                  <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <BuildingIcon className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>WAREHOUSE ADDRESS</p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.warehouseOfficeAddress}</p>
                  </div>
                </div>
              )}
              
              {hasValue(policyData.regNo) && (
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
              )}

              {hasValue(policyData.vatNumber) && (
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
              )}

              {hasValue(policyData.commodity) && (
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
              )}

              {hasValue(policyData.regDate) && (
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
              )}

              {hasValue(policyData.companyFirstTimePolicy) && (
                <div className="flex items-start space-x-3">
                  <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <svg className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>FIRST TIME POLICY</p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.companyFirstTimePolicy}</p>
                  </div>
                </div>
              )}

              {hasValue(policyData.directorOwnerName) && (
                <div className="flex items-start space-x-3">
                  <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <UserIcon className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>DIRECTOR NAME</p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.directorOwnerName}</p>
                  </div>
                </div>
              )}

              {hasValue(policyData.insuranceAgent) && (
                <div className="flex items-start space-x-3">
                  <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <UserIcon className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>INSURANCE AGENT</p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.insuranceAgent}</p>
                  </div>
                </div>
              )}

              {hasValue(policyData.country) && (
                <div className="flex items-start space-x-3">
                  <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <BuildingIcon className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>COUNTRY</p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.country}</p>
                  </div>
                </div>
              )}

              {hasValue(policyData.employeeCount) && (
                <div className="flex items-start space-x-3">
                  <div className={`p-1 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <UserIcon className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>EMPLOYEE COUNT</p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.employeeCount}</p>
                  </div>
                </div>
              )}

              {hasValue(policyData.turnoverGBP) && (
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
              )}
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

          {policyExists(selectedInsuranceType) && insuranceDetails ? (
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
                {hasValue(policyDates.startDate) && (
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
                )}

                {hasValue(policyDates.endDate) && (
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
                )}

                {hasValue(insuranceDetails.premiumPaid) && (
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
                )}

                {hasValue(insuranceDetails.sumAssured) && (
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
                )}

                {hasValue(insuranceDetails.location) && (
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
                )}

                {hasValue(insuranceDetails.excessPerClaim) && (
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
                )}

                {hasValue(insuranceDetails.claimsMade) && (
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
                )}
              </div>

              {/* Coverage Breakdown - Only show if there are coverage items */}
              {insuranceDetails.coverage && Object.keys(insuranceDetails.coverage).length > 0 && (
                <div className="mt-6">
                  <h4 className={`text-sm font-medium mb-3 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Coverage Breakdown
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(insuranceDetails.coverage).map(([type, amount]) => (
                      <div key={type} className={`flex justify-between items-center p-3 rounded-lg ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{type}:</span>
                        <span className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {selectedInsuranceType 
                ? `No ${selectedInsuranceType} policy found for this company and year.` 
                : 'Please select an insurance type to view details'}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ContentGrid;