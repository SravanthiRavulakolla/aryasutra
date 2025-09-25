import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import ayurvedaImage from './assets/ayurveda2.jpg';

const Home = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenters = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/centers');
        const data = await response.json();
        setCenters(data);
      } catch (error) {
        console.error('Error fetching centers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center" style={{
        backgroundImage: `linear-gradient(rgba(139, 90, 60, 0.6), rgba(212, 165, 116, 0.4)), url(${ayurvedaImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl" style={{ fontFamily: 'serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              Experience the Healing Power of Ayurveda
            </h1>
            <p className="text-lg md:text-xl text-amber-50 max-w-3xl mx-auto mb-8 leading-relaxed drop-shadow-lg" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
              Discover ancient wisdom for modern wellness. Ayurveda offers personalized healing through natural remedies, 
              lifestyle guidance, and transformative Panchakarma therapies that detoxify, rejuvenate, and restore balance to your mind, body, and spirit.
            </p>
            <div className="flex justify-center">
              <Link to="/ritucharya" className="btn-primary text-lg px-8 py-4">
                Explore Ritucharya
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Verified Centers Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted & Verified Therapy Centers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Connect with authenticated Ayurvedic practitioners and certified wellness centers
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader size="large" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {centers.map((center, index) => (
                <motion.div
                  key={center.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="card group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {center.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        📍 {center.location}
                      </p>
                    </div>
                    {center.verified && (
                      <div className="flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-sm">
                        <span className="mr-1">✓</span>
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="w-full bg-ayurveda-primary hover:bg-ayurveda-dark text-white py-2 px-4 rounded-lg transition-colors">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Ayurveda?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Personalized Treatment',
                description: 'Customized therapies based on your unique constitution and health needs',
                icon: '🎯'
              },
              {
                title: 'Natural Healing',
                description: 'Chemical-free treatments using herbs, oils, and traditional methods',
                icon: '🌿'
              },
              {
                title: 'Holistic Wellness',
                description: 'Address root causes for complete mind, body, and spiritual balance',
                icon: '⚖️'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;