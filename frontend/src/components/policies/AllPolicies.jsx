import { FileText, Loader2, AlertCircle } from 'lucide-react';

const AllPolicies = ({ isDark, getInsuranceIcon, allPolicies, isLoading, error }) => {
  // Loading state
  if (isLoading) {
    return (
      <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-purple-400' : 'text-purple-600'} mb-4`} />
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading policies...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-red-500/30' : 'bg-white border-red-200'}`}>
        <div className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <h3 className={`text-lg font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Error loading policies</h3>
          <p className={`text-sm text-center max-w-md ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {error.message || 'Failed to load policies. Please try again later.'}
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!allPolicies || allPolicies.length === 0) {
    return (
      <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className={`w-10 h-10 mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <h3 className={`text-lg font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>No policies found</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No active policies found for the selected company.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
            <FileText className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>All Policies</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Complete overview of insurance policies
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Policy Number
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Type
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Status
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Premium
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Coverage
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  End Date
                </th>
                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Actions</span>
                </th> */}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {allPolicies.map((policy, index) => {
              return (<tr key={`${policy.id}-${index}`} className={isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md ${isDark ? 'bg-gray-600' : 'bg-gray-100'}`}>
                        {getInsuranceIcon(policy.type)}
                      </div>
                      <div className="ml-4">
                        <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {policy.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                      {policy.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${policy.status === 'Active'
            ? isDark
                ? 'bg-green-900/50 text-green-300'
                : 'bg-green-100 text-green-800'
            : isDark
                ? 'bg-red-900/50 text-red-300'
                : 'bg-red-100 text-red-800'}`}>
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {policy.premium}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                      {policy.coverage}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {policy.endDate}
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className={`p-1.5 rounded-md ${isDark ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'}`} title="View Details">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                      <button className={`p-1.5 rounded-md ${isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`} title="More options">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                        </svg>
                      </button>
                    </div>
                  </td> */}
                </tr>);
})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AllPolicies