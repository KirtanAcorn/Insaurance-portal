import React from 'react'
import ClaimsHeader from '../../components/claims/ClaimsHeader'

const Claims = () => {
  return (
    <>
    <ClaimsHeader/>
    <div className={`rounded-xl border transition-colors mb-8 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {/* Section Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-blue-900' : 'bg-blue-100'
              }`}>
                <FileText className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Claims Overview
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Comprehensive claims management with policy integration
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Claim ID</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Company</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Policy Type</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Type</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Claim Amount</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Excess</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Net Amount</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Date</th>
                  <th className={`px-6 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id} className={`border-b hover:bg-opacity-50 transition-colors ${
                    isDark 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <td className="px-6 py-4">
                      <span className={`font-medium text-blue-600 ${isDark ? 'text-blue-400' : ''}`}>
                        {claim.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-sm ${
                          isDark ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          {claim.companyIcon}
                        </div>
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {claim.company}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        getPolicyTypeColorr(claim.policyType)
                      }`}>
                        {claim.policyType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        getClaimTypeColorr(claim.type)
                      }`}>
                        {claim.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        isDark ? getStatusDarkColorr(claim.status) : getStatusColor(claim.status)
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {claim.claimAmount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium text-red-600 ${isDark ? 'text-red-400' : ''}`}>
                        {claim.excess}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold text-green-600 ${isDark ? 'text-green-400' : ''}`}>
                        {claim.netAmount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {claim.date}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className={`p-2 rounded-lg transition-colors ${
                          isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className={`p-2 rounded-lg transition-colors ${
                          isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}>
                          <ExternalLink className="w-4 h-4" />
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

export default Claims