# Frontend App Starter Kit
> **A Production-Ready Multi-Platform Client Template for React Native, Expo & Web**

This is a standalone, domain-neutral starter kit. You can use it to build any application:
- **E-Commerce / Food Delivery**
- **FinTech / Banking & Expenses**
- **Healthcare & Doctor Appointments**
- **On-Demand Rides & Deliveries**
- **Social Media & Community**
- **Education & Quizzes**
- **Real Estate / Property Listings**
- **Enterprise SaaS & Field Operations**

---

## 🚀 Quick Start in 3 Steps

### 1. Configure Your Backend API
Open `src/services/apiService.ts` and set your backend URL:
```typescript
export const BACKEND_BASE_URL = 'https://your-api-domain.com';
```
*All JWT Bearer token headers, silent 401 token renewals, and offline queuing are already wired up.*

### 2. Define Your App's Core Data Shape
Open `src/types/index.ts` and define what your app tracks:
```typescript
export interface AppItem {
  id: string;
  title: string;
  category: string;
  status: 'pending' | 'in_progress' | 'completed';
  value?: number; // e.g. Price for products, points, amounts
}
```

### 3. Customize Your Item Card
Open `src/components/mobile/ItemCard.tsx` and customize how your items are displayed (images, price tags, action buttons).

---

## 📱 Running the App

### Start Local Development Server:
```bash
npm install
npm start
```
- Press `w` to open in your Web browser.
- Press `a` to open in Android emulator.
- Scan the QR code with Expo Go on your physical phone.

### Build Signed Production Android APK Locally:
Double-click `build-apk.bat`. In a few minutes, `UniversalApp.apk` will be created right in your project root!

---

## 🏗️ Project Architecture
```
universal-starter-kit/
├── assets/                          # App logos & icons
├── src/
│   ├── types/                       # Universal TypeScript types
│   ├── services/
│   │   ├── apiService.ts            # Centralized API client (Bearer tokens & auto-refresh)
│   │   ├── notificationService.ts   # In-app alert banners & push listener
│   │   ├── soundService.ts          # Cross-platform sound & haptics
│   │   └── translationService.ts    # Multi-language dictionary & cache
│   ├── context/
│   │   └── AppContext.tsx           # Reactive state & offline FIFO sync queue
│   ├── components/
│   │   ├── mobile/
│   │   │   ├── MobileShell.tsx      # Safe-area responsive phone frame
│   │   │   ├── BottomTabBar.tsx     # Modern bottom navigation bar
│   │   │   └── ItemCard.tsx         # Reusable card component
│   │   ├── modals/
│   │   │   └── AddItemModal.tsx     # Height-constrained create/edit modal
│   │   ├── common/
│   │   │   ├── AiAssistantDrawer.tsx# In-app AI helper (Cloud + Offline)
│   │   │   └── NotificationBanner.tsx# Top slide-down alert banner
│   │   └── views/
│   │       ├── HomeView.tsx         # Main dashboard
│   │       ├── ExploreView.tsx      # Category explorer & presets
│   │       ├── AnalyticsView.tsx    # Completion stats & metrics
│   │       └── ProfileView.tsx      # Language switcher & offline queue monitor
│   └── utils/
│       └── aiAssistantEngine.ts     # Offline fallback rule engine
├── App.tsx                          # App root
├── app.json                         # Expo configuration
├── build-apk.bat                    # 1-Click Android APK build script
└── package.json
```
