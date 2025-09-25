import React from 'react';
import { motion } from 'framer-motion';

const TestCredentials = () => {
  const testUsers = [
    {
      role: 'admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      description: 'Full system access and user management'
    },
    {
      role: 'practitioner',
      email: 'practitioner@gmail.com',
      password: 'practitioner123',
      description: 'Manage patients and appointments'
    },
    {
      role: 'patient',
      email: 'patient@gmail.com',
      password: 'patient123',
      description: 'Book appointments and track progress'
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30';
      case 'practitioner':
        return 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30';
      case 'patient':
        return 'from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30';
      default:
        return 'from-gray-100 to-gray-200 dark:from-gray-900/30 dark:to-gray-800/30';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'practitioner':
        return '🩺';
      case 'patient':
        return '👤';
      default:
        return '👤';
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🔐 Test User Credentials
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Use these pre-configured test accounts to explore the different user roles and features of the Ayurveda application.
            </p>
          </div>

          {/* Warning Banner */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="text-amber-500 text-2xl mr-3">⚠️</div>
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200">For Testing Purposes Only</h3>
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  These are demo accounts for development and testing. Do not use in production.
                </p>
              </div>
            </div>
          </div>

          {/* Test User Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {testUsers.map((user, index) => (
              <motion.div
                key={user.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-gradient-to-br ${getRoleColor(user.role)} rounded-lg shadow-md overflow-hidden`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{getRoleIcon(user.role)}</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                        {user.role}
                      </h3>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      user.role === 'admin' 
                        ? 'bg-red-500 text-white'
                        : user.role === 'practitioner'
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                    {user.description}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Email
                      </label>
                      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-md p-2">
                        <span className="text-sm font-mono text-gray-900 dark:text-white">
                          {user.email}
                        </span>
                        <button
                          onClick={() => copyToClipboard(user.email)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                          title="Copy email"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Password
                      </label>
                      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-md p-2">
                        <span className="text-sm font-mono text-gray-900 dark:text-white">
                          {user.password}
                        </span>
                        <button
                          onClick={() => copyToClipboard(user.password)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                          title="Copy password"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              📚 How to Use
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-ayurveda-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Navigate to Login</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Go to the <a href="/login" className="text-ayurveda-primary hover:underline">login page</a> of the application.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-ayurveda-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Select Role</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Choose the appropriate role from the dropdown menu.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-ayurveda-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Enter Credentials</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Use the email and password from the corresponding card above. Click the copy icon to quickly copy the values.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-ayurveda-primary text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Explore Features</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Each role provides access to different features and dashboards. Explore the available functionality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestCredentials;