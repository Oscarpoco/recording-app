# 🎙️ Recording App

A cross-platform mobile recording application built with React Native and Expo, enabling high-quality audio recording, playback, and sharing capabilities.

## 📱 Features

- **Audio Recording**
  - High-quality audio capture
  - Real-time recording visualization

- **Playback & Management**
  - Intuitive playback controls
  - Recording list with metadata
  - Recording organization by date
  - Audio waveform visualization

- **File Management**
  - Local storage with AsyncStorage
  - Export recordings in various formats
  - Share recordings via platform share sheet
  - Recording deletion and renaming

## 🛠️ Technical Stack

### Core Technologies
- **React Native** (0.76.5)
- **Expo** (52.0.20)
- **React** (18.3.1)

### Key Dependencies
- **expo-av**: Audio recording and playback
- **expo-sharing**: File sharing capabilities
- **@react-native-async-storage/async-storage**: Local data persistence
- **react-native-progress**: Progress visualization
- **react-native-vector-icons**: UI icons
- **date-fns**: Date formatting and manipulation

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator
- Physical device with Expo Go app (optional)

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/oscarpoco/recording-app.git
   cd recording-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start Development Server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on Platform**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🏗️ Project Structure

```
recording-app/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/         # App screens
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   └── constants/      # App constants
├── assets/             # Static assets
└── App.js             # Root component
```

## 📱 Usage

### Recording Audio
1. Grant microphone permissions when prompted
2. Tap the record button to start recording
3. Tap again to stop recording
4. Save or discard the recording

### Managing Recordings
- View all recordings in the main list
- Tap a recording to play/pause
- Use the share button to export recordings
- Swipe left on a recording to delete

### Sharing Recordings
1. Select a recording from the list
2. Tap the share icon
3. Choose sharing method from the platform share sheet

## ⚙️ Configuration

### Expo Configuration
```json
{
  "expo": {
    "plugins": [
      [
        "expo-av",
        {
          "microphonePermission": "Allow Recording App to access your microphone."
        }
      ]
    ]
  }
}
```

### Audio Settings
- Format: AAC
- Sample Rate: 44100 Hz
- Channels: 2 (Stereo)
- Quality: High

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues
- **Microphone Permission Denied**: Ensure permissions are granted in device settings
- **Recording Not Saving**: Check storage permissions and available space
- **Playback Issues**: Verify audio output settings and volume levels

### Debug Mode
Enable debug mode in development:
```javascript
// App.js
const enableDebugging = __DEV__;
```

## 📞 Support

For support, please:
1. Check the [GitHub Issues](https://github.com/oscarpoco/recording-app/issues)
2. Join our [Discord Community](https://discord.gg/your-server)
3. Email support at: support@recordingapp.com

## 🙏 Acknowledgments

- Expo team for the excellent development platform
- React Native community for continuous support
- All contributors who have helped improve this project

---
Made with ❤️ by the Recording App Team
