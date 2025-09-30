const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'practitioner', 'patient'], default: 'patient' },
  name: { type: String, required: true },
  status: { type: String, enum: ['pending', 'active', 'rejected', 'inactive'], default: 'pending' },
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center' }, // Associated center for practitioners
  specialization: { type: String }, // For practitioners
  workingHours: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String }
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Center Schema
const centerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String },
  verified: { type: Boolean, default: true },
  registrationNumber: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now }
});

const Center = mongoose.model('Center', centerSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  practitionerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  patientName: { type: String, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  therapy: { type: String, required: true }, // Renamed from treatment for consistency
  treatment: { type: String }, // Keep for backward compatibility
  centerName: { type: String, required: true },
  centerId: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, default: 60 },
  cost: { type: Number, required: true },
  requirements: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Import new route handlers (commented out until routes are created)
// const therapyNotesRouter = require('./routes/therapyNotes');
// const chatbotRouter = require('./routes/chatbot');

// Use imported routes (commented out until routes are created)
// app.use('/api/therapy-notes', therapyNotesRouter);
// app.use('/api/chatbot', chatbotRouter);

// Seasonal Intelligence Route
app.use('/api/seasonal', require('./seasonal'));

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, role, centerId, specialization, workingHours } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Validate center if practitioner
    if (role === 'practitioner') {
      if (!centerId) {
        return res.status(400).json({ error: 'Center selection is required for practitioners' });
      }
      const center = await Center.findById(centerId);
      if (!center) {
        return res.status(400).json({ error: 'Selected center does not exist' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      role,
      name: email.split('@')[0],
      status: role === 'practitioner' ? 'pending' : 'active',
      centerId: role === 'practitioner' ? centerId : undefined,
      specialization: role === 'practitioner' ? specialization : undefined,
      workingHours: role === 'practitioner' ? workingHours : undefined
    });

    await user.save();
    
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
    
    res.json({
      success: true,
      user: { 
        id: user._id, 
        email: user.email, 
        role: user.role, 
        name: user.name,
        centerId: user.centerId,
        specialization: user.specialization
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
    
    res.json({
      success: true,
      user: { id: user._id, email: user.email, role: user.role, name: user.name },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Centers Routes
app.get('/api/centers', async (req, res) => {
  try {
    const centers = await Center.find();
    res.json(centers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new center
app.post('/api/centers', async (req, res) => {
  try {
    const { name, location, contact, verified } = req.body;
    
    // Check for existing center with same name and location
    const existingCenter = await Center.findOne({ name, location });
    if (existingCenter) {
      return res.status(400).json({ 
        success: false, 
        error: 'A center with this name and location already exists' 
      });
    }

    const center = new Center({
      name,
      location,
      contact,
      verified: verified ?? true,
      // Generate a unique registration number
      registrationNumber: 'RC' + Date.now().toString().slice(-6)
    });

    await center.save();
    res.json({ success: true, center });
  } catch (error) {
    console.error('Center creation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create center. Please try again.' 
    });
  }
});

// Update center status
app.patch('/api/centers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;
    const center = await Center.findByIdAndUpdate(
      id,
      { verified },
      { new: true }
    );
    if (!center) {
      return res.status(404).json({ error: 'Center not found' });
    }
    res.json({ success: true, center });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bookings Route
app.post('/api/bookings', async (req, res) => {
  try {
    const { 
      userId, 
      patientName,
      therapy, 
      treatment, 
      centerName, 
      centerId,
      date, 
      time, 
      duration,
      cost,
      requirements 
    } = req.body;

    // Auto-assign a practitioner (use the first practitioner for demo)
    const practitioner = await User.findOne({ role: 'practitioner' });
    const practitionerId = practitioner ? practitioner._id : null;
    
    console.log('Assigning booking to practitioner:', practitionerId);
    
    const booking = new Booking({
      userId: userId || patientId,
      practitionerId,
      patientName,
      patientId: userId,
      therapy: therapy || treatment, // Use therapy if provided, fallback to treatment
      treatment: treatment || therapy, // Keep for backward compatibility
      centerName,
      centerId,
      date: new Date(date),
      time,
      duration: duration || 60,
      cost,
      requirements
    });

    await booking.save();
    
    // Populate user details for response
    await booking.populate('userId', 'name email');
    await booking.populate('practitionerId', 'name email');
    
    res.json({ success: true, booking });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get bookings for a practitioner
app.get('/api/bookings/practitioner/:practitionerId', async (req, res) => {
  try {
    const { practitionerId } = req.params;
    const bookings = await Booking.find({ practitionerId })
      .populate('userId', 'name email')
      .sort({ date: 1 });
    
    // Transform bookings to match expected format
    const transformedBookings = bookings.map(booking => ({
      id: booking._id,
      patientId: booking.userId._id,
      patientName: booking.patientName || booking.userId.name,
      practitionerId: booking.practitionerId,
      centerId: booking.centerId,
      therapy: booking.therapy,
      date: booking.date.toISOString(),
      createdAt: booking.createdAt.toISOString()
    }));
    
    res.json(transformedBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings (for admin)
app.get('/api/bookings/all', async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('userId', 'name email')
      .populate('practitionerId', 'name email')
      .sort({ date: 1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get practitioner info
app.get('/api/practitioners', async (req, res) => {
  try {
    const { status } = req.query;
    let query = { role: 'practitioner' };
    if (status) {
      query.status = status;
    }
    const practitioners = await User.find(query, 'name email _id status');
    res.json(practitioners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update practitioner status
app.patch('/api/practitioners/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const practitioner = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!practitioner) {
      return res.status(404).json({ error: 'Practitioner not found' });
    }
    res.json({ success: true, practitioner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (for testing)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email _id role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed Default Users
app.post('/api/seed-users', async (req, res) => {
  try {
    const defaultUsers = [
      {
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
        name: 'Admin User',
        status: 'active'
      },
      {
        email: 'practitioner@gmail.com',
        password: 'practitioner123',
        role: 'practitioner',
        name: 'Dr. John Practitioner',
        status: 'active'
      },
      {
        email: 'patient@gmail.com',
        password: 'patient123',
        role: 'patient',
        name: 'Jane Patient',
        status: 'active'
      }
    ];

    let createdUsers = [];
    let existingUsers = [];

    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        existingUsers.push(userData.email);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        name: userData.name
      });

      await user.save();
      createdUsers.push(userData.email);
    }

    res.json({ 
      success: true, 
      message: 'User seeding completed',
      created: createdUsers,
      existing: existingUsers,
      credentials: {
        admin: 'admin@gmail.com / admin123',
        practitioner: 'practitioner@gmail.com / practitioner123',
        patient: 'patient@gmail.com / patient123'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed Centers Data
app.post('/api/seed-centers', async (req, res) => {
  try {
    const centers = [
      { name: 'Wellness Center Mumbai', location: 'Mumbai, Maharashtra', verified: true },
      { name: 'Ayurveda Healing Bangalore', location: 'Bangalore, Karnataka', verified: true },
      { name: 'Traditional Therapy Delhi', location: 'Delhi, NCR', verified: true },
      { name: 'Panchakarma Center Chennai', location: 'Chennai, Tamil Nadu', verified: true },
      { name: 'Holistic Health Pune', location: 'Pune, Maharashtra', verified: true },
      { name: 'Ayurvedic Wellness Kochi', location: 'Kochi, Kerala', verified: true }
    ];

    await Center.deleteMany({});
    await Center.insertMany(centers);
    res.json({ success: true, message: 'Centers seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});