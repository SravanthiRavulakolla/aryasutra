import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    centerId: '',
    specialization: '',
    workingHours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '09:00', end: '17:00' },
      sunday: { start: '', end: '' }
    }
  });
  const [centers, setCenters] = useState([]);
  const [error, setError] = useState('');
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  // Fetch centers on component mount
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/centers');
        const data = await response.json();
        setCenters(data);
      } catch (error) {
        console.error('Error fetching centers:', error);
        setError('Failed to load centers');
      }
    };
    fetchCenters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('workingHours.')) {
      const [day, field] = name.split('.')[1].split('_');
      setFormData(prev => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [day]: {
            ...prev.workingHours[day],
            [field]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Prepare the data for signup
    const signupData = {
      email: formData.email,
      password: formData.password,
      role: formData.role
    };

    // Add practitioner specific data
    if (formData.role === 'practitioner') {
      if (!formData.centerId) {
        setError('Please select a center');
        return;
      }
      if (!formData.specialization) {
        setError('Please enter your specialization');
        return;
      }
      signupData.centerId = formData.centerId;
      signupData.specialization = formData.specialization;
      signupData.workingHours = formData.workingHours;
    }

    const result = await signup(signupData);
    
    if (result.success) {
      // Redirect based on role
      switch (formData.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'practitioner':
          navigate('/practitioner/dashboard');
          break;
        case 'patient':
          navigate('/patient/booking');
          break;
        default:
          navigate('/');
      }
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-ayurveda-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link to="/login" className="font-medium text-ayurveda-primary hover:text-ayurveda-dark">
              sign in to existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-ayurveda-primary focus:border-ayurveda-primary focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-ayurveda-primary focus:border-ayurveda-primary focus:z-10 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-ayurveda-primary focus:border-ayurveda-primary focus:z-10 sm:text-sm"
                placeholder="Confirm your password"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-ayurveda-primary focus:border-ayurveda-primary sm:text-sm"
              >
                <option value="patient">Patient</option>
                <option value="practitioner">Practitioner</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {formData.role === 'practitioner' && (
              <>
                <div>
                  <label htmlFor="centerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Center
                  </label>
                  <select
                    id="centerId"
                    name="centerId"
                    value={formData.centerId}
                    onChange={handleChange}
                    required={formData.role === 'practitioner'}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-ayurveda-primary focus:border-ayurveda-primary sm:text-sm"
                  >
                    <option value="">Select a center</option>
                    {centers.map(center => (
                      <option key={center._id} value={center._id}>
                        {center.name} - {center.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Specialization
                  </label>
                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    value={formData.specialization}
                    onChange={handleChange}
                    required={formData.role === 'practitioner'}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-ayurveda-primary focus:border-ayurveda-primary sm:text-sm"
                    placeholder="Enter your specialization"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">Working Hours</h4>
                  {Object.keys(formData.workingHours).map(day => (
                    <div key={day} className="flex items-center space-x-4">
                      <label className="w-24 text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {day}
                      </label>
                      <input
                        type="time"
                        name={`workingHours.${day}_start`}
                        value={formData.workingHours[day].start}
                        onChange={handleChange}
                        className="w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        name={`workingHours.${day}_end`}
                        value={formData.workingHours[day].end}
                        onChange={handleChange}
                        className="w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-ayurveda-primary hover:bg-ayurveda-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ayurveda-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader size="small" /> : 'Sign up'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;