/* 小紫同学 · 内容库（来自公开网络资料整理，仅供参考，不替代就医） */
(function (global) {
  'use strict';

  /* ============ 科学治痘方案（综合多位皮肤科医师公开建议） ============ */
  const ACNE_PLAN = {
    intro: '综合中山大学孙逸仙纪念医院、复旦华山医院、协和医院、山东省立医院等多位皮肤科医师公开建议整理。T区出油+姨妈期加重属常见激素波动型痤疮，以下为日常可操作的科学方案。如囊肿/结节/瘢痕或3个月无改善，请到皮肤科就诊。',
    daily: [
      { t: '温和清洁（早晚各1次）', d: '32–38℃温水 + 氨基酸洁面，T区可局部用含水杨酸(0.5–2%)棉片轻擦疏通毛孔。避免皂基/强力清洁，以免破坏屏障反而更出油。' },
      { t: '分区控油保湿', d: 'T区用含烟酰胺/水杨酸的清爽乳液控油；干燥区用含神经酰胺的保湿霜。选无油配方，维持水油平衡。' },
      { t: '局部抗痘点涂', d: '红肿痘点涂过氧化苯甲酰(2.5%以下)/克林霉素凝胶；睡前用阿达帕林(先每周2–3次建立耐受)。脓疱痘贴水胶体痘痘贴，切勿用手挤。' },
      { t: '严格防晒', d: '外出用SPF30+物理防晒(含氧化锌/二氧化钛)，防止炎症后色素沉淀。紫外线会加重痘印。' },
      { t: '饮食内调', d: '控高糖(奶茶/甜点)、少乳制品(尤其全脂奶)、少油炸；多Omega-3(深海鱼/亚麻籽)、锌(坚果/贝类)、维B6(香蕉/鱼)、维A/C/E蔬果。' },
      { t: '作息与减压', d: '23点前入睡、保证7–9h；压力升高皮质醇会刺激出油，用快走/瑜伽/冥想调节。枕巾每3天换，刘海夹起，长痘期不用磨砂膏/洁面仪。' }
    ],
    period: [
      { t: '原理', d: '经前雌激素下降、雄激素相对升高→皮脂分泌增多、毛孔易堵。爆痘多在经前1–2周开始，经期结束多自行缓解。' },
      { t: '经前1周预防', d: '提前增加清洁频率；每周1–2次吸附泥膜(高岭土类)预防堵塞；补充维B6(50–100mg/日，香蕉/深海鱼)与大豆异黄酮(豆浆/豆腐)平衡激素。' },
      { t: '经期护理', d: '暂停强效去角质；红肿痘冷藏生理盐水湿敷5分钟；早晨克林霉素、晚上阿达帕林(间隔30分钟以上)；避开含酒精/香精产品。' },
      { t: '记录与就医', d: '用本App记录经期与爆痘时间，观察规律。若3个周期无改善或伴月经不调/多毛，排查多囊卵巢综合征(查激素六项)。囊肿型可就医红蓝光/局部注射，反复者医生或开短效避孕药/螺内酯(均须医嘱)。' }
    ]
  };

  /* ============ 学生科学减肥/健身督促（综合多位医师/营养师公开建议） ============ */
  const FITNESS_PLAN = {
    intro: '综合山东大学齐鲁医院、北京大学人民医院、北京友谊医院等减重/营养科公开建议整理，面向学生党，强调可持续、不影响学业。',
    tips: [
      { t: '热量缺口300–500kcal/日', d: '女生基础代谢约1200–1500kcal，不极端节食。每月减0.5–2kg为健康速度，过快易反弹、影响月经。' },
      { t: '饮食结构：1/3+1/3+1/3', d: '全谷物(燕麦/糙米)+优质蛋白(蛋/豆/鸡胸)+蔬菜(占餐盘1/2)。餐前喝水300ml增强饱腹；零食用原味坚果≤20g/日替代高糖零食。' },
      { t: '运动：每日累计≥30分钟', d: '中高强度(跳绳/爬楼/快走)+每周2–3次力量(深蹲/平板支撑12–15次×3组)。课间5分钟拉伸、步行骑车代步，利用碎片时间。' },
      { t: '作息稳代谢', d: '23点前睡、午休20分钟。女性经期后1周为"减脂黄金期"可适度加量；经期改瑜伽/散步，避免剧烈运动。' },
      { t: '心理与记录', d: '每周固定晨起空腹称重，允许每月1次"欺骗餐"；记饮食日记。体重波动正常，不因单次上升焦虑。' }
    ]
  };

  /* ============ 听时政 / 读新闻 可靠信息源 ============ */
  const AFFAIRS_SOURCES = [
    { name: '央视新闻 / 新闻联播', desc: '权威视频与音频，适合"听"', url: 'https://news.cctv.com/', tag: '听+看' },
    { name: '人民日报', desc: '评论深读、时政要闻', url: 'http://www.people.com.cn/', tag: '读' },
    { name: '新华社', desc: '快讯与通稿，时效性强', url: 'https://www.news.cn/', tag: '读' },
    { name: '澎湃新闻', desc: '深度报道与解读', url: 'https://www.thepaper.cn/', tag: '读' },
    { name: '联合早报', desc: '国际视角中文资讯', url: 'https://www.zaobao.com.sg/', tag: '读' },
    { name: 'BBC中文', desc: '国际新闻与专题', url: 'https://www.bbc.com/zhongwen', tag: '读' },
    { name: '小宇宙 / 喜马拉雅', desc: '搜"新闻联播""人民日报评论""财经夜读"听播客', url: 'https://www.xiaoyuzhoufm.com/', tag: '听' }
  ];

  /* ============ 五行穿衣 + 每日运势引擎 ============ */
  const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const ELEM_OF_GAN = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
  const ELEM_COLORS = {
    '木': [{ c: '#2e7d32', n: '绿' }, { c: '#43a047', n: '青' }],
    '火': [{ c: '#e53935', n: '红' }, { c: '#8e24aa', n: '紫' }, { c: '#ec407a', n: '粉' }],
    '土': [{ c: '#c8a165', n: '黄' }, { c: '#8d6e63', n: '棕' }, { c: '#a1887f', n: '咖啡' }],
    '金': [{ c: '#fafafa', n: '白' }, { c: '#f5e6a8', n: '金' }, { c: '#cfd8dc', n: '银' }],
    '水': [{ c: '#1565c0', n: '蓝' }, { c: '#1e3a5f', n: '黑' }]
  };
  const ORDER = ['木', '火', '土', '金', '水'];
  const CONTROLS = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' }; // X克Y
  const next = (e) => ORDER[(ORDER.indexOf(e) + 1) % 5];
  const prev = (e) => ORDER[(ORDER.indexOf(e) + 4) % 5];

  function ganzhiIndexOfDate(date) {
    const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
    let yy = y, mm = m;
    if (mm <= 2) { mm += 12; yy -= 1; }
    const jd = Math.floor(367 * yy - Math.floor(7 * (yy + Math.floor((mm + 9) / 12)) / 4) + Math.floor(275 * mm / 9) + d + 1721013.5);
    return ((jd + 49) % 60 + 60) % 60;
  }

  const LUCK_TIPS = [
    '今天适合推进卡了很久的论文小节，专注2小时能有突破。',
    '给课题组成员发个进度提醒，温柔但明确，效率最高。',
    '背30个考研单词 + 1篇阅读，积少成多。',
    '听一集时政新闻，顺手记两个可以用到论文里的观点。',
    '喝够水、早点睡，皮肤和你都会感谢你。',
    '今天宜整理备忘录，把碎碎念变成行动清单。',
    '经期前后少熬夜，做个拉伸比硬练更养肤。',
    '记一笔今日花销，月底你会更安心。'
  ];

  function fortune(date) {
    const idx = ganzhiIndexOfDate(date);
    const gan = GAN[idx % 10], zhi = ZHI[idx % 12];
    const elem = ELEM_OF_GAN[idx % 10];
    // 穿衣：生我(贵人/大吉) / 同我(次吉) / 我克(招财) / 我生(消耗) / 克我(大忌)
    const best = ELEM_COLORS[prev(elem)];   // 生我
    const good = ELEM_COLORS[elem];          // 同我
    const mid = ELEM_COLORS[CONTROLS[elem]]; // 我克（招财）
    const bad = ELEM_COLORS[next(elem)];     // 我生（消耗）
    const controller = Object.keys(CONTROLS).find((k) => CONTROLS[k] === elem); // 克我者
    const avoid = ELEM_COLORS[controller];   // 大忌
    const seed = idx * 7 + date.getDate();
    const score = 62 + (seed % 34); // 62-95
    const level = score >= 88 ? '大吉' : score >= 78 ? '中吉' : score >= 70 ? '小吉' : '平';
    const tip = LUCK_TIPS[(idx) % LUCK_TIPS.length];
    return { gan, zhi, elem, gz: gan + zhi, best, good, mid, bad, avoid, score, level, tip };
  }

  function clothingSuggestion(date) {
    const f = fortune(date);
    return {
      gz: f.gz, elem: f.elem,
      best: f.best, good: f.good, mid: f.mid, bad: f.bad, avoid: f.avoid
    };
  }

  /* ============ 今日热点新闻（离线兜底快照 + 在线RSS源） ============ */
  // 兜底：抓取自 2026-07-28 真实新闻（带真实文章链接，点开即跳转原文），断网时仍可直接推送
  const HOT_NEWS_FALLBACK = [
    { title: '习近平应约同巴西总统卢拉通电话，就全球治理等交换意见', source: '央视新闻', url: 'https://new.qq.com/rain/a/20260728A021IR00' },
    { title: '“九五”普法规划对外发布，部署2026—2030法治宣传教育', source: '央视新闻', url: 'https://finance.sina.com.cn/wm/2026-07-28/doc-inikhyqk8176297.shtml' },
    { title: '长鑫科技登陆科创板，全天成交额超1400亿元创A股历史新高', source: '央视新闻', url: 'https://ysxw.cctv.cn/article.html?toc_style_id=feeds_default&item_id=11574738297326757928&channelId=1119' },
    { title: '辽宁大连长山群岛候鸟栖息地成功纳入世界自然遗产', source: '央视新闻', url: 'https://finance.sina.com.cn/wm/2026-07-28/doc-inikhyqk8176297.shtml' },
    { title: '财政部、应急管理部紧急预拨1.8亿元救灾资金支持6省份防汛防台风', source: '腾讯新闻', url: 'https://new.qq.com/rain/a/20260728A02B7O00' },
    { title: '上半年全国规上工业企业利润同比增18.7%，工业生产稳中有进', source: '国家统计局', url: 'https://finance.sina.com.cn/wm/2026-07-28/doc-inikhyqk8176297.shtml' },
    { title: '商务部回应美方拟调查制裁中国AI企业：停止抹黑和威胁', source: '商务部', url: 'http://www.mofcom.gov.cn/' },
    { title: '网信部门处置未规范标注来源自媒体账号3704个', source: '网信中国', url: 'https://www.cac.gov.cn/' },
    { title: '韩国前总统尹锡悦一审被判有期徒刑一年六个月、缓刑三年', source: '央视新闻', url: 'https://finance.sina.com.cn/wm/2026-07-28/doc-inikhyqk8176297.shtml' },
    { title: '日本推理小说家东野圭吾去世', source: '央视新闻', url: 'https://finance.sina.com.cn/wm/2026-07-28/doc-inikhyqk8176297.shtml' },
    { title: '57个国家和3个国际组织确认参加今年进博会国家展', source: '央视新闻', url: 'https://www.zgm.cn/content/6a67f58a06f05' },
    { title: '京沪高铁、京沪铁路7月28日起可预约中秋假期火车票', source: '腾讯新闻', url: 'https://new.qq.com/rain/a/20260728A02B7O00' }
  ];
  // 在线 RSS（经 CORS 代理抓取；任一可用即合并，全失败回退兜底）
  const NEWS_FEEDS = [
    { name: '央视新闻', url: 'https://news.cctv.com/rss/china.xml' },
    { name: '人民网', url: 'http://www.people.com.cn/rss/politics.xml' },
    { name: '新华网', url: 'https://www.news.cn/rss/news.xml' },
    { name: '澎湃新闻', url: 'https://www.thepaper.cn/rss_news.jsp' }
  ];

  /* ============ 每日科学小贴士（按日期轮换，定期更新） ============ */
  const ACNE_TIPS = [
    { t: 'T区控油先保湿', d: 'T区出油常伴“外油内干”，过度清洁反而刺激出油。用无油保湿乳维持水油平衡，出油会慢慢减少。' },
    { t: '水杨酸疏通毛孔', d: 'T区每周2–3次用水杨酸(0.5–2%)棉片轻擦，帮助溶解角栓、预防闭口与黑头。' },
    { t: '姨妈期前一周是预防关键', d: '经前雌激素降、雄激素相对升，爆痘多在经前1–2周开始。提前加强清洁、控糖少奶最有效。' },
    { t: '红肿痘别用手挤', d: '挤压会把细菌压入深层，易留痘印痘坑。脓疱痘贴水胶体痘痘贴，让其自行收干。' },
    { t: '过氧化苯甲酰点涂', d: '新发红肿痘点涂2.5%以下过氧化苯甲酰杀菌抗炎；初期可能脱皮，从隔日使用建立耐受。' },
    { t: '阿达帕林要晚上用', d: '维A酸类(阿达帕林)光敏，睡前薄涂，初期每周2–3次建立耐受，至少用8周才见效，别着急停。' },
    { t: '防晒防痘印', d: '紫外线加重炎症后色素沉淀。痘肌外出用SPF30+防晒，痘印期更要注意。' },
    { t: '少糖少奶', d: '高糖(奶茶/甜点)与全脂奶会刺激皮脂与胰岛素样生长因子，易致痘。改无糖饮品与原味坚果。' },
    { t: '枕巾勤换', d: '枕巾上的油脂与螨虫会反复刺激面部。每3天换洗一次，长痘期刘海夹起别贴脸。' },
    { t: '记录爆痘规律', d: '用App记录经期与爆痘时间，连续3个周期就能看出规律，必要时就医排查多囊。' }
  ];
  const FITNESS_TIPS = [
    { t: '每天30分钟就够', d: '不必一次练很久。课间快走、爬楼、拉伸累积到30分钟中高强度，同样有效且不影响学业。' },
    { t: '热量缺口300–500kcal', d: '女生基础代谢约1200–1500kcal，别极端节食。每月减0.5–2kg是健康速度，过快易反弹、影响月经。' },
    { t: '蛋白质要够', d: '减脂期每天保证1.2–1.6g/kg体重的蛋白(蛋/豆/鸡胸/鱼)，帮保肌肉、抗饿。' },
    { t: '餐前喝水300ml', d: '饭前一杯水增强饱腹感，正餐自然少吃；全天1.5–2L，学习久坐也别忘了喝。' },
    { t: '经期后一周是减脂黄金期', d: '月经结束后雌激素上升、代谢较好，可适度加量；经期改瑜伽/散步，避免剧烈运动。' },
    { t: '每周固定晨起称重', d: '体重一天波动1–2kg正常(水分/生理期)。看周趋势，不因单次数字焦虑。' },
    { t: '用碎片时间动起来', d: '能走不坐、能站不躺。每天多走2000步，一个月就能多消耗可观热量。' },
    { t: '睡眠稳代谢', d: '23点前睡、保证7–9h。睡眠不足会升高饥饿素、降低瘦素，越熬越想吃。' },
    { t: '每周一次欺骗餐', d: '适度放松更可持续。安排一顿喜欢的食物，避免长期压抑后暴食。' },
    { t: '力量训练别怕', d: '深蹲/平板支撑等力量练习体量小、不占地，帮塑形并提升基础代谢。' }
  ];
  function dailyTip(pool, date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const doy = Math.floor((date - start) / 86400000);
    return pool[doy % pool.length];
  }

  /* ============ 每日跟练视频源（B站搜索，点开即跟练） ============ */
  const FITNESS_ROUTINES = [
    { name: '有氧燃脂 20分钟', url: 'https://search.bilibili.com/all?keyword=' + encodeURIComponent('每日跟练 有氧燃脂 20分钟') },
    { name: '练腹/核心 10分钟', url: 'https://search.bilibili.com/all?keyword=' + encodeURIComponent('跟练 练腹 10分钟') },
    { name: '全身拉伸 15分钟', url: 'https://search.bilibili.com/all?keyword=' + encodeURIComponent('跟练 全身拉伸 15分钟') },
    { name: '帕梅拉跟练', url: 'https://search.bilibili.com/all?keyword=' + encodeURIComponent('帕梅拉 跟练') },
    { name: '瑜伽舒缓', url: 'https://search.bilibili.com/all?keyword=' + encodeURIComponent('瑜伽 跟练 舒缓') }
  ];

  /* ============ 书籍信息自动搜索（Open Library，免费CORS） ============ */
  // 带超时的 fetch（避免请求一直 pending 卡死"搜索中…"界面）
  async function fetchJSON(url, ms) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
      const r = await fetch(url, { signal: ctrl.signal });
      if (!r.ok) throw new Error('http ' + r.status);
      return await r.json();
    } finally { clearTimeout(t); }
  }
  // 内置兜底书目：即使完全离线/接口全挂，也能搜出结果，绝不死循环
  const BOOK_FALLBACK = [
    { title: '中国历代政治得失', author: '钱穆' },
    { title: '国史大纲', author: '钱穆' },
    { title: '万历十五年', author: '黄仁宇' },
    { title: '中国大历史', author: '黄仁宇' },
    { title: '明朝那些事儿', author: '当年明月' },
    { title: '全球通史', author: '斯塔夫里阿诺斯' },
    { title: '资治通鉴', author: '司马光' },
    { title: '史记', author: '司马迁' },
    { title: '乡土中国', author: '费孝通' },
    { title: '历史学是什么', author: '葛剑雄' },
    { title: '中国近代史', author: '蒋廷黻' },
    { title: '西方史学史', author: '张广智' }
  ];
  async function searchBook(title) {
    const q = encodeURIComponent((title || '').trim());
    if (!q) throw new Error('empty');
    // 1) Google Books 直连（CORS 友好、快、稳）
    try {
      const j = await fetchJSON('https://www.googleapis.com/books/v1/volumes?q=' + q + '&maxResults=6&country=CN', 9000);
      if (j && j.items && j.items.length) {
        return j.items.map((v) => {
          const info = v.volumeInfo || {};
          let cover = (info.imageLinks && (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail)) || '';
          cover = cover.replace('http://', 'https://');
          const desc = (info.description || '').toString().slice(0, 200);
          return {
            title: info.title || '',
            author: (info.authors || []).join('、'),
            year: (info.publishedDate || '').slice(0, 4),
            cover,
            work: '',
            desc,
            subject: (info.categories || []).join('、')
          };
        }).filter((x) => x.title);
      }
    } catch (e) {}
    // 2) Open Library 直连
    const ol = 'https://openlibrary.org/search.json?title=' + q + '&limit=6&fields=title,author_name,first_publish_year,cover_i,key,subject';
    let olDocs = null;
    try { const j = await fetchJSON(ol, 8000); if (j && j.docs) olDocs = j.docs; } catch (e) {}
    if (olDocs && olDocs.length) {
      return olDocs.map((d) => ({
        title: d.title,
        author: (d.author_name || []).join('、'),
        year: d.first_publish_year || '',
        cover: d.cover_i ? 'https://covers.openlibrary.org/b/id/' + d.cover_i + '-M.jpg' : '',
        work: d.key || '',
        desc: '',
        subject: (d.subject || []).slice(0, 4).join('、')
      }));
    }
    // 3) 代理兜底
    try {
      const j = await fetchJSON('https://api.allorigins.win/raw?url=' + encodeURIComponent(ol), 12000);
      if (j && j.docs && j.docs.length) {
        return j.docs.map((d) => ({
          title: d.title,
          author: (d.author_name || []).join('、'),
          year: d.first_publish_year || '',
          cover: d.cover_i ? 'https://covers.openlibrary.org/b/id/' + d.cover_i + '-M.jpg' : '',
          work: d.key || '',
          desc: '',
          subject: (d.subject || []).slice(0, 4).join('、')
        }));
      }
    } catch (e) {}
    // 4) 内置书目兜底（按书名包含匹配）
    const kw = (title || '').trim();
    const fb = BOOK_FALLBACK.filter((b) => b.title.includes(kw) || kw.includes(b.title.slice(0, 2)) || b.author.includes(kw));
    if (fb.length) return fb.map((b) => ({ title: b.title, author: b.author, year: '', cover: '', work: '', desc: '', subject: '' }));
    throw new Error('search failed');
  }
  async function bookDesc(work) {
    if (!work) return '';
    const ol = 'https://openlibrary.org' + work + '.json';
    let j = null;
    try { j = await fetchJSON(ol, 9000); } catch (e) {}
    if (!j || !j.description) {
      try { j = await fetchJSON('https://api.allorigins.win/raw?url=' + encodeURIComponent(ol), 12000); } catch (e) {}
    }
    if (!j) return '';
    let d = j.description;
    if (d && typeof d === 'object') d = d.value;
    return (d || '').toString().slice(0, 200);
  }

  global.XZ_CONTENT = {
    ACNE_PLAN, FITNESS_PLAN, AFFAIRS_SOURCES, fortune, clothingSuggestion,
    HOT_NEWS_FALLBACK, NEWS_FEEDS, ACNE_TIPS, FITNESS_TIPS, FITNESS_ROUTINES,
    dailyTip, searchBook, bookDesc
  };
})(window);
