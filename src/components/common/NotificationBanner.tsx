// src/components/common/NotificationBanner.tsx
// Universal Slide-Down Top Alert Banner with Spring Animation & Auto-Dismiss

import React, { useState, useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { CheckCircle2, AlertTriangle, Info, Bell } from 'lucide-react-native';
import { notificationService } from '../../services/notificationService';
import { AppNotification } from '../../types';

export const NotificationBanner: React.FC = () => {
  const [current, setCurrent] = useState<AppNotification | null>(null);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notification) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setCurrent(notification);

      // Slide in
      Animated.spring(slideAnim, {
        toValue: 16,
        useNativeDriver: true,
        bounciness: 8,
      }).start();

      // Auto dismiss after 3.8s
      timeoutRef.current = setTimeout(() => {
        dismiss();
      }, 3800);
    });

    return () => {
      unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [slideAnim]);

  const dismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -120,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setCurrent(null);
    });
  };

  if (!current) return null;

  const renderIcon = () => {
    switch (current.type) {
      case 'success':
        return <CheckCircle2 size={20} color="#10B981" />;
      case 'alert':
        return <AlertTriangle size={20} color="#EF4444" />;
      case 'info':
        return <Info size={20} color="#38BDF8" />;
      default:
        return <Bell size={20} color="#F59E0B" />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.bannerContainer,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <TouchableOpacity style={styles.banner} onPress={dismiss} activeOpacity={0.9}>
        {renderIcon()}
        <Animated.View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {current.title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {current.message}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.45)',
      },
      default: {
        elevation: 8,
      },
    }),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  message: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
});
