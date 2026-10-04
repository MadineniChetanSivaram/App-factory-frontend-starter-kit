// src/components/common/AiAssistantDrawer.tsx
// Dual-Brain In-App AI Assistant Drawer with Cloud LLM + Local Rule Engine Fallback

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Sparkles, Send, X, Bot, User } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { generateLocalAssistantResponse } from '../../utils/aiAssistantEngine';
import { soundService } from '../../services/soundService';
import { ChatMessage } from '../../types';

export const AiAssistantDrawer: React.FC = () => {
  const { user, items, activeTab } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Hi! I am your AI copilot. How can I assist you with your tasks or questions today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [isOpen, messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    soundService.playTap();
    const userText = input.trim();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const context = { user, items, activeScreen: activeTab };

    try {
      // 1. Try remote Cloud AI endpoint
      const res = await apiService.request<{ reply: string }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: userText,
          context: {
            userName: user?.name,
            activeScreen: activeTab,
            itemCount: items.length,
          },
        }),
      });

      if (res.ok && res.data?.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `reply-${Date.now()}`,
            sender: 'assistant',
            text: res.data!.reply,
            timestamp: new Date().toISOString(),
          },
        ]);
        soundService.playSuccess();
        setIsLoading(false);
        return;
      }
    } catch {
      // Offline fallback
    }

    // 2. Offline / unauthenticated local rule engine fallback
    const localReply = generateLocalAssistantResponse(userText, context);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'assistant',
          text: localReply,
          timestamp: new Date().toISOString(),
        },
      ]);
      soundService.playSuccess();
      setIsLoading(false);
    }, 350);
  };

  return (
    <>
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          soundService.playTap();
          setIsOpen(true);
        }}
        activeOpacity={0.85}
      >
        <Sparkles size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Chat Modal Drawer */}
      <Modal visible={isOpen} transparent animationType="slide" onRequestClose={() => setIsOpen(false)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setIsOpen(false)} />

          <View style={styles.drawerContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.botIcon}>
                  <Bot size={18} color="#38BDF8" />
                </View>
                <View>
                  <Text style={styles.headerTitle}>AI Assistant</Text>
                  <Text style={styles.headerSub}>Always ready (Online & Offline)</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeBtn}>
                <X size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Chat Messages */}
            <ScrollView ref={scrollRef} style={styles.messagesScroll} contentContainerStyle={styles.messagesContent}>
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <View key={m.id} style={[styles.bubbleRow, isUser ? styles.userRow : styles.botRow]}>
                    {!isUser && (
                      <View style={styles.avatar}>
                        <Bot size={14} color="#38BDF8" />
                      </View>
                    )}
                    <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
                      <Text style={[styles.bubbleText, isUser && styles.userBubbleText]}>{m.text}</Text>
                    </View>
                    {isUser && (
                      <View style={[styles.avatar, styles.userAvatar]}>
                        <User size={14} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                );
              })}
              {isLoading && (
                <View style={styles.botRow}>
                  <View style={styles.avatar}>
                    <Bot size={14} color="#38BDF8" />
                  </View>
                  <View style={styles.botBubble}>
                    <Text style={styles.bubbleText}>Thinking...</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input Footer */}
            <View style={styles.inputFooter}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask me anything..."
                placeholderTextColor="#64748B"
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity
                style={[styles.sendButton, !input.trim() && styles.disabledSend]}
                onPress={handleSend}
                disabled={!input.trim()}
              >
                <Send size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 84,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 900,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  drawerContainer: {
    height: '78%',
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#1E293B',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  headerSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  closeBtn: {
    padding: 6,
  },
  messagesScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
    gap: 12,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  userAvatar: {
    backgroundColor: '#0284C7',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#0284C7',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 13.5,
    color: '#E2E8F0',
    lineHeight: 19,
  },
  userBubbleText: {
    color: '#FFFFFF',
  },
  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 14,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledSend: {
    opacity: 0.4,
  },
});
