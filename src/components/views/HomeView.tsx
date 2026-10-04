// src/components/views/HomeView.tsx
// Universal Home Screen: Status Metrics, Search Filter, and Active Item Cards

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Search, Sparkles } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { ItemCard } from '../mobile/ItemCard';
import { translationService } from '../../services/translationService';

export const HomeView: React.FC = () => {
  const { user, items, language } = useApp();
  const [search, setSearch] = useState('');

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const filteredItems = items.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {translationService.translate('welcome', language)}, {user?.name || 'Explorer'} 👋
          </Text>
          <Text style={styles.subGreeting}>Your universal workspace is ready.</Text>
        </View>
      </View>

      {/* Quick Metrics Bar */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricNum}>{items.length}</Text>
          <Text style={styles.metricLabel}>Total Items</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricNum, { color: '#10B981' }]}>{completedCount}</Text>
          <Text style={styles.metricLabel}>Completed</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricNum, { color: '#F59E0B' }]}>
            {items.length - completedCount}
          </Text>
          <Text style={styles.metricLabel}>Pending</Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Search size={18} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items or categories..."
          placeholderTextColor="#64748B"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Items</Text>
        <Text style={styles.badgeCount}>{filteredItems.length}</Text>
      </View>

      {/* Item Cards List */}
      {filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Sparkles size={32} color="#64748B" />
          <Text style={styles.emptyTitle}>No items found</Text>
          <Text style={styles.emptySub}>
            Tap the '+' button in the bottom bar to add your first item!
          </Text>
        </View>
      ) : (
        filteredItems.map((item) => <ItemCard key={item.id} item={item} />)
      )}
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
    paddingTop: 16,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subGreeting: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#38BDF8',
  },
  metricLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '600',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
    marginBottom: 22,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#F8FAFC',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  badgeCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  emptySub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 240,
  },
});
