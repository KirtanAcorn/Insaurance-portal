
const NavigationTabs = ({isDark, tabs, activeTabChanger, role}) => {

    // Filter out "Users" tab for clients and team members
  const visibleTabs = (role === "Client" || role === "Team Member")
    ? tabs.filter((tab) => tab.name !== "Users")
    : tabs;

  return (
    <>
    <nav className={`px-6 py-4 border-b transition-colors ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex justify-center">
          {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.active;
            return (
              <button
                key={tab.name}
                onClick={() => activeTabChanger(tab.name)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer w-1/4 text-center justify-center ${
                  isActive
                    ? ` ${tab.color} text-white`
                    : isDark
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  )
}

export default NavigationTabs