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
  onEditPolicy
}) => {
  // Log all props when they change
  useEffect(() => {
  }, [selectedCompanyPolicy, policyYear, selectedInsuranceType, policyData, isLoading, error]);
  return (
    <>
    <PoliciesHeader role={role} openIsModalOpenNew={() => openIsModalOpenNew(true)}/>

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