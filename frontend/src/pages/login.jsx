import React, { useState, useEffect } from 'react';
import { ChevronDown, Sun, Moon, Monitor, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import astuteLogo from '../assets/Astute logo.png';
import infoImg from '../assets/infoImg.png';

const Login = () => {
  const [theme, setTheme] = useState('system');
  const [isDark, setIsDark] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginAs, setLoginAs] = useState('Client');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState(''); // State for displaying messages

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginMessage(''); // Clear previous messages
    try {
      const requestBody = {
        email: email.trim(),
        password: password,
        role: loginAs,
      };
      
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response from server');
      }

      if (response.ok) { // Status 200-299 is ok
        setLoginMessage('Login successful! Redirecting...');
        // Store user data or token here if needed
        navigate("/dashboard", { state: { role: data.userRole, userData: data } });
      } else { // Handle errors
        console.error('Login failed:', { status: response.status, data });
        // Use the most specific error message available
        const errorMessage = data?.message || data?.error || `Error: ${response.statusText}`;
        setLoginMessage(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginMessage('Failed to connect to the server. Please try again later.');
    }
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
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className={`w-full max-w-6xl rounded-2xl shadow-2xl transition-colors duration-300 border-0 overflow-hidden ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[650px]">
            {/* Left Section - Insurance Details */}
            <div className={`hidden lg:flex flex-col justify-center p-12 ${
              isDark ? 'bg-gray-900' : 'bg-white'
            }`}>
              <div className="w-full">
                <h2 className={`text-3xl font-bold mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  GROUP - COMPANY INSURANCE DETAILS
                </h2>
                <p className={`text-sm mb-10 leading-relaxed ${
                  isDark ? 'text-gray-400' : 'text-gray-900'
                }`}>
                  Company insurance, also known as business insurance, protects a company from financial losses due to unexpected events such as property damage, legal liabilities, employee-related risks, and operational disruptions. It helps businesses mitigate risks and comply with regulations, ensuring smooth operations.
                </p>
                
                {/* Insurance Details Image */}
                <div className="w-full flex items-center justify-center">
                  <img 
                    src={infoImg} 
                    alt="Group Company Insurance Details" 
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Right Section - Login Form */}
            <div className={`flex flex-col justify-center p-12 ${
              isDark ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
            }`}>
              {/* Header */}
              <div className="text-center mb-8">
                {/* Astute Logo */}
                <div className="mx-auto mb-6 flex items-center justify-center">
                  <img 
                    src={astuteLogo} 
                    alt="Astute Healthcare Logo" 
                    className="h-20 w-auto object-contain"
                  />
                </div>
                <h1 className={`text-2xl font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Login
                </h1>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Please enter your email and Password
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
            <div className="space-y-5">
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
                  required
                  className={`w-full px-4 py-3 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
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
                  required
                  className={`w-full px-4 py-3 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
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
                    className={`w-full px-4 py-3 text-sm rounded-lg border text-left flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <span className="flex items-center">
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
                          className={`w-full px-4 py-3 text-sm text-left transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer ${
                            isDark 
                              ? 'text-white hover:bg-gray-600' 
                              : 'text-gray-900 hover:bg-gray-50'
                          } ${loginAs === option ? (isDark ? 'bg-gray-600' : 'bg-gray-100') : ''}`}
                        >
                          <span className="flex items-center">
                            {option}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Login message display */}
              {loginMessage && (
                <div className="text-center text-sm font-medium text-red-500 mt-3">
                  {loginMessage}
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit" 
                className="mt-6 w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
              >
                Login
              </button>
            </div>
          </form>
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