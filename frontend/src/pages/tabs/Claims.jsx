
import ClaimsEditModal from '../../components/claims/ClaimsEditModal'
import ClaimsHeader from '../../components/claims/ClaimsHeader'
import ClaimsOverview from '../../components/claims/ClaimsOverview'
import StatisticsCards from '../../components/claims/StatisticsCards'
import SubmitNewClaimModal from '../../components/claims/SubmitNewClaimModal'

const Claims = ({isDark, 
                 claims, 
                 getStatusColorr, 
                 getPolicyTypeColorr, 
                 getClaimTypeColorr, 
                 getStatusDarkColorr, 
                 statsClaim, 
                 editFormDataClaim, 
                 handleCloseModalClaim, 
                 activeTabClaim, 
                 openActiveTabClaim, 
                 handleFormChangeClaim, 
                 timelineEvents, 
                 handleUpdateClaim, 
                 openEditModalOpenClaim,
                 isEditModalOpenClaim,
                 isModalOpenNew,
                 openIsModalOpenNew,
                 handleCloseModalNew,
                 tabsNew,
                 openActiveTabNew,
                 activeTabNew,
                 formDataNew,
                 handleInputChange,
                 getSelectedCompany,
                 handleSubmitNew
                }) => {
  return (
    <>
    <ClaimsHeader
    openIsModalOpenNew={openIsModalOpenNew}
    />

    {/* Claims Overview Section */}

    <ClaimsOverview
    isDark={isDark}
    claims={claims}
    getStatusColorr={getStatusColorr}
    getPolicyTypeColorr={getPolicyTypeColorr}
    getClaimTypeColorr={getClaimTypeColorr}
    getStatusDarkColorr={getStatusDarkColorr}
    openEditModalOpenClaim={openEditModalOpenClaim}
    openIsModalOpenNew={openIsModalOpenNew}   
    />

    <StatisticsCards
    isDark={isDark}
    statsClaim={statsClaim}
    />

    <ClaimsEditModal
    isDark={isDark}
    isEditModalOpenClaim={isEditModalOpenClaim}
    editFormDataClaim={editFormDataClaim}
    handleCloseModalClaim={handleCloseModalClaim}
    activeTabClaim={activeTabClaim}
    openActiveTabClaim={openActiveTabClaim}
    handleFormChangeClaim={handleFormChangeClaim}
    timelineEvents={timelineEvents}
    handleUpdateClaim={handleUpdateClaim}
    openEditModalOpenClaim={openEditModalOpenClaim}
    isModalOpenNew={isModalOpenNew}
    openIsModalOpenNew={openIsModalOpenNew}
    />

    <SubmitNewClaimModal
    isModalOpenNew={isModalOpenNew}
    openIsModalOpenNew={openIsModalOpenNew}
    handleCloseModalNew={handleCloseModalNew}
    tabsNew={tabsNew}
    openActiveTabNew={openActiveTabNew}
    activeTabNew={activeTabNew}
    formDataNew={formDataNew}
    handleInputChange={handleInputChange}
    getSelectedCompany={getSelectedCompany}
    handleSubmitNew={handleSubmitNew}
    />
    </>
  )
}

export default Claims