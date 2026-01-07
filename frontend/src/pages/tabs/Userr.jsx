import UserManagementHeader from "../../components/users/UserManagementHeader"
import UserStatsGrid from "../../components/users/UserStatsGrid"
import UserTable from "../../components/users/UserTable"
import AddUserModal from "../../components/users/AddUserModal"
import EditUserModal from "../../components/users/EditUserModal"
import DeleteUserModal from "../../components/users/DeleteUserModal"
import { useRef } from "react"


const Userr = ({
  openCreateModal,
  stats,
  isDark,
  getRoleDarkColor,
  getRoleColor,
  getStatusDarkColor,
  getStatusColor,
  handleEditUser,
  isCreateModalOpen,
  handleCloseModalCreateUser,
  formData,
  companies,
  handleFormChangeCreateUser,
  handleCompanyAccessChange,
  handlePermissionChange,
  handleCreateUser,
  isEditModalOpen,
  selectedUser,
  handleCloseModal,
  editFormData,
  handleFormChange,
  handleUpdateUser,
  isDeleteModalOpen,
  handleCloseDeleteModal,
  handleConfirmDelete,
  handleDeleteUser,
  currentUserRole,
  refreshStats,
  userTableRef,
  handleEditCompanyAccessChange,
  handleEditPermissionChange
}) => {


  
  return (
    <>
    {/* User Management Header */}
        <UserManagementHeader
        openCreateModal={openCreateModal}
        
        />

        {/* Stats Grid */}
        <UserStatsGrid
        stats={stats}
        isDark={isDark}
        />

        {/* All Users Section */}
        <UserTable
        ref={userTableRef}
        isDark={isDark}
        getRoleDarkColor={getRoleDarkColor}
        getRoleColor={getRoleColor}
        getStatusDarkColor={getStatusDarkColor}
        getStatusColor={getStatusColor}
        handleEditUser={handleEditUser}
        refreshStats={refreshStats}
        />

        {/* Create User Modal */}

        <AddUserModal
        isCreateModalOpen={isCreateModalOpen}
        isDark={isDark}
        handleCloseModalCreateUser={handleCloseModalCreateUser}
        formData={formData}
        handleFormChangeCreateUser={handleFormChangeCreateUser}
        companies={companies}
        handleCompanyAccessChange={handleCompanyAccessChange}
        handlePermissionChange={handlePermissionChange}
        handleCreateUser={handleCreateUser}
        />


        {/* Edit User Modal */}
        <EditUserModal
        isEditModalOpen={isEditModalOpen}
        isDark={isDark}
        selectedUser={selectedUser}
        handleCloseModal={handleCloseModal}
        editFormData={editFormData}
        handleFormChange={handleFormChange}
        handleUpdateUser={handleUpdateUser}
        currentUserRole={currentUserRole}
        companies={companies}
        handleEditCompanyAccessChange={handleEditCompanyAccessChange}
        handleEditPermissionChange={handleEditPermissionChange}
        />


      
      {/*Delete Modal*/}
      <DeleteUserModal
      isDeleteModalOpen={isDeleteModalOpen}
      isDark={isDark}
      selectedUser={selectedUser}
      handleCloseDeleteModal={handleCloseDeleteModal}
      handleConfirmDelete={handleConfirmDelete}
      handleDeleteUser={handleDeleteUser}
      />
    </>
  )
}

export default Userr