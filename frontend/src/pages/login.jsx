import React, { useState, useEffect } from 'react';
import { ChevronDown, Sun, Moon, Monitor, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [theme, setTheme] = useState('system');
  const [isDark, setIsDark] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginAs, setLoginAs] = useState('Client');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateTheme = () => {
      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(systemDark);
      } else {
        setIsDark(theme === 'dark');
      }
    };

    updateTheme();
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  const handleSubmit = () => {
    console.log('Login attempt:', { email, password, loginAs });
    navigate("/dashboard", {
      state: { role: loginAs }
    });
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ];

  const loginOptions = ['Client', 'Team Member', 'Admin'];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
    }`}>
      {/* Theme Selector */}
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={`px-3 py-2 rounded-lg border text-sm appearance-none pr-8 cursor-pointer transition-colors ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {themeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className={`w-full max-w-md rounded-2xl shadow-2xl transition-colors duration-300 border-0 ${
          isDark ? 'bg-gray-800' : ' bg-white/60'
        }`}>
          {/* Header */}
          <div className="px-8 pt-12 pb-8 text-center">
            <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-blue-600' : 'bg-blue-500'
            }`}>
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-2xl font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Insurance Portal
            </h1>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Next-Generation Insurance Management
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  required
                />
              </div>

              {/* Login As Dropdown */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Login As
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full px-4 py-3 rounded-lg border text-left flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <span className="flex items-center">
                      <span className='mr-1'>👤</span>
                      {loginAs}
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    } ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-20 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-white border-gray-300'
                    }`}>
                      {loginOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setLoginAs(option);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-opacity-50 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer${
                            isDark 
                              ? 'text-white hover:bg-gray-600' 
                              : 'text-gray-900 hover:bg-gray-50'
                          } ${loginAs === option ? (isDark ? 'bg-gray-600' : 'bg-gray-50') : ''}`}
                        >
                          <span className="flex items-center mr-1">
                            {option === 'Client' ? '👤' : option === 'Team Member' ? '⚡' : '👑'}
                            {option}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default Login;