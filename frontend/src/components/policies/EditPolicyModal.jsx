import { useState, useEffect, useCallback } from 'react';
import { X, Building, FileText, DollarSign, Ship, Truck, Home } from 'lucide-react';

// Move InputField outside to prevent re-creation on every render
const InputField = ({ label, field, type = 'text', placeholder, disabled = false, value, onChange, isDark }) => (
  <div>
    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={(e) => onChange(field, e.target.value)}
      disabled={disabled}
      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        disabled ? 'bg-gray-200 cursor-not-allowed' : ''} ${
        isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
      placeholder={placeholder} 
    />
  </div>
);

const EditPolicyModal = ({ isDark, isOpen, onClose, onSubmit, policyData }) => {
  const [formData, setFormData] = useState({
    id: '',
    companyName: '', year: '', propertyType: '',
    country: '', regAddress: '', warehouseOfficeAddress: '', regNo: '', regDate: '',
    companyFirstTimePolicy: '', directorOwnerName: '', companyHandledBy: '', vatNumber: '',
    commodity: '', currency: '', turnoverGBP: '', insuranceAgent: '', accountHandler: '', empCount: '',
    commercialPolicy: '', commercialPolicyLink: '', commercialRenewalDate: '', commercialPremiumPaid: '',
    employeeLiabilityCover: '', empLiabilityRenewalDate: '', floatingStock: '', stockCover: '',
    stockLocation: '', productLiability: '', amazonVendorLiability: '', legalExpenseCover: '',
    commercialExcessPerClaim: '', noOfClaimCommercial: '',
    marine: '', marinePolicyLink: '', marineRenewal: '', marinePremiumPaid: '', perTransitCover: '',
    ukUk: '', ukEu: '', ukUsaCanada: '', ukMiddleEastDubai: '', usaMiddleEastDubai: '',
    euMiddleEastDubai: '', euEu: '', euUsa: '', usaUsa: '', ukRow: '', usaRow: '', euRow: '',
    rowRow: '', crossVoyage: '', airSeaRail: '', road: '', anyLocationInOrdinaryCourseOfTransit: '',
    cargoExcessPerClaim: '', noOfClaimCargo: '',
    buildingInsurance: '', propertyPolicyLink: '', renewalDate: '', buildingPremiumPaid: '',
    sumAssuredValueOfPremises: '', declareValue: '', buildingLocation: '', buildingExcessPerClaim: '',
    noOfClaimBuilding: '',
    fleetPolicy: '', fleetPolicyLink: '', renewalDate2: '', fleetPremiumPaid: '', regNo2: '',
    fleetExcessPerClaim: '', noOfClaimMadeFleet: ''
  });

  useEffect(() => {
    if (policyData && isOpen) {
      // Map the raw database data to form fields
      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
      };

      setFormData({
        id: policyData.Id || policyData.id || '',
        companyName: policyData['Company Name'] || '',
        year: policyData['Year'] || policyData['Year '] || '',
        propertyType: determinePropertyType(policyData),
        country: policyData['Country'] || '',
        regAddress: policyData['Reg Address'] || '',
        warehouseOfficeAddress: policyData['Warehouse/Office Address/es'] || '',
        regNo: policyData['Reg No'] || '',
        regDate: formatDate(policyData['Reg Date']),
        companyFirstTimePolicy: policyData['Company first Time Policy'] || '',
        directorOwnerName: policyData['Director/Owner Name'] || '',
        companyHandledBy: policyData['Company Handle By'] || '',
        vatNumber: policyData['VAT Number'] || '',
        commodity: policyData['Comodity'] || '',
        currency: policyData['Currency'] || '',
        turnoverGBP: policyData['Turnover in £ Mn'] || '',
        insuranceAgent: policyData['Insurance Agent'] || '',
        accountHandler: policyData['A/C HANDLER'] || '',
        empCount: policyData['Emp Count'] || '',
        commercialPolicy: policyData['Commercial Policy'] || '',
        commercialPolicyLink: policyData['Commercial Policy Link'] || '',
        commercialRenewalDate: formatDate(policyData['Commercial Renewal Date']),
        commercialPremiumPaid: policyData['Commercial Premium Paid'] || '',
        employeeLiabilityCover: policyData['Employee Liability Cover'] || '',
        empLiabilityRenewalDate: formatDate(policyData['Emp_Liabality Renewal Date']),
        floatingStock: policyData['Floting stock'] || '',
        stockCover: policyData['Stock Cover'] || '',
        stockLocation: policyData['Stock Location'] || '',
        productLiability: policyData['Product Liability'] || '',
        amazonVendorLiability: policyData['Amazon Vendor Liability'] || '',
        legalExpenseCover: policyData['Legal Expense Cover'] || '',
        commercialExcessPerClaim: policyData['Commercial Excess Per claim'] || '',
        noOfClaimCommercial: policyData['No Of claim Commercial'] || '',
        marine: policyData['Marine'] || '',
        marinePolicyLink: policyData['Marine Policy Link'] || '',
        marineRenewal: formatDate(policyData['Marine Renewal']),
        marinePremiumPaid: policyData['Marine Premium Paid'] || '',
        perTransitCover: policyData['Per Transit Cover'] || '',
        ukUk: policyData['UK-UK'] || '',
        ukEu: policyData['UK-EU'] || '',
        ukUsaCanada: policyData['UK-USA/Canada'] || '',
        ukMiddleEastDubai: policyData['UK-MiddelEast(Dubai)'] || '',
        usaMiddleEastDubai: policyData['USA-Middeleast(Dubai)'] || '',
        euMiddleEastDubai: policyData['EU-Middeleast(Dubai)'] || '',
        euEu: policyData['EU-EU'] || '',
        euUsa: policyData['EU-USA'] || '',
        usaUsa: policyData['USA-USA'] || '',
        ukRow: policyData['UK-ROW'] || '',
        usaRow: policyData['USA-ROW'] || '',
        euRow: policyData['EU-ROW'] || '',
        rowRow: policyData['ROW-ROW'] || '',
        crossVoyage: policyData['CROSS VOYAGE'] || '',
        airSeaRail: policyData['AIR/SEA/RAIL'] || '',
        road: policyData['ROAD'] || '',
        anyLocationInOrdinaryCourseOfTransit: policyData['ANYONE LOACTION IN ORDINARY COURSE OF TRANSIT'] || '',
        cargoExcessPerClaim: policyData['Cargo Excess Excess Per claim'] || '',
        noOfClaimCargo: policyData['No Of claim Cargo'] || '',
        buildingInsurance: policyData['Building Insurance'] || '',
        propertyPolicyLink: policyData['Property Policy Link'] || '',
        renewalDate: formatDate(policyData['Renewal Date']),
        buildingPremiumPaid: policyData['Building Premium Paid'] || '',
        sumAssuredValueOfPremises: policyData['Sume Assure(Value of )Premises'] || '',
        declareValue: policyData['Declare Value'] || '',
        buildingLocation: policyData['Building Location'] || '',
        buildingExcessPerClaim: policyData['Building Excess Per claim'] || '',
        noOfClaimBuilding: policyData['No Of claim Building'] || '',
        fleetPolicy: policyData['Fleet Policy'] || '',
        fleetPolicyLink: policyData['Fleet Policy Link'] || '',
        renewalDate2: formatDate(policyData['Renewal Date2']),
        fleetPremiumPaid: policyData['Fleet Premium Paid'] || '',
        regNo2: policyData['Reg No2'] || '',
        fleetExcessPerClaim: policyData['Fleet Excess Per claim '] || '',
        noOfClaimMadeFleet: policyData['No Of claim made fleet'] || ''
      });
    }
  }, [policyData, isOpen]);

  const determinePropertyType = (data) => {
    // If selectedPolicyType is provided, use it directly
    if (data.selectedPolicyType) {
      // Map the policy type names to property type values
      const typeMap = {
        'Commercial Liability': 'Commercial',
        'Marine': 'Marine',
        'Property': 'Property',
        'Fleet': 'Fleet'
      };
      return typeMap[data.selectedPolicyType] || data.selectedPolicyType;
    }
    
    // Otherwise, determine from the data
    if (data['Commercial Policy'] || data['Commercial Premium Paid']) return 'Commercial';
    if (data['Marine'] || data['Marine Premium Paid']) return 'Marine';
    if (data['Building Insurance'] || data['Building Premium Paid']) return 'Property';
    if (data['Fleet Policy'] || data['Fleet Premium Paid']) return 'Fleet';
    return '';
  };

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = () => onSubmit(formData);
  const handleCancel = () => onClose();

  // ALL HOOKS MUST BE BEFORE ANY EARLY RETURN
  // Memoized wrapper to pass common props automatically

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit Policy</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Update insurance policy information</p>
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
              <InputField label="Company Name" field="companyName" disabled={true} value={formData.companyName} onChange={handleChange} isDark={isDark} />
              <InputField label="Year" field="year" disabled={true} value={formData.year} onChange={handleChange} isDark={isDark} />
              <InputField label="Property Type" field="propertyType" disabled={true} value={formData.propertyType} onChange={handleChange} isDark={isDark} />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Building className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Company Information</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Country" field="country" placeholder="Enter country" value={formData.country} onChange={handleChange} isDark={isDark} />
              <InputField label="Reg Address" field="regAddress" placeholder="Enter registered address" value={formData.regAddress} onChange={handleChange} isDark={isDark} />
              <InputField label="Warehouse/Office Address" field="warehouseOfficeAddress" placeholder="Enter warehouse/office address" value={formData.warehouseOfficeAddress} onChange={handleChange} isDark={isDark} />
              <InputField label="Reg No" field="regNo" placeholder="Enter registration number" value={formData.regNo} onChange={handleChange} isDark={isDark} />
              <InputField label="Reg Date" field="regDate" type="text" value={formData.regDate} onChange={handleChange} isDark={isDark} />
              <InputField label="Company First Time Policy" field="companyFirstTimePolicy" placeholder="Enter first time policy" value={formData.companyFirstTimePolicy} onChange={handleChange} isDark={isDark} />
              <InputField label="Director/Owner Name" field="directorOwnerName" placeholder="Enter director/owner name" value={formData.directorOwnerName} onChange={handleChange} isDark={isDark} />
              <InputField label="Company Handle By" field="companyHandledBy" placeholder="Enter handler name" value={formData.companyHandledBy} onChange={handleChange} isDark={isDark} />
              <InputField label="VAT Number" field="vatNumber" placeholder="Enter VAT number" value={formData.vatNumber} onChange={handleChange} isDark={isDark} />
              <InputField label="Commodity" field="commodity" placeholder="Enter commodity" value={formData.commodity} onChange={handleChange} isDark={isDark} />
              <InputField label="Currency" field="currency" placeholder="Enter currency" value={formData.currency} onChange={handleChange} isDark={isDark} />
              <InputField label="Turnover in LCY" field="turnoverGBP" type="text" placeholder="Enter turnover" value={formData.turnoverGBP} onChange={handleChange} isDark={isDark} />
              <InputField label="Insurance Agent" field="insuranceAgent" placeholder="Enter insurance agent" value={formData.insuranceAgent} onChange={handleChange} isDark={isDark} />
              <InputField label="A/C Handler" field="accountHandler" placeholder="Enter account handler" value={formData.accountHandler} onChange={handleChange} isDark={isDark} />
              <InputField label="Emp Count" field="empCount" type="text" placeholder="Enter employee count" value={formData.empCount} onChange={handleChange} isDark={isDark} />
            </div>
          </div>

          {formData.propertyType === 'Commercial' && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Commercial Liability Details</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Commercial Policy" field="commercialPolicy" placeholder="Enter policy number" value={formData.commercialPolicy} onChange={handleChange} isDark={isDark} />
                <InputField label="Commercial Policy Link" field="commercialPolicyLink" placeholder="Enter policy link" value={formData.commercialPolicyLink} onChange={handleChange} isDark={isDark} />
                <InputField label="Commercial Renewal Date" field="commercialRenewalDate" type="text" value={formData.commercialRenewalDate} onChange={handleChange} isDark={isDark} />
                <InputField label="Commercial Premium Paid" field="commercialPremiumPaid" type="text" placeholder="Enter premium amount" value={formData.commercialPremiumPaid} onChange={handleChange} isDark={isDark} />
                <InputField label="Employee Liability Cover" field="employeeLiabilityCover" type="text" placeholder="Enter cover amount" value={formData.employeeLiabilityCover} onChange={handleChange} isDark={isDark} />
                <InputField label="EMP Liability Renewal Date" field="empLiabilityRenewalDate" type="text" value={formData.empLiabilityRenewalDate} onChange={handleChange} isDark={isDark} />
                <InputField label="Floating Stock" field="floatingStock" placeholder="Enter floating stock" value={formData.floatingStock} onChange={handleChange} isDark={isDark} />
                <InputField label="Stock Cover" field="stockCover" type="text" placeholder="Enter stock cover" value={formData.stockCover} onChange={handleChange} isDark={isDark} />
                <InputField label="Stock Location" field="stockLocation" placeholder="Enter stock location" value={formData.stockLocation} onChange={handleChange} isDark={isDark} />
                <InputField label="Product Liability" field="productLiability" type="text" placeholder="Enter product liability" value={formData.productLiability} onChange={handleChange} isDark={isDark} />
                <InputField label="Amazon Vendor Liability" field="amazonVendorLiability" placeholder="Enter amazon vendor liability" value={formData.amazonVendorLiability} onChange={handleChange} isDark={isDark} />
                <InputField label="Legal Expense Cover" field="legalExpenseCover" type="text" placeholder="Enter legal expense cover" value={formData.legalExpenseCover} onChange={handleChange} isDark={isDark} />
                <InputField label="Commercial Excess Per Claim" field="commercialExcessPerClaim" type="text" placeholder="Enter excess per claim" value={formData.commercialExcessPerClaim} onChange={handleChange} isDark={isDark} />
                <InputField label="Number of Claims Commercial" field="noOfClaimCommercial" type="text" placeholder="Enter number of claims" value={formData.noOfClaimCommercial} onChange={handleChange} isDark={isDark} />
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
                <InputField label="Marine" field="marine" placeholder="Enter marine policy" value={formData.marine} onChange={handleChange} isDark={isDark} />
                <InputField label="Marine Policy Link" field="marinePolicyLink" placeholder="Enter policy link" value={formData.marinePolicyLink} onChange={handleChange} isDark={isDark} />
                <InputField label="Marine Renewal" field="marineRenewal" type="text" value={formData.marineRenewal} onChange={handleChange} isDark={isDark} />
                <InputField label="Marine Premium Paid" field="marinePremiumPaid" type="text" placeholder="Enter premium amount" value={formData.marinePremiumPaid} onChange={handleChange} isDark={isDark} />
                <InputField label="Per Transit Cover" field="perTransitCover" type="text" placeholder="Enter per transit cover" value={formData.perTransitCover} onChange={handleChange} isDark={isDark} />
                <InputField label="UK-UK" field="ukUk" placeholder="Enter UK-UK" value={formData.ukUk} onChange={handleChange} isDark={isDark} />
                <InputField label="UK-EU" field="ukEu" placeholder="Enter UK-EU" value={formData.ukEu} onChange={handleChange} isDark={isDark} />
                <InputField label="UK-USA/Canada" field="ukUsaCanada" placeholder="Enter UK-USA/Canada" value={formData.ukUsaCanada} onChange={handleChange} isDark={isDark} />
                <InputField label="UK-MiddleEast(Dubai)" field="ukMiddleEastDubai" placeholder="Enter UK-MiddleEast" value={formData.ukMiddleEastDubai} onChange={handleChange} isDark={isDark} />
                <InputField label="USA-MiddleEast(Dubai)" field="usaMiddleEastDubai" placeholder="Enter USA-MiddleEast" value={formData.usaMiddleEastDubai} onChange={handleChange} isDark={isDark} />
                <InputField label="EU-MiddleEast(Dubai)" field="euMiddleEastDubai" placeholder="Enter EU-MiddleEast" value={formData.euMiddleEastDubai} onChange={handleChange} isDark={isDark} />
                <InputField label="EU-EU" field="euEu" placeholder="Enter EU-EU" value={formData.euEu} onChange={handleChange} isDark={isDark} />
                <InputField label="EU-USA" field="euUsa" placeholder="Enter EU-USA" value={formData.euUsa} onChange={handleChange} isDark={isDark} />
                <InputField label="USA-USA" field="usaUsa" placeholder="Enter USA-USA" value={formData.usaUsa} onChange={handleChange} isDark={isDark} />
                <InputField label="UK-ROW" field="ukRow" placeholder="Enter UK-ROW" value={formData.ukRow} onChange={handleChange} isDark={isDark} />
                <InputField label="USA-ROW" field="usaRow" placeholder="Enter USA-ROW" value={formData.usaRow} onChange={handleChange} isDark={isDark} />
                <InputField label="EU-ROW" field="euRow" placeholder="Enter EU-ROW" value={formData.euRow} onChange={handleChange} isDark={isDark} />
                <InputField label="ROW-ROW" field="rowRow" placeholder="Enter ROW-ROW" value={formData.rowRow} onChange={handleChange} isDark={isDark} />
                <InputField label="CROSS VOYAGE" field="crossVoyage" placeholder="Enter cross voyage" value={formData.crossVoyage} onChange={handleChange} isDark={isDark} />
                <InputField label="AIR/SEA/RAIL" field="airSeaRail" placeholder="Enter air/sea/rail" value={formData.airSeaRail} onChange={handleChange} isDark={isDark} />
                <InputField label="ROAD" field="road" placeholder="Enter road" value={formData.road} onChange={handleChange} isDark={isDark} />
                <InputField label="Any Location In Ordinary Course Of Transit" field="anyLocationInOrdinaryCourseOfTransit" placeholder="Enter location" value={formData.anyLocationInOrdinaryCourseOfTransit} onChange={handleChange} isDark={isDark} />
                <InputField label="Cargo Excess Per Claim" field="cargoExcessPerClaim" type="text" placeholder="Enter excess per claim" value={formData.cargoExcessPerClaim} onChange={handleChange} isDark={isDark} />
                <InputField label="No Of Claim Cargo" field="noOfClaimCargo" type="text" placeholder="Enter number of claims" value={formData.noOfClaimCargo} onChange={handleChange} isDark={isDark} />
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
                <InputField label="Building Insurance" field="buildingInsurance" placeholder="Enter building insurance" value={formData.buildingInsurance} onChange={handleChange} isDark={isDark} />
                <InputField label="Property Policy Link" field="propertyPolicyLink" placeholder="Enter policy link" value={formData.propertyPolicyLink} onChange={handleChange} isDark={isDark} />
                <InputField label="Renewal Date" field="renewalDate" type="text" value={formData.renewalDate} onChange={handleChange} isDark={isDark} />
                <InputField label="Building Premium Paid" field="buildingPremiumPaid" type="text" placeholder="Enter premium amount" value={formData.buildingPremiumPaid} onChange={handleChange} isDark={isDark} />
                <InputField label="Sum Assured Value of Premises" field="sumAssuredValueOfPremises" type="text" placeholder="Enter sum assured" value={formData.sumAssuredValueOfPremises} onChange={handleChange} isDark={isDark} />
                <InputField label="Declared Value" field="declareValue" type="text" placeholder="Enter declared value" value={formData.declareValue} onChange={handleChange} isDark={isDark} />
                <InputField label="Building Location" field="buildingLocation" placeholder="Enter building location" value={formData.buildingLocation} onChange={handleChange} isDark={isDark} />
                <InputField label="Building Excess Per Claim" field="buildingExcessPerClaim" type="text" placeholder="Enter excess per claim" value={formData.buildingExcessPerClaim} onChange={handleChange} isDark={isDark} />
                <InputField label="No Of Claim Building" field="noOfClaimBuilding" type="text" placeholder="Enter number of claims" value={formData.noOfClaimBuilding} onChange={handleChange} isDark={isDark} />
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
                <InputField label="Fleet Policy" field="fleetPolicy" placeholder="Enter fleet policy" value={formData.fleetPolicy} onChange={handleChange} isDark={isDark} />
                <InputField label="Fleet Policy Link" field="fleetPolicyLink" placeholder="Enter policy link" value={formData.fleetPolicyLink} onChange={handleChange} isDark={isDark} />
                <InputField label="Renewal Date" field="renewalDate2" type="text" value={formData.renewalDate2} onChange={handleChange} isDark={isDark} />
                <InputField label="Fleet Premium Paid" field="fleetPremiumPaid" type="text" placeholder="Enter premium amount" value={formData.fleetPremiumPaid} onChange={handleChange} isDark={isDark} />
                <InputField label="Reg No" field="regNo2" placeholder="Enter registration number" value={formData.regNo2} onChange={handleChange} isDark={isDark} />
                <InputField label="Fleet Excess Per Claim" field="fleetExcessPerClaim" type="text" placeholder="Enter excess per claim" value={formData.fleetExcessPerClaim} onChange={handleChange} isDark={isDark} />
                <InputField label="No Of Claim Made Fleet" field="noOfClaimMadeFleet" type="text" placeholder="Enter number of claims" value={formData.noOfClaimMadeFleet} onChange={handleChange} isDark={isDark} />
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
            Update Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPolicyModal;
