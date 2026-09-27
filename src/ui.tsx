import React from 'react';
import { hostFrameStyle } from './host-style';

// Shared look for Tanya's Home Screens plugins: matches the built-in modules
// (semibold 1.1em titles, 0.35-opacity metadata, ink-tinted rows, outline icons).

export type Shape = string | { c: [number, number, number] };
const C = (x: number, y: number, r: number): Shape => ({ c: [x, y, r] });
const CLOUD_TOP = 'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242';
export const I: Record<string, Shape[]> = {
  pin: ['M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0', C(12, 10, 3)],
  clock: [C(12, 12, 10), 'M12 6v6l4 2'],
  bus: ['M8 6v6', 'M15 6v6', 'M2 12h19.6', 'M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3', C(7, 18, 2), 'M9 18h5', C(16, 18, 2)],
  star: ['M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'],
  flame: ['M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'],
  paw: [C(11, 4, 2), C(18, 8, 2), C(20, 16, 2), 'M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z'],
  check: ['M20 6 9 17l-5-5'],
  utensils: ['M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2', 'M7 2v20', 'M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7'],
  bolt: ['M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'],
  gift: ['M3 8h18v4H3z', 'M12 8v13', 'M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7', 'M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5'],
  calendar: ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'],
  sun: [C(12, 12, 4), 'M12 2v2', 'M12 20v2', 'm4.93 4.93 1.41 1.41', 'm17.66 17.66 1.41 1.41', 'M2 12h2', 'M20 12h2', 'm6.34 17.66-1.41 1.41', 'm19.07 4.93-1.41 1.41'],
  moon: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'],
  cloudSun: ['M12 2v2', 'm4.93 4.93 1.41 1.41', 'M20 12h2', 'm19.07 4.93-1.41 1.41', 'M15.947 12.65a4 4 0 0 0-5.925-4.128', 'M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z'],
  cloud: ['M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z'],
  fog: [CLOUD_TOP, 'M16 17H7', 'M17 21H9'],
  rain: [CLOUD_TOP, 'M16 14v6', 'M8 14v6', 'M12 16v6'],
  snow: [CLOUD_TOP, 'M8 15h.01', 'M8 19h.01', 'M12 17h.01', 'M12 21h.01', 'M16 15h.01', 'M16 19h.01'],
  storm: ['M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973', 'm13 12-3 5h4l-3 5'],
};

export function Icon({ d, size = '1em', stroke = 2, style, fill }: { d: Shape[]; size?: string; stroke?: number; style?: React.CSSProperties; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ?? 'none'} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'block', ...style }} aria-hidden>
      {d.map((p, i) => (typeof p === 'string' ? <path key={i} d={p} /> : <circle key={i} cx={p.c[0]} cy={p.c[1]} r={p.c[2]} />))}
    </svg>
  );
}

/** Icon for a provider's weather icon/description text (host payload) or a WMO code. */
export function wxIcon(textOrCode: string | number | undefined, night = false): Shape[] {
  if (typeof textOrCode === 'number') {
    const c = textOrCode;
    if (c === 0) return night ? I.moon : I.sun; if (c <= 2) return I.cloudSun; if (c === 3) return I.cloud;
    if (c === 45 || c === 48) return I.fog; if ((c >= 71 && c <= 77) || c === 85 || c === 86) return I.snow;
    if (c >= 95) return I.storm; if (c >= 51) return I.rain; return I.cloud;
  }
  const t = String(textOrCode ?? '').toLowerCase();
  if (/thunder|storm|orage/.test(t)) return I.storm;
  if (/snow|sleet|flurr|neige|ice/.test(t)) return I.snow;
  if (/rain|drizzle|shower|pluie|averse/.test(t)) return I.rain;
  if (/fog|mist|haze|brouillard/.test(t)) return I.fog;
  if (/partly|few|mostly sunny|mainly sunny|scattered|variable|partial/.test(t)) return I.cloudSun;
  if (/cloud|overcast|nuag|couvert/.test(t)) return I.cloud;
  if (/clear|sun|dégagé|ensoleill/.test(t)) return night ? I.moon : I.sun;
  return I.cloud;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Style = any;
export const ink = (style: Style, a: number) => `color-mix(in srgb, ${style.textColor || 'currentColor'} ${Math.round(a * 100)}%, transparent)`;
export const frame = (style: Style, extra: React.CSSProperties = {}): React.CSSProperties => ({
  ...hostFrameStyle(style as any), width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', overflow: 'hidden', ...extra,
});
export const caps: React.CSSProperties = { fontSize: '0.65em', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 };

export function Header({ title, meta, style, right }: { title: string; meta?: string; style: Style; right?: React.ReactNode }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em', marginBottom: '0.25em' }}>
        <h2 style={{ margin: 0, fontSize: '1.1em', fontWeight: 600 }}>{title}</h2>
        {meta && <span style={{ fontSize: '0.65em', opacity: 0.35 }}>{meta}</span>}
        {right && <div style={{ marginLeft: 'auto' }}>{right}</div>}
      </div>
      <div style={{ height: 1, background: ink(style, 0.08), margin: '0.35em 0 0.7em' }} />
    </>
  );
}

export function useNow(ms = 30000): Date {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => { const id = setInterval(() => setNow(new Date()), ms); return () => clearInterval(id); }, [ms]);
  return now;
}

export const sdk = () => (window as any).__HS_SDK__;
export const hour12Of = (tf?: string) => (tf === '24h' ? false : tf === '12h' ? true : undefined);
export const fmtTime = (d: Date, tz?: string, tf?: string) => new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit', hour12: hour12Of(tf), timeZone: tz }).format(d);
export const dayKey = (d: Date, tz?: string) => new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: tz }).format(d);
export const localHM = (d: Date, tz?: string) => { const p = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(d).split(':').map(Number); return p[0] * 60 + p[1]; };
export const weekday = (d: Date, tz?: string) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: tz }).format(d));
export const parseHM = (s: string) => { const [h, m] = String(s || '0:0').split(':').map(Number); return (h || 0) * 60 + (m || 0); };
