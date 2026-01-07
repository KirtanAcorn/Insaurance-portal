import { Mail, MapPin, Shield, Edit, Users, ChevronLeft, ChevronRight, Search  } from "lucide-react"
import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';

const UserTable = forwardRef(({isDark, getRoleDarkColor, getRoleColor, getStatusDarkColor, getStatusColor, handleEditUser, refreshStats}, ref) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [limit] = useState(15); // Users per page
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchUsers = async (page = 1, search = '') => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (search.trim()) {
        params.append('search', search.trim());
      }
      
      const url = `/api/users?${params.toString()}`;
      const response = await axios.get(url);
      
      if (response.data && response.data.users) {
        const formattedUsers = response.data.users.map((user, index) => ({
          id: user.id,
          avatar: getInitials(user.name || user.firstName || ""), 
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          location: user.location || 'N/A',
          userRole: user.userRole,
          status: user.accountStatus,
          phoneNumber: user.phoneNumber,
          department: user.department,
          policies: user.policies || 0,
          claims: user.claims || 0,
        }));
        
        setUsers(formattedUsers);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
        setTotalUsers(response.data.pagination.totalUsers);
        
        // Refresh stats when users are fetched
        if (refreshStats) {
          refreshStats();
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  // Handle search with debouncing
  const handleSearch = (value) => {
    setSearchTerm(value);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debounced search
    const newTimeout = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      fetchUsers(1, value);
    }, 500); // 500ms delay
    
    setSearchTimeout(newTimeout);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchUsers(1, '');
  };

  // Expose refresh method to parent component
  useImperativeHandle(ref, () => ({
    refresh: () => fetchUsers(currentPage, searchTerm),
    refreshToFirstPage: () => {
      setCurrentPage(1);
      fetchUsers(1, searchTerm);
    }
  }));

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchUsers(newPage, searchTerm);
    }
  };

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
            <div className="flex items-center justify-between">
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
              
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className={`pl-10 pr-4 py-2 w-80 rounded-lg border transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500'
                  } focus:ring-1 focus:outline-none`}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                      isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Loading users...
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>User</th>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Role</th>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Department</th>
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
                          isDark ? getRoleDarkColor(user.userRole) : getRoleColor(user.userRole)
                        }`}>
                          {user.userRole}
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
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditUser(user)}
                            className={`p-2 rounded-lg hover:bg-opacity-10 transition-colors cursor-pointer ${
                              isDark ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className={`px-6 py-4 border-t flex items-center justify-between ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchTerm ? (
                  <>Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} filtered results</>
                ) : (
                  <>Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users</>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border transition-colors ${
                    currentPage === 1
                      ? isDark 
                        ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                      : isDark
                        ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
                          currentPage === pageNum
                            ? isDark
                              ? 'bg-purple-600 border-purple-600 text-white'
                              : 'bg-purple-600 border-purple-600 text-white'
                            : isDark
                              ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border transition-colors ${
                    currentPage === totalPages
                      ? isDark 
                        ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                      : isDark
                        ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Show pagination info even when only 1 page but with search results */}
          {totalPages <= 1 && searchTerm && (
            <div className={`px-6 py-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {totalUsers === 0 ? (
                  <>No users found matching "{searchTerm}"</>
                ) : (
                  <>Showing {totalUsers} result{totalUsers !== 1 ? 's' : ''} for "{searchTerm}"</>
                )}
              </div>
            </div>
          )}
        </div>
    </>
  )
})

export default UserTable