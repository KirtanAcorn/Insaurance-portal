import { Edit, FileText, X } from "lucide-react";
import { useState, useEffect } from 'react';

const ClaimsEditModal = ({ 
  isDark, 
  isEditModalOpenClaim, 
  editFormDataClaim, 
  handleCloseModalClaim, 
  handleFormChangeClaim, 
  handleUpdateClaim, 
  users 
}) => {
  const [formData, setFormData] = useState(editFormDataClaim);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('Edit form data received:', editFormDataClaim); // Debug log
    console.log('Available users:', users); // Debug log
    console.log('Users array length:', users?.length); // Debug log
    console.log('Admin users:', users?.filter(user => (user.userRole || user.role) === 'Admin')); // Debug log
    setFormData(editFormDataClaim);
  }, [editFormDataClaim, users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedData);
    // Also update parent component's state
    if (handleFormChangeClaim) {
      handleFormChangeClaim(updatedData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleUpdateClaim(formData);
      handleCloseModalClaim();
    } catch (error) {
      console.error('Error updating claim:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditModalOpenClaim) return null;

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
                    Edit Claim: {formData.claimId}
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
                  ×
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
                          <select
                            name="claimType"
                            value={formData.claimType || ''}
                            onChange={handleInputChange}
                            required
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            isDark
                              ? "bg-gray-800 border-gray-600 text-gray-400"
                              : "bg-white border-gray-300 text-gray-500"
                          }`}
                        >
                          <option value="">Select claim type</option>
                          <option value="Property Damage">Property Damage</option>
                          <option value="Theft">Theft</option>
                          <option value="Fire Damage">
                          Fire Damage
                          </option>
                          <option value="Water Damage">
                          Water Damage
                          </option>
                          <option value="Public Liability">Public Liability</option>
                          <option value="Product Liability">Product Liability</option>
                          <option value="Vehicle Accident">Vehicle Accident</option>
                          <option value="Marine Loss">Marine Loss</option>
                        </select>
                      </div>

                      {/* Claim Amount */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Claim Amount
                        </label>
                        <input
                          type="text"
                          name="claimAmount"
                          value={formData.claimAmount || ''}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter claim amount"
                          className={`w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                          name="status"
                          value={formData.status || ''}
                          onChange={handleInputChange}
                          required
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
                          name="assignedToUserID"
                          value={String(formData.assignedToUserID || '')}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          <option value="">Select a user</option>
                          {Array.isArray(users) && users
                            .filter(user => (user.userRole || user.role) === 'Admin')
                            .map(user => (
                              <option key={user.id} value={String(user.id)}>
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
                        name="description"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        required
                        rows="4"
                        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
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
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-primary/90 h-10 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white"
              >
                {isSubmitting ? 'Updating...' : 'Update Claim'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ClaimsEditModal