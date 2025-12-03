import React, { useState } from 'react';
import { X, Building, FileText, DollarSign, Ship, Truck, Home } from 'lucide-react';

const AddPolicyModal = ({ isDark, isOpen, onClose, onSubmit }) => {
  const initialState = {
    // Common fields for all property types
    companyName: '', year: '', propertyType: '',
    country: '', regAddress: '', warehouseOfficeAddress: '', regNo: '', regDate: '',
    companyFirstTimePolicy: '', directorOwnerName: '', companyHandledBy: '', vatNumber: '',
    commodity: '', currency: '', turnoverGBP: '', insuranceAgent: '', accountHandler: '', empCount: '',
    // Commercial fields
    commercialPolicy: '', commercialPolicyLink: '', commercialRenewalDate: '', commercialPremiumPaid: '',
    employeeLiabilityCover: '', empLiabilityRenewalDate: '', floatingStock: '', stockCover: '',
    stockLocation: '', productLiability: '', amazonVendorLiability: '', legalExpenseCover: '',
    commercialExcessPerClaim: '', noOfClaimCommercial: '',
    // Marine fields
    marine: '', marinePolicyLink: '', marineRenewal: '', marinePremiumPaid: '', perTransitCover: '',
    ukUk: '', ukEu: '', ukUsaCanada: '', ukMiddleEastDubai: '', usaMiddleEastDubai: '',
    euMiddleEastDubai: '', euEu: '', euUsa: '', usaUsa: '', ukRow: '', usaRow: '', euRow: '',
    rowRow: '', crossVoyage: '', airSeaRail: '', road: '', anyLocationInOrdinaryCourseOfTransit: '',
    cargoExcessPerClaim: '', noOfClaimCargo: '',
    // Property fields
    buildingInsurance: '', propertyPolicyLink: '', renewalDate: '', buildingPremiumPaid: '',
    sumAssuredValueOfPremises: '', declareValue: '', buildingLocation: '', buildingExcessPerClaim: '',
    noOfClaimBuilding: '',
    // Fleet fields
    fleetPolicy: '', fleetPolicyLink: '', renewalDate2: '', fleetPremiumPaid: '', regNo2: '',
    fleetExcessPerClaim: '', noOfClaimMadeFleet: ''
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmit = () => onSubmit(formData);
  const handleCancel = () => { setFormData(initialState); onClose(); };

  if (!isOpen) return null;

  const companies = ['Astute Healthcare limited', 'Beauty Magasin Ltd', 'The Future Center Storage and Distribution Limited',
    'Jambo Supplies Limited', 'Virtual Works 360 Limited', 'Acme Pharma Ltd', 'London Luxury Product',
    'Activecare Online', 'Hardlow Lubricants Limited', 'Safe Storage and Distribution Limited', 'Jambo BV',
    'Doc Pharm GmbH', 'Beauty Care Global sp. Zoo', 'Lifexa BVBA', 'Beauty Store LLC', 'Beyondtrend USA LLC',
    'Jambo Wholesale Corporation LLC', 'Global Brand Storage & Ditribution LLC', 'AHA Goods Wholeseller LLC',
    'A2Z (Acorn USA)', 'J & D International Business', 'Acorn Solution Ltd', 'Astute Wholesale Limited',
    'GCET Limited', 'The Future Center Property Management Limited', 'Hetasveeben & Pratibhakumari - Landlord', 'AUCLLP'];

  const years = ['2024-2025', '2025-2026', '2026-2027', '2027-2028'];
  const propertyTypes = ['Commercial', 'Marine', 'Property', 'Fleet'];

  const InputField = ({ label, field, type = 'text', placeholder }) => (
    <div>
      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>
      <input type={type} value={formData[field]} onChange={(e) => handleChange(field, e.target.value)}
        className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
        placeholder={placeholder} />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Add New Policy</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Create a new insurance policy record</p>
            </div>
          </div>
          <button onClick={handleCancel} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Building className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Policy Information</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Select Company *</label>
                <select value={formData.companyName} onChange={(e) => handleChange('companyName', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                  <option value="">Select a company</option>
                  {companies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Select Year *</label>
                <select value={formData.year} onChange={(e) => handleChange('year', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                  <option value="">Select a year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Select Property Type *</label>
                <select value={formData.propertyType} onChange={(e) => handleChange('propertyType', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                  <option value="">Select property type</option>
                  {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Common Company Information Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Building className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Company Information</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Country" field="country" placeholder="Enter country" />
              <InputField label="Reg Address" field="regAddress" placeholder="Enter registered address" />
              <InputField label="Warehouse/Office Address" field="warehouseOfficeAddress" placeholder="Enter warehouse/office address" />
              <InputField label="Reg No" field="regNo" placeholder="Enter registration number" />
              <InputField label="Reg Date" field="regDate" type="date" />
              <InputField label="Company First Time Policy" field="companyFirstTimePolicy" placeholder="Enter first time policy" />
              <InputField label="Director/Owner Name" field="directorOwnerName" placeholder="Enter director/owner name" />
              <InputField label="Company Handle By" field="companyHandledBy" placeholder="Enter handler name" />
              <InputField label="VAT Number" field="vatNumber" placeholder="Enter VAT number" />
              <InputField label="Commodity" field="commodity" placeholder="Enter commodity" />
              <InputField label="Currency" field="currency" placeholder="Enter currency (e.g., GBP, USD, EUR)" />
              <InputField label="Turnover in £ Mn" field="turnoverGBP" type="number" placeholder="Enter turnover in millions" />
              <InputField label="Insurance Agent" field="insuranceAgent" placeholder="Enter insurance agent" />
              <InputField label="A/C Handler" field="accountHandler" placeholder="Enter account handler" />
              <InputField label="Emp Count" field="empCount" type="number" placeholder="Enter employee count" />
            </div>
          </div>

          {formData.propertyType === 'Commercial' && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Commercial Liability Details</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Commercial Policy" field="commercialPolicy" placeholder="Enter policy number" />
                <InputField label="Commercial Policy Link" field="commercialPolicyLink" placeholder="Enter policy link" />
                <InputField label="Commercial Renewal Date" field="commercialRenewalDate" type="date" />
                <InputField label="Commercial Premium Paid" field="commercialPremiumPaid" type="number" placeholder="Enter premium amount" />
                <InputField label="Employee Liability Cover" field="employeeLiabilityCover" type="number" placeholder="Enter cover amount" />
                <InputField label="EMP Liability Renewal Date" field="empLiabilityRenewalDate" type="date" />
                <InputField label="Floating Stock" field="floatingStock" placeholder="Enter floating stock" />
                <InputField label="Stock Cover" field="stockCover" type="number" placeholder="Enter stock cover" />
                <InputField label="Stock Location" field="stockLocation" placeholder="Enter stock location" />
                <InputField label="Product Liability" field="productLiability" type="number" placeholder="Enter product liability" />
                <InputField label="Amazon Vendor Liability" field="amazonVendorLiability" placeholder="Enter amazon vendor liability" />
                <InputField label="Legal Expense Cover" field="legalExpenseCover" type="number" placeholder="Enter legal expense cover" />
                <InputField label="Commercial Excess Per Claim" field="commercialExcessPerClaim" type="number" placeholder="Enter excess per claim" />
                <InputField label="Number of Claims Commercial" field="noOfClaimCommercial" type="number" placeholder="Enter number of claims" />
              </div>
            </div>
          )}

          {formData.propertyType === 'Marine' && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Ship className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Marine Insurance Details</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Marine" field="marine" placeholder="Enter marine policy" />
                <InputField label="Marine Policy Link" field="marinePolicyLink" placeholder="Enter policy link" />
                <InputField label="Marine Renewal" field="marineRenewal" type="date" />
                <InputField label="Marine Premium Paid" field="marinePremiumPaid" type="number" placeholder="Enter premium amount" />
                <InputField label="Per Transit Cover" field="perTransitCover" type="number" placeholder="Enter per transit cover" />
                <InputField label="UK-UK" field="ukUk" placeholder="Enter UK-UK" />
                <InputField label="UK-EU" field="ukEu" placeholder="Enter UK-EU" />
                <InputField label="UK-USA/Canada" field="ukUsaCanada" placeholder="Enter UK-USA/Canada" />
                <InputField label="UK-MiddleEast(Dubai)" field="ukMiddleEastDubai" placeholder="Enter UK-MiddleEast" />
                <InputField label="USA-MiddleEast(Dubai)" field="usaMiddleEastDubai" placeholder="Enter USA-MiddleEast" />
                <InputField label="EU-MiddleEast(Dubai)" field="euMiddleEastDubai" placeholder="Enter EU-MiddleEast" />
                <InputField label="EU-EU" field="euEu" placeholder="Enter EU-EU" />
                <InputField label="EU-USA" field="euUsa" placeholder="Enter EU-USA" />
                <InputField label="USA-USA" field="usaUsa" placeholder="Enter USA-USA" />
                <InputField label="UK-ROW" field="ukRow" placeholder="Enter UK-ROW" />
                <InputField label="USA-ROW" field="usaRow" placeholder="Enter USA-ROW" />
                <InputField label="EU-ROW" field="euRow" placeholder="Enter EU-ROW" />
                <InputField label="ROW-ROW" field="rowRow" placeholder="Enter ROW-ROW" />
                <InputField label="CROSS VOYAGE" field="crossVoyage" placeholder="Enter cross voyage" />
                <InputField label="AIR/SEA/RAIL" field="airSeaRail" placeholder="Enter air/sea/rail" />
                <InputField label="ROAD" field="road" placeholder="Enter road" />
                <InputField label="Any Location In Ordinary Course Of Transit" field="anyLocationInOrdinaryCourseOfTransit" placeholder="Enter location" />
                <InputField label="Cargo Excess Per Claim" field="cargoExcessPerClaim" type="number" placeholder="Enter excess per claim" />
                <InputField label="No Of Claim Cargo" field="noOfClaimCargo" type="number" placeholder="Enter number of claims" />
              </div>
            </div>
          )}

          {formData.propertyType === 'Property' && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Home className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Property Insurance Details</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Building Insurance" field="buildingInsurance" placeholder="Enter building insurance" />
                <InputField label="Property Policy Link" field="propertyPolicyLink" placeholder="Enter policy link" />
                <InputField label="Renewal Date" field="renewalDate" type="date" />
                <InputField label="Building Premium Paid" field="buildingPremiumPaid" type="number" placeholder="Enter premium amount" />
                <InputField label="Sum Assured Value of Premises" field="sumAssuredValueOfPremises" type="number" placeholder="Enter sum assured" />
                <InputField label="Declared Value" field="declareValue" type="number" placeholder="Enter declared value" />
                <InputField label="Building Location" field="buildingLocation" placeholder="Enter building location" />
                <InputField label="Building Excess Per Claim" field="buildingExcessPerClaim" type="number" placeholder="Enter excess per claim" />
                <InputField label="No Of Claim Building" field="noOfClaimBuilding" type="number" placeholder="Enter number of claims" />
              </div>
            </div>
          )}

          {formData.propertyType === 'Fleet' && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Truck className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Fleet Insurance Details</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Fleet Policy" field="fleetPolicy" placeholder="Enter fleet policy" />
                <InputField label="Fleet Policy Link" field="fleetPolicyLink" placeholder="Enter policy link" />
                <InputField label="Renewal Date" field="renewalDate2" type="date" />
                <InputField label="Fleet Premium Paid" field="fleetPremiumPaid" type="number" placeholder="Enter premium amount" />
                <InputField label="Reg No" field="regNo2" placeholder="Enter registration number" />
                <InputField label="Fleet Excess Per Claim" field="fleetExcessPerClaim" type="number" placeholder="Enter excess per claim" />
                <InputField label="No Of Claim Made Fleet" field="noOfClaimMadeFleet" type="number" placeholder="Enter number of claims" />
              </div>
            </div>
          )}
        </div>

        <div className={`px-6 py-4 border-t flex items-center justify-end space-x-3 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <button onClick={handleCancel}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${isDark ? 'text-gray-300 border-gray-600 hover:bg-gray-700' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-colors">
            Create Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPolicyModal;
