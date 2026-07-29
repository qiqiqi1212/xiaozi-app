/* 小紫同学 · 主程序 */
'use strict';
const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const z = (n) => String(n).padStart(2, '0');
  const dateKey = (d) => { d = d || new Date(); return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); };
  const daysLeft = (str) => { if (!str) return null; const a = new Date(dateKey() + 'T00:00:00'); const b = new Date(str + 'T00:00:00'); return Math.round((b - a) / 86400000); };
  const now = () => new Date().toISOString();
  function repeatLabel(r) { return ({ none: '', daily: '每天', weekly: '每周', monthly: '每月', weekday: '工作日' }[r] || ''); }
  function nextOccurrence(repeat, fromKey) {
    const d = new Date(fromKey + 'T00:00:00');
    if (repeat === 'daily') d.setDate(d.getDate() + 1);
    else if (repeat === 'weekly') d.setDate(d.getDate() + 7);
    else if (repeat === 'monthly') { const dim = new Date(d.getFullYear(), d.getMonth() + 2, 0).getDate(); d.setDate(Math.min(d.getDate(), dim)); d.setMonth(d.getMonth() + 1); }
    else if (repeat === 'weekday') { do { d.setDate(d.getDate() + 1); } while (d.getDay() === 0 || d.getDay() === 6); }
    return dateKey(d);
  }
  function computeStreak(id) {
    const logs = (DB.state.taskLogs && DB.state.taskLogs[id]) || [];
    if (!logs.length) return 0;
    let streak = 0; const d = new Date();
    for (;;) { const k = dateKey(d); if (logs.includes(k)) { streak++; d.setDate(d.getDate() - 1); } else break; }
    return streak;
  }

  let currentTab = 'home';
  let fitTimer = null;

  /* ---------- 任务优先级引擎 ---------- */
  function priorityOf(t) {
    if (t.done) return { level: 'done', label: '已完成', urg: 'done', days: null, dueTxt: '' };
    const days = daysLeft(t.deadline);
    let urg = 'later';
    if (days === null) urg = 'later';
    else if (days < 0) urg = 'over';
    else if (days <= 1) urg = 'urgent';
    else if (days <= 3) urg = 'soon';
    const imp = t.importance || 'mid';
    const map = {
      over: { high: 'p0', mid: 'p0', low: 'p2' },
      urgent: { high: 'p0', mid: 'p1', low: 'p2' },
      soon: { high: 'p1', mid: 'p2', low: 'p3' },
      later: { high: 'p2', mid: 'p3', low: 'p3' }
    };
    const level = map[urg][imp];
    const labelMap = { p0: '紧急重要', p1: '重要', p2: '紧急', p3: '普通' };
    const dueTxt = days === null ? '无截止日' : days < 0 ? '逾期' + (-days) + '天' : days === 0 ? '今天截止' : '剩' + days + '天';
    return { level, label: labelMap[level], urg, days, dueTxt };
  }
  const LEVEL_ORDER = { p0: 0, p1: 1, p2: 2, p3: 3, done: 9 };
  function sortTasks(arr) {
    return arr.slice().sort((a, b) => {
      const pa = priorityOf(a), pb = priorityOf(b);
      if (LEVEL_ORDER[pa.level] !== LEVEL_ORDER[pb.level]) return LEVEL_ORDER[pa.level] - LEVEL_ORDER[pb.level];
      const da = a.deadline ? new Date(a.deadline) : new Date(9999, 0, 1);
      const db = b.deadline ? new Date(b.deadline) : new Date(9999, 0, 1);
      return da - db;
    });
  }

  /* ---------- Toast & Modal ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.add('hidden'), 2200);
  }
  const modalRoot = $('#modal-root');
  function closeModal() { modalRoot.classList.remove('show'); modalRoot.innerHTML = ''; }
  function fieldHTML(f, v) {
    const val = v && v[f.key] != null ? v[f.key] : '';
    let ctrl;
    if (f.type === 'textarea') ctrl = `<textarea name="${f.key}" placeholder="${esc(f.placeholder || '')}">${esc(val)}</textarea>`;
    else if (f.type === 'select') {
      const opts = (f.options || []).map((o) => { const ov = typeof o === 'string' ? o : o.v; const ol = typeof o === 'string' ? o : o.label; return `<option value="${esc(ov)}" ${String(ov) === String(val) ? 'selected' : ''}>${esc(ol)}</option>`; }).join('');
      ctrl = `<select name="${f.key}">${opts}</select>`;
    } else ctrl = `<input name="${f.key}" type="${f.type || 'text'}" placeholder="${esc(f.placeholder || '')}" value="${esc(val)}" ${f.step ? 'step="' + f.step + '"' : ''}>`;
    return `<div class="field"><label>${esc(f.label)}</label>${ctrl}</div>`;
  }
  function openForm(title, fields, values, onSubmit) {
    const html = `<div class="modal-mask" data-act="close-modal"></div>
      <div class="modal"><div class="modal-head"><h3>${esc(title)}</h3><button class="modal-close" data-act="close-modal">✕</button></div>
      <form id="fm">${fields.map((f) => fieldHTML(f, values)).join('')}
      <div class="btn-row"><button type="button" class="btn ghost" data-act="close-modal">取消</button><button type="submit" class="btn">保存</button></div>
      </form></div>`;
    modalRoot.innerHTML = html; modalRoot.classList.add('show');
    const form = $('#fm');
    form.addEventListener('submit', (e) => {
      e.preventDefault(); const v = {};
      fields.forEach((f) => { const el = form.elements[f.key]; v[f.key] = el ? el.value : ''; });
      closeModal(); onSubmit(v);
    });
  }
  modalRoot.addEventListener('click', (e) => { if (e.target.dataset.act === 'close-modal') closeModal(); });

  /* ---------- 天气 ---------- */
  const WX = {
    0: ['☀️', '晴'], 1: ['🌤️', '少云'], 2: ['⛅', '多云'], 3: ['☁️', '阴'],
    45: ['🌫️', '雾'], 48: ['🌫️', '雾凇'], 51: ['🌦️', '毛毛雨'], 53: ['🌦️', '毛毛雨'], 55: ['🌦️', '毛毛雨'],
    61: ['🌧️', '小雨'], 63: ['🌧️', '中雨'], 65: ['🌧️', '大雨'], 66: ['🌧️', '冻雨'], 67: ['🌧️', '冻雨'],
    71: ['🌨️', '小雪'], 73: ['🌨️', '中雪'], 75: ['🌨️', '大雪'], 77: ['🌨️', '雪粒'],
    80: ['🌦️', '阵雨'], 81: ['🌦️', '阵雨'], 82: ['⛈️', '强阵雨'], 85: ['🌨️', '阵雪'], 86: ['🌨️', '阵雪'],
    95: ['⛈️', '雷雨'], 96: ['⛈️', '雷雹'], 99: ['⛈️', '雷雹']
  };
  function wxCode(c) { return WX[c] || ['🌡️', '未知']; }
  async function fetchWeather() {
    const city = DB.state.profile.city || '北京';
    try {
      const g = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh`);
      const gj = await g.json();
      if (!gj.results || !gj.results.length) return { error: '未找到城市：' + city };
      const { latitude, longitude, name } = gj.results[0];
      const f = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`);
      const w = await f.json();
      return { name: name || city, w };
    } catch (e) { return { error: '网络错误，请检查网络后刷新' }; }
  }

  /* ---------- 渲染：通用任务列表 ---------- */
  function renderTaskItem(t) {
    const p = priorityOf(t);
    const estTxt = t.est ? `· 约${t.est}h` : '';
    const catTxt = t.cat ? `· ${esc(t.cat)}` : '';
    const dueCls = p.urg === 'over' ? 'due-over' : (p.urg === 'urgent' || p.urg === 'soon') ? 'due-soon' : '';
    const repTxt = (t.repeat && t.repeat !== 'none') ? `<span class="badge b-repeat">🔁${repeatLabel(t.repeat)}</span>` : '';
    const streakTxt = (t.repeat && t.repeat !== 'none' && !t.done) ? (() => { const s = computeStreak(t.id); return s > 0 ? `<span class="streak">🔥连续${s}天</span>` : ''; })() : '';
    return `<div class="task ${t.done ? 'done' : ''}" data-id="${t.id}">
      <div class="check" data-act="toggle-task" data-id="${t.id}">${t.done ? '✓' : ''}</div>
      <div class="t-body">
        <div class="t-title">${esc(t.title)}</div>
        <div class="t-meta">
          <span class="badge b-${p.level}">${p.label}</span>
          <span class="${dueCls}">${p.dueTxt}</span>
          ${repTxt}${streakTxt}
          <span>${catTxt}${estTxt}</span>
        </div>
        ${t.detail ? `<div class="muted" style="margin-top:3px">${esc(t.detail)}</div>` : ''}
      </div>
      <div class="t-actions">
        <button class="btn soft sm" data-act="edit-task" data-id="${t.id}">改</button>
        <button class="btn danger sm" data-act="del-task" data-id="${t.id}">删</button>
      </div>
    </div>`;
  }

  /* ================= 首页 ================= */
  function renderHome() {
    const today = new Date();
    const tasksAll = DB.state.tasks.filter((t) => !t.done);
    const due = tasksAll.filter((t) => { const p = priorityOf(t); return p.urg === 'over' || p.urg === 'urgent' || p.urg === 'soon'; });
    const f = XZ_CONTENT.fortune(today);
    const water = DB.state.water[dateKey()] || 0;
    const pi = periodInfo();
    const monthExp = monthTotal();

    const html = `
    <div class="hero fade-in">
      <h2>${greet()}，${esc(DB.state.profile.name)} 💜</h2>
      <p>${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 · ${'日一二三四五六'[today.getDay()]} · 今天也要加油呀</p>
    </div>

    <div class="card">
      <div class="card-title"><span class="emoji">🔔</span>今日待办 & 临期<span class="sub">${due.length} 项需关注</span></div>
      ${due.length ? sortTasks(due).slice(0, 6).map(renderTaskItem).join('') : '<div class="empty">暂时没有临期任务，棒棒哒 ✨</div>'}
      <div class="btn-row"><button class="btn soft sm" data-act="goto" data-tab="work">看工作</button><button class="btn soft sm" data-act="goto" data-tab="study">看学习</button></div>
    </div>

    <div class="tile-grid">
      <div class="tile" data-act="goto" data-tab="work"><div class="t-emoji">📚</div><div class="t-name">工作</div><div class="t-desc">课题·论文·成员进度</div></div>
      <div class="tile" data-act="goto" data-tab="study"><div class="t-emoji">🎓</div><div class="t-name">学习</div><div class="t-desc">考研·英语·时政</div></div>
      <div class="tile" data-act="goto" data-tab="life"><div class="t-emoji">🌿</div><div class="t-name">生活</div><div class="t-desc">记账·护肤·提醒</div></div>
      <div class="tile" data-act="goto" data-tab="other"><div class="t-emoji">📝</div><div class="t-name">其他</div><div class="t-desc">备忘录</div></div>
    </div>

    <div class="card" style="margin-top:14px">
      <div class="card-title"><span class="emoji">📰</span>今日热点新闻<span class="sub"><button class="btn soft sm" data-act="refresh-news">刷新</button></span></div>
      <div id="news-body"><div class="empty">加载中…</div></div>
    </div>

    <div class="card" style="margin-top:14px">
      <div class="card-title"><span class="emoji">🔮</span>今日运势 · 穿衣<span class="sub">${f.gz}日 · ${f.elem}</span></div>
      <div class="fortune-top">
        <div class="fortune-score" style="--p:${f.score}%"><b>${f.score}</b><span>${f.level}</span></div>
        <div style="flex:1">
          <div class="muted">贵人色(大吉)</div>
          <div class="color-row">${f.best.map((c) => `<span class="color-dot" style="background:${c.c}"></span>`).join('')}<span class="color-tag good">${f.best.map((c) => c.n).join('/')}</span></div>
          <div class="muted" style="margin-top:6px">次吉</div>
          <div class="color-row">${f.good.map((c) => `<span class="color-dot" style="background:${c.c}"></span>`).join('')}<span class="color-tag mid">${f.good.map((c) => c.n).join('/')}</span></div>
        </div>
      </div>
      <div class="muted" style="margin-top:8px">💡 ${esc(f.tip)}</div>
    </div>

    <div class="card">
      <div class="card-title"><span class="emoji">💧</span>今日喝水<span class="sub">${water}/${DB.state.waterGoal} 杯</span></div>
      <div class="bar"><i style="width:${Math.min(100, (water / DB.state.waterGoal) * 100)}%"></i></div>
      ${pi ? `<div class="kv"><span>🩸 下次经期预计</span><span>${pi.days <= 0 ? '可能就在最近' : '约 ' + pi.days + ' 天后'}（${pi.next}）</span></div>` : ''}
      <div class="kv"><span>💰 本月记账</span><span>¥${monthExp.toFixed(2)}</span></div>
    </div>`;
    $('#view').innerHTML = html;
    fetchHotNews();
  }

  function greet() {
    const h = new Date().getHours();
    if (h < 6) return '夜深了'; if (h < 11) return '早上好'; if (h < 13) return '中午好'; if (h < 18) return '下午好'; return '晚上好';
  }

  /* ================= 今日热点新闻（在线RSS + 离线兜底） ================= */
  function newsListHTML(items, badge) {
    return '<div class="news-list">' + items.map((it) => `<a class="news-item" href="${esc(it.url)}" target="_blank" rel="noopener"><span class="news-title">${esc(it.title)}</span>${it.source ? `<span class="news-src">${esc(it.source)}</span>` : ''}</a>`).join('') + '</div>' + (badge || '');
  }
  // 抓取一个 RSS 源（依次尝试两个 CORS 代理，挂一个自动换）
  async function pullFeed(feed) {
    const proxys = [
      (u) => 'https://api.allorigins.win/get?url=' + encodeURIComponent(u),
      (u) => 'https://corsproxy.io/?url=' + encodeURIComponent(u)
    ];
    for (const mk of proxys) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 6000);
        const r = await fetch(mk(feed.url), { signal: ctrl.signal });
        clearTimeout(timer);
        const j = await r.json().catch(() => ({}));
        const xmlText = j.contents || j.data || j.contents;
        if (!xmlText) continue;
        const xml = new DOMParser().parseFromString(xmlText, 'text/xml');
        const nodes = Array.from(xml.querySelectorAll('item, entry')).slice(0, 6);
        const out = [];
        nodes.forEach((n) => {
          const t = (n.querySelector('title') && n.querySelector('title').textContent || '').trim();
          let link = (n.querySelector('link') && (n.querySelector('link').textContent || n.querySelector('link').getAttribute('href'))) || '';
          link = (link || '').trim();
          if (t && link) out.push({ title: t, url: link, source: feed.name });
        });
        if (out.length) return out;
      } catch (e) { /* 该代理失败，换下一个 */ }
    }
    return [];
  }
  async function fetchHotNews(box) {
    box = box || $('#news-body'); if (!box) return;
    box.innerHTML = '<div class="empty">正在获取今日热点…</div>';
    try {
      let items = [];
      // 先尝试读取本地缓存（10分钟内有效，避免重复请求）
      try {
        const c = JSON.parse(localStorage.getItem('xz_news_cache') || '{}');
        if (c.items && Date.now() - (c.ts || 0) < 10 * 60 * 1000) items = c.items;
      } catch (e) {}
      if (!items.length) {
        for (const feed of XZ_CONTENT.NEWS_FEEDS) {
          const got = await pullFeed(feed);
          items = items.concat(got);
          if (items.length >= 12) break;
        }
      }
      if (!items.length) throw new Error('no live');
      items = items.slice(0, 12);
      box.innerHTML = newsListHTML(items, '<div class="muted" style="margin-top:6px;font-size:12px">🟢 实时热点 · 点标题跳转原文</div>');
      try { localStorage.setItem('xz_news_cache', JSON.stringify({ ts: Date.now(), items })); } catch (e) {}
    } catch (e) {
      box.innerHTML = newsListHTML(XZ_CONTENT.HOT_NEWS_FALLBACK, '<div class="muted" style="margin-top:6px;font-size:12px">（离线快照 · 2026-07-28 真实新闻，联网后将自动更新）</div>');
    }
  }

  /* ================= 工作 ================= */
  function renderWork() {
    const tasks = DB.state.tasks.filter((t) => t.section === 'work');
    const sorted = sortTasks(tasks);
    const members = DB.state.members;
    const undone = tasks.filter((t) => !t.done).length;
    const html = `
    <div class="hero fade-in"><h2>📚 工作板块</h2><p>课题 · 论文 · 老师小任务 · 成员进度监督</p></div>

    <div class="card">
      <div class="card-title"><span class="emoji">⚡</span>老师刚下发的小任务<span class="sub">一键建高紧急</span></div>
      <button class="btn block" data-act="add-task" data-section="work" data-quick="1">＋ 录入老师刚布置的任务</button>
    </div>

    <div class="card">
      <div class="card-title"><span class="emoji">📋</span>课题 / 论文任务<span class="sub">${undone} 进行中</span></div>
      <div class="btn-row"><button class="btn soft sm" data-act="add-task" data-section="work">＋ 新增任务</button></div>
      <div style="margin-top:10px">${sorted.length ? sorted.map(renderTaskItem).join('') : '<div class="empty">还没有任务，点上方添加</div>'}</div>
    </div>

    <div class="card">
      <div class="card-title"><span class="emoji">👥</span>课题组成员进度<span class="sub">${members.length} 人</span></div>
      <div class="btn-row"><button class="btn soft sm" data-act="add-member">＋ 添加成员</button></div>
      <div style="margin-top:8px">${members.length ? members.map(renderMember).join('') : '<div class="empty">添加成员并跟踪每人进度</div>'}</div>
    </div>`;
    $('#view').innerHTML = html;
  }
  function renderMember(m) {
    return `<div class="member" data-id="${m.id}">
      <div class="m-head">
        <span class="m-name">${esc(m.name)}</span>
        <span class="m-pct">${m.progress || 0}%</span>
      </div>
      <div class="muted" style="font-size:12px;margin:2px 0 6px">负责：${esc(m.task || '—')}${m.note ? ' · ' + esc(m.note) : ''}</div>
      <div class="bar"><i style="width:${m.progress || 0}%"></i></div>
      <div class="btn-row" style="margin-top:8px">
        <button class="btn soft sm" data-act="upd-member" data-id="${m.id}">更新进度</button>
        <button class="btn danger sm" data-act="del-member" data-id="${m.id}">删除</button>
      </div>
    </div>`;
  }

  /* ================= 学习 ================= */
  function renderStudy() {
    const tasks = DB.state.tasks.filter((t) => t.section === 'study');
    const sorted = sortTasks(tasks);
    const books = DB.state.books;
    const kv = DB.state.profile.kaoyanDate;
    const dleft = daysLeft(kv);
    const html = `
    <div class="hero fade-in"><h2>🎓 学习板块</h2><p>考研 · 英语 · 专业书 · 听时政</p></div>

    <div class="card">
      <div class="card-title"><span class="emoji">🏯</span>考研倒计时</div>
      <div class="row between">
        <div style="font-size:34px;font-weight:800;color:var(--purple-700)">${dleft != null ? dleft : '—'}<span style="font-size:15px"> 天</span></div>
        <div class="muted">目标日 ${esc(kv)}<br><button class="btn soft sm" data-act="edit-kaoyan" style="margin-top:4px">修改目标日</button></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title"><span class="emoji">📝</span>学习任务<span class="sub">${tasks.filter((t) => !t.done).length} 进行中</span></div>
      <div class="btn-row"><button class="btn soft sm" data-act="add-task" data-section="study">＋ 新增学习任务</button></div>
      <div style="margin-top:10px">${sorted.length ? sorted.map(renderTaskItem).join('') : '<div class="empty">添加英语/专业书/时政等任务</div>'}</div>
    </div>

    <div class="card">
      <div class="card-title"><span class="emoji">📚</span>专业书阅读<span class="sub">${books.length} 本</span></div>
      <div class="btn-row"><button class="btn soft sm" data-act="add-book">＋ 添加书目</button></div>
      <div style="margin-top:8px">${books.length ? books.map(renderBook).join('') : '<div class="empty">记录在读专业书与进度</div>'}</div>
    </div>

    <div class="card">
      <div class="card-title"><span class="emoji">📰</span>今日时政热点<span class="sub"><button class="btn soft sm" data-act="refresh-news-study">刷新</button></span></div>
      <div class="muted" style="margin-bottom:6px">打开即推送当前热点，点标题跳原文。下方为可常听的权威信息源。</div>
      <div id="news-body-study"><div class="empty">加载中…</div></div>
    </div>
    <div class="card">
      <div class="card-title"><span class="emoji">📻</span>权威信息源<span class="sub">随时收听</span></div>
      <div class="scroll-x">${XZ_CONTENT.AFFAIRS_SOURCES.map((s) => `
        <a class="tile" href="${s.url}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">
          <div class="t-emoji">${s.tag === '听' ? '🎧' : '📰'}</div>
          <div class="t-name">${esc(s.name)}</div>
          <div class="t-desc">${esc(s.desc)}</div>
        </a>`).join('')}</div>
    </div>`;
    $('#view').innerHTML = html;
    fetchHotNews($('#news-body-study'));
  }
