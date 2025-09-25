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
              Experience the Sacred Healing of Ayurveda
            </h1>
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-ayurveda-gold w-16"></div>
              <span className="px-4 text-ayurveda-gold text-lg" style={{ fontFamily: 'serif' }}>॥ आयुर्वेद ॥</span>
              <div className="h-px bg-ayurveda-gold w-16"></div>
            </div>
            <p className="text-lg md:text-xl text-amber-50 max-w-3xl mx-auto mb-8 leading-relaxed drop-shadow-lg" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
              Discover ancient wisdom for modern wellness. Ayurveda offers personalized healing through natural remedies, 
              lifestyle guidance, and transformative Panchakarma therapies that detoxify, rejuvenate, and restore balance to your mind, body, and spirit.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/ritucharya" className="btn-primary text-lg px-8 py-4 flex items-center justify-center">
                <span className="mr-2">🌿</span>
                Explore Ritucharya
              </Link>
              <Link to="/login" className="bg-gradient-to-r from-ayurveda-gold to-ayurveda-turmeric hover:from-ayurveda-turmeric hover:to-ayurveda-gold text-ayurveda-dark font-semibold py-3 px-8 rounded-lg transition-all duration-200 text-lg flex items-center justify-center">
                <span className="mr-2">📋</span>
                Book Free Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sacred Healing Centers Section */}
      <section className="py-16 bg-gradient-to-br from-ayurveda-light via-ayurveda-cream to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-ayurveda-copper w-20"></div>
              <span className="px-4 text-3xl">🏢</span>
              <div className="h-px bg-ayurveda-copper w-20"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ayurveda-dark mb-4" style={{ fontFamily: 'serif' }}>
               Healing Centers
            </h2>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto">
              Connect with authenticated Ayurvedic practitioners and certified wellness centers blessed by ancient wisdom
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
                  className="bg-gradient-to-br from-white via-ayurveda-light to-ayurveda-cream rounded-lg shadow-lg p-6 border border-ayurveda-accent group cursor-pointer relative overflow-hidden"
                >
                  {/* Traditional border pattern */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ayurveda-gold via-ayurveda-copper to-ayurveda-gold"></div>
                  
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-ayurveda-gold mr-2">🏢</span>
                        <h3 className="text-xl font-semibold text-ayurveda-dark" style={{ fontFamily: 'serif' }}>
                          {center.name}
                        </h3>
                      </div>
                      <p className="text-amber-700 flex items-center">
                        <span className="mr-1">📍</span>
                        {center.location}
                      </p>
                    </div>
                    {center.verified && (
                      <div className="flex items-center bg-gradient-to-r from-ayurveda-gold to-ayurveda-turmeric text-ayurveda-dark px-3 py-1 rounded-full text-sm font-medium shadow-md">
                        <span className="mr-1">ॐ</span>
                        Verified
                      </div>
                    )}
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="w-full bg-gradient-to-r from-ayurveda-primary to-ayurveda-dark hover:from-ayurveda-dark hover:to-ayurveda-earth text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center">
                      <span className="mr-2">🔍</span>
                      View Sacred Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sacred Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative">
        {/* Traditional pattern background */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B5A3C' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-ayurveda-gold w-24"></div>
              <span className="px-6 text-4xl">🌿</span>
              <div className="h-px bg-ayurveda-gold w-24"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ayurveda-dark mb-6" style={{ fontFamily: 'serif' }}>
              Why Choose Ayurveda?
            </h2>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto">
              Embrace the timeless wisdom of Ayurveda, where each treatment is a sacred journey toward perfect health and harmony
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
            {
                title: 'Personalized Dosha Analysis',
                description: 'Sacred constitutional assessment based on your unique Vata, Pitta, Kapha balance for perfectly customized healing',
                icon: '🎯',
                bgColor: 'from-ayurveda-cream to-ayurveda-sand',
                borderColor: 'border-ayurveda-gold'
              },
              {
                title: 'Sacred Natural Healing',
                description: 'Pure chemical-free treatments using blessed herbs, therapeutic oils, and time-tested traditional methods',
                icon: '🌿',
                bgColor: 'from-ayurveda-light to-ayurveda-cream',
                borderColor: 'border-ayurveda-sage'
              },
              {
                title: 'Complete Life Balance',
                description: 'Address root causes for perfect harmony of mind, body, and soul through ancient Ayurvedic wisdom',
                icon: '⚖️',
                bgColor: 'from-ayurveda-sand to-ayurveda-accent',
                borderColor: 'border-ayurveda-copper'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className={`text-center p-8 rounded-xl bg-gradient-to-br ${benefit.bgColor} border-2 ${benefit.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
              >
                {/* Traditional corner decorations */}
                <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-ayurveda-gold opacity-50"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-ayurveda-gold opacity-50"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-ayurveda-gold opacity-50"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-ayurveda-gold opacity-50"></div>
                
                <div className="relative">
                  <div className="text-5xl mb-6 transform hover:scale-110 transition-transform duration-300">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-ayurveda-dark mb-4" style={{ fontFamily: 'serif' }}>
                    {benefit.title}
                  </h3>
                  <p className="text-amber-700 leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  {/* Sacred dot pattern */}
                  <div className="flex justify-center mt-4 space-x-1">
                    <div className="w-2 h-2 rounded-full bg-ayurveda-gold opacity-60"></div>
                    <div className="w-1 h-1 rounded-full bg-ayurveda-copper opacity-40 mt-0.5"></div>
                    <div className="w-2 h-2 rounded-full bg-ayurveda-gold opacity-60"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;