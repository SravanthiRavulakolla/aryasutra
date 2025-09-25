import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';

const Practitioners = () => {
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPractitioners();
  }, []);

  const fetchPractitioners = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/practitioners');
      if (!response.ok) {
        throw new Error('Failed to fetch practitioners');
      }
      const data = await response.json();
      setPractitioners(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (practitionerId, newStatus) => {
    try {
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

      // Refresh practitioners list
      fetchPractitioners();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        Error: {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-2xl font-bold mb-6">Manage Practitioners</h1>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {practitioners.map((practitioner) => (
              <tr key={practitioner._id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                  {practitioner.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                  {practitioner.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${practitioner.status === 'active' ? 'bg-green-100 text-green-800' : 
                      practitioner.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {practitioner.status ? practitioner.status.charAt(0).toUpperCase() + practitioner.status.slice(1) : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  {practitioner.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(practitioner._id, 'active')}
                        className="px-3 py-1 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(practitioner._id, 'rejected')}
                        className="px-3 py-1 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {practitioner.status === 'active' && (
                    <button
                      onClick={() => handleStatusChange(practitioner._id, 'inactive')}
                      className="px-3 py-1 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      Deactivate
                    </button>
                  )}
                  {practitioner.status === 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(practitioner._id, 'active')}
                      className="px-3 py-1 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Practitioners;