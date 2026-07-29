  function renderBook(b) {
    const total = Number(b.total) || 1; const cur = Number(b.current) || 0;
    const pct = Math.min(100, Math.round((cur / total) * 100));
    return `<div class="member" data-id="${b.id}">
      ${b.cover ? `<img src="${esc(b.cover)}" onerror="this.style.display='none'" class="book-cover" alt="封面">` : ''}
      <div class="m-head"><span class="m-name">${esc(b.title)}</span><span class="m-pct">${pct}%</span></div>
      <div class="muted" style="font-size:12px;margin:2px 0 6px">${cur}/${total} ${b.unit || '章'}${b.author ? ' · ' + esc(b.author) : ''}${b.note ? ' · ' + esc(b.note) : ''}</div>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="btn-row" style="margin-top:8px">
        <button class="btn soft sm" data-act="edit-book" data-id="${b.id}">编辑</button>
        <button class="btn soft sm" data-act="upd-book" data-id="${b.id}">更新进度</button>
        <button class="btn danger sm" data-act="del-book" data-id="${b.id}">删除</button>
      </div>
    </div>`;
  }

  /* ================= 生活 ================= */
  async function renderLife() {
    const water = DB.state.water[dateKey()] || 0;
    const f = XZ_CONTENT.fortune(new Date());
    const sk = DB.state.skincare && DB.state.skincare[dateKey()];
    const html = `
    <div class="hero fade-in"><h2>🌿 生活板块</h2><p>记账 · 健身 · 运势 · 喝水 · 经期 · 纪念日 · 天气 · 便签 · 治痘</p></div>

    <div class="tile-grid">
      <div class="tile" data-act="life-book"><div class="t-emoji">💰</div><div class="t-name">记账</div><div class="t-desc">分类·月度汇总</div></div>
      <div class="tile" data-act="life-fitness"><div class="t-emoji">🏃</div><div class="t-name">健身减肥</div><div class="t-desc">打卡·目标</div></div>
      <div class="tile" data-act="life-fortune"><div class="t-emoji">🔮</div><div class="t-name">运势穿衣</div><div class="t-desc">每日建议</div></div>
      <div class="tile" data-act="life-water"><div class="t-emoji">💧</div><div class="t-name">喝水提醒</div><div class="t-desc">${water}/${DB.state.waterGoal}杯</div></div>
      <div class="tile" data-act="life-period"><div class="t-emoji">🩸</div><div class="t-name">经期记录</div><div class="t-desc">预测·提醒</div></div>
      <div class="tile" data-act="life-anni"><div class="t-emoji">💝</div><div class="t-name">纪念日</div><div class="t-desc">倒计时</div></div>
      <div class="tile" data-act="life-wx"><div class="t-emoji">🌤️</div><div class="t-name">天气预报</div><div class="t-desc">实时·提醒</div></div>
      <div class="tile" data-act="life-note"><div class="t-emoji">📌</div><div class="t-name">碎碎念</div><div class="t-desc">便利贴</div></div>
      <div class="tile" data-act="life-acne"><div class="t-emoji">🌸</div><div class="t-name">治痘方案</div><div class="t-desc">科学护肤</div></div>
    </div>

    <div class="card" id="wx-card">
      <div class="card-title"><span class="emoji">🌤️</span>今日天气 · ${esc(DB.state.profile.city)}<span class="sub"><button class="btn soft sm" data-act="refresh-wx">刷新</button></span></div>
      <div id="wx-body"><div class="empty">加载中…</div></div>
    </div>

    <div class="card">
      <div class="card-title"><span class="emoji">💧</span>今日喝水<span class="sub">${water}/${DB.state.waterGoal} 杯</span></div>
      <div class="cups">${cupGrid(water, DB.state.waterGoal)}</div>
      <div class="btn-row"><button class="btn soft sm" data-act="water-set">设置目标</button></div>
    </div>

    <div class="card">
      <div class="card-title"><span class="emoji">🔮</span>今日运势 · 穿衣<span class="sub">${f.gz}日</span></div>
      <div class="row" style="gap:10px;flex-wrap:wrap">
        <span class="color-tag good">贵人色 ${f.best.map((c) => c.n).join('/')}</span>
        <span class="color-tag mid">次吉 ${f.good.map((c) => c.n).join('/')}</span>
        <span class="color-tag bad">忌 ${f.avoid.map((c) => c.n).join('/')}</span>
      </div>
      <div class="muted" style="margin-top:6px">💡 ${esc(f.tip)}</div>
    </div>

    <div class="card">
      <div class="card-title"><span class="emoji">🌸</span>今日护肤打卡<span class="sub">${sk ? '已打卡 ✅' : '未打卡'}</span></div>
      <div class="muted" style="margin-bottom:8px">T区控油 + 局部抗痘 + 防晒，坚持才有效～</div>
      <button class="btn block ${sk ? 'ghost' : ''}" data-act="skincare-toggle">${sk ? '今日已打卡（点此取消）' : '完成今日护肤 · 打卡'}</button>
    </div>`;
    $('#view').innerHTML = html;
    loadWeatherInto();
  }
  function cupGrid(water, goal) {
    let s = '';
    for (let i = 1; i <= Math.max(goal, water); i++) s += `<div class="cup ${i <= water ? 'on' : ''}" data-act="water-cup" data-n="${i}"></div>`;
    return s;
  }
  async function loadWeatherInto() {
    const box = $('#wx-body'); if (!box) return;
    const r = await fetchWeather();
    if (r.error) { box.innerHTML = `<div class="empty">${esc(r.error)}</div>`; return; }
    const c = r.w.current; const d = r.w.daily;
    const [ce, ct] = wxCode(c.weather_code);
    let days = '';
    for (let i = 0; i < 3; i++) {
      const [e, t] = wxCode(d.weather_code[i]);
      const label = i === 0 ? '今天' : i === 1 ? '明天' : '后天';
      days += `<div class="wx-day"><div class="d">${label}</div><div class="e">${e}</div><div class="t">${Math.round(d.temperature_2m_min[i])}°/${Math.round(d.temperature_2m_max[i])}°</div></div>`;
    }
    box.innerHTML = `<div class="wx-now"><div class="wx-emoji">${ce}</div><div><div class="wx-temp">${Math.round(c.temperature_2m)}°</div><div class="muted">${ct} · 湿度${c.relative_humidity_2m}% · 风${Math.round(c.wind_speed_10m)}km/h</div></div></div>
      <div class="wx-3d">${days}</div>`;
  }

  /* ---- 生活子模块 ---- */
  function renderBookkeeping() {
    const exp = DB.state.expenses.slice().reverse();
    const month = monthTotal();
    const byCat = {};
    DB.state.expenses.filter((e) => e.date && e.date.startsWith(dateKey().slice(0, 7))).forEach((e) => { byCat[e.category] = (byCat[e.category] || 0) + Number(e.amount); });
    const catHtml = Object.keys(byCat).length ? Object.keys(byCat).map((k) => `<span class="chip">${esc(k)} ¥${byCat[k].toFixed(0)}</span>`).join('') : '<span class="muted">本月暂无记录</span>';
    const html = `<div class="hero fade-in"><h2>💰 记账</h2><p>本月支出 ¥${month.toFixed(2)}</p></div>
      <div class="card"><div class="card-title"><span class="emoji">📊</span>本月分类</div><div class="chips">${catHtml}</div>
      <div class="btn-row"><button class="btn" data-act="add-expense">＋ 记一笔</button></div></div>
      <div class="card"><div class="card-title"><span class="emoji">🧾</span>明细</div>
      ${exp.length ? exp.map((e) => `<div class="kv"><span>${esc(e.category)} ${e.note ? '· ' + esc(e.note) : ''}<br><span class="muted" style="font-size:11px">${e.date}</span></span><span style="font-weight:700">¥${Number(e.amount).toFixed(2)}</span><button class="btn soft sm" data-act="edit-expense" data-id="${e.id}">改</button> <button class="btn danger sm" data-act="del-expense" data-id="${e.id}">删</button></div>`).join('') : '<div class="empty">还没有记账</div>'}</div>`;
    $('#view').innerHTML = html;
  }
  function renderFitness() {
    const wk = weekWorkouts();
    const goal = 150;
    const tips = XZ_CONTENT.FITNESS_PLAN.tips;
    const todayK = dateKey();
    const doneToday = (DB.state.fitnessLog || []).includes(todayK);
    const streak = fitnessStreak();
    const routines = XZ_CONTENT.FITNESS_ROUTINES;
    const dTip = XZ_CONTENT.dailyTip(XZ_CONTENT.FITNESS_TIPS, new Date());
    const html = `<div class="hero fade-in"><h2>🏃 健身减肥督促</h2><p>本周 ${wk.count} 次 · ${wk.min} 分钟 / 目标 ${goal} 分钟</p></div>
      <div class="card">
        <div class="card-title"><span class="emoji">🎬</span>每日跟练（看视频 · 自动打卡）</div>
        <div class="muted" style="margin-bottom:8px">① 选一个跟练视频点「打开视频」跟着练；② 点「开始跟练」计时，时间到自动帮你打卡 ✅（不用手动点“已打卡”）。</div>
        <div class="chips">${routines.map((r, i) => `<button class="chip btn soft sm" data-act="open-routine" data-i="${i}">${esc(r.name)}</button>`).join('')}</div>
        <div id="fit-timer" class="fit-timer"></div>
        <div class="btn-row" style="margin-top:8px">
          <button class="btn" data-act="fit-start" data-min="15">开始跟练 15分</button>
          <button class="btn" data-act="fit-start" data-min="20">20分</button>
          <button class="btn" data-act="fit-start" data-min="30">30分</button>
        </div>
        <div class="kv" style="margin-top:8px"><span>今日跟练</span><span>${doneToday ? '已完成 ✅' : '未完成'}${streak > 0 ? ' · 🔥连续' + streak + '天' : ''}</span></div>
      </div>
      <div class="card"><div class="card-title"><span class="emoji">📊</span>本周进度</div><div class="bar"><i style="width:${Math.min(100, (wk.min / goal) * 100)}%"></i></div>
        <div class="btn-row"><button class="btn soft sm" data-act="add-workout">＋ 手动补记</button></div></div>
      <div class="card"><div class="card-title"><span class="emoji">📋</span>最近打卡</div>
        ${DB.state.workouts.slice().reverse().slice(0, 8).map((w) => `<div class="kv"><span>${esc(w.type)} ${w.note ? '· ' + esc(w.note) : ''}<br><span class="muted" style="font-size:11px">${w.date}</span></span><span>${w.minutes}分钟 <button class="btn soft sm" data-act="edit-workout" data-id="${w.id}">改</button> <button class="btn danger sm" data-act="del-workout" data-id="${w.id}">删</button></span></div>`).join('') || '<div class="empty">还没有打卡记录</div>'}</div>
      <div class="card"><div class="card-title"><span class="emoji">💡</span>今日科学小贴士（每日更新）</div>
        <div class="acne-step"><div class="num">★</div><div class="a-body"><b>${esc(dTip.t)}</b><p>${esc(dTip.d)}</p></div></div></div>
      <div class="card"><div class="card-title"><span class="emoji">📚</span>科学减肥要点</div>
        ${tips.map((t, i) => `<div class="acne-step"><div class="num">${i + 1}</div><div class="a-body"><b>${esc(t.t)}</b><p>${esc(t.d)}</p></div></div>`).join('')}</div>`;
    $('#view').innerHTML = html;
  }
  function fitnessStreak() {
    const logs = DB.state.fitnessLog || [];
    if (!logs.length) return 0;
    let s = 0; const d = new Date();
    for (;;) { const k = dateKey(d); if (logs.includes(k)) { s++; d.setDate(d.getDate() - 1); } else break; }
    return s;
  }
  function startFitnessSession(min) {
    if (fitTimer) { clearInterval(fitTimer); fitTimer = null; }
    const box = $('#fit-timer'); if (!box) return;
    let remain = min * 60;
    const tick = () => {
      if (remain <= 0) {
        clearInterval(fitTimer); fitTimer = null;
        DB.state.fitnessLog = DB.state.fitnessLog || [];
        const todayK = dateKey();
        if (!DB.state.fitnessLog.includes(todayK)) DB.state.fitnessLog.push(todayK);
        DB.state.workouts.push({ id: DB.uid(), date: todayK, type: '跟练视频', minutes: min, note: '自动打卡' });
        DB.save(); render();
        toast('🎉 今日跟练完成，已自动打卡 · 连续 ' + fitnessStreak() + ' 天');
        return;
      }
      const m = Math.floor(remain / 60), s = remain % 60;
      box.innerHTML = `<div class="ft-clock">⏱️ ${m}:${String(s).padStart(2, '0')}</div><div class="muted">跟练进行中…时间到自动打卡</div><button class="btn soft sm" data-act="fit-cancel">取消</button>`;
      remain--;
    };
    tick();
    fitTimer = setInterval(tick, 1000);
  }
  function renderFortune() {
    const f = XZ_CONTENT.fortune(new Date());
    const html = `<div class="hero fade-in"><h2>🔮 今日运势 · 穿衣颜色</h2><p>${f.gz}日 · 五行属${f.elem} · 仅供娱乐参考</p></div>
      <div class="card"><div class="fortune-top">
        <div class="fortune-score" style="--p:${f.score}%"><b>${f.score}</b><span>${f.level}</span></div>
        <div style="flex:1"><div class="muted">综合运势评分（按日期生成，每日不同）</div><div class="muted" style="margin-top:6px">💡 ${esc(f.tip)}</div></div>
      </div></div>
      <div class="card"><div class="card-title"><span class="emoji">👗</span>五行穿衣建议</div>
        ${colorBlock('贵人色 · 大吉（生我）', f.best, 'good')}
        ${colorBlock('次吉（同我）', f.good, 'mid')}
        ${colorBlock('招财（我克）', f.mid, 'mid')}
        ${colorBlock('消耗 · 慎（我生）', f.bad, 'bad')}
        ${colorBlock('大忌（克我）', f.avoid, 'bad')}
      </div>`;
    $('#view').innerHTML = html;
  }
  function colorBlock(title, colors, cls) {
    return `<div style="margin-bottom:10px"><div class="muted" style="margin-bottom:5px">${title}</div><div class="row"><div class="color-row">${colors.map((c) => `<span class="color-dot" style="background:${c.c}" title="${c.n}"></span>`).join('')}</div><span class="color-tag ${cls}">${colors.map((c) => c.n).join('/')}</span></div></div>`;
  }
  function renderWater() {
    const water = DB.state.water[dateKey()] || 0;
    const html = `<div class="hero fade-in"><h2>💧 喝水提醒</h2><p>今天 ${water}/${DB.state.waterGoal} 杯 · 点杯子记录</p></div>
      <div class="card"><div class="bar"><i style="width:${Math.min(100, (water / DB.state.waterGoal) * 100)}%"></i></div>
      <div class="cups" style="margin-top:12px">${cupGrid(water, DB.state.waterGoal)}</div>
      <div class="muted" style="margin-top:10px">建议每天 1.5–2L（约 8 杯）。久坐学习记得每小时喝一口～</div>
      <div class="btn-row"><button class="btn soft sm" data-act="water-set">设置目标杯数</button></div></div>`;
    $('#view').innerHTML = html;
  }
  function renderPeriod() {
    const p = DB.state.period;
    const info = periodInfo();
    const html = `<div class="hero fade-in"><h2>🩸 经期记录与提醒</h2><p>${info ? '下次预计 ' + info.next + '（约 ' + (info.days <= 0 ? '近期' : info.days + ' 天后') + '）' : '记录一次开始日即可预测'}</p></div>
      <div class="card">
        <div class="kv"><span>周期长度</span><span>${p.cycleLen} 天 <button class="btn soft sm" data-act="period-len">改</button></span></div>
        <div class="kv"><span>经期长度</span><span>${p.periodLen} 天</span></div>
        <div class="btn-row"><button class="btn" data-act="period-add">＋ 记录本次开始日</button></div>
        <div class="hr"></div>
        <div class="muted">历史记录（开始日）：</div>
        ${p.cycles.slice().reverse().slice(0, 8).map((c) => `<div class="kv"><span>${c}</span><button class="btn soft sm" data-act="edit-period" data-d="${c}">改</button> <button class="btn danger sm" data-act="period-del" data-d="${c}">删</button></div>`).join('') || '<div class="empty">暂无</div>'}
      </div>
      <div class="card"><div class="card-title"><span class="emoji">🌸</span>姨妈期护肤提醒</div>
        <div class="muted">经前1周开始加强清洁、控糖少奶；经期暂停强去角质，红肿痘冷敷。详见「治痘方案」。</div></div>`;
    $('#view').innerHTML = html;
  }
  function renderAnni() {
    const list = DB.state.anniversaries.map((a) => { const d = daysLeft(a.date); return { a, d }; }).sort((x, y) => x.d - y.d);
    const html = `<div class="hero fade-in"><h2>💝 纪念日</h2><p>记录重要日子，临期自动提醒</p></div>
      <div class="card"><div class="btn-row"><button class="btn" data-act="add-anni">＋ 添加纪念日</button></div>
      ${list.length ? list.map(({ a, d }) => `<div class="kv"><span>${esc(a.title)}${a.note ? ' · ' + esc(a.note) : ''}<br><span class="muted" style="font-size:11px">${a.date}${a.repeat === 'year' ? ' · 每年' : ''}</span></span><span>${d <= 0 ? '就是今天🎉' : '还有 ' + d + ' 天'}<button class="btn soft sm" data-act="edit-anni" data-id="${a.id}">改</button> <button class="btn danger sm" data-act="del-anni" data-id="${a.id}">删</button></span></div>`).join('') : '<div class="empty">还没有纪念日</div>'}</div>`;
    $('#view').innerHTML = html;
  }
