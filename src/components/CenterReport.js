import React, { useEffect, useState } from 'react';

const CenterReport = ({ onClose }) => {
  const [reportData, setReportData] = useState({
    allCenters: [],
    verifiedCenters: [],
    patientCount: 0,
    activeTherapists: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch centers
        const centersResponse = await fetch('http://localhost:5001/api/centers');
        const centers = await centersResponse.json();
        
        // Fetch practitioners
        const practitionersResponse = await fetch('http://localhost:5001/api/practitioners?status=active');
        const practitioners = await practitionersResponse.json();
        
        // Fetch all users to count patients
        const usersResponse = await fetch('http://localhost:5001/api/users');
        const users = await usersResponse.json();
        
        setReportData({
          allCenters: centers,
          verifiedCenters: centers.filter(center => center.verified),
          patientCount: users.filter(user => user.role === 'patient').length,
          activeTherapists: practitioners.length
        });
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-2xl w-full mx-4">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Generating Report...
          </h2>
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-2xl w-full mx-4 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Center Analysis Report
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#8D6E63] bg-opacity-10 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#8D6E63]">Total Centers</h3>
            <p className="text-3xl font-bold text-[#8D6E63]">{reportData.allCenters.length}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700">Verified Centers</h3>
            <p className="text-3xl font-bold text-green-700">{reportData.verifiedCenters.length}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700">Active Therapists</h3>
            <p className="text-3xl font-bold text-blue-700">{reportData.activeTherapists}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-700">Total Patients</h3>
            <p className="text-3xl font-bold text-purple-700">{reportData.patientCount}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Centers List</h3>
          <div className="space-y-4">
            {reportData.allCenters.map((center) => (
              <div
                key={center._id}
                className="p-4 border rounded-lg bg-white dark:bg-gray-700 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {center.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">{center.location}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      center.verified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {center.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default CenterReport;