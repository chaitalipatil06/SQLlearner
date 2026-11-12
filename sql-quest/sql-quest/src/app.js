// ===== SQL Quest app =====
(function(){
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KEY = 'sqlquest-v1';
const LEVELS = [[0,"Data Sprout"],[2,"Query Cadet"],[4,"Filter Ranger"],[6,"Join Knight"],[8,"Window Wizard"],[10,"SQL Sage"]];
const PASTELS = ['#ffb8cf','#c6e3ff','#bfeedd','#e1d4ff','#fff1b8','#ffd8c2','#b9a2ff','#7fd8b8','#ff9fc6'];

// ---------- state ----------
let S = { name:"", gems:0, done:{}, quiz:{}, solved:{}, games:{}, tries:{} };
function load(){ try{ const t = localStorage.getItem(KEY); if(t) S = Object.assign(S, JSON.parse(t)); }catch(e){} }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} updateTop(); }
load();
const doneCount = () => CHAPTERS.filter(c => S.done[c.id]).length;
const level = () => { let n = doneCount(), l = LEVELS[0][1]; LEVELS.forEach(([k,v]) => { if(n >= k) l = v; }); return l; };
const chUnlocked = id => id === 1 || !!S.done[id-1];
const gameUnlocked = g => !!S.done[g.after-1] && !!S.done[g.after];
function addGems(n){ S.gems += n; save(); const p = $('#gemPill'); if(p){ p.classList.remove('gem-bump'); void p.offsetWidth; p.classList.add('gem-bump'); } }

// ---------- SVG art ----------
function lumiSVG(cls=''){
  return `<svg class="lumi ${cls}" viewBox="0 0 220 220" aria-label="Lumi the axolotl">
  <defs><radialGradient id="lg-head" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#ffe1ec"/><stop offset="1" stop-color="#ffb3cb"/></radialGradient>
  <radialGradient id="lg-gem" cx="40%" cy="30%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#bfeedd"/><stop offset="1" stop-color="#8cc4ff"/></radialGradient></defs>
  <path d="M150 178 Q200 170 196 140 Q186 160 160 160 Z" fill="#ffa3c2"/>
  <ellipse cx="110" cy="172" rx="48" ry="32" fill="#ffb8cf"/>
  <ellipse cx="110" cy="178" rx="30" ry="20" fill="#ffe4ee"/>
  <g class="gill l" fill="none" stroke="#ff7fae" stroke-width="9" stroke-linecap="round">
    <path d="M44 70 Q22 52 14 40"/><path d="M38 92 Q14 88 4 80"/><path d="M42 114 Q20 122 10 128"/></g>
  <g class="gill l" fill="#ffc6da"><circle cx="14" cy="40" r="7"/><circle cx="4" cy="80" r="7"/><circle cx="10" cy="128" r="7"/></g>
  <g class="gill r" fill="none" stroke="#ff7fae" stroke-width="9" stroke-linecap="round">
    <path d="M176 70 Q198 52 206 40"/><path d="M182 92 Q206 88 216 80"/><path d="M178 114 Q200 122 210 128"/></g>
  <g class="gill r" fill="#ffc6da"><circle cx="206" cy="40" r="7"/><circle cx="216" cy="80" r="7"/><circle cx="210" cy="128" r="7"/></g>
  <ellipse cx="110" cy="96" rx="74" ry="60" fill="url(#lg-head)"/>
  <circle cx="86" cy="52" r="4" fill="#ff9fc0" opacity=".7"/><circle cx="104" cy="44" r="3" fill="#ff9fc0" opacity=".7"/><circle cx="126" cy="50" r="4" fill="#ff9fc0" opacity=".7"/>
  <g class="eye"><ellipse cx="80" cy="94" rx="11" ry="13" fill="#3b3355"/><circle cx="84" cy="89" r="4.5" fill="#fff"/><circle cx="77" cy="99" r="2" fill="#fff"/></g>
  <g class="eye"><ellipse cx="140" cy="94" rx="11" ry="13" fill="#3b3355"/><circle cx="144" cy="89" r="4.5" fill="#fff"/><circle cx="137" cy="99" r="2" fill="#fff"/></g>
  <ellipse cx="62" cy="116" rx="12" ry="7" fill="#ff8fb3" opacity=".45"/><ellipse cx="158" cy="116" rx="12" ry="7" fill="#ff8fb3" opacity=".45"/>
  <path d="M98 118 Q110 130 122 118" fill="none" stroke="#3b3355" stroke-width="4" stroke-linecap="round"/>
  <circle class="gemglow" cx="110" cy="160" r="24" fill="#bfeedd" opacity=".7"/>
  <path d="M110 140 L126 154 L110 178 L94 154 Z" fill="url(#lg-gem)" stroke="#7fb8e8" stroke-width="2"/>
  <path d="M94 154 L126 154 M110 140 L104 154 L110 178 L116 154 Z" fill="none" stroke="#ffffffaa" stroke-width="1.5"/>
  <ellipse cx="88" cy="160" rx="10" ry="8" fill="#ffb8cf"/><ellipse cx="132" cy="160" rx="10" ry="8" fill="#ffb8cf"/>
  </svg>`;
}
function art(kind, c){
  const o = 'stroke="#3b3355" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  const A = {
    table:`<rect x="20" y="30" width="110" height="90" rx="12" fill="#fff" ${o}/><rect x="20" y="30" width="110" height="24" rx="12" fill="${c}" ${o}/><path d="M20 76H130M20 98H130M57 30V120M94 30V120" ${o} fill="none"/><circle cx="118" cy="22" r="10" fill="#ffd966" ${o}/>`,
    columns:`<rect x="18" y="28" width="114" height="94" rx="12" fill="#fff" ${o}/><rect x="56" y="28" width="38" height="94" fill="${c}" ${o}/><path d="M18 52H132M18 76H132M18 100H132" fill="none" ${o}/><path d="M75 8V22M68 16L75 23L82 16" fill="none" ${o}/>`,
    funnel:`<path d="M20 30H130L88 80V118L62 128V80Z" fill="${c}" ${o}/><circle cx="40" cy="18" r="6" fill="#ffb8cf" ${o}/><circle cx="75" cy="14" r="6" fill="#c6e3ff" ${o}/><circle cx="108" cy="20" r="6" fill="#fff1b8" ${o}/><circle cx="75" cy="140" r="6" fill="#c6e3ff" ${o}/>`,
    sort:`<rect x="20" y="96" width="22" height="30" rx="5" fill="#fff" ${o}/><rect x="50" y="76" width="22" height="50" rx="5" fill="${c}" ${o}/><rect x="80" y="52" width="22" height="74" rx="5" fill="#fff" ${o}/><rect x="110" y="24" width="22" height="102" rx="5" fill="${c}" ${o}/><path d="M24 60L60 30M50 30H60V40" fill="none" ${o}/>`,
    groups:`<circle cx="30" cy="30" r="8" fill="#ffb8cf" ${o}/><circle cx="52" cy="22" r="8" fill="#ffb8cf" ${o}/><circle cx="98" cy="24" r="8" fill="#c6e3ff" ${o}/><circle cx="120" cy="32" r="8" fill="#c6e3ff" ${o}/><circle cx="76" cy="40" r="8" fill="#bfeedd" ${o}/><path d="M40 50L40 70M76 56L76 70M110 50L110 70" ${o}/><rect x="26" y="78" width="28" height="48" rx="6" fill="#ffb8cf" ${o}/><rect x="62" y="102" width="28" height="24" rx="6" fill="#bfeedd" ${o}/><rect x="98" y="88" width="28" height="38" rx="6" fill="${c}" ${o}/>`,
    venn:`<circle cx="58" cy="75" r="42" fill="#ffb8cf" fill-opacity=".7" ${o}/><circle cx="94" cy="75" r="42" fill="#c6e3ff" fill-opacity=".7" ${o}/><path d="M76 37A42 42 0 0 1 76 113A42 42 0 0 1 76 37Z" fill="${c}" ${o}/>`,
    switch:`<path d="M75 14L112 50L75 86L38 50Z" fill="${c}" ${o}/><text x="75" y="58" text-anchor="middle" font-size="24" font-weight="800" fill="#3b3355">?</text><path d="M48 76L28 112M102 76L122 112" fill="none" ${o}/><rect x="8" y="112" width="44" height="24" rx="8" fill="#bfeedd" ${o}/><rect x="98" y="112" width="44" height="24" rx="8" fill="#ffb8cf" ${o}/>`,
    nest:`<rect x="14" y="18" width="122" height="114" rx="16" fill="#fff" ${o}/><rect x="32" y="40" width="86" height="76" rx="14" fill="${c}" ${o}/><rect x="52" y="62" width="46" height="34" rx="10" fill="#fff1b8" ${o}/>`,
    window:`<rect x="16" y="20" width="118" height="110" rx="12" fill="#fff" ${o}/><path d="M16 42H134M16 64H134M16 86H134M16 108H134" fill="none" stroke="#d9cfee" stroke-width="2"/><rect x="10" y="38" width="130" height="52" rx="10" fill="${c}" fill-opacity=".55" ${o}/><path d="M144 50V80M138 74L144 82L150 74" fill="none" ${o}/>`,
    trophy:`<path d="M45 20H105V58A30 30 0 0 1 45 58Z" fill="#ffd966" ${o}/><path d="M45 30H28A18 18 0 0 0 46 62M105 30H122A18 18 0 0 1 104 62" fill="none" ${o}/><rect x="66" y="88" width="18" height="18" fill="#ffd966" ${o}/><rect x="46" y="106" width="58" height="20" rx="6" fill="${c}" ${o}/><path d="M75 34L79 44L90 44L81 50L84 60L75 54L66 60L69 50L60 44L71 44Z" fill="#fff"/>`
  };
  return `<svg class="art" viewBox="0 0 150 150">${A[kind]||A.table}</svg>`;
}
function badge(ch){
  return `<svg class="badge" viewBox="0 0 120 120"><path d="M40 84L30 116L48 106L56 118L62 88Z" fill="#ffb8cf" stroke="#3b3355" stroke-width="3"/><path d="M80 84L90 116L72 106L64 118L58 88Z" fill="#c6e3ff" stroke="#3b3355" stroke-width="3"/>
  <circle cx="60" cy="54" r="42" fill="${ch.color}" stroke="#3b3355" stroke-width="4"/><circle cx="60" cy="54" r="32" fill="#fff" stroke="#3b3355" stroke-width="3" stroke-dasharray="4 5"/>
  <text x="60" y="66" text-anchor="middle" font-family="Baloo 2" font-size="34" font-weight="800" fill="#3b3355">${ch.id}</text></svg>`;
}

// ---------- SQL highlight ----------
const KW = new Set('SELECT FROM WHERE AND OR NOT IN IS NULL AS ON JOIN LEFT RIGHT FULL OUTER INNER CROSS GROUP BY ORDER HAVING LIMIT OFFSET DISTINCT CASE WHEN THEN ELSE END WITH ASC DESC BETWEEN LIKE OVER PARTITION EXISTS UNION ALL INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE ROWS PRECEDING CURRENT ROW'.split(' '));
const FN = new Set('COUNT SUM AVG MIN MAX ROUND COALESCE NULLIF UPPER LOWER LENGTH SUBSTR STRFTIME DATE RANK DENSE_RANK ROW_NUMBER LAG LEAD NTILE CAST ABS'.split(' '));
function hl(sql){
  const re = /(--[^\n]*)|('(?:[^']|'')*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]+\b)/g; let out = '', last = 0, m;
  while((m = re.exec(sql))){
    out += esc(sql.slice(last, m.index)); last = re.lastIndex;
    if(m[1]) out += `<span class="c">${esc(m[1])}</span>`;
    else if(m[2]) out += `<span class="s">${esc(m[2])}</span>`;
    else if(m[3]) out += `<span class="n">${m[3]}</span>`;
    else { const u = m[4].toUpperCase(); out += KW.has(u) ? `<span class="k">${m[4]}</span>` : FN.has(u) ? `<span class="f">${m[4]}</span>` : esc(m[4]); }
  }
  return out + esc(sql.slice(last));
}

// ---------- database ----------
let SQL = null, db = null;
const SQLJS_URLS = ['https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/sql-asm.js','https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-asm.js','https://unpkg.com/sql.js@1.10.3/dist/sql-asm.js'];
function loadScript(u){ return new Promise((ok, no) => { const s = document.createElement('script'); s.src = u; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
const dbReady = (async () => {
  for(const u of SQLJS_URLS){ if(window.initSqlJs) break; try{ await loadScript(u); }catch(e){} }
  if(!window.initSqlJs){ toast('Could not load the SQL engine. Check your connection and refresh.'); throw new Error('sql.js not loaded'); }
  SQL = await initSqlJs(); db = new SQL.Database(); db.run(SEED_SQL);
})();
function freshDb(){ const d = new SQL.Database(); d.run(SEED_SQL); return d; }
function runOn(d, sql){ const r = d.exec(sql); return r.length ? r[r.length-1] : null; }
function friendly(msg){
  const m = msg.toLowerCase();
  if(m.includes('no such table')) return "That table doesn't exist. Check the spelling in the Schema list.";
  if(m.includes('no such column')) return "That column doesn't exist in this table. Peek at the Schema list, or check your table alias.";
  if(m.includes('syntax error')) return "Small typo somewhere near the word shown. Check commas, quotes and keyword order.";
  if(m.includes('ambiguous')) return "Two tables share that column name. Prefix it with the table alias, like o.amount.";
  if(m.includes('misuse of aggregate')) return "Aggregates like SUM() belong in SELECT or HAVING, not WHERE.";
  return "Lumi is scratching her head. Read the message and try again!";
}
function renderResult(el, sql){
  if(!db){ el.innerHTML = '<div class="meta">Loading the SQL engine… one moment ✨</div>'; dbReady.then(() => renderResult(el, sql)); return null; }
  try{
    const t0 = performance.now(); const r = runOn(db, sql); const ms = (performance.now()-t0).toFixed(1);
    if(!r){ el.innerHTML = `<div class="result"><div class="meta">✅ Ran fine, but no rows came back (${ms} ms).</div></div>`; return {columns:[],values:[]}; }
    el.innerHTML = `<div class="result"><div class="meta">✨ ${r.values.length} row${r.values.length===1?'':'s'} · ${ms} ms</div>${table(r)}</div>`;
    return r;
  }catch(e){ el.innerHTML = `<div class="result err">🙈 ${esc(e.message)}<br><span style="font-weight:600">Lumi's hint: ${friendly(e.message)}</span></div>`; return null; }
}
function table(r){
  const rows = r.values.slice(0, 200).map(v => '<tr>' + v.map(x => x === null ? '<td class="null">NULL</td>' : `<td>${esc(typeof x === 'number' && !Number.isInteger(x) ? +x.toFixed(4) : x)}</td>`).join('') + '</tr>').join('');
  return `<div class="tblwrap"><table class="res"><tr>${r.columns.map(c => `<th>${esc(c)}</th>`).join('')}</tr>${rows}</table></div>`;
}
function norm(r, ordered){
  if(!r) return null;
  let rows = r.values.map(v => JSON.stringify(v.map(x => x === null ? null : typeof x === 'number' ? Math.round(x*100)/100 : String(x))));
  if(!ordered) rows.sort();
  return { cols: r.columns.length, rows };
}
function checkAnswer(userSql, ch){
  const d1 = freshDb(), d2 = freshDb();
  try{
    const u = norm(runOn(d1, userSql), ch.challenge.ordered), s = norm(runOn(d2, ch.challenge.solution), ch.challenge.ordered);
    if(!u) return { ok:false, msg:"Your query didn't return any rows yet." };
    if(u.cols !== s.cols) return { ok:false, msg:`Expected ${s.cols} column${s.cols>1?'s':''}, you returned ${u.cols}. Check which columns you SELECT.` };
    if(u.rows.length !== s.rows.length) return { ok:false, msg:`Expected ${s.rows.length} rows, you returned ${u.rows.length}. Check your filters or grouping.` };
    if(u.rows.join() !== s.rows.join()) return { ok:false, msg: ch.challenge.ordered ? "Right size, but some values or the order differ. Check sorting and calculations." : "Right size, but some values differ. Check calculations and column order." };
    return { ok:true };
  }catch(e){ return { ok:false, msg: esc(e.message) + ' — ' + friendly(e.message) }; }
  finally{ d1.close(); d2.close(); }
}

// ---------- UI helpers ----------
function confetti(n=90){
  for(let i=0;i<n;i++){ const d = document.createElement('div'); d.className = 'confetti';
    d.style.left = Math.random()*100 + 'vw'; d.style.background = PASTELS[i % PASTELS.length];
    d.style.animationDuration = (2 + Math.random()*2.5) + 's'; d.style.animationDelay = Math.random()*.6 + 's';
    d.style.transform = `rotate(${Math.random()*360}deg)`; document.body.appendChild(d); setTimeout(() => d.remove(), 5500); }
}
function toast(t){ const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 2600); }
function modal(html, onMount){
  const bg = document.createElement('div'); bg.className = 'modal-bg'; bg.innerHTML = `<div class="modal">${html}</div>`;
  bg.addEventListener('click', e => { if(e.target === bg || e.target.closest('[data-close]')) bg.remove(); });
  document.body.appendChild(bg); if(onMount) onMount(bg); return bg;
}
function updateTop(){
  const total = CHAPTERS.length + GAMES.length, got = doneCount() + GAMES.filter(g => S.games[g.id]).length;
  const pct = Math.round(100 * got / total);
  const p = $('#topProgress'); if(p){ p.style.width = pct + '%'; $('#topPct').textContent = pct + '%'; }
  const g = $('#gemCount'); if(g) g.textContent = S.gems;
  const l = $('#lvl'); if(l) l.textContent = level();
}
function codeBlocks(root){
  $$('pre.sql', root).forEach(pre => {
    const sql = pre.textContent.trim(); const box = document.createElement('div'); box.className = 'codebox';
    box.innerHTML = `<pre class="sqlc">${hl(sql)}</pre><button class="trybtn">▶ Try it</button><button class="copybtn">to playground</button><div class="out"></div>`;
    pre.replaceWith(box);
    $('.trybtn', box).onclick = () => renderResult($('.out', box), sql);
    $('.copybtn', box).onclick = () => { const ed = $('#pgEditor'); if(ed){ ed.value = sql; ed.scrollIntoView({behavior:'smooth', block:'center'}); ed.focus(); } };
  });
}
function reveal(root){
  const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.08});
  $$('.reveal', root).forEach(el => io.observe(el));
  setTimeout(() => $$('.reveal', root).forEach(el => el.classList.add('in')), 2500);
}
function schemaHTML(){
  const T = { departments:['dept_id (PK)','dept_name','location'], employees:['emp_id (PK)','name','dept_id (FK)','manager_id (FK → employees)','hire_date','salary'],
    customers:['customer_id (PK)','name','region','signup_date'], products:['product_id (PK)','product_name','category','price'],
    orders:['order_id (PK)','customer_id (FK)','emp_id (FK, sales rep)','product_id (FK)','order_date','quantity','amount','status'] };
  return `<div class="schema"><b>🗂️ Lumi Labs schema</b>${Object.entries(T).map(([t,c]) => `<details open><summary>${t}</summary><ul>${c.map(x => `<li>${x}</li>`).join('')}</ul></details>`).join('')}</div>`;
}
function playground(starter){
  return `<div class="card reveal"><h2 style="margin:0 0 4px">🧪 Playground</h2><p style="margin:0 0 10px;color:var(--muted)">Experiment freely. Nothing you do here can break the lesson data permanently.</p>
  <div class="play"><div><textarea class="editor" id="pgEditor" spellcheck="false">${esc(starter)}</textarea>
  <div class="row"><button class="btn mint small" id="pgRun">▶ Run</button><button class="btn ghost small" id="pgReset">↺ Reset data</button><span class="kbd">Ctrl / ⌘ + Enter to run</span></div><div id="pgOut"></div></div>${schemaHTML()}</div></div>`;
}
function wirePlayground(){
  const ed = $('#pgEditor'); if(!ed) return;
  const run = () => renderResult($('#pgOut'), ed.value);
  $('#pgRun').onclick = run;
  ed.addEventListener('keydown', e => { if((e.ctrlKey || e.metaKey) && e.key === 'Enter'){ e.preventDefault(); run(); } });
  $('#pgReset').onclick = () => { if(db){ db.close(); db = freshDb(); toast('Fresh data restored ✨'); } };
}

// ---------- views ----------
function viewHome(){
  const next = CHAPTERS.find(c => !S.done[c.id]);
  const seq = []; CHAPTERS.forEach(c => { seq.push({t:'c', c}); const g = GAMES.find(g => g.after === c.id); if(g) seq.push({t:'g', g}); });
  const xs = [100,290,480,670,880], ys = [90,320,550];
  const pts = seq.map((s, i) => { const r = Math.floor(i/5), k = i % 5; return [r % 2 ? xs[4-k] : xs[k], ys[r]]; });
  let d = `M${pts[0][0]} ${pts[0][1]}`; for(let i=1;i<pts.length;i++){ const [x0,y0] = pts[i-1], [x1,y1] = pts[i]; d += y0 === y1 ? ` L${x1} ${y1}` : ` C${x0 + (x0 > 500 ? 110 : -110)} ${y0} ${x1 + (x1 > 500 ? 110 : -110)} ${y1} ${x1} ${y1}`; }
  const nodes = seq.map((s, i) => {
    const [x,y] = pts[i];
    if(s.t === 'c'){ const c = s.c, un = chUnlocked(c.id), dn = S.done[c.id], cur = next && next.id === c.id;
      return `<a class="node ${un?'':'locked'} ${cur?'current':''}" style="left:${x/10}%;top:${y}px" href="#ch-${c.id}" title="${esc(c.title)}"><div class="orb" style="background:${c.color}">${c.id}</div>${dn?'<span class="done-star">⭐</span>':''}<div class="t">${esc(c.title)}</div></a>`; }
    const g = s.g, un = gameUnlocked(g), dn = S.games[g.id];
    return `<a class="node chest ${un?'':'locked'}" style="left:${x/10}%;top:${y}px" href="#game-${g.id}" title="${esc(g.title)}"><div class="orb">${dn?'🏆':un?'🎁':'🔒'}</div><div class="t">${esc(g.title)}</div></a>`;
  }).join('');
  const hi = S.name ? `Welcome back, ${esc(S.name)}!` : 'Welcome, adventurer!';
  return `<section class="view">
  <div class="hero"><span class="sparkle" style="top:18px;left:46%">✦</span><span class="sparkle" style="bottom:30px;left:8%;animation-delay:.8s">✧</span><span class="sparkle" style="top:40%;right:6%;animation-delay:1.4s">✦</span>
    <div><div class="kicker" style="font-weight:800;color:#8a6fd1;letter-spacing:1.5px">${hi}</div><h1>SQL Quest<br><span style="font-size:30px;color:#7a5cff">with Lumi the axolotl</span></h1>
    <p>Learn SQL from absolute zero to interview-ready in 10 bite-size chapters. Run real queries in your browser, earn gems and badges, and unlock a brain game every 2 chapters.</p>
    <div class="row"><a class="btn" href="#ch-${next ? next.id : 10}" style="text-decoration:none">${doneCount() ? 'Continue quest →' : 'Start chapter 1 →'}</a><a class="btn ghost" href="#cheatsheet" style="text-decoration:none">📜 Cheat sheet</a></div></div>
    <div class="lumi-wrap">${lumiSVG()}</div></div>
  <div class="statgrid">
    <div class="stat"><div class="n">${doneCount()}/10</div><div class="l">Chapters done</div></div>
    <div class="stat"><div class="n">💎 ${S.gems}</div><div class="l">Gems earned</div></div>
    <div class="stat"><div class="n">${GAMES.filter(g => S.games[g.id]).length}/5</div><div class="l">Games won</div></div>
    <div class="stat"><div class="n" style="font-size:24px">${level()}</div><div class="l">Your rank</div></div></div>
  <div class="card reveal"><h2 style="margin:0">🗺️ Your quest map</h2><p style="color:var(--muted);margin:4px 0 0">Finish chapters in order. Every 2 chapters, a treasure chest opens with a reward game.</p>
    <div class="map"><svg class="path" viewBox="0 0 1000 640" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="#e3d8fb" stroke-width="16" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="2 14" stroke-linecap="round"/></svg>${nodes}</div></div>
  <div class="card reveal"><h2 style="margin:0 0 4px">🎯 Built for the roles you're targeting</h2><p style="color:var(--muted);margin:0 0 14px">Each role leans on different chapters. Outlined chips are chapters you've finished.</p>
    <div class="roles">${ROLES.map(r => `<div class="role" style="background:${r.color}"><h3>${r.name}</h3><p>${r.why}</p><div class="chips">${r.chapters.map(n => `<span class="${S.done[n]?'ok':''}">Ch ${n}</span>`).join('')}</div></div>`).join('')}</div></div>
  <div class="card reveal"><h2 style="margin:0 0 8px">🏅 Badge shelf</h2><div style="display:flex;flex-wrap:wrap;gap:10px">${CHAPTERS.map(c => `<div title="${esc(c.title)}" style="width:76px;opacity:${S.done[c.id]?1:.18};filter:${S.done[c.id]?'none':'grayscale(1)'}">${badge(c).replace('class="badge"','style="width:76px;height:76px"')}</div>`).join('')}</div></div>
  </section>`;
}
function viewChapter(id){
  const c = CHAPTERS.find(x => x.id === id); if(!c) return viewHome();
  const locked = !chUnlocked(id);
  const qd = S.quiz[id] || {}; const qOk = c.quiz.every((_, i) => qd[i] === 'ok'); const sOk = !!S.solved[id];
  const steps = `<div class="steps"><span class="ok">📖 Lesson</span><span class="${qOk?'ok':''}">${qOk?'✅':'❓'} Quiz</span><span class="${sOk?'ok':''}">${sOk?'✅':'🧩'} Challenge</span><span class="${S.done[id]?'ok':''}">${S.done[id]?'⭐ Complete':'⭐ Badge'}</span></div>`;
  const lockNote = locked ? `<div class="card" style="text-align:center;background:#fff8e6"><b>🔒 Lumi suggests finishing Chapter ${id-1} first.</b> You can still peek, but the chapters build on each other.</div>` : '';
  return `<section class="view">
  <div class="ch-head" style="background:linear-gradient(135deg,${c.color},#ffffff)">${art(c.art, c.color)}<div><div class="kicker">Chapter ${c.id} of 10</div><h1>${esc(c.title)}</h1><div class="sub">${esc(c.sub)}</div>${steps}</div></div>
  ${lockNote}
  <div class="card reveal speech">${lumiSVG('sm')}<div class="bubble">${c.lumi}</div></div>
  <div class="card reveal roletip">💼 <b>Why this matters for your job hunt:</b> ${c.roleTip}</div>
  ${c.sections.map((s, i) => `<div class="card section reveal"><h2><span class="num" style="background:${c.color}">${i+1}</span>${esc(s.h)}</h2>${s.html}</div>`).join('')}
  ${playground(c.sections.length ? '-- Try anything here!\nSELECT * FROM employees LIMIT 5;' : '')}
  <div class="card reveal" id="quiz"><h2 style="margin:0">❓ Quick quiz</h2><p style="color:var(--muted);margin:4px 0 0">Get all ${c.quiz.length} right to unlock the badge. +10 💎 each on the first try.</p>
    ${c.quiz.map((q, i) => `<div class="q" data-i="${i}"><div class="qt">${i+1}. ${esc(q.q)}</div><div class="opts">${q.opts.map((o, j) => `<button class="opt ${qd[i]==='ok' && j===q.a ? 'right':''}" data-j="${j}">${esc(o)}</button>`).join('')}</div><div class="why">${qd[i]==='ok' ? '💡 ' + esc(q.why) : ''}</div></div>`).join('')}</div>
  <div class="card challenge reveal" id="challenge"><h2 style="margin:0 0 6px">🧩 Challenge ${sOk ? '<span style="color:#2a9d74">— solved!</span>' : ''}</h2><p style="font-size:17px">${c.challenge.prompt}</p>
    <textarea class="editor" id="chEditor" spellcheck="false">${esc(S.tries['code'+id] || c.challenge.starter)}</textarea>
    <div class="row"><button class="btn mint small" id="chRun">▶ Run</button><button class="btn small" id="chCheck">✓ Check answer</button><button class="btn ghost small" id="chHint">💡 Hint</button><button class="btn ghost small" id="chSol" style="display:${(S.tries[id]||0) >= 2 ? 'inline-block':'none'}">👀 Show solution</button></div>
    <div id="chMsg" style="margin-top:10px;font-weight:800"></div><div id="chOut"></div></div>
  <div class="card complete-bar reveal" id="completeBar"></div>
  <div class="row" style="justify-content:space-between">${id>1?`<a class="btn ghost small" href="#ch-${id-1}" style="text-decoration:none">← Chapter ${id-1}</a>`:'<span></span>'}${id<10?`<a class="btn ghost small" href="#ch-${id+1}" style="text-decoration:none">Chapter ${id+1} →</a>`:''}</div>
  </section>`;
}
function wireChapter(id){
  const c = CHAPTERS.find(x => x.id === id); if(!c) return;
  codeBlocks($('main')); wirePlayground();
  // quiz
  $$('#quiz .q').forEach(qEl => {
    const i = +qEl.dataset.i, q = c.quiz[i];
    $$('.opt', qEl).forEach(b => b.onclick = () => {
      const qd = S.quiz[id] = S.quiz[id] || {}; if(qd[i] === 'ok') return;
      const j = +b.dataset.j;
      if(j === q.a){ b.classList.add('right'); $('.why', qEl).textContent = '💡 ' + q.why; if(!qd[i]) addGems(10); qd[i] = 'ok'; save(); refreshComplete(c); }
      else { b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); qd[i] = 'tried'; save(); $('.why', qEl).textContent = 'Not quite. Lumi believes in you. Try another!'; }
    });
  });
  // challenge
  const ed = $('#chEditor');
  ed.addEventListener('input', () => { S.tries['code'+id] = ed.value; save(); });
  ed.addEventListener('keydown', e => { if((e.ctrlKey || e.metaKey) && e.key === 'Enter'){ e.preventDefault(); $('#chCheck').click(); } });
  $('#chRun').onclick = () => renderResult($('#chOut'), ed.value);
  $('#chHint').onclick = () => { $('#chMsg').innerHTML = `💡 <span style="font-weight:700">${esc(c.challenge.hint)}</span>`; };
  $('#chSol').onclick = () => { ed.value = c.challenge.solution.replace(/ (FROM|WHERE|JOIN|GROUP BY|ORDER BY|HAVING)/g, '\n$1'); $('#chMsg').innerHTML = '👀 Here is one solution. Run it and see why it works!'; };
  $('#chCheck').onclick = async () => {
    await dbReady; renderResult($('#chOut'), ed.value);
    const r = checkAnswer(ed.value, c);
    if(r.ok){ $('#chMsg').innerHTML = '<span style="color:#2a9d74">🎉 Correct! Lumi is doing a happy wiggle.</span>'; if(!S.solved[id]){ S.solved[id] = true; addGems(50); confetti(40); } save(); refreshComplete(c); }
    else { S.tries[id] = (S.tries[id]||0) + 1; save(); $('#chMsg').innerHTML = `<span style="color:#c0566e">🤔 ${r.msg}</span>`; if(S.tries[id] >= 2) $('#chSol').style.display = 'inline-block'; }
  };
  refreshComplete(c);
}
function refreshComplete(c){
  const bar = $('#completeBar'); if(!bar) return;
  const qd = S.quiz[c.id] || {}; const qOk = c.quiz.every((_, i) => qd[i] === 'ok'); const sOk = !!S.solved[c.id];
  if(S.done[c.id]){ bar.innerHTML = `<div style="width:90px;margin:auto">${badge(c)}</div><h2 style="margin:6px 0">Chapter complete!</h2><a class="btn" href="#${c.id<10?'ch-'+(c.id+1):'game-5'}" style="text-decoration:none">${c.id<10?'Next chapter →':'Play the final game →'}</a>`; return; }
  bar.innerHTML = `<h2 style="margin:0 0 6px">${qOk && sOk ? 'Ready to claim your badge!' : 'Finish the quiz and challenge to earn your badge'}</h2><p style="color:var(--muted)">${qOk?'✅':'⬜'} Quiz &nbsp; ${sOk?'✅':'⬜'} Challenge</p><button class="btn" id="claim" ${qOk && sOk ? '' : 'disabled'}>⭐ Complete chapter (+100 💎)</button>`;
  const b = $('#claim'); if(b) b.onclick = () => completeChapter(c);
}
function completeChapter(c){
  S.done[c.id] = true; addGems(100); save(); confetti();
  const g = GAMES.find(g => g.after === c.id);
  modal(`${badge(c)}<h2>Badge earned!</h2><p>You finished <b>${esc(c.title)}</b>. Your rank: <b>${level()}</b></p>
    ${g ? `<p style="font-size:18px">🎁 <b>A treasure chest opened!</b><br>You unlocked the game <b>${esc(g.title)}</b>.</p><a class="btn" href="#game-${g.id}" data-close style="text-decoration:none">Play ${esc(g.title)} →</a>` :
      `<a class="btn" href="#ch-${c.id+1}" data-close style="text-decoration:none">Next chapter →</a>`}
    <div style="margin-top:12px"><button class="btn ghost small" data-close>Stay here</button></div>`);
  refreshComplete(c);
}

// ---------- games ----------
function viewGame(id){
  const g = GAMES.find(x => x.id === id); if(!g) return viewHome();
  if(!gameUnlocked(g)) return `<section class="view"><div class="card lockmsg">${lumiSVG('sm')}<h2>🔒 This treasure chest is still locked</h2><p>Finish chapters ${g.after-1} and ${g.after} to open <b>${esc(g.title)}</b>.</p><a class="btn" href="#ch-${S.done[g.after-1] ? g.after : g.after-1}" style="text-decoration:none">Go to the chapter →</a></div></section>`;
  return `<section class="view"><div class="card" style="background:linear-gradient(135deg,#fff3c4,#ffe0ef)"><div class="game-head">${lumiSVG('sm')}<div><div class="kicker" style="font-weight:800;color:#8a6fd1">🎁 Reward game ${g.id} of 5</div><h1 style="margin:0;font-size:38px">${esc(g.title)}</h1><p style="margin:4px 0 0;font-size:17px">${esc(g.desc)}</p></div></div></div><div class="card" id="gameArea"></div></section>`;
}
function winGame(g, scoreText){
  const first = !S.games[g.id]; S.games[g.id] = { done:true, score:scoreText }; if(first) addGems(150); save(); confetti(120);
  if(g.id === 5) return showCert(scoreText);
  modal(`<div style="font-size:70px;animation:pop .6s">🏆</div><h2>You won ${esc(g.title)}!</h2><p>${esc(scoreText)}${first?'<br><b>+150 💎</b>':''}</p><a class="btn" href="#ch-${Math.min(g.after+1,10)}" data-close style="text-decoration:none">Back to learning →</a><div style="margin-top:10px"><button class="btn ghost small" data-close id="again">Play again</button></div>`,
    bg => { $('#again', bg).onclick = () => route(); });
}
function shuffle(a){ a = a.slice(); for(let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }
function gameMemory(g, el){
  const cards = shuffle(g.pairs.flatMap((p, i) => [{t:p[0], k:i, kw:true},{t:p[1], k:i}]));
  let open = [], matched = 0, flips = 0, busy = false;
  el.innerHTML = `<div class="row" style="justify-content:space-between;margin:0"><b>Flips: <span id="flips">0</span></b><b>Pairs: <span id="pairs">0</span>/${g.pairs.length}</b></div><div class="memgrid">${cards.map((c, i) => `<div class="mcard" data-i="${i}"><div class="face front">✦</div><div class="face back ${c.kw?'mono':''}" style="${c.kw?'color:#7a3fd1;font-size:17px':''}">${esc(c.t)}</div></div>`).join('')}</div>`;
  $$('.mcard', el).forEach(m => m.onclick = () => {
    if(busy || m.classList.contains('flip') || m.classList.contains('matched')) return;
    m.classList.add('flip'); open.push(m); flips++; $('#flips').textContent = flips;
    if(open.length === 2){ const [a,b] = open, ca = cards[a.dataset.i], cb = cards[b.dataset.i];
      if(ca.k === cb.k){ a.classList.add('matched'); b.classList.add('matched'); open = []; matched++; $('#pairs').textContent = matched; if(matched === g.pairs.length) setTimeout(() => winGame(g, `Solved in ${flips} flips (perfect is 16).`), 600); }
      else { busy = true; setTimeout(() => { a.classList.remove('flip'); b.classList.remove('flip'); open = []; busy = false; }, 900); } }
  });
}
function gameOrder(g, el){
  let round = 0, mistakes = 0;
  const draw = () => {
    const parts = g.rounds[round], sh = shuffle(parts.map((p, i) => ({p, i}))); let nextI = 0;
    el.innerHTML = `<div class="row" style="justify-content:space-between;margin:0"><b>Query ${round+1} of ${g.rounds.length}</b><b>Oops count: ${mistakes}</b></div><div class="built" id="built"><span style="color:#9a92b8">-- tap the clauses in order…</span></div><div class="tokens">${sh.map(t => `<button class="token" data-i="${t.i}">${esc(t.p)}</button>`).join('')}</div>`;
    $$('.token', el).forEach(b => b.onclick = () => {
      if(+b.dataset.i === nextI){ if(nextI === 0) $('#built').innerHTML = ''; b.classList.add('used'); $('#built').insertAdjacentHTML('beforeend', `<div>${hl(parts[nextI])}</div>`); nextI++;
        if(nextI === parts.length){ round++; setTimeout(() => round < g.rounds.length ? (toast('Query rebuilt! ✨'), draw()) : winGame(g, `All ${g.rounds.length} queries rebuilt with ${mistakes} oops.`), 700); } }
      else { mistakes++; b.style.animation = 'none'; void b.offsetWidth; b.style.animation = 'shake .4s'; b.style.borderColor = '#ffb3b3'; setTimeout(() => b.style.borderColor = '', 500); $('b:last-child', el).textContent = 'Oops count: ' + mistakes; }
    });
  };
  draw();
}
function gameJoin(g, el){
  let round = 0, score = 0;
  const tbl = t => `<table><caption style="font-weight:800;padding:4px">${t.name}</caption><tr>${t.cols.map(c => `<th>${c}</th>`).join('')}</tr>${t.rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</table>`;
  const draw = () => {
    const r = g.rounds[round];
    el.innerHTML = `<div class="row" style="justify-content:space-between;margin:0"><b>Case ${round+1} of ${g.rounds.length}</b><b>Score: ${score}</b></div><div class="jtables">${tbl(g.left)}${tbl(g.right)}</div>
      <h3 style="font-size:22px;margin:8px 0">🔎 How many rows does <span class="mono" style="color:#7a3fd1">${esc(r.q)}</span> return?</h3>
      <div class="row"><input class="bigin" id="jin" type="number" min="0"><button class="btn small" id="jgo">Check</button></div><div id="jmsg" style="margin-top:10px;font-weight:800"></div>`;
    $('#jin').focus(); $('#jin').onkeydown = e => { if(e.key === 'Enter') $('#jgo').click(); };
    $('#jgo').onclick = () => { const v = +$('#jin').value, ok = v === r.a; if(ok) score++;
      $('#jmsg').innerHTML = `${ok ? '✅ Correct!' : `❌ It's ${r.a}.`} <span style="font-weight:600">${esc(r.why)}</span><br><button class="btn small" id="jnext" style="margin-top:10px">${round+1 < g.rounds.length ? 'Next case →' : 'Finish'}</button>`;
      $('#jgo').disabled = true; $('#jnext').onclick = () => { round++; round < g.rounds.length ? draw() : winGame(g, `Detective score: ${score} / ${g.rounds.length}.`); }; };
  };
  draw();
}
function gameTeaser(g, el){
  let round = 0, score = 0, tries = 0;
  const draw = () => {
    const r = g.rounds[round]; tries = 0;
    el.innerHTML = `<div class="row" style="justify-content:space-between;margin:0"><b>Teaser ${round+1} of ${g.rounds.length}</b><b>Solved: ${score}</b></div>
      <div style="display:flex;gap:16px;align-items:center;margin-top:12px"><div style="font-size:56px;animation:bob 3s infinite">🧠</div><h3 style="font-size:21px;margin:0;line-height:1.4">${esc(r.q)}</h3></div>
      <div class="row"><input class="bigin" id="tin" placeholder="?"><button class="btn small" id="tgo">Answer</button><button class="btn ghost small" id="tskip" style="display:none">Reveal</button></div><div id="tmsg" style="margin-top:10px;font-weight:800"></div>`;
    $('#tin').focus(); $('#tin').onkeydown = e => { if(e.key === 'Enter') $('#tgo').click(); };
    const next = () => { $('#tgo').disabled = true; $('#tmsg').insertAdjacentHTML('beforeend', `<br><button class="btn small" id="tnext" style="margin-top:10px">${round+1 < g.rounds.length ? 'Next teaser →' : 'Finish'}</button>`); $('#tnext').onclick = () => { round++; round < g.rounds.length ? draw() : winGame(g, `You cracked ${score} of ${g.rounds.length} teasers.`); }; };
    $('#tgo').onclick = () => { const v = $('#tin').value.replace(/[^0-9.]/g, '');
      if(v === r.a){ score++; $('#tmsg').innerHTML = `✅ Brilliant! <span style="font-weight:600">${esc(r.why)}</span>`; next(); }
      else { tries++; $('#tmsg').innerHTML = tries === 1 ? '🤔 Not quite. Slow down and try once more!' : '🤔 Still not it. Try again or reveal the answer.'; if(tries >= 2) $('#tskip').style.display = 'inline-block'; } };
    $('#tskip').onclick = () => { $('#tmsg').innerHTML = `💡 Answer: <b>${r.a}</b>. <span style="font-weight:600">${esc(r.why)}</span>`; $('#tskip').style.display = 'none'; next(); };
  };
  draw();
}
function gameBlitz(g, el){
  el.innerHTML = `<div style="text-align:center"><p style="font-size:18px">20 statements, 60 seconds. Ready?</p><button class="btn" id="bgo">⚡ Start the blitz</button></div>`;
  $('#bgo').onclick = () => {
    const items = shuffle(g.items); let i = 0, score = 0, t = 60;
    el.innerHTML = `<div class="row" style="justify-content:space-between;margin:0"><b>⏱️ <span id="bt">60</span>s</b><b>Score: <span id="bs">0</span></b></div><div class="timer" style="margin:10px 0"><i id="bar" style="width:100%"></i></div><div class="blitz-q" id="bq"></div><div class="row" style="justify-content:center"><button class="btn mint" id="bT" style="min-width:140px">✔ True</button><button class="btn" id="bF" style="min-width:140px">✘ False</button></div><div id="bfb" style="text-align:center;font-weight:800;margin-top:10px;min-height:24px"></div>`;
    const show = () => { $('#bq').textContent = items[i][0]; $('#bq').style.animation = 'none'; void $('#bq').offsetWidth; $('#bq').style.animation = 'fadeUp .3s'; };
    const end = () => { clearInterval(tm); winGame(g, `Blitz score: ${score} / ${items.length}.`); };
    const ans = v => { if(i >= items.length) return; const ok = v === items[i][1]; if(ok) score++; $('#bs').textContent = score; $('#bfb').textContent = ok ? '✅ Yes!' : '❌ Nope'; i++; i < items.length ? show() : end(); };
    $('#bT').onclick = () => ans(true); $('#bF').onclick = () => ans(false);
    const tm = setInterval(() => { t--; const bt = $('#bt'); if(!bt){ clearInterval(tm); return; } bt.textContent = t; $('#bar').style.width = (t/60*100) + '%'; if(t <= 0) end(); }, 1000);
    show();
  };
}
function showCert(scoreText){
  const name = S.name || 'SQL Adventurer'; const date = new Date().toLocaleDateString(undefined, {year:'numeric', month:'long', day:'numeric'});
  $('main').innerHTML = `<section class="view"><div class="cert card">${lumiSVG('sm')}<div class="kicker" style="font-weight:800;color:#8a6fd1;letter-spacing:2px">CERTIFICATE OF COMPLETION</div><h1>${esc(name)}</h1><p style="font-size:18px">completed all 10 chapters of <b>SQL Quest</b>, from SELECT to window functions, and earned the rank of <b>SQL Sage</b>.</p><p>💎 ${S.gems} gems · 🏅 10 badges · ${esc(scoreText)}</p><p style="color:var(--muted)">${date}</p><div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap">${CHAPTERS.map(c => `<div style="width:56px">${badge(c).replace('class="badge"','style="width:56px;height:56px"')}</div>`).join('')}</div></div>
  <div class="card"><h2 style="margin:0">What next?</h2><ul><li>Practice daily on <a href="https://datalemur.com" target="_blank" rel="noopener">DataLemur</a> or <a href="https://leetcode.com/problemset/database/" target="_blank" rel="noopener">LeetCode SQL</a>.</li><li>Install PostgreSQL and load a public dataset you care about.</li><li>Revisit Chapter 10 and explain each report out loud, as you would in an interview.</li></ul><a class="btn" href="#home" style="text-decoration:none">Back to the map</a></div></section>`;
  confetti(160);
}
function wireGame(id){
  const g = GAMES.find(x => x.id === id), el = $('#gameArea'); if(!g || !el) return;
  ({memory:gameMemory, order:gameOrder, join:gameJoin, teaser:gameTeaser, blitz:gameBlitz})[g.kind](g, el);
}
function viewCheat(){
  const blocks = [
    ["The query skeleton", "SELECT col, AGG(col) AS alias\nFROM table1 t1\nJOIN table2 t2 ON t2.key = t1.key\nWHERE row_condition\nGROUP BY col\nHAVING AGG(col) > 10\nORDER BY alias DESC\nLIMIT 10;"],
    ["Filters", "WHERE a = 1 AND (b = 'x' OR b = 'y')\nWHERE col IN ('A', 'B')\nWHERE d BETWEEN '2025-01-01' AND '2025-12-31'\nWHERE name LIKE 'A%'\nWHERE col IS NULL"],
    ["Aggregates", "COUNT(*), COUNT(DISTINCT col), SUM(col), AVG(col), MIN(col), MAX(col)"],
    ["Joins", "FROM a JOIN b ON b.id = a.b_id        -- matches only\nFROM a LEFT JOIN b ON b.id = a.b_id   -- all of a\n-- anti-join: LEFT JOIN ... WHERE b.id IS NULL"],
    ["CASE & NULLs", "CASE WHEN x > 10 THEN 'big' ELSE 'small' END\nCOALESCE(col, 'n/a')\nx / NULLIF(y, 0)"],
    ["CTE", "WITH step1 AS (SELECT ...),\n     step2 AS (SELECT ... FROM step1)\nSELECT * FROM step2;"],
    ["Window functions", "ROW_NUMBER() OVER (PARTITION BY grp ORDER BY val DESC)\nRANK() / DENSE_RANK() OVER (ORDER BY val DESC)\nSUM(val) OVER (ORDER BY dt)            -- running total\nLAG(val) OVER (ORDER BY dt)            -- previous row"]
  ];
  return `<section class="view"><div class="ch-head" style="background:linear-gradient(135deg,#e1d4ff,#fff)">${art('nest','#e1d4ff')}<div><div class="kicker">Reference</div><h1>Cheat sheet</h1><div class="sub">Everything from the course on one page. Try any of it in the playground at the bottom.</div></div></div>
  <div class="card cheat"><h2 style="margin:0 0 8px">⏱️ The order SQL runs in</h2><div class="order-strip"><span>FROM</span><span>WHERE</span><span>GROUP BY</span><span>HAVING</span><span>SELECT</span><span>ORDER BY</span><span>LIMIT</span></div></div>
  ${blocks.map(([h, s]) => `<div class="card cheat reveal"><h2 style="margin:0 0 8px">${h}</h2><pre class="sqlc">${hl(s)}</pre></div>`).join('')}
  ${playground('SELECT * FROM orders LIMIT 10;')}</section>`;
}

// ---------- router ----------
function route(){
  const h = (location.hash || '#home').slice(1); const main = $('main'); let html, after = null;
  let m;
  if((m = h.match(/^ch-(\d+)$/))){ const id = +m[1]; html = viewChapter(id); after = () => wireChapter(id); }
  else if((m = h.match(/^game-(\d+)$/))){ const id = +m[1]; html = viewGame(id); after = () => wireGame(id); }
  else if(h === 'cheatsheet'){ html = viewCheat(); after = () => wirePlayground(); }
  else html = viewHome();
  main.innerHTML = html; window.scrollTo({top:0});
  $$('.nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + h || (h.startsWith('ch-') && a.dataset.k === 'learn')));
  if(after) after(); reveal(main); updateTop();
}
window.addEventListener('hashchange', route);

// ---------- settings / welcome ----------
function settings(){
  modal(`<h2>⚙️ Your progress</h2><p>Progress saves in this browser. Copy this code to move it to another device or keep a backup.</p>
    <textarea id="bk" readonly>${btoa(unescape(encodeURIComponent(JSON.stringify(S))))}</textarea>
    <div class="row" style="justify-content:center"><button class="btn small" id="cp">Copy code</button></div>
    <p style="margin-top:16px">Restore from a code:</p><textarea id="rs" placeholder="Paste a backup code here"></textarea>
    <div class="row" style="justify-content:center"><button class="btn mint small" id="rsgo">Restore</button><button class="btn ghost small" id="rename">Change name</button><button class="btn ghost small" id="wipe">Reset everything</button></div><div id="sm" style="font-weight:800;margin-top:8px"></div>`, bg => {
    $('#cp', bg).onclick = async () => { try{ await navigator.clipboard.writeText($('#bk', bg).value); $('#sm', bg).textContent = 'Copied!'; }catch(e){ $('#bk', bg).select(); $('#sm', bg).textContent = 'Select the text above and copy it.'; } };
    $('#rsgo', bg).onclick = () => { try{ S = Object.assign({name:"",gems:0,done:{},quiz:{},solved:{},games:{},tries:{}}, JSON.parse(decodeURIComponent(escape(atob($('#rs', bg).value.trim()))))); save(); bg.remove(); route(); toast('Progress restored!'); }catch(e){ $('#sm', bg).textContent = "That code didn't work."; } };
    $('#rename', bg).onclick = () => { bg.remove(); welcome(); };
    let armed = false; $('#wipe', bg).onclick = e => { if(!armed){ armed = true; e.target.textContent = 'Tap again to confirm'; return; } S = {name:S.name,gems:0,done:{},quiz:{},solved:{},games:{},tries:{}}; save(); bg.remove(); route(); toast('Fresh start!'); };
  });
}
function welcome(){
  modal(`${lumiSVG('sm')}<h2>Hi, I'm Lumi! 👋</h2><p>I'll be your guide through SQL Quest. What should I call you?</p><input id="nm" class="bigin" style="width:100%;font-size:20px" placeholder="Your name" value="${esc(S.name)}"><div class="row" style="justify-content:center"><button class="btn" id="go">Let's go!</button></div>`, bg => {
    const go = () => { S.name = $('#nm', bg).value.trim().slice(0, 40); save(); bg.remove(); route(); };
    $('#go', bg).onclick = go; $('#nm', bg).onkeydown = e => { if(e.key === 'Enter') go(); }; setTimeout(() => $('#nm', bg).focus(), 50);
  });
}

// ---------- boot ----------
document.addEventListener('DOMContentLoaded', () => {
  const b = $('.bubbles'); for(let i=0;i<18;i++){ const s = document.createElement('span'); const z = 10 + Math.random()*40; s.style.width = s.style.height = z + 'px'; s.style.left = Math.random()*100 + '%'; s.style.animationDuration = (14 + Math.random()*18) + 's'; s.style.animationDelay = (-Math.random()*20) + 's'; b.appendChild(s); }
  $('#settingsBtn').onclick = settings;
  route();
  if(!S.name) setTimeout(welcome, 500);
});
})();
