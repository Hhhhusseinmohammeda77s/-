/* ============================
   عناصر الواجهة الرسومية
   ============================ */
const app = document.getElementById('app');
const splashScreen = document.getElementById('splash-screen');
const locationLabel = document.getElementById('locationLabel');
const dateLabel = document.getElementById('dateLabel');
const hijriDateLabel = document.getElementById('hijriDateLabel');
const prayerGrid = document.getElementById('prayerGrid');
const loadingHint = document.getElementById('loadingHint');
const citySelect = document.getElementById('citySelect');
const useGps = document.getElementById('useGps');
const useIp = document.getElementById('useIp');
const refreshBtn = document.getElementById('refreshBtn');
const countdownEl = document.getElementById('countdown');
const nextNameEl = document.getElementById('nextName');
const notifToggle = document.getElementById('notifToggle');
const themeSelect = document.getElementById('themeSelect');
const volumeBtn = document.getElementById('volumeBtn');
const audioPromptRow = document.getElementById('audio-prompt-row');
const playAdhanBtn = document.getElementById('playAdhanBtn');
const scheduleBtn = document.getElementById('scheduleBtn');
const scheduleModal = document.getElementById('schedule-modal');
const closeModalBtn = document.getElementById('closeModalBtn');
const scheduleTableBody = document.getElementById('schedule-table-body');
const scheduleLoading = document.getElementById('schedule-loading');
const scheduleMonthYear = document.getElementById('schedule-month-year');
const audioPermissionModal = document.getElementById('audio-permission-modal');
const grantAudioBtn = document.getElementById('grantAudioBtn');
const sunanModal = document.getElementById('sunan-modal');
const closeSunanModalBtn = document.getElementById('closeSunanModalBtn');
const sunanModalTitle = document.getElementById('sunan-modal-title');
const sunanModalBody = document.getElementById('sunan-modal-body');
const rawatibBtn = document.getElementById('rawatibBtn');
const rawatibModal = document.getElementById('rawatib-modal');
const closeRawatibModalBtn = document.getElementById('closeRawatibModalBtn');
const countrySelect = document.getElementById('countrySelect');
const countrySearch = document.getElementById('countrySearch');
const citySearch = document.getElementById('citySearch');
const hijriAdjustSelect = document.getElementById('hijriAdjustSelect');
const calcMethodSelect = document.getElementById('calcMethodSelect');
const asrMethodSelect = document.getElementById('asrMethodSelect');
const shareBtn = document.getElementById('shareBtn');
const shareScheduleBtn = document.getElementById('shareScheduleBtn');
const shareSunanBtn = document.getElementById('shareSunanBtn');
const shareRawatibBtn = document.getElementById('shareRawatibBtn');
const shareModal = document.getElementById('share-modal');
const closeShareModalBtn = document.getElementById('closeShareModalBtn');
const shareTextArea = document.getElementById('shareTextArea');
const copyShareBtn = document.getElementById('copyShareBtn');
const waShare = document.getElementById('waShare');
const tgShare = document.getElementById('tgShare');
const shareChooseModal = document.getElementById('share-choose-modal'), closeShareChooseBtn = document.getElementById('closeShareChooseBtn');
const chooseWa = document.getElementById('chooseWa'), chooseTg = document.getElementById('chooseTg');

/* ============================
   Websim Database
   ============================ */
const room = new WebsimSocket();
let currentUser = null;

/* ============================
   حالة التطبيق والمتغيرات
   ============================ */
const state = {
  lat: 29.3084,
  lon: 30.8418,
  method: 5, // Egyptian General Authority of Survey
  school: 0, // 0: Shafi/Maliki/Hanbali, 1: Hanafi
  timings: null,
  nextPrayer: null,
  timerInterval: null,
  notificationTimeouts: [],
  isMuted: true, // Default to muted, will be loaded from DB/localStorage
  audioUnlocked: false,
  monthlyTimings: null,
  theme: 'auto', // Default theme, will be loaded from DB/localStorage
};

// بيانات الصلوات
const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_NAMES = { Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
const PRAYER_ICONS = { Fajr: 'fa-moon', Sunrise: 'fa-sun', Dhuhr: 'fa-sun', Asr: 'fa-cloud-sun', Maghrib: 'fa-cloud-moon', Isha: 'fa-star' };

const SUNAN_DATA = {
    Fajr: `
        <h3>سنة الفجر (قبلية)</h3>
        <ul>
            <li><strong>العدد:</strong> ركعتان</li>
            <li><strong>الدرجة:</strong> سنة مؤكدة بشدة (آكد الرواتب)</li>
            <li><strong>الوقت:</strong> قبل صلاة الفجر.</li>
        </ul>
        <div class="daleel">
            <p><strong>الدليل:</strong><br>
            قال الرسول صلى الله عليه وسلم: "رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا" (رواه مسلم).</p>
            <p>عن عائشة رضي الله عنها: "لم يكن النبي صلى الله عليه وسلم على شيء من النوافل أشد منه تعاهداً على ركعتي الفجر" [رواه البخاري ومسلم].</p>
        </div>
    `,
    Dhuhr: `
        <h3>السنن القبلية</h3>
        <ul>
            <li><strong>العدد:</strong> 4 ركعات (أو ركعتان)</li>
            <li><strong>الدرجة:</strong> سنة مؤكدة</li>
            <li><strong>الوقت:</strong> قبل صلاة الظهر.</li>
        </ul>
        <div class="daleel">
            <p><strong>الدليل:</strong><br>
            عن عائشة رضي الله عنها: "كان النبي صلى الله عليه وسلم يصلي في بيتتي قبل الظهر أربعًا" (رواه مسلم).</p>
        </div>
        <h3>السنن البعدية</h3>
        <ul>
            <li><strong>العدد:</strong> ركعتان (أو 4 ركعات)</li>
            <li><strong>الدرجة:</strong> سنة مؤكدة</li>
            <li><strong>الوقت:</strong> بعد صلاة الظهر.</li>
        </ul>
        <div class="daleel">
            <p><strong>الدليل:</strong><br>
            عن ابن عمر رضي الله عنهما: "حفظت من رسول الله صلى الله عليه وسلم عشر ركعات: ركعتين قبل الظهر، وركعتين بعدها..." [متفق عليه].</p>
        </div>
    `,
    Asr: `
        <h3>سنة العصر (قبلية)</h3>
        <ul>
            <li><strong>العدد:</strong> 4 ركعات قبل صلاة العصر</li>
            <li><strong>الدرجة:</strong> سنة مستحبة (غير مؤكدة)</li>
        </ul>
        <div class="daleel">
            <p><strong>الأدلة:</strong><br>
            قال الرسول صلى الله عليه وسلم: "رحم الله امرأ صلى أربعاً قبل العصر" [رواه الترمذي وحسنه].</p>
            <p>لم يثبت عن النبي صلى الله عليه وسلم المواظبة عليها، لكنها من النوافل المستحبة.</p>
        </div>
    `,
    Maghrib: `
        <h3>سنة المغرب (بعدية)</h3>
        <ul>
            <li><strong>العدد:</strong> ركعتان بعد صلاة المغرب</li>
            <li><strong>الدرجة:</strong> سنة مؤكدة</li>
        </ul>
        <div class="daleel">
            <p><strong>الأدلة:</strong><br>
            عن عبد الله بن عمر رضي الله عنهما: "حفظت من رسول الله صلى الله عليه وسلم عشر ركعات: ... وركعتين بعد المغرب في بيته..." [متفق عليه].</p>
            <p>يجوز صلاة أكثر من ركعتين بعد المغرب (ست أو ثمان) وهي من صلاة الأوابين.</p>
        </div>
    `,
    Isha: `
        <h3>سنة العشاء (بعدية)</h3>
        <ul>
            <li><strong>العدد:</strong> ركعتان بعد صلاة العشاء</li>
            <li><strong>الدرجة:</strong> سنة مؤكدة</li>
        </ul>
        <div class="daleel">
            <p><strong>الأدلة:</strong><br>
            عن ابن عمر رضي الله عنهما: "حفظت من رسول الله صلى الله عليه وسلم عشر ركعات: ... وركعتين بعد العشاء في بيته..." [متفق عليه].</p>
            <p>يجوز تأخيرها إلى منتصف الليل، ويجوز صلاة أكثر من ركعتين بعد العشاء.</p>
        </div>
    `
};

// صوت الأذان
const adhanAudio = new Audio('https://archive.org/download/90---azan---90---azan--many----sound----mp3---alazan_662/041--.mp3');
let audioContext;

/* ============================
   الوظائف الرئيسية
   ============================ */

function formatTo12Hour(time24) {
  if (!time24) return '--:--';
  
  // The API might return time as "HH:MM (TIMEZONE)". We only need "HH:MM".
  const cleanTime = time24.substring(0, 5);
  let [hours, minutes] = cleanTime.split(':').map(Number);

  // Fallback if parsing fails for any reason.
  if (isNaN(hours) || isNaN(minutes)) {
    console.warn('Could not parse time:', time24);
    return '--:--';
  }

  const ampm = hours >= 12 ? 'م' : 'ص';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  return `${hoursStr}:${minutesStr} ${ampm}`;
}

function parseHM(t){
  const s=(t||'').trim().substring(0,5).split(':');
  return [parseInt(s[0]||0), parseInt(s[1]||0)];
}

async function fetchTimings(lat, lon, isRefresh = false) {
  loadingHint.style.display = 'block';
  if (!isRefresh) prayerGrid.innerHTML = '';

  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lon}&method=${state.method}&school=${state.school}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json.code !== 200 || !json.data || json.data.length === 0) throw new Error('Invalid API response');
    
    state.monthlyTimings = json.data;
    /* cache monthly for offline */
    localStorage.setItem(`prayer_monthly_${year}_${month}_${lat.toFixed(3)}_${lon.toFixed(3)}`, JSON.stringify(json.data));
    const todayData = json.data.find(d => d.date.gregorian.day == now.getDate());

    if (!todayData) throw new Error('Could not find today\'s timings in monthly data.');
    
    state.timings = todayData.timings;
    
    renderTimings();
    updateDateLabels();
    updateCountdown();
    scheduleNotifications();
    updateTheme(); // Check theme on new timings
    
    localStorage.setItem('prayer_last_loc', JSON.stringify({ lat, lon }));
    locationLabel.textContent = `(${lat.toFixed(3)}, ${lon.toFixed(3)})`;
  } catch (err) {
    console.error('fetchTimings error', err);
    prayerGrid.innerHTML = `<div class="small muted">تعذّر جلب الأوقات. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.</div>`;
    locationLabel.textContent = 'فشل التحديث';
    state.monthlyTimings = null;
    state.timings = null;
  } finally {
    loadingHint.style.display = 'none';
  }
}

function renderTimings() {
  if (!state.timings) return;
  prayerGrid.innerHTML = '';
  PRAYER_ORDER.forEach(key => {
    const card = document.createElement('div');
    card.className = 'pray';
    card.id = `prayer-${key}`;
    
    const sunanButtonHTML = SUNAN_DATA[key] ? `
        <button class="sunan-info-btn" data-prayer="${key}" title="السنن المرتبطة بالصلاة">
            <i class="fa-solid fa-circle-info"></i>
        </button>
    ` : '<div style="width: 36px;"></div>'; // Placeholder to keep alignment

    card.innerHTML = `
      <div class="pray-main-content">
        <div class="pray-details">
          <div class="icon"><i class="fa-solid ${PRAYER_ICONS[key]}"></i></div>
          <div class="pray-name-wrapper">
            <div class="name">${PRAYER_NAMES[key]}</div>
            <div class="small muted">${key}</div>
          </div>
        </div>
        <div class="pray-actions">
          <div class="time">${formatTo12Hour(state.timings[key])}</div>
          <button class="sunan-info-btn share-prayer-btn" data-prayer="${key}" title="مشاركة"><i class="fa-solid fa-share-nodes"></i></button>
        </div>
      </div>
      ${sunanButtonHTML}
    `;
    prayerGrid.appendChild(card);
  });
}

function updateCountdown() {
    if (!state.timings) {
        countdownEl.textContent = '--:--:--';
        nextNameEl.textContent = '---';
        return;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const prayerTimesToday = PRAYER_ORDER.map(key => {
        const [h,m]=parseHM(state.timings[key]);
        const date = new Date(today); date.setHours(h, m, 0, 0);
        return { key, date };
    });

    let next = prayerTimesToday.find(p => p.date > now);

    if (!next) { // All prayers for today are done, schedule for tomorrow's Fajr
        const [h,m]=parseHM(state.timings['Fajr']);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(h, m, 0, 0);
        next = { key: 'Fajr', date: tomorrow };
    }

    state.nextPrayer = next.key;

    // Highlight next prayer card
    document.querySelectorAll('.pray.next-prayer').forEach(el => el.classList.remove('next-prayer'));
    const nextPrayerCard = document.getElementById(`prayer-${next.key}`);
    if (nextPrayerCard) {
        nextPrayerCard.classList.add('next-prayer');
    }

    const diff = next.date - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    countdownEl.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    nextNameEl.textContent = PRAYER_NAMES[next.key] || next.key;

    // Check if a minute has passed to update the theme
    if (now.getSeconds() === 0) {
        updateTheme();
    }
}

function updateDateLabels(apiDate) {
  const now = new Date();
  dateLabel.textContent = now.toLocaleDateString('ar-EG-u-nu-latn', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const offset = getHijriOffsetForCurrentCountry();
  const adj = new Date(now.getTime() + offset*86400000);
  const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { day:'numeric', month:'long', year:'numeric' }).format(adj);
  hijriDateLabel.textContent = `${hijri} هـ`;
}

function getHijriOffsetForCurrentCountry(){
  const map = JSON.parse(localStorage.getItem('prayer_hijri_offsets')||'{}');
  const key = countrySelect?.value || 'default';
  return parseInt(map[key] ?? 0);
}
function setHijriOffsetForCountry(country, val){
  const map = JSON.parse(localStorage.getItem('prayer_hijri_offsets')||'{}');
  map[country||'default'] = parseInt(val);
  localStorage.setItem('prayer_hijri_offsets', JSON.stringify(map));
}

/* ============================
   جدول المواقيت الشهري
   ============================ */
function renderScheduleTable() {
  if (!state.monthlyTimings) {
    scheduleLoading.textContent = 'لا توجد بيانات لعرضها.';
    scheduleLoading.style.display = 'block';
    scheduleTableBody.innerHTML = '';
    return;
  }

  const today = new Date().getDate();
  let tableHTML = '';

  const firstDayData = state.monthlyTimings[0];
  const monthName = firstDayData.date.hijri.month.ar;
  const year = firstDayData.date.hijri.year;
  scheduleMonthYear.textContent = `جدول شهر ${monthName} ${year} هـ`;

  state.monthlyTimings.forEach(dayData => {
    const day = dayData.date.gregorian.day;
    const isToday = parseInt(day) === today;
    const weekday = dayData.date.hijri.weekday.ar; // Fix: use hijri weekday for Arabic
    
    tableHTML += `
      <tr class="${isToday ? 'is-today' : ''}">
        <td>${weekday}</td>
        <td>${day}</td>
        <td>${formatTo12Hour(dayData.timings.Fajr)}</td>
        <td>${formatTo12Hour(dayData.timings.Sunrise)}</td>
        <td>${formatTo12Hour(dayData.timings.Dhuhr)}</td>
        <td>${formatTo12Hour(dayData.timings.Asr)}</td>
        <td>${formatTo12Hour(dayData.timings.Maghrib)}</td>
        <td>${formatTo12Hour(dayData.timings.Isha)}</td>
      </tr>
    `;
  });

  scheduleTableBody.innerHTML = tableHTML;
  scheduleLoading.style.display = 'none';
}

/* ============================
   السنن المرتبطة بالصلاة
   ============================ */
function openSunanModal(prayerKey) {
  if (!SUNAN_DATA[prayerKey]) return;

  sunanModalTitle.textContent = `السنن المرتبطة بصلاة ${PRAYER_NAMES[prayerKey]}`;
  sunanModalBody.innerHTML = SUNAN_DATA[prayerKey];
  sunanModal.classList.add('visible');
}

/* ============================
   الإشعارات والصوت
   ============================ */
function scheduleNotifications() {
  state.notificationTimeouts.forEach(t => clearTimeout(t));
  state.notificationTimeouts = [];

  if (!notifToggle.checked || !state.timings) return;

  const now = new Date();
  PRAYER_ORDER.forEach(key => {
    if (key === 'Sunrise') return; // No adhan for sunrise
    
    const [h,m]=parseHM(state.timings[key]);
    const prayerDate = new Date(); prayerDate.setHours(h, m, 0, 0);

    if (prayerDate > now) {
      const delay = prayerDate - now;
      const timeoutId = setTimeout(() => {
        showNotification(key);
      }, delay);
      state.notificationTimeouts.push(timeoutId);
    }
  });
}

function showNotification(prayerKey) {
  const title = `حان الآن موعد أذان ${PRAYER_NAMES[prayerKey]}`;
  const options = {
    body: `الوقت: ${formatTo12Hour(state.timings[prayerKey])}`,
    icon: 'https://i.ibb.co/LzR84ngM/Picsart-25-09-12-03-07-34-800.png'
  };
  try {
    new Notification(title, options);
  } catch(e) {
    console.error("Notification API error: ", e);
  }
  
  if (!state.isMuted) {
    // Programmatically click the play button if audio is paused.
    // This ensures the full logic including UI updates and audio unlocking is triggered.
    if (adhanAudio.paused) {
      playAdhanBtn.click();
    }
  }
}

async function unlockAudio() {
  if (state.audioUnlocked) return true;

  // Create AudioContext on user gesture
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser.");
      return false;
    }
  }

  // Resume context if it's suspended
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  // A common trick to "prime" the audio for programmatic playback
  try {
    adhanAudio.volume = 0; // Play silently
    await adhanAudio.play();
    adhanAudio.pause();
    adhanAudio.currentTime = 0;
    adhanAudio.volume = 1; // Reset volume
    state.audioUnlocked = true;
    console.log('Audio unlocked successfully.');
    audioPromptRow.style.display = 'none'; // Hide prompt on success
    localStorage.setItem('prayer_audio_permission_granted', 'true');
    return true;
  } catch (e) {
    console.error("Audio unlocking failed:", e);
    alert('فشل تفعيل الصوت. قد تكون هناك قيود من المتصفح.');
    return false;
  }
}

async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        alert('متصفحك لا يدعم الإشعارات.');
        return false;
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        alert('لم يتم منح إذن عرض الإشعارات.');
        return false;
    }
    return true;
}

function playAdhan() {
    if (state.isMuted) return;

    if (!state.audioUnlocked) {
        console.warn('Adhan will not play because audio is not unlocked by user interaction.');
        // Optionally, show a non-intrusive message to the user here
        return;
    }
    
    adhanAudio.currentTime = 0; // Rewind before playing
    adhanAudio.play().catch(e => console.error("Error playing adhan:", e));
}

async function saveSetting(key, value) {
  // Save to localStorage as a fallback
  localStorage.setItem(`prayer_${key}`, value);

  // Save to database if user is logged in
  if (currentUser) {
    try {
      const settingsUpdate = { id: currentUser.id, [key]: value };
      await room.collection('user_settings').upsert(settingsUpdate);
    } catch (e) {
      console.error("Failed to save setting to database:", e);
    }
  }
}

async function toggleMute() {
    const turningSoundOn = state.isMuted;

    if (turningSoundOn) {
        const unlocked = await unlockAudio();
        if (!unlocked) {
            // If unlocking fails, don't change the mute state.
            return;
        }
    }

    state.isMuted = !state.isMuted;
    await saveSetting('is_muted', state.isMuted);
    updateVolumeIcon();
    
    if (state.isMuted && !adhanAudio.paused) {
        adhanAudio.pause();
        adhanAudio.currentTime = 0;
    }
}

function updateVolumeIcon() {
    const icon = volumeBtn.querySelector('i');
    if (state.isMuted) {
        icon.classList.remove('fa-volume-high');
        icon.classList.add('fa-volume-xmark');
        if (!state.audioUnlocked) {
          audioPromptRow.style.display = 'flex';
        }
    } else {
        icon.classList.remove('fa-volume-xmark');
        icon.classList.add('fa-volume-high');
        audioPromptRow.style.display = 'none';
    }
}

/* ============================
   إعدادات وحفظ الحالة
   ============================ */

function updateTheme() {
    if (state.theme !== 'auto' || !state.timings) {
        // If theme is not auto, or we don't have prayer times, do nothing.
        // The theme is already set to 'light' or 'dark' from user selection.
        return;
    }
    
    const now = new Date();
    
    const sunriseTime = state.timings['Sunrise'];
    const maghribTime = state.timings['Maghrib'];
    
    if (!sunriseTime || !maghribTime) return;

    const [sunriseH, sunriseM] = sunriseTime.split(':').map(Number);
    const [maghribH, maghribM] = maghribTime.split(':').map(Number);
    
    const sunriseDate = new Date();
    sunriseDate.setHours(sunriseH, sunriseM, 0, 0);
    
    const maghribDate = new Date();
    maghribDate.setHours(maghribH, maghribM, 0, 0);

    // It's day time if current time is after sunrise and before maghrib
    if (now >= sunriseDate && now < maghribDate) {
        document.documentElement.dataset.theme = 'light';
    } else {
        document.documentElement.dataset.theme = 'dark';
    }
}

function applyTheme(theme) {
  state.theme = theme;
  saveSetting('theme', theme);
  themeSelect.value = theme;

  if (theme === 'auto') {
      updateTheme(); // Immediately apply auto theme logic
  } else {
      document.documentElement.dataset.theme = theme;
  }
}

async function loadSavedState() {
    // 1. Get current user
    try {
        currentUser = await window.websim.getCurrentUser();
    } catch (e) {
        console.warn("Could not get current user. App will run in anonymous mode.", e);
        currentUser = null;
    }

    // 2. Try loading from database if user exists
    let dbSettings = null;
    if (currentUser) {
        try {
            const settingsList = await room.collection('user_settings').filter({ id: currentUser.id }).getList();
            if (settingsList.length > 0) {
              dbSettings = settingsList[0];
            }
        } catch (e) {
            console.error("Failed to load settings from database:", e);
        }
    }

    // 3. Load settings from DB or fallback to localStorage
    const theme = dbSettings?.theme ?? localStorage.getItem('prayer_theme');
    applyTheme(theme || 'auto');
    calcMethodSelect.value = String(dbSettings?.method ?? parseInt(localStorage.getItem('prayer_method')||state.method));
    asrMethodSelect.value = String(dbSettings?.school ?? parseInt(localStorage.getItem('prayer_school')||state.school));

    const notifEnabled = dbSettings ? dbSettings.notifications_enabled : localStorage.getItem('prayer_notif') === 'true';
    notifToggle.checked = notifEnabled;
    
    const isMuted = dbSettings ? dbSettings.is_muted : localStorage.getItem('prayer_is_muted') !== 'false';
    state.isMuted = isMuted;
    updateVolumeIcon();

    // 4. Load location and fetch timings
    const savedLoc = dbSettings ? { lat: dbSettings.lat, lon: dbSettings.lon } : JSON.parse(localStorage.getItem('prayer_last_loc'));

    if (savedLoc && savedLoc.lat && savedLoc.lon) {
        state.lat = savedLoc.lat;
        state.lon = savedLoc.lon;
        await fetchTimings(state.lat, state.lon);
    } else {
        await new Promise(resolve => tryGeolocation(resolve));
    }
    
    // 5. If no DB settings, create the initial record
    if (currentUser && !dbSettings) {
        console.log("No DB settings found for user, creating initial record.");
        const initialSettings = {
            id: currentUser.id,
            lat: state.lat,
            lon: state.lon,
            theme: state.theme,
            is_muted: state.isMuted,
            notifications_enabled: notifToggle.checked
        };
        await room.collection('user_settings').upsert(initialSettings);
    }
    calcMethodSelect.dispatchEvent(new Event('change'));
    asrMethodSelect.dispatchEvent(new Event('change'));
}

/* ============================
   تحديد الموقع
   ============================ */
function tryGeolocation(onComplete) {
  if (!navigator.geolocation) {
    return fallbackToIP(onComplete);
  }
  locationLabel.textContent = 'جاري طلب إذن الموقع...';
  navigator.geolocation.getCurrentPosition(pos => {
    saveSetting('lat', pos.coords.latitude);
    saveSetting('lon', pos.coords.longitude);
    fetchTimings(pos.coords.latitude, pos.coords.longitude).finally(onComplete);
  }, err => {
    console.warn('Geolocation failed', err);
    fallbackToIP(onComplete);
  }, { timeout: 10000, enableHighAccuracy: false });
}

async function fallbackToIP(onComplete) {
  locationLabel.textContent = 'تحديد الموقع عبر IP...';
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    if (!data.latitude || !data.longitude) throw new Error('IP API failed');
    saveSetting('lat', data.latitude);
    saveSetting('lon', data.longitude);
    await fetchTimings(data.latitude, data.longitude);
  } catch (err) {
    console.warn('IP fallback failed', err);
    locationLabel.textContent = 'فشل التحديد التلقائي.';
    // Use default location on final failure
    saveSetting('lat', state.lat);
    saveSetting('lon', state.lon);
    await fetchTimings(state.lat, state.lon);
  } finally {
    if (onComplete) onComplete();
  }
}

/* ============================
   ربط الأحداث
   ============================ */
themeSelect.addEventListener('change', () => {
    applyTheme(themeSelect.value);
});
useGps.addEventListener('click', tryGeolocation);
useIp.addEventListener('click', fallbackToIP);

refreshBtn.addEventListener('click', async () => {
    const icon = refreshBtn.querySelector('i');
    icon.classList.add('fa-spin');
    refreshBtn.disabled = true;

    try {
        await fetchTimings(state.lat, state.lon, true);
    } finally {
        setTimeout(() => {
            icon.classList.remove('fa-spin');
            refreshBtn.disabled = false;
        }, 500);
    }
});

volumeBtn.addEventListener('click', toggleMute);

countrySelect.addEventListener('change', ()=>{
  populateCityOptions(countrySelect.value);
  const off = getHijriOffsetForCurrentCountry();
  hijriAdjustSelect.value = String(off);
  updateDateLabels();
});

citySelect.addEventListener('change', () => {
  if (!citySelect.value) return;
  const [lat, lon] = citySelect.value.split(',').map(parseFloat);
  state.lat = lat; state.lon = lon;
  saveSetting('lat', lat); saveSetting('lon', lon);
  fetchTimings(lat, lon);
});

notifToggle.addEventListener('change', async () => {
    await saveSetting('notifications_enabled', notifToggle.checked);
    if (notifToggle.checked) {
        const permissionGranted = await requestNotificationPermission();
        if (permissionGranted) {
            scheduleNotifications();
        } else {
            notifToggle.checked = false; // Revert checkbox if permission denied
            await saveSetting('notifications_enabled', false);
        }
    } else {
        state.notificationTimeouts.forEach(t => clearTimeout(t));
        state.notificationTimeouts = [];
    }
});

scheduleBtn.addEventListener('click', () => {
  renderScheduleTable();
  scheduleModal.classList.add('visible');
});

closeModalBtn.addEventListener('click', () => {
  scheduleModal.classList.remove('visible');
});

scheduleModal.addEventListener('click', (e) => {
  if (e.target === scheduleModal) {
    scheduleModal.classList.remove('visible');
  }
});

// Sunan Modal Events
closeSunanModalBtn.addEventListener('click', () => {
  sunanModal.classList.remove('visible');
});

sunanModal.addEventListener('click', (e) => {
  if (e.target === sunanModal) {
    sunanModal.classList.remove('visible');
  }
});

prayerGrid.addEventListener('click', (e) => {
    const infoBtn = e.target.closest('.sunan-info-btn');
    const shareBtnEl = e.target.closest('.share-prayer-btn');
    if (shareBtnEl) {
        const k = shareBtnEl.dataset.prayer;
        if (state.timings && k) shareText(buildShareTextForPrayer(k));
        return;
    }
    if (infoBtn && !infoBtn.classList.contains('share-prayer-btn')) {
        const prayerKey = infoBtn.dataset.prayer;
        openSunanModal(prayerKey);
    }
});

// Rawatib Modal Events
rawatibBtn.addEventListener('click', () => {
    rawatibModal.classList.add('visible');
});

closeRawatibModalBtn.addEventListener('click', () => {
    rawatibModal.classList.remove('visible');
});

rawatibModal.addEventListener('click', (e) => {
    if (e.target === rawatibModal) {
        rawatibModal.classList.remove('visible');
    }
});

playAdhanBtn.addEventListener('click', async () => {
    const unlocked = await unlockAudio();
    if (!unlocked) return;

    const icon = playAdhanBtn.querySelector('i');
    const textSpan = playAdhanBtn.querySelector('span');

    if (adhanAudio.paused) {
        adhanAudio.currentTime = 0; // Always restart
        adhanAudio.play().catch(e => console.error("Error playing adhan manually:", e));
        icon.classList.replace('fa-play', 'fa-stop');
        textSpan.textContent = 'إيقاف';
    } else {
        adhanAudio.pause();
        adhanAudio.currentTime = 0;
        icon.classList.replace('fa-stop', 'fa-play');
        textSpan.textContent = 'تشغيل';
    }
});

adhanAudio.addEventListener('ended', () => {
    const icon = playAdhanBtn.querySelector('i');
    const textSpan = playAdhanBtn.querySelector('span');
    if (icon && textSpan) {
        icon.classList.replace('fa-stop', 'fa-play');
        textSpan.textContent = 'تشغيل';
    }
});

grantAudioBtn.addEventListener('click', async () => {
    const unlocked = await unlockAudio();
    if (unlocked) {
        audioPermissionModal.classList.remove('visible');
    }
});

/* ============================
   PWA (Progressive Web App)
   ============================ */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBtn').style.display = 'inline-flex';
});

document.getElementById('installBtn').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  document.getElementById('installBtn').style.display = 'none';
});

/* ============================
   بدء تشغيل التطبيق
   ============================ */
async function init() {
    // Load state and wait for initial data fetching to complete
    await loadSavedState();

    // Hide splash screen and show the app with a smooth transition
    splashScreen.classList.add('hidden');
    app.classList.add('visible');
    
    // Remove the splash screen from the DOM after the transition ends
    splashScreen.addEventListener('transitionend', () => {
        splashScreen.remove();
    }, { once: true });

    // Check if we need to ask for audio permission after the main UI is visible
    setTimeout(() => {
      // Autoplay policies can be tricky. We check if context is suspended.
      // This is a more reliable check than a simple localStorage flag for this purpose.
      if ((!audioContext || audioContext.state === 'suspended') && !state.audioUnlocked && !localStorage.getItem('prayer_audio_permission_granted')) {
        audioPermissionModal.classList.add('visible');
      }
    }, 1200); // Show modal shortly after the app appears

    // Start recurring updates
    setInterval(updateCountdown, 1000);
    setInterval(() => updateDateLabels(), 60 * 60 * 1000); // Refresh dates hourly
    if ('serviceWorker' in navigator) { try { await navigator.serviceWorker.register('sw.js'); } catch(e){ console.warn('SW failed', e);} }
}

init();

import { CITY_GROUPS } from './countries.js';
import { EGYPT_CITIES } from './egypt-cities.js';

function populateCountries(filterText=''){
  countrySelect.innerHTML = '<option value="">-- اختر الدولة --</option>';
  CITY_GROUPS['مصر'] = EGYPT_CITIES; // ensure Egypt list enhanced
  const keys = Object.keys(CITY_GROUPS).sort((a,b)=>a.localeCompare(b,'ar'));
  keys.forEach(c=>{
    if(filterText && !c.includes(filterText)) return;
    const o=document.createElement('option'); o.value=c; o.textContent=c; countrySelect.appendChild(o);
  });
}
function populateCityOptions(country, filterText=''){
  citySelect.innerHTML = '<option value="">-- اختر المدينة --</option>';
  const list = CITY_GROUPS[country] || [];
  list.forEach(c=>{
    if(filterText && !c.name.includes(filterText)) return;
    const o=document.createElement('option'); o.value=`${c.lat},${c.lon}`; o.textContent=c.name; citySelect.appendChild(o);
  });
  const has = list.length>0;
  citySelect.disabled = !has;
  citySearch.disabled = !has;
}
countrySearch.addEventListener('input', ()=>{
  populateCountries(countrySearch.value.trim());
});
countrySelect.addEventListener('change', ()=>{
  populateCityOptions(countrySelect.value, citySearch.value.trim());
});
citySearch.addEventListener('input', ()=>{
  populateCityOptions(countrySelect.value, citySearch.value.trim());
});
widgetBtn.addEventListener('click', ()=> window.open('widget.html', '_blank'));
hijriAdjustSelect.addEventListener('change', ()=>{
  setHijriOffsetForCountry(countrySelect.value, hijriAdjustSelect.value);
  updateDateLabels();
});

function buildShareTextForToday() {
  if (!state.timings) return 'لا توجد مواقيت متاحة.';
  const lines = PRAYER_ORDER.map(k => `${PRAYER_NAMES[k]}: ${formatTo12Hour(state.timings[k])}`);
  const loc = `الموقع: (${state.lat.toFixed(3)}, ${state.lon.toFixed(3)})`;
  return `مواقيت الصلاة لليوم:\n${lines.join('\n')}\n${loc}`;
}

async function shareText(text) {
  try {
    if (navigator.share) { await navigator.share({ text }); return; }
  } catch(_) { /* fall through to modal */ }
  openShareModal(text);
}

function openShareModal(text){
  const t = text || buildShareTextForToday();
  shareTextArea.value = t;
  waShare.href = `https://wa.me/?text=${encodeURIComponent(t)}`;
  tgShare.href = `https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(t)}`;
  shareModal.classList.add('visible');
}

closeShareModalBtn.addEventListener('click', ()=> shareModal.classList.remove('visible'));
shareModal.addEventListener('click', (e)=> { if(e.target===shareModal) shareModal.classList.remove('visible'); });
copyShareBtn.addEventListener('click', async ()=>{
  try { await navigator.clipboard.writeText(shareTextArea.value); alert('تم نسخ النص'); } catch(_) {}
});

function buildShareTextForPrayer(key){
  return `${PRAYER_NAMES[key]} اليوم عند ${formatTo12Hour(state.timings[key])}\nالموقع: (${state.lat.toFixed(3)}, ${state.lon.toFixed(3)})`;
}

calcMethodSelect.addEventListener('change', async () => {
  state.method = parseInt(calcMethodSelect.value, 10) || 5;
  await saveSetting('method', state.method);
  fetchTimings(state.lat, state.lon, true);
});

asrMethodSelect.addEventListener('change', async () => {
  state.school = parseInt(asrMethodSelect.value, 10) || 0;
  await saveSetting('school', state.school);
  fetchTimings(state.lat, state.lon, true);
});

shareBtn.addEventListener('click', () => {
  if (!state.timings) return;
  shareTodayAsHTML();
});

shareScheduleBtn.addEventListener('click', async () => {
  const el = document.querySelector('#schedule-modal .modal-content');
  if (!el) return;
  await shareElementAsHTML(el, 'prayer-schedule.html', 'جدول المواقيت الشهري');
});

shareSunanBtn.addEventListener('click', async () => {
  const el = document.querySelector('#sunan-modal .modal-content');
  if (!el) return;
  await shareElementAsHTML(el, 'sunan.html', 'السنن المرتبطة');
});

shareRawatibBtn.addEventListener('click', async () => {
  const el = document.querySelector('#rawatib-modal .modal-content');
  if (!el) return;
  await shareElementAsHTML(el, 'rawatib.html', 'السنن والرواتب');
});

async function shareElementAsPDF(el, filename = 'share.pdf') {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) return;
  const canvas = await html2canvas(el, {scale: 2, useCORS: true, backgroundColor: '#fff'});
  const img = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF('p','pt','a4');
  const pageW = pdf.internal.pageSize.getWidth(), pageH = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);
  const w = canvas.width * ratio, h = canvas.height * ratio;
  pdf.addImage(img, 'JPEG', (pageW - w)/2, 20, w, h);
  const blob = pdf.output('blob'); const file = new File([blob], filename, {type:'application/pdf'});
  if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: document.title }); return; }
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
}

async function shareHTMLString(html, filename = 'share.html') {
  const blob = new Blob([html], { type: 'text/html' });
  const file = new File([blob], filename, { type: 'text/html' });
  if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: document.title, text: 'اختر التطبيق لإرسال ملف المواقيت' }); return; }
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  openPostDownloadShare(filename);
}

function openPostDownloadShare(filename){
  const msg = `تم حفظ ملف ${filename} على جهازك.\nافتح واتساب/تيليجرام ثم أرفق الملف من "الملفات".`;
  chooseWa.href = `https://wa.me/?text=${encodeURIComponent(msg)}`;
  chooseTg.href = `https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(msg)}`;
  shareChooseModal.classList.add('visible');
}

closeShareChooseBtn.addEventListener('click', ()=> shareChooseModal.classList.remove('visible'));
shareChooseModal.addEventListener('click', (e)=> { if(e.target===shareChooseModal) shareChooseModal.classList.remove('visible'); });

function wrapShareHTML(title, bodyContent) {
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet"><title>${title}</title><style>body{font-family:'Cairo',system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#fff;color:#0f172a;margin:0}header{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #e5e7eb;background:#fff}h1{font-size:1.15rem;margin:0}small{color:#64748b}main.container{max-width:860px;margin:0 auto;padding:16px}.card{border:1px solid #e5e7eb;border-radius:16px;padding:16px;box-shadow:0 6px 18px rgba(0,0,0,.06);background:#fff}table{width:100%;border-collapse:separate;border-spacing:0;margin-top:8px;overflow:hidden;border-radius:12px}th,td{border-bottom:1px solid #eef2f7;padding:.7rem .6rem;text-align:center;white-space:nowrap}th{color:#64748b;font-weight:600;background:#f8fafc}tbody tr:nth-child(even){background:#f9fafb}</style></head><body><header><h1>${title}</h1><small>${new Date().toLocaleString('ar-EG')}</small></header><main class="container">${bodyContent}</main></body></html>`;
}

async function shareElementAsHTML(el, filename = 'share.html', docTitle = document.title) {
  const html = wrapShareHTML(docTitle, el.outerHTML);
  await shareHTMLString(html, filename);
}

function shareTodayAsHTML() {
  const rows = PRAYER_ORDER.map(k => `<tr><td>${PRAYER_NAMES[k]}</td><td>${formatTo12Hour(state.timings[k])}</td></tr>`).join('');
  const content = `
    <div class="card">
      <h1>مواقيت الصلاة لليوم</h1>
      <div class="muted" style="margin-bottom:.75rem;">الموقع: (${state.lat.toFixed(3)}, ${state.lon.toFixed(3)})</div>
      <table><thead><tr><th>الصلاة</th><th>الوقت</th></tr></thead><tbody>${rows}</tbody></table>
    </div>`;
  const html = wrapShareHTML('مواقيت الصلاة لليوم', content);
  shareHTMLString(html, 'prayer-today.html');
}