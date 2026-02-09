import { useCallback, useEffect, useState } from 'react';
import { torrentBackendApi } from '../api/torrentBackend';
import type { BackendSnapshot, GlobalStats } from '../types/torrent';

const EMPTY_STATS: GlobalStats = {
  totalDownloadSpeed: '0 KB/s',
  totalUploadSpeed: '0 KB/s',
  activeTorrents: 0,
  totalTorrents: 0,
  totalDownloaded: '0 B',
  totalUploaded: '0 B',
  dhtNodes: 0,
};

const EMPTY_SNAPSHOT: BackendSnapshot = {
  torrents: [],
  stats: EMPTY_STATS,
};

export function useTorrentBackend() {
  const [snapshot, setSnapshot] = useState<BackendSnapshot>(EMPTY_SNAPSHOT);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  const refresh = useCallback(async (silent = false) => {
    try {
      const nextSnapshot = await torrentBackendApi.getSnapshot();
      setSnapshot(nextSnapshot);
      setIsConnected(true);
      setError(null);
    } catch (refreshError) {
      setIsConnected(false);
      setError(refreshError instanceof Error ? refreshError.message : 'Failed to contact backend.');
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void refresh();

    const eventSource = new EventSource(torrentBackendApi.getEventStreamUrl());
    eventSource.onopen = () => {
      setIsConnected(true);
      setIsRealtimeConnected(true);
      setError(null);
    };
    eventSource.onmessage = (event) => {
      try {
        const nextSnapshot = JSON.parse(event.data) as BackendSnapshot;
        setSnapshot(nextSnapshot);
      } catch {
        // Ignore malformed SSE payloads and rely on polling fallback.
      }
    };
    eventSource.onerror = () => {
      setIsRealtimeConnected(false);
    };

    const timer = window.setInterval(() => {
      void refresh(true);
    }, 1500);

    return () => {
      eventSource.close();
      window.clearInterval(timer);
    };
  }, [refresh]);

  const applyMutation = useCallback(async (operation: () => Promise<BackendSnapshot>) => {
    const nextSnapshot = await operation();
    setSnapshot(nextSnapshot);
    setIsConnected(true);
    setError(null);
  }, []);

  const addTorrent = useCallback(
    async (source: string) => {
      await applyMutation(() => torrentBackendApi.addTorrent(source));
    },
    [applyMutation],
  );

  const uploadTorrent = useCallback(
    async (file: File) => {
      await applyMutation(() => torrentBackendApi.uploadTorrent(file));
    },
    [applyMutation],
  );

  const pauseTorrent = useCallback(
    async (id: string) => {
      await applyMutation(() => torrentBackendApi.pauseTorrent(id));
    },
    [applyMutation],
  );

  const resumeTorrent = useCallback(
    async (id: string) => {
      await applyMutation(() => torrentBackendApi.resumeTorrent(id));
    },
    [applyMutation],
  );

  const removeTorrent = useCallback(
    async (id: string) => {
      await applyMutation(() => torrentBackendApi.removeTorrent(id));
    },
    [applyMutation],
  );

  return {
    torrents: snapshot.torrents,
    stats: snapshot.stats,
    isLoading,
    isConnected,
    isRealtimeConnected,
    error,
    refresh,
    addTorrent,
    uploadTorrent,
    pauseTorrent,
    resumeTorrent,
    removeTorrent,
  };
}
