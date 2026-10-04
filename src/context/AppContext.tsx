// src/context/AppContext.tsx
// Central Reactive State Store with Offline-First Persistence & FIFO Mutation Queue

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppItem, UserProfile, SyncMutation, SupportedLanguage } from '../types';
import { apiService } from '../services/apiService';
import { soundService } from '../services/soundService';
import { notificationService } from '../services/notificationService';
import { translationService } from '../services/translationService';

interface AppContextType {
  user: UserProfile | null;
  items: AppItem[];
  activeTab: string;
  language: SupportedLanguage;
  syncQueue: SyncMutation[];
  setActiveTab: (tab: string) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  addItem: (item: Omit<AppItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, updates: Partial<AppItem>) => void;
  deleteItem: (id: string) => void;
  toggleItemStatus: (id: string) => void;
  syncOfflineQueue: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: '@app_user_v1',
  ITEMS: '@app_items_v1',
  QUEUE: '@app_sync_queue_v1',
  LANG: '@app_lang_v1',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>({
    id: 'user-demo-1',
    name: 'Explorer',
    email: 'explorer@universal.app',
    preferredLanguage: 'en',
    createdAt: new Date().toISOString(),
  });
  const [items, setItems] = useState<AppItem[]>([]);
  const [syncQueue, setSyncQueue] = useState<SyncMutation[]>([]);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  // Hydrate local database on app start
  useEffect(() => {
    const hydrate = async () => {
      try {
        const [savedItems, savedQueue, savedLang] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.ITEMS),
          AsyncStorage.getItem(STORAGE_KEYS.QUEUE),
          AsyncStorage.getItem(STORAGE_KEYS.LANG),
        ]);

        if (savedItems) {
          setItems(JSON.parse(savedItems));
        } else {
          // Initial starter sample items
          const sampleItems: AppItem[] = [
            {
              id: 'item-1',
              title: 'Explore Universal Architecture',
              description: 'Review the clean offline sync queue and modular services.',
              category: 'Onboarding',
              status: 'completed',
              priority: 'high',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: 'item-2',
              title: 'Connect Your Backend API',
              description: 'Open src/services/apiService.ts and set your endpoint URL.',
              category: 'Setup',
              status: 'in_progress',
              priority: 'high',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: 'item-3',
              title: 'Build Android Release APK',
              description: 'Run build-apk.bat to generate a production installer on your laptop.',
              category: 'Deployment',
              status: 'pending',
              priority: 'medium',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
          setItems(sampleItems);
          AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(sampleItems)).catch(() => {});
        }

        if (savedQueue) {
          setSyncQueue(JSON.parse(savedQueue));
        }

        if (savedLang) {
          const l = savedLang as SupportedLanguage;
          setLanguageState(l);
          translationService.setLanguage(l);
        }
      } catch {}
    };

    hydrate();
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    translationService.setLanguage(lang);
    AsyncStorage.setItem(STORAGE_KEYS.LANG, lang).catch(() => {});
  }, []);

  // Enqueue offline action
  const enqueueMutation = useCallback((endpoint: string, method: SyncMutation['method'], payload: unknown) => {
    const mutation: SyncMutation = {
      id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      endpoint,
      method,
      payload,
      timestamp: new Date().toISOString(),
      status: 'pending',
      retryCount: 0,
    };

    setSyncQueue((prev) => {
      const next = [...prev, mutation];
      AsyncStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  // Add Item (0ms Optimistic Update)
  const addItem = useCallback(
    (itemData: Omit<AppItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      soundService.playTap();
      const newItem: AppItem = {
        ...itemData,
        id: `item-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setItems((prev) => {
        const next = [newItem, ...prev];
        AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(next)).catch(() => {});
        return next;
      });

      notificationService.showSuccess('Created', `"${newItem.title}" added to your workspace.`);

      // Send to API or queue offline
      apiService
        .request('/items', { method: 'POST', body: JSON.stringify(newItem) })
        .then((res) => {
          if (!res.ok) {
            enqueueMutation('/items', 'POST', newItem);
          }
        })
        .catch(() => {
          enqueueMutation('/items', 'POST', newItem);
        });
    },
    [enqueueMutation]
  );

  // Update Item (0ms Optimistic Update)
  const updateItem = useCallback(
    (id: string, updates: Partial<AppItem>) => {
      soundService.playTap();
      setItems((prev) => {
        const next = prev.map((item) =>
          item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
        );
        AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(next)).catch(() => {});
        return next;
      });

      apiService
        .request(`/items/${id}`, { method: 'PATCH', body: JSON.stringify(updates) })
        .then((res) => {
          if (!res.ok) {
            enqueueMutation(`/items/${id}`, 'PATCH', updates);
          }
        })
        .catch(() => {
          enqueueMutation(`/items/${id}`, 'PATCH', updates);
        });
    },
    [enqueueMutation]
  );

  // Delete Item (0ms Optimistic Update)
  const deleteItem = useCallback(
    (id: string) => {
      soundService.playTap();
      setItems((prev) => {
        const next = prev.filter((item) => item.id !== id);
        AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(next)).catch(() => {});
        return next;
      });

      notificationService.showInfo('Deleted', 'Item removed from workspace.');

      apiService
        .request(`/items/${id}`, { method: 'DELETE' })
        .then((res) => {
          if (!res.ok) {
            enqueueMutation(`/items/${id}`, 'DELETE', { id });
          }
        })
        .catch(() => {
          enqueueMutation(`/items/${id}`, 'DELETE', { id });
        });
    },
    [enqueueMutation]
  );

  // Toggle Item Status
  const toggleItemStatus = useCallback(
    (id: string) => {
      setItems((prev) => {
        const target = prev.find((item) => item.id === id);
        if (!target) return prev;

        const nextStatus = target.status === 'completed' ? 'pending' : 'completed';
        if (nextStatus === 'completed') {
          soundService.playSuccess();
          notificationService.showSuccess('Completed', `"${target.title}" marked as complete!`);
        } else {
          soundService.playTap();
        }

        const next = prev.map((item) =>
          item.id === id ? { ...item, status: nextStatus, updatedAt: new Date().toISOString() } : item
        );
        AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    []
  );

  // Sync Offline Queue Worker
  const syncOfflineQueue = useCallback(async () => {
    if (syncQueue.length === 0) return;

    const queueSnapshot = [...syncQueue];
    const successfulIds: string[] = [];

    for (const mutation of queueSnapshot) {
      try {
        const res = await apiService.request(mutation.endpoint, {
          method: mutation.method,
          body: mutation.payload ? JSON.stringify(mutation.payload) : undefined,
        });

        if (res.ok) {
          successfulIds.push(mutation.id);
        }
      } catch {
        break; // Stop draining on connection failure
      }
    }

    if (successfulIds.length > 0) {
      setSyncQueue((prev) => {
        const remaining = prev.filter((m) => !successfulIds.includes(m.id));
        AsyncStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(remaining)).catch(() => {});
        return remaining;
      });
    }
  }, [syncQueue]);

  return (
    <AppContext.Provider
      value={{
        user,
        items,
        activeTab,
        language,
        syncQueue,
        setActiveTab,
        setLanguage,
        addItem,
        updateItem,
        deleteItem,
        toggleItemStatus,
        syncOfflineQueue,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
