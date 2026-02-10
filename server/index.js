import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import multer from 'multer';
import WebTorrent from 'webtorrent';

const HOST = process.env.HOST ?? '127.0.0.1';
const PORT = Number(process.env.PORT ?? 3001);
const DOWNLOAD_DIR = process.env.TORRENTIO_DOWNLOAD_DIR
  ? path.resolve(process.env.TORRENTIO_DOWNLOAD_DIR)
  : path.join(process.cwd(), 'downloads');

const app = express();
const client = new WebTorrent();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const torrentMetadata = new WeakMap();
const sseClients = new Set();

fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

app.use(
  cors({
    origin: true,
    credentials: false,
  }),
);
app.use(express.json({ limit: '1mb' }));

function toErrorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
}

function formatBytes(bytes) {
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

function formatSpeed(bytesPerSecond) {
  if (!Number.isFinite(bytesPerSecond) || bytesPerSecond <= 0) {
    return '0 KB/s';
  }

  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
  let value = bytesPerSecond;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const decimals = value >= 100 || unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '∞';
  }

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }

  return `${secs}s`;
}

function formatRelativeTime(dateMs) {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - dateMs) / 1000));
  if (elapsedSeconds < 60) {
    return `${elapsedSeconds} sec ago`;
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} min ago`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return `${elapsedHours} hour${elapsedHours === 1 ? '' : 's'} ago`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);
  return `${elapsedDays} day${elapsedDays === 1 ? '' : 's'} ago`;
}

function inferCategory(name) {
  const normalized = name.toLowerCase();
  if (normalized.includes('ubuntu') || normalized.includes('debian') || normalized.includes('linux')) {
    return 'Linux ISOs';
  }
  if (normalized.includes('movie') || normalized.includes('1080p') || normalized.includes('2160p')) {
    return 'Video';
  }
  if (normalized.includes('game')) {
    return 'Games';
  }
  if (normalized.includes('book') || normalized.includes('ebook')) {
    return 'Books';
  }
  return 'General';
}

function isStreamableFile(name) {
  const ext = path.extname(name).toLowerCase();
  return ['.mp4', '.mkv', '.webm', '.mp3', '.wav', '.flac', '.ogg'].includes(ext);
}

function getOrCreateMetadata(torrent) {
  const existing = torrentMetadata.get(torrent);
  if (existing) {
    return existing;
  }

  const created = {
    addedAt: Date.now(),
    source: torrent.magnetURI ?? torrent.infoHash ?? torrent.name ?? 'torrent',
    paused: false,
    category: inferCategory(torrent.name ?? torrent.magnetURI ?? ''),
  };
  torrentMetadata.set(torrent, created);
  return created;
}

function resolveTorrentStatus(torrent, metadata) {
  if (metadata.paused) {
    return 'paused';
  }
  if (!torrent.ready) {
    return 'queued';
  }
  if (torrent.progress >= 1) {
    return torrent.uploadSpeed > 0 ? 'seeding' : 'completed';
  }
  if (torrent.downloadSpeed > 0 || torrent.progress > 0) {
    return 'downloading';
  }
  return 'queued';
}

function mapTorrent(torrent) {
  const metadata = getOrCreateMetadata(torrent);
  const status = resolveTorrentStatus(torrent, metadata);
  const downloaded = Number.isFinite(torrent.downloaded) ? torrent.downloaded : 0;
  const uploaded = Number.isFinite(torrent.uploaded) ? torrent.uploaded : 0;
  const length = Number.isFinite(torrent.length) ? torrent.length : 0;
  const downloadSpeed = Number.isFinite(torrent.downloadSpeed) ? torrent.downloadSpeed : 0;
  const uploadSpeed = Number.isFinite(torrent.uploadSpeed) ? torrent.uploadSpeed : 0;
  const progress = Math.max(0, Math.min(100, Math.round((torrent.progress ?? 0) * 100)));
  const peerCount = Number.isFinite(torrent.numPeers) ? torrent.numPeers : 0;
  const seedCount = Number.isFinite(torrent.numSeeds) ? torrent.numSeeds : peerCount;

  let eta = '∞';
  if (status === 'paused') {
    eta = 'Paused';
  } else if (status === 'queued') {
    eta = 'Queued';
  } else if (status === 'completed') {
    eta = '—';
  } else if (status === 'downloading') {
    const remaining = Math.max(length - downloaded, 0);
    eta = formatDuration(downloadSpeed > 0 ? remaining / downloadSpeed : Infinity);
  }

  return {
    id: torrent.infoHash ?? metadata.source,
    name: torrent.name ?? metadata.source,
    size: formatBytes(length),
    progress,
    downloadSpeed: formatSpeed(downloadSpeed),
    uploadSpeed: formatSpeed(uploadSpeed),
    seeds: seedCount,
    peers: peerCount,
    status,
    eta,
    ratio: downloaded > 0 ? uploaded / downloaded : 0,
    added: formatRelativeTime(metadata.addedAt),
    category: metadata.category,
  };
}

function getDhtNodeCount() {
  try {
    const dht = client.dht;
    if (!dht) {
      return 0;
    }

    if (typeof dht.nodes?.count === 'function') {
      return Number(dht.nodes.count()) || 0;
    }
    if (typeof dht.nodes?.size === 'number') {
      return dht.nodes.size;
    }
    if (Array.isArray(dht.nodes)) {
      return dht.nodes.length;
    }
  } catch {
    return 0;
  }

  return 0;
}

function buildSnapshot() {
  const torrents = client.torrents.map((torrent) => mapTorrent(torrent));
  const totalDownloadedBytes = client.torrents.reduce(
    (sum, torrent) => sum + (Number.isFinite(torrent.downloaded) ? torrent.downloaded : 0),
    0,
  );
  const totalUploadedBytes = client.torrents.reduce(
    (sum, torrent) => sum + (Number.isFinite(torrent.uploaded) ? torrent.uploaded : 0),
    0,
  );

  return {
    torrents,
    stats: {
      totalDownloadSpeed: formatSpeed(client.downloadSpeed ?? 0),
      totalUploadSpeed: formatSpeed(client.uploadSpeed ?? 0),
      activeTorrents: torrents.filter((torrent) => torrent.status === 'downloading' || torrent.status === 'seeding').length,
      totalTorrents: torrents.length,
      totalDownloaded: formatBytes(totalDownloadedBytes),
      totalUploaded: formatBytes(totalUploadedBytes),
      dhtNodes: getDhtNodeCount(),
    },
  };
}

function emitSnapshot() {
  const payload = `data: ${JSON.stringify(buildSnapshot())}\n\n`;
  for (const response of sseClients) {
    response.write(payload);
  }
}

function findTorrentById(id) {
  const normalizedId = String(id ?? '').trim();
  const normalizedInfoHash = normalizedId.toLowerCase();

  return client.torrents.find((torrent) => {
    const metadata = getOrCreateMetadata(torrent);
    const torrentInfoHash = typeof torrent.infoHash === 'string' ? torrent.infoHash.toLowerCase() : '';

    if (torrentInfoHash && torrentInfoHash === normalizedInfoHash) {
      return true;
    }

    return metadata.source === normalizedId;
  }) ?? null;
}

function extractInfoHashFromMagnet(source) {
  const match = source.match(/[?&]xt=urn:btih:([^&]+)/i);
  if (!match) {
    return null;
  }

  const candidate = decodeURIComponent(match[1]).trim();
  if (!/^[a-f0-9]{40}$/i.test(candidate)) {
    return null;
  }

  return candidate.toLowerCase();
}

function findExistingTorrentBySource(source) {
  const normalizedSource = source.trim();
  const sourceInfoHash = extractInfoHashFromMagnet(normalizedSource);

  return client.torrents.find((torrent) => {
    const metadata = getOrCreateMetadata(torrent);
    const torrentInfoHash = typeof torrent.infoHash === 'string' ? torrent.infoHash.toLowerCase() : null;

    if (sourceInfoHash && torrentInfoHash && sourceInfoHash === torrentInfoHash) {
      return true;
    }

    return metadata.source === normalizedSource;
  }) ?? null;
}

function bindTorrentEvents(torrent) {
  torrent.on('error', (error) => {
    console.error(`Torrent error (${torrent.infoHash ?? torrent.name}):`, toErrorMessage(error));
    emitSnapshot();
  });
  torrent.on('done', emitSnapshot);
  torrent.on('warning', emitSnapshot);
  torrent.on('ready', emitSnapshot);
  torrent.on('download', emitSnapshot);
  torrent.on('upload', emitSnapshot);
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.get('/api/events', (request, response) => {
  response.setHeader('Content-Type', 'text/event-stream');
  response.setHeader('Cache-Control', 'no-cache');
  response.setHeader('Connection', 'keep-alive');
  response.flushHeaders();
  response.write('retry: 3000\n\n');
  response.write(`data: ${JSON.stringify(buildSnapshot())}\n\n`);

  sseClients.add(response);
  request.on('close', () => {
    sseClients.delete(response);
  });
});

app.get('/api/torrents', (_request, response) => {
  response.json(buildSnapshot());
});

app.post('/api/torrents', (request, response) => {
  const source = String(request.body?.source ?? '').trim();
  if (!source) {
    response.status(400).json({ error: 'source is required (magnet URI or torrent URL).' });
    return;
  }

  if (findExistingTorrentBySource(source)) {
    response.json(buildSnapshot());
    return;
  }

  try {
    const torrent = client.add(source, { path: DOWNLOAD_DIR });
    torrentMetadata.set(torrent, {
      addedAt: Date.now(),
      source,
      paused: false,
      category: inferCategory(source),
    });
    bindTorrentEvents(torrent);
    emitSnapshot();
    response.status(201).json(buildSnapshot());
  } catch (error) {
    response.status(400).json({ error: toErrorMessage(error) });
  }
});

app.post('/api/torrents/upload', upload.single('torrent'), (request, response) => {
  const buffer = request.file?.buffer;
  if (!buffer || buffer.length === 0) {
    response.status(400).json({ error: 'A .torrent file is required.' });
    return;
  }

  try {
    const torrent = client.add(buffer, { path: DOWNLOAD_DIR });
    torrentMetadata.set(torrent, {
      addedAt: Date.now(),
      source: request.file.originalname,
      paused: false,
      category: inferCategory(request.file.originalname),
    });
    bindTorrentEvents(torrent);
    emitSnapshot();
    response.status(201).json(buildSnapshot());
  } catch (error) {
    response.status(400).json({ error: toErrorMessage(error) });
  }
});

app.post('/api/torrents/:id/pause', (request, response) => {
  const torrent = findTorrentById(request.params.id);
  if (!torrent) {
    response.status(404).json({ error: 'Torrent not found.' });
    return;
  }

  const metadata = getOrCreateMetadata(torrent);
  metadata.paused = true;
  torrentMetadata.set(torrent, metadata);
  if (typeof torrent.pause === 'function') {
    torrent.pause();
  }

  emitSnapshot();
  response.json(buildSnapshot());
});

app.post('/api/torrents/:id/resume', (request, response) => {
  const torrent = findTorrentById(request.params.id);
  if (!torrent) {
    response.status(404).json({ error: 'Torrent not found.' });
    return;
  }

  const metadata = getOrCreateMetadata(torrent);
  metadata.paused = false;
  torrentMetadata.set(torrent, metadata);
  if (typeof torrent.resume === 'function') {
    torrent.resume();
  }

  emitSnapshot();
  response.json(buildSnapshot());
});

app.delete('/api/torrents/:id', (request, response) => {
  const torrent = findTorrentById(request.params.id);
  if (!torrent) {
    response.status(404).json({ error: 'Torrent not found.' });
    return;
  }

  const torrentId = torrent.infoHash ?? request.params.id;
  client.remove(torrentId, { destroyStore: true }, (error) => {
    if (error) {
      response.status(500).json({ error: toErrorMessage(error) });
      return;
    }

    torrentMetadata.delete(torrent);
    emitSnapshot();
    response.json(buildSnapshot());
  });
});

app.get('/api/torrents/:id/files', (request, response) => {
  const torrent = findTorrentById(request.params.id);
  if (!torrent) {
    response.status(404).json({ error: 'Torrent not found.' });
    return;
  }

  const files = Array.isArray(torrent.files) ? torrent.files : [];
  response.json({
    files: files.map((file, index) => ({
      index,
      name: file.name,
      size: formatBytes(file.length),
      path: file.path,
      streamable: isStreamableFile(file.name),
    })),
  });
});

app.get('/api/torrents/:id/files/:index/stream', (request, response) => {
  const torrent = findTorrentById(request.params.id);
  if (!torrent) {
    response.status(404).json({ error: 'Torrent not found.' });
    return;
  }

  const files = Array.isArray(torrent.files) ? torrent.files : [];
  if (files.length === 0) {
    response.status(409).json({ error: 'Torrent metadata is not available yet.' });
    return;
  }

  const index = Number.parseInt(request.params.index, 10);
  const file = Number.isInteger(index) ? files[index] : undefined;
  if (!file) {
    response.status(404).json({ error: 'File not found for this torrent.' });
    return;
  }

  const size = file.length;
  const range = request.headers.range;

  if (!range) {
    response.status(200);
    response.setHeader('Content-Length', size);
    response.setHeader('Content-Type', 'application/octet-stream');
    file.createReadStream().pipe(response);
    return;
  }

  const [startValue, endValue] = String(range).replace(/bytes=/, '').split('-');
  const start = Number.parseInt(startValue, 10);
  const end = endValue ? Number.parseInt(endValue, 10) : size - 1;

  if (Number.isNaN(start) || Number.isNaN(end) || start > end || start < 0 || end >= size) {
    response.status(416).setHeader('Content-Range', `bytes */${size}`).end();
    return;
  }

  response.status(206);
  response.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
  response.setHeader('Accept-Ranges', 'bytes');
  response.setHeader('Content-Length', end - start + 1);
  response.setHeader('Content-Type', 'application/octet-stream');
  file.createReadStream({ start, end }).pipe(response);
});

app.use('/downloads', express.static(DOWNLOAD_DIR));

app.use((error, _request, response, _next) => {
  response.status(500).json({ error: toErrorMessage(error) });
});

const tick = setInterval(() => {
  emitSnapshot();
}, 1500);

const server = app.listen(PORT, HOST, () => {
  console.log(`Torrentio backend listening on http://${HOST}:${PORT}`);
  console.log(`Torrent downloads directory: ${DOWNLOAD_DIR}`);
});

function shutdown(signal) {
  console.log(`${signal} received. Shutting down backend...`);
  clearInterval(tick);

  for (const response of sseClients) {
    response.end();
  }
  sseClients.clear();

  server.close(() => {
    client.destroy((error) => {
      if (error) {
        console.error('WebTorrent shutdown error:', toErrorMessage(error));
        process.exit(1);
        return;
      }

      process.exit(0);
    });
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
