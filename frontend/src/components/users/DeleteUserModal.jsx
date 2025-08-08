import React from 'react'

const DeleteUserModal = ({isDeleteModalOpen, isDark, handleCloseDeleteModal, handleConfirmDelete}) => {
  return (
    <>
{isDeleteModalOpen && (
  <div className="fixed flex justify-center items-center inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
    <div
      className={`w-full max-w-md rounded-xl shadow-2xl p-6 transition-colors ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Delete User</h3>
          </div>
        </div>
        <button
          onClick={handleCloseDeleteModal}
          className={`p-2 rounded-lg cursor-pointer${
            isDark
              ? "text-gray-400 hover:text-white hover:bg-gray-700"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
        >
          ×
        </button>
      </div>

      {/* Modal Body */}
      <p className="text-sm mb-6">
        Are you sure you want to delete this user? This action cannot be undone and will remove all associated data.
      </p>

      {/* Modal Footer */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={handleCloseDeleteModal}
          className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer${
            isDark
              ? "text-gray-300 border border-gray-600 hover:bg-gray-700"
              : "text-gray-700 border border-gray-300 hover:bg-gray-100"
          }`}
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmDelete}
          className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
        >
          Delete User
        </button>
      </div>
    </div>
  </div>
)}
    </>
  )
}

export default DeleteUserModal