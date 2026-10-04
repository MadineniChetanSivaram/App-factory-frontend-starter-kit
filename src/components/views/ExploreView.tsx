// src/components/views/ExploreView.tsx
// Universal Explore Screen: Category Filters & Pre-Built Templates

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Layers, Plus, Compass } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';

const PRESET_TEMPLATES = [
  { title: 'Setup Authentication Flow', category: 'Security', priority: 'high' as const },
  { title: 'Add Push Notification Service', category: 'Alerts', priority: 'medium' as const },
  { title: 'Configure Database Backup', category: 'DevOps', priority: 'low' as const },
  { title: 'Verify Multi-Language Strings', category: 'i18n', priority: 'medium' as const },
];

export const ExploreView: React.FC = () => {
  const { addItem } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Security', 'Alerts', 'DevOps', 'i18n'];

  const handleAddPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    addItem({
      title: preset.title,
      category: preset.category,
      priority: preset.priority,
      status: 'pending',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Compass size={24} color="#38BDF8" />
        <Text style={styles.title}>Explore & Presets</Text>
      </View>
      <Text style={styles.subtitle}>
        Quickly seed your application with pre-configured templates.
      </Text>

      {/* Category Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
        <View style={styles.pillsRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.pill, selectedCategory === cat && styles.activePill]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.pillText, selectedCategory === cat && styles.activePillText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Templates List */}
      <Text style={styles.sectionHeader}>Quick-Add Starter Templates</Text>
      {PRESET_TEMPLATES.filter((p) => selectedCategory === 'All' || p.category === selectedCategory).map(
        (preset, idx) => (
          <View key={idx} style={styles.templateCard}>
            <View style={styles.templateInfo}>
              <Layers size={18} color="#38BDF8" />
              <View>
                <Text style={styles.templateTitle}>{preset.title}</Text>
                <Text style={styles.templateCat}>{preset.category}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddPreset(preset)}
              activeOpacity={0.7}
            >
              <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        )
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
  pillsScroll: {
    marginBottom: 24,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  activePill: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  pillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#94A3B8',
  },
  activePillText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  templateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  templateCat: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
