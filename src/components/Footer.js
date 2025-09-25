import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-ayurveda-dark via-ayurveda-earth to-ayurveda-primary text-ayurveda-light py-12 relative overflow-hidden">
      {/* Traditional pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFD700' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046 8.954-20 20-20v40c-11.046 0-20-8.954-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-md overflow-hidden bg-white/90 flex items-center justify-center shadow-lg">
                <img
                  src="/images/logo/ayursutra-logo.png"
                  alt="AyurSutra logo"
                  className="w-full h-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="ml-3 text-xl font-bold text-ayurveda-gold" style={{ fontFamily: 'serif' }}>
                AyurSutra
              </span>
            </div>
            <p className="text-ayurveda-accent text-sm leading-relaxed">
              Experience authentic Ayurvedic healing with verified practitioners and personalized treatments blessed by ancient wisdom.
            </p>
            
            {/* Traditional divider */}
            <div className="flex items-center mt-4">
              <div className="h-px bg-ayurveda-gold w-12"></div>
              <span className="px-2 text-ayurveda-gold text-sm">॥</span>
              <div className="h-px bg-ayurveda-gold w-12"></div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-ayurveda-gold" style={{ fontFamily: 'serif' }}>
              📞 Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-ayurveda-gold rounded-full flex items-center justify-center mr-3">
                  <span className="text-ayurveda-dark text-sm">📧</span>
                </div>
                <div>
                  <p className="text-ayurveda-accent text-sm font-medium">info@ayursutra.com</p>
                  <p className="text-ayurveda-light text-xs opacity-75">Healing inquiries</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-ayurveda-copper rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">📞</span>
                </div>
                <div>
                  <p className="text-ayurveda-accent text-sm font-medium">+1 (555) 123-4567</p>
                  <p className="text-ayurveda-light text-xs opacity-75">24/7 wellness support</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-ayurveda-turmeric rounded-full flex items-center justify-center mr-3">
                  <span className="text-ayurveda-dark text-sm">📍</span>
                </div>
                <div>
                  <p className="text-ayurveda-accent text-sm font-medium">Wellness Centers</p>
                  <p className="text-ayurveda-light text-xs opacity-75">Multiple locations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-ayurveda-secondary transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-ayurveda-secondary transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-ayurveda-secondary transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Ayurveda Wellness. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;