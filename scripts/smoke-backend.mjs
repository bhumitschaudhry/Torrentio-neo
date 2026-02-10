import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import process from 'node:process';

const HOST = '127.0.0.1';
const PORT = 3301;
const BASE_URL = `http://${HOST}:${PORT}`;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function requestJson(path, init) {
  const response = await fetch(`${BASE_URL}${path}`, init);
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  return { response, text, json };
}

async function waitForHealth(timeoutMs = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const { response, json } = await requestJson('/api/health');
      if (response.ok && json?.ok === true) {
        return;
      }
    } catch {
      // Backend may still be starting.
    }
    await delay(300);
  }

  throw new Error('Backend did not become healthy in time.');
}

async function run() {
  const serverProcess = spawn(process.execPath, ['server/index.js'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      HOST,
      PORT: String(PORT),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stderr = '';
  serverProcess.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  try {
    await waitForHealth();

    const sse = await fetch(`${BASE_URL}/api/events`);
    assert(sse.ok, `Expected SSE endpoint to be 200, got ${sse.status}`);
    assert(
      (sse.headers.get('content-type') || '').includes('text/event-stream'),
      'SSE endpoint did not return text/event-stream.',
    );
    const reader = sse.body?.getReader();
    assert(reader, 'SSE response body reader is unavailable.');
    const firstChunk = await reader.read();
    const chunkText = new TextDecoder().decode(firstChunk.value || new Uint8Array());
    assert(chunkText.includes('data:'), 'SSE first payload does not include data event.');
    await reader.cancel();

    {
      const { response, json } = await requestJson('/api/torrents');
      assert(response.status === 200, `Expected GET /api/torrents 200, got ${response.status}`);
      assert(Array.isArray(json?.torrents), 'Snapshot torrents is not an array.');
      assert(typeof json?.stats === 'object' && json.stats !== null, 'Snapshot stats is missing.');
    }

    {
      const { response } = await requestJson('/api/torrents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: '' }),
      });
      assert(response.status === 400, `Expected empty source to return 400, got ${response.status}`);
    }

    const magnet = 'magnet:?xt=urn:btih:0123456789012345678901234567890123456789';
    let torrentId = '';

    {
      const { response, json } = await requestJson('/api/torrents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: magnet }),
      });
      assert(response.status === 201, `Expected add torrent to return 201, got ${response.status}`);
      assert(Array.isArray(json?.torrents) && json.torrents.length >= 1, 'Added torrent not present in snapshot.');
      torrentId = String(json.torrents[0]?.id ?? '');
      assert(torrentId.length > 0, 'Added torrent id is missing.');
    }

    const encodedId = encodeURIComponent(torrentId);

    {
      const { response, json } = await requestJson(`/api/torrents/${encodedId}/pause`, {
        method: 'POST',
      });
      assert(response.status === 200, `Expected pause to return 200, got ${response.status}`);
      assert(json?.torrents?.[0]?.status === 'paused', 'Torrent status did not switch to paused.');
    }

    {
      const { response, json } = await requestJson(`/api/torrents/${encodedId}/resume`, {
        method: 'POST',
      });
      assert(response.status === 200, `Expected resume to return 200, got ${response.status}`);
      const resumedStatus = json?.torrents?.[0]?.status;
      assert(
        ['queued', 'downloading', 'seeding', 'completed'].includes(resumedStatus),
        `Unexpected status after resume: ${resumedStatus}`,
      );
    }

    {
      const { response, json } = await requestJson(`/api/torrents/${encodedId}/files`);
      assert(response.status === 200, `Expected files endpoint 200, got ${response.status}`);
      assert(Array.isArray(json?.files), 'Torrent files response is not an array.');
    }

    {
      const { response } = await requestJson(`/api/torrents/${encodedId}/files/0/stream`);
      assert(
        response.status === 409 || response.status === 404,
        `Expected stream endpoint to return 409/404 before metadata, got ${response.status}`,
      );
    }

    {
      const { response, json } = await requestJson(`/api/torrents/${encodedId}`, {
        method: 'DELETE',
      });
      assert(response.status === 200, `Expected delete endpoint 200, got ${response.status}`);
      assert(Array.isArray(json?.torrents) && json.torrents.length === 0, 'Torrent was not removed.');
    }

    console.log('SMOKE_TEST_PASS');
  } finally {
    serverProcess.kill('SIGTERM');
    await Promise.race([
      new Promise((resolve) => serverProcess.once('exit', resolve)),
      delay(4000),
    ]);
    if (stderr.trim().length > 0) {
      console.log('BACKEND_STDERR:');
      console.log(stderr.trim());
    }
  }
}

run().catch((error) => {
  console.error('SMOKE_TEST_FAIL');
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
});
