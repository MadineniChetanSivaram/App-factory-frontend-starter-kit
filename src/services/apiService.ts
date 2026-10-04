// src/services/apiService.ts
// Universal Production-Ready API Client with Automated Bearer Tokens & Silent Refresh

import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚙️ CONFIGURE YOUR BACKEND ENDPOINT HERE
export const BACKEND_BASE_URL = 'https://your-api-domain.com';

export interface ApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  offline?: boolean;
}

class ApiService {
  public baseUrl: string = BACKEND_BASE_URL;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.hydrateTokens();
  }

  private async hydrateTokens(): Promise<void> {
    try {
      const [storedAccess, storedRefresh] = await Promise.all([
        AsyncStorage.getItem('app_auth_token'),
        AsyncStorage.getItem('app_refresh_token'),
      ]);
      this.accessToken = storedAccess;
      this.refreshToken = storedRefresh;
    } catch {
      // Storage hydration fallback
    }
  }

  public setTokens(accessToken: string | null, refreshToken?: string | null): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken ?? null;

    if (accessToken) {
      AsyncStorage.setItem('app_auth_token', accessToken).catch(() => {});
    } else {
      AsyncStorage.removeItem('app_auth_token').catch(() => {});
    }

    if (refreshToken) {
      AsyncStorage.setItem('app_refresh_token', refreshToken).catch(() => {});
    } else {
      AsyncStorage.removeItem('app_refresh_token').catch(() => {});
    }
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  public async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const isPublicAuth = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
    
    // Guest fallback if unauthenticated on protected routes
    if (!isPublicAuth && !this.accessToken && !this.refreshToken) {
      return { ok: false, status: 401, error: 'Unauthenticated session' };
    }

    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 token expiration silently
      if (res.status === 401 && this.refreshToken) {
        const refreshSuccessful = await this.executeTokenRefresh();
        if (refreshSuccessful && this.accessToken) {
          headers['Authorization'] = `Bearer ${this.accessToken}`;
          const retryRes = await fetch(url, { ...options, headers });
          const retryJson = await retryRes.json().catch(() => ({}));
          return { ok: retryRes.ok, status: retryRes.status, data: retryJson as T };
        }
      }

      const json = await res.json().catch(() => ({}));
      return {
        ok: res.ok,
        status: res.status,
        data: res.ok ? (json as T) : undefined,
        error: res.ok ? undefined : (json?.message || `Request failed (${res.status})`),
      };
    } catch (err: any) {
      // Network drop / offline status 0
      return {
        ok: false,
        status: 0,
        offline: true,
        error: err?.message || 'Network unreachable. Queued for offline sync.',
      };
    }
  }

  private async executeTokenRefresh(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload?.accessToken) {
          this.setTokens(payload.accessToken, payload.refreshToken || this.refreshToken);
          return true;
        }
      }
    } catch {
      // Refresh error
    }

    // Refresh failed -> clear session
    this.setTokens(null, null);
    return false;
  }
}

export const apiService = new ApiService();
