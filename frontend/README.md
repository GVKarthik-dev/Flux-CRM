# Flux CRM - Frontend

Modern React-based Progressive Web App (PWA) for voice-first customer relationship management. Features offline support, installability on all platforms, beautiful UI with smooth animations, voice recording capabilities, and real-time data management.

## 🌟 Features

- **Voice Recording Interface**: Intuitive voice recorder with real-time feedback
- **AI-Powered Data Display**: Automatically extracted customer information with inline editing
- **Interactive Dashboard**: View, search, and manage all customer interactions
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Progressive Web App**: Installable on desktop and mobile with native-like experience
- **Offline Support**: Full offline functionality with automatic sync when back online
- **Install Prompts**: Smart prompts to install the app on user's device
- **Update Notifications**: Automatic update detection and user-friendly update prompts
- **Responsive Design**: Beautiful UI that works on all screen sizes
- **Dark Mode Optimized**: Modern gradient-based design system

## 📋 Prerequisites

- Node.js 16 or higher
- npm or yarn
- Backend API running (see backend README)

## 🚀 Quick Start

1. **Navigate to the frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure API endpoint** (if needed):

Update the API base URL in your components if the backend is not running on `http://localhost:8000`

4. **Start the development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Dependencies

### Core
- **react** (^18.3.1) - UI library
- **react-dom** (^18.3.1) - React DOM rendering
- **vite** (^5.3.1) - Build tool and dev server

### Styling & UI
- **tailwindcss** (^4.1.18) - Utility-first CSS framework
- **@tailwindcss/postcss** (^4.1.18) - PostCSS integration
- **framer-motion** (^11.2.10) - Animation library
- **lucide-react** (^0.400.0) - Icon library

### HTTP & Data
- **axios** (^1.7.2) - HTTP client for API calls

### PWA
- **vite-plugin-pwa** (^0.20.0) - PWA plugin for Vite
- **workbox-window** (^7.1.0) - Service worker management

### Build Tools
- **@vitejs/plugin-react** (^4.3.1) - React plugin for Vite
- **autoprefixer** (^10.4.23) - CSS vendor prefixing
- **postcss** (^8.5.6) - CSS transformation tool

## 🎨 Project Structure

```
frontend/
├── public/              # Static assets
│   ├── manifest.json   # PWA manifest
│   ├── pwa-192x192.png # PWA icon 192x192
│   ├── pwa-512x512.png # PWA icon 512x512
│   ├── apple-touch-icon.png # iOS icon
│   └── favicon.ico     # Browser favicon
├── src/
│   ├── components/     # React components
│   │   ├── Recorder.jsx         # Voice recording interface
│   │   ├── DataDisplay.jsx      # Customer data display/edit
│   │   ├── Dashboard.jsx        # History & management
│   │   ├── InstallPrompt.jsx    # PWA install prompt
│   │   ├── OfflineIndicator.jsx # Offline status indicator
│   │   └── UpdatePrompt.jsx     # Update notification
│   ├── App.jsx         # Main application component
│   ├── App.css         # Component styles
│   ├── index.css       # Global styles & design system
│   └── main.jsx        # Application entry point
├── dist/               # Production build output
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
├── postcss.config.js   # PostCSS configuration
└── package.json        # Dependencies and scripts
```

## 🎯 Available Scripts

### Development
```bash
npm run dev
```
Starts the Vite development server with hot module replacement.

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```
Locally preview the production build before deployment.

## 📱 Installing the PWA

### On Desktop (Chrome, Edge, Brave)

1. Visit the app in your browser
2. Look for the install icon (⊕) in the address bar
3. Click "Install" when prompted
4. The app will open in its own window

### On Mobile (Android)

1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home Screen" or "Install App"
4. The app will be added to your home screen with an icon

### On Mobile (iOS/Safari)

1. Open the app in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm

### Features After Installation

- Opens in standalone mode (no browser UI)
- App icon on home screen/desktop
- Works offline with cached data
- Receives update notifications
- Fast, native-like performance

## 🎨 Design System

The app uses a custom design system defined in `index.css`:

### Color Palette
- **Primary**: Vibrant gradient colors
- **Accent**: Complementary highlight colors
- **Background**: Dark mode optimized
- **Text**: High contrast for readability

### Custom Components
- `.stat-badge` - Status badges
- `.segmented-control` - Tab navigation
- `.glass-card` - Glassmorphism cards
- `.gradient-border` - Gradient bordered elements

### Typography
- Modern font stack with system fonts
- Responsive sizing
- Gradient text effects

## 🔧 Configuration Files

### vite.config.js
Configures Vite build tool and PWA plugin:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // PWA configuration
    })
  ]
})
```

### postcss.config.js
PostCSS configuration for Tailwind CSS:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {}
  }
}
```

## 🌐 PWA Features

- **Offline Support**: Service worker caching for offline functionality
- **Installable**: Add to home screen on mobile devices
- **App-like Experience**: Full-screen mode, splash screen
- **Fast Loading**: Optimized caching strategies

### PWA Manifest
Located in `public/manifest.json`:
- App name and description
- Icons for various sizes
- Theme colors
- Display mode

## 🎭 Components Overview

### Recorder Component
- Voice recording interface
- Real-time recording status
- Audio upload to backend
- Transcript display

### DataDisplay Component
- Shows extracted customer data
- Inline editing capabilities
- Save to database
- Field validation

### Dashboard Component
- Lists all interactions
- Search and filter
- Edit existing records
- Delete functionality
- Real-time updates

## 🔐 Security Considerations

### HTTPS Required
- Voice recording requires HTTPS in production
- Use SSL certificate for production deployment

### Permissions
- Microphone access required
- User must grant permission in browser

### CORS
- Ensure backend CORS settings allow your frontend origin

## 🚀 Deployment

### Static Hosting (Netlify, Vercel, etc.)

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist/` directory to your hosting provider

### Environment-Specific Configuration

For different environments, update API endpoints:
```javascript
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.yourproduction.com'
  : 'http://localhost:8000'
```

## 🐛 Troubleshooting

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### PWA Not Installing
- Ensure HTTPS is enabled
- Check manifest.json is valid
- Verify service worker registration

### Voice Recording Not Working
- Check microphone permissions
- Ensure HTTPS (required for getUserMedia)
- Test in supported browsers (Chrome, Edge, Safari)



## 🎯 Performance Optimization

- **Code Splitting**: Automatic with Vite
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Use WebP format
- **Caching**: Service worker caching strategies
- **Bundle Size**: Tree shaking enabled

## 🔮 Future Enhancements

- [ ] Push notifications
- [ ] Background sync improvements
- [ ] Advanced search filters
- [ ] Export functionality (CSV, PDF)
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Voice commands for navigation

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

MIT License - See main project README for details.

---

**Built with React, Vite, and modern web technologies** ⚛️
