/* 小紫同学 · 数据层（localStorage + 导出/导入备份） */
(function (global) {
  'use strict';
  const KEY = 'xiaozi_app_state_v1';

  function uid() {
    return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function defaultState() {
    return {
      version: 1,
      profile: {
        name: '王可人',
        zodiac: '未知',
        city: '杭州',
        kaoyanDate: '2027-12-19' // 大四上考研，可改
      },
      tasks: [],     // 工作/学习任务
      members: [],   // 课题组成员进度
      books: [],     // 专业书阅读
      expenses: [],  // 记账
      workouts: [],  // 健身打卡
      water: {},     // { 'YYYY-MM-DD': cups }
      waterGoal: 8,
      period: { cycles: [], cycleLen: 28, periodLen: 5 },
      anniversaries: [],
      notes: [],     // 碎碎念便利贴
      memos: [],     // 备忘录
      taskLogs: {},  // 重复任务打卡记录 { taskId: ['YYYY-MM-DD', ...] }
      fitnessLog: [], // 健身跟练打卡日期 ['YYYY-MM-DD', ...]
      affairsRead: []
    };
  }

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed);
    } catch (e) {
      console.warn('加载数据失败，使用默认', e);
      return defaultState();
    }
  }

  const changeHooks = [];
  function onLocalChange(fn) { if (typeof fn === 'function') changeHooks.push(fn); }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.error('保存失败', e);
      alert('保存失败：存储空间可能已满。');
    }
    for (let i = 0; i < changeHooks.length; i++) { try { changeHooks[i](); } catch (e) {} }
  }

  const SYNC_KEY = 'xiaozi_sync_cfg';
  function getSyncCfg() { try { return JSON.parse(localStorage.getItem(SYNC_KEY)) || {}; } catch (e) { return {}; } }
  function setSyncCfg(c) { localStorage.setItem(SYNC_KEY, JSON.stringify(c || {})); }

  function reset() {
    state = defaultState();
    save();
  }

  function exportJSON() {
    return JSON.stringify(state, null, 2);
  }

  function importJSON(str) {
    const parsed = JSON.parse(str);
    state = Object.assign(defaultState(), parsed);
    save();
  }

  function todayKey(d) {
    d = d || new Date();
    const z = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  }

  global.DB = {
    get state() { return state; },
    save, reset, exportJSON, importJSON, uid, todayKey,
    // 通用数组增删改
    add(collection, item) { state[collection].push(item); save(); },
    update(collection, id, patch) {
      const i = state[collection].findIndex((x) => x.id === id);
      if (i >= 0) { state[collection][i] = Object.assign({}, state[collection][i], patch); save(); }
    },
    remove(collection, id) {
      state[collection] = state[collection].filter((x) => x.id !== id); save();
    },
    onLocalChange, getSyncCfg, setSyncCfg
  };
})(window);
