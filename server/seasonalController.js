const WeatherService = require('./weatherService');

const weatherService = new WeatherService();

const getSeasonalIntelligence = async (req, res) => {
  try {
    // Default to Mumbai coordinates, or get from query params
    const lat = parseFloat(req.query.lat) || 19.0760;
    const lng = parseFloat(req.query.lng) || 72.8777;
    
    // Get real weather and astronomical data
    const weather = await weatherService.getCurrentWeather(lat, lng);
    const moonPhase = weatherService.getCurrentMoonPhase();
    const season = weatherService.determineSeason(lat);
    const doshaEffects = weatherService.getSeasonalDoshaEffects(season, weather);
    
    // Generate comprehensive recommendations
    const recommendations = generateTreatmentRecommendations(weather, season, moonPhase, doshaEffects);
    const alerts = generateSeasonalAlerts(weather, season, doshaEffects);
    const patientImpact = calculatePatientImpact(weather, season, doshaEffects);
    
    const response = {
      location: { 
        lat, 
        lng, 
        city: weather.city,
        country: 'India' // Could be enhanced with reverse geocoding
      },
      weather,
      season,
      moonPhase,
      doshaEffects,
      recommendations,
      alerts,
      patientImpact,
      timestamp: new Date(),
      dataSource: weatherService.apiKey === 'demo_key' ? 'mock' : 'live'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Seasonal intelligence error:', error);
    res.status(500).json({ error: 'Failed to fetch seasonal data', details: error.message });
  }
};

function generateTreatmentRecommendations(weather, season, moonPhase, doshaEffects) {
  const recommendations = {
    recommended: [],
    avoid: [],
    oils: [],
    therapies: [],
    dietary: [],
    lifestyle: []
  };

  // Season-based recommendations
  switch (season) {
    case 'monsoon':
      recommendations.recommended.push(
        'Use warming sesame oil for Abhyanga',
        'Focus on digestive fire (Agni) enhancement',
        'Schedule indoor treatments only',
        'Emphasize Vata-pacifying therapies'
      );
      recommendations.avoid.push(
        'Cooling coconut oil applications',
        'Heavy detoxification programs',
        'Outdoor therapy sessions',
        'Cold or raw food recommendations'
      );
      recommendations.oils.push('Sesame oil', 'Mustard oil', 'Castor oil');
      recommendations.therapies.push('Abhyanga', 'Swedana', 'Basti', 'Nasya');
      break;

    case 'summer':
      recommendations.recommended.push(
        'Use cooling coconut oil treatments',
        'Schedule treatments in early morning/evening',
        'Focus on Pitta-pacifying therapies',
        'Emphasize hydration support'
      );
      recommendations.avoid.push(
        'Heat-intensive therapies during day',
        'Excessive warming oils',
        'Heavy, heating treatments',
        'Midday outdoor activities'
      );
      recommendations.oils.push('Coconut oil', 'Sunflower oil', 'Ghee');
      recommendations.therapies.push('Abhyanga', 'Shirodhara', 'Pichu', 'Akshi Tarpana');
      break;

    case 'winter':
      recommendations.recommended.push(
        'Intensive warming oil treatments',
        'Focus on Kapha and Vata balancing',
        'Emphasize circulation enhancement',
        'Support immune system therapies'
      );
      recommendations.avoid.push(
        'Cooling treatments',
        'Excessive cooling oils',
        'Light, insufficient treatments',
        'Cold environment therapies'
      );
      recommendations.oils.push('Sesame oil', 'Mahanarayan oil', 'Mustard oil');
      recommendations.therapies.push('Abhyanga', 'Pinda Swedana', 'Udvartana', 'Nasya');
      break;

    case 'post_monsoon':
      recommendations.recommended.push(
        'Gradual transition to cooling treatments',
        'Focus on Pitta pacification',
        'Support digestive recovery',
        'Gentle detoxification'
      );
      recommendations.avoid.push(
        'Sudden dramatic treatment changes',
        'Heavy detox immediately',
        'Excessive heating treatments',
        'Ignoring individual constitution'
      );
      break;
  }

  // Weather condition adjustments
  if (weather.humidity > 75) {
    recommendations.recommended.push('Extra emphasis on warming and drying therapies');
    recommendations.avoid.push('Treatments that increase moisture retention');
  }

  if (weather.temperature > 32) {
    recommendations.recommended.push('Prioritize cooling and hydrating treatments');
    recommendations.avoid.push('Any heat-generating therapies during peak hours');
  }

  if (weather.temperature < 18) {
    recommendations.recommended.push('Intensive warming protocols');
    recommendations.avoid.push('Any cooling treatments or exposures');
  }

  // Moon phase considerations
  if (moonPhase.includes('New')) {
    recommendations.lifestyle.push('Focus on detoxification and cleansing');
    recommendations.lifestyle.push('Ideal time for starting new treatment protocols');
  } else if (moonPhase.includes('Full')) {
    recommendations.lifestyle.push('Peak energy time - intensive treatments suitable');
    recommendations.lifestyle.push('Optimal for nourishing and building therapies');
  }

  // Dosha-specific adjustments
  Object.keys(doshaEffects).forEach(dosha => {
    if (doshaEffects[dosha] === 'increase') {
      recommendations.recommended.push(`Implement ${dosha.charAt(0).toUpperCase() + dosha.slice(1)}-pacifying protocols`);
    }
  });

  // Dietary recommendations
  if (season === 'monsoon') {
    recommendations.dietary.push('Warm, cooked foods', 'Ginger tea', 'Avoid raw foods');
  } else if (season === 'summer') {
    recommendations.dietary.push('Cooling foods', 'Coconut water', 'Avoid spicy foods');
  }

  return recommendations;
}

function generateSeasonalAlerts(weather, season, doshaEffects) {
  const alerts = [];

  // High humidity alert
  if (weather.humidity > 80) {
    alerts.push({
      type: 'weather',
      severity: 'warning',
      message: `High humidity (${weather.humidity}%) may aggravate Vata and Kapha doshas`,
      recommendation: 'Use extra warming oils and ensure dry environment',
      affectedPatients: estimateAffectedPatients('humidity', weather.humidity)
    });
  }

  // Temperature alerts
  if (weather.temperature > 35) {
    alerts.push({
      type: 'temperature',
      severity: 'critical',
      message: `Extreme heat (${weather.temperature}°C) requires treatment modifications`,
      recommendation: 'Postpone heating therapies, increase cooling protocols',
      affectedPatients: estimateAffectedPatients('heat', weather.temperature)
    });
  }

  if (weather.temperature < 15) {
    alerts.push({
      type: 'temperature',
      severity: 'warning',
      message: `Cold weather (${weather.temperature}°C) may increase Vata imbalances`,
      recommendation: 'Increase warming treatments and oils',
      affectedPatients: estimateAffectedPatients('cold', weather.temperature)
    });
  }

  // Seasonal transition alerts
  const currentMonth = new Date().getMonth() + 1;
  if ((season === 'monsoon' && currentMonth === 6) || 
      (season === 'post_monsoon' && currentMonth === 10)) {
    alerts.push({
      type: 'seasonal_transition',
      severity: 'info',
      message: `Seasonal transition period - gradual treatment adjustments recommended`,
      recommendation: 'Monitor patients closely for seasonal imbalance symptoms',
      affectedPatients: estimateAffectedPatients('transition', 0)
    });
  }

  // Dosha-specific alerts
  Object.keys(doshaEffects).forEach(dosha => {
    if (doshaEffects[dosha] === 'increase') {
      alerts.push({
        type: 'dosha',
        severity: 'info',
        message: `${dosha.charAt(0).toUpperCase() + dosha.slice(1)} dosha likely to increase`,
        recommendation: `Focus on ${dosha}-pacifying treatments and lifestyle advice`,
        affectedPatients: estimateAffectedPatients('dosha', dosha)
      });
    }
  });

  return alerts;
}

function calculatePatientImpact(weather, season, doshaEffects) {
  // Mock patient data - in real implementation, query actual patient database
  const totalPatients = 24;
  
  let requireModifications = 0;
  let urgentCases = 0;

  // Calculate based on weather conditions
  if (weather.humidity > 75) requireModifications += 6;
  if (weather.temperature > 32 || weather.temperature < 18) {
    requireModifications += 4;
    urgentCases += 1;
  }

  // Seasonal adjustments
  if (season === 'monsoon') requireModifications += 8;
  if (season === 'summer') requireModifications += 6;

  // Dosha effects
  const doshaIncreases = Object.values(doshaEffects).filter(effect => effect === 'increase').length;
  requireModifications += doshaIncreases * 2;

  // Ensure realistic numbers
  requireModifications = Math.min(requireModifications, totalPatients);
  urgentCases = Math.min(urgentCases, Math.floor(requireModifications / 2));

  return {
    totalPatients,
    requireModifications,
    urgentCases,
    adaptationRate: Math.round((requireModifications / totalPatients) * 100)
  };
}

function estimateAffectedPatients(alertType, value) {
  // Simple estimation logic - in production, this would query patient data
  switch (alertType) {
    case 'humidity':
      return value > 85 ? 12 : 8;
    case 'heat':
      return value > 40 ? 15 : 10;
    case 'cold':
      return value < 10 ? 8 : 5;
    case 'transition':
      return 20; // Most patients affected during seasonal transitions
    case 'dosha':
      return 8; // Estimated patients with specific dosha imbalances
    default:
      return 5;
  }
}

const getPatientSeasonalGuidance = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat) || 19.0760;
    const lng = parseFloat(req.query.lng) || 72.8777;
    const patientId = req.params.patientId;
    
    // Get weather and seasonal data (same as practitioner)
    const weather = await weatherService.getCurrentWeather(lat, lng);
    const moonPhase = weatherService.getCurrentMoonPhase();
    const season = weatherService.determineSeason(lat);
    const doshaEffects = weatherService.getSeasonalDoshaEffects(season, weather);
    
    // Generate patient-friendly content
    const guidance = generatePatientGuidance(weather, season, moonPhase, doshaEffects);
    const explanation = generateTreatmentExplanation(weather, season, doshaEffects);
    const tips = generateDailyTips(weather, season, moonPhase);
    
    const response = {
      location: { 
        lat, 
        lng, 
        city: weather.city,
        country: 'India'
      },
      weather: {
        temperature: weather.temperature,
        condition: weather.condition,
        description: weather.description,
        humidity: weather.humidity
      },
      season,
      moonPhase,
      guidance,
      explanation,
      dailyTips: tips,
      lastUpdated: new Date(),
      dataSource: weatherService.apiKey === 'demo_key' ? 'mock' : 'live'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Patient seasonal guidance error:', error);
    res.status(500).json({ error: 'Failed to fetch seasonal guidance' });
  }
};

function generatePatientGuidance(weather, season, moonPhase, doshaEffects) {
  const guidance = {
    seasonalFocus: '',
    keyMessage: '',
    dietaryTips: [],
    lifestyleTips: [],
    selfCareTips: [],
    whatToAvoid: []
  };
  
  switch (season) {
    case 'monsoon':
      guidance.seasonalFocus = 'Digestive Health & Warmth';
      guidance.keyMessage = 'During monsoon, focus on keeping warm and supporting your digestive fire.';
      guidance.dietaryTips = [
        'Drink warm ginger tea throughout the day',
        'Eat freshly cooked, warm meals',
        'Include warming spices like black pepper, ginger, cinnamon',
        'Avoid cold drinks and raw foods'
      ];
      guidance.lifestyleTips = [
        'Keep yourself dry and warm',
        'Practice indoor exercises like yoga',
        'Maintain regular sleep schedule',
        'Use warm oil for self-massage'
      ];
      guidance.selfCareTips = [
        'Apply sesame oil before bathing',
        'Use warm towels after shower',
        'Practice breathing exercises (pranayama)',
        'Keep feet warm and dry'
      ];
      guidance.whatToAvoid = [
        'Getting wet in rain without protection',
        'Eating heavy, oily, or cold foods',
        'Staying in damp environments',
        'Excessive physical exertion outdoors'
      ];
      break;
      
    case 'summer':
      guidance.seasonalFocus = 'Cooling & Hydration';
      guidance.keyMessage = 'Summer requires cooling practices and staying well-hydrated.';
      guidance.dietaryTips = [
        'Drink plenty of cool (not ice-cold) water',
        'Eat cooling foods like cucumber, melons, mint',
        'Avoid spicy and heating foods',
        'Have coconut water regularly'
      ];
      guidance.lifestyleTips = [
        'Avoid direct sun during peak hours (10am-4pm)',
        'Wear light-colored, breathable clothes',
        'Take cool showers',
        'Practice gentle, cooling exercises'
      ];
      guidance.selfCareTips = [
        'Use coconut oil for body massage',
        'Apply cooling herbs like aloe vera',
        'Practice cooling breathing (Sheetali pranayama)',
        'Rest during the hottest part of the day'
      ];
      guidance.whatToAvoid = [
        'Excessive sun exposure',
        'Hot, spicy, or fried foods',
        'Strenuous activities in heat',
        'Anger and emotional stress'
      ];
      break;
      
    case 'winter':
      guidance.seasonalFocus = 'Warmth & Nourishment';
      guidance.keyMessage = 'Winter is time to build strength and maintain warmth.';
      guidance.dietaryTips = [
        'Eat nourishing, warming foods',
        'Include healthy fats like ghee and nuts',
        'Drink warm beverages throughout day',
        'Eat seasonal root vegetables'
      ];
      guidance.lifestyleTips = [
        'Maintain regular exercise routine',
        'Keep body warm with appropriate clothing',
        'Get adequate sunlight exposure',
        'Practice warming breathing exercises'
      ];
      guidance.selfCareTips = [
        'Daily oil massage with warming oils',
        'Take warm baths',
        'Practice energizing yoga poses',
        'Maintain consistent daily routine'
      ];
      guidance.whatToAvoid = [
        'Exposure to excessive cold',
        'Cold foods and beverages',
        'Irregular sleep patterns',
        'Staying sedentary for long periods'
      ];
      break;
  }
  
  return guidance;
}

function generateTreatmentExplanation(weather, season, doshaEffects) {
  let explanation = '';
  
  if (season === 'monsoon' && weather.humidity > 75) {
    explanation = 'Due to high humidity and monsoon conditions, your practitioner may use warming oils instead of cooling ones. This helps balance the increased Vata and Kapha doshas during this season, supporting better digestion and circulation.';
  } else if (season === 'summer' && weather.temperature > 30) {
    explanation = 'With the current hot weather, your treatments may focus on cooling therapies and hydrating practices. This helps balance Pitta dosha which tends to increase in summer, preventing inflammation and heat-related issues.';
  } else if (season === 'winter' && weather.temperature < 20) {
    explanation = 'During cooler weather, your practitioner may recommend more intensive warming treatments and nourishing therapies. This supports Vata and Kapha balance, maintaining circulation and preventing seasonal imbalances.';
  } else {
    explanation = 'Your treatment plan is being adjusted based on current seasonal conditions and weather patterns to ensure optimal therapeutic benefits and maintain your natural balance.';
  }
  
  return explanation;
}

function generateDailyTips(weather, season, moonPhase) {
  const tips = {
    morning: [],
    afternoon: [],
    evening: [],
    moonPhaseSpecial: ''
  };
  
  // Morning tips
  if (season === 'monsoon') {
    tips.morning = [
      'Start with warm water and ginger',
      'Practice gentle yoga indoors',
      'Use sesame oil for self-massage'
    ];
  } else if (season === 'summer') {
    tips.morning = [
      'Exercise early before it gets hot',
      'Drink coconut water',
      'Apply cooling aloe vera gel'
    ];
  } else if (season === 'winter') {
    tips.morning = [
      'Warm oil massage before bathing',
      'Practice energizing breathing exercises',
      'Eat warm, nourishing breakfast'
    ];
  }
  
  // Afternoon tips
  if (weather.temperature > 32) {
    tips.afternoon = [
      'Stay in shade or indoors',
      'Have cooling foods like cucumber',
      'Take rest during peak heat'
    ];
  } else if (weather.humidity > 80) {
    tips.afternoon = [
      'Keep environment dry',
      'Have light, warm meals',
      'Stay active but avoid overexertion'
    ];
  } else {
    tips.afternoon = [
      'Maintain regular meal times',
      'Stay adequately hydrated',
      'Take short breaks from work'
    ];
  }
  
  // Evening tips
  tips.evening = [
    'Practice relaxation techniques',
    'Have light, early dinner',
    'Prepare for restful sleep'
  ];
  
  // Moon phase special guidance
  if (moonPhase.includes('New')) {
    tips.moonPhaseSpecial = 'New moon is ideal for gentle detox - try herbal teas and light, cleansing foods.';
  } else if (moonPhase.includes('Full')) {
    tips.moonPhaseSpecial = 'Full moon brings peak energy - focus on nourishing practices and avoid overindulgence.';
  } else if (moonPhase.includes('Waxing')) {
    tips.moonPhaseSpecial = 'Growing moon phase - good time for building practices like strengthening exercises and nourishing foods.';
  } else if (moonPhase.includes('Waning')) {
    tips.moonPhaseSpecial = 'Waning moon supports release - focus on gentle cleansing and letting go of stress.';
  }
  
  return tips;
}

module.exports = {
  getSeasonalIntelligence,
  getPatientSeasonalGuidance
};