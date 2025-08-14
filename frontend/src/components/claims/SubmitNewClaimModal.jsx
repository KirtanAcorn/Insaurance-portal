import React, { useState } from "react";
import { X, Building, FileText, Upload, Calendar } from "lucide-react";

const SubmitNewClaimModal = ({
  isDark,
  isOpenNewClaim,
  openIsOpenNewClaim,
  handleSubmitNewClaim,
  formDataNewClaim,
  handleInputChangeNewClaim,
  handleCloseNewClaim,
  handleCancelNewClaim,
}) => {
  return (
    isOpenNewClaim && (
      <>
        <div
          className={
            "fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-opacity-50"
          }
        >
          <div
            className={`rounded-lg shadow-xl max-w-5xl w-full overflow-hidden ${
              isDark ? "bg-gray-900" : "bg-white"
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between p-6 border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isDark ? "bg-blue-900" : "bg-blue-100"
                  }`}
                >
                  <FileText
                    className={`w-4 h-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                </div>
                <div>
                  <h2
                    className={`text-xl font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Submit New Claim
                  </h2>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Complete the form below to submit a new insurance claim with
                    automatic policy integration
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseNewClaim}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
              >
                <X
                  className={`w-5 h-5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </button>
            </div>

            {/* Content */}
            <div className="flex overflow-y-auto">
              {/* Left Side - Form */}
              <div className="flex-1 p-6 max-h-[calc(90vh-140px)]">
                {/* Company & Policy Section */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Building
                      className={`w-5 h-5 ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <h3
                      className={`text-lg font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Company & Policy
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Select Company */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Select Company
                      </label>
                      <div className="relative">
                        <Building
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                            isDark ? "text-blue-400" : "text-blue-500"
                          }`}
                        />
                        <select
                          value={formDataNewClaim.companyName}
                          onChange={(e) =>
                            handleInputChangeNewClaim(
                              "companyName",
                              e.target.value
                            )
                          }
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            isDark
                              ? "bg-gray-800 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        >
                          <option value="Astute Healthcare limited">
                          Astute Healthcare limited
                          </option>
                          <option value="Beauty Magasin Ltd">Beauty Magasin Ltd</option>
                          <option value="The Future Center Storage and Distribution Limited">The Future Center Storage and Distribution Limited</option>
                          <option value="Jambo Supplies Limited">Jambo Supplies Limited</option>
                          <option value="Virtual Works 360 Limited">Virtual Works 360 Limited</option>
                          <option value="Acme Pharma Ltd">Acme Pharma Ltd</option>
                          <option value="London Luxury Product">London Luxury Product</option>
                          <option value="Activecare Online">Activecare Online</option>
                          <option value="Hardlow Lubricants Limited">Hardlow Lubricants Limited</option>
                          <option value="Safe Storage and Distribution Limited">Safe Storage and Distribution Limited</option>
                          <option value="Jambo BV">Jambo BV</option>                          
                          <option value="Doc Pharm GmbH">Doc Pharm GmbH</option>
                          <option value="Beauty Care Global sp. Zoo">Beauty Care Global sp. Zoo</option>
                          <option value="Lifexa BVBA">Lifexa BVBA</option>
                          <option value="Beauty Store LLC">Beauty Store LLC</option>
                          <option value="Beyondtrend USA LLC">Beyondtrend USA LLC</option>
                          <option value="Jambo Wholesale Corporation LLC">Jambo Wholesale Corporation LLC</option>
                          <option value="Global Brand Storage & Ditribution LLC">Global Brand Storage & Ditribution LLC</option>
                          <option value="AHA Goods Wholeseller LLC">AHA Goods Wholeseller LLC</option>
                          <option value="A2Z (Acorn USA)">A2Z (Acorn USA)</option>
                          <option value="J & D International Business">J & D International Business</option>
                          <option value="Acorn Solution Ltd">Acorn Solution Ltd</option>
                          <option value="Astute Wholesale Limited">Astute Wholesale Limited</option>
                          <option value="GCET Limited">GCET Limited</option>
                          <option value="The Future Center Property Management Limited">The Future Center Property Management Limited</option>
                          <option value="Hetasveeben & Pratibhakumari - Landlord">Hetasveeben & Pratibhakumari - Landlord</option>
                          <option value="AUCLLP">AUCLLP</option>
                          </select>
                      </div>
                    </div>

                    {/* Select Policy */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Select Policy
                      </label>
                      <select
                        value={formDataNewClaim.policyName}
                        onChange={(e) =>
                          handleInputChangeNewClaim(
                            "policyName",
                            e.target.value
                          )
                        }
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          isDark
                            ? "bg-gray-800 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="Property Insurance">
                        Property Insurance
                        </option>
                        <option value="Commercial Liability Insurance">
                        Commercial Liability Insurance
                        </option>
                        <option value="Marine Insurance">
                        Marine Insurance
                        </option>
                        <option value="Fleet Insurance">Fleet Insurance</option>
                      </select>
                      <p
                        className={`text-xs mt-1 ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                      
                      </p>
                    </div>
                  </div>
                </div>

                {/* Claim Information Section */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText
                      className={`w-5 h-5 ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                    />
                    <h3
                      className={`text-lg font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Claim Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Claim Type */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Claim Type
                      </label>
                      <select
                        value={formDataNewClaim.claimType}
                        onChange={(e) =>
                          handleInputChangeNewClaim("claimType", e.target.value)
                        }
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
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Claim Amount (£)
                      </label>
                      <input
                        type="number"
                        placeholder="Enter claim amount"
                        value={formDataNewClaim.claimAmount}
                        onChange={(e) =>
                          handleInputChangeNewClaim(
                            "claimAmount",
                            e.target.value
                          )
                        }
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          isDark
                            ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Incident Description */}
                  <div className="mb-4">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Incident Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Provide detailed description of the incident"
                      value={formDataNewClaim.Description}
                      onChange={(e) =>
                        handleInputChangeNewClaim("Description", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors ${
                        isDark
                          ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>

                  {/* Incident Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Incident Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formDataNewClaim.incidentDate}
                          onChange={(e) =>
                            handleInputChangeNewClaim(
                              "incidentDate",
                              e.target.value
                            )
                          }
                          placeholder="dd-mm-yyyy"
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            isDark
                              ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supporting Documents Section */}
                {/* <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Upload className={`w-5 h-5 ${
                      isDark ? 'text-orange-400' : 'text-orange-600'
                    }`} />
                    <h3 className={`text-lg font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>Supporting Documents</h3>
                  </div>
                  
                  

                  <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDark 
                      ? 'border-gray-600 hover:border-gray-500' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <Upload className={`w-12 h-12 mx-auto mb-4 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <p className={`mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Drag and drop files here, or click to select files</p>
                    <p className={`text-sm mb-4 ${
                      isDark ? 'text-gray-500' : 'text-gray-500'
                    }`}>Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)</p>
                    <button className={`px-4 py-2 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      Choose Files
                    </button>
                  </div>
                </div> */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Upload
                      className={`w-5 h-5 ${
                        isDark ? "text-orange-400" : "text-orange-600"
                      }`}
                    />
                    <h3
                      className={`text-lg font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Supporting Documents
                    </h3>
                  </div>

                  <label
                    htmlFor="supportingDocument"
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                      isDark
                        ? "border-gray-600 hover:border-gray-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Upload
                      className={`w-12 h-12 mx-auto mb-4 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Drag and drop files here, or click to select files
                    </p>
                    <p
                      className={`text-sm mb-4 ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB
                      each)
                    </p>
                    <span
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isDark
                          ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Choose File
                    </span>
                    <input
                      id="supportingDocument"
                      name="supportingDocument"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          // Call your handler to store the file in state
                          handleInputChangeNewClaim(
                            "supportingDocument",
                            e.target.files[0]
                          );
                        }
                      }}
                    />
                  </label>
                  {formDataNewClaim.supportingDocument && (
                    <div className="mt-2 text-sm text-gray-600">
                      Selected: {formDataNewClaim.supportingDocument.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Policy Details */}
              <div
                className={`w-80 p-6 border-l ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <h3
                    className={`text-lg font-medium ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Policy Details
                  </h3>
                </div>

                <div
                  className={`rounded-lg p-4 mb-4 ${
                    isDark ? "bg-gray-900" : "bg-white"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <Building
                      className={`w-5 h-5 ${
                        isDark ? "text-blue-400" : "text-blue-500"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Commercial Liability Insurance
                    </span>
                  </div>
                  <p
                    className={`text-sm mb-3 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Policy ID: TS2024001
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Status:
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span
                        className={isDark ? "text-gray-400" : "text-gray-600"}
                      >
                        Sum Assured:
                      </span>
                      <span
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        £5,000,000
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={isDark ? "text-gray-400" : "text-gray-600"}
                      >
                        Excess Per Claim:
                      </span>
                      <span className="font-medium text-red-600">£2,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={isDark ? "text-gray-400" : "text-gray-600"}
                      >
                        Location:
                      </span>
                      <span
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        All UK Premises
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={isDark ? "text-gray-400" : "text-gray-600"}
                      >
                        Claims Made:
                      </span>
                      <span
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        0
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-lg p-4 ${
                    isDark ? "bg-gray-900" : "bg-white"
                  }`}
                >
                  <h4
                    className={`font-medium mb-3 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Coverage Breakdown:
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span
                        className={isDark ? "text-gray-400" : "text-gray-600"}
                      >
                        Public Liability:
                      </span>
                      <span
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        £5,000,000
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={isDark ? "text-gray-400" : "text-gray-600"}
                      >
                        Product Liability:
                      </span>
                      <span
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        £2,000,000
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={isDark ? "text-gray-400" : "text-gray-600"}
                      >
                        Employers Liability:
                      </span>
                      <span
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        £10,000,000
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`flex items-center justify-end space-x-3 px-6 py-4 border-t ${
                isDark
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <button
                onClick={handleCancelNewClaim}
                className={`px-4 py-2 border rounded-lg transition-colors ${
                  isDark
                    ? "text-gray-300 border-gray-600 hover:bg-gray-700"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitNewClaim(formDataNewClaim, formDataNewClaim.supportingDocument)}
                className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-primary/90 h-10 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                Submit Claim
              </button>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default SubmitNewClaimModal;
