import { User, Mail, MapPin, Shield, Clock, Edit, Trash2, Users  } from "lucide-react"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const UserTable = ({users ,isDark, getRoleDarkColor, getRoleColor, getStatusDarkColor, getStatusColor, handleEditUser, handleDeleteUser}) => {
  // const [users, setUsers] = useState([]);
   const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {

//   const fetchUsers = async () => {
    
//     try {
//       const response = await axios.get('http://localhost:7001/api/users');
//       const formattedUsers = response.data.map((user, index) => ({
//         id: user.id,
//         avatar: getInitials(user.name || user.firstName || ""), 
//         // name: `${user.firstName} ${user.lastName}`,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         location: user.location || 'N/A',
//         role: user.userRole,
//         status: user.accountStatus,
//         phoneNumber: user.phoneNumber,
//         department: user.department,
//         policies: user.policies || 0,
//         claims: user.claims || 0,
//       }));
//       changeUsers(formattedUsers);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   fetchUsers();
// }, []);

console.log("****", users);




const getInitials = (name) => {
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[1][0]).toUpperCase();
};
  
  return (
    <>
    <div className={`rounded-xl border transition-colors ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {/* Section Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-purple-900' : 'bg-purple-100'
              }`}>
                <Users className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  All Users
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Comprehensive user management and administration
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>User</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Role</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Department</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Policies</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Claims</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={`border-b hover:bg-opacity-50 transition-colors ${
                    isDark 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                          isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {user.avatar}
                        </div>
                        <div>
                          <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                             {[user.firstName, user.lastName].filter(Boolean).join(' ')}
                          </div>
                          <div className={`text-sm flex items-center space-x-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                          <div className={`text-sm flex items-center space-x-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <MapPin className="w-3 h-3" />
                            <span>{user.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        isDark ? getRoleDarkColor(user.role) : getRoleColor(user.role)
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        isDark ? getStatusDarkColor(user.status) : getStatusColor(user.status)
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded flex items-center justify-center ${
                          isDark ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <Shield className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                        </div>
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.department}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user.policies}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user.claims}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className={`p-2 rounded-lg hover:bg-opacity-10 transition-colors cursor-pointer ${
                            isDark ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                        onClick={() => handleDeleteUser(user)} 
                        className={`p-2 rounded-lg hover:bg-opacity-10 transition-colors cursor-pointer ${
                          isDark ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'
                        }`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </>
  )
}

export default UserTable