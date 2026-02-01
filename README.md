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
npm install rn-aura react-native-reanimated react-native-gesture-handler react-native-safe-area-context
# or
yarn add rn-aura react-native-reanimated react-native-gesture-handler react-native-safe-area-context
```

> **Note:** This library uses `peerDependencies`. You must install the versions of Reanimated/Gesture Handler that match your React Native or Expo SDK version.

## 🚀 Setup

Wrap your app in `AuraProvider` to enable the Dynamic Island and global overlays.

```tsx
import { AuraProvider } from 'rn-aura';

export default function App() {
  return (
    <AuraProvider>
      <YourApp />
    </AuraProvider>
  );
}
```

## 🎨 Components

### 1. AuraIsland (Dynamic Island)
An intelligent, morphing status capsule that floats above your app.
- **Usage:**
```tsx
const { showAura, hideAura } = useAura();

// Trigger an expanded success card
showAura('expanded', <SuccessView />);

// Trigger a minimal loading pill
showAura('compact', <Text>Loading...</Text>);
```

### 2. OtpInput
A polished, auto-focusing One-Time Password input.
- **Features:** Hidden native input (perfect copy/paste), shake on error, secure mode, animated focus.
- **Usage:**
```tsx
<OtpInput 
  length={4} 
  value={code} 
  onChange={setCode} 
  error={hasError} 
/>
```

### 3. SwipeButton
A slide-to-confirm button with physics-based snap animations.
- **Features:** Haptic feedback ready, customizable thumb (icon/text/image), smooth gradient fill.
- **Usage:**
```tsx
<SwipeButton 
  title="Slide to Pay"
  onComplete={() => alert('Paid!')}
  thumbIcon={<Icon name="arrow-right" size={24} />}
  activeColor="#10B981"
/>
```

### (Coming Soon)
- `StoryViewer`
- `ZoomableView`
- `ParallaxHeader`

## 📄 License

MIT © 2026 Nishith Patel
