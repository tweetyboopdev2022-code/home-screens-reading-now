import React from 'react';
import type { PluginComponentProps } from './hs-plugin';
import { frame, ink, caps, sdk, useNow } from './ui';

const API = 'https://api.todoist.com/api/v1';
const AUTH = { header: { Authorization: 'Bearer {{todoist_token}}' } };
type Task = { id: string; content: string; labels?: string[] };
async function call(url: string, auth = true) {
  const res: Response = await sdk().pluginFetch('reading-now', { url, cacheTtlMs: auth ? 120000 : 86400000, ...(auth ? { secretInjections: AUTH } : {}) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json();
}
/** "Title by Author" / "Title — Author" → parts. */
export function split(s: string): { title: string; author: string } {
  const c = s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').trim();
  const m = c.match(/^(.*?)\s+(?:by|par|—|–|-)\s+(.+)$/i);
  return m ? { title: m[1].trim(), author: m[2].trim() } : { title: c, author: '' };
}
const coverCache: Record<string, string | null> = {};

function Cover({ title, author, accent }: { title: string; author: string; accent: string }) {
  const key = `${title}|${author}`;
  const [src, setSrc] = React.useState<string | null | undefined>(coverCache[key]);
  React.useEffect(() => {
    if (key in coverCache) return;
    (async () => {
      try {
        const j = await call(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}${author ? `&author=${encodeURIComponent(author)}` : ''}&limit=1&fields=cover_i`, false);
        const id = j.docs?.[0]?.cover_i; coverCache[key] = id ? `https://covers.openlibrary.org/b/id/${id}-M.jpg` : null;
      } catch { coverCache[key] = null; }
      setSrc(coverCache[key]);
    })();
  }, [key]);  // eslint-disable-line react-hooks/exhaustive-deps
  const box: React.CSSProperties = { height: '100%', aspectRatio: '2 / 3', borderRadius: '0.35em', flexShrink: 0, boxShadow: '0 3px 10px rgba(0,0,0,0.18)', objectFit: 'cover' };
  return src ? <img src={src} alt="" style={box} onError={() => setSrc(null)} />
    : <div style={{ ...box, background: `linear-gradient(160deg, ${accent}, color-mix(in srgb, ${accent} 55%, #000))`, color: '#fff', padding: '0.5em', boxSizing: 'border-box', fontSize: '0.6em', fontWeight: 600, overflow: 'hidden' }}>{title}</div>;
}

export default function ReadingNow({ config, style }: PluginComponentProps) {
  const now = useNow(300000);
  const projectName = String(config.projectName || 'Reading');
  const people = String(config.people || 'Tanya, Vince, Nora').split(',').map((s) => s.trim()).filter(Boolean);
  const accent = String(config.accentColor || '#7c3aed');
  const [tasks, setTasks] = React.useState<Task[] | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const tick = Math.floor(now.getTime() / 300000);
  React.useEffect(() => { (async () => {
    try {
      const pj = await call(`${API}/projects?limit=200`);
      const p = (pj.results ?? pj).find((x: any) => String(x.name).toLowerCase() === projectName.toLowerCase());
      if (!p) { setErr(`Make a Todoist project called “${projectName}”`); return; }
      const tj = await call(`${API}/tasks?project_id=${p.id}&limit=100`);
      setTasks(tj.results ?? tj); setErr(null);
    } catch (e) { setErr(/HTTP (401|403|500)/.test(String((e as Error).message)) ? 'Add your Todoist API token in Plugins → reading-now.' : 'Can’t reach Todoist right now.'); }
  })(); }, [tick, projectName]);

  const rows = people.map((name) => ({ name, books: (tasks ?? []).filter((t) => (t.labels ?? []).some((l) => l.toLowerCase() === name.toLowerCase())).slice(0, 2).map((t) => split(t.content)) }))
    .filter((r) => r.books.length);

  return (
    <div style={frame(style, { gap: '0.6em' })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
        <h2 style={{ margin: 0, fontSize: '1.1em', fontWeight: 600 }}>What we’re reading</h2>
      </div>
      {err ? <div style={{ margin: 'auto', fontSize: '0.8em', opacity: 0.6 }}>{err}</div>
        : !rows.length ? <div style={{ margin: 'auto', fontSize: '0.8em', opacity: 0.45, textAlign: 'center' }}>{tasks ? `Add books to “${projectName}” in Todoist as “Title by Author”, labelled ${people.join(' / ')}.` : 'Loading…'}</div>
        : (
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: `repeat(${rows.length}, minmax(0, 1fr))`, gap: '1em' }}>
            {rows.map((r) => (
              <div key={r.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.45em', minWidth: 0, minHeight: 0 }}>
                <div style={{ ...caps, color: accent, opacity: 1 }}>{r.name}</div>
                {r.books.map((b) => (
                  <div key={b.title} style={{ display: 'flex', gap: '0.7em', alignItems: 'stretch', flex: 1, minHeight: 0, maxHeight: '9em' }}>
                    <Cover title={b.title} author={b.author} accent={accent} />
                    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.2em' }}>
                      <span style={{ fontSize: '0.9em', fontWeight: 600, lineHeight: 1.2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>{b.title}</span>
                      {b.author && <span style={{ fontSize: '0.7em', opacity: 0.55 }}>{b.author}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      <div style={{ height: 0, borderTop: `1px solid ${ink(style, 0)}` }} />
    </div>
  );
}
