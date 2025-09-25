import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 rounded-md overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
              <img
                src="/images/logo/ayursutra-logo.png"
                alt="AyurSutra logo"
                className="w-full h-full object-contain"
                loading="eager"
                decoding="async"
              />
            </div>
            <span className="ml-2 text-xl font-bold text-ayurveda-primary dark:text-ayurveda-secondary">
              AyurSutra
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/ritucharya" 
              className="text-gray-700 dark:text-gray-300 hover:text-ayurveda-primary transition-colors"
            >
              Ritucharya Guidance
            </Link>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Role-specific navigation buttons */}
                {user.role === 'patient' && (
                  <>
                    <Link
                      to="/patient/booking"
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
                    >
                      <span className="mr-2">🧘</span>
                      Book Therapy
                    </Link>
                    <Link
                      to="/patient/progress"
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
                    >
                      <span className="mr-2">📊</span>
                      Progress Dashboard
                    </Link>
                  </>
                )}
                
                {/* Practitioner-specific buttons */}
                {user.role === 'practitioner' && (
                  <Link
                    to="/practitioner/dashboard"
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
                  >
                    <span className="mr-2">👨‍⚕️</span>
                    Practitioner Dashboard
                  </Link>
                )}
                
                {/* Admin-specific buttons */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
                  >
                    <span className="mr-2">⚙️</span>
                    Admin Dashboard
                  </Link>
                )}
                
                <span className="text-gray-700 dark:text-gray-300">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-primary"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-ayurveda-primary transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col space-y-4">
              <Link 
                to="/ritucharya" 
                className="text-gray-700 dark:text-gray-300 hover:text-ayurveda-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Ritucharya Guidance
              </Link>
              
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
              >
                <span>{isDark ? '☀️' : '🌙'}</span>
                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              {user ? (
                <div className="flex flex-col space-y-2">
                  {/* Role-specific mobile navigation buttons */}
                  {user.role === 'patient' && (
                    <>
                      <Link
                        to="/patient/booking"
                        className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-md text-sm font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="mr-2">🧘</span>
                        Book Therapy
                      </Link>
                      <Link
                        to="/patient/progress"
                        className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md text-sm font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="mr-2">📊</span>
                        Progress Dashboard
                      </Link>
                    </>
                  )}
                  
                  {/* Practitioner-specific mobile buttons */}
                  {user.role === 'practitioner' && (
                    <Link
                      to="/practitioner/dashboard"
                      className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-md text-sm font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="mr-2">👨‍⚕️</span>
                      Practitioner Dashboard
                    </Link>
                  )}
                  
                  {/* Admin-specific mobile buttons */}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md text-sm font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="mr-2">⚙️</span>
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <span className="text-gray-700 dark:text-gray-300">
                    Welcome, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn-primary w-full"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    className="text-gray-700 dark:text-gray-300 hover:text-ayurveda-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="btn-primary w-full text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;