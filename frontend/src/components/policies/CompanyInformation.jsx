import {BuildingIcon, ChevronDownIcon, MapPin, Calendar, Hash, User, Briefcase, Users, CreditCard} from 'lucide-react'

const CompanyInformation = ({ 
  isDark,
  selectedCompanyPolicy, 
  changeSelectedCompanyPolicy, 
  policyCompanies, 
  policyYear, 
  changePolicyYear,
  availableYears = ['2024-2025', '2025-2026'],
  chooseSelectedInsuranceType, 
  getInsuranceIcon, 
  selectedInsuranceType,
  policyData = {}
}) => {
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return '-';
    }
  };
  return (
    <>
    <div className={`rounded-lg shadow-sm border p-6 mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <BuildingIcon className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Company Information</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Select company and configure policy settings</p>
                </div>
              </div>
    
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Select Company</label>
                  <div className="relative">
                    <select
                      value={selectedCompanyPolicy}
                      onChange={(e) => changeSelectedCompanyPolicy(e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                    >
                      <option value="">Choose a company...</option>
                      {policyCompanies.map(company => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Policy Year</label>
                  <div className="relative">
                    <select
                      value={policyYear}
                      onChange={(e) => changePolicyYear(e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                    >
                      {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>
    
              {/* Company Details */}
              {policyData && policyData['Company Name'] && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Company Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <MapPin className={`w-4 h-4 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <div>
                          <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Registered Address</p>
                          <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {policyData['Reg Address'] || '-'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Hash className={`w-4 h-4 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <div>
                          <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Registration Number</p>
                          <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {policyData['Reg No'] || '-'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Calendar className={`w-4 h-4 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <div>
                          <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Registration Date</p>
                          <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {formatDate(policyData['Reg Date'])}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <User className={`w-4 h-4 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <div>
                          <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Director</p>
                          <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {policyData['Director/Owner Name'] || '-'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Briefcase className={`w-4 h-4 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <div>
                          <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Insurance Agent</p>
                          <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {policyData['Insurance Agent'] || '-'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Users className={`w-4 h-4 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <div>
                          <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Employees</p>
                          <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {policyData['Emp Count'] || '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Insurance Type Selection */}
              <div className="mt-6">
                <div className="flex space-x-4">
                  {['Property', 'Commercial Liability', 'Fleet', 'Marine'].map((type) => (
                    <button
                      key={type}
                      onClick={() => chooseSelectedInsuranceType(type)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedInsuranceType === type
                          ? `${isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`
                          : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                      }`}
                    >
                      {getInsuranceIcon(type)}
                      <span>{type}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
    </>
  )
}

export default CompanyInformation