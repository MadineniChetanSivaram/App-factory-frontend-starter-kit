// src/components/mobile/BottomTabBar.tsx
// Floating Bottom Navigation with Elevated Center Action Button

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Home, Compass, BarChart2, User, Plus } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../services/soundService';

interface BottomTabBarProps {
  onOpenAddModal: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ onOpenAddModal }) => {
  const { activeTab, setActiveTab } = useApp();

  const handleTabPress = (tab: string) => {
    soundService.playTap();
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {/* Home */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress('home')}
          activeOpacity={0.7}
        >
          <Home size={22} color={activeTab === 'home' ? '#38BDF8' : '#64748B'} />
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.activeTabLabel]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Explore */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress('explore')}
          activeOpacity={0.7}
        >
          <Compass size={22} color={activeTab === 'explore' ? '#38BDF8' : '#64748B'} />
          <Text style={[styles.tabLabel, activeTab === 'explore' && styles.activeTabLabel]}>
            Explore
          </Text>
        </TouchableOpacity>

        {/* Center Floating Plus Action */}
        <View style={styles.centerActionWrapper}>
          <TouchableOpacity
            style={styles.centerActionButton}
            onPress={() => {
              soundService.playTap();
              onOpenAddModal();
            }}
            activeOpacity={0.85}
          >
            <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Analytics */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress('analytics')}
          activeOpacity={0.7}
        >
          <BarChart2 size={22} color={activeTab === 'analytics' ? '#38BDF8' : '#64748B'} />
          <Text style={[styles.tabLabel, activeTab === 'analytics' && styles.activeTabLabel]}>
            Stats
          </Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress('profile')}
          activeOpacity={0.7}
        >
          <User size={22} color={activeTab === 'profile' ? '#38BDF8' : '#64748B'} />
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.activeTabLabel]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      default: {
        elevation: 8,
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  centerActionWrapper: {
    position: 'relative',
    top: -14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  centerActionButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#0B132B',
  },
});
