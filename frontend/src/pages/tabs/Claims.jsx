
import ClaimsEditModal from '../../components/claims/ClaimsEditModal'
import ClaimsHeader from '../../components/claims/ClaimsHeader'
import ClaimsOverview from '../../components/claims/ClaimsOverview'
import StatisticsCards from '../../components/claims/StatisticsCards'
import SubmitNewClaimModal from '../../components/claims/SubmitNewClaimModal'

const Claims = ({
                 role,
                 isDark, 
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
                 isOpenNewClaim,
                 openIsOpenNewClaim,
                 handleSubmitNewClaim,
                 formDataNewClaim,
                 handleInputChangeNewClaim,
                 handleCloseNewClaim,
                 handleCancelNewClaim
                }) => {
  return (
    <>
    <ClaimsHeader
    openIsOpenNewClaim={openIsOpenNewClaim}
    />

    {/* Claims Overview Section */}

    <ClaimsOverview
    role={role}
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
    isDark={isDark}
    isOpenNewClaim={isOpenNewClaim}
    openIsOpenNewClaim={openIsOpenNewClaim}
    handleSubmitNewClaim={handleSubmitNewClaim}
    formDataNewClaim={formDataNewClaim}
    handleInputChangeNewClaim={handleInputChangeNewClaim}
    handleCloseNewClaim={handleCloseNewClaim}
    handleCancelNewClaim={handleCancelNewClaim}
    />
    </>
  )
}

export default Claims