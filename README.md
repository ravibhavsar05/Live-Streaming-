# LiveStreaming

LiveStreaming is a React Native app designed to play live videos from YouTube. It fetches a list of currently live videos using the YouTube API and provides a seamless viewing experience. The app also includes a custom Android PiP (Picture-in-Picture) module bridge to enable PiP mode for live streaming (currently supported only on Android).

## Features
- Fetches and displays a list of live videos from YouTube using the YouTube API.
- Plays YouTube live streams within the app.
- Supports Picture-in-Picture (PiP) mode on Android using a custom native bridge (currently Android-only).
- Smooth and user-friendly UI for an enhanced viewing experience.

## Technologies Used
- **React Native** - Cross-platform mobile framework.
- **YouTube API** - Fetching live video data.
- **Android PiP Module** - Custom native module to enable Picture-in-Picture mode on Android.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/livestreaming.git
   cd livestreaming
   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. Link native dependencies (if needed):
   ```sh
   npx react-native link
   ```
4. Run the app:
   - **Android**:
     ```sh
     npx react-native run-android
     ```
   - **iOS** (if supported):
     ```sh
     cd ios && pod install && cd ..
     npx react-native run-ios
     ```




https://github.com/user-attachments/assets/ff5f5764-77b8-412f-8a7b-cd341652b2ab


## Usage
- Open the app and browse the list of currently live YouTube videos.
- Tap on a video to start streaming.
- For Android users, use the PiP mode feature to watch videos while multitasking.

## Contribution
Feel free to contribute to this project by submitting issues or pull requests.

## License
This project is licensed under the MIT License.

