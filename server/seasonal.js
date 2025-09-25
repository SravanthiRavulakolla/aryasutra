const express = require('express');
const { getSeasonalIntelligence, getPatientSeasonalGuidance } = require('./seasonalController');

const router = express.Router();

// Test route to verify router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Seasonal routes working', timestamp: new Date() });
});

// Get seasonal intelligence for a practitioner
router.get('/intelligence/:practitionerId', getSeasonalIntelligence);

// Alternative endpoint without practitionerId
router.get('/intelligence', getSeasonalIntelligence);

// Patient-focused seasonal guidance
router.get('/patient-guidance/:patientId', getPatientSeasonalGuidance);
router.get('/patient-guidance', getPatientSeasonalGuidance);

console.log('✅ Seasonal routes loaded successfully');
module.exports = router;