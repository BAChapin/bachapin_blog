import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const host = process.env.VIEW_COUNTER_HOST ?? '0.0.0.0';
const port = Number(process.env.VIEW_COUNTER_PORT ?? 3000);
const dataFile = process.env.VIEW_COUNTER_DATA_FILE ?? '/data/views.json';
const dedupeTtlSeconds = Number(process.env.VIEW_COUNTER_DEDUPE_TTL_SECONDS ?? 21600);
const hashSalt = process.env.VIEW_COUNTER_HASH_SALT ?? 'bachapin-blog-view-counter';
const maxSlugLength = 160;

let store = {
  posts: {},
  recentViews: {},
};
let saveQueue = Promise.resolve();

function sendJson(response, statusCode, body, extraHeaders = {}) {
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    ...extraHeaders,
  });
  response.end(JSON.stringify(body));
}

function normalizeSlug(value = '') {
  const slug = decodeURIComponent(value).replace(/^\/+|\/+$/g, '');

  if (!slug || slug.length > maxSlugLength || !/^[a-zA-Z0-9._/-]+$/.test(slug)) {
    return null;
  }

  return slug;
}

function getVisitorKey(request, slug) {
  const forwardedFor = request.headers['x-forwarded-for']?.split(',')[0]?.trim();
  const address = forwardedFor || request.socket.remoteAddress || 'unknown';
  const userAgent = request.headers['user-agent'] || 'unknown';
  const source = `${hashSalt}:${slug}:${address}:${userAgent}`;

  return createHash('sha256').update(source).digest('hex');
}

function pruneRecentViews(now) {
  const cutoff = now - dedupeTtlSeconds * 1000;

  for (const [key, timestamp] of Object.entries(store.recentViews)) {
    if (timestamp < cutoff) {
      delete store.recentViews[key];
    }
  }
}

async function loadStore() {
  try {
    const raw = await readFile(dataFile, 'utf8');
    const parsed = JSON.parse(raw);

    store = {
      posts: parsed.posts && typeof parsed.posts === 'object' ? parsed.posts : {},
      recentViews:
        parsed.recentViews && typeof parsed.recentViews === 'object' ? parsed.recentViews : {},
    };
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Failed to load view counter data:', error);
    }
  }
}

async function saveStore() {
  const nextSave = async () => {
    await mkdir(dirname(dataFile), { recursive: true });
    const tempFile = `${dataFile}.tmp`;
    await writeFile(tempFile, `${JSON.stringify(store, null, 2)}\n`, 'utf8');
    await rename(tempFile, dataFile);
  };

  saveQueue = saveQueue.then(nextSave, nextSave);
  return saveQueue;
}

function getCount(slug) {
  return Number(store.posts[slug]?.count ?? 0);
}

async function incrementCount(request, slug) {
  const now = Date.now();
  const visitorKey = getVisitorKey(request, slug);
  const lastViewedAt = store.recentViews[visitorKey] ?? 0;
  const shouldCount = now - lastViewedAt > dedupeTtlSeconds * 1000;

  pruneRecentViews(now);

  if (!store.posts[slug]) {
    store.posts[slug] = { count: 0, updatedAt: null };
  }

  if (shouldCount) {
    store.posts[slug].count += 1;
    store.posts[slug].updatedAt = new Date(now).toISOString();
    store.recentViews[visitorKey] = now;
    await saveStore();
  }

  return {
    counted: shouldCount,
    count: getCount(slug),
  };
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1024) {
        request.destroy();
        reject(new Error('Request body too large'));
      }
    });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

await loadStore();

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

  if (url.pathname === '/health') {
    sendJson(response, 200, { ok: true });
    return;
  }

  const match = url.pathname.match(/^\/api\/views\/(.+)$/);
  const slug = match ? normalizeSlug(match[1]) : null;

  if (!slug) {
    sendJson(response, 404, { error: 'Not found' });
    return;
  }

  try {
    if (request.method === 'GET') {
      sendJson(response, 200, { slug, count: getCount(slug) });
      return;
    }

    if (request.method === 'POST') {
      await readBody(request);
      const result = await incrementCount(request, slug);
      sendJson(response, 200, { slug, ...result });
      return;
    }

    sendJson(response, 405, { error: 'Method not allowed' }, { Allow: 'GET, POST' });
  } catch (error) {
    console.error('View counter request failed:', error);
    sendJson(response, 500, { error: 'Internal server error' });
  }
});

server.listen(port, host, () => {
  console.log(`View counter listening on ${host}:${port}`);
});
