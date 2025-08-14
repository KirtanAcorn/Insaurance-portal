import { Edit, FileText, Calendar, X, User} from "lucide-react"

const ClaimsEditModal = ({ isDark, isEditModalOpenClaim, editFormDataClaim, handleCloseModalClaim, activeTabClaim, openActiveTabClaim, handleFormChangeClaim, timelineEvents, handleUpdateClaim, users }) => {

  return (
    <>
      {isEditModalOpenClaim && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <div className={`w-full max-w-6xl rounded-xl shadow-2xl transition-colors max-h-[90vh] overflow-hidden flex flex-col ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between flex-shrink-0 ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Edit className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Edit Claim: {editFormDataClaim.claimId}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Update claim information and status (Admin can edit all fields, Agents can edit claims under review)
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModalClaim}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="px-6 py-6 flex-1 overflow-y-auto">
              <div className="flex gap-6">
                {/* Left Column - All Information */}
                <div className="flex-1">
                  {/* Claim Information Section */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-2 mb-4">
                      <FileText className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Claim Information
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Claim Type */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Claim Type
                        </label>
                        <input
                          type="text"
                          value={editFormDataClaim.claimType}
                          onChange={(e) => handleFormChangeClaim('claimType', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>

                      {/* Claim Amount */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Claim Amount (£)
                        </label>
                        <input
                          type="text"
                          value={editFormDataClaim.claimAmount}
                          onChange={(e) => handleFormChangeClaim('claimAmount', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>

                      {/* Status */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Status
                        </label>
                        <select
                          value={editFormDataClaim.status}
                          onChange={(e) => handleFormChangeClaim('status', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          <option value="Under Review">Under Review</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>

                      {/* Assigned To */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Assigned To
                        </label>
                        <select
                          value={editFormDataClaim.assignedTo || ''}
                          onChange={(e) => handleFormChangeClaim('assignedTo', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          <option value="">Select a user</option>
                          {Array.isArray(users) && users
                            .filter(user => ['Admin', 'Team Member', 'Client'].includes(user.role))
                            .map(user => (
                              <option key={user.id} value={user.id}>
                                {user.firstName} {user.lastName}
                              </option>
                            ))
                          }
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-4">
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Description
                      </label>
                      <textarea
                        value={editFormDataClaim.description}
                        onChange={(e) => handleFormChangeClaim('description', e.target.value)}
                        rows="4"
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Policy Information Section */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-xs text-white font-bold">P</span>
                      <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Policy Information
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Policy ID */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Policy ID
                        </label>
                        <div className={`px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}>
                          {editFormDataClaim.policyId}
                        </div>
                      </div>

                      {/* Company */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Company
                        </label>
                        <div className={`px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}>
                          {editFormDataClaim.company}
                        </div>
                      </div>

                      {/* Policy Claim Amount */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Policy Claim Amount
                        </label>
                        <div className={`px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}>
                          {editFormDataClaim.claimAmountPolicy}
                        </div>
                      </div>

                      {/* Excess */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Excess
                        </label>
                        <div className={`px-3 py-2 rounded-lg border text-red-500 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                          {editFormDataClaim.excess}
                        </div>
                      </div>

                      {/* Net Amount */}
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Net Amount
                        </label>
                        <div className={`px-3 py-2 rounded-lg border text-green-500 font-semibold text-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                          {editFormDataClaim.netAmount}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Timeline */}
                <div className="w-80">
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Calendar className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                      <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Claim Timeline
                      </h4>
                    </div>
                    
                    <div className="space-y-4">
                      {timelineEvents.map((event, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                            event.active ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                          }`}></div>
                          <div className="flex-1">
                            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {event.title}
                            </div>
                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {event.subtitle} • {event.date}
                            </div>
                            {event.description && (
                              <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {event.description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t flex items-center justify-end space-x-3 flex-shrink-0 ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={handleCloseModalClaim}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  isDark 
                    ? 'text-gray-300 border border-gray-600 hover:bg-gray-700' 
                    : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateClaim}
                className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
              >
                Update Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ClaimsEditModal