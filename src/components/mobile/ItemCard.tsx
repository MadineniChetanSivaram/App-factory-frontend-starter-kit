// src/components/mobile/ItemCard.tsx
// Universal Production Card Component with Glass Styling & 0ms Action Feedback

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { CheckCircle2, Circle, Trash2, Tag } from 'lucide-react-native';
import { AppItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface ItemCardProps {
  item: AppItem;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { toggleItemStatus, deleteItem } = useApp();
  const isCompleted = item.status === 'completed';

  return (
    <View style={[styles.card, isCompleted && styles.completedCard]}>
      <TouchableOpacity
        style={styles.checkArea}
        onPress={() => toggleItemStatus(item.id)}
        activeOpacity={0.7}
      >
        {isCompleted ? (
          <CheckCircle2 size={24} color="#10B981" />
        ) : (
          <Circle size={24} color="#64748B" />
        )}
      </TouchableOpacity>

      <View style={styles.contentArea}>
        <View style={styles.headerRow}>
          <Text
            style={[styles.title, isCompleted && styles.completedTitle]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </View>

        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={styles.badge}>
            <Tag size={12} color="#38BDF8" />
            <Text style={styles.badgeText}>{item.category || 'General'}</Text>
          </View>

          {item.priority && (
            <View
              style={[
                styles.priorityBadge,
                item.priority === 'high' && styles.priorityHigh,
                item.priority === 'medium' && styles.priorityMedium,
              ]}
            >
              <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id)}
        activeOpacity={0.7}
      >
        <Trash2 size={18} color="#94A3B8" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
      },
      default: {
        elevation: 3,
      },
    }),
  },
  completedCard: {
    opacity: 0.75,
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  checkArea: {
    paddingRight: 12,
  },
  contentArea: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  description: {
    fontSize: 12.5,
    color: '#94A3B8',
    marginTop: 3,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    color: '#38BDF8',
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#334155',
  },
  priorityHigh: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  priorityMedium: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  priorityText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 6,
  },
});
