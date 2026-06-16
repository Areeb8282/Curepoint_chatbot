# CurePoint - Healthcare Chatbot & Appointment System

A full-stack MERN application for symptom-based disease detection, doctor recommendations, and appointment booking.

## Features

- AI Chatbot for symptom analysis
- Location-based doctor recommendations
- Doctor filtering by area and rating
- Real-time appointment slot management
- Hospital information display
- Booking capacity limits

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
npm install
```

2. Configure MongoDB:
- Update `MONGODB_URI` in `.env` file
- Default: `mongodb://localhost:27017/curepoint`

3. Seed the database:
```bash
node seedData.js
```

4. Start backend server:
```bash
npm run dev
```

Server runs on http://localhost:5000

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
npm install
```

2. Start React app:
```bash
npm start
```

App runs on http://localhost:3000

## Database Structure

- Users: User accounts
- Diseases: Disease-symptom mappings
- Hospitals: 12 hospitals across 4 areas
- Doctors: 96 doctors (8 specializations × 12 hospitals)
- Appointments: Booking records
- ChatHistory: Conversation logs

## API Endpoints

- POST `/api/chat` - Process symptoms
- GET `/api/doctors` - Get all doctors
- GET `/api/doctors/filter` - Filter doctors
- GET `/api/doctors/:id` - Doctor profile
- POST `/api/appointments` - Book appointment
- GET `/api/appointments/:userId` - User appointments

## Tech Stack

- Frontend: React.js, React Router
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- API: REST with Axios

## Areas Covered

- Bandra
- Kurla
- Andheri
- Mahim
