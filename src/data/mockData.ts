export interface TorrentItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  downloadSpeed: string;
  uploadSpeed: string;
  seeds: number;
  peers: number;
  status: 'downloading' | 'seeding' | 'paused' | 'queued' | 'completed';
  eta: string;
  ratio: number;
  added: string;
  category: string;
}

export const torrents: TorrentItem[] = [
  {
    id: '1',
    name: 'Ubuntu 24.04 LTS Desktop (amd64)',
    size: '4.7 GB',
    progress: 73,
    downloadSpeed: '12.4 MB/s',
    uploadSpeed: '2.1 MB/s',
    seeds: 1842,
    peers: 234,
    status: 'downloading',
    eta: '4m 23s',
    ratio: 0.42,
    added: '2 min ago',
    category: 'Linux ISOs',
  },
  {
    id: '2',
    name: 'Blender 4.1 — Open Source 3D Suite',
    size: '312 MB',
    progress: 100,
    downloadSpeed: '0 KB/s',
    uploadSpeed: '5.8 MB/s',
    seeds: 3201,
    peers: 87,
    status: 'seeding',
    eta: '∞',
    ratio: 2.14,
    added: '1 hour ago',
    category: 'Software',
  },
  {
    id: '3',
    name: 'Fedora Workstation 40 Live x86_64',
    size: '2.1 GB',
    progress: 45,
    downloadSpeed: '8.7 MB/s',
    uploadSpeed: '1.3 MB/s',
    seeds: 923,
    peers: 156,
    status: 'downloading',
    eta: '12m 08s',
    ratio: 0.18,
    added: '5 min ago',
    category: 'Linux ISOs',
  },
  {
    id: '4',
    name: 'LibreOffice 24.2 Full Suite — All Platforms',
    size: '1.8 GB',
    progress: 12,
    downloadSpeed: '3.2 MB/s',
    uploadSpeed: '0.4 MB/s',
    seeds: 445,
    peers: 89,
    status: 'downloading',
    eta: '34m 12s',
    ratio: 0.05,
    added: '8 min ago',
    category: 'Software',
  },
  {
    id: '5',
    name: 'Arch Linux 2024.06.01 (x86_64)',
    size: '891 MB',
    progress: 100,
    downloadSpeed: '0 KB/s',
    uploadSpeed: '0 KB/s',
    seeds: 2100,
    peers: 45,
    status: 'completed',
    eta: '—',
    ratio: 1.87,
    added: '3 hours ago',
    category: 'Linux ISOs',
  },
  {
    id: '6',
    name: 'GIMP 2.10.38 AppImage Bundle',
    size: '245 MB',
    progress: 0,
    downloadSpeed: '0 KB/s',
    uploadSpeed: '0 KB/s',
    seeds: 678,
    peers: 12,
    status: 'queued',
    eta: 'Queued',
    ratio: 0,
    added: '10 min ago',
    category: 'Software',
  },
  {
    id: '7',
    name: 'Debian 12.5 DVD (amd64) — Complete',
    size: '3.9 GB',
    progress: 88,
    downloadSpeed: '0 KB/s',
    uploadSpeed: '0 KB/s',
    seeds: 1200,
    peers: 340,
    status: 'paused',
    eta: 'Paused',
    ratio: 0.33,
    added: '30 min ago',
    category: 'Linux ISOs',
  },
];

export const globalStats = {
  totalDownloadSpeed: '24.3 MB/s',
  totalUploadSpeed: '9.6 MB/s',
  activeTorrents: 3,
  totalTorrents: 7,
  totalDownloaded: '48.2 GB',
  totalUploaded: '22.7 GB',
  dhtNodes: 847,
};
