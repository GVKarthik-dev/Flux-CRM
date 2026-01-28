# Flux CRM

A modern, voice-first CRM application that uses AI to transcribe and extract customer information from voice recordings. Built with React (frontend) and FastAPI (backend), this Progressive Web App (PWA) enables seamless customer relationship management through voice interactions.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Features

- **Voice Recording & Transcription**: Record customer interactions and automatically transcribe them using AI
- **Intelligent Data Extraction**: Automatically extract customer information (name, phone, address, city, locality) from transcripts
- **Interactive Dashboard**: View, edit, and manage all customer interaction history
- **Real-time Updates**: Live updates and smooth animations using Framer Motion
- **Progressive Web App**: Installable on mobile devices with offline capabilities
- **Android Support**: Built with Capacitor for native Android deployment
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS and gradient effects

## 🏗️ Architecture

### Frontend
- **Framework**: React 18.3.1 with Vite
- **Styling**: Tailwind CSS 4.1.18
- **Animations**: Framer Motion 11.2.10
- **Icons**: Lucide React
- **PWA**: Vite Plugin PWA with Workbox
- **Mobile**: Capacitor for Android deployment

### Backend
- **Framework**: FastAPI
- **Database**: SQLite with SQLAlchemy ORM
- **AI Services**: 
  - Speech-to-Text (STT) service for transcription
  - Data extraction service for CRM information
- **API**: RESTful endpoints with CORS support

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **pip** (Python package manager)

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory with your API keys:
```env
# Add your API keys here (e.g., for Groq or other AI services)
GROQ_API_KEY=your_api_key_here
```

4. Start the FastAPI server:
```bash
python main.py
```

The backend server will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is occupied)

## 🔧 Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend

- `python main.py` - Start FastAPI server
- `pytest` - Run tests (if configured)

## 📱 Building for Android

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Sync with Capacitor:
```bash
npx cap sync android
```

3. Open in Android Studio:
```bash
npx cap open android
```

## 🗄️ Database Schema

The application uses SQLite with the following schema:

**Interactions Table**:
- `id` - Primary key
- `transcript` - Full text transcription
- `customer_name` - Extracted customer name
- `phone` - Customer phone number
- `address` - Customer address
- `city` - Customer city
- `locality` - Customer locality/area
- `summary` - Interaction summary
- `raw_json` - Complete extracted data in JSON format
- `created_at` - Timestamp

## 🔌 API Endpoints

### POST `/process-voice`
Upload and process voice recordings
- **Input**: Audio file (webm format)
- **Output**: Transcript and extracted CRM data

### GET `/history`
Retrieve all customer interactions
- **Output**: Array of interaction records

### POST `/history`
Create a new interaction record
- **Input**: Customer and interaction data
- **Output**: Created record ID

### PUT `/history/{record_id}`
Update an existing interaction
- **Input**: Updated customer/interaction data
- **Output**: Update status

### DELETE `/history/{record_id}`
Delete an interaction record
- **Output**: Deletion status

### GET `/`
Health check endpoint
- **Output**: API status message

## 🎨 UI Components

- **Recorder**: Voice recording interface with real-time feedback
- **DataDisplay**: Display and edit extracted customer information
- **Dashboard**: View and manage interaction history

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
# AI Service API Keys
GROQ_API_KEY=your_groq_api_key

# Database (optional, defaults to SQLite)
DATABASE_URL=sqlite:///./voice_crm.db

# Server Configuration (optional)
HOST=0.0.0.0
PORT=8000
```

## 🛠️ Technology Stack

### Frontend Dependencies
- React & React DOM
- Vite (Build tool)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- Lucide React (Icons)
- Axios (HTTP client)
- Capacitor (Mobile deployment)
- Workbox (PWA/Service Worker)

### Backend Dependencies
- FastAPI (Web framework)
- Uvicorn (ASGI server)
- SQLAlchemy (ORM)
- Python-multipart (File uploads)
- Groq (AI services)
- Python-dotenv (Environment management)
- Pydantic (Data validation)

## 📝 Development Notes

- The application uses a voice-first approach for data entry
- All customer interactions are stored locally in SQLite
- The PWA configuration allows offline functionality
- Android builds are supported through Capacitor
- The UI features smooth animations and modern design patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- Audio recording requires HTTPS in production (browser security requirement)
- Some browsers may require user permission for microphone access

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Cloud database integration
- [ ] Advanced analytics dashboard
- [ ] Export functionality (CSV, PDF)
- [ ] Email integration
- [ ] Calendar integration for follow-ups
- [ ] iOS support via Capacitor

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Built with ❤️ using React, FastAPI, and AI**
