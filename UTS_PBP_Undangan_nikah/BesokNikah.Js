/* ==========================================================
   KONFIGURASI: edit data di sini saja
   ========================================================== */
const CONFIG = {
  groom: { nick:'Aether',  full:'Aether Traveler, S.T.',  parents:'Putra dari Bapak Primodial &amp; Ibu Sri Celestia', photo:'Aether icon.jpg' },
  bride: { nick:'Furina', full:'Furina De Fontaine, S.Pd.',  parents:'Putri dari Bapak Darmawan &amp; Ibu Lestari',  photo:'Furina icon.jpg' },
  weddingDate:'2027-01-16T08:00:00+07:00',   // acuan hitung mundur
  city:'Surabaya',
  story:[
    { date:'2019', title:'Pertama bertemu', text:'Berawal dari satu kelas yang sama dan obrolan yang tak pernah habis.' },
    { date:'2022', title:'Memilih berjalan bersama', text:'Setelah tiga tahun saling mengenal, kami memutuskan melangkah lebih serius.' },
    { date:'2026', title:'Lamaran', text:'Dua keluarga bertemu, doa dipanjatkan, dan tanggal pun ditetapkan.' },
    { date:'16 Januari 2027', title:'Hari bahagia', text:'Kami mengundang Anda menjadi saksi awal perjalanan baru kami.' }
  ],
  events:[
    { title:'Akad nikah', start:'2027-01-16T08:00:00+07:00', end:'2027-01-16T10:00:00+07:00',
      place:'Masjid Al-Akbar', address:'Jl. Masjid Al-AkbarTimur No.1, Pagesangan, Kec. Jambangan, Surabaya', map:'https://maps.app.goo.gl/E31scoSGT51z4Bqj9' },
    { title:'Resepsi', start:'2027-01-17T11:00:00+07:00', end:'2027-01-17T14:00:00+07:00',
      place:'Grand City Convention Dan Exhibition', address:'Jl. Gubeng Pojok No.1, Ketabang, Kec. Genteng, Surabaya,', map:'https://maps.app.goo.gl/7eh1GBrbhphHfdom8' }
  ],
  gallery:[
    'Gambar 1.jpg', 'Gambar 2.jpg', 'Gambar 3.jpg', 'Gambar 4.jpg', 'Gambar 5.jpg', 'Gambar 6.jpg'
  ],
  banks:[
    { bank:'Bank BCA',     no:'1234 5678 90', owner:'a.n. Aether Traveler' },
    { bank:'Bank Mandiri', no:'0987 6543 21', owner:'a.n. Furina De Fontaine' }
  ],
  whatsapp:'6281234567890',   // nomor tujuan RSVP (format 62..., tanpa +)
  music:'wave to earth - wave to earth - love. (Official Lyric Video).mp3'     // Nama file lagu Anda
};

/* ==========================================================
   HELPER
   ========================================================== */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const el = (tag, props={}, kids=[]) => {
  const n = Object.assign(document.createElement(tag), props);
  kids.forEach(k => n.append(k));
  return n;
};
const fmtDate = (d, o) => new Intl.DateTimeFormat('id-ID', Object.assign({timeZone:'Asia/Jakarta'}, o)).format(new Date(d));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================
   ISI KONTEN DARI CONFIG
   ========================================================== */
const g = CONFIG.groom, b = CONFIG.bride;
const initials = `${g.nick[0]} & ${b.nick[0]}`;
$('#mono').textContent = initials;
$('#coverNames').textContent = `${g.nick} & ${b.nick}`;
$('#footNames').textContent = `${g.nick} & ${b.nick} · ${fmtDate(CONFIG.weddingDate,{day:'numeric',month:'long',year:'numeric'})}`;
document.title = `Undangan Pernikahan ${g.nick} & ${b.nick}`;

// nama tamu dari ?to=Nama+Tamu
const guest = new URLSearchParams(location.search).get('to');
if (guest) $('#guest').textContent = guest.slice(0, 60);

// hero: nama dipecah per huruf untuk animasi
['groom','bride'].forEach((k, idx) => {
  const row = $(`[data-name="${k}"]`);
  const word = CONFIG[k].nick;
  [...word].forEach((c, i) => {
    row.append(el('span', { className:'ch', textContent:c }));
  });
});
let i = 0;
$$('.names .ch').forEach(c => c.style.setProperty('--i', i++));

$('#heroDate').textContent = fmtDate(CONFIG.weddingDate, { weekday:'long', day:'numeric', month:'long', year:'numeric' });
$('#heroPlace').textContent = CONFIG.city;

// kartu mempelai
function person(node, p, role){
  const ph = el('div', { className:'photo' });
  if (p.photo) ph.append(el('img', { src:p.photo, alt:`Foto ${p.nick}`, loading:'lazy' }));
  else ph.append(el('span', { className:'ini', textContent:p.nick[0] }));
  node.append(ph, el('h3', { textContent:p.nick }), el('p', { className:'full', textContent:p.full }));
  node.append(el('p', { className:'par', innerHTML:p.parents }));
}
person($('#pGroom'), g); person($('#pBride'), b);

// kartu acara
function gcalLink(e){
  const f = d => new Date(d).toISOString().replace(/[-:]|\.\d{3}/g,'');
  const q = new URLSearchParams({ action:'TEMPLATE', text:`${e.title} ${g.nick} & ${b.nick}`,
    dates:`${f(e.start)}/${f(e.end)}`, location:`${e.place}, ${e.address}` });
  return 'https://calendar.google.com/calendar/render?' + q;
}
CONFIG.events.forEach((e, n) => {
  const c = el('article', { className:'card rv' });
  c.style.setProperty('--d', n * .15 + 's');
  c.append(
    el('h3', { textContent:e.title }),
    el('p', { className:'when', textContent:fmtDate(e.start,{weekday:'long',day:'numeric',month:'long',year:'numeric'}) }),
    el('p', { className:'time', textContent:`${fmtDate(e.start,{hour:'2-digit',minute:'2-digit',hour12:false}).replace(':','.')} – ${fmtDate(e.end,{hour:'2-digit',minute:'2-digit',hour12:false}).replace(':','.')} WIB` }),
    el('p', { className:'where' }, [ el('b', { textContent:e.place }), e.address ]),
    el('div', { className:'actions' }, [
      el('a', { className:'btn', href:e.map, target:'_blank', rel:'noopener', textContent:'Lihat lokasi' }),
      el('a', { className:'btn', href:gcalLink(e), target:'_blank', rel:'noopener', textContent:'Simpan ke kalender' })
    ])
  );
  $('#cards').append(c);
});

// galeri (6 petak; placeholder jika foto belum diisi)
const heartSvg = '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
for (let k = 0; k < 6; k++){
  const url = CONFIG.gallery[k];
  const t = el('button', { className:'tile', type:'button', ariaLabel:`Foto ${k+1}` });
  if (url){
    t.append(el('img', { src:url, alt:`Foto kenangan ${k+1}`, loading:'lazy' }));
    t.addEventListener('click', () => { $('#lbImg').src = url; $('#lightbox').classList.add('on'); });
  } else {
    t.append(el('span', { className:'ph', innerHTML:heartSvg }));
    t.style.cursor = 'default';
  }
  $('#mosaic').append(t);
}
const closeLb = () => $('#lightbox').classList.remove('on');
$('#lbClose').addEventListener('click', closeLb);
$('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') closeLb(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

// rekening + salin
CONFIG.banks.forEach(bk => {
  const btn = el('button', { className:'btn', type:'button', textContent:'Salin nomor' });
  btn.addEventListener('click', async () => {
    const num = bk.no.replace(/\s/g,'');
    try { await navigator.clipboard.writeText(num); }
    catch { const t = el('textarea', { value:num }); document.body.append(t); t.select(); document.execCommand('copy'); t.remove(); }
    btn.textContent = 'Tersalin'; setTimeout(() => btn.textContent = 'Salin nomor', 1800);
  });
  $('#banks').append(el('div', { className:'bank' }, [
    el('div', { className:'name', textContent:bk.bank }),
    el('div', { className:'no', textContent:bk.no }),
    el('div', { className:'own', textContent:bk.owner }),
    btn
  ]));
});

/* ==========================================================
   BUKA UNDANGAN (gerbang terbelah)
   ========================================================== */
/* ---------- poles tambahan ---------- */
// pembatas ornamen di atas setiap judul bagian
$$('.head').forEach(h => h.prepend(el('div', { className:'divider', ariaHidden:'true' }, [ el('i') ])));

// timeline cerita
CONFIG.story.forEach(s => {
  $('#tl').append(el('li', { className:'rv' }, [
    el('span', { className:'d', textContent:s.date }),
    el('h3', { textContent:s.title }),
    el('p', { textContent:s.text })
  ]));
});

// bintang berkelip di hero
(function(){
  const box = $('#stars'), n = innerWidth < 700 ? 40 : 90;
  for (let k = 0; k < n; k++){
    const s = el('span', { className:'star' });
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--t:${2 + Math.random()*4}s;--dl:${Math.random()*4}s;--sz:${1 + Math.random()*2}px`;
    box.append(s);
  }
})();

// mandala: dua lapis cincin kelopak yang berputar berlawanan arah
(function(){
  const NS = 'http://www.w3.org/2000/svg';
  function ring(cls, petals, rx, ry, cy, circles){
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 500 500'); svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '.6');
    if (cls) svg.setAttribute('class', cls);
    for (let i = 0; i < petals; i++){
      const e = document.createElementNS(NS, 'ellipse');
      e.setAttribute('cx', 250); e.setAttribute('cy', cy); e.setAttribute('rx', rx); e.setAttribute('ry', ry);
      e.setAttribute('transform', `rotate(${i * 360 / petals} 250 250)`);
      svg.append(e);
    }
    circles.forEach(r => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', 250); c.setAttribute('cy', 250); c.setAttribute('r', r); svg.append(c); });
    return svg;
  }
  $('#mandala').append(ring('', 12, 20, 70, 112, [238, 200, 40]), ring('rev', 8, 34, 90, 78, [150]));
})();

// cahaya mengikuti kursor pada kartu acara & rekening
$$('.card, .bank').forEach(c => c.addEventListener('pointermove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  c.style.setProperty('--my', (e.clientY - r.top) + 'px');
}));

// foto mempelai miring 3D mengikuti kursor (hanya perangkat dengan mouse)
if (matchMedia('(hover:hover)').matches && !reduce){
  $$('.photo').forEach(p => {
    p.addEventListener('pointermove', e => {
      const r = p.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      p.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
    });
    p.addEventListener('pointerleave', () => p.style.transform = '');
  });
}

/* ==========================================================
   ILUSTRASI ORISINAL (SVG) + POP-UP
   ========================================================== */
const GOLD = '#d3b57a', GOLD_D = '#9c7f45', BLUSH = '#e8c3c0';
const flowerG = () => {
  let outer = '', inner = '';
  for (let k = 0; k < 8; k++){
    outer += `<ellipse cy="-21" rx="9.5" ry="20" transform="rotate(${k*45})" fill="${BLUSH}" stroke="${GOLD}" stroke-width="1.1"/>`;
    inner += `<ellipse cy="-13" rx="5.5" ry="12" transform="rotate(${k*45+22.5})" fill="#f6dcd9" stroke="${GOLD}" stroke-width=".7"/>`;
  }
  return `${outer}${inner}<circle r="7.5" fill="${GOLD}"/><circle r="3.2" fill="#fff3c8"/>`;
};
const ART = {
  flower: () => `<svg viewBox="-42 -42 84 84" aria-hidden="true">${flowerG()}</svg>`,
  rings: () => `<svg viewBox="0 0 120 84" fill="none" aria-hidden="true">
    <circle cx="43" cy="48" r="27" stroke="${GOLD}" stroke-width="4"/>
    <circle cx="77" cy="48" r="27" stroke="${GOLD_D}" stroke-width="4"/>
    <path d="M77 8l8 10-8 10-8-10z" fill="#f6f7fa" stroke="${GOLD_D}" stroke-width="2"/>
    <path class="sp" d="M14 14l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="${GOLD}"/>
    <path class="sp" style="animation-delay:.9s" d="M108 30l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill="${GOLD}"/></svg>`,
  lantern: () => `<svg viewBox="0 0 60 140" aria-hidden="true">
    <path d="M30 0V26" stroke="${GOLD}" stroke-width="1.5"/>
    <path d="M18 26h24l-4 8H22z" fill="${GOLD_D}"/>
    <path d="M20 34C6 56 8 84 22 104H38C52 84 54 56 40 34z" fill="#c9a45c" stroke="#ecdcae" stroke-width="1"/>
    <ellipse cx="30" cy="68" rx="9" ry="16" fill="#fff3c8" opacity=".8"/>
    <path d="M30 34V104M20 34C14 60 16 86 24 104M40 34C46 60 44 86 36 104" stroke="#8a6c34" stroke-width=".9" fill="none"/>
    <rect x="20" y="104" width="20" height="6" rx="2" fill="${GOLD_D}"/>
    <path d="M24 110v18M30 110v26M36 110v18" stroke="${GOLD}" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  dove: () => `<svg viewBox="0 0 120 80" aria-hidden="true">
    <path d="M16 48L2 56h16z" fill="#efe8d6" stroke="${GOLD}" stroke-width=".8"/>
    <path d="M14 48C30 36 46 38 58 32C60 20 70 11 82 14C90 15 96 18 101 23L92 25C94 35 84 46 68 52C52 60 28 58 14 48z" fill="#f6f1e4" stroke="${GOLD}" stroke-width=".9"/>
    <path class="wing" d="M54 36C50 14 32 2 12 6C24 14 30 28 36 42z" fill="#fffaf0" stroke="${GOLD}" stroke-width=".9"/>
    <circle cx="86" cy="20" r="1.5" fill="#1a1f36"/></svg>`,
  gift: () => `<svg viewBox="0 0 100 92" aria-hidden="true">
    <rect x="15" y="40" width="70" height="46" rx="4" fill="${BLUSH}" stroke="${GOLD}" stroke-width="1.5"/>
    <rect x="9" y="28" width="82" height="15" rx="3" fill="#f3d7d4" stroke="${GOLD}" stroke-width="1.5"/>
    <rect x="44" y="28" width="12" height="58" fill="${GOLD}"/>
    <path d="M50 28C28 2 10 18 28 28zM50 28C72 2 90 18 72 28z" fill="${GOLD}" fill-opacity=".45" stroke="${GOLD_D}" stroke-width="2"/></svg>`
};
$$('[data-art]').forEach(n => {
  let svg = ART[n.dataset.art]();
  if ('flip' in n.dataset) svg = `<span style="display:block;transform:scaleX(-1)">${svg}</span>`;
  n.innerHTML = svg;
});

// bunga & daun tumbuh dari sudut hero (satu sulur, dipasang di kiri dan kanan)
function vineSVG(){
  const leaves = [[52,356,-35,1],[40,292,35,1.1],[68,228,-40,1.1],[104,168,30,1.2],[150,116,-30,1.1],[180,66,25,1]];
  const flowers = [[62,330,54],[98,196,66],[172,44,52],[34,262,36]];
  let k = 0, out = '';
  leaves.forEach(([x,y,r,s]) => {
    out += `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><ellipse class="lf" style="--k:${k++}" cx="0" cy="-16" rx="7" ry="17" fill="#6f8f7a" fill-opacity=".85" stroke="${GOLD}" stroke-width=".9"/></g>`;
  });
  flowers.forEach(([x,y,s]) => {
    out += `<g transform="translate(${x} ${y}) scale(${s/84})"><g class="bl" style="--k:${k++}">${flowerG()}</g></g>`;
  });
  return `<svg viewBox="0 0 220 420" aria-hidden="true">
    <path class="stem" pathLength="1" d="M20 420C70 330 30 250 100 170C150 112 190 90 170 20"/>${out}</svg>`;
}
$('#vineL').innerHTML = vineSVG();
$('#vineR').innerHTML = vineSVG();

// baris bunga di footer
[44, 64, 92, 64, 44].forEach((s, i) => {
  const f = el('span', { className:'pop turn', innerHTML:ART.flower() });
  f.style.width = s + 'px'; f.style.setProperty('--d', (i * .12) + 's');
  $('#bloomrow').append(f);
});

// popup sambutan: tampil sebentar setelah gerbang terbuka
const POPUP = { enabled:true, image:'', delay:3600 };   // image: URL foto (opsional); kosong = ilustrasi cincin & bunga
(function(){
  const pop = $('#popup'); if (!pop) return;
  const art = $('#popArt');
  if (POPUP.image) art.append(el('img', { src:POPUP.image, alt:'' }));
  else {
    art.innerHTML = ART.rings();
    [['-6px','8px',.9],['calc(100% - 38px)','0px',1.15],['calc(50% - 22px)','calc(100% - 26px)',1.4]].forEach(([l,t,d]) => {
      const f = el('span', { className:'pf pop turn', innerHTML:ART.flower() });
      f.style.cssText = `left:${l};top:${t};--d:${d}s`; art.append(f);
    });
  }
  $('#popTitle').textContent = `${g.nick} & ${b.nick}`;
  $('#popDate').textContent = fmtDate(CONFIG.weddingDate, { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const close = () => { pop.classList.remove('on'); setTimeout(() => pop.hidden = true, 450); };
  $('#popClose').addEventListener('click', close);
  $('#popOk').addEventListener('click', close);
  pop.addEventListener('click', e => { if (e.target === pop) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && pop.classList.contains('on')) close(); });
  $('#openBtn').addEventListener('click', () => {
    if (!POPUP.enabled) return;
    setTimeout(() => {
      $('#popGuest').textContent = $('#guest').textContent;
      pop.hidden = false;
      requestAnimationFrame(() => { pop.classList.add('on'); art.querySelectorAll('.pop').forEach(n => n.classList.add('in')); $('#popOk').focus({ preventScroll:true }); });
    }, POPUP.delay);
  });
})();

const cover = $('#cover'), bgm = $('#bgm'), musicBtn = $('#music');
$('#openBtn').addEventListener('click', () => {
  cover.classList.add('open');
  document.body.classList.remove('locked');
  document.body.classList.add('opened');
  window.scrollTo(0, 0);
  setTimeout(() => cover.classList.add('done'), 1700);
  if (CONFIG.music){ bgm.play().then(() => musicBtn.classList.add('play')).catch(() => {}); }
});
if (CONFIG.music){
  bgm.src = CONFIG.music; musicBtn.classList.add('show');
  musicBtn.addEventListener('click', () => {
    if (bgm.paused){ bgm.play(); musicBtn.classList.add('play'); }
    else { bgm.pause(); musicBtn.classList.remove('play'); }
  });
}

/* ==========================================================
   HITUNG MUNDUR
   ========================================================== */
const target = new Date(CONFIG.weddingDate).getTime();
const nums = Object.fromEntries($$('#cd .num').map(n => [n.dataset.u, n]));
function setNum(n, v){ const s = String(v); if (n.textContent !== s){ n.textContent = s; n.classList.remove('bump'); void n.offsetWidth; n.classList.add('bump'); } }
function tick(){
  let diff = Math.max(0, target - Date.now());
  if (diff === 0){ $('#cd').hidden = true; $('#cdMsg').hidden = false; return; }
  const d = Math.floor(diff / 864e5); diff %= 864e5;
  const h = Math.floor(diff / 36e5);  diff %= 36e5;
  const m = Math.floor(diff / 6e4);   diff %= 6e4;
  setNum(nums.d, d); setNum(nums.h, String(h).padStart(2,'0'));
  setNum(nums.m, String(m).padStart(2,'0')); setNum(nums.s, String(Math.floor(diff/1000)).padStart(2,'0'));
}
tick(); setInterval(tick, 1000);

/* ==========================================================
   SCROLL: reveal, progress bar, parallax, dock aktif
   ========================================================== */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold:.15 });
$$('.rv, .pop, .lantern').forEach(n => io.observe(n));

const dockLinks = $$('#dock a'), secs = dockLinks.map(a => $(a.getAttribute('href')));
const prog = $('#progress'), par = $('#parallax');
let ticking = false;
function onScroll(){
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  prog.style.width = (max > 0 ? y / max * 100 : 0) + '%';
  const tl = $('#tl'), tr = tl.getBoundingClientRect();
  tl.style.setProperty('--p', Math.min(1, Math.max(0, (innerHeight * .6 - tr.top) / tr.height)).toFixed(3));
  if (!reduce && y < innerHeight * 1.2) par.style.transform = `translate3d(0,${y * .25}px,0)`;
  let cur = 0;
  secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .45) cur = i; });
  dockLinks.forEach((a, i) => a.classList.toggle('on', i === cur));
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, { passive:true });
onScroll();

/* ==========================================================
   RSVP & UCAPAN (tersimpan di browser perangkat ini)
   ========================================================== */
const KEY = 'wedding-wishes-v1';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const save = v => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} };
function renderWishes(){
  const box = $('#wishes'), list = load();
  box.replaceChildren();
  if (!list.length){ box.append(el('p', { className:'empty', textContent:'Belum ada ucapan. Jadilah yang pertama.' })); return; }
  list.slice().reverse().forEach(w => box.append(el('div', { className:'wish' }, [
    el('header', {}, [ el('b', { textContent:w.name }), el('span', { className:'tag' + (w.att === 'no' ? ' no' : ''), textContent: w.att === 'yes' ? `Hadir · ${w.count} orang` : 'Tidak hadir' }) ]),
    w.msg ? el('p', { textContent:w.msg }) : ''
  ])));
}
renderWishes();
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#fName').value.trim();
  if (!name){ $('#formHint').textContent = 'Isi nama Anda terlebih dahulu.'; $('#fName').focus(); return; }
  const list = load();
  list.push({ name, att:$('#fAtt').value, count:$('#fCount').value, msg:$('#fMsg').value.trim() });
  save(list); renderWishes();
  $('#form').reset();
  $('#formHint').textContent = 'Terkirim. Terima kasih atas ucapan Anda.';
});
$('#waBtn').addEventListener('click', () => {
  const name = $('#fName').value.trim();
  if (!name){ $('#formHint').textContent = 'Isi nama Anda terlebih dahulu.'; $('#fName').focus(); return; }
  const att = $('#fAtt').value === 'yes' ? `akan hadir (${$('#fCount').value} orang)` : 'mohon maaf belum bisa hadir';
  const text = `Halo, saya ${name}, ${att} di pernikahan ${g.nick} & ${b.nick}. ${$('#fMsg').value.trim()}`.trim();
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});

/* ==========================================================
   KELOPAK JATUH (canvas, ringan, menyesuaikan layar)
   ========================================================== */
(function petals(){
  if (reduce) return;
  const cv = $('#petals'), ctx = cv.getContext('2d');
  let W, H, list = [], dpr = 1, running = true;
  const colors = ['rgba(232,195,192,.75)','rgba(211,181,122,.7)','rgba(246,247,250,.6)'];
  function resize(){
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(34, Math.max(12, W / 45)));
    while (list.length < n) list.push(make(true));
    list.length = n;
  }
  function make(anywhere){
    return {
      x:Math.random() * W, y: anywhere ? Math.random() * H : -20,
      s:6 + Math.random() * 9, vy:.35 + Math.random() * .8,
      sway:20 + Math.random() * 40, f:.4 + Math.random() * .9, t:Math.random() * 6.28,
      r:Math.random() * 6.28, vr:(Math.random() - .5) * .03, c:colors[(Math.random() * colors.length) | 0]
    };
  }
  function frame(){
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (const p of list){
      p.t += .016 * p.f; p.y += p.vy; p.r += p.vr;
      const x = p.x + Math.sin(p.t) * p.sway;
      if (p.y > H + 20){ Object.assign(p, make(false)); }
      ctx.save(); ctx.translate(x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * .5, 0, 0, 6.283); ctx.fill(); ctx.restore();
    }
    requestAnimationFrame(frame);
  }
  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) frame(); });
  resize(); frame();
})();