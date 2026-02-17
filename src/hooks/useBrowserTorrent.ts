import { useCallback, useEffect, useState } from 'react';
import { browserTorrentClient } from '../lib/webtorrentClient';
import type { GlobalStats, TorrentItem } from '../types/torrent';

export function useBrowserTorrent() {
  const [torrents, setTorrents] = useState<TorrentItem[]>([]);
  const [stats, setStats] = useState<GlobalStats>({
    totalDownloadSpeed: '0 KB/s',
    totalUploadSpeed: '0 KB/s',
    activeTorrents: 0,
    totalTorrents: 0,
    totalDownloaded: '0 B',
    totalUploaded: '0 B',
    dhtNodes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if WebTorrent is supported
    if (typeof window === 'undefined' || !WebTorrent.WEBRTC_SUPPORT) {
      setError('Your browser does not support WebRTC. Please use a modern browser like Chrome, Firefox, or Edge.');
      setIsLoading(false);
      return;
    }

    setIsConnected(true);
    setError(null);
    setIsLoading(false);

    // Update torrents and stats periodically
    const updateState = () => {
      setTorrents(browserTorrentClient.getTorrents());
      setStats(browserTorrentClient.getStats());
    };

    // Initial update
    updateState();

    // Listen for torrent events
    browserTorrentClient.on('torrent', updateState);
    browserTorrentClient.on('error', (err: Error) => {
      setError(err.message);
    });

    // Update every second
    const interval = setInterval(updateState, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const addTorrent = useCallback(
    async (source: string): Promise<void> => {
      try {
        await browserTorrentClient.addTorrent(source);
        setTorrents(browserTorrentClient.getTorrents());
        setStats(browserTorrentClient.getStats());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add torrent');
        throw err;
      }
    },
    []
  );

  const uploadTorrent = useCallback(
    async (file: File): Promise<void> => {
      try {
        await browserTorrentClient.uploadTorrent(file);
        setTorrents(browserTorrentClient.getTorrents());
        setStats(browserTorrentClient.getStats());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload torrent');
        throw err;
      }
    },
    []
  );

  const pauseTorrent = useCallback(
    (id: string): void => {
      browserTorrentClient.pauseTorrent(id);
      setTorrents(browserTorrentClient.getTorrents());
      setStats(browserTorrentClient.getStats());
    },
    []
  );

  const resumeTorrent = useCallback(
    (id: string): void => {
      browserTorrentClient.resumeTorrent(id);
      setTorrents(browserTorrentClient.getTorrents());
      setStats(browserTorrentClient.getStats());
    },
    []
  );

  const removeTorrent = useCallback(
    (id: string): void => {
      browserTorrentClient.removeTorrent(id);
      setTorrents(browserTorrentClient.getTorrents());
      setStats(browserTorrentClient.getStats());
    },
    []
  );

  const getFileStreamUrl = useCallback(
    (torrentId: string, fileIndex: number): string => {
      return browserTorrentClient.getFileUrl(torrentId, fileIndex);
    },
    []
  );

  const getTorrentFiles = useCallback(
    (torrentId: string) => {
      const torrent = browserTorrentClient.client.get(torrentId);
      if (!torrent) {
        return { files: [] };
      }

      return {
        files: torrent.files.map((file, index) => ({
          index,
          name: file.name,
          size: formatBytes(file.length),
          path: file.path,
          streamable: isStreamableFile(file.name),
        })),
      };
    },
    []
  );

  return {
    torrents,
    stats,
    isLoading,
    isConnected,
    error,
    addTorrent,
    uploadTorrent,
    pauseTorrent,
    resumeTorrent,
    removeTorrent,
    getFileStreamUrl,
    getTorrentFiles,
  };
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const decimals = value >= 100 || unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}

function isStreamableFile(name: string): boolean {
  const ext = name.toLowerCase().split('.').pop();
  return ['mp4', 'mkv', 'webm', 'mp3', 'wav', 'flac', 'ogg'].includes(ext || '');
}
