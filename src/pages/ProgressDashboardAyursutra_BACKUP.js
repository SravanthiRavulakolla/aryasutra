// frontend/src/pages/patient/ProgressDashboard.js
import React, { useState, useEffect } from 'react';
import ProgressGraph from '../components/patient/ProgressGraph';
import ChatBot from '../components/patient/ChatBot';
import WellnessTips from '../components/patient/WellnessTips';
import UpcomingAppointments from '../components/patient/UpcomingAppointments';
import PatientSeasonalWellness from '../components/patient/PatientSeasonalWellness';

const ProgressDashboardAyursutra = () => {
  const [progressData, setProgressData] = useState(null);
  const [therapyLogs, setTherapyLogs] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({
    symptomSeverity: 5,
    notes: '',
    therapyType: 'General'
  });
  const [loading, setLoading] = useState(true);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const patientId = 1; // Mock patient ID

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/therapy-notes/${patientId}`);
      const data = await response.json();
      if (data.success) {
        setProgressData(data.data);
        setTherapyLogs(data.data.therapyLogs || []);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
      // Fallback to mock data
      setProgressData({
        currentTherapy: 'Panchakarma Detox Program',
        totalSessions: 14,
        completedSessions: 8,
        nextAppointment: '2024-01-25',
        progressPercentage: 57,
        symptomSeverity: [
          { session: 1, severity: 8, date: '2024-01-10' },
          { session: 2, severity: 7, date: '2024-01-12' },
          { session: 3, severity: 6, date: '2024-01-14' },
          { session: 4, severity: 5, date: '2024-01-16' },
          { session: 5, severity: 4, date: '2024-01-18' },
          { session: 6, severity: 4, date: '2024-01-20' },
          { session: 7, severity: 3, date: '2024-01-22' },
          { session: 8, severity: 2, date: '2024-01-24' },
        ],
        achievements: [
          { id: 1, title: 'First Week Complete', icon: '🎯', earned: true },
          { id: 2, title: 'Consistency Champion', icon: '⭐', earned: true },
          { id: 3, title: 'Halfway Hero', icon: '🏆', earned: true },
          { id: 4, title: 'Wellness Warrior', icon: '🌟', earned: false },
        ]
      });
      setTherapyLogs([
        {
          id: 1,
          date: '2024-01-24',
          therapyType: 'Abhyanga',
          practitionerNotes: 'Patient responded well to sesame oil massage. Vata dosha balancing observed.',
          patientFeedback: 'Felt deeply relaxed and energized'
        },
        {
          id: 2,
          date: '2024-01-22',
          therapyType: 'Shirodhara',
          practitionerNotes: 'Continuous oil pouring on forehead for 30 minutes. Good stress relief.',
          patientFeedback: 'Mind felt calm, improved sleep quality'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);

    try {
      const response = await fetch('/api/therapy-notes/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...feedbackForm,
          patientId
        })
      });

      const data = await response.json();
      if (data.success) {
        // Add new log entry to the top of the list
        const newLog = {
          id: therapyLogs.length + 1,
          date: new Date().toISOString().split('T')[0],
          therapyType: feedbackForm.therapyType,
          practitionerNotes: 'Patient feedback recorded',
          patientFeedback: feedbackForm.notes
        };
        setTherapyLogs(prev => [newLog, ...prev]);

        // Reset form
        setFeedbackForm({
          symptomSeverity: 5,
          notes: '',
          therapyType: 'General'
        });

        // Reload progress data to update charts
        loadProgressData();

        alert('Feedback submitted successfully! 🌿');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Progress Dashboard</h1>
          <p className="text-amber-700">Track your Panchakarma journey and wellness progress 🌿</p>
        </div>

        {/* Progress Overview Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl shadow-lg border border-amber-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-200 to-yellow-300 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="font-semibold text-amber-900">{progressData?.currentTherapy}</h3>
              <p className="text-sm text-amber-700 mt-1">Current Therapy</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-200 to-amber-300 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <span className="text-2xl font-bold text-amber-800">{progressData?.totalSessions}</span>
              </div>
              <h3 className="font-semibold text-amber-900">Total Sessions</h3>
              <p className="text-sm text-amber-700 mt-1">Recommended</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-200 to-amber-300 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <span className="text-2xl font-bold text-amber-800">{progressData?.completedSessions}</span>
              </div>
              <h3 className="font-semibold text-amber-900">Completed</h3>
              <p className="text-sm text-amber-700 mt-1">Sessions Done</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-200 to-yellow-300 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="font-semibold text-amber-900">{progressData?.nextAppointment}</h3>
              <p className="text-sm text-amber-700 mt-1">Next Appointment</p>
            </div>
          </div>

          {/* Achievements */}
          <div className="mt-6 pt-6 border-t border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-4">Achievements 🏆</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {progressData?.achievements?.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`text-center p-3 rounded-lg border-2 transition-all shadow-sm ${
                    achievement.earned
                      ? 'border-amber-300 bg-gradient-to-br from-yellow-100 to-amber-100'
                      : 'border-amber-200 bg-amber-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{achievement.earned ? achievement.icon : '🔒'}
                  </div>
                  <p className={`text-xs font-medium ${
                    achievement.earned ? 'text-amber-800' : 'text-amber-600'
                  }`}>
                    {achievement.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Progress & Feedback */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Graph */}
            {progressData && (
              <div className="bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden">
                <ProgressGraph progressData={progressData} />
              </div>
            )}

            {/* Feedback Form */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl shadow-lg border border-amber-200 p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4">Share Your Feedback 📝</h3>
              <form onSubmit={handleFeedbackSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      Therapy Type
                    </label>
                    <select
                      value={feedbackForm.therapyType}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, therapyType: e.target.value }))}
                      className="w-full border border-amber-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="General">General</option>
                      <option value="Abhyanga">Abhyanga</option>
                      <option value="Shirodhara">Shirodhara</option>
                      <option value="Pizhichil">Pizhichil</option>
                      <option value="Kizhi">Kizhi</option>
                      <option value="Udwarthanam">Udwarthanam</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      Symptom Severity: {feedbackForm.symptomSeverity}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={feedbackForm.symptomSeverity}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, symptomSeverity: e.target.value }))}
                      className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-amber-600 mt-1">
                      <span>Minimal</span>
                      <span>Moderate</span>
                      <span>Severe</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-amber-800 mb-2">
                    How are you feeling today?
                  </label>
                  <textarea
                    value={feedbackForm.notes}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Share your experience, any side effects, improvements, or concerns..."
                    className="w-full border border-amber-300 rounded-lg px-3 py-2 h-20 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit Feedback 🌿'}
                </button>
              </form>
            </div>

            {/* Therapy Logs */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl shadow-lg border border-amber-200 p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4">Therapy Logs 📋</h3>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {therapyLogs.map((log) => (
                  <div key={log.id} className="bg-white border border-amber-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-amber-300">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <span className="bg-gradient-to-r from-amber-200 to-yellow-300 text-amber-900 text-xs font-medium px-2 py-1 rounded">
                          {log.therapyType}
                        </span>
                        <span className="text-sm text-amber-600 ml-3">{log.date}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-amber-800 mb-1">Practitioner Notes:</h4>
                      <p className="text-sm text-amber-700">{log.practitionerNotes}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-amber-800 mb-1">Your Feedback:</h4>
                      <p className="text-sm text-amber-700 italic">"{log.patientFeedback}"</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {therapyLogs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-4 block">📋</span>
                  <p>No therapy logs yet. Complete a session to see your progress here!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar with Chat, Tips & Appointments */}
          <div className="space-y-6">
            {/* Seasonal Wellness Guidance */}
            <PatientSeasonalWellness 
              patientId={patientId}
            />
            
            {/* Chat Assistant */}
            <ChatBot patientId={patientId} />
            
            {/* Wellness Tips */}
            <WellnessTips />
            
            {/* Upcoming Appointments */}
            <UpcomingAppointments />
          </div>
        </div>
      </div>

      {/* Note: Using docked chatbot in sidebar instead of floating version */}

      {/* Custom Styles for Slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #d97706, #f59e0b);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #d97706, #f59e0b);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default ProgressDashboardAyursutra;
