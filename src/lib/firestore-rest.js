/**
 * Firestore REST API helper — используется в Server Components.
 *
 * Зачем не Firebase Client SDK:
 * Firebase JS SDK использует WebSocket/Long-Polling, которые ненадёжны
 * в среде Node.js (Vercel). Firestore REST API — обычный HTTPS-запрос,
 * совместим с Next.js fetch-кешированием (ISR).
 *
 * Безопасность: API-ключ публичен (есть в клиентском бандле). Доступ
 * к данным всё равно регулируется правилами Firebase Security Rules.
 */

const PROJECT_ID = 'zvaryuvalnyk-45771';
const API_KEY    = 'AIzaSyAdj2QFTMGksAo1vGc2Be-MPIZICzHmIoQ';
const BASE_URL   = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

/** Рекурсивно парсит значение из формата Firestore REST в обычный JS */
function parseValue(val) {
  if (!val) return null;
  if ('stringValue'  in val) return val.stringValue;
  if ('integerValue' in val) return Number(val.integerValue);
  if ('doubleValue'  in val) return val.doubleValue;
  if ('booleanValue' in val) return val.booleanValue;
  if ('nullValue'    in val) return null;
  if ('timestampValue' in val) return val.timestampValue;
  if ('mapValue' in val) {
    const map = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      map[k] = parseValue(v);
    }
    return map;
  }
  if ('arrayValue' in val) {
    return (val.arrayValue.values || []).map(parseValue);
  }
  return null;
}

/** Парсит один документ из Firestore REST в простой объект с полем id */
function parseDoc(doc) {
  const id   = doc.name.split('/').pop();
  const post = { id };
  for (const [key, rawVal] of Object.entries(doc.fields || {})) {
    post[key] = parseValue(rawVal);
  }
  return post;
}

/**
 * Загружает все документы из коллекции через Firestore REST API.
 * @param {string} collectionName  - название коллекции в Firestore
 * @param {object} [opts]
 * @param {number} [opts.revalidate=300] - ISR revalidate в секундах (Next.js fetch cache)
 */
export async function fetchCollection(collectionName, { revalidate = 300 } = {}) {
  const url = `${BASE_URL}/${collectionName}?key=${API_KEY}`;
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) {
      const text = await res.text();
      console.error(`[Firestore REST] ${collectionName} → ${res.status}: ${text}`);
      return [];
    }
    const data = await res.json();
    return (data.documents || []).map(parseDoc);
  } catch (err) {
    console.error(`[Firestore REST] Fetch error for "${collectionName}":`, err);
    return [];
  }
}
