import { Icon } from "lucide-react";

Icon

const StatsCards = ({isDark, statsDataDashboard, getColorClassesDashbaord, }) => {
  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsDataDashboard.map((stat, index) => {
            const colorClasses = getColorClassesDashbaord(stat.color);
            const Icon = stat.icon;  
            return (
              <div
                key={index}
                className={`p-6 rounded-xl transition-colors duration-300 ${
                  isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                } shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${colorClasses.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${colorClasses.icon}`} />
                  </div>
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    {stat.title}
                  </h3>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {stat.value}
                  </p>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${colorClasses.text}`}>
                      {stat.change}
                    </span>
                    <span className={`text-sm ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {stat.changeText}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
    </>
  )
}

export default StatsCards