import { FileText} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const DashboardHeader = ({theme, setTheme, isDark, role}) => {
   const navigate = useNavigate();

     const handleLogout = () => {
    navigate("/login");
  };
  return (
    <>
    <header className={`px-6 py-4 border-b transition-colors ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Enterprise Insurance Hub
              </h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Centralized Policy & Claim Monitoring
              </p>
            </div>
            <div className="ml-4 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
              {role}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Selector */}
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm cursor-pointer ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
            
            <button
            onClick={handleLogout}
             className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              isDark 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}>
              Logout
            </button>
          </div>
        </div>
      </header>
    </>
  )
}

export default DashboardHeader