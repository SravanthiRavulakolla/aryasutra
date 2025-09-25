import React, { useState, useEffect } from 'react';

export default function PatientSeasonalWellness({ patientId, location: propLocation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt');

  useEffect(() => {
    // Try to get current location if not provided as prop
    if (!propLocation) {
      getCurrentLocation();
    } else {
      setCurrentLocation(propLocation);
    }
  }, [propLocation]);

  useEffect(() => {
    fetchSeasonalGuidance();
    // Refresh every hour for patients (less frequent than practitioners)
    const interval = setInterval(fetchSeasonalGuidance, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [patientId, currentLocation, propLocation]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationPermission('denied');
      setCurrentLocation({ lat: 19.0760, lng: 72.8777, city: 'Mumbai (Default)' });
      return;
    }

    setLocationPermission('requesting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log('Patient location detected:', lat, lng);
        setCurrentLocation({
          lat: lat,
          lng: lng,
          accuracy: position.coords.accuracy,
          city: 'Detecting...'
        });
        setLocationPermission('granted');
      },
      (error) => {
        console.log('Patient geolocation error:', error.message);
        setLocationPermission('denied');
        setCurrentLocation({ lat: 19.0760, lng: 72.8777, city: 'Location unavailable - Using Mumbai' });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const fetchSeasonalGuidance = async () => {
    try {
      setError(null);
      
      // Use current location, prop location, or default
      const coords = currentLocation || propLocation || { lat: 19.0760, lng: 72.8777 };
      const url = `http://localhost:5002/api/seasonal/patient-guidance/${patientId || 1}?lat=${coords.lat}&lng=${coords.lng}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch seasonal guidance:', error);
      setError(error.message);
      // Show mock data on error
      setData(getMockPatientData());
    } finally {
      setLoading(false);
    }
  };

  const getMockPatientData = () => ({
    location: { city: 'Mumbai', country: 'India' },
    weather: { temperature: 28, humidity: 83, condition: 'Clouds', description: 'overcast clouds' },
    season: 'monsoon',
    moonPhase: 'Waxing Crescent',
    guidance: {
      seasonalFocus: 'Digestive Health & Warmth',
      keyMessage: 'During monsoon, focus on keeping warm and supporting your digestive fire.',
      dietaryTips: ['Drink warm ginger tea', 'Eat warm, cooked meals'],
      lifestyleTips: ['Keep dry and warm', 'Practice indoor yoga'],
      selfCareTips: ['Use sesame oil massage', 'Practice breathing exercises'],
      whatToAvoid: ['Cold foods', 'Getting wet in rain']
    },
    explanation: 'Your treatments are being adjusted for monsoon season to support your digestive health.',
    dailyTips: {
      morning: ['Start with warm ginger water', 'Practice gentle yoga'],
      afternoon: ['Have warm, light meals', 'Stay dry'],
      evening: ['Practice relaxation', 'Early dinner'],
      moonPhaseSpecial: 'Waxing moon supports building practices - good time for nourishing foods.'
    },
    dataSource: 'mock'
  });

  const getSeasonIcon = (season) => {
    switch (season) {
      case 'monsoon': return '🌧️';
      case 'summer': return '☀️';
      case 'winter': return '❄️';
      case 'spring': return '🌸';
      case 'post_monsoon': return '🍂';
      default: return '🌿';
    }
  };

  const getMoonIcon = (phase) => {
    if (phase?.includes('New')) return '🌑';
    if (phase?.includes('Full')) return '🌕';
    if (phase?.includes('Waxing')) return '🌔';
    if (phase?.includes('Waning')) return '🌘';
    return '🌙';
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-amber-200 rounded"></div>
            <div className="h-4 bg-amber-200 rounded w-40"></div>
          </div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-3 bg-amber-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-500">⚠️</span>
          <span className="text-sm font-medium text-red-800">Unable to load seasonal guidance</span>
        </div>
        <button 
          onClick={fetchSeasonalGuidance}
          className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const TabButton = ({ id, label, icon, active }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all ${
        active 
          ? 'bg-white shadow-sm text-amber-800 font-medium' 
          : 'text-amber-700 hover:bg-white/50'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-6 shadow-lg border border-amber-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <h3 className="text-lg font-semibold text-amber-900">Your Seasonal Wellness Guide</h3>
        </div>
        <div className="text-xs text-amber-600">
          {data?.dataSource === 'live' ? '🟢 Live data' : '⚡ Demo'}
        </div>
      </div>

      {/* Location & Weather */}
      <div className="bg-white/80 backdrop-blur rounded-lg p-3 mb-4 border border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-xs text-amber-700">📍 {data?.location.city}</div>
              <div className="font-medium text-amber-900">
                {data?.weather.temperature}°C • {data?.weather.description}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm">
              {getSeasonIcon(data?.season)} 
              <span className="capitalize text-amber-800">{data?.season}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600">
              {getMoonIcon(data?.moonPhase)} {data?.moonPhase}
            </div>
          </div>
        </div>
      </div>

      {/* Key Message */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 mb-4 border border-amber-300">
        <div className="flex items-start gap-2">
          <span className="text-amber-700 text-lg">ℹ️</span>
          <div>
            <div className="font-medium text-amber-800 mb-1">{data?.guidance.seasonalFocus}</div>
            <div className="text-sm text-amber-700">{data?.guidance.keyMessage}</div>
          </div>
        </div>
      </div>

      {/* Treatment Explanation */}
      <div className="bg-amber-50 rounded-lg p-3 mb-4 border border-amber-200">
        <div className="flex items-start gap-2">
          <span className="text-amber-600 text-lg">💡</span>
          <div>
            <div className="text-xs font-medium text-amber-800 mb-1">Why your treatment is changing:</div>
            <div className="text-xs text-amber-700">{data?.explanation}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-4 bg-amber-100/50 p-1 rounded-lg">
        <TabButton 
          id="overview" 
          label="Today's Tips" 
          icon={<span>🕐</span>}
          active={activeTab === 'overview'} 
        />
        <TabButton 
          id="lifestyle" 
          label="Lifestyle" 
          icon={<span>❤️</span>}
          active={activeTab === 'lifestyle'} 
        />
        <TabButton 
          id="diet" 
          label="Diet" 
          icon={<span>🍽️</span>}
          active={activeTab === 'diet'} 
        />
      </div>

      {/* Tab Content */}
      <div className="min-h-48">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Daily Schedule */}
            <div className="grid gap-3">
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="font-medium text-yellow-800 text-sm mb-2">🌅 Morning</div>
                <ul className="space-y-1">
                  {data?.dailyTips.morning.map((tip, index) => (
                    <li key={index} className="text-xs text-yellow-700 flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                <div className="font-medium text-orange-800 text-sm mb-2">☀️ Afternoon</div>
                <ul className="space-y-1">
                  {data?.dailyTips.afternoon.map((tip, index) => (
                    <li key={index} className="text-xs text-orange-700 flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="font-medium text-purple-800 text-sm mb-2">🌙 Evening</div>
                <ul className="space-y-1">
                  {data?.dailyTips.evening.map((tip, index) => (
                    <li key={index} className="text-xs text-purple-700 flex items-start gap-2">
                      <span className="text-purple-500 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Moon Phase Special */}
            {data?.dailyTips.moonPhaseSpecial && (
              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                <div className="font-medium text-indigo-800 text-sm mb-1">🌙 Lunar Guidance</div>
                <div className="text-xs text-indigo-700">{data.dailyTips.moonPhaseSpecial}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'lifestyle' && (
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-medium text-green-800 mb-3 text-sm">✅ Recommended Practices</h4>
              <div className="grid gap-3">
                <div>
                  <div className="font-medium text-green-700 text-xs mb-1">Daily Routine</div>
                  <ul className="space-y-1">
                    {data?.guidance.lifestyleTips.map((tip, index) => (
                      <li key={index} className="text-xs text-green-600 flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-medium text-green-700 text-xs mb-1">Self-Care</div>
                  <ul className="space-y-1">
                    {data?.guidance.selfCareTips.map((tip, index) => (
                      <li key={index} className="text-xs text-green-600 flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h4 className="font-medium text-red-800 mb-3 text-sm">⚠️ What to Avoid</h4>
              <ul className="space-y-1">
                {data?.guidance.whatToAvoid.map((item, index) => (
                  <li key={index} className="text-xs text-red-600 flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'diet' && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-3 text-sm">🍽️ Dietary Recommendations</h4>
              <ul className="space-y-2">
                {data?.guidance.dietaryTips.map((tip, index) => (
                  <li key={index} className="text-xs text-blue-700 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Seasonal Foods */}
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <h4 className="font-medium text-emerald-800 mb-3 text-sm">🥬 Seasonal Focus</h4>
              <div className="text-xs text-emerald-700">
                {data?.season === 'monsoon' && 'Focus on warm, cooked foods. Favor ginger, black pepper, and warming spices. Avoid cold, raw, or heavy foods.'}
                {data?.season === 'summer' && 'Choose cooling foods like cucumber, melons, and coconut water. Avoid spicy, fried, or heating foods.'}
                {data?.season === 'winter' && 'Enjoy nourishing, warming foods. Include ghee, nuts, and seasonal vegetables. Avoid cold foods and beverages.'}
                {data?.season === 'spring' && 'Light, detoxifying foods are best. Include fresh greens and seasonal fruits. Reduce heavy, oily foods.'}
                {data?.season === 'post_monsoon' && 'Gradually transition to lighter foods. Support digestion with mild spices and cooked vegetables.'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="mt-4 pt-3 border-t border-amber-200/50">
        <button 
          onClick={fetchSeasonalGuidance}
          className="w-full text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          🔄 Refresh Your Guidance
        </button>
      </div>
    </div>
  );
}