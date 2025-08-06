
const UserStatsGrid = ({stats, isDark}) => {
  return (
    <>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`p-6 rounded-xl border transition-colors ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.title}
                </h3>
                <div className={`w-4 h-4 rounded-full ${stat.color}`}></div>
              </div>
              <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </div>
              <div className={`text-sm ${
                stat.changeType === 'positive' 
                  ? 'text-green-600' 
                  : stat.changeType === 'negative' 
                  ? 'text-red-600' 
                  : isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {stat.change}
              </div>
            </div>
          ))}
        </div>
    </>
  )
}

export default UserStatsGrid