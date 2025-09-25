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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Detailed Center Report
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Comprehensive analysis of centers, practitioners, and patients
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Centers
            </h3>
            <p className="text-3xl font-bold text-[#8D6E63]">
              {reportData.stats.totalCenters}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Active Practitioners
            </h3>
            <p className="text-3xl font-bold text-[#8D6E63]">
              {reportData.stats.totalPractitioners}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Patients
            </h3>
            <p className="text-3xl font-bold text-[#8D6E63]">
              {reportData.stats.totalPatients}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Appointments
            </h3>
            <p className="text-3xl font-bold text-[#8D6E63]">
              {reportData.stats.totalAppointments}
            </p>
          </div>
        </div>

        {/* Detailed Center Reports */}
        <div className="space-y-6">
          {reportData.centers.map((center) => (
            <div
              key={center._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            >
              {/* Center Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {center.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{center.location}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      center.verified
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {center.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                {/* Center Stats */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Practitioners</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {center.practitionerCount}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Patients</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {center.patientCount}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Appointments</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {center.appointmentCount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Practitioners List */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Practitioners
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {center.practitioners.map((practitioner) => (
                    <div
                      key={practitioner._id}
                      className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {practitioner.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {practitioner.email}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          practitioner.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {practitioner.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Appointments */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Appointments
                </h3>
                <div className="space-y-4">
                  {center.recentAppointments.slice(0, 5).map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {appointment.patientName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {appointment.therapy}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(appointment.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {appointment.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedReport;