# React Native Aura 🌌

[![npm version](https://img.shields.io/npm/v/rn-aura.svg?style=flat-square)](https://www.npmjs.com/package/rn-aura)
[![npm downloads](https://img.shields.io/npm/dm/rn-aura.svg?style=flat-square)](https://www.npmjs.com/package/rn-aura)
[![license](https://img.shields.io/npm/l/rn-aura.svg?style=flat-square)](https://github.com/pnishith/rn-aura/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/pnishith/rn-aura/pulls)

> **The Developer Super-Kit.** 50+ Premium UI & Functional Components for high-performance React Native apps.

**Aura** is a professional-grade component library designed to bridge the gap between "Basic" and "Premium." It provides the complex, high-interaction components that usually require multiple specialized libraries to achieve. Built with performance and aesthetics at its core.

---

## ✨ Why Aura?

- **🦄 Unique Components:** Access high-end interactions like the `AuraIsland` (Dynamic Island), `StoryViewer`, and `ParallaxHeader`.
- **🚀 Performance First:** Powered by `react-native-reanimated` worklets for 60/120 FPS fluid animations.
- **📱 Native Precision:** Physics-based springs that feel identical to native iOS and Android system behaviors.
- **🧩 Solve "Headache" UX:** Drop-in solutions for complex inputs like auto-focusing OTPs, currency masking, and rating systems.
- **⚛️ New Architecture Ready:** Fully compatible with Fabric, Bridgeless mode, and React Native 0.83+.

---

## 📦 Installation

```sh
yarn add rn-aura react-native-reanimated react-native-gesture-handler react-native-safe-area-context react-native-vector-icons
```

> **Requirements:**
> - React Native 0.71+ (Recommended 0.83+ for Fabric)
> - Reanimated 3.0+
> - Gesture Handler 2.0+

---

## 🚀 Quick Setup

Wrap your root component in the `AuraProvider` to enable global features like the Dynamic Island.

```tsx
import { AuraProvider } from 'rn-aura';

export default function App() {
  return (
    <AuraProvider>
      <MainNavigator />
    </AuraProvider>
  );
}
```

---

## 🎨 Featured Components

### 🟢 Smart Inputs
| Component | Description |
| :--- | :--- |
| **`OtpInput`** | Auto-focusing, clipboard-ready, shake-on-error OTP boxes. |
| **`FloatingInput`** | Premium floating label input with "border-cut" masking. |
| **`RatingSwipe`** | High-precision star rating with 0.5 increment snapping. |
| **`PhoneInput`** | Masked phone input with international support. |

### 🔵 Modern Interaction
| Component | Description |
| :--- | :--- |
| **`AuraIsland`** | An intelligent, morphing status capsule (Dynamic Island). |
| **`SwipeButton`** | A slide-to-confirm action button with impact physics. |
| **`FluidSwitch`** | Liquid-motion toggle switch with spring-back physics. |
| **`BouncingCheckbox`** | Interactive checkbox with a satisfying impact bounce. |

### 🟣 Visuals & Layout
| Component | Description |
| :--- | :--- |
| **`Marquee`** | High-performance scrolling text tickers. |
| **`Skeleton`** | Shimmering placeholder components for loading states. |
| **`Box / Row / Column`** | Optimized flexbox primitives with utility-first spacing props. |
| **`Confetti`** | Full-screen celebratory particles. |

---

## 📖 Usage Examples

### OTP Input (One-Time Password)
```tsx
import { OtpInput } from 'rn-aura';

const [code, setCode] = useState('');

<OtpInput 
  length={4} 
  value={code} 
  onChange={setCode} 
  error={hasError} 
  autoFocus
/>
```

### Rating Swipe (Stars)
```tsx
import { RatingSwipe } from 'rn-aura';

<RatingSwipe 
  initialRating={4.5} 
  onRatingChange={(r) => console.log('Rated:', r)} 
  showSliderBackground 
/>
```

---

## 🗺️ Roadmap
- [ ] `StoryViewer` - Instagram-style story progression.
- [ ] `VideoPreview` - Autoplaying background video containers.
- [ ] `useShake` / `useBiometric` - Ready-to-use functional hooks.
- [ ] `ParallaxHeader` - Optimized scroll-driven image scaling.

---

## 📄 License

MIT © 2026 [Nishith Patel](https://github.com/pnishith)
