import { BuildingIcon, UserIcon } from "lucide-react";

const ContentGrid = ({
  isDark,
  getInsuranceIcon,
  selectedInsuranceType,
  policyData = {},
  isLoading,
  error,
}) => {
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

  // Helper function to format dates and calculate policy periods
  const formatDate = (dateInput, subtractDays = 0) => {
    console.log('formatDate input:', { dateInput, subtractDays, type: typeof dateInput });
    
    // Handle invalid inputs
    if (!dateInput || dateInput === 'N/A' || dateInput === 'Invalid Date') {
      console.log('formatDate: Invalid input -', dateInput);
      return 'Not Available';
    }
    
    try {
      let date;
      
      // If input is already a Date object
      if (dateInput instanceof Date) {
        date = new Date(dateInput);
      } 
      // If input is a timestamp (number)
      else if (typeof dateInput === 'number') {
        date = new Date(dateInput);
      }
      // If input is a string
      else if (typeof dateInput === 'string') {
        // Try parsing as ISO string
        if (dateInput.includes('T') || dateInput.includes('Z')) {
          date = new Date(dateInput);
        } 
        // Try parsing as DD/MM/YYYY or MM/DD/YYYY
        else if (dateInput.includes('/')) {
          const [day, month, year] = dateInput.split('/').map(Number);
          // Try both DD/MM/YYYY and MM/DD/YYYY formats
          date = new Date(year, month - 1, day);
          if (isNaN(date.getTime())) {
            date = new Date(year, day - 1, month);
          }
        }
        // Try parsing as YYYY-MM-DD
        else if (dateInput.includes('-')) {
          date = new Date(dateInput);
        }
        
        // If still not a valid date, try the default Date constructor
        if (!date || isNaN(date.getTime())) {
          date = new Date(dateInput);
        }
      }
      
      // If we couldn't parse the date
      if (!date || isNaN(date.getTime())) {
        console.log('formatDate: Could not parse date -', dateInput);
        return 'Not Available';
      }
      
      // Subtract days if needed
      if (subtractDays > 0) {
        date.setDate(date.getDate() - subtractDays);
      }
      
      // Format the date
      const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        timeZone: 'UTC' // Ensure consistent timezone handling
      };
      
      const formattedDate = date.toLocaleDateString('en-GB', options);
      
      console.log('formatDate result:', { 
        input: dateInput, 
        parsedDate: date.toString(),
        formattedDate,
        timestamp: date.getTime()
      });
      
      return formattedDate;
    } catch (error) {
      console.error('formatDate error:', { 
        error: error.message, 
        input: dateInput,
        type: typeof dateInput
      });
      return 'Not Available';
    }
  };

  // Function to get the correct data for the selected insurance type
  const getInsuranceDetails = (type) => {
    console.log('getInsuranceDetails called with type:', type);
    console.log('Current policyData:', JSON.stringify(policyData, null, 2));
    
    if (!policyData || Object.keys(policyData).length === 0) {
      console.log('No policy data available');
      return {
        policyNumber: 'N/A',
        status: 'Inactive',
        startDate: 'Not Available',
        endDate: 'Not Available',
        premiumPaid: 'N/A',
        sumAssured: 'N/A',
        location: 'N/A',
        excessPerClaim: 'N/A',
        claimsMade: 'N/A',
        coverage: {}
      };
    }
    
    // Helper function to format a date range from a single date
    const formatDateRange = (dateString) => {
      try {
        // Try to parse the date
        const parsedDate = new Date(dateString);
        
        if (isNaN(parsedDate.getTime())) {
          console.log('Could not parse date:', dateString);
          return {
            startDate: 'Not Available',
            endDate: 'Not Available'
          };
        }
        
        const formattedStartDate = formatDate(parsedDate, 364); // 364 days before end date
        const formattedEndDate = formatDate(parsedDate);
        
        console.log('Formatted date range:', {
          input: dateString,
          parsed: parsedDate.toString(),
          formattedStartDate,
          formattedEndDate
        });
        
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
        return {
          startDate: 'Not Available',
          endDate: 'Not Available'
        };
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
      console.log('getPolicyPeriod:', { 
        policyType, 
        fieldName, 
        availableFields: Object.keys(policyData || {}) 
      });
      
      // Check if the field exists and has a value
      const fieldValue = policyData[fieldName];
      console.log('Raw date value from API:', { fieldName, fieldValue, type: typeof fieldValue });
      
      // If the field is empty or invalid, try alternative field names
      if (!fieldValue || fieldValue.trim() === '' || fieldValue === 'N/A' || fieldValue === 'Invalid Date') {
        console.log(`Field '${fieldName}' is empty or invalid, trying alternatives...`);
        
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
          if (altValue && altValue.trim() !== '' && altValue !== 'N/A' && altValue !== 'Invalid Date') {
            console.log(`Found valid date in alternative field '${altField}':`, altValue);
            return formatDateRange(altValue);
          }
        }
        
        console.log('No valid date found in any field');
        return {
          startDate: 'Not Available',
          endDate: 'Not Available'
        };
      }
      
      // If we have a valid field value, format it
      return formatDateRange(fieldValue);
    };
    
    switch (type) {
      case 'Commercial Liability': {
        const { startDate, endDate } = getPolicyPeriod('Commercial Liability');
        console.log('Commercial Liability policy data:', {
          policyNumber: policyData['commercialPolicy'],
          premiumPaid: policyData['commercialPremiumPaid'] || 'N/A',
          sumAssured: policyData['employeeLiabilityCover'] || 'N/A',
          location: policyData['stockLocation'] || 'N/A',
          excessPerClaim: policyData['commercialExcessPerClaim'] || 'N/A',
          claimsMade: policyData['noOfClaimCommercial'] || '0',
        });
        
        return {
          policyNumber: policyData['commercialPolicy'] || 'N/A',
          status: 'Active',
          startDate,
          endDate,
          premiumPaid: policyData['commercialPremiumPaid'] || 'N/A',
          sumAssured: policyData['employeeLiabilityCover'] || 'N/A',
          location: policyData['stockLocation'] || 'N/A',
          excessPerClaim: policyData['commercialExcessPerClaim'] || 'N/A',
          claimsMade: policyData['noOfClaimCommercial'] || '0',
          coverage: {
            'Employee Liability Cover': policyData['employeeLiabilityCover'] || 'N/A',
            'Floating Stock': policyData['floatingStock'] || 'N/A',
            'Product Liability': policyData['productLiability'] || 'N/A'
          }
        };
      }
      case 'Marine': {
        const { startDate, endDate } = getPolicyPeriod('Marine');
        console.log('Marine policy data:', {
          policyNumber: policyData['marine'],
          premiumPaid: policyData['marinePremiumPaid'] || 'N/A',
          sumAssured: policyData['perTransitCover'] || 'N/A',
          location: 'N/A',
          excessPerClaim: policyData['cargoExcessPerClaim'] || 'N/A',
          claimsMade: policyData['noOfClaimCargo'] || '0',
        });
        
        return {
          policyNumber: policyData['marine'] || 'N/A',
          status: 'Active',
          startDate,
          endDate,
          premiumPaid: policyData['marinePremiumPaid'] || 'N/A',
          sumAssured: policyData['perTransitCover'] || 'N/A',
          location: 'Multiple Locations',
          excessPerClaim: policyData['cargoExcessPerClaim'] || 'N/A',
          claimsMade: policyData['noOfClaimCargo'] || '0',
          coverage: {
            'Per Transit Cover': policyData['perTransitCover'] || 'N/A',
            'UK-UK/EU-EU/USA-USA': policyData['ukUkEuEuUsaUsa'] || 'N/A',
            'UK-EU': policyData['ukEu'] || 'N/A',
            'Cross Voyage': policyData['crossVoyage'] || 'N/A',
            'Air/Sea/Rail': policyData['airSeaRail'] || 'N/A',
            'Road': policyData['road'] || 'N/A'
          }
        };
      }
      case 'Property': {
        const { startDate, endDate } = getPolicyPeriod('Property');
        console.log('Property policy data:', {
          policyNumber: policyData['buildingInsurance'],
          premiumPaid: policyData['buildingPremiumPaid'] || 'N/A',
          sumAssured: policyData['sumAssuredValueOfPremises'] || 'N/A',
          location: policyData['buildingLocation'] || 'N/A',
          excessPerClaim: policyData['buildingExcessPerClaim'] || 'N/A',
          claimsMade: policyData['noOfClaimBuilding'] || '0',
        });
        
        return {
          policyNumber: policyData['buildingInsurance'] || 'N/A',
          status: 'Active',
          startDate,
          endDate,
          premiumPaid: policyData['buildingPremiumPaid'] || 'N/A',
          sumAssured: policyData['sumAssuredValueOfPremises'] || 'N/A',
          location: policyData['buildingLocation'] || 'N/A',
          excessPerClaim: policyData['buildingExcessPerClaim'] || 'N/A',
          claimsMade: policyData['noOfClaimBuilding'] || '0',
          coverage: {
            'Building Value': policyData['sumAssuredValueOfPremises'] || 'N/A',
            'Declared Value': policyData['declareValue'] || 'N/A',
            'Location': policyData['buildingLocation'] || 'N/A'
          }
        };
      }
      case 'Fleet': {
        const { startDate, endDate } = getPolicyPeriod('Fleet');
        console.log('Fleet policy data:', {
          policyNumber: policyData['fleetPolicy'],
          premiumPaid: 'N/A', // Add correct field once known
          sumAssured: 'N/A',  // Add correct field once known
          location: 'N/A',    // Add correct field once known
          excessPerClaim: 'N/A', // Add correct field once known
          claimsMade: 'N/A'     // Add correct field once known
        });
        
        return {
          policyNumber: policyData['fleetPolicy'] || 'N/A',
          status: 'Active',
          startDate,
          endDate,
          premiumPaid: policyData['fleetPremiumPaid'] || 'N/A',
          sumAssured: 'N/A',
          location: 'Multiple Locations',
          excessPerClaim: policyData['fleetExcessPerClaim'] || 'N/A',
          claimsMade: policyData['noOfClaimMadeFleet'] || 'N/A',
          coverage: {
            'Registration Numbers': policyData['regNo2'] || 'N/A',
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
                      {insuranceDetails.startDate || 'Not Available'}
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
                      {insuranceDetails.endDate || 'Not Available'}
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
                    <p className={`text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{policyData.buildingPremiumPaid}</p>
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