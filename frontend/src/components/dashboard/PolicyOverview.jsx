import { Eye, Icon } from "lucide-react";


const PolicyOverview = ({isDark, policiesDashboard, }) => {
  return (
    <>
    <div className={`rounded-xl transition-colors duration-300 ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            } shadow-sm`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <Eye className={`w-5 h-5 mr-2 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Policy Overview
                  </h2>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  Current policy status
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {policiesDashboard.map((policy, index) => {
                    const Icon = policy.icon;
                    const statusColor = policy.statusColor === 'green' ? 'text-green-500' : 'text-red-500';
                    const statusBg = policy.statusColor === 'green' ? 
                      (isDark ? 'bg-green-900/30' : 'bg-green-50') : 
                      (isDark ? 'bg-red-900/30' : 'bg-red-50');
                    
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg ${
                            isDark ? 'bg-gray-700' : 'bg-gray-100'
                          } flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {policy.title}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              Coverage: {policy.coverage}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBg} ${statusColor}`}>
                          {policy.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 space-y-2">
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
    </>
  )
}

export default PolicyOverview