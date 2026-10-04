// App.tsx
// Universal Production Application Root

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { MobileShell } from './src/components/mobile/MobileShell';
import { BottomTabBar } from './src/components/mobile/BottomTabBar';
import { AddItemModal } from './src/components/modals/AddItemModal';
import { NotificationBanner } from './src/components/common/NotificationBanner';
import { AiAssistantDrawer } from './src/components/common/AiAssistantDrawer';
import { HomeView } from './src/components/views/HomeView';
import { ExploreView } from './src/components/views/ExploreView';
import { AnalyticsView } from './src/components/views/AnalyticsView';
import { ProfileView } from './src/components/views/ProfileView';

const MainScreen: React.FC = () => {
  const { activeTab } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'explore':
        return <ExploreView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'profile':
        return <ProfileView />;
      case 'home':
      default:
        return <HomeView />;
    }
  };

  return (
    <MobileShell>
      {/* Real-Time Slide-Down Alert Banner */}
      <NotificationBanner />

      {/* Active Screen View */}
      <View style={styles.screenWrapper}>{renderActiveView()}</View>

      {/* Floating In-App AI Assistant Drawer */}
      <AiAssistantDrawer />

      {/* Bottom Floating Navigation Bar */}
      <BottomTabBar onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Height-Constrained Create/Edit Modal */}
      <AddItemModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </MobileShell>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainScreen />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
});
