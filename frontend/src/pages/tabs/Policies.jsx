import AllPolicies from "../../components/policies/AllPolicies"
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
  policyData,
  isLoading,
  error,
  allPolicies,
  openIsModalOpenNew
}) => {
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
    getInsuranceIcon={getInsuranceIcon}
    allPolicies={allPolicies}
    />
    </>
  )
}

export default Policies