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
  changeUsers,
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
  currentUserRole
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
        changeUsers={changeUsers}
        getRoleDarkColor={getRoleDarkColor}
        getRoleColor={getRoleColor}
        getStatusDarkColor={getStatusDarkColor}
        getStatusColor={getStatusColor}
        handleEditUser={handleEditUser}
        handleConfirmDelete={handleConfirmDelete}
        isDeleteModalOpen={isDeleteModalOpen}
        handleDeleteUser={handleDeleteUser}
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