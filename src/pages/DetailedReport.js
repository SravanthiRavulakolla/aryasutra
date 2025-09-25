import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DetailedReport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    centers: [],
    stats: {
      totalCenters: 0,
      totalPractitioners: 0,
      totalPatients: 0,
      totalAppointments: 0
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all required data in parallel
      const [centersRes, practitionersRes, bookingsRes] = await Promise.all([
        fetch('http://localhost:5001/api/centers'),
        fetch('http://localhost:5001/api/practitioners'),
        fetch('http://localhost:5001/api/bookings/all')
      ]);

      const [centers, practitioners, bookings] = await Promise.all([
        centersRes.json(),
        practitionersRes.json(),
        bookingsRes.json()
      ]);

      // Process and organize the data
      const processedData = processReportData(centers, practitioners, bookings);
      setReportData(processedData);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processReportData = (centers, practitioners, bookings) => {
    // Create a map of center data
    const centerMap = new Map();

    // Initialize centers with empty practitioners and patients
    centers.forEach(center => {
      centerMap.set(center.name, {
        ...center,
        practitioners: [],
        patients: new Set(),
        appointmentCount: 0,
        recentAppointments: []
      });
    });

    // Add practitioners to their respective centers
    practitioners.forEach(practitioner => {
      // For demo, randomly assign practitioners to centers
      const randomCenter = centers[Math.floor(Math.random() * centers.length)];
      if (randomCenter && centerMap.has(randomCenter.name)) {
        centerMap.get(randomCenter.name).practitioners.push(practitioner);
      }
    });

    // Process bookings to count patients and appointments
    bookings.forEach(booking => {
      const center = centerMap.get(booking.centerName);
      if (center) {
        center.patients.add(booking.userId);
        center.appointmentCount++;
        center.recentAppointments.push(booking);
      }
    });

    // Convert map back to array and calculate totals
    const processedCenters = Array.from(centerMap.values()).map(center => ({
      ...center,
      patientCount: center.patients.size,
      practitionerCount: center.practitioners.length,
      patients: Array.from(center.patients) // Convert Set to Array
    }));

    return {
      centers: processedCenters,
      stats: {
        totalCenters: centers.length,
        totalPractitioners: practitioners.length,
        totalPatients: new Set(bookings.map(b => b.userId)).size,
        totalAppointments: bookings.length
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse text-center">Loading report data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Center Performance Report
            </h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Back
          </button>
        </div>

        {/* Summary Stats */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Centers</p>
              <p className="text-xl font-bold text-[#8D6E63]">{reportData.stats.totalCenters}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Practitioners</p>
              <p className="text-xl font-bold text-[#8D6E63]">{reportData.stats.totalPractitioners}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Patients</p>
              <p className="text-xl font-bold text-[#8D6E63]">{reportData.stats.totalPatients}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Appointments</p>
              <p className="text-xl font-bold text-[#8D6E63]">{reportData.stats.totalAppointments}</p>
            </div>
          </div>
        </div>

        {/* Centers Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Center Details
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Practitioners
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Patients
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Appointments
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reportData.centers.map((center) => (
                <tr key={center._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{center.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{center.location}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      center.verified
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {center.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button 
                      onClick={() => window.alert('Practitioners: ' + center.practitioners.map(p => p.name).join(', '))}
                      className="text-sm text-[#8D6E63] hover:text-[#6D4C41]"
                    >
                      {center.practitionerCount}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-900 dark:text-white">
                    {center.patientCount}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-900 dark:text-white">
                    {center.appointmentCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Recent Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportData.centers.flatMap(center => 
              center.recentAppointments.slice(0, 2).map(appointment => (
                <div key={appointment._id} className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{appointment.patientName}</span>
                    <span className="text-gray-500">{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-600">{appointment.therapy}</span>
                    <span className="text-gray-500">{center.name}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedReport;