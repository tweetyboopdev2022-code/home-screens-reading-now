import React from 'react';
import type { PluginComponentProps } from './hs-plugin';
import { frame, caps, sdk, useNow } from './ui';

// Each reader has their own Grimmory. The plugin reads that Grimmory's OPDS feed
// (Basic auth with the reader's OPDS login, stored as a plugin secret) and shows the
// books on the magic shelf named e.g. "Currently Reading".

type Book = { title: string; author: string; cover?: string };
type Reader = { name: string; base: string; secret: string };

export function parseReaders(s: string): Reader[] {
  return String(s || '').split('\n').map((l) => l.split('|').map((x) => x.trim())).filter((p) => p[0] && p[1])
    .slice(0, 3).map((p, i) => ({ name: p[0], base: p[1].replace(/\/+$/, '').replace(/\/api\/v\d\/opds$/i, ''), secret: `reader${i + 1}_login` }));
}

async function get(r: Reader, path: string): Promise<Response> {
  const url = /^https?:/.test(path) ? path : `${r.base}${path.startsWith('/') ? '' : '/'}${path}`;
  const res: Response = await sdk().pluginFetch('reading-now', { url, cacheTtlMs: 300000, secretInjections: { header: { Authorization: `Basic {{${r.secret}}}` } } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}
const xml = (t: string) => new DOMParser().parseFromString(t, 'application/xml');
const kids = (el: Element, tag: string) => Array.from(el.getElementsByTagName(tag));

async function readerBooks(r: Reader, shelfName: string, max: number): Promise<Book[]> {
  const nav = xml(await (await get(r, '/api/v1/opds/magic-shelves')).text());
  const want = shelfName.trim().toLowerCase();
  const shelf = kids(nav.documentElement, 'entry').find((e) => (kids(e, 'title')[0]?.textContent ?? '').trim().toLowerCase() === want);
  if (!shelf) throw new Error(`no-shelf`);
  const href = kids(shelf, 'link')[0]?.getAttribute('href') ?? '';
  const feed = xml(await (await get(r, `${href}${href.includes('?') ? '&' : '?'}size=${max}`)).text());
  const books: Book[] = kids(feed.documentElement, 'entry').slice(0, max).map((e) => ({
    title: (kids(e, 'title')[0]?.textContent ?? '').trim(),
    author: kids(e, 'author').map((a) => kids(a, 'name')[0]?.textContent ?? '').filter(Boolean).join(', '),
    cover: kids(e, 'link').find((l) => /opds-spec\.org\/image(\/thumbnail)?$/.test(l.getAttribute('rel') ?? ''))?.getAttribute('href') ?? undefined,
  }));
  // covers are behind the same login: fetch through the proxy and show as blob URLs
  await Promise.all(books.map(async (b) => {
    if (!b.cover) return;
    try { b.cover = URL.createObjectURL(await (await get(r, b.cover)).blob()); } catch { b.cover = undefined; }
  }));
  return books;
}

function Cover({ b, accent }: { b: Book; accent: string }) {
  const box: React.CSSProperties = { height: '100%', aspectRatio: '2 / 3', borderRadius: '0.35em', flexShrink: 0, boxShadow: '0 3px 10px rgba(0,0,0,0.18)', objectFit: 'cover' };
  return b.cover ? <img src={b.cover} alt="" style={box} />
    : <div style={{ ...box, background: `linear-gradient(160deg, ${accent}, color-mix(in srgb, ${accent} 55%, #000))`, color: '#fff', padding: '0.5em', boxSizing: 'border-box', fontSize: '0.6em', fontWeight: 600, overflow: 'hidden' }}>{b.title}</div>;
}

export default function ReadingNow({ config, style }: PluginComponentProps) {
  const now = useNow(600000);
  const readers = parseReaders(String(config.readers || ''));
  const shelfName = String(config.shelfName || 'Currently Reading');
  const perReader = Number(config.booksPerReader ?? 1);
  const accent = String(config.accentColor || '#7c3aed');
  const [data, setData] = React.useState<Record<string, Book[] | string>>({});
  const tick = Math.floor(now.getTime() / 600000);
  React.useEffect(() => {
    readers.forEach(async (r) => {
      try { const b = await readerBooks(r, shelfName, perReader); setData((d) => ({ ...d, [r.name]: b })); }
      catch (e) {
        const m = String((e as Error).message);
        setData((d) => ({ ...d, [r.name]: m === 'no-shelf' ? `Make a magic shelf called “${shelfName}”` : /401|403/.test(m) ? 'OPDS login refused' : /500/.test(m) ? `Add ${r.name}'s OPDS login in the plugin secrets` : 'Grimmory unreachable' }));
      }
    });
  }, [tick, String(config.readers), shelfName, perReader]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={frame(style, { gap: '0.6em' })}>
      <h2 style={{ margin: 0, fontSize: '1.1em', fontWeight: 600 }}>What we’re reading</h2>
      {!readers.length ? <div style={{ margin: 'auto', fontSize: '0.8em', opacity: 0.5 }}>Add readers in the settings: “Name | http://grimmory-address:port”</div> : (
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: `repeat(${readers.length}, minmax(0, 1fr))`, gap: '1em' }}>
          {readers.map((r) => {
            const v = data[r.name];
            return (
              <div key={r.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.45em', minWidth: 0, minHeight: 0 }}>
                <div style={{ ...caps, color: accent, opacity: 1 }}>{r.name}</div>
                {v === undefined ? <div style={{ fontSize: '0.7em', opacity: 0.4 }}>Loading…</div>
                  : typeof v === 'string' ? <div style={{ fontSize: '0.7em', opacity: 0.5 }}>{v}</div>
                  : !v.length ? <div style={{ fontSize: '0.75em', opacity: 0.45 }}>Nothing on the go</div>
                  : v.map((b) => (
                    <div key={b.title} style={{ display: 'flex', gap: '0.7em', alignItems: 'stretch', flex: 1, minHeight: 0, maxHeight: '9em' }}>
                      <Cover b={b} accent={accent} />
                      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.2em' }}>
                        <span style={{ fontSize: '0.9em', fontWeight: 600, lineHeight: 1.2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>{b.title}</span>
                        {b.author && <span style={{ fontSize: '0.7em', opacity: 0.55 }}>{b.author}</span>}
                      </div>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
