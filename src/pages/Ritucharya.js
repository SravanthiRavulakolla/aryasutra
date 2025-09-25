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
      color: 'from-ayurveda-sage to-ayurveda-cream',
      borderColor: 'border-ayurveda-sage',
      icon: '🍃'
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
      color: 'from-ayurveda-turmeric to-ayurveda-sand',
      borderColor: 'border-ayurveda-turmeric',
      icon: '☀️'
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
      color: 'from-ayurveda-lotus to-ayurveda-accent',
      borderColor: 'border-ayurveda-lotus',
      icon: '💧'
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
      color: 'from-ayurveda-frost to-ayurveda-accent',
      borderColor: 'border-ayurveda-gold',
      icon: '❄️'
    }
  ];

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-ayurveda-light via-ayurveda-cream to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-ayurveda-gold w-20"></div>
              <span className="px-4 text-3xl">🌿</span>
              <div className="h-px bg-ayurveda-gold w-20"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-ayurveda-dark mb-4" style={{ fontFamily: 'serif' }}>
              Ritucharya Guidance
            </h1>
            <p className="text-lg text-amber-700 max-w-3xl mx-auto leading-relaxed">
              Discover the ancient wisdom of seasonal living. Ritucharya teaches us to align our lifestyle, 
              diet, and daily routines with nature's rhythms for optimal health and harmony.
            </p>
          </div>

          {/* What is Ritucharya */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-white to-ayurveda-light rounded-lg shadow-lg p-8 border border-ayurveda-accent mb-12 relative overflow-hidden"
          >
            {/* Traditional border pattern */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ayurveda-gold via-ayurveda-copper to-ayurveda-gold"></div>
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="h-px bg-ayurveda-copper w-16"></div>
                <span className="px-3 text-2xl">🍂</span>
                <div className="h-px bg-ayurveda-copper w-16"></div>
              </div>
              <h2 className="text-2xl font-bold text-ayurveda-dark mb-4" style={{ fontFamily: 'serif' }}>
                What is Ritucharya?
              </h2>
            </div>
            
            <p className="text-amber-700 mb-6 leading-relaxed text-center">
              Ritucharya (ऋतुचर्या) is the Ayurvedic practice of seasonal regimen that helps maintain health 
              by adapting our lifestyle according to the changing seasons. 'Ritu' means season and 'Charya' 
              means regimen or conduct.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center p-6 bg-gradient-to-br from-ayurveda-cream to-ayurveda-sand rounded-lg border border-ayurveda-gold shadow-md hover:shadow-lg transition-all duration-200">
                <div className="text-4xl mb-4 transform hover:scale-110 transition-transform duration-200">🌱</div>
                <h3 className="font-bold text-ayurveda-dark mb-2" style={{ fontFamily: 'serif' }}>Seasonal Diet</h3>
                <p className="text-sm text-amber-700 leading-relaxed">Eat foods that balance seasonal doshas and harmonize with nature's cycles</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-ayurveda-light to-ayurveda-cream rounded-lg border border-ayurveda-copper shadow-md hover:shadow-lg transition-all duration-200">
                <div className="text-4xl mb-4 transform hover:scale-110 transition-transform duration-200">🧘</div>
                <h3 className="font-bold text-ayurveda-dark mb-2" style={{ fontFamily: 'serif' }}>Lifestyle Practices</h3>
                <p className="text-sm text-amber-700 leading-relaxed">Adapt daily routines and activities to seasonal energy patterns</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-ayurveda-sand to-ayurveda-accent rounded-lg border border-ayurveda-turmeric shadow-md hover:shadow-lg transition-all duration-200">
                <div className="text-4xl mb-4 transform hover:scale-110 transition-transform duration-200">⚖️</div>
                <h3 className="font-bold text-ayurveda-dark mb-2" style={{ fontFamily: 'serif' }}>Dosha Balance</h3>
                <p className="text-sm text-amber-700 leading-relaxed">Maintain perfect equilibrium throughout the changing seasons</p>
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
                whileHover={{ y: -5, scale: 1.02 }}
                className={`bg-gradient-to-br ${season.color} rounded-lg shadow-lg p-6 border-2 ${season.borderColor} relative overflow-hidden`}
              >
                {/* Traditional corner decorations */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-ayurveda-gold opacity-60"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-ayurveda-gold opacity-60"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-ayurveda-gold opacity-60"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-ayurveda-gold opacity-60"></div>

                {/* Subtle season icon */}
                <div className="absolute top-3 right-3 text-2xl opacity-50 select-none">
                  {season.icon}
                </div>
                
                <div className="mb-6 relative">
                  <h3 className="text-2xl font-bold text-ayurveda-dark mb-3" style={{ fontFamily: 'serif' }}>
                    {season.name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-ayurveda-gold mr-2">📅</span>
                      <p className="text-amber-700 text-sm font-medium">
                        <strong>Period:</strong> {season.period}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-ayurveda-copper mr-2">⚖️</span>
                      <p className="text-amber-700 text-sm font-medium">
                        <strong>Dominant Dosha:</strong> {season.dosha}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <span className="text-ayurveda-gold mr-2">🌿</span>
                    <h4 className="font-bold text-ayurveda-dark" style={{ fontFamily: 'serif' }}>
                      Lifestyle Recommendations:
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {season.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-amber-700 flex items-start leading-relaxed">
                        <span className="text-ayurveda-primary mr-2 font-bold">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center mb-3">
                    <span className="text-ayurveda-copper mr-2">🍽️</span>
                    <h4 className="font-bold text-ayurveda-dark" style={{ fontFamily: 'serif' }}>
                      Recommended Foods:
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {season.foods.map((food, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-gradient-to-r from-ayurveda-accent to-ayurveda-sand text-xs rounded-full text-ayurveda-dark font-medium border border-ayurveda-gold shadow-sm"
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