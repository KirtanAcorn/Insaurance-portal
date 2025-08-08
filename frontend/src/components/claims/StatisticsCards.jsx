import React from 'react'

const StatisticsCards = ({statsClaim, isDark}) => {
  return (
    <>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsClaim.map((stat, index) => (
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
              <div className={`text-sm'text-gray-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {stat.subtitle}
              </div>
            </div>
          ))}
     </div>
    </>
  )
}

export default StatisticsCards