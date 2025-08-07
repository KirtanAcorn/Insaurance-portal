import UserManagementHeader from "../../components/users/UserManagementHeader"
import UserStatsGrid from "../../components/users/UserStatsGrid"
import UserTable from "../../components/users/UserTable"
import AddUserModal from "../../components/users/AddUserModal"
import EditUserModal from "../../components/users/EditUserModal"
import DeleteUserModal from "../../components/users/DeleteUserModal"


const Userr = ({
  openCreateModal,
  stats,
  isDark,
  users,
  getRoleDarkColor,
  getRoleColor,
  getStatusDarkColor,
  getStatusColor,
  handleEditUser,
  openDeleteModal,
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
  handleConfirmDelete


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
        isDark={isDark}
        users={users}
        getRoleDarkColor={getRoleDarkColor}
        getRoleColor={getRoleColor}
        getStatusDarkColor={getStatusDarkColor}
        getStatusColor={getStatusColor}
        handleEditUser={handleEditUser}
        openDeleteModal={openDeleteModal}
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
        />


      
      {/*Delete Modal*/}
      <DeleteUserModal
      isDeleteModalOpen={isDeleteModalOpen}
      isDark={isDark}
      handleCloseDeleteModal={handleCloseDeleteModal}
      handleConfirmDelete={handleConfirmDelete}
      />
    </>
  )
}

export default Userr