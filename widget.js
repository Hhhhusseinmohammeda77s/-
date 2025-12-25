
```javascript
const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_NAMES = { Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
const wNext = document.getElementById('wNext'), wCountdown = document.getElementById('wCountdown'), wLoc = document.getElementById('wLoc');

function parseHM(t) {
  const s = (t || '').trim().substring(0, 5).split(':');
  return [parseInt(s[0] || 0), parseInt(s[1] || 0)];
}

function loadContext() {
  const last = JSON.parse(localStorage.getItem('prayer_last_loc') || '{}');
  const now = new Date(), key = `prayer_monthly_${now.getFullYear()}_${now.getMonth() + 1}_${(last?.lat ?? 0).toFixed(3)}_${(last?.lon ?? 0).toFixed(3)}`;
  const monthly = JSON.parse(localStorage.getItem(key) || 'null');
  return { lat: last.lat, lon: last.lon, monthly };
}

function getTodayTimings(monthly) {
  if (!monthly) return null;
  const idx = new Date().getDate() - 1;
  return monthly[idx]?.timings || null;
}

function tick() {
  const ctx = loadContext();
  const timings = getTodayTimings(ctx.monthly);
  if (!timings) {
    wCountdown.textContent = 'لا توجد بيانات — افتح التطبيق مرة واحدة للتحميل';
    return;
  }
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const times = PRAYER_ORDER.map(k => {
    const [h, m] = parseHM(timings[k]);
    const d = new Date(base);
    d.setHours(h, m, 0, 0);
    return { k, d };
  });
  let next = times.find(t => t.d > now) || { k: 'Fajr', d: new Date(base.getTime() + 86400000) };
  if (next.k === 'Fajr') {
    const [h, m] = parseHM(timings['Fajr']);
    next.d.setHours(h, m, 0, 0);
  }
  const diff = next.d - now;
  const H = String(Math.floor(diff / 3600000)).padStart(2, '0'), M = String(Math.floor(diff % 3600000 / 60000)).padStart(2, '0'), S = String(Math.floor(diff % 60000 / 1000)).padStart(2, '0');
  wCountdown.textContent = `${H}:${M}:${S}`;
  wNext.textContent = PRAYER_NAMES[next.k];
  wLoc.textContent = ctx.lat ? `(${ctx.lat.toFixed(3)}, ${ctx.lon.toFixed(3)})` : '--';
}

document.getElementById('wRefresh').addEventListener('click', tick);
tick();
setInterval(tick, 1000);