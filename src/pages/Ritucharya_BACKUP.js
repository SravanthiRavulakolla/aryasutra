import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Ritucharya = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookConsultation = () => {
    if (user) {
      // If user is logged in, navigate to booking page
      if (user.role === 'patient') {
        navigate('/patient/booking');
      } else {
        // For practitioners/admins, show alert or navigate to appropriate page
        alert('Practitioners can manage consultations from their dashboard. Please switch to a patient account to book consultations.');
      }
    } else {
      // If not logged in, redirect to login with return path
      navigate('/login', { state: { returnPath: '/patient/booking' } });
    }
  };

  const seasons = [
    {
      name: 'Spring (Vasant)',
      period: 'March - May',
      dosha: 'Kapha',
      recommendations: [
        'Light, warm, and dry foods',
        'Regular exercise and yoga',
        'Detoxification practices',
        'Early morning walks'
      ],
      foods: ['Bitter greens', 'Spices like ginger', 'Light grains', 'Herbal teas'],
      color: 'bg-green-100 dark:bg-green-900'
    },
    {
      name: 'Summer (Grishma)',
      period: 'June - August',
      dosha: 'Pitta',
      recommendations: [
        'Cool, sweet, and hydrating foods',
        'Avoid excessive heat and sun',
        'Meditation and calming practices',
        'Swimming and gentle activities'
      ],
      foods: ['Coconut water', 'Sweet fruits', 'Cooling herbs', 'Light meals'],
      color: 'bg-orange-100 dark:bg-orange-900'
    },
    {
      name: 'Monsoon (Varsha)',
      period: 'September - October',
      dosha: 'Vata & Pitta',
      recommendations: [
        'Warm, cooked, and easily digestible foods',
        'Boost immunity with herbs',
        'Stay dry and warm',
        'Gentle indoor exercises'
      ],
      foods: ['Warm soups', 'Ginger tea', 'Cooked vegetables', 'Digestive spices'],
      color: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      name: 'Winter (Shishir)',
      period: 'November - February',
      dosha: 'Vata',
      recommendations: [
        'Warm, oily, and nourishing foods',
        'Oil massages and warm baths',
        'Adequate sleep and rest',
        'Indoor heating and warm clothing'
      ],
      foods: ['Ghee and oils', 'Nuts and seeds', 'Warm milk', 'Root vegetables'],
      color: 'bg-purple-100 dark:bg-purple-900'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Ritucharya Guidance
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover the ancient wisdom of seasonal living. Ritucharya teaches us to align our lifestyle, 
              diet, and daily routines with nature's rhythms for optimal health and harmony.
            </p>
          </div>

          {/* What is Ritucharya */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What is Ritucharya?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Ritucharya (ऋतुचर्या) is the Ayurvedic practice of seasonal regimen that helps maintain health 
              by adapting our lifestyle according to the changing seasons. 'Ritu' means season and 'Charya' 
              means regimen or conduct.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🌱</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Seasonal Diet</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Eat foods that balance seasonal doshas</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🧘</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Lifestyle Practices</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Adapt daily routines to seasonal changes</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚖️</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Dosha Balance</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Maintain equilibrium throughout the year</p>
              </div>
            </div>
          </motion.div>

          {/* Seasonal Guidelines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {seasons.map((season, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`card ${season.color}`}
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {season.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    <strong>Period:</strong> {season.period}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Dominant Dosha:</strong> {season.dosha}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Lifestyle Recommendations:
                  </h4>
                  <ul className="space-y-1">
                    {season.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                        <span className="text-ayurveda-primary mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Recommended Foods:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {season.foods.map((food, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-white dark:bg-gray-800 text-xs rounded-full text-gray-700 dark:text-gray-300"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <div className="card bg-ayurveda-light dark:bg-ayurveda-dark">
              <h2 className="text-2xl font-bold text-ayurveda-dark dark:text-ayurveda-light mb-4">
                Ready to Start Your Seasonal Journey?
              </h2>
              <p className="text-ayurveda-dark dark:text-ayurveda-light mb-6">
                Consult with our experienced Ayurvedic practitioners to create a personalized Ritucharya plan.
              </p>
              <button 
                className="btn-primary hover:scale-105 transition-transform duration-200"
                onClick={handleBookConsultation}
              >
                Book Consultation
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Ritucharya;