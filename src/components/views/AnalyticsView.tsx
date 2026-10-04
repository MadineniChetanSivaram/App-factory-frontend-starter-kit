// src/components/views/AnalyticsView.tsx
// Universal Analytics & Metrics View: Completion Rates & Priority Distribution

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart2, CheckCircle, Clock } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { items } = useApp();

  const total = items.length;
  const completed = items.filter((i) => i.status === 'completed').length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const highPriority = items.filter((i) => i.priority === 'high').length;
  const mediumPriority = items.filter((i) => i.priority === 'medium').length;
  const lowPriority = items.filter((i) => i.priority === 'low').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <BarChart2 size={24} color="#38BDF8" />
        <Text style={styles.title}>Performance & Stats</Text>
      </View>
      <Text style={styles.subtitle}>
        Real-time metrics computed directly on your device.
      </Text>

      {/* Completion Rate Big Card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Completion Rate</Text>
        <Text style={styles.heroPercentage}>{rate}%</Text>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${rate}%` }]} />
        </View>
        <View style={styles.heroFooter}>
          <View style={styles.heroFooterItem}>
            <CheckCircle size={14} color="#10B981" />
            <Text style={styles.heroFooterText}>{completed} Completed</Text>
          </View>
          <View style={styles.heroFooterItem}>
            <Clock size={14} color="#F59E0B" />
            <Text style={styles.heroFooterText}>{total - completed} Remaining</Text>
          </View>
        </View>
      </View>

      {/* Priority Distribution */}
      <Text style={styles.sectionTitle}>Priority Breakdown</Text>
      <View style={styles.breakdownCard}>
        <View style={styles.breakdownRow}>
          <Text style={styles.priorityLabel}>High Priority</Text>
          <Text style={[styles.priorityValue, { color: '#EF4444' }]}>{highPriority}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.priorityLabel}>Medium Priority</Text>
          <Text style={[styles.priorityValue, { color: '#F59E0B' }]}>{mediumPriority}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.priorityLabel}>Low Priority</Text>
          <Text style={[styles.priorityValue, { color: '#38BDF8' }]}>{lowPriority}</Text>
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
    paddingTop: 16,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 20,
  },
  heroCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 24,
  },
  heroLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  heroPercentage: {
    fontSize: 44,
    fontWeight: '800',
    color: '#38BDF8',
    marginVertical: 8,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 4,
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  heroFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroFooterText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  breakdownCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 14,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityLabel: {
    fontSize: 13.5,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  priorityValue: {
    fontSize: 15,
    fontWeight: '700',
  },
});
