  function renderNotes() {
    const notes = DB.state.notes.slice().reverse();
    const html = `<div class="hero fade-in"><h2>📌 碎碎念便利贴</h2><p>${notes.length} 张 · 随手记，每天的小情绪</p></div>
      <div class="card"><div class="btn-row"><button class="btn" data-act="add-note">＋ 写一张</button></div>
      <div style="margin-top:10px;display:flex;flex-direction:column;gap:10px">${notes.length ? notes.map((n) => `<div class="note-card" style="${n.color ? 'background:' + n.color : ''}"><div class="n-text">${esc(n.text)}</div><div class="n-foot"><span class="n-date">${n.date}</span><span><button class="btn soft sm" data-act="edit-note" data-id="${n.id}">改</button> <button class="btn danger sm" data-act="del-note" data-id="${n.id}">删</button></span></div></div>`).join('') : '<div class="empty">还没有便签</div>'}</div></div>`;
    $('#view').innerHTML = html;
  }
  function renderAcne() {
    const sk = DB.state.skincare && DB.state.skincare[dateKey()];
    const a = XZ_CONTENT.ACNE_PLAN;
    const html = `<div class="hero fade-in"><h2>🌸 科学治痘方案</h2><p>综合多位皮肤科医师公开建议 · T区出油 + 姨妈期加重</p></div>
      <div class="card"><div class="muted" style="margin-bottom:8px">${esc(a.intro)}</div>
        <div class="btn-row"><button class="btn ${sk ? 'ghost' : ''}" data-act="skincare-toggle">${sk ? '今日已护肤打卡 ✅' : '今日护肤打卡'}</button></div>
      </div>
      <div class="card"><div class="card-title"><span class="emoji">🌞</span>日常护肤（T区控油）</div>
        ${a.daily.map((s, i) => `<div class="acne-step"><div class="num">${i + 1}</div><div class="a-body"><b>${esc(s.t)}</b><p>${esc(s.d)}</p></div></div>`).join('')}
      </div>
      <div class="card"><div class="card-title"><span class="emoji">🩸</span>姨妈期专属方案</div>
        ${a.period.map((s, i) => `<div class="acne-step"><div class="num">${i + 1}</div><div class="a-body"><b>${esc(s.t)}</b><p>${esc(s.d)}</p></div></div>`).join('')}
      </div>
      <div class="card"><div class="card-title"><span class="emoji">💡</span>今日科学小贴士（每日更新）</div>
        ${((dt) => `<div class="acne-step"><div class="num">★</div><div class="a-body"><b>${esc(dt.t)}</b><p>${esc(dt.d)}</p></div></div>`)(XZ_CONTENT.dailyTip(XZ_CONTENT.ACNE_TIPS, new Date()))}
      </div>
      <div class="card"><div class="muted">⚠️ 内容整理自公开资料，仅供参考，不能替代医生诊断。囊肿/结节/瘢痕或3个月无改善请到皮肤科就诊。</div></div>`;
    $('#view').innerHTML = html;
  }

  /* ================= 其他（备忘录） ================= */
  function renderOther() {
    const memos = DB.state.memos.slice().sort((a, b) => (b.pinned === true) - (a.pinned === true) || new Date(b.updated) - new Date(a.updated));
    const html = `<div class="hero fade-in"><h2>📝 备忘录</h2><p>${memos.length} 条 · 随手记，可置顶</p></div>
      <div class="card"><div class="btn-row"><button class="btn" data-act="add-memo">＋ 新建备忘</button></div>
      <div style="margin-top:10px">${memos.length ? memos.map((m) => `<div class="note-card" style="background:#fff;border:1px solid var(--line)"><div class="t-title" style="font-weight:700">${esc(m.title) || '（无标题）'}${m.pinned ? ' 📌' : ''}</div><div class="n-text" style="margin-top:4px">${esc(m.body)}</div><div class="n-foot"><span class="n-date">${m.updated.slice(0, 16).replace('T', ' ')}</span><span><button class="btn soft sm" data-act="edit-memo" data-id="${m.id}">改</button> <button class="btn danger sm" data-act="del-memo" data-id="${m.id}">删</button></span></div></div>`).join('') : '<div class="empty">还没有备忘</div>'}</div></div>`;
    $('#view').innerHTML = html;
  }

  /* ================= 工具：汇总 ================= */
  function monthTotal() {
    const m = dateKey().slice(0, 7);
    return DB.state.expenses.filter((e) => e.date && e.date.startsWith(m)).reduce((s, e) => s + Number(e.amount), 0);
  }
  function weekWorkouts() {
    const today = new Date(); const dow = today.getDay();
    const mon = new Date(today); mon.setDate(today.getDate() - ((dow + 6) % 7));
    const start = dateKey(mon);
    const ws = DB.state.workouts.filter((w) => w.date >= start);
    return { count: ws.length, min: ws.reduce((s, w) => s + Number(w.minutes), 0) };
  }
  function periodInfo() {
    const p = DB.state.period;
    if (!p.cycles || !p.cycles.length) return null;
    const last = p.cycles.slice().sort().pop();
    const next = new Date(last + 'T00:00:00'); next.setDate(next.getDate() + (Number(p.cycleLen) || 28));
    return { last, next: dateKey(next), days: daysLeft(dateKey(next)), len: p.cycleLen };
  }

  /* ================= 渲染调度 ================= */
  const LIFE_SUB = { 'life-book': renderBookkeeping, 'life-fitness': renderFitness, 'life-fortune': renderFortune, 'life-water': renderWater, 'life-period': renderPeriod, 'life-anni': renderAnni, 'life-note': renderNotes, 'life-acne': renderAcne, 'life-wx': loadWeatherOnly };
  function render() {
    $('#header-date').textContent = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });
    switch (currentTab) {
      case 'home': renderHome(); break;
      case 'work': renderWork(); break;
      case 'study': renderStudy(); break;
      case 'life': renderLife(); break;
      case 'other': renderOther(); break;
    }
  }
  async function loadWeatherOnly() {
    currentTab = 'life';
    await renderLife();
    $('#wx-card').scrollIntoView({ behavior: 'smooth' });
  }

  /* ================= 事件委托 ================= */
  function findTask(id) { return DB.state.tasks.find((t) => t.id === id); }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-act]');
    if (!t) return;
    const act = t.dataset.act; const id = t.dataset.id;
    // Tab 切换
    if (act === 'goto') { currentTab = t.dataset.tab; setTabUI(); render(); return; }
    if (act === 'life-book' || act === 'life-fitness' || act === 'life-fortune' || act === 'life-water' || act === 'life-period' || act === 'life-anni' || act === 'life-note' || act === 'life-acne') { currentTab = 'life'; LIFE_SUB[act](); return; }
    if (act === 'life-wx') { currentTab = 'life'; renderLife().then(() => $('#wx-card').scrollIntoView({ behavior: 'smooth' })); return; }

    switch (act) {
      case 'toggle-task': {
        const tk = findTask(id); if (!tk) break;
        if (tk.repeat && tk.repeat !== 'none' && !tk.done) {
          DB.state.taskLogs = DB.state.taskLogs || {};
          DB.state.taskLogs[tk.id] = DB.state.taskLogs[tk.id] || [];
          const todayK = dateKey();
          if (!DB.state.taskLogs[tk.id].includes(todayK)) DB.state.taskLogs[tk.id].push(todayK);
          tk.deadline = nextOccurrence(tk.repeat, todayK);
          tk.done = false;
          DB.save(); render();
          toast('已打卡 ✅ 已顺延到下次 · 连续 ' + computeStreak(tk.id) + ' 天');
        } else { tk.done = !tk.done; DB.save(); render(); }
        break;
      }
      case 'del-task': { DB.remove('tasks', id); render(); toast('已删除'); break; }
      case 'edit-task': editTask(id); break;
      case 'add-task': addTask(t.dataset.section, t.dataset.quick); break;
      case 'add-member': addMember(); break;
      case 'upd-member': updateMember(id); break;
      case 'del-member': DB.remove('members', id); render(); break;
      case 'add-book': addBook(); break;
      case 'upd-book': updateBook(id); break;
      case 'edit-book': editBook(id); break;
      case 'del-book': DB.remove('books', id); render(); break;
      case 'edit-kaoyan': editKaoyan(); break;
      case 'add-expense': addExpense(); break;
      case 'del-expense': DB.remove('expenses', id); render(); break;
      case 'edit-expense': editExpense(id); break;
      case 'add-workout': addWorkout(); break;
      case 'del-workout': DB.remove('workouts', id); render(); break;
      case 'edit-workout': editWorkout(id); break;
      case 'water-cup': { const n = Number(t.dataset.n); DB.state.water[dateKey()] = n; DB.save(); render(); break; }
      case 'water-set': waterSet(); break;
      case 'period-add': periodAdd(); break;
      case 'period-len': periodLen(); break;
      case 'period-del': DB.state.period.cycles = DB.state.period.cycles.filter((c) => c !== t.dataset.d); DB.save(); render(); break;
      case 'edit-period': editPeriod(t.dataset.d); break;
      case 'add-anni': addAnni(); break;
      case 'del-anni': DB.remove('anniversaries', id); render(); break;
      case 'edit-anni': editAnni(id); break;
      case 'add-note': addNote(); break;
      case 'del-note': DB.remove('notes', id); render(); break;
      case 'edit-note': editNote(id); break;
      case 'skincare-toggle': { DB.state.skincare = DB.state.skincare || {}; const k = dateKey(); DB.state.skincare[k] = !DB.state.skincare[k]; DB.save(); render(); break; }
      case 'add-memo': addMemo(); break;
      case 'edit-memo': editMemo(id); break;
      case 'del-memo': DB.remove('memos', id); render(); break;
      case 'refresh-wx': loadWeatherInto(); break;
      case 'refresh-news': fetchHotNews(); break;
      case 'refresh-news-study': fetchHotNews($('#news-body-study')); break;
      case 'open-routine': { const r = XZ_CONTENT.FITNESS_ROUTINES[Number(t.dataset.i)]; if (r) window.open(r.url, '_blank', 'noopener'); toast('已打开跟练视频，跟着练吧～'); break; }
      case 'fit-start': { startFitnessSession(Number(t.dataset.min)); break; }
      case 'fit-cancel': { if (fitTimer) { clearInterval(fitTimer); fitTimer = null; } const b = $('#fit-timer'); if (b) b.innerHTML = ''; break; }
    }
  });

  /* ================= 表单动作 ================= */
  function addTask(section, quick) {
    const fields = [
      { key: 'title', label: '任务标题', type: 'text', placeholder: quick ? '老师刚布置的小任务…' : '例如：完成论文第三章初稿' },
      { key: 'detail', label: '要求/备注', type: 'textarea', placeholder: '具体说明…' },
      { key: 'cat', label: '类型', type: 'text', placeholder: section === 'work' ? '课题/论文/老师任务/成员跟进' : '考研/英语/专业书/时政' },
      { key: 'deadline', label: '截止日期（重复任务填起始日）', type: 'date' },
      { key: 'est', label: '预计完成时间（小时）', type: 'number', placeholder: '如 4' },
      { key: 'importance', label: '重要程度', type: 'select', options: [{ v: 'high', label: '高（重要）' }, { v: 'mid', label: '中' }, { v: 'low', label: '低' }] },
      { key: 'repeat', label: '重复', type: 'select', options: [{ v: 'none', label: '不重复' }, { v: 'daily', label: '每天' }, { v: 'weekly', label: '每周（按所选日）' }, { v: 'monthly', label: '每月（按所选日）' }, { v: 'weekday', label: '每个工作日' }] }
    ];
    openForm(quick ? '老师小任务（高紧急）' : '新增任务', fields, { importance: quick ? 'high' : 'mid' }, (v) => {
      DB.state.tasks.push({ id: DB.uid(), section, title: v.title, detail: v.detail, cat: v.cat, deadline: v.deadline || '', est: v.est ? Number(v.est) : null, importance: v.importance || 'mid', repeat: v.repeat || 'none', done: false, createdAt: now() });
      DB.save(); render(); toast('已添加');
    });
  }
  function editTask(id) {
    const tk = findTask(id); if (!tk) return;
    const fields = [
      { key: 'title', label: '任务标题', type: 'text' },
      { key: 'detail', label: '要求/备注', type: 'textarea' },
      { key: 'cat', label: '类型', type: 'text' },
      { key: 'deadline', label: '截止日期（重复任务填起始日）', type: 'date' },
      { key: 'est', label: '预计完成时间（小时）', type: 'number' },
      { key: 'importance', label: '重要程度', type: 'select', options: [{ v: 'high', label: '高（重要）' }, { v: 'mid', label: '中' }, { v: 'low', label: '低' }] },
      { key: 'repeat', label: '重复', type: 'select', options: [{ v: 'none', label: '不重复' }, { v: 'daily', label: '每天' }, { v: 'weekly', label: '每周（按所选日）' }, { v: 'monthly', label: '每月（按所选日）' }, { v: 'weekday', label: '每个工作日' }] }
    ];
    openForm('编辑任务', fields, { title: tk.title, detail: tk.detail, cat: tk.cat, deadline: tk.deadline, est: tk.est || '', importance: tk.importance, repeat: tk.repeat || 'none' }, (v) => {
      Object.assign(tk, { title: v.title, detail: v.detail, cat: v.cat, deadline: v.deadline || '', est: v.est ? Number(v.est) : null, importance: v.importance || 'mid', repeat: v.repeat || 'none' });
      DB.save(); render(); toast('已保存');
    });
  }
  function addMember() {
    openForm('添加成员', [
      { key: 'name', label: '姓名', type: 'text' },
      { key: 'task', label: '负责子任务', type: 'text' },
      { key: 'progress', label: '当前进度(%)', type: 'number' },
      { key: 'note', label: '备注', type: 'text' }
    ], {}, (v) => {
      DB.state.members.push({ id: DB.uid(), name: v.name, task: v.task, progress: Math.max(0, Math.min(100, Number(v.progress) || 0)), note: v.note });
      DB.save(); render(); toast('已添加');
    });
  }
  function updateMember(id) {
    const m = DB.state.members.find((x) => x.id === id); if (!m) return;
    openForm('更新进度 · ' + m.name, [
      { key: 'progress', label: '进度(%)', type: 'number' },
      { key: 'note', label: '备注', type: 'text' }
    ], { progress: m.progress, note: m.note }, (v) => {
      m.progress = Math.max(0, Math.min(100, Number(v.progress) || 0)); m.note = v.note; m.lastUpdate = dateKey(); DB.save(); render(); toast('已更新');
    });
  }
  function addBook() {
    const html = `<div class="modal-mask" data-act="close-modal"></div>
      <div class="modal"><div class="modal-head"><h3>📚 添加专业书</h3><button class="modal-close" data-act="close-modal">✕</button></div>
        <div class="field"><label>书名（输入后点搜索，自动补全作者/封面/简介）</label><input id="b-title" placeholder="如：中国历史"></div>
        <div class="btn-row"><button class="btn soft sm" id="b-search">🔍 自动搜索书籍信息</button></div>
        <div id="b-results"></div>
        <div class="field" style="margin-top:8px"><label>作者</label><input id="b-author" placeholder="搜索后自动填，也可手填"></div>
        <div class="field"><label>总章节 / 页数</label><input id="b-total" type="number" placeholder="如 300"></div>
        <div class="field"><label>已读</label><input id="b-current" type="number" placeholder="0"></div>
        <div class="field"><label>单位</label><input id="b-unit" value="章"></div>
        <div class="field"><label>备注</label><input id="b-note" placeholder="简介会自动填入，可改"></div>
        <div class="btn-row"><button class="btn ghost" data-act="close-modal">取消</button><button class="btn" id="b-save">保存</button></div>
      </div>`;
    modalRoot.innerHTML = html; modalRoot.classList.add('show');
    let pickedCover = '';
    $('#b-search').onclick = async () => {
      const title = $('#b-title').value.trim();
      if (!title) { toast('先输入书名'); return; }
      const box = $('#b-results'); box.innerHTML = '<div class="empty">搜索中…</div>';
      try {
        const res = await XZ_CONTENT.searchBook(title);
        if (!res.length) { box.innerHTML = '<div class="empty">未找到，可手动填写</div>'; return; }
        box.innerHTML = '<div class="muted" style="margin:6px 0">点选一本自动填：</div>' + res.map((b, i) => `
          <div class="book-result" data-i="${i}">
            <img src="${esc(b.cover || '')}" onerror="this.style.display='none'" class="book-thumb">
            <div class="br-body"><div class="br-title">${esc(b.title)}</div><div class="br-meta">${esc(b.author || '未知作者')}${b.year ? ' · ' + b.year : ''}</div></div>
          </div>`).join('');
        $$('.book-result', box).forEach((el) => el.onclick = async () => {
          const b = res[Number(el.dataset.i)];
          $('#b-title').value = b.title;
          $('#b-author').value = b.author || '';
          pickedCover = b.cover || '';
          $$('.book-result', box).forEach((x) => x.classList.remove('sel'));
          el.classList.add('sel');
          toast('已填入：' + b.title);
          if (b.desc) { $('#b-note').value = b.desc; }
          else if (b.work) { const d = await XZ_CONTENT.bookDesc(b.work); if (d) $('#b-note').value = d; }
        });
      } catch (e) { box.innerHTML = '<div class="empty">搜索失败（接口较慢或被网络拦截）<br>可直接手动填写书名 / 作者，不影响保存</div>'; }
    };
    $('#b-save').onclick = () => {
      const title = $('#b-title').value.trim();
      if (!title) { toast('书名不能为空'); return; }
      DB.state.books.push({ id: DB.uid(), title, author: $('#b-author').value.trim(), total: Number($('#b-total').value) || 1, current: Number($('#b-current').value) || 0, unit: $('#b-unit').value || '章', note: $('#b-note').value.trim(), cover: pickedCover });
      DB.save(); closeModal(); render(); toast('已添加（信息已自动补全）');
    };
  }
  function updateBook(id) {
    const b = DB.state.books.find((x) => x.id === id); if (!b) return;
    openForm('更新进度 · ' + b.title, [
      { key: 'current', label: '已读到（' + (b.unit || '章') + '）', type: 'number' },
      { key: 'note', label: '备注', type: 'text' }
    ], { current: b.current, note: b.note }, (v) => { b.current = Number(v.current) || 0; b.note = v.note; DB.save(); render(); toast('已更新'); });
  }
  function editBook(id) {
    const b = DB.state.books.find((x) => x.id === id); if (!b) return;
    const html = `<div class="modal-mask" data-act="close-modal"></div>
      <div class="modal"><div class="modal-head"><h3>📚 编辑 · ${esc(b.title)}</h3><button class="modal-close" data-act="close-modal">✕</button></div>
        ${b.cover ? `<img src="${esc(b.cover)}" onerror="this.style.display='none'" class="book-cover" alt="封面">` : ''}
        <div class="field"><label>书名（可重新点搜索补全信息）</label><input id="b-title" value="${esc(b.title)}"></div>
        <div class="btn-row"><button class="btn soft sm" id="b-search">🔍 重新搜索书籍信息</button></div>
        <div id="b-results"></div>
        <div class="field" style="margin-top:8px"><label>作者</label><input id="b-author" value="${esc(b.author || '')}"></div>
        <div class="field"><label>总章节 / 页数</label><input id="b-total" type="number" value="${b.total}"></div>
        <div class="field"><label>已读</label><input id="b-current" type="number" value="${b.current}"></div>
        <div class="field"><label>单位</label><input id="b-unit" value="${esc(b.unit || '章')}"></div>
        <div class="field"><label>备注/简介</label><input id="b-note" value="${esc(b.note || '')}"></div>
        <div class="btn-row"><button class="btn ghost" data-act="close-modal">取消</button><button class="btn" id="b-save">保存修改</button></div>
      </div>`;
    modalRoot.innerHTML = html; modalRoot.classList.add('show');
    let pickedCover = b.cover || '';
    $('#b-search').onclick = async () => {
      const title = $('#b-title').value.trim();
      if (!title) { toast('先输入书名'); return; }
      const box = $('#b-results'); box.innerHTML = '<div class="empty">搜索中…</div>';
      try {
        const res = await XZ_CONTENT.searchBook(title);
        if (!res.length) { box.innerHTML = '<div class="empty">未找到，可手动填写</div>'; return; }
        box.innerHTML = '<div class="muted" style="margin:6px 0">点选一本自动填：</div>' + res.map((r, i) => `
          <div class="book-result" data-i="${i}">
            <img src="${esc(r.cover || '')}" onerror="this.style.display='none'" class="book-thumb">
            <div class="br-body"><div class="br-title">${esc(r.title)}</div><div class="br-meta">${esc(r.author || '未知作者')}${r.year ? ' · ' + r.year : ''}</div></div>
          </div>`).join('');
        $$('.book-result', box).forEach((el) => el.onclick = async () => {
          const r = res[Number(el.dataset.i)];
          $('#b-title').value = r.title;
          $('#b-author').value = r.author || '';
          pickedCover = r.cover || '';
          $$('.book-result', box).forEach((x) => x.classList.remove('sel'));
          el.classList.add('sel');
          toast('已填入：' + r.title);
          if (r.desc) { $('#b-note').value = r.desc; }
          else if (r.work) { const d = await XZ_CONTENT.bookDesc(r.work); if (d) $('#b-note').value = d; }
        });
      } catch (e) { box.innerHTML = '<div class="empty">搜索失败（接口较慢或被网络拦截）<br>可直接手动填写书名 / 作者，不影响保存</div>'; }
    };
    $('#b-save').onclick = () => {
      const title = $('#b-title').value.trim();
      if (!title) { toast('书名不能为空'); return; }
      Object.assign(b, {
        title,
        author: $('#b-author').value.trim(),
        total: Number($('#b-total').value) || 1,
        current: Number($('#b-current').value) || 0,
        unit: $('#b-unit').value || '章',
        note: $('#b-note').value.trim(),
        cover: pickedCover
      });
      DB.save(); closeModal(); render(); toast('已保存修改');
    };
  }
