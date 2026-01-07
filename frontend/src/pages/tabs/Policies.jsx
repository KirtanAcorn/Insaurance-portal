import { useEffect } from 'react';
import AllPolicies from "../../components/policies/AllPolicies"
import ContentGrid from "../../components/policies/ContentGrid"
import CompanyInformation from "../../components/policies/CompanyInformation"
import PoliciesHeader from "../../components/policies/PoliciesHeader"

const Policies = ({
  isDark, 
  role,
  selectedCompanyPolicy, 
  changeSelectedCompanyPolicy, 
  policyCompanies, 
  policyYear, 
  changePolicyYear,
  availableYears = ['2024-2025', '2025-2026', '2026-2027', '2027-2028'],
  chooseSelectedInsuranceType, 
  getInsuranceIcon, 
  selectedInsuranceType, 
  selectedCompanyData, 
  policyData = {},
  isLoading,
  error,
  openIsModalOpenNew,
  allPolicies,
  companyPolicies = [],
  isPoliciesLoading = false,
  policiesError = null,
  rawPolicyRow = null,
  onEditPolicy,
  userId // Add userId prop for admin verification
}) => {
  // Log all props when they change
  useEffect(() => {
  }, [selectedCompanyPolicy, policyYear, selectedInsuranceType, policyData, isLoading, error]);

  // Handle export data
  const handleExportData = async () => {
    if (role !== 'Admin') {
      alert('Access denied. Admin role required.');
      return;
    }

    if (!userId) {
      alert('User ID is required for export.');
      return;
    }

    try {
      const response = await fetch(`/api/policies/export?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Export failed');
      }

      // Create blob and download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or create default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `Policy_Management_Data.xlsx`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('All policy data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert(`Export failed: ${error.message}`);
    }
  };

  return (
    <>
    <PoliciesHeader 
      role={role} 
      openIsModalOpenNew={() => openIsModalOpenNew(true)}
      onExportData={handleExportData}
    />

    <CompanyInformation
      isDark={isDark}
      selectedCompanyPolicy={selectedCompanyPolicy}
      changeSelectedCompanyPolicy={changeSelectedCompanyPolicy}
      policyCompanies={policyCompanies}
      policyYear={policyYear}
      changePolicyYear={changePolicyYear}
      availableYears={availableYears}
      chooseSelectedInsuranceType={chooseSelectedInsuranceType}
      getInsuranceIcon={getInsuranceIcon}
      selectedInsuranceType={selectedInsuranceType}
      policyData={policyData}
    />

    <ContentGrid
      isDark={isDark}
      getInsuranceIcon={getInsuranceIcon}
      selectedInsuranceType={selectedInsuranceType}
      selectedCompanyData={selectedCompanyData}
      policyData={policyData}
      isLoading={isLoading}
      error={error}
    />
    
    <AllPolicies
      isDark={isDark}
      role={role}
      getInsuranceIcon={getInsuranceIcon}
      allPolicies={allPolicies}
      isLoading={isPoliciesLoading}
      error={policiesError ? { message: policiesError } : null}
      rawPolicyRow={rawPolicyRow}
      onEditPolicy={onEditPolicy}
    />

    </>
  )
}

export default Policies