// src/components/views/ProfileView.tsx
// Universal Profile Screen: Language Switcher, Offline Sync Queue Status & API Config

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { User, Globe, RefreshCw, Shield, Server } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { BACKEND_BASE_URL } from '../../services/apiService';
import { SupportedLanguage } from '../../types';

export const ProfileView: React.FC = () => {
  const { user, language, setLanguage, syncQueue, syncOfflineQueue } = useApp();

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'es', label: 'Español' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <User size={36} color="#38BDF8" />
        </View>
        <Text style={styles.userName}>{user?.name || 'Explorer'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'user@universal.app'}</Text>
      </View>

      {/* Language Switcher */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Globe size={18} color="#38BDF8" />
          <Text style={styles.sectionTitle}>Preferred Language</Text>
        </View>
        <View style={styles.langGrid}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langButton, language === lang.code && styles.activeLangButton]}
              onPress={() => setLanguage(lang.code)}
            >
              <Text style={[styles.langText, language === lang.code && styles.activeLangText]}>
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Offline Sync Queue Monitor */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <RefreshCw size={18} color="#38BDF8" />
          <Text style={styles.sectionTitle}>Offline Sync Queue</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.queueRow}>
            <Text style={styles.queueLabel}>Pending Offline Actions:</Text>
            <Text style={styles.queueCount}>{syncQueue.length}</Text>
          </View>
          <Text style={styles.queueSub}>
            Actions taken without internet are automatically batched and queued here until reconnection.
          </Text>
          {syncQueue.length > 0 && (
            <TouchableOpacity style={styles.syncBtn} onPress={syncOfflineQueue}>
              <RefreshCw size={16} color="#FFFFFF" />
              <Text style={styles.syncBtnText}>Sync Pending Actions Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Backend API Configuration */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Server size={18} color="#38BDF8" />
          <Text style={styles.sectionTitle}>API Configuration</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.configLabel}>Target Backend URL:</Text>
          <Text style={styles.configValue}>{BACKEND_BASE_URL}</Text>
          <View style={styles.securityBadge}>
            <Shield size={14} color="#10B981" />
            <Text style={styles.securityText}>Bearer Token Refresh Active</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 110,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#38BDF8',
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  userEmail: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeLangButton: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  langText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  activeLangText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  queueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  queueLabel: {
    fontSize: 13.5,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  queueCount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#38BDF8',
  },
  queueSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
    lineHeight: 17,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 14,
    gap: 8,
  },
  syncBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  configLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  configValue: {
    fontSize: 13.5,
    color: '#38BDF8',
    fontWeight: '700',
    marginTop: 4,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  securityText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
});
