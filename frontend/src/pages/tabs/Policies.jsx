import CompanyInformation from "../../components/policies/CompanyInformation"
import PoliciesHeader from "../../components/policies/PoliciesHeader"

const Policies = ( {isDark, setSelectedCompanyPolicy}) => {
  return (
    <>
    <PoliciesHeader/>
    <CompanyInformation
    isDark={isDark}
    setSelectedCompanyPolicy={setSelectedCompanyPolicy}
    policyCompanies={policyCompanies}/>  
    </>
  )
}

export default Policies