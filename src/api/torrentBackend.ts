import type { BackendSnapshot, TorrentFilesResponse } from '../types/torrent';

const API_BASE = '/api';

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
