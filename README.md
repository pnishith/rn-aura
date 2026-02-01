# React Native Aura 🌌

> The Developer Super-Kit. 50+ Premium UI & Functional Components for React Native.

**Aura** is a next-generation library designed to bridge the gap between "Basic" and "Premium." It provides the complex, high-interaction components that usually require 3-4 separate libraries to achieve.

## ✨ Why Aura?

- **🦄 Unique:** Components you won't find in standard kits (Story Viewer, Dynamic Island, Parallax).
- **🚀 Optimized:** Built on `react-native-reanimated` worklets for 60/120 FPS performance.
- **📱 Native Feel:** Physics-based animations that feel right at home on iOS and Android.
- **🧩 Gap-Filling:** Solves the "Headache" problems (Auto-focus OTP, Smart Inputs, Sensors).

## 📦 Installation

```sh
npm install rn-aura react-native-reanimated
# or
yarn add rn-aura react-native-reanimated
```

## 🎨 Components

### Smart Inputs
- **`OtpInput`**: Auto-focus, copy-paste ready, secure mode, and error shake.

### (Coming Soon)
- `StoryViewer`
- `ZoomableView`
- `DynamicIsland`
- `SwipeButton`

## 🚀 Usage

```tsx
import { OtpInput } from 'rn-aura';

function App() {
  return (
    <OtpInput 
      length={4}
      value={code}
      onChange={setCode}
      error={hasError}
    />
  );
}
```

## 📄 License

MIT © 2026 Nishith Patel
