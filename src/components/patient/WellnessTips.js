// frontend/src/components/patient/WellnessTips.js
import React, { useState, useEffect } from 'react';

const WellnessTips = () => {
  const [currentTip, setCurrentTip] = useState(0);

  // Ayurvedic wellness tips with Panchakarma focus
  const wellnessTips = [
    {
      id: 1,
      title: "Hydration Wisdom",
      tip: "Drink warm water infused with cumin seeds to aid digestion and detoxification",
      icon: "💧",
      category: "Detox",
      timeOfDay: "Morning"
    },
    {
      id: 2,
      title: "Post-Abhyanga Care",
      tip: "Rest for 15-30 minutes after oil massage to allow the oils to penetrate deeply",
      icon: "🛌",
      category: "Recovery",
      timeOfDay: "After Therapy"
    },
    {
      id: 3,
      title: "Mindful Eating",
      tip: "Eat warm, cooked foods during Panchakarma. Avoid raw, cold, or processed items",
      icon: "🍲",
      category: "Nutrition",
      timeOfDay: "Meal Time"
    },
    {
      id: 4,
      title: "Sleep Harmony",
      tip: "Go to bed before 10 PM to align with your body's natural healing cycle",
      icon: "🌙",
      category: "Rest",
      timeOfDay: "Evening"
    },
    {
      id: 5,
      title: "Gentle Movement",
      tip: "Practice light yoga or walking 2-3 hours after therapy sessions",
      icon: "🧘‍♀️",
      category: "Exercise",
      timeOfDay: "Afternoon"
    },
    {
      id: 6,
      title: "Breathing Practice",
      tip: "Take 5 deep breaths before meals to activate your digestive fire (Agni)",
      icon: "🌬️",
      category: "Pranayama",
      timeOfDay: "Before Meals"
    },
    {
      id: 7,
      title: "Oil Massage Benefits",
      tip: "Daily self-massage with warm sesame oil improves circulation and calms Vata",
      icon: "🫖",
      category: "Self-Care",
      timeOfDay: "Morning"
    },
    {
      id: 8,
      title: "Herbal Tea Time",
      tip: "Sip CCF tea (Cumin, Coriander, Fennel) to enhance digestion naturally",
      icon: "🍵",
      category: "Herbs",
      timeOfDay: "Between Meals"
    }
  ];

  // Auto-rotate tips every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % wellnessTips.length);
    }, 30000);

    return () => clearInterval(interval);
  }, [wellnessTips.length]);

  const currentWellnessTip = wellnessTips[currentTip];

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % wellnessTips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + wellnessTips.length) % wellnessTips.length);
  };

  return (
    <div className="bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl shadow-lg p-6 border border-amber-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-amber-900 flex items-center">
          <span className="text-2xl mr-2">🌿</span>
          Daily Wellness Tip
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevTip}
            className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-amber-100 transition-colors"
          >
            <span className="text-amber-700">←</span>
          </button>
          <span className="text-xs text-amber-800 font-medium">
            {currentTip + 1}/{wellnessTips.length}
          </span>
          <button
            onClick={nextTip}
            className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-amber-100 transition-colors"
          >
            <span className="text-amber-700">→</span>
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg p-4 mb-4 border border-amber-200 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="text-3xl">{currentWellnessTip.icon}</div>
          <div className="flex-1">
            <h4 className="font-semibold text-amber-900 mb-1">
              {currentWellnessTip.title}
            </h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              {currentWellnessTip.tip}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <span className="bg-gradient-to-r from-amber-200 to-yellow-300 text-amber-900 px-2 py-1 rounded-full shadow-sm">
            {currentWellnessTip.category}
          </span>
          <span className="text-amber-700">
            {currentWellnessTip.timeOfDay}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>
          <span className="text-amber-600 text-xs">Auto-refresh in 30s</span>
        </div>
      </div>
    </div>
  );
};

export default WellnessTips;