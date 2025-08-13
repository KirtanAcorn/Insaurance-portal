import {User, Users, UserPlus, X, Shield, Building, Key, Eye, Settings, FileText} from 'lucide-react'

const AddUserModal = ({isCreateModalOpen, isDark, handleCloseModalCreateUser, formData, handleFormChangeCreateUser, companies, handleCompanyAccessChange, handlePermissionChange, handleCreateUser}) => {
  return (
    <>
        {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <div className="flex min-h-full items-start justify-center p-4 py-8">
            <div className={`fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between rounded-xl ${
              isDark ? 'border-gray-800 bg-gray-800' : 'border-white bg-white'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Create New User
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Add a new user to the system with appropriate permissions and access levels
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModalCreateUser}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              {/* Personal Information Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Personal Information
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* First Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => handleFormChangeCreateUser('firstName', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => handleFormChangeCreateUser('lastName', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => handleFormChangeCreateUser('email', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter phone number"
                      value={formData.phoneNumber}
                      onChange={(e) => handleFormChangeCreateUser('phoneNumber', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => handleFormChangeCreateUser('department', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Select department</option>
                      <option value="Operations">Operations</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Administration">Administration</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Enter location"
                      value={formData.location}
                                              onChange={(e) => handleFormChangeCreateUser('location', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Role and Access Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Role and Access
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* User Role */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      User Role
                    </label>
                    <select
                      value={formData.userRole}
                      onChange={(e) => handleFormChangeCreateUser('userRole', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Select user role</option>
                      <option value="Client">👤 Client</option>
                      <option value="Team Member">⚡ Team Member</option>
                      <option value="Admin">👑 Admin</option>
                    </select>
                  </div>

                  {/* Account Status */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Account Status
                    </label>
                    <select
                      value={formData.accountStatus}
                      onChange={(e) => handleFormChangeCreateUser('accountStatus', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="Active">🟢 Active</option>
                      <option value="Inactive">🔴 Inactive</option>
                      <option value="Pending">🟡 Pending</option>
                    </select>
                  </div>
                </div>

                {/* Temporary Password */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Temporary Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter temporary password"
                    value={formData.temporaryPassword}
                    onChange={(e) => handleFormChangeCreateUser('temporaryPassword', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>

              {/* Company Access Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Building className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Company Access
                  </h4>
                </div>
                
                <div className={`space-y-3 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  {companies.map((company) => (
                    <div key={company} className="flex items-center space-x-3">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id={company}
                          name="companyAccess"
                          checked={(formData?.companyAccess || []).includes(company)}
                          onChange={() => handleCompanyAccessChange(company)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                      <label
                        htmlFor={company}
                        className={`flex items-center space-x-2 cursor-pointer ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        <Building className="w-4 h-4 text-blue-500" />
                        <span>{company}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permissions Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Key className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                  <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Permissions
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* View Claims */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Eye className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        View Claims
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="viewClaims"
                        checked={formData.permissions.viewClaims}
                        onChange={() => handlePermissionChange('viewClaims')}
                        className="sr-only"
                      />
                      <label
                        htmlFor="viewClaims"
                        className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                          formData.permissions.viewClaims ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          formData.permissions.viewClaims ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}></div>
                      </label>
                    </div>
                  </div>

                  {/* Process Claims */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Settings className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Process Claims
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="processClaims"
                        checked={formData.permissions.processClaims}
                        onChange={() => handlePermissionChange('processClaims')}
                        className="sr-only"
                      />
                      <label
                        htmlFor="processClaims"
                        className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                          formData.permissions.processClaims ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          formData.permissions.processClaims ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}></div>
                      </label>
                    </div>
                  </div>

                  {/* Create Policies */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Create Policies
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="createPolicies"
                        checked={formData.permissions.createPolicies}
                        onChange={() => handlePermissionChange('createPolicies')}
                        className="sr-only"
                      />
                      <label
                        htmlFor="createPolicies"
                        className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                          formData.permissions.createPolicies ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          formData.permissions.createPolicies ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}></div>
                      </label>
                    </div>
                  </div>

                  {/* Manage Users */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Manage Users
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="manageUsers"
                        checked={formData.permissions.manageUsers}
                        onChange={() => handlePermissionChange('manageUsers')}
                        className="sr-only"
                      />
                      <label
                        htmlFor="manageUsers"
                        className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                          formData.permissions.manageUsers ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          formData.permissions.manageUsers ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes Section */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Add any additional notes or comments about this user..."
                  value={formData.additionalNotes}
                  onChange={(e) => handleFormChangeCreateUser('additionalNotes', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t flex items-center justify-end space-x-3 rounded-xl ${
              isDark ? 'border-gray-800 bg-gray-800' : 'border-white bg-white'
            }`}>
              <button
                onClick={handleCloseModalCreateUser}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer${
                  isDark 
                    ? 'text-gray-300 border-gray-600 hover:bg-gray-700' 
                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create User</span>
              </button>
            </div>
           </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddUserModal