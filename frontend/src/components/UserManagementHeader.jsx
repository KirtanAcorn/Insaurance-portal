import { UserPlus, Users } from "lucide-react"

const UserManagementHeader = ({openCreateModal}) => {
  return (
    <>
    <div className={`mb-6 p-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-black">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-purple-100">Advanced user administration and access control</p>
              </div>
            </div>
            <button 
            onClick={() => openCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors text-black">
              <UserPlus className="w-4 h-4" />
              <span className="font-medium">Add User</span>
            </button>
          </div>
        </div>
    </>
  )
}

export default UserManagementHeader