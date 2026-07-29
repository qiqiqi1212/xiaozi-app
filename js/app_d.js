  function editKaoyan() {
    openForm('考研目标日', [{ key: 'kv', label: '目标考试日期', type: 'date' }], { kv: DB.state.profile.kaoyanDate }, (v) => { DB.state.profile.kaoyanDate = v.kv; DB.save(); render(); toast('已设置'); });
  }
  function addExpense() {
    openForm('记一笔', [
      { key: 'amount', label: '金额(元)', type: 'number', step: '0.01' },
      { key: 'category', label: '分类', type: 'select', options: ['餐饮', '交通', '学习', '购物', '娱乐', '其他'] },
      { key: 'note', label: '备注', type: 'text' },
      { key: 'date', label: '日期', type: 'date' }
    ], { date: dateKey() }, (v) => {
      DB.state.expenses.push({ id: DB.uid(), amount: Number(v.amount) || 0, category: v.category, note: v.note, date: v.date || dateKey() });
      DB.save(); render(); toast('已记账');
    });
  }
  function editExpense(id) {
    const e = DB.state.expenses.find((x) => x.id === id); if (!e) return;
    openForm('编辑记账', [
      { key: 'amount', label: '金额', type: 'number' },
      { key: 'category', label: '分类', type: 'text' },
      { key: 'note', label: '备注', type: 'text' },
      { key: 'date', label: '日期', type: 'date' }
    ], { amount: e.amount, category: e.category, note: e.note, date: e.date }, (v) => {
      Object.assign(e, { amount: Number(v.amount) || 0, category: v.category, note: v.note, date: v.date || dateKey() });
      DB.save(); render(); toast('已保存');
    });
  }
  function addWorkout() {
    openForm('运动打卡', [
      { key: 'date', label: '日期', type: 'date' },
      { key: 'type', label: '类型', type: 'select', options: ['跑步', '跳绳', '力量', '瑜伽', '散步', '游泳', '其他'] },
      { key: 'minutes', label: '时长(分钟)', type: 'number' },
      { key: 'note', label: '备注', type: 'text' }
    ], { date: dateKey() }, (v) => {
      DB.state.workouts.push({ id: DB.uid(), date: v.date || dateKey(), type: v.type, minutes: Number(v.minutes) || 0, note: v.note });
      DB.save(); render(); toast('已打卡');
    });
  }
  function editWorkout(id) {
    const w = DB.state.workouts.find((x) => x.id === id); if (!w) return;
    openForm('编辑打卡', [
      { key: 'date', label: '日期', type: 'date' },
      { key: 'type', label: '类型', type: 'select', options: ['跑步', '跳绳', '力量', '瑜伽', '散步', '游泳', '其他'] },
      { key: 'minutes', label: '时长(分钟)', type: 'number' },
      { key: 'note', label: '备注', type: 'text' }
    ], { date: w.date, type: w.type, minutes: w.minutes, note: w.note }, (v) => {
      Object.assign(w, { date: v.date || dateKey(), type: v.type, minutes: Number(v.minutes) || 0, note: v.note });
      DB.save(); render(); toast('已保存');
    });
  }
  function waterSet() {
    openForm('喝水目标', [{ key: 'goal', label: '每天目标杯数', type: 'number' }], { goal: DB.state.waterGoal }, (v) => { DB.state.waterGoal = Math.max(1, Number(v.goal) || 8); DB.save(); render(); toast('已设置'); });
  }
  function periodAdd() {
    openForm('记录本次经期开始日', [{ key: 'd', label: '开始日期', type: 'date' }], { d: dateKey() }, (v) => {
      if (v.d && !DB.state.period.cycles.includes(v.d)) { DB.state.period.cycles.push(v.d); DB.save(); render(); toast('已记录，已为你预测下次'); }
    });
  }
  function periodLen() {
    openForm('周期长度', [{ key: 'len', label: '平均周期(天)', type: 'number' }], { len: DB.state.period.cycleLen }, (v) => { DB.state.period.cycleLen = Math.max(20, Math.min(45, Number(v.len) || 28)); DB.save(); render(); toast('已设置'); });
  }
  function editPeriod(d) {
    openForm('修改经期开始日', [{ key: 'nd', label: '开始日期', type: 'date' }], { nd: d }, (v) => {
      if (v.nd) { DB.state.period.cycles = DB.state.period.cycles.filter((c) => c !== d); if (!DB.state.period.cycles.includes(v.nd)) DB.state.period.cycles.push(v.nd); DB.save(); render(); toast('已修改'); }
    });
  }
  function addAnni() {
    openForm('添加纪念日', [
      { key: 'title', label: '名称', type: 'text' },
      { key: 'date', label: '日期', type: 'date' },
      { key: 'repeat', label: '是否每年重复', type: 'select', options: [{ v: 'year', label: '每年' }, { v: 'no', label: '仅一次' }] },
      { key: 'note', label: '备注', type: 'text' }
    ], { repeat: 'year' }, (v) => { DB.state.anniversaries.push({ id: DB.uid(), title: v.title, date: v.date, repeat: v.repeat, note: v.note }); DB.save(); render(); toast('已添加'); });
  }
  function editAnni(id) {
    const a = DB.state.anniversaries.find((x) => x.id === id); if (!a) return;
    openForm('编辑纪念日', [
      { key: 'title', label: '名称', type: 'text' },
      { key: 'date', label: '日期', type: 'date' },
      { key: 'repeat', label: '是否每年重复', type: 'select', options: [{ v: 'year', label: '每年' }, { v: 'no', label: '仅一次' }] },
      { key: 'note', label: '备注', type: 'text' }
    ], { title: a.title, date: a.date, repeat: a.repeat || 'year', note: a.note }, (v) => {
      Object.assign(a, { title: v.title, date: v.date, repeat: v.repeat, note: v.note });
      DB.save(); render(); toast('已保存');
    });
  }
  function addNote() {
    openForm('写一张便签', [
      { key: 'text', label: '今天想说什么', type: 'textarea' },
      { key: 'color', label: '颜色', type: 'select', options: [{ v: '#fff7d6', label: '暖黄' }, { v: '#e7f0ff', label: '天空蓝' }, { v: '#ffe9f2', label: '粉' }, { v: '#e9fbf0', label: '薄荷绿' }, { v: '#f0e9ff', label: '薰衣草' }] }
    ], { color: '#fff7d6' }, (v) => { DB.state.notes.push({ id: DB.uid(), text: v.text, color: v.color, date: dateKey() }); DB.save(); render(); toast('已贴上'); });
  }
  function editNote(id) {
    const n = DB.state.notes.find((x) => x.id === id); if (!n) return;
    openForm('编辑便签', [
      { key: 'text', label: '今天想说什么', type: 'textarea' },
      { key: 'color', label: '颜色', type: 'select', options: [{ v: '#fff7d6', label: '暖黄' }, { v: '#e7f0ff', label: '天空蓝' }, { v: '#ffe9f2', label: '粉' }, { v: '#e9fbf0', label: '薄荷绿' }, { v: '#f0e9ff', label: '薰衣草' }] }
    ], { text: n.text, color: n.color || '#fff7d6' }, (v) => {
      Object.assign(n, { text: v.text, color: v.color });
      DB.save(); render(); toast('已保存');
    });
  }
  function addMemo() {
    openForm('新建备忘', [
      { key: 'title', label: '标题', type: 'text' },
      { key: 'body', label: '内容', type: 'textarea' },
      { key: 'pinned', label: '置顶', type: 'select', options: [{ v: '1', label: '是' }, { v: '0', label: '否' }] }
    ], { pinned: '0' }, (v) => { DB.state.memos.push({ id: DB.uid(), title: v.title, body: v.body, pinned: v.pinned === '1', updated: now() }); DB.save(); render(); toast('已保存'); });
  }
  function editMemo(id) {
    const m = DB.state.memos.find((x) => x.id === id); if (!m) return;
    openForm('编辑备忘', [
      { key: 'title', label: '标题', type: 'text' },
      { key: 'body', label: '内容', type: 'textarea' },
      { key: 'pinned', label: '置顶', type: 'select', options: [{ v: '1', label: '是' }, { v: '0', label: '否' }] }
    ], { title: m.title, body: m.body, pinned: m.pinned ? '1' : '0' }, (v) => { Object.assign(m, { title: v.title, body: v.body, pinned: v.pinned === '1', updated: now() }); DB.save(); render(); toast('已保存'); });
  }

  /* ================= 设置 / 备份 ================= */
  function openSettings() {
    const p = DB.state.profile;
    const c = DB.getSyncCfg();
    const html = `<div class="modal-mask" data-act="close-modal"></div>
      <div class="modal"><div class="modal-head"><h3>⚙️ 设置与备份</h3><button class="modal-close" data-act="close-modal">✕</button></div>
      <div class="field"><label>我的称呼</label><input id="p-name" value="${esc(p.name)}"></div>
      <div class="field"><label>星座</label><input id="p-zodiac" value="${esc(p.zodiac)}" placeholder="如 狮子座"></div>
      <div class="field"><label>天气城市</label><input id="p-city" value="${esc(p.city)}" placeholder="如 北京"></div>
      <div class="field"><label>考研目标日</label><input id="p-kv" type="date" value="${esc(p.kaoyanDate)}"></div>
      <div class="btn-row"><button class="btn soft sm" id="save-profile">保存资料</button></div>
      <div class="hr"></div>
      <div class="card-title"><span class="emoji">💾</span>数据备份（本机+手动迁移）</div>
      <div class="muted" style="margin-bottom:8px">数据存在本机。换设备/重装前请导出，在新设备导入即可恢复全部历史。</div>
      <div class="btn-row">
        <button class="btn sm" id="exp-btn">导出备份(JSON)</button>
        <button class="btn soft sm" id="imp-btn">导入备份</button>
        <button class="btn danger sm" id="reset-btn">清空数据</button>
        <input type="file" id="imp-file" accept="application/json" style="display:none">
      </div>
      <div class="hr"></div>
      <div class="card-title"><span class="emoji">☁️</span>云同步（手机↔iPad 自动同步）</div>
      <div class="muted" style="margin-bottom:8px">用你的 GitHub 私密 Gist 存数据，两台设备填同一个 Token 即可自动对齐。Token 只存在本机，不上传给别人。</div>
      <div class="field"><label>GitHub Token</label><input id="sync-token" type="password" placeholder="ghp_..." value="${esc(c.token || '')}"></div>
      <label class="row" style="display:flex;align-items:center;gap:8px;margin:6px 0"><input type="checkbox" id="sync-auto" ${c.auto ? 'checked' : ''}> 开启自动同步（后台每30秒对齐 + 改动即上传）</label>
      <div class="btn-row">
        <button class="btn sm" id="sync-save">保存同步设置</button>
        <button class="btn soft sm" id="sync-now">立即同步</button>
        <button class="btn soft sm" id="sync-repair">重新配对</button>
      </div>
      <div class="muted" id="sync-status" style="margin-top:6px">${esc(c.token ? (c.auto ? '自动同步已开启' : '已配置，未开启自动同步') : '未配置云同步')}</div>
      <div class="muted" style="margin-top:4px;font-size:11px;word-break:break-all">${esc(global.Sync && Sync.diagnose ? Sync.diagnose() : '')}</div>
      </div>`;
    modalRoot.innerHTML = html; modalRoot.classList.add('show');
    $('#save-profile').onclick = () => {
      DB.state.profile.name = $('#p-name').value || '同学';
      DB.state.profile.zodiac = $('#p-zodiac').value || '未知';
      DB.state.profile.city = $('#p-city').value || '北京';
      DB.state.profile.kaoyanDate = $('#p-kv').value || '2027-12-19';
      DB.save(); closeModal(); render(); toast('资料已保存');
    };
    $('#exp-btn').onclick = () => {
      const blob = new Blob([DB.exportJSON()], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'xiaozi-backup-' + dateKey() + '.json'; a.click(); toast('已导出，保存到文件App即可');
    };
    $('#imp-btn').onclick = () => $('#imp-file').click();
    $('#imp-file').onchange = (e) => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { try { DB.importJSON(reader.result); closeModal(); render(); toast('导入成功，历史已恢复'); } catch (err) { alert('导入失败：文件格式不对'); } };
      reader.readAsText(file);
    };
    $('#reset-btn').onclick = () => {
      if (confirm('确定清空全部数据？此操作不可撤销，建议先导出备份。')) { DB.reset(); closeModal(); render(); toast('已清空'); }
    };
    $('#sync-save').onclick = async () => {
      const token = $('#sync-token').value.trim();
      if (!token) { toast('请先填写 Token'); return; }
      const c2 = DB.getSyncCfg();
      c2.token = token; c2.auto = $('#sync-auto').checked; DB.setSyncCfg(c2);
      Sync.status('☁️ 正在连接…');
      try { await Sync.ensureGist(token); toast('云同步已就绪'); Sync.init(); }
      catch (e) { toast('连接失败：' + e.message); }
    };
    $('#sync-now').onclick = async () => {
      const c2 = DB.getSyncCfg();
      if (!c2.token) { toast('请先填写 Token 并保存'); return; }
      Sync.status('☁️ 同步中…');
      try { await Sync.push(); await Sync.pull(); } catch (e) {}
    };
    $('#sync-repair').onclick = async () => {
      Sync.status('☁️ 重新配对中…');
      try { await Sync.repair(); } catch (e) {}
    };
  }
  $('#btn-backup').addEventListener('click', openSettings);

  /* ================= 临期提醒横幅 ================= */
  function checkReminders() {
    const due = DB.state.tasks.filter((t) => !t.done).filter((t) => { const p = priorityOf(t); return p.urg === 'over' || p.urg === 'urgent' || p.urg === 'soon'; });
    const pi = periodInfo();
    const items = [];
    due.slice(0, 5).forEach((t) => items.push((priorityOf(t).urg === 'over' ? '⏰逾期 ' : '🔔临期 ') + t.title + '（' + priorityOf(t).dueTxt + '）'));
    if (pi && pi.days <= 2 && pi.days >= 0) items.push('🩸 经期预计 ' + pi.days + ' 天后，提前控糖护肤');
    const banner = $('#reminder-banner');
    if (items.length) {
      banner.innerHTML = `<button class="rem-close" data-act="close-rem">✕</button><h4>💜 小紫提醒你</h4>${items.map((i) => `<div class="rem-item">· ${esc(i)}</div>`).join('')}`;
      banner.classList.remove('hidden');
    } else banner.classList.add('hidden');
    banner.querySelector('[data-act=close-rem]').onclick = () => banner.classList.add('hidden');
  }

  /* ================= Tab UI ================= */
  function setTabUI() {
    $$('.tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === currentTab));
  }
  $$('.tab').forEach((b) => b.addEventListener('click', () => { currentTab = b.dataset.tab; setTabUI(); render(); }));

  /* ================= 启动 ================= */
  function start() {
    if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {})); }
    setTabUI(); render(); checkReminders();
    if (window.Sync) Sync.init();
  }
  start();

