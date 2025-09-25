# Ayurveda Backend API

Backend server for the Ayurveda Wellness Platform with MongoDB integration.

## Setup

1. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Start the server**
   ```bash
   npm run dev
   ```

3. **Seed centers data** (one-time setup)
   ```bash
   curl -X POST http://localhost:5001/api/seed-centers
   ```

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/centers` - Get all centers
- `POST /api/bookings` - Create booking
- `POST /api/seed-centers` - Seed centers data

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `PORT` - Server port (default: 5001)