import { useEffect } from 'react';
import ContentGrid from "../../components/policies/ContentGrid"
import CompanyInformation from "../../components/policies/CompanyInformation"
import PoliciesHeader from "../../components/policies/PoliciesHeader"

const Policies = ({
  isDark, 
  selectedCompanyPolicy, 
  changeSelectedCompanyPolicy, 
  policyCompanies, 
  policyYear, 
  changePolicyYear, 
  chooseSelectedInsuranceType, 
  getInsuranceIcon, 
  selectedInsuranceType, 
  selectedCompanyData, 
  policyData = {},
  isLoading,
  error,
  openIsModalOpenNew
}) => {
  // Log all props when they change
  useEffect(() => {
  }, [selectedCompanyPolicy, policyYear, selectedInsuranceType, policyData, isLoading, error]);
  return (
    <>
    <PoliciesHeader openIsModalOpenNew={openIsModalOpenNew}/>

    <CompanyInformation
      isDark={isDark}
      selectedCompanyPolicy={selectedCompanyPolicy}
      changeSelectedCompanyPolicy={changeSelectedCompanyPolicy}
      policyCompanies={policyCompanies}
      policyYear={policyYear}
      changePolicyYear={changePolicyYear}
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
    </>
  )
}

export default Policies