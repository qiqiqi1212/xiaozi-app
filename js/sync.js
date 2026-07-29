/* 小紫同学 · 云同步（GitHub 私密 Gist，手机↔iPad 自动对齐） */
(function (global) {
  'use strict';
  const API = 'https://api.github.com';
  const FILE = 'xiaozi-data.json';
  const DEV = (function () {
    let d = localStorage.getItem('xiaozi_dev_id');
    if (!d) { d = 'd' + Math.random().toString(36).slice(2, 8); localStorage.setItem('xiaozi_dev_id', d); }
    return d;
  })();

  function cfg() { return DB.getSyncCfg(); }
  function saveCfg(c) { DB.setSyncCfg(c); }
  function hdr(token) { return { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github+json' }; }
  function clock() { const d = new Date(); const z = (n) => String(n).padStart(2, '0'); return z(d.getHours()) + ':' + z(d.getMinutes()); }
  function status(msg) { const el = document.getElementById('sync-status'); if (el) el.textContent = msg; }
  function payload() { return JSON.stringify({ v: 1, data: JSON.parse(DB.exportJSON()), meta: { updatedAt: Date.now(), dev: DEV } }); }

  let pushing = false, pushTimer = null, pollTimer = null, suppress = false;

  async function findExistingGist(token) {
    try {
      const res = await fetch(API + '/gists?per_page=100', { headers: hdr(token) });
      if (!res.ok) return null;
      const list = await res.json();
      for (const g of list) {
        if (g.files && g.files[FILE]) return g.id;
        if (g.description === 'xiaozi-sync') return g.id;
      }
    } catch (e) {}
    return null;
  }

  async function ensureGist(token) {
    const c = cfg();
    if (c.gistId) return c.gistId;
    let id = await findExistingGist(token);
    if (!id) {
      const res = await fetch(API + '/gists', {
        method: 'POST', headers: hdr(token),
        body: JSON.stringify({ description: 'xiaozi-sync', public: false, files: { [FILE]: { content: payload() } } })
      });
      if (!res.ok) throw new Error('创建失败 ' + res.status);
      const j = await res.json();
      id = j.id;
    }
    c.gistId = id; saveCfg(c);
    return id;
  }

  async function push() {
    const c = cfg();
    if (!c.token || pushing) return;
    pushing = true;
    try {
      const gid = c.gistId || await ensureGist(c.token);
      const res = await fetch(API + '/gists/' + gid, {
        method: 'PATCH', headers: hdr(c.token),
        body: JSON.stringify({ files: { [FILE]: { content: payload() } } })
      });
      if (!res.ok) throw new Error('推送失败 ' + res.status);
      c.lastSync = Date.now(); saveCfg(c);
      status('☁️ 已同步 ' + clock());
    } catch (e) { status('⚠️ 同步失败：' + e.message); }
    finally { pushing = false; }
  }

  async function pull() {
    const c = cfg();
    if (!c.token || !c.gistId) return;
    try {
      const res = await fetch(API + '/gists/' + c.gistId + '?t=' + Date.now(), { headers: hdr(c.token) });
      if (!res.ok) throw new Error('拉取失败 ' + res.status);
      const j = await res.json();
      const f = j.files && j.files[FILE];
      if (!f || !f.content) return;
      const obj = JSON.parse(f.content);
      const remote = (obj.meta && obj.meta.updatedAt) || 0;
      if (!c.lastRemote || remote > c.lastRemote) {
        suppress = true;
        try { DB.importJSON(JSON.stringify(obj.data)); } finally { suppress = false; }
        c.lastRemote = remote; saveCfg(c);
        if (global.render) global.render();
        status('☁️ 已拉取最新 ' + clock());
      } else {
        status('☁️ 已是最新 ' + clock());
      }
    } catch (e) { status('⚠️ 拉取失败：' + e.message); }
  }

  function schedulePush() { if (suppress) return; clearTimeout(pushTimer); pushTimer = setTimeout(push, 1500); }
  function startPolling() { stopPolling(); pollTimer = setInterval(pull, 30000); }
  function stopPolling() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } }

  async function init() {
    const c = cfg();
    if (!c.token) { status('未配置云同步'); return; }
    status('☁️ 同步中…');
    if (!c.gistId) {
      try { await ensureGist(c.token); }
      catch (e) { status('⚠️ 无法连接同步：' + e.message); return; }
    }
    try { await pull(); } catch (e) {}
    if (c.auto) { startPolling(); DB.onLocalChange(schedulePush); status('☁️ 自动同步已开启'); }
    else { stopPolling(); status('已配置，未开启自动同步'); }
  }

  function diagnose() {
    const c = cfg();
    return '仓库ID: ' + (c.gistId ? c.gistId.slice(0, 12) : '（空）') + ' ｜ 本机ID: ' + DEV + ' ｜ Token: ' + (c.token ? '已填' : '未填');
  }

  async function repair() {
    const c = cfg();
    if (!c.token) { status('请先填 Token 并保存'); return; }
    c.gistId = null; DB.setSyncCfg(c);
    status('☁️ 正在重新配对…');
    try { await ensureGist(c.token); await pull(); if (global.render) global.render(); status('☁️ 重新配对完成 ' + clock()); }
    catch (e) { status('⚠️ 配对失败：' + e.message); }
  }

  global.Sync = { init, push, pull, ensureGist, status, startPolling, stopPolling, diagnose, repair };
})(window);
