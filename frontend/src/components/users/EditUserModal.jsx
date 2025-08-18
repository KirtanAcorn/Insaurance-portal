import { Edit, Users,Shield } from "lucide-react"

const EditUserModal = ({isEditModalOpen, isDark, selectedUser, handleCloseModal, editFormData, handleFormChange, handleUpdateUser}) => {
  console.log("🚀 ~ EditUserModal ~ editFormData:", editFormData)
  
  return (
    <>
    {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <div className={`w-full max-w-2xl rounded-xl shadow-2xl transition-colors ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              {/* Modal Header */}
              <div className={`px-6 py-4 border-b flex items-center justify-between ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Edit className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Edit User: {selectedUser?.firstName + " " + selectedUser?.lastName}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Update user information, permissions, and access levels
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className={`p-2 rounded-lg transition-colors cursor-pointer${
                    isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-6">
                {/* Personal Information Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Personal Information
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Full Name */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        First Name
                      </label>
                      <input
                        type="text"
                        value={editFormData.firstName}
                        onChange={(e) => handleFormChange('firstName', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={editFormData.lastName}
                        onChange={(e) => handleFormChange('lastName', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
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
                        value={editFormData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    {/* Department */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Department
                      </label>
                      <select
                        value={editFormData.department}
                        onChange={(e) => handleFormChange('department', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
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
                        value={editFormData.location}
                        onChange={(e) => handleFormChange('location', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    {/* User Role */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        User Role
                      </label>
                      <select
                        value={
                          editFormData.userRole ?? 
                          editFormData.role ?? 
                          editFormData.userrole ?? 
                          ""
                        }
                        onChange={(e) => handleFormChange("userRole", e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark 
                            ? "bg-gray-700 border-gray-600 text-white" 
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="Client">Client</option>
                        <option value="Team Member">Team Member</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Account Status Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Shield className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                    <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Account Status
                    </h4>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="accountActive"
                        checked={editFormData.accountStatus === 'Active'}
                        onChange={(e) => {
                          const newStatus = e.target.checked ? 'Active' : 'Inactive';
                          console.log('Toggle changed to:', newStatus);
                          handleFormChange('accountStatus', newStatus);
                        }}
                        className="sr-only"
                      />
                      <label
                        htmlFor="accountActive"
                        className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                          editFormData.accountStatus === 'Active' ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          editFormData.accountStatus === 'Active' ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}></div>
                      </label>
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {editFormData.accountStatus === 'Active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`px-6 py-4 border-t flex items-center justify-end space-x-3 ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <button
                  onClick={handleCloseModal}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer${
                    isDark 
                      ? 'text-gray-300 border border-gray-600 hover:bg-gray-700' 
                      : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-primary/90 h-10 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                >
                  Update User
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  )
}

export default EditUserModal