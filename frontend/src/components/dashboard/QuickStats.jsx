import { Activity, Icon } from "lucide-react";


const QuickStats = ({isDark, getColorClassesDashbaord, quickStatsDashboard }) => {
  return (
    <>
    <div className={`rounded-xl transition-colors duration-300 ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            } shadow-sm`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <Activity className={`w-5 h-5 mr-2 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Quick Stats
                  </h2>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  Key metrics at a glance
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {quickStatsDashboard.map((stat, index) => {
                    const Icon = stat.icon;
                    const colorClasses = getColorClassesDashbaord(stat.color);
                    
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg ${colorClasses.bg} flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${colorClasses.icon}`} />
                          </div>
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {stat.title}
                          </span>
                        </div>
                        <span className={`text-lg font-bold ${colorClasses.text}`}>
                          {stat.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
    </>
  )
}

export default QuickStats