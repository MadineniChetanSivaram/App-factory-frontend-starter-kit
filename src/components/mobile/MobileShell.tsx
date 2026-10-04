// src/components/mobile/MobileShell.tsx
// Universal Viewport Container: Safe-Area Padding on Native Mobile & Centered Max-Width on Web Desktop

import React, { ReactNode } from 'react';
import { StyleSheet, View, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MobileShellProps {
  children: ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  return (
    <View style={styles.outerBackground}>
      <StatusBar barStyle="light-content" backgroundColor="#0B132B" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.innerContainer}>{children}</View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerBackground: {
    flex: 1,
    backgroundColor: '#070D1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    backgroundColor: '#0B132B',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#1E293B',
      },
    }),
  },
  innerContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
});
