import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from '../context/AuthContext';
import PatientList from '../components/practitioner/PatientList';
import AppointmentList from '../components/practitioner/AppointmentList';
import TherapyForm from '../components/practitioner/TherapyForm';
import ResourceUpload from '../components/practitioner/ResourceUpload';
import PatientHistory from '../components/practitioner/PatientHistory';
import SeasonalIntelligence from '../components/practitioner/SeasonalIntelligence';
import { CalendarIcon, ClipboardDocumentCheckIcon, UserGroupIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// TODO: replace PRACTITIONER_ID with AuthContext user id
const PRACTITIONER_ID = 4;

function listFromModule(mod, preferredKeys = ["users", "data", "list", "default"]) {
  if (!mod || typeof mod !== "object") return [];
  for (const k of preferredKeys) {
    const v = mod[k];
    if (Array.isArray(v)) return v;
  }
  const def = mod.default;
  if (Array.isArray(def)) return def;
  return [];
}

const PractitionerDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [therapyNotes, setTherapyNotes] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [recentFilter, setRecentFilter] = useState("today");
  const [activeTab, setActiveTab] = useState('dashboard');

  // Helpers
  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  // Mock user data
  const users = useMemo(() => [
    { id: 1, name: 'Esha Gupta' },
    { id: 2, name: 'Vikram Singh' },
    { id: 3, name: 'Bob Verma' },
    { id: 4, name: 'Rahul Kapoor' },
    { id: 5, name: 'Priya Nair' }
  ], []);
  const userIndex = useMemo(() => new Map(users.map((u) => [String(u.id ?? u._id), u])), [users]);

  // Load appointments data (same logic as original)
  const loadAppointments = () => {
    try {
      const today = new Date();
      const mockAppointments = [
        { id: 101, patientName: 'Esha Gupta', patientId: 1, therapy: 'Kizhi', date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30).toISOString(), status: 'confirmed', practitionerId: PRACTITIONER_ID },
        { id: 102, patientName: 'Vikram Singh', patientId: 2, therapy: 'Udwarthanam', date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 30).toISOString(), status: 'confirmed', practitionerId: PRACTITIONER_ID },
        { id: 103, patientName: 'Bob Verma', patientId: 3, therapy: 'Shirodhara', date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 30).toISOString(), status: 'pending', practitionerId: PRACTITIONER_ID },
        { id: 104, patientName: 'Rahul Kapoor', patientId: 4, therapy: 'Abhyanga', date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0).toISOString(), status: 'confirmed', practitionerId: PRACTITIONER_ID }
      ];
      
      const patientBookings = JSON.parse(localStorage.getItem('practitionerAppointments') || '[]');
      console.log('Loading patient bookings:', patientBookings);
      
      const convertedBookings = patientBookings.map(booking => {
        try {
          let bookingDate;
          if (booking.date && booking.time) {
            const dateTimeString = `${booking.date} ${booking.time}`;
            bookingDate = new Date(dateTimeString);
            
            if (isNaN(bookingDate.getTime())) {
              const isoTimeString = convertTimeToISO(booking.time);
              bookingDate = new Date(`${booking.date}T${isoTimeString}`);
            }
          } else {
            bookingDate = new Date();
          }
        
          return {
            id: booking.id,
            patientName: booking.patientName || 'Unknown Patient',
            patientId: booking.patientId || Math.random().toString(36).substr(2, 9),
            patientPhone: booking.patientPhone,
            patientEmail: booking.patientEmail,
            therapy: booking.therapyName || 'Unknown Therapy',
            center: booking.centerName,
            location: booking.centerLocation,
            duration: booking.therapyDuration,
            cost: booking.therapyCost,
            date: bookingDate.toISOString(),
            status: booking.status || 'scheduled',
            specialRequirements: booking.specialRequirements,
            practitionerId: PRACTITIONER_ID,
            type: 'patient_booking'
          };
        } catch (error) {
          console.error('Error converting booking:', booking, error);
          return {
            id: booking.id || Date.now(),
            patientName: booking.patientName || 'Unknown Patient',
            patientId: booking.patientId || 'unknown',
            therapy: booking.therapyName || 'Unknown Therapy',
            date: new Date().toISOString(),
            status: 'scheduled',
            practitionerId: PRACTITIONER_ID,
            type: 'patient_booking_error'
          };
        }
      });
      
      const allAppointments = [...mockAppointments, ...convertedBookings];
      return allAppointments;
    } catch (error) {
      console.error('Error loading appointments:', error);
      return [];
    }
  };

  const convertTimeToISO = (timeString) => {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours);
    
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}:00`;
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const allAppointments = loadAppointments();
        
        const mockNotes = [
          { id: 1, appointmentId: 101, vitals: 'BP:119/77', observations: 'Rested', recommendations: 'Walk 15 mins', createdAt: '2024-09-23T13:49:04Z', practitionerId: PRACTITIONER_ID },
          { id: 2, appointmentId: 102, vitals: 'BP:120/80', observations: 'Relaxed', recommendations: 'Avoid caffeine', createdAt: '2024-09-23T13:49:04Z', practitionerId: PRACTITIONER_ID }
        ];
        
        if (!mounted) return;
        setAppointments(allAppointments);
        setTherapyNotes(mockNotes);
        if (allAppointments.length > 0) {
          const today = new Date();
          const todays = allAppointments.filter((a) => isSameDay(new Date(a.date), today));
          const first = (todays.length > 0 ? todays[0] : allAppointments[0]) || null;
          setSelectedPatientId(first?.patientId ?? null);
          setSelectedAppointmentId(first?.id ?? null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    
    const pollInterval = setInterval(() => {
      if (mounted) {
        const newAppointments = loadAppointments();
        setAppointments(newAppointments);
      }
    }, 2000);
    
    const handleBookingUpdate = () => {
      if (mounted) {
        const newAppointments = loadAppointments();
        setAppointments(newAppointments);
      }
    };
    
    window.addEventListener('patientBookingAdded', handleBookingUpdate);
    
    return () => {
      mounted = false;
      clearInterval(pollInterval);
      window.removeEventListener('patientBookingAdded', handleBookingUpdate);
    };
  }, []);

  const patients = useMemo(() => {
    const unique = new Map();
    for (const a of appointments) {
      const pid = a?.patientId;
      if (pid == null) continue;
      if (!unique.has(String(pid))) {
        const u = userIndex.get(String(pid));
        unique.set(String(pid), {
          id: pid,
          name: a?.patientName ?? u?.name ?? u?.fullName ?? `Patient ${pid}`,
        });
      }
    }
    return Array.from(unique.values());
  }, [appointments, userIndex]);

  const todaysAppointments = useMemo(() => {
    const today = new Date();
    let list = appointments.filter((a) => {
      const appointmentDate = new Date(a.date);
      const isPractitioner = String(a.practitionerId) === String(PRACTITIONER_ID);
      const isToday = isSameDay(appointmentDate, today);
      return isPractitioner && isToday;
    });
    list = list.sort((a, b) => new Date(a.date) - new Date(b.date));
    return list;
  }, [appointments]);

  const selectedAppointment = useMemo(() => {
    return appointments.find((a) => String(a.id) === String(selectedAppointmentId));
  }, [appointments, selectedAppointmentId]);

  const kpis = useMemo(() => {
    const today = new Date();
    const todaysAppointmentsCount = appointments.filter((a) => isSameDay(new Date(a.date), today)).length;
    const nextAppointment = appointments
      .filter((a) => new Date(a.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    const notesForMe = therapyNotes.filter((n) => String(n.practitionerId ?? "") === String(PRACTITIONER_ID));
    return {
      patients: patients.length,
      todaysAppointments: todaysAppointmentsCount,
      completedNotes: notesForMe.length,
      nextAppointment: nextAppointment ? new Date(nextAppointment.date) : null,
    };
  }, [appointments, therapyNotes, patients]);

  const handleNoteCreated = (note) => {
    setTherapyNotes((prev) => [note, ...prev]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-700">Loading your practice dashboard... 🌿</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-amber-900">Practitioner Dashboard</h1>
              <p className="mt-1 text-lg text-amber-700">Welcome back, Dr. {user?.name || 'practitioner'}! Manage your Ayurvedic practice 🌿</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={() => {
                  const newAppointments = loadAppointments();
                  setAppointments(newAppointments);
                }}
                className="bg-gradient-to-r from-amber-200 to-orange-300 text-amber-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm hover:from-amber-300 hover:to-orange-400 transition-all"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg shadow-lg border border-amber-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-amber-800">📅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-amber-700">Today's Sessions</p>
                <p className="text-2xl font-semibold text-amber-900">{kpis.todaysAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg shadow-lg border border-amber-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-amber-300 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-orange-700">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-amber-700">Total Patients</p>
                <p className="text-2xl font-semibold text-amber-900">{kpis.patients}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg shadow-lg border border-amber-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-yellow-700">📝</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-amber-700">Notes Written</p>
                <p className="text-2xl font-semibold text-amber-900">{kpis.completedNotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg shadow-lg border border-amber-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-amber-800">⭐</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-amber-700">Practice Rating</p>
                <p className="text-2xl font-semibold text-amber-900">4.8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg shadow-lg border border-amber-200 mb-8">
          <div className="border-b border-amber-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'dashboard', label: 'Today\'s Schedule', icon: '📋' },
                { id: 'patients', label: 'Patient Management', icon: '👥' },
                { id: 'notes', label: 'Session Notes', icon: '📝' },
                { id: 'seasonal', label: 'Seasonal Wisdom', icon: '🌿' },
                { id: 'analytics', label: 'Practice Analytics', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-700 bg-gradient-to-t from-amber-100 to-transparent'
                      : 'border-transparent text-amber-600 hover:text-amber-800 hover:border-amber-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div>
                <h3 className="text-lg font-medium text-amber-900 mb-6">Today's Schedule & Quick Actions</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Today's Appointments */}
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                      <h4 className="text-lg font-semibold text-amber-900 mb-4">Today's Appointments</h4>
                      
                      <div className="space-y-3">
                        {todaysAppointments.map((appointment, idx) => {
                          const patient = userIndex.get(String(appointment.patientId));
                          const time = new Date(appointment.date).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit', 
                            hour12: true 
                          });
                          
                          const statusColors = {
                            confirmed: 'bg-green-100 text-green-800 border-green-200',
                            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                            completed: 'bg-amber-100 text-amber-800 border-amber-200'
                          };
                          
                          return (
                            <div
                              key={appointment.id}
                              className={`flex items-center justify-between rounded-lg border p-4 transition-all cursor-pointer hover:shadow-md ${
                                String(selectedAppointmentId) === String(appointment.id)
                                  ? 'border-amber-400 bg-gradient-to-r from-amber-100 to-orange-100 shadow-sm'
                                  : 'border-amber-200 bg-white hover:border-amber-300 hover:bg-amber-50'
                              }`}
                              onClick={() => {
                                setSelectedAppointmentId(appointment.id);
                                setSelectedPatientId(appointment.patientId);
                              }}
                            >
                              <div className="flex items-center gap-4">
                                <div className="text-sm font-medium text-amber-700">{time}</div>
                                <div>
                                  <div className="font-medium text-amber-900">
                                    {patient?.name || appointment.patientName}
                                  </div>
                                  <div className="text-sm text-amber-600">{appointment.therapy}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusColors[appointment.status]}`}>
                                  {appointment.status}
                                </span>
                                <button 
                                  className="text-amber-700 hover:text-amber-800 text-sm font-medium"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPatientId(appointment.patientId);
                                    setHistoryOpen(true);
                                  }}
                                >
                                  View
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        
                        {todaysAppointments.length === 0 && (
                          <div className="py-12 text-center">
                            <span className="text-6xl mb-4 block">🧘‍♀️</span>
                            <h3 className="text-sm font-medium text-amber-900">No appointments today</h3>
                            <p className="text-sm text-amber-600">Perfect day for practice preparation!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                      <h4 className="text-lg font-semibold text-amber-900 mb-4">Quick Actions</h4>
                      
                      <div className="space-y-3">
                        <button 
                          className="w-full rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 p-3 text-left text-white hover:from-amber-700 hover:to-orange-700 transition-all shadow-md"
                          onClick={() => {
                            if (selectedAppointment) {
                              setActiveTab('notes');
                            } else {
                              alert('Please select an appointment first to add notes.');
                            }
                          }}
                        >
                          <div className="font-medium">📝 Add Patient Notes</div>
                        </button>
                        
                        <button 
                          className="w-full rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 p-3 text-left text-white hover:from-orange-700 hover:to-amber-700 transition-all shadow-md"
                          onClick={() => {
                            alert('Schedule Appointment feature coming soon!');
                          }}
                        >
                          <div className="font-medium">📅 Schedule Appointment</div>
                        </button>
                        
                        <button 
                          className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 p-3 text-left text-white hover:from-amber-600 hover:to-yellow-600 transition-all shadow-md"
                          onClick={() => {
                            if (selectedPatientId) {
                              setHistoryOpen(true);
                            } else {
                              alert('Please select a patient first to view their history.');
                            }
                          }}
                        >
                          <div className="font-medium">🔍 View Patient History</div>
                        </button>
                      </div>
                    </div>

                    {/* Today's Stats */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                      <h4 className="text-lg font-semibold text-amber-900 mb-4">Today's Summary</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-amber-700">Sessions Scheduled</div>
                          <div className="font-medium text-amber-900">{todaysAppointments.length}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-amber-700">Completed</div>
                          <div className="font-medium text-amber-900">{todaysAppointments.filter(a => a.status === 'completed').length}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-amber-700">Pending</div>
                          <div className="font-medium text-amber-900">{todaysAppointments.filter(a => a.status === 'pending').length}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'patients' && (
              <div>
                <h3 className="text-lg font-medium text-amber-900 mb-6">Patient Management</h3>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                  <PatientList 
                    patients={patients} 
                    selectedPatientId={selectedPatientId}
                    onSelect={setSelectedPatientId}
                    onDetails={(patientId) => {
                      setSelectedPatientId(patientId);
                      setHistoryOpen(true);
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="max-w-4xl">
                <h3 className="text-lg font-medium text-amber-900 mb-6">Session Notes & Patient Records</h3>
                
                {selectedAppointment && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200 mb-6">
                    <h4 className="text-lg font-semibold text-amber-900 mb-4">
                      Add Note for {userIndex.get(String(selectedAppointment.patientId))?.name || selectedAppointment.patientName}
                    </h4>
                    <TherapyForm
                      appointment={selectedAppointment}
                      practitionerId={PRACTITIONER_ID}
                      onNoteCreated={handleNoteCreated}
                    />
                  </div>
                )}

                {!selectedAppointment && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200 text-center">
                    <span className="text-6xl mb-4 block">📝</span>
                    <h4 className="text-lg font-medium text-amber-900 mb-2">Select an Appointment</h4>
                    <p className="text-amber-700">Choose an appointment from today's schedule to add session notes.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seasonal' && (
              <div className="max-w-4xl">
                <h3 className="text-lg font-medium text-amber-900 mb-6">Seasonal Intelligence & Weather Wisdom 🌿</h3>
                <div className="mb-4">
                  <p className="text-sm text-amber-700 mb-6">
                    Ayurveda teaches us that health is deeply connected to natural cycles. 
                    Use this intelligence to adjust treatments based on current season, weather, and lunar phases.
                  </p>
                </div>
                <SeasonalIntelligence practitionerId={PRACTITIONER_ID} />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-medium text-amber-900 mb-6">Practice Analytics & Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                    <h4 className="text-lg font-semibold text-amber-900 mb-4">This Month</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-amber-700">Total Consultations</div>
                        <div className="font-medium text-amber-900">45</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-amber-700">Panchakarma Sessions</div>
                        <div className="font-medium text-amber-900">28</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-amber-700">Follow-ups</div>
                        <div className="font-medium text-amber-900">18</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-amber-700">Revenue</div>
                        <div className="font-medium text-amber-900">₹1,25,000</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                    <h4 className="text-lg font-semibold text-amber-900 mb-4">Popular Therapies</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-amber-700">Abhyanga</div>
                        <div className="text-sm font-medium text-amber-900">32%</div>
                      </div>
                      <div className="w-full bg-amber-200 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full" style={{width: '32%'}}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-amber-700">Shirodhara</div>
                        <div className="text-sm font-medium text-amber-900">28%</div>
                      </div>
                      <div className="w-full bg-amber-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{width: '28%'}}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-amber-700">Kizhi</div>
                        <div className="text-sm font-medium text-amber-900">24%</div>
                      </div>
                      <div className="w-full bg-amber-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{width: '24%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patient History Drawer */}
      <PatientHistory
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        patient={selectedPatientId ? userIndex.get(String(selectedPatientId)) : null}
        appointments={appointments.filter((a) => String(a.patientId) === String(selectedPatientId))}
        therapyNotes={therapyNotes.filter((n) =>
          appointments.some((a) => String(a.patientId) === String(selectedPatientId) && String(a.id) === String(n.appointmentId))
        )}
        feedback={[]}
      />

      {/* Custom Styles for Consistent Theme */}
      <style jsx>{`
        .animate-shimmer {
          background: linear-gradient(90deg, #f3e8d3 25%, #e6d3b7 50%, #f3e8d3 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PractitionerDashboard;
