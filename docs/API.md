# API Reference

All endpoints are served by `server/index.js`.

## Base URL
- Development direct: `http://127.0.0.1:3001/api`
- Frontend-relative in app: `/api` (proxied by Vite in dev)

## Content Types
- JSON endpoints return `application/json`.
- SSE endpoint returns `text/event-stream`.
- Stream endpoint returns `application/octet-stream`.

## Error Format
Most non-2xx responses return:

```json
{
  "error": "Human-readable error message"
}
```

## Endpoints

### `GET /api/health`
Health probe.

Response `200`:
```json
{
  "ok": true
}
```

### `GET /api/events`
Server-Sent Events stream for live snapshots.

Behavior:
- Sends initial snapshot immediately.
- Sends updates every ~1.5s and on torrent activity.
- Includes `retry: 3000`.

Event payload format:
```json
{
  "torrents": [],
  "stats": {
    "totalDownloadSpeed": "0 KB/s",
    "totalUploadSpeed": "0 KB/s",
    "activeTorrents": 0,
    "totalTorrents": 0,
    "totalDownloaded": "0 B",
    "totalUploaded": "0 B",
    "dhtNodes": 0
  }
}
```

### `GET /api/torrents`
Returns full backend snapshot.

Response `200`:
```json
{
  "torrents": [
    {
      "id": "string",
      "name": "string",
      "size": "string",
      "progress": 0,
      "downloadSpeed": "string",
      "uploadSpeed": "string",
      "seeds": 0,
      "peers": 0,
      "status": "queued",
      "eta": "string",
      "ratio": 0,
      "added": "string",
      "category": "string"
    }
  ],
  "stats": {
    "totalDownloadSpeed": "string",
    "totalUploadSpeed": "string",
    "activeTorrents": 0,
    "totalTorrents": 0,
    "totalDownloaded": "string",
    "totalUploaded": "string",
    "dhtNodes": 0
  }
}
```

### `POST /api/torrents`
Add torrent via magnet URI or `.torrent` URL.

Request body:
```json
{
  "source": "magnet:?xt=..."
}
```

Responses:
- `201` snapshot if added
- `200` snapshot if already present
- `400` invalid input or add failure

### `POST /api/torrents/upload`
Upload local `.torrent` file.

Request:
- `multipart/form-data`
- field name: `torrent`
- max size: 10 MB

Responses:
- `201` snapshot if added
- `400` missing/invalid file

### `POST /api/torrents/:id/pause`
Pause torrent and mark metadata paused.

Responses:
- `200` snapshot
- `404` torrent not found

### `POST /api/torrents/:id/resume`
Resume torrent and clear metadata paused flag.

Responses:
- `200` snapshot
- `404` torrent not found

### `DELETE /api/torrents/:id`
Remove torrent and delete torrent store.

Responses:
- `200` snapshot
- `404` torrent not found
- `500` remove failure

### `GET /api/torrents/:id/files`
List files in torrent.

Response `200`:
```json
{
  "files": [
    {
      "index": 0,
      "name": "file.mkv",
      "size": "1.2 GB",
      "path": "folder/file.mkv",
      "streamable": true
    }
  ]
}
```

### `GET /api/torrents/:id/files/:index/stream`
Stream a file by index.

Behavior:
- Supports byte ranges (`Range: bytes=...`).
- Returns `200` full stream without range.
- Returns `206` partial stream with valid range.
- Returns `416` for invalid range.

Possible errors:
- `404` torrent or file not found

## Static Download Exposure
- `GET /downloads/*` serves files from resolved download directory.

## Status values
`status` in torrent item can be:
- `downloading`
- `seeding`
- `paused`
- `queued`
- `completed`
