import type { BackendSnapshot, TorrentFilesResponse } from '../types/torrent';

const DEFAULT_BACKEND_ORIGIN = 'http://127.0.0.1:3001';

function resolveApiBase() {
  const explicitApiBase = import.meta.env.VITE_TORRENTIO_API_BASE?.trim();
  if (explicitApiBase) {
    return explicitApiBase.replace(/\/+$/, '');
  }

  if (typeof window === 'undefined') {
    return '/api';
  }

  const { protocol, port } = window.location;
  const isViteDevServer = (protocol === 'http:' || protocol === 'https:') && port === '5173';

  if (isViteDevServer) {
    return '/api';
  }

  // In production build without Vite proxy, route directly to the backend.
  return `${DEFAULT_BACKEND_ORIGIN}/api`;
}

const API_BASE = resolveApiBase();

class BackendRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'BackendRequestError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = init?.body instanceof FormData;
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(init?.headers ?? {}),
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload
        ? String(payload.error)
        : `${response.status} ${response.statusText}`;
    throw new BackendRequestError(response.status, message);
  }

  if (!payload || typeof payload !== 'object') {
    throw new BackendRequestError(
      response.status,
      'Invalid backend response. Ensure the backend is running on http://127.0.0.1:3001.',
    );
  }

  return payload as T;
}

export const torrentBackendApi = {
  getSnapshot() {
    return request<BackendSnapshot>('/torrents');
  },

  addTorrent(source: string) {
    return request<BackendSnapshot>('/torrents', {
      method: 'POST',
      body: JSON.stringify({ source }),
    });
  },

  uploadTorrent(file: File) {
    const formData = new FormData();
    formData.append('torrent', file);
    return request<BackendSnapshot>('/torrents/upload', {
      method: 'POST',
      body: formData,
    });
  },

  pauseTorrent(id: string) {
    return request<BackendSnapshot>(`/torrents/${encodeURIComponent(id)}/pause`, {
      method: 'POST',
    });
  },

  resumeTorrent(id: string) {
    return request<BackendSnapshot>(`/torrents/${encodeURIComponent(id)}/resume`, {
      method: 'POST',
    });
  },

  removeTorrent(id: string) {
    return request<BackendSnapshot>(`/torrents/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  getTorrentFiles(id: string) {
    return request<TorrentFilesResponse>(`/torrents/${encodeURIComponent(id)}/files`);
  },

  getEventStreamUrl() {
    return `${API_BASE}/events`;
  },

  getFileStreamUrl(id: string, index: number) {
    return `${API_BASE}/torrents/${encodeURIComponent(id)}/files/${index}/stream`;
  },
};
