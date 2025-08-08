import { X, FileText, ClipboardList, Shield, Upload, Icon } from 'lucide-react';

const SubmitNewClaimModal = ({isModalOpenNew, handleCloseModalNew, tabsNew, openActiveTabNew, activeTabNew, formDataNew, handleInputChange, getSelectedCompany, handleSubmitNew}) => {


    const getSelectedPolicy = () => {
      const company = getSelectedCompany();
      return company?.policies[formDataNew.policy];
    };
  
  return (
    <>
    {isModalOpenNew &&  
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Submit New Claim</h3>
              <p className="text-sm text-gray-600">
                Complete the form below to submit a new insurance claim with automatic policy integration
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModalNew}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex space-x-8">
            {tabsNew.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTabNew === index;
              const isCompleted = index < activeTabNew;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => openActiveTabNew(index)}
                  className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors cursor-pointer ${
                    isActive 
                      ? 'border-blue-500 text-blue-600' 
                      : isCompleted 
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isActive 
                      ? tab.bgColor 
                      : isCompleted 
                        ? 'bg-green-100' 
                        : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-3 h-3 ${
                      isActive 
                        ? tab.color 
                        : isCompleted 
                          ? 'text-green-600' 
                          : 'text-gray-500'
                    }`} />
                  </div>
                  <span className="text-sm font-medium">{tab.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-6 max-h-[400px] overflow-y-auto">
          {/* Tab 0: Company & Policy */}
          {activeTabNew === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Company
                  </label>
                  <select
                    value={formDataNew.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose company</option>
                    <option value="manufacturing-co">🏭 Manufacturing Co Ltd</option>
                    <option value="tech-solutions">💻 Tech Solutions Inc</option>
                    <option value="retail-group">🏪 Retail Group Ltd</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Policy
                  </label>
                  <select
                    value={formDataNew.policy}
                    onChange={(e) => handleInputChange('policy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!formDataNew.company}
                  >
                    <option value="">Select company first</option>
                    {formDataNew.company && getSelectedCompany() && (
                      Object.entries(getSelectedCompany().policies).map(([key, policy]) => (
                        <option key={key} value={key}>
                          {policy.name} - {policy.id}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: Claim Information */}
          {activeTabNew === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claim Type
                  </label>
                  <select
                    value={formDataNew.claimType}
                    onChange={(e) => handleInputChange('claimType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select claim type</option>
                    <option value="auto">Auto Accident</option>
                    <option value="property">Property Damage</option>
                    <option value="medical">Medical</option>
                    <option value="liability">Liability</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claim Amount (£)
                  </label>
                  <input
                    type="text"
                    value={formDataNew.claimAmount}
                    onChange={(e) => handleInputChange('claimAmount', e.target.value)}
                    placeholder="Enter claim amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Description
                </label>
                <textarea
                  value={formDataNew.incidentDescription}
                  onChange={(e) => handleInputChange('incidentDescription', e.target.value)}
                  placeholder="Provide detailed description of the incident"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Date
                </label>
                <input
                  type="date"
                  value={formDataNew.incidentDate}
                  onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Supporting Documents */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Upload className="w-5 h-5 text-orange-600" />
                  <h4 className="text-lg font-medium text-gray-900">Supporting Documents</h4>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop files here, or click to select files</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)
                  </p>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                    Choose Files
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Policy Details */}
          {activeTabNew === 2 && (
            <div className="space-y-6">
              {getSelectedPolicy() ? (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {getSelectedPolicy().name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Policy ID: {getSelectedPolicy().id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Status:</span>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                          getSelectedPolicy().status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getSelectedPolicy().status}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-600">Sum Assured:</span>
                        <span className="ml-2 text-lg font-semibold text-gray-900">
                          {getSelectedPolicy().sumAssured}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-600">Excess Per Claim:</span>
                        <span className="ml-2 text-lg font-semibold text-red-600">
                          {getSelectedPolicy().excessPerClaim}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Location:</span>
                        <span className="ml-2 text-gray-900">
                          {getSelectedPolicy().location}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-600">Claims Made:</span>
                        <span className="ml-2 text-lg font-semibold text-gray-900">
                          {getSelectedPolicy().claimsMade}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Coverage Breakdown */}
                  <div className="mt-6">
                    <h5 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Coverage Breakdown:
                    </h5>
                    <div className="space-y-2">
                      {Object.entries(getSelectedPolicy().coverageBreakdown).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <span className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </span>
                          <span className="text-sm font-semibold text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900">Policy Details</h4>
                  <p className="text-gray-500 text-center max-w-md">
                    Select a company and policy to view details
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            onClick={handleCloseModalNew}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Submit Claim
          </button>
        </div>
      </div>
    </div> }

    </>

  );
};

export default SubmitNewClaimModal;