// src/types/index.ts
// Universal Domain-Agnostic Types for ANY Application

export type SupportedLanguage = 'en' | 'hi' | 'te' | 'ta' | 'es';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  preferredLanguage: SupportedLanguage;
  createdAt: string;
}

export type ItemStatus = 'pending' | 'in_progress' | 'completed' | 'archived';

export interface AppItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: ItemStatus;
  priority?: 'low' | 'medium' | 'high';
  value?: number; // e.g. Price for products, points, amounts, or metrics
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SyncMutation {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  payload: unknown;
  timestamp: string;
  status: 'pending' | 'syncing' | 'failed';
  retryCount: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  actionUrl?: string;
  timestamp: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
