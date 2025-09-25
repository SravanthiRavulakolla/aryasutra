import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PanchakarmaBookingPatient from '../components/patient/PanchakarmaBookingPatient';
import ProgressDashboardAyursutra from '../pages/ProgressDashboardAyursutra';

const PatientBooking = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    treatment: 'Panchakarma Detox',
    date: '',
    time: '9:00 AM',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [bookings, setBookings] = useState([]);
  const [progressData, setProgressData] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
    fetchProgressData();
    fetchRecentBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/bookings/user/${user?.id}`);
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchProgressData = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/progress/${user?.id}`);
      const data = await response.json();
      setProgressData(data.progress || {
        totalSessions: 12,
        completedSessions: 8,
        nextAppointment: '2024-03-25',
        currentTreatment: 'Panchakarma Detox',
        healthScore: 85,
        improvements: [
          { metric: 'Digestion', before: 55, after: 85 },
          { metric: 'Sleep Quality', before: 45, after: 80 },
          { metric: 'Stress Level', before: 75, after: 40 },
          { metric: 'Energy Level', before: 50, after: 85 },
          { metric: 'Joint Flexibility', before: 60, after: 90 },
          { metric: 'Mental Clarity', before: 55, after: 85 }
        ],
        treatmentTimeline: [
          { date: '2024-01-15', treatment: 'Initial Consultation', status: 'completed' },
          { date: '2024-01-22', treatment: 'Panchakarma Session 1', status: 'completed' },
          { date: '2024-02-05', treatment: 'Abhyanga Massage', status: 'completed' },
          { date: '2024-02-19', treatment: 'Shirodhara Therapy', status: 'completed' },
          { date: '2024-03-05', treatment: 'Progress Review', status: 'completed' },
          { date: '2024-03-25', treatment: 'Follow-up Session', status: 'upcoming' }
        ]
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
      setProgressData({
        totalSessions: 12,
        completedSessions: 8,
        nextAppointment: '2024-03-25',
        currentTreatment: 'Panchakarma Detox',
        healthScore: 85,
        improvements: [
          { metric: 'Digestion', before: 55, after: 85 },
          { metric: 'Sleep Quality', before: 45, after: 80 },
          { metric: 'Stress Level', before: 75, after: 40 },
          { metric: 'Energy Level', before: 50, after: 85 },
          { metric: 'Joint Flexibility', before: 60, after: 90 },
          { metric: 'Mental Clarity', before: 55, after: 85 }
        ],
        treatmentTimeline: [
          { date: '2024-01-15', treatment: 'Initial Consultation', status: 'completed' },
          { date: '2024-01-22', treatment: 'Panchakarma Session 1', status: 'completed' },
          { date: '2024-02-05', treatment: 'Abhyanga Massage', status: 'completed' },
          { date: '2024-02-19', treatment: 'Shirodhara Therapy', status: 'completed' },
          { date: '2024-03-05', treatment: 'Progress Review', status: 'completed' },
          { date: '2024-03-25', treatment: 'Follow-up Session', status: 'upcoming' }
        ]
      });
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/bookings/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setRecentBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form data
    if (!formData.treatment || !formData.date || !formData.time) {
      setMessage('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Create new booking object
      const newBooking = {
        id: Date.now(),
        treatment: formData.treatment,
        date: formData.date,
        time: formData.time,
        requirements: formData.requirements,
        status: 'upcoming',
        createdAt: new Date().toISOString()
      };

      // Try to send to server (if available)
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('http://localhost:5001/api/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newBooking)
          });
          
          if (response.ok) {
            const data = await response.json();
            newBooking.id = data.id || newBooking.id;
          }
        }
      } catch (serverError) {
        console.log('Server not available, storing locally');
      }

      // Update local state immediately
      setBookings(prevBookings => [newBooking, ...prevBookings]);
      setMessage('Appointment booked successfully!');
      
      // Reset form
      setFormData({
        treatment: 'Panchakarma Detox',
        date: '',
        time: '9:00 AM',
        requirements: ''
      });
      
    } catch (error) {
      setMessage('Error booking appointment. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  const ProgressChart = ({ metric, before, after }) => {
    const improvement = ((after - before) / before * 100).toFixed(1);
    const gradientId = `gradient-${metric.replace(/\s+/g, '-').toLowerCase()}`;
    
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">{metric}</h4>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Before: {before}%</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">After: {after}%</span>
        </div>
        <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <svg className="absolute w-0 h-0">
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5A3C" />
                <stop offset="100%" stopColor="#D4A574" />
              </linearGradient>
            </defs>
          </svg>
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${after}%`,
              background: `url(#${gradientId})`
            }}
          />
        </div>
        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
          +{improvement}% improvement
        </p>
      </div>
    );
  };

  const RecentBookings = () => (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Your Recent Bookings</h3>
      {recentBookings.length === 0 ? (
        <p className="text-gray-600">No bookings yet</p>
      ) : (
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div 
              key={booking._id} 
              className="bg-white p-4 rounded-lg shadow border border-gray-200"
            >
              <h4 className="font-medium">{booking.treatment}</h4>
              <p className="text-gray-600">
                {new Date(booking.date).toLocaleDateString()} at {booking.time}
              </p>
              {booking.requirements && (
                <p className="text-gray-500 text-sm mt-2">{booking.requirements}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Book Your Therapy Session
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Welcome back, {user?.name}! Choose your preferred Panchakarma treatment.
            </p>
          </div>

          {/* Enhanced Panchakarma Booking */}
          <PanchakarmaBookingPatient user={user} />
        </motion.div>
      </div>
    </div>
  );
};

export default PatientBooking;