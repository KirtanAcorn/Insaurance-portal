import { BuildingIcon, UserIcon } from "lucide-react";

const ContentGrid = ({
  isDark,
  getInsuranceIcon,
  selectedInsuranceType,
  policyData = {},
  isLoading,
  error,
}) => {
  console.log('ContentGrid - Received props:', {
    selectedInsuranceType,
    policyData,
    isLoading,
    error,
    hasPolicyData: !!policyData && Object.keys(policyData).length > 0
  });
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

  // Function to get the correct data for the selected insurance type
  const getInsuranceDetails = (type) => {
    if (!policyData || Object.keys(policyData).length === 0) return {};
    
    console.log('getInsuranceDetails - policyData:', policyData);
    
    switch (type) {
      case 'Commercial':
        return {
          policyNumber: policyData['Commercial Policy'] || 'N/A',
          status: 'Active',
          startDate: policyData['Commercial Renewal Date'] ? new Date(policyData['Commercial Renewal Date']).toLocaleDateString('en-GB') : 'N/A',
          endDate: policyData['Commercial Renewal Date'] ? new Date(policyData['Commercial Renewal Date']).toLocaleDateString('en-GB') : 'N/A',
          premiumPaid: policyData['Commercial Premium Paid'] || 'N/A',
          sumAssured: policyData.stockCover || 'N/A',
          location: policyData.stockLocation || 'N/A',
          excessPerClaim: policyData.commercialExcessPerClaim || 'N/A',
          claimsMade: policyData.noOfClaimCommercial || 'N/A',
          coverage: {
            'Employee Liability Cover': policyData.employeeLiabilityCover || 'N/A',
            'Floating Stock': policyData.floatingStock || 'N/A',
            'Product Liability': policyData.productLiability || 'N/A'
          }
        };
      case 'Marine':
        return {
          policyNumber: policyData['Marine'] || 'N/A',
          status: 'Active',
          startDate: policyData['Marine Renewal'] ? new Date(policyData['Marine Renewal']).toLocaleDateString('en-GB') : 'N/A',
          endDate: policyData['Marine Renewal'] ? new Date(policyData['Marine Renewal']).toLocaleDateString('en-GB') : 'N/A',
          premiumPaid: policyData['Marine Premium Paid'] || 'N/A',
          sumAssured: policyData['Per Transit Cover'] || 'N/A',
          location: 'Multiple Locations',
          excessPerClaim: policyData['Cargo Excess Excess Per claim'] || 'N/A',
          claimsMade: policyData['No Of claim Cargo'] || 'N/A',
          coverage: {
            'Per Transit Cover': policyData['Per Transit Cover'] || 'N/A',
            'UK-UK/EU-EU/USA-USA': policyData['UK-UK/EU-EU/USA-USA'] || 'N/A',
            'UK-EU': policyData['UK-EU'] || 'N/A',
            'Cross Voyage': policyData['CROSS VOYAGE'] || 'N/A',
            'Air/Sea/Rail': policyData['AIR/SEA/RAIL'] || 'N/A',
            'Road': policyData['ROAD'] || 'N/A'
          }
        };
      case 'Property':
        return {
          policyNumber: policyData['Building Insurance'] || 'N/A',
          status: 'Active',
          startDate: policyData['Renewal Date'] ? new Date(policyData['Renewal Date']).toLocaleDateString('en-GB') : 'N/A',
          endDate: policyData['Renewal Date'] ? new Date(policyData['Renewal Date']).toLocaleDateString('en-GB') : 'N/A',
          premiumPaid: policyData['Building Premium Paid'] || 'N/A',
          sumAssured: policyData['Sume Assure(Value of )Premises'] || 'N/A',
          location: policyData['Building Location'] || 'N/A',
          excessPerClaim: policyData['Building Excess Per claim'] || 'N/A',
          claimsMade: policyData['No Of claim Building'] || 'N/A',
          coverage: {
            'Declare Value': policyData['Declare Value'] || 'N/A',
            'Property Type': policyData['Building Location'] || 'N/A'
          }
        };
      case 'Fleet':
        return {
          policyNumber: policyData['Fleet Policy'] || 'N/A',
          status: 'Active',
          startDate: policyData['Renewal Date2'] ? new Date(policyData['Renewal Date2']).toLocaleDateString('en-GB') : 'N/A',
          endDate: policyData['Renewal Date2'] ? new Date(policyData['Renewal Date2']).toLocaleDateString('en-GB') : 'N/A',
          premiumPaid: policyData['Fleet Premium Paid'] || 'N/A',
          sumAssured: 'N/A',
          location: 'N/A',
          excessPerClaim: policyData['Fleet Excess Per claim '] || 'N/A',
          claimsMade: policyData['No Of claim made fleet'] || 'N/A',
          coverage: {
            'Registered Vehicles': policyData['Reg No2'] || 'N/A',
          }
        };
      default:
        return null;
    }
  };

  const insuranceDetails = getInsuranceDetails(selectedInsuranceType);

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
                  <span className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{insuranceDetails.policyNumber}</span>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800'}`}>
                    {insuranceDetails.status}
                  </span>
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
                    <p className={`text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{insuranceDetails.startDate}</p>
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
                    <p className={`text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{insuranceDetails.endDate}</p>
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
                    <p className={`text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{insuranceDetails.premiumPaid}</p>
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
                  {Object.entries(insuranceDetails.coverage).map(([type, amount]) => (
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