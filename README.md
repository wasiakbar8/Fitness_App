<div align="center">

# 💪 Fitness & Wellness Tracker

**A premium React Native application for holistic health management**

[![Expo](https://img.shields.io/badge/Expo-SDK_51-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

*Track your workouts. Fuel your body. Nurture your mind.*

</div>

---

## 📸 Screenshots

| Home Dashboard | Training Calendar | Mood Selector |
|:-:|:-:|:-:|
| ![Home](app/photos/WhatsApp%20Image%202026-02-26%20at%2010.51.27%20AM.jpeg) | ![Calendar](app/photos/WhatsApp%20Image%202026-02-26%20at%2010.51.28%20AM.jpeg) | ![Mood](app/photos/WhatsApp%20Image%202026-02-26%20at%2010.51.26%20AM.jpeg) |
| **Daily Insights** | **Workout Schedule** | **Interactive Log** |

| Nutrition Tracking | Profile Stats | Insights Detail |
|:-:|:-:|:-:|
| ![Nutrition](app/photos/WhatsApp%20Image%202026-02-26%20at%2010.51.27%20AM%20(1).jpeg) | ![Profile](app/photos/WhatsApp%20Image%202026-02-26%20at%2010.51.28%20AM%20(1).jpeg) | ![Insights](app/photos/WhatsApp%20Image%202026-02-26%20at%2010.51.27%20AM%20(2).jpeg) |
| **Macro Tracking** | **User Progress** | **Data Analytics** |

---

## ✨ Features

### 🧠 Interactive Mood Wheel
A custom-built SVG circular slider for logging emotional states with real-time visual feedback. Capture your daily mental well-being in seconds.

### 📊 Comprehensive Dashboard
Stay on top of your health metrics at a glance — calories burned, weight trends, hydration levels, and more, all in one beautifully organized view.

### 🏋️ Training Management
Follow structured 8-week programs with dedicated workout routines like **Arm Blaster** and **Leg Day Blitz**. Never miss a session with your full training calendar.

### 🥗 Nutrition Monitoring
Log meals and track detailed macro-nutrient breakdowns — Protein, Carbs, and Fats — to ensure you're fueling performance and recovery.

### 🌙 Professional Dark UI
A high-fidelity dark mode interface built on a consistent `#1A1A1A` card-based design system, optimized for readability and visual comfort.

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Expo](https://expo.dev) (React Native) |
| **Navigation** | [Expo Router](https://expo.github.io/router) — file-based routing |
| **Graphics** | [React Native SVG](https://github.com/software-mansion/react-native-svg) |
| **Icons** | [Lucide React Native](https://lucide.dev) |
| **Language** | TypeScript |
| **State** | React Hooks & Custom Theming |

---

## 📁 Project Structure

```
FITNESS_APP/
├── app/                        # Expo Router — screens & navigation
│   ├── (tabs)/                 # Tab bar screens
│   │   ├── index.tsx           # Home Dashboard
│   │   ├── mood.tsx            # Mood Wheel
│   │   ├── nutrition.tsx       # Nutrition Tracker
│   │   └── profile.tsx         # Profile & Stats
│   └── components/             # Reusable UI components
│       ├── MoodWheel.tsx       # SVG circular mood slider
│       ├── WorkoutCard.tsx     # Training session card
│       └── CustomButton.tsx    # Branded button component
├── constants/
│   ├── Colors.ts               # Global theme & color palette
│   └── MockData.ts             # Sample data for development
├── assets/
│   ├── icons/                  # App & tab bar icons
│   └── splash/                 # Splash screen assets
└── package.json                # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- iOS Simulator / Android Emulator, or the [Expo Go](https://expo.dev/go) app

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/wasiakbar8/fitness-wellness-tracker.git
cd fitness-wellness-tracker

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start
```

### Running on a Device

| Platform | Command |
|---|---|
| iOS Simulator | Press `i` in the terminal |
| Android Emulator | Press `a` in the terminal |
| Physical Device | Scan the QR code with **Expo Go** |

---

## 📦 Available Scripts

```bash
npx expo start          # Start the Expo development server
npx expo start --ios    # Start on iOS simulator
npx expo start --android # Start on Android emulator
npx expo build          # Build for production
npx expo lint           # Run linter
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature-name`
3. Commit your changes — `git commit -m 'feat: add your feature'`
4. Push to the branch — `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code follows the existing code style and includes appropriate tests.

---

## 👤 Author

**Wasi Akbar**

[![GitHub](https://img.shields.io/badge/GitHub-wasiakbar8-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/wasiakbar8)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ and a lot of reps by [Wasi Akbar](https://github.com/wasiakbar8)

</div>
