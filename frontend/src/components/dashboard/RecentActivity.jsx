import { Activity, Icon } from "lucide-react";

const RecentActivity = ({isDark, recentActivityDashboard, }) => {
  return (
    <>
            <div className={`rounded-xl transition-colors duration-300 ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } shadow-sm`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Activity className={`w-5 h-5 mr-2 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Recent Activity
                </h2>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Latest updates and notifications
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivityDashboard.map((activity, index) => {
                  const Icon = activity.icon;
                  const iconColor = activity.type === 'success' ? 'text-green-500' :
                                   activity.type === 'warning' ? 'text-yellow-500' :
                                   activity.type === 'error' ? 'text-red-500' :
                                   isDark ? 'text-blue-400' : 'text-blue-500';
                  
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'success' ? (isDark ? 'bg-green-900/30' : 'bg-green-50') :
                        activity.type === 'warning' ? (isDark ? 'bg-yellow-900/30' : 'bg-yellow-50') :
                        activity.type === 'error' ? (isDark ? 'bg-red-900/30' : 'bg-red-50') :
                        isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                      }`}>
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {activity.title}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {activity.subtitle}
                        </p>
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {activity.date}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
    </>
  )
}

export default RecentActivity