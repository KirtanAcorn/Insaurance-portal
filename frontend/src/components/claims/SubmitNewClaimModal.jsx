import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Building, FileText, Upload, Calendar } from "lucide-react";
import { getCurrencySymbol } from "../../utils/currency";

const SubmitNewClaimModal = ({
  isDark,
  policyCompanies,
  isOpenNewClaim,
  openIsOpenNewClaim,
  handleSubmitNewClaim,
  formDataNewClaim,
  handleInputChangeNewClaim,
  handleCloseNewClaim,
  handleCancelNewClaim,
  policyYear,
}) => {
  const [policyData, setPolicyData] = useState(null);
  const [isPolicyLoading, setIsPolicyLoading] = useState(false);
  const [policyError, setPolicyError] = useState(null);

  const normalizeType = (name) => {
    if (!name) return "";
    const n = name.toLowerCase();
    if (n.includes("commercial")) return "Commercial Liability";
    if (n.includes("property")) return "Property";
    if (n.includes("marine")) return "Marine";
    if (n.includes("fleet")) return "Fleet";
    return name;
  };

  const formatCurrency = (value, currencyCode = 'GBP') => {
    if (value === null || value === undefined || value === "" || value === "N/A") return "N/A";
    try {
      const num = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : Number(value);
      if (isNaN(num)) return String(value);
      const symbol = getCurrencySymbol(currencyCode);
      return `${symbol}${num.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } catch {
      return String(value);
    }
  };

  const parseCurrency = (value) => {
    if (value === null || value === undefined || value === "" || value === "N/A") return 0;
    try {
      const num = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : Number(value);
      return isNaN(num) ? 0 : num;
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const companyName = formDataNewClaim?.companyName;
      if (!companyName || !policyYear) {
        setPolicyData(null);
        setPolicyError(null);
        return;
      }
      setIsPolicyLoading(true);
      setPolicyError(null);
      try {
        const res = await axios.get(`/api/policies/company-details`, {
          params: { companyName, renewalYear: policyYear, _t: Date.now() },
        });
        const apiData = Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;
        setPolicyData(apiData || null);
      } catch (err) {
        setPolicyData(null);
        setPolicyError(err?.response?.data?.message || err.message || "Failed to load policy details");
      } finally {
        setIsPolicyLoading(false);
      }
    };
    fetchDetails();
  }, [formDataNewClaim?.companyName, policyYear]);

  const getDetailsForSelectedPolicy = () => {
    if (!policyData) return null;
    const type = normalizeType(formDataNewClaim?.policyName);
    if (type === "Commercial Liability") {
      return {
        title: "Commercial Liability Insurance",
        policyId: policyData["Commercial Policy"] || "N/A",
        status: policyData["Policy Status"] || policyData["Status"] || "Active",
        sumAssured: formatCurrency(policyData["Employee Liability Cover"], policyData?.Currency) || "N/A",
        excess: formatCurrency(policyData["Commercial Excess Per claim"], policyData?.Currency) || "N/A",
        location: policyData["Stock Location"] || "N/A",
        claims: policyData["No Of claim Commercial"] ?? "N/A",
        coverage: [
          { label: "Public Liability", value: formatCurrency(policyData["Employee Liability Cover"], policyData?.Currency) || "N/A" },
          { label: "Product Liability", value: formatCurrency(policyData["Product Liability"], policyData?.Currency) || "N/A" },
          { label: "Floating Stock", value: formatCurrency(policyData["Floting stock"], policyData?.Currency) || "N/A" },
        ],
      };
    }
    if (type === "Property") {
      return {
        title: "Property Insurance",
        policyId: policyData["Building Insurance"] || "N/A",
        status: policyData["Policy Status"] || policyData["Status"] || "Active",
        sumAssured: formatCurrency(policyData["Sume Assure(Value of )Premises"], policyData?.Currency) || "N/A",
        excess: formatCurrency(policyData["Building Excess Per claim"], policyData?.Currency) || "N/A",
        location: policyData["Building Location"] || "N/A",
        claims: policyData["No Of claim Building"] ?? "N/A",
        coverage: [
          { label: "Building Value", value: formatCurrency(policyData["Sume Assure(Value of )Premises"], policyData?.Currency) || "N/A" },
          { label: "Declared Value", value: formatCurrency(policyData["Declare Value"], policyData?.Currency) || "N/A" },
          { label: "Location", value: policyData["Building Location"] || "N/A" },
        ],
      };
    }
    if (type === "Marine") {
      return {
        title: "Marine Insurance",
        policyId: policyData["Marine"] || "N/A",
        status: policyData["Policy Status"] || policyData["Status"] || "Active",
        sumAssured: formatCurrency(policyData["Per Transit Cover"], policyData?.Currency) || "N/A",
        excess: formatCurrency(policyData["Cargo Excess Excess Per claim"], policyData?.Currency) || "N/A",
        claims: policyData["No Of claim Cargo"] ?? "N/A",
        coverage: [
          { label: "Per Transit Cover", value: formatCurrency(policyData["Per Transit Cover"], policyData?.Currency) || "N/A" },
          { label: "Cross Voyage", value: formatCurrency(policyData["CROSS VOYAGE"], policyData?.Currency) || "N/A" },
        ],
      };
    }
    if (type === "Fleet") {
      return {
        title: "Fleet Insurance",
        policyId: policyData["Fleet Policy"] || "N/A",
        status: policyData["Policy Status"] || policyData["Status"] || "Active",
        sumAssured: formatCurrency(policyData["fleetSumAssured"], policyData?.Currency) || "N/A",
        excess: formatCurrency(policyData["Fleet Excess Per claim "], policyData?.Currency) || "N/A",
        location: policyData["fleetLocation"] || "Multiple Locations",
        claims: policyData["No Of claim made fleet"] ?? "N/A",
        coverage: [
          { label: "Registration Numbers", value: policyData["Reg No2"] || "N/A" },
          { label: "Coverage Type", value: policyData["Coverage Type"] || policyData["Fleet Coverage Type"] || "N/A" },
          { label: "Policy Type", value: policyData["Policy Type"] || "Fleet" },
        ],
      };
    }
    return null;
  };

  const selectedPolicyDetails = getDetailsForSelectedPolicy();
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
                          <option value="">Choose a company...</option>
                          {policyCompanies?.map((company) => (
                            <option key={company.id} value={company.name}>
                              {company.name}
                            </option>
                          ))}
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
                        Claim Amount
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
                      value={formDataNewClaim.description}
                      onChange={(e) =>
                        handleInputChangeNewClaim("description", e.target.value)
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
                    }`}>Supported formats: PDF, JPG, PNG, DOC, DOCX, ZIP, RAR (No size limit)</p>
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
                    <div className={`p-1.5 rounded-lg ${isDark ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
                      <Upload className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                    </div>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Supporting Documents
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="supportingDocument"
                      className={`group relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer hover:shadow-sm ${
                        isDark
                          ? 'border-gray-700 hover:border-orange-500/50 bg-gray-800/50 hover:bg-gray-800/70'
                          : 'border-gray-200 hover:border-orange-400 bg-gray-50 hover:bg-gray-100/50'
                      } ${formDataNewClaim.supportingDocument ? 'border-orange-500/50' : ''}`}
                    >
                      {formDataNewClaim.supportingDocument ? (
                        <div className="w-full">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30">
                              <FileText className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                            </div>
                            <div className="text-center">
                              <p className={`text-sm font-medium truncate max-w-[250px] ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                                {formDataNewClaim.supportingDocument.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {(formDataNewClaim.supportingDocument.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                            <div className="flex space-x-2 mt-2">
                              <span className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                isDark
                                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                              } shadow-sm`}>
                                Change File
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleInputChangeNewClaim("supportingDocument", null);
                                }}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                  isDark
                                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                }`}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={`p-3 rounded-full mb-3 transition-colors ${
                            isDark ? 'bg-gray-700/50 group-hover:bg-orange-900/20' : 'bg-gray-100 group-hover:bg-orange-50'
                          }`}>
                            <Upload className={`w-6 h-6 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
                          </div>
                          
                          <div className="space-y-1">
                            <p className={`text-sm font-medium ${
                              isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                              Drag and drop files here, or click to select
                            </p>
                            <p className={`text-xs ${
                              isDark ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              PDF, JPG, PNG, DOC, DOCX, ZIP, RAR (No size limit)
                            </p>
                          </div>
                          
                          <span className={`mt-4 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            isDark
                              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          } shadow-sm`}>
                            Select File
                          </span>
                        </>
                      )}
                      
                      <input
                        id="supportingDocument"
                        name="supportingDocument"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.zip,.rar"
                        className="sr-only"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            handleInputChangeNewClaim("supportingDocument", file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Side - Policy Details */}
                <div
                  className={`w-80 p-6 border-l ${isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                    }`}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <h3
                      className={`text-lg font-medium ${isDark ? "text-white" : "text-gray-900"
                        }`}
                    >
                      Policy Details
                    </h3>
                  </div>
                  <div
                    className={`rounded-lg p-4 mb-4 ${isDark ? "bg-gray-900" : "bg-white"
                      }`}
                  >
                    {isPolicyLoading ? (
                      <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Loading policy details...</div>
                    ) : policyError ? (
                      <div className={`text-sm ${isDark ? "text-red-400" : "text-red-600"}`}>{String(policyError)}</div>
                    ) : !formDataNewClaim?.companyName ? (
                      <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Select a company to view details.</div>
                    ) : !selectedPolicyDetails ? (
                      <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Select a policy to view details.</div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2 mb-3">
                          <Building
                            className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-500"}`}
                          />
                          <span
                            className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                          >
                            {selectedPolicyDetails.title}
                          </span>
                        </div>
                        <p
                          className={`text-sm mb-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                        >
                          Policy ID: {selectedPolicyDetails.policyId}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Status:</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {selectedPolicyDetails.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className={isDark ? "text-gray-400" : "text-gray-600"}>Sum Assured:</span>
                            <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{selectedPolicyDetails.sumAssured}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={isDark ? "text-gray-400" : "text-gray-600"}>Excess Per Claim:</span>
                            <span className="font-medium text-red-600">{selectedPolicyDetails.excess}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div
                    className={`rounded-lg p-4 ${isDark ? "bg-gray-900" : "bg-white"
                      }`}
                  >
                    <h4
                      className={`font-medium mb-3 ${isDark ? "text-white" : "text-gray-900"
                        }`}
                    >
                      Coverage Breakdown:
                    </h4>
                    {selectedPolicyDetails && selectedPolicyDetails.coverage ? (
                      <div className="space-y-2 text-sm">
                        {selectedPolicyDetails.coverage.map((c) => (
                          <div key={c.label} className="flex justify-between">
                            <span className={isDark ? "text-gray-400" : "text-gray-600"}>{c.label}:</span>
                            <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{c.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Select company and policy to view coverage.</div>
                    )}
                  </div>
                  {(() => {
                    const enteredAmount = Number(formDataNewClaim?.claimAmount) || 0;
                    const excessAmount = parseCurrency(selectedPolicyDetails?.excess);
                    const claimable = Math.max(0, enteredAmount - excessAmount);
                      return (
                        <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                          <span className={isDark ? "text-gray-400" : "text-green-400"}>Claimable Amount:</span>
                          <span className={`font-semibold ${isDark ? "text-white" : "text-green-400"}`}>{formatCurrency(claimable, policyData?.Currency)}</span>
                        </div>
                        );
                      })()}
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
