import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from './Loader';

const VerifyPractitionerModal = ({ isOpen, onClose }) => {
  const [pendingPractitioners, setPendingPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchPendingPractitioners();
    }
  }, [isOpen]);

  const fetchPendingPractitioners = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/practitioners?status=pending');
      if (!response.ok) {
        throw new Error('Failed to fetch pending practitioners');
      }
      const data = await response.json();
      setPendingPractitioners(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (practitionerId, newStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/practitioners/${practitionerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update practitioner status');
      }

      // Refresh the list
      await fetchPendingPractitioners();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          >
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Verify Practitioners
                </h3>

                {error && (
                  <div className="mt-2 text-red-500 text-sm">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader />
                  </div>
                ) : (
                  <div className="mt-4">
                    {pendingPractitioners.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-center">
                        No pending practitioners to verify
                      </p>
                    ) : (
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {pendingPractitioners.map((practitioner) => (
                          <div key={practitioner._id} className="py-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                  {practitioner.name}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {practitioner.email}
                                </p>
                              </div>
                              <div className="space-x-2">
                                <button
                                  onClick={() => handleStatusChange(practitioner._id, 'active')}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleStatusChange(practitioner._id, 'rejected')}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default VerifyPractitionerModal;