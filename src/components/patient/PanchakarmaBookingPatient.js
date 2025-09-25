import React, { useState } from "react";

// Mock data for Panchakarma centers, therapies, and slots (integrated from panchakarmaData.js)
const centers = [
  {
    id: 1,
    name: "Ayush Panchakarma Center",
    location: "Delhi",
    therapies: [
      {
        id: 101,
        name: "Abhyanga",
        description: "Abhyanga is a deeply relaxing, synchronized full-body massage using warm medicated herbal oils tailored to your body constitution (Dosha). It improves blood circulation, nourishes skin and muscles, relieves joint stiffness, and helps release toxins stored in tissues. Regular sessions promote sound sleep, reduce stress, and enhance overall vitality.",
        duration: 60,
        cost: 1500,
        image: "/images/therapies/abhyanga.jpg"
      },
      {
        id: 102,
        name: "Shirodhara",
        description: "Shirodhara involves the continuous pouring of warm, medicated oil (or buttermilk) on the forehead in a rhythmic manner. It is highly effective for calming the nervous system, treating insomnia, anxiety, migraines, and stress-related disorders. Patients often describe the experience as meditative, leaving them with profound relaxation and mental clarity.",
        duration: 45,
        cost: 2000,
        image: "/images/therapies/shirodhara.jpg"
      },
      {
        id: 103,
        name: "Meditation",
        description: "Meditation is a guided mental practice designed to bring balance to the mind and body. Through focused breathing, mindfulness, and relaxation techniques, patients experience reduced stress, improved emotional stability, and enhanced concentration. Regular meditation sessions are known to lower blood pressure, improve sleep quality, and support mental well-being. It is often recommended as a complementary therapy to Panchakarma treatments, amplifying the benefits of detoxification and rejuvenation.",
        duration: 30,
        cost: 800,
        image: "/images/therapies/meditation.jpg"
      },
    ],
  },
  {
    id: 2,
    name: "Kerala Ayurveda Retreat",
    location: "Kochi",
    therapies: [
      {
        id: 201,
        name: "Virechana",
        description: "Virechana is a Panchakarma cleansing therapy aimed at detoxifying the liver and intestines through controlled purgation. Natural herbal formulations are administered to expel accumulated Pitta toxins. It is recommended for chronic skin diseases, digestive issues, liver disorders, and metabolic imbalances. The therapy is supervised by physicians to ensure safety and effectiveness.",
        duration: 90,
        cost: 2500,
        image: "/images/therapies/virechana.jpg"
      },
      {
        id: 202,
        name: "Abhyanga",
        description: "Abhyanga is a deeply relaxing, synchronized full-body massage using warm medicated herbal oils tailored to your body constitution (Dosha). It improves blood circulation, nourishes skin and muscles, relieves joint stiffness, and helps release toxins stored in tissues. Regular sessions promote sound sleep, reduce stress, and enhance overall vitality.",
        duration: 60,
        cost: 1600,
        image: "/images/therapies/abhyanga.jpg"
      },
      {
        id: 203,
        name: "Shirodhara",
        description: "Shirodhara involves the continuous pouring of warm, medicated oil (or buttermilk) on the forehead in a rhythmic manner. It is highly effective for calming the nervous system, treating insomnia, anxiety, migraines, and stress-related disorders. Patients often describe the experience as meditative, leaving them with profound relaxation and mental clarity.",
        duration: 45,
        cost: 2100,
        image: "/images/therapies/shirodhara.jpg"
      },
    ],
  },
  {
    id: 3,
    name: "Himalayan Wellness Spa",
    location: "Dehradun",
    therapies: [
      {
        id: 301,
        name: "Meditation",
        description: "Meditation is a guided mental practice designed to bring balance to the mind and body. Through focused breathing, mindfulness, and relaxation techniques, patients experience reduced stress, improved emotional stability, and enhanced concentration. Regular meditation sessions are known to lower blood pressure, improve sleep quality, and support mental well-being. It is often recommended as a complementary therapy to Panchakarma treatments, amplifying the benefits of detoxification and rejuvenation.",
        duration: 40,
        cost: 900,
        image: "/images/therapies/meditation.jpg"
      },
      {
        id: 302,
        name: "Virechana",
        description: "Virechana is a Panchakarma cleansing therapy aimed at detoxifying the liver and intestines through controlled purgation. Natural herbal formulations are administered to expel accumulated Pitta toxins. It is recommended for chronic skin diseases, digestive issues, liver disorders, and metabolic imbalances. The therapy is supervised by physicians to ensure safety and effectiveness.",
        duration: 90,
        cost: 2600,
        image: "/images/therapies/virechana.jpg"
      },
    ],
  },
];

const therapyTypes = [
  "Abhyanga",
  "Shirodhara",
  "Virechana",
  "Meditation",
];

const slots = [
  "9:00 AM",
  "11:00 AM",
  "3:00 PM",
  "5:00 PM",
];

const PanchakarmaBookingPatient = ({ user }) => {
  const [search, setSearch] = useState("");
  const [therapyFilter, setTherapyFilter] = useState("");
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedTherapy, setSelectedTherapy] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    specialRequirements: ''
  });

  // Filter centers by search and therapy
  const filteredCenters = centers.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(search.toLowerCase()) ||
      center.location.toLowerCase().includes(search.toLowerCase());
    const matchesTherapy =
      !therapyFilter ||
      center.therapies.some((t) => t.name === therapyFilter);
    return matchesSearch && matchesTherapy;
  });

  // Handle proceed to booking form
  const handleProceedToBooking = () => {
    setShowBookingForm(true);
  };

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    if (!patientDetails.name || !patientDetails.phone || !selectedDate || !selectedSlot) {
      alert('Please fill in all required fields');
      return;
    }

    // Create booking object
    const bookingData = {
      id: Date.now(),
      patientName: patientDetails.name,
      patientPhone: patientDetails.phone,
      patientEmail: patientDetails.email,
      patientId: user?.id || 'guest',
      centerName: selectedCenter.name,
      centerLocation: selectedCenter.location,
      therapyName: selectedTherapy.name,
      therapyDuration: selectedTherapy.duration,
      therapyCost: selectedTherapy.cost,
      date: selectedDate,
      time: selectedSlot,
      specialRequirements: patientDetails.specialRequirements,
      status: 'scheduled',
      bookingDate: new Date().toISOString(),
      type: 'patient_booking'
    };

    // Store in localStorage for practitioner dashboard to access
    const existingAppointments = JSON.parse(localStorage.getItem('practitionerAppointments') || '[]');
    const updatedAppointments = [bookingData, ...existingAppointments];
    localStorage.setItem('practitionerAppointments', JSON.stringify(updatedAppointments));

    // Dispatch custom event to notify practitioner dashboard
    window.dispatchEvent(new CustomEvent('patientBookingAdded', { detail: bookingData }));
    
    console.log('Booking saved:', bookingData); // Debug log
    console.log('All appointments:', updatedAppointments); // Debug log

    // Show confirmation
    setBookingConfirmed(true);
    setShowBookingForm(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setBookingConfirmed(false);
      setSelectedCenter(null);
      setSelectedTherapy(null);
      setSelectedSlot("");
      setSelectedDate("");
      setPatientDetails({
        name: user?.name || '',
        phone: '',
        email: user?.email || '',
        specialRequirements: ''
      });
    }, 3000);
  };

  // Handle patient details change
  const handlePatientDetailsChange = (field, value) => {
    setPatientDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b mb-6 -mx-4 px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Panchakarma Centers
            </h1>
            {/* Search Bar */}
            <div className="relative w-1/3">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search centers..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!selectedCenter && (
          <div className="space-y-4">
            {filteredCenters.map((center) => (
              <div
                key={center.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 cursor-pointer border border-gray-100"
                onClick={() => setSelectedCenter(center)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {center.name}
                    </h2>
                    <div className="flex items-center text-gray-600 mb-3">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {center.location}
                    </div>
                    <p className="text-sm text-gray-500">
                      {center.therapies.length} therapies available
                    </p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3">
                    <div className="text-amber-600 font-medium">
                      Starting from
                      <div className="text-lg">
                        ₹{Math.min(...center.therapies.map(t => t.cost))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredCenters.length === 0 && (
              <div className="text-center py-10">
                <div className="text-gray-400 text-lg">No centers found</div>
              </div>
            )}
          </div>
        )}

        {/* Therapies for Selected Center */}
        {selectedCenter && !selectedTherapy && (
          <div className="animate-fadeIn">
            <button
              className="mb-6 flex items-center text-gray-600 hover:text-amber-600 transition-colors"
              onClick={() => setSelectedCenter(null)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Centers
            </button>
            
            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCenter.name}</h2>
              <div className="flex items-center text-gray-600 mb-4">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {selectedCenter.location}
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">Available Therapies</h3>
            <div className="space-y-4">
              {selectedCenter.therapies.map((therapy) => (
                <div
                  key={therapy.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border border-gray-100"
                  onClick={() => setSelectedTherapy(therapy)}
                >
                  <div className="flex gap-4">
                    {/* Small square thumbnail */}
                    <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-amber-50">
                      <img 
                        src={therapy.image || "/images/therapies/default.svg"} 
                        alt={therapy.name} 
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          if (e.target.src.includes('.jpg')) {
                            e.target.src = therapy.image.replace('.jpg', '.svg');
                          } else {
                            e.target.onerror = null;
                            e.target.src = "/images/therapies/default.svg";
                          }
                        }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{therapy.name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{therapy.description}</p>
                        <div className="flex items-center text-gray-500 text-sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {therapy.duration} minutes
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex items-center text-amber-600 font-semibold text-lg">
                          <span className="text-xl">₹</span>
                          {therapy.cost}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Package Details & Booking */}
        {selectedTherapy && (
          <div className="animate-fadeIn">
            <button
              className="mb-6 flex items-center text-gray-600 hover:text-amber-600 transition-colors"
              onClick={() => setSelectedTherapy(null)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Therapies
            </button>

            <div className="bg-white rounded-xl p-8 shadow-sm mb-6 border border-gray-100">
              <div className="flex gap-4 items-start mb-4">
                <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-amber-50">
                  <img 
                    src={selectedTherapy.image || "/images/therapies/default.svg"} 
                    alt={selectedTherapy.name} 
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      if (e.target.src.includes('.jpg')) {
                        e.target.src = selectedTherapy.image.replace('.jpg', '.svg');
                      } else {
                        e.target.onerror = null;
                        e.target.src = "/images/therapies/default.svg";
                      }
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedTherapy.name}</h2>
                </div>
              </div>
              <div className="prose prose-amber mb-4">
                <p className="text-gray-700">
                  {showFullDesc
                    ? selectedTherapy.description
                    : selectedTherapy.description.slice(0, 100) + (selectedTherapy.description.length > 100 ? "..." : "")}
                  {selectedTherapy.description.length > 100 && (
                    <button
                      className="ml-2 text-amber-600 hover:text-amber-700 text-sm font-medium"
                      onClick={() => setShowFullDesc((v) => !v)}
                    >
                      {showFullDesc ? "Show less" : "Read more"}
                    </button>
                  )}
                </p>
              </div>
              
              <div className="flex gap-8 mb-6 text-gray-700">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{selectedTherapy.duration} minutes</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1 text-xl text-amber-600">₹</span>
                  <span className="text-lg font-semibold">{selectedTherapy.cost}</span>
                </div>
              </div>

              {/* Date Picker */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Select Date</h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Slot Picker */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Select Your Preferred Time</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      className={`
                        py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200
                        ${selectedSlot === slot 
                          ? "bg-amber-600 text-white shadow-lg shadow-amber-200" 
                          : "bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                        }
                      `}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Proceed to Booking Button */}
              <button
                className={`
                  w-full md:w-auto px-8 py-3 rounded-lg font-medium transition-all duration-200
                  ${!selectedSlot || !selectedDate 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-200"
                  }
                `}
                disabled={!selectedSlot || !selectedDate}
                onClick={handleProceedToBooking}
              >
                Proceed to Book
              </button>
            </div>

            {/* Patient Details Form Modal */}
            {showBookingForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-md w-full p-6 animate-fadeIn">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Your Booking</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={patientDetails.name}
                        onChange={(e) => handlePatientDetailsChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={patientDetails.phone}
                        onChange={(e) => handlePatientDetailsChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={patientDetails.email}
                        onChange={(e) => handlePatientDetailsChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                      <textarea
                        value={patientDetails.specialRequirements}
                        onChange={(e) => handlePatientDetailsChange('specialRequirements', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        rows="3"
                        placeholder="Any specific requirements or health conditions?"
                      />
                    </div>
                    
                    {/* Booking Summary */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                      <h4 className="font-medium text-amber-800 mb-2">Booking Summary</h4>
                      <div className="text-sm text-amber-700 space-y-1">
                        <p><span className="font-medium">Therapy:</span> {selectedTherapy?.name}</p>
                        <p><span className="font-medium">Center:</span> {selectedCenter?.name}</p>
                        <p><span className="font-medium">Date:</span> {selectedDate}</p>
                        <p><span className="font-medium">Time:</span> {selectedSlot}</p>
                        <p><span className="font-medium">Cost:</span> ₹{selectedTherapy?.cost}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmBooking}
                      className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Confirmation */}
            {bookingConfirmed && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-green-800 animate-fadeIn">
                <div className="font-semibold text-lg mb-2">Booking Confirmed! 🎉</div>
                <p>
                  Your appointment for <span className="font-medium">{selectedTherapy?.name}</span> has been scheduled for{" "}
                  <span className="font-medium">{selectedDate}</span> at <span className="font-medium">{selectedSlot}</span> at{" "}
                  <span className="font-medium">{selectedCenter?.name}</span>.
                </p>
                <p className="mt-2 text-sm">
                  A confirmation will be sent to <span className="font-medium">{patientDetails.phone}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PanchakarmaBookingPatient;