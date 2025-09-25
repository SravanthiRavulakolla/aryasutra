// Improved Progress Dashboard with better structure
import React, { useState, useEffect } from 'react';
import ProgressGraph from '../components/patient/ProgressGraph';
import ChatBot from '../components/patient/ChatBot';
import WellnessTips from '../components/patient/WellnessTips';
import UpcomingAppointments from '../components/patient/UpcomingAppointments';
import PatientSeasonalWellness from '../components/patient/PatientSeasonalWellness';

const ProgressDashboardImproved = () => {
  const [progressData, setProgressData] = useState(null);
  const [therapyLogs, setTherapyLogs] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({
    symptomSeverity: 5,
    notes: '',
    therapyType: 'General'
  });
  const [loading, setLoading] = useState(true);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const patientId = 1;

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      // Mock data for demo - same as original
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
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);

    try {
      // Mock submission
      const newLog = {
        id: therapyLogs.length + 1,
        date: new Date().toISOString().split('T')[0],
        therapyType: feedbackForm.therapyType,
        practitionerNotes: 'Patient feedback recorded',
        patientFeedback: feedbackForm.notes
      };
      setTherapyLogs(prev => [newLog, ...prev]);

      setFeedbackForm({
        symptomSeverity: 5,
        notes: '',
        therapyType: 'General'
      });

      alert('Feedback submitted successfully! 🌿');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-700">Loading your Ayurvedic progress... 🌿</p>
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
              <h1 className="text-3xl font-bold text-amber-900">Progress Dashboard</h1>
              <p className="mt-1 text-lg text-amber-700">Track your Ayurvedic wellness journey 🌿</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="bg-gradient-to-r from-amber-200 to-orange-300 text-amber-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                {progressData?.progressPercentage}% Complete
              </div>
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
                  <span className="text-amber-800 font-bold text-sm">{progressData?.completedSessions}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-amber-700">Sessions Done</p>
                <p className="text-2xl font-semibold text-amber-900">{progressData?.completedSessions}/{progressData?.totalSessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg shadow-lg border border-amber-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-amber-300 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-orange-700 text-lg">📈</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-amber-700">Progress</p>
                <p className="text-2xl font-semibold text-amber-900">{progressData?.progressPercentage}%</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg shadow-lg border border-amber-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-yellow-700 text-lg">📅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-amber-700">Next Visit</p>
                <p className="text-lg font-semibold text-amber-900">{progressData?.nextAppointment}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg shadow-lg border border-amber-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-amber-800 text-lg">🎯</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-amber-700">Current Status</p>
                <p className="text-lg font-semibold text-orange-700">Improving</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg shadow-lg border border-amber-200 mb-8">
          <div className="border-b border-amber-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'progress', label: 'Progress Chart', icon: '📈' },
                { id: 'seasonal', label: 'Seasonal Wisdom', icon: '🌿' },
                { id: 'feedback', label: 'Daily Feedback', icon: '📝' },
                { id: 'history', label: 'Session History', icon: '📋' }
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
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Current Therapy Info */}
                <div>
                  <h3 className="text-lg font-medium text-amber-900 mb-4">Current Therapy</h3>
                  <div className="bg-gradient-to-br from-amber-100 to-orange-200 border border-amber-300 rounded-lg p-4 shadow-inner">
                    <h4 className="text-xl font-semibold text-amber-900">{progressData?.currentTherapy}</h4>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-amber-800">Progress:</span>
                        <span className="font-medium text-amber-900">{progressData?.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-amber-200 rounded-full h-3 shadow-inner">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-3 rounded-full shadow-sm" style={{width: `${progressData?.progressPercentage}%`}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-lg font-medium text-amber-900 mb-4">Achievements 🏆</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {progressData?.achievements?.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-3 rounded-lg border-2 text-center transition-all shadow-sm ${
                          achievement.earned
                            ? 'border-amber-300 bg-gradient-to-br from-yellow-100 to-amber-100'
                            : 'border-amber-200 bg-amber-50'
                        }`}
                      >
                        <div className="text-2xl mb-1">
                          {achievement.earned ? achievement.icon : '🔒'}
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
            )}

            {activeTab === 'progress' && (
              <div>
                <ProgressGraph progressData={progressData} />
              </div>
            )}

            {activeTab === 'seasonal' && (
              <div className="max-w-4xl">
                <h3 className="text-lg font-medium text-amber-900 mb-6">Seasonal Intelligence & Weather Wisdom 🌿</h3>
                <div className="mb-4">
                  <p className="text-sm text-amber-700 mb-6">
                    Ayurveda teaches us that our health is deeply connected to natural cycles. 
                    This personalized guidance adjusts your therapy based on current season, weather, and lunar phases.
                  </p>
                </div>
                <PatientSeasonalWellness patientId={patientId} />
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-medium text-amber-900 mb-6">Daily Wellness Check-in 📝</h3>
                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <option value="Virechana">Virechana</option>
                        <option value="Meditation">Meditation</option>
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

                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      How are you feeling today?
                    </label>
                    <textarea
                      value={feedbackForm.notes}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Share your experience, any improvements, or concerns..."
                      className="w-full border border-amber-300 rounded-lg px-3 py-2 h-24 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {submittingFeedback ? 'Submitting...' : 'Submit Daily Check-in 🌿'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h3 className="text-lg font-medium text-amber-900 mb-6">Session History 📋</h3>
                <div className="space-y-4">
                  {therapyLogs.map((log) => (
                    <div key={log.id} className="bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-amber-300">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="bg-gradient-to-r from-amber-200 to-yellow-300 text-amber-900 text-xs font-medium px-2 py-1 rounded">
                            {log.therapyType}
                          </span>
                          <span className="text-sm text-amber-600">{log.date}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-amber-900 mb-1">Practitioner Notes:</h4>
                          <p className="text-sm text-amber-800">{log.practitionerNotes}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-amber-900 mb-1">Your Feedback:</h4>
                          <p className="text-sm text-amber-800 italic">"{log.patientFeedback}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {therapyLogs.length === 0 && (
                  <div className="text-center py-8 text-amber-600">
                    <span className="text-4xl mb-4 block">📋</span>
                    <p>No session history yet. Complete a session to see your progress here!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional Wellness Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WellnessTips />
          <UpcomingAppointments />
        </div>

        {/* Chat Bot - Fixed Position */}
        <div className="fixed bottom-6 right-6 z-50">
          <ChatBot patientId={patientId} />
        </div>
      </div>
      
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

export default ProgressDashboardImproved;
