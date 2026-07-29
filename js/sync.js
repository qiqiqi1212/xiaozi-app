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
      c.lastSync = Date.now(); c.lastPush = Date.now(); saveCfg(c);
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
      if (!f || !f.content) { status('☁️ 云端暂无数据 ' + clock()); return; }
      const obj = JSON.parse(f.content);
      const remote = (obj.meta && obj.meta.updatedAt) || 0;
      const remoteDev = (obj.meta && obj.meta.dev) || '未知';
      if (!c.lastRemote || remote > c.lastRemote) {
        suppress = true;
        try { DB.importJSON(JSON.stringify(obj.data)); } finally { suppress = false; }
        c.lastRemote = remote; saveCfg(c);
        if (global.render) global.render();
        status('☁️ 已拉取最新 ' + clock() + '（来自' + remoteDev + '）');
      } else {
        status('☁️ 本机已最新 ' + clock() + '｜云端' + remoteDev);
      }
    } catch (e) { status('⚠️ 拉取失败：' + e.message); }
  }

  async function cloudSummary() {
    const c = cfg();
    if (!c.token || !c.gistId) return { error: '未配置' };
    try {
      const res = await fetch(API + '/gists/' + c.gistId, { headers: hdr(c.token) });
      if (!res.ok) return { error: 'API ' + res.status };
      const j = await res.json();
      const f = j.files && j.files[FILE];
      if (!f || !f.content) return { error: '云端无数据' };
      const obj = JSON.parse(f.content);
      const data = obj.data || {};
      return {
        updatedAt: obj.meta && obj.meta.updatedAt,
        dev: obj.meta && obj.meta.dev,
        tasks: (data.tasks || []).length,
        notes: (data.notes || []).length,
        memos: (data.memos || []).length,
        expenses: (data.expenses || []).length,
        books: (data.books || []).length
      };
    } catch (e) { return { error: e.message }; }
  }

  async function forcePush() {
    const c = cfg();
    if (!c.token) { status('请先填 Token'); return; }
    status('☁️ 强制推送中…');
    try { await push(); status('☁️ 已强制推送 ' + clock()); } catch (e) { status('⚠️ 强制推送失败'); }
  }

  async function forcePull() {
    const c = cfg();
    if (!c.token || !c.gistId) { status('请先配对'); return; }
    status('☁️ 强制拉取中…');
    try {
      const res = await fetch(API + '/gists/' + c.gistId, { headers: hdr(c.token) });
      if (!res.ok) throw new Error('API ' + res.status);
      const j = await res.json();
      const f = j.files && j.files[FILE];
      if (!f || !f.content) throw new Error('云端无数据');
      const obj = JSON.parse(f.content);
      suppress = true;
      try { DB.importJSON(JSON.stringify(obj.data)); } finally { suppress = false; }
      c.lastRemote = (obj.meta && obj.meta.updatedAt) || Date.now(); saveCfg(c);
      if (global.render) global.render();
      status('☁️ 已用云端覆盖本地 ' + clock());
    } catch (e) { status('⚠️ 强制拉取失败：' + e.message); }
  }

  function schedulePush() { if (suppress) return; clearTimeout(pushTimer); pushTimer = setTimeout(push, 1500); }
  function startPolling() { stopPolling(); pollTimer = setInterval(async () => { try { await push(); await pull(); } catch (e) {} }, 30000); }
  function stopPolling() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } }

  async function init() {
    const c = cfg();
    if (!c.token) { status('未配置云同步'); return; }
    status('☁️ 同步中…');
    try {
      if (!c.gistId) await ensureGist(c.token);
      await push();
      await pull();
    } catch (e) { status('⚠️ 同步失败：' + e.message); return; }
    if (c.auto) { startPolling(); DB.onLocalChange(schedulePush); status('☁️ 自动同步已开启'); }
    else { stopPolling(); status('已配置，未开启自动同步'); }
  }

  function diagnose() {
    const c = cfg();
    const fmt = (t) => t ? new Date(t).toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit', month: 'numeric', day: 'numeric' }) : '无';
    return '仓库ID: ' + (c.gistId ? c.gistId.slice(0, 12) : '（空）') +
      ' ｜ 本机ID: ' + DEV +
      ' ｜ 本机最后推送: ' + fmt(c.lastPush) +
      ' ｜ 最后拉取: ' + fmt(c.lastRemote);
  }

  async function repair() {
    const c = cfg();
    if (!c.token) { status('请先填 Token 并保存'); return; }
    c.gistId = null; c.lastRemote = null; c.lastPush = null; DB.setSyncCfg(c);
    status('☁️ 正在重新配对…');
    try { await ensureGist(c.token); await pull(); if (global.render) global.render(); status('☁️ 重新配对完成 ' + clock()); }
    catch (e) { status('⚠️ 配对失败：' + e.message); }
  }

  global.Sync = { init, push, pull, ensureGist, status, startPolling, stopPolling, diagnose, repair, cloudSummary, forcePush, forcePull };
})(window);
