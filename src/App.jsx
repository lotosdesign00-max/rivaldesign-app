import React, {
  useState, useEffect, useRef, useCallback, useMemo, useReducer
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

/* ╔══════════════════════════════════════════════════════════╗
   ║   RIVAL STUDIO — PREMIUM PORTFOLIO APP                  ║
   ║   Layout: Bottom Nav · Side Drawer · Dashboard Home     ║
   ╚══════════════════════════════════════════════════════════╝ */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔊 SOUND ENGINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _actx = null, _master = null;
function actx() {
  if (!_actx) {
    try { _actx = new (window.AudioContext || window.webkitAudioContext)(); _master = _actx.createGain(); _master.connect(_actx.destination); } catch {}
  }
  return _actx;
}
let _soundEnabled = true, _volume = 0.6;
function note(f, t = "sine", v = 0.07, d = 0.12, delay = 0) {
  if (!_soundEnabled) return;
  const c = actx(); if (!c || !_master) return;
  try {
    const o = c.createOscillator(), g = c.createGain(), flt = c.createBiquadFilter();
    flt.type = "lowpass"; flt.frequency.value = 5000;
    o.connect(flt); flt.connect(g); g.connect(_master);
    _master.gain.value = _volume;
    o.type = t; o.frequency.value = f;
    const n = c.currentTime + delay;
    g.gain.setValueAtTime(0, n);
    g.gain.linearRampToValueAtTime(v, n + 0.012);
    g.gain.exponentialRampToValueAtTime(0.001, n + d);
    o.start(n); o.stop(n + d + 0.06);
  } catch {}
}
const SFX = {
  tap:     () => note(800,"sine",.06,.08),
  tab:     () => { note(600,"triangle",.07,.1); note(800,"sine",.04,.08,.05); },
  open:    () => [400,600,800].forEach((f,i)=>note(f,"sine",.06,.15,i*.04)),
  close:   () => [800,600,400].forEach((f,i)=>note(f,"sine",.05,.12,i*.03)),
  success: () => [523,659,784,1047].forEach((f,i)=>note(f,"sine",.08,.18,i*.07)),
  error:   () => [400,300].forEach((f,i)=>note(f,"sawtooth",.06,.15,i*.06)),
  addCart: () => [523,659,784].forEach((f,i)=>note(f,"sine",.08,.13,i*.06)),
  remove:  () => note(300,"sawtooth",.05,.15),
  clear:   () => [400,300,200].forEach((f,i)=>note(f,"sawtooth",.05,.1,i*.05)),
  order:   () => [261,329,392,523,659,784].forEach((f,i)=>note(f,"sine",.09,.2,i*.06)),
  theme:   () => [300,400,500,600,700].forEach((f,i)=>note(f,"sine",.05,.12,i*.04)),
  lang:    () => { note(700,"sine",.06,.1); note(900,"sine",.05,.1,.06); },
  faq:     () => note(550,"triangle",.05,.1),
  ai:      () => [200,300,400,500,600,700,800].forEach((f,i)=>note(f,"sine",.04,.14,i*.04)),
  aiDone:  () => [784,988,1175,1568].forEach((f,i)=>note(f,"sine",.08,.2,i*.08)),
  like:    () => { note(880,"sine",.07,.15); note(1100,"sine",.05,.1,.08); },
  copy:    () => { note(800,"sine",.05,.08); note(1000,"sine",.04,.08,.05); },
  filter:  () => note(600,"triangle",.04,.08),
  toggle:  () => note(700,"triangle",.05,.1),
  drawer:  () => [500,700].forEach((f,i)=>note(f,"sine",.05,.12,i*.05)),
  search:  () => note(900,"sine",.03,.07),
  hover:   () => note(1200,"sine",.015,.04),
  rate:    () => [523,659,784,880,1047].forEach((f,i)=>note(f,"sine",.06,.15,i*.05)),
  wishlist:() => { note(660,"sine",.07,.12); note(880,"sine",.05,.1,.07); },
  confetti:() => [400,500,600,700,800,900,1000].forEach((f,i)=>note(f,"sine",.1,.25,i*.05)),
  ping:    () => note(1000,"sine",.04,.06),
  whoosh:  () => { for(let i=0;i<6;i++) note(200+i*100,"sawtooth",.03,.08,i*.03); },
  boot:    () => [261,329,392,523].forEach((f,i)=>note(f,"sine",.07,.2,i*.1)),
  scan:    () => { for(let i=0;i<8;i++) note(400+i*80,"triangle",.03,.05,i*.04); },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 THEMES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const THEMES = {
  void: {
    id:"void", label:"Void", emoji:"◼",
    bg:"#06060e", nav:"#0c0c18", card:"#0f0f1e", surface:"#13132a",
    border:"rgba(138,92,246,.15)", accent:"#8a5cf7", accentB:"#6d3ef5",
    glow:"rgba(138,92,246,.3)", text:"#f0eaff", sub:"#7b73a8",
    btn:"#8a5cf7", btnTxt:"#fff", hi:"#b794f4",
    grad:"linear-gradient(135deg,#8a5cf7,#6366f1)",
    navGrad:"linear-gradient(180deg,rgba(6,6,14,0) 0%,#06060e 100%)",
    shadow:"0 8px 32px rgba(138,92,246,.2)",
  },
  ice: {
    id:"ice", label:"Ice", emoji:"❄",
    bg:"#f0f6ff", nav:"#fff", card:"#f8fbff", surface:"#eef4ff",
    border:"rgba(59,130,246,.15)", accent:"#2563eb", accentB:"#1d4ed8",
    glow:"rgba(37,99,235,.2)", text:"#0f172a", sub:"#64748b",
    btn:"#2563eb", btnTxt:"#fff", hi:"#3b82f6",
    grad:"linear-gradient(135deg,#2563eb,#0ea5e9)",
    navGrad:"linear-gradient(180deg,rgba(240,246,255,0) 0%,#f0f6ff 100%)",
    shadow:"0 8px 32px rgba(37,99,235,.15)",
  },
  ember: {
    id:"ember", label:"Ember", emoji:"🔥",
    bg:"#0a0500", nav:"#140900", card:"#1a0c00", surface:"#201000",
    border:"rgba(251,146,60,.15)", accent:"#f97316", accentB:"#ea6c10",
    glow:"rgba(249,115,22,.3)", text:"#fff7ed", sub:"#c2824a",
    btn:"#f97316", btnTxt:"#fff", hi:"#fb923c",
    grad:"linear-gradient(135deg,#f97316,#ef4444)",
    navGrad:"linear-gradient(180deg,rgba(10,5,0,0) 0%,#0a0500 100%)",
    shadow:"0 8px 32px rgba(249,115,22,.2)",
  },
  aurora: {
    id:"aurora", label:"Aurora", emoji:"🌌",
    bg:"#00080d", nav:"#001018", card:"#001525", surface:"#001e30",
    border:"rgba(34,211,238,.13)", accent:"#22d3ee", accentB:"#0ea5e9",
    glow:"rgba(34,211,238,.25)", text:"#e0faff", sub:"#4dc8e0",
    btn:"#22d3ee", btnTxt:"#001020", hi:"#67e8f9",
    grad:"linear-gradient(135deg,#22d3ee,#8b5cf6)",
    navGrad:"linear-gradient(180deg,rgba(0,8,13,0) 0%,#00080d 100%)",
    shadow:"0 8px 32px rgba(34,211,238,.2)",
  },
  neon: {
    id:"neon", label:"Neon", emoji:"⚡",
    bg:"#000000", nav:"#040404", card:"#060606", surface:"#090909",
    border:"rgba(0,255,136,.18)", accent:"#00ff88", accentB:"#00e077",
    glow:"rgba(0,255,136,.3)", text:"#e8fff5", sub:"#00a85a",
    btn:"#00ff88", btnTxt:"#000", hi:"#39ffa0",
    grad:"linear-gradient(135deg,#00ff88,#00e0ff)",
    navGrad:"linear-gradient(180deg,rgba(0,0,0,0) 0%,#000000 100%)",
    shadow:"0 8px 32px rgba(0,255,136,.2)",
  },
  sakura: {
    id:"sakura", label:"Sakura", emoji:"🌸",
    bg:"#fff5f9", nav:"#fff", card:"#fff0f6", surface:"#ffe8f2",
    border:"rgba(236,72,153,.13)", accent:"#ec4899", accentB:"#db2777",
    glow:"rgba(236,72,153,.2)", text:"#500724", sub:"#9d174d",
    btn:"#ec4899", btnTxt:"#fff", hi:"#f472b6",
    grad:"linear-gradient(135deg,#ec4899,#f43f5e)",
    navGrad:"linear-gradient(180deg,rgba(255,245,249,0) 0%,#fff5f9 100%)",
    shadow:"0 8px 32px rgba(236,72,153,.15)",
  },
  gold: {
    id:"gold", label:"Gold", emoji:"👑",
    bg:"#080600", nav:"#100e00", card:"#181400", surface:"#201c00",
    border:"rgba(251,191,36,.15)", accent:"#fbbf24", accentB:"#f59e0b",
    glow:"rgba(251,191,36,.25)", text:"#fffbeb", sub:"#92750a",
    btn:"#fbbf24", btnTxt:"#000", hi:"#fcd34d",
    grad:"linear-gradient(135deg,#fbbf24,#f59e0b)",
    navGrad:"linear-gradient(180deg,rgba(8,6,0,0) 0%,#080600 100%)",
    shadow:"0 8px 32px rgba(251,191,36,.2)",
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const LANGS = {
  ru:{ flag:"🇷🇺", name:"Русский",    cur:"₽", code:"RUB", rate:95  },
  en:{ flag:"🇺🇸", name:"English",    cur:"$", code:"USD", rate:1   },
  ua:{ flag:"🇺🇦", name:"Українська", cur:"₴", code:"UAH", rate:40  },
  kz:{ flag:"🇰🇿", name:"Қазақша",   cur:"₸", code:"KZT", rate:450 },
  by:{ flag:"🇧🇾", name:"Беларуская", cur:"Br",code:"BYN", rate:3.2 },
};

const GALLERY = {
  ru:[
    {id:"a1",cat:"Аватарки",  title:"Киберпанк аватар", desc:"Неоновое свечение",       img:"https://picsum.photos/seed/rsa1/400/400", tags:["neon","cyber"],  popular:true },
    {id:"a2",cat:"Аватарки",  title:"Минимал аватар",   desc:"Чистый минимализм",        img:"https://picsum.photos/seed/rsa2/400/400", tags:["minimal"],       popular:false},
    {id:"a3",cat:"Аватарки",  title:"Тёмный аватар",    desc:"Мрачный стиль",            img:"https://picsum.photos/seed/rsa3/400/400", tags:["dark"],          popular:true },
    {id:"a4",cat:"Аватарки",  title:"Градиент аватар",  desc:"Плавные переходы",         img:"https://picsum.photos/seed/rsa4/400/400", tags:["gradient"],      popular:false},
    {id:"p1",cat:"Превью",    title:"YouTube превью",   desc:"Гейм-стиль",               img:"https://picsum.photos/seed/rsp1/600/340", tags:["youtube","game"],popular:true },
    {id:"p2",cat:"Превью",    title:"Twitch превью",    desc:"Стримерский дизайн",        img:"https://picsum.photos/seed/rsp2/600/340", tags:["twitch"],        popular:false},
    {id:"p3",cat:"Превью",    title:"Яркое превью",     desc:"Выделяйся из толпы",        img:"https://picsum.photos/seed/rsp3/600/340", tags:["bright"],        popular:true },
    {id:"p4",cat:"Превью",    title:"Минимал превью",   desc:"Лаконичность",              img:"https://picsum.photos/seed/rsp4/600/340", tags:["minimal"],       popular:false},
    {id:"b1",cat:"Баннеры",   title:"Twitch баннер",    desc:"Шапка канала",             img:"https://picsum.photos/seed/rsb1/800/220", tags:["twitch"],        popular:true },
    {id:"b2",cat:"Баннеры",   title:"Discord баннер",   desc:"Серверная шапка",          img:"https://picsum.photos/seed/rsb2/800/220", tags:["discord"],       popular:false},
    {id:"b3",cat:"Баннеры",   title:"YouTube шапка",    desc:"Канальный арт",            img:"https://picsum.photos/seed/rsb3/800/220", tags:["youtube"],       popular:true },
    {id:"b4",cat:"Баннеры",   title:"VK баннер",        desc:"Шапка ВКонтакте",          img:"https://picsum.photos/seed/rsb4/800/220", tags:["vk"],            popular:false},
    {id:"l1",cat:"Логотипы",  title:"Gaming лого",      desc:"Для киберспорта",           img:"https://picsum.photos/seed/rsl1/400/400", tags:["game","logo"],   popular:true },
    {id:"l2",cat:"Логотипы",  title:"Минимал лого",     desc:"Современный бренд",         img:"https://picsum.photos/seed/rsl2/400/400", tags:["minimal","logo"],popular:false},
    {id:"l3",cat:"Логотипы",  title:"Неон лого",        desc:"Светящийся знак",           img:"https://picsum.photos/seed/rsl3/400/400", tags:["neon","logo"],   popular:true },
    {id:"l4",cat:"Логотипы",  title:"3D лого",          desc:"Объёмный дизайн",           img:"https://picsum.photos/seed/rsl4/400/400", tags:["3d","logo"],     popular:false},
  ],
  en:[
    {id:"a1",cat:"Avatars",  title:"Cyberpunk Avatar",  desc:"Neon glow effect",     img:"https://picsum.photos/seed/rsa1/400/400", tags:["neon","cyber"],  popular:true },
    {id:"a2",cat:"Avatars",  title:"Minimal Avatar",    desc:"Clean minimalism",      img:"https://picsum.photos/seed/rsa2/400/400", tags:["minimal"],       popular:false},
    {id:"a3",cat:"Avatars",  title:"Dark Avatar",       desc:"Moody style",           img:"https://picsum.photos/seed/rsa3/400/400", tags:["dark"],          popular:true },
    {id:"a4",cat:"Avatars",  title:"Gradient Avatar",   desc:"Smooth transitions",   img:"https://picsum.photos/seed/rsa4/400/400", tags:["gradient"],      popular:false},
    {id:"p1",cat:"Previews", title:"YouTube Preview",   desc:"Gaming style",          img:"https://picsum.photos/seed/rsp1/600/340", tags:["youtube","game"],popular:true },
    {id:"p2",cat:"Previews", title:"Twitch Preview",    desc:"Streamer design",       img:"https://picsum.photos/seed/rsp2/600/340", tags:["twitch"],        popular:false},
    {id:"p3",cat:"Previews", title:"Vibrant Preview",   desc:"Stand out from crowd",  img:"https://picsum.photos/seed/rsp3/600/340", tags:["bright"],        popular:true },
    {id:"p4",cat:"Previews", title:"Minimal Preview",   desc:"Clean and simple",      img:"https://picsum.photos/seed/rsp4/600/340", tags:["minimal"],       popular:false},
    {id:"b1",cat:"Banners",  title:"Twitch Banner",     desc:"Channel header art",    img:"https://picsum.photos/seed/rsb1/800/220", tags:["twitch"],        popular:true },
    {id:"b2",cat:"Banners",  title:"Discord Banner",    desc:"Server header",         img:"https://picsum.photos/seed/rsb2/800/220", tags:["discord"],       popular:false},
    {id:"b3",cat:"Banners",  title:"YouTube Header",    desc:"Channel art",           img:"https://picsum.photos/seed/rsb3/800/220", tags:["youtube"],       popular:true },
    {id:"b4",cat:"Banners",  title:"VK Banner",         desc:"VK header art",         img:"https://picsum.photos/seed/rsb4/800/220", tags:["vk"],            popular:false},
    {id:"l1",cat:"Logos",   title:"Gaming Logo",        desc:"Esports style",         img:"https://picsum.photos/seed/rsl1/400/400", tags:["game","logo"],   popular:true },
    {id:"l2",cat:"Logos",   title:"Minimal Logo",       desc:"Modern brand",          img:"https://picsum.photos/seed/rsl2/400/400", tags:["minimal","logo"],popular:false},
    {id:"l3",cat:"Logos",   title:"Neon Logo",          desc:"Glowing sign",          img:"https://picsum.photos/seed/rsl3/400/400", tags:["neon","logo"],   popular:true },
    {id:"l4",cat:"Logos",   title:"3D Logo",            desc:"Volumetric design",     img:"https://picsum.photos/seed/rsl4/400/400", tags:["3d","logo"],     popular:false},
  ],
  ua:[
    {id:"a1",cat:"Аватарки",  title:"Кіберпанк аватар", desc:"Неонове сяйво",    img:"https://picsum.photos/seed/rsa1/400/400", tags:["neon","cyber"],  popular:true },
    {id:"a2",cat:"Аватарки",  title:"Мінімал аватар",   desc:"Чистий мінімалізм",img:"https://picsum.photos/seed/rsa2/400/400", tags:["minimal"],       popular:false},
    {id:"a3",cat:"Аватарки",  title:"Темний аватар",    desc:"Похмурий стиль",   img:"https://picsum.photos/seed/rsa3/400/400", tags:["dark"],          popular:true },
    {id:"a4",cat:"Аватарки",  title:"Градієнт аватар",  desc:"Плавні переходи",  img:"https://picsum.photos/seed/rsa4/400/400", tags:["gradient"],      popular:false},
    {id:"p1",cat:"Прев'ю",   title:"YouTube прев'ю",   desc:"Ігровий стиль",    img:"https://picsum.photos/seed/rsp1/600/340", tags:["youtube","game"],popular:true },
    {id:"p2",cat:"Прев'ю",   title:"Twitch прев'ю",    desc:"Стримерський",     img:"https://picsum.photos/seed/rsp2/600/340", tags:["twitch"],        popular:false},
    {id:"p3",cat:"Прев'ю",   title:"Яскраве прев'ю",   desc:"Виділяйся",        img:"https://picsum.photos/seed/rsp3/600/340", tags:["bright"],        popular:true },
    {id:"p4",cat:"Прев'ю",   title:"Мінімал прев'ю",   desc:"Лаконічність",     img:"https://picsum.photos/seed/rsp4/600/340", tags:["minimal"],       popular:false},
    {id:"b1",cat:"Банери",   title:"Twitch банер",     desc:"Шапка каналу",     img:"https://picsum.photos/seed/rsb1/800/220", tags:["twitch"],        popular:true },
    {id:"b2",cat:"Банери",   title:"Discord банер",    desc:"Серверна шапка",   img:"https://picsum.photos/seed/rsb2/800/220", tags:["discord"],       popular:false},
    {id:"b3",cat:"Банери",   title:"YouTube шапка",    desc:"Канальний арт",    img:"https://picsum.photos/seed/rsb3/800/220", tags:["youtube"],       popular:true },
    {id:"b4",cat:"Банери",   title:"VK банер",         desc:"Шапка ВКонтакте",  img:"https://picsum.photos/seed/rsb4/800/220", tags:["vk"],            popular:false},
    {id:"l1",cat:"Логотипи", title:"Gaming лого",      desc:"Для кіберспорту",  img:"https://picsum.photos/seed/rsl1/400/400", tags:["game","logo"],   popular:true },
    {id:"l2",cat:"Логотипи", title:"Мінімал лого",     desc:"Сучасний бренд",   img:"https://picsum.photos/seed/rsl2/400/400", tags:["minimal","logo"],popular:false},
    {id:"l3",cat:"Логотипи", title:"Неон лого",        desc:"Світний знак",     img:"https://picsum.photos/seed/rsl3/400/400", tags:["neon","logo"],   popular:true },
    {id:"l4",cat:"Логотипи", title:"3D лого",          desc:"Об'ємний дизайн",  img:"https://picsum.photos/seed/rsl4/400/400", tags:["3d","logo"],     popular:false},
  ],
};
GALLERY.kz = GALLERY.ru.map(i=>({...i,cat:{Аватарки:"Аватарлар",Превью:"Превью",Баннеры:"Баннерлер",Логотипы:"Логотиптер"}[i.cat]||i.cat}));
GALLERY.by = GALLERY.ru.map(i=>({...i,cat:{Аватарки:"Аватаркі",Превью:"Прэв'ю",Баннеры:"Банеры",Логотипы:"Лагатыпы"}[i.cat]||i.cat}));

const CAT_ICONS = { Аватарки:"◈", Avatars:"◈", "Прев'ю":"▣", Previews:"▣", Превью:"▣", Баннеры:"▬", Banners:"▬", Логотипы:"✦", Logos:"✦", Логотипи:"✦", Аватаркі:"◈", "Прэв'ю":"▣", Банеры:"▬", Лагатыпы:"✦", Аватарлар:"◈", Баннерлер:"▬", Логотиптер:"✦" };

const REVIEWS = [
  {id:"r1",  name:"Darkslide",   tg:"Darkslide",    rating:5, text:"Работа выполнена быстро и качественно. Результат превзошёл ожидания!", liked:0},
  {id:"r2",  name:"VoidProxy",   tg:"VoidProxy",    rating:5, text:"Отличный дизайнер, рекомендую всем.",                                  liked:0},
  {id:"r3",  name:"Nextra",      tg:"Nextra",       rating:5, text:"Заказывал превью — очень доволен. Всё профессионально.",               liked:0},
  {id:"r4",  name:"HoskeHeviz",  tg:"hoskefromheviz",rating:5,text:"Благодарю за работу, всё выполнено профессионально.",                 liked:0},
  {id:"r5",  name:"Solevoy",     tg:"fazenemoy",    rating:5, text:"Рекомендую всем — работа выполнена безупречно.",                      liked:0},
  {id:"r6",  name:"Aero",        tg:"AeroDesig",    rating:5, text:"Отличный результат, спасибо за качественную работу.",                 liked:0},
  {id:"r7",  name:"Firessk",     tg:"firessk",      rating:5, text:"Большое спасибо, обязательно порекомендую знакомым.",                 liked:0},
  {id:"r8",  name:"Helvite",     tg:"Helvite0",     rating:5, text:"Работа выполнена на 10/10, всё качественно.",                         liked:0},
  {id:"r9",  name:"Usepsyho",    tg:"Usepsyho",     rating:5, text:"Всё выполнено быстро и профессионально, 10/10.",                      liked:0},
  {id:"r10", name:"Filling",     tg:"Filling_tg",   rating:4, text:"Отличная работа, оценка 9/10, очень качественно.",                   liked:0},
  {id:"r11", name:"Arthur",      tg:"Arthur_dsg",   rating:5, text:"Благодарю за профессиональный подход.",                               liked:0},
  {id:"r12", name:"Kupiz",       tg:"Kupiz",        rating:5, text:"Всё выполнено чётко и качественно.",                                  liked:0},
  {id:"r13", name:"Du",          tg:"Du_tg",        rating:5, text:"Полностью доволен, получил всё что хотел.",                           liked:0},
  {id:"r14", name:"ZetaMert",    tg:"ZetaMert",     rating:5, text:"Всё отлично, работа выполнена качественно.",                          liked:0},
  {id:"r15", name:"Rare",        tg:"Rare_user",    rating:5, text:"Работа выполнена даже раньше срока. Рекомендую @Rivaldsg.",           liked:0},
  {id:"r16", name:"Xyi v tapke", tg:"xyi_v_tapke",  rating:5, text:"Отличный результат, очень доволен.",                                  liked:0},
  {id:"r17", name:"Yvonne",      tg:"Yvonne_dsg",   rating:5, text:"Работа выполнена именно так, как я хотел.",                           liked:0},
  {id:"r18", name:"Wised",       tg:"Wised_tg",     rating:5, text:"Заказывал баннер и аватарку — рекомендую @Rivaldsg.",                liked:0},
  {id:"r19", name:"Zahar",       tg:"Zahar_user",   rating:5, text:"@Rivaldsg оперативно выполнил заказ, всё чётко.",                    liked:0},
];

const SERVICES = [
  {id:1, icon:"◈", key:"avatar",  priceUSD:5,  ru:"Аватарка", en:"Avatar", ua:"Аватарка", kz:"Аватар",   by:"Аватарка", descRu:"Уникальный аватар в твоём стиле",    descEn:"Unique avatar in your style"},
  {id:2, icon:"▣", key:"preview", priceUSD:5,  ru:"Превью",   en:"Preview",ua:"Прев'ю",  kz:"Превью",   by:"Прэв'ю",  descRu:"YouTube / Twitch превью-картинка",  descEn:"YouTube / Twitch thumbnail"},
  {id:3, icon:"▬", key:"banner",  priceUSD:5,  ru:"Баннер",   en:"Banner", ua:"Банер",   kz:"Баннер",   by:"Банер",   descRu:"Шапка канала / профиля",             descEn:"Channel / profile header"},
  {id:4, icon:"✦", key:"logo",    priceUSD:5,  ru:"Логотип",  en:"Logo",   ua:"Логотип", kz:"Логотип",  by:"Лагатып", descRu:"Логотип для твоего бренда",          descEn:"Logo for your brand"},
];

const AI_IDEAS = [
  "🎨 Аватар: киберпанк + неоновые линии, палитра #0ff/#f0f/#ff0 на тёмном фоне — эффект голограммы",
  "🌊 Превью: тайм-лапс океанских волн + крупный белый текст, синий → фиолетовый градиент фона",
  "🔥 Баннер: магма и лава, тёплые тона, динамичные брызги + название канала в центре",
  "✨ Логотип: буква из стекла с преломлением света, прозрачность + градиентные блики",
  "🌌 Аватар: космический скафандр изнутри, видна галактика, Milky Way colors + lens flare",
  "🍃 Превью: минималистичные ботанические иллюстрации, sage green + cream, редкие линии",
  "⚡ Баннер: молнии и электроразряды, тёмно-серый фон, неоновый жёлтый + белый",
  "🎭 Аватар: половина лица — портрет, половина — пиксели/данные, bicolor split",
  "🔮 Логотип: кристалл с внутренним свечением, amethyst purple + ice blue преломления",
  "🏆 Превью: золотой кубок в центре, dramatic lighting, dark bg, winner aesthetic",
  "🌸 Аватар: японская акварель, нежные сакуры, wabi-sabi эстетика, pastel + ink",
  "🤖 Баннер: нейронная сеть из светящихся узлов, tech-aesthetic, deep blue bg",
  "🎸 Логотип: расплавленная гитара + ноты как брызги, rock aesthetic, dark red",
  "🦋 Аватар: бабочка из геометрических фигур, low-poly стиль, gradient wings",
  "🌈 Превью: цветовые пятна краски на чёрном, ink-drop эффект, maximalist",
];

const FAQ_DATA = {
  ru:[
    {q:"📝 Как проходит работа?",       a:"1. Приветствие\n2. Обсуждение деталей\n3. Согласование\n4. 50% оплата\n5. Выполнение (1–3 дня)\n6. Получение результата\n7. Правки (до 3 бесплатных)\n8. Финальный расчёт + отзыв"},
    {q:"💾 Что я получу?",               a:"✅ Качественный дизайн\n✅ Вежливое общение\n✅ Исходники PSD/AEP\n✅ 3 бесплатных правки\n✅ Поддержка после сдачи"},
    {q:"✏️ Сколько правок входит?",      a:"🔄 До 3 правок бесплатно\n💰 Дополнительные — по договорённости"},
    {q:"💳 Как оплатить?",               a:"💳 Карта любой страны\n💸 Крипта: CryptoBot (USDT)\n💵 50% предоплата → 50% после"},
    {q:"⚡ Возможен срочный заказ?",      a:"🔥 Выполнение от 3 часов (зависит от сложности)\n💸 Доплата за срочность: +20–50%"},
    {q:"📁 Какие форматы получу?",       a:"📦 PNG, JPG, PSD, AI, AEP — по запросу\n🗂 Все слои отдельно при необходимости"},
    {q:"🔒 Конфиденциальность?",         a:"🔒 Твой проект — только твой\n🚫 Не использую чужие работы без разрешения"},
  ],
  en:[
    {q:"📝 How does the process work?",  a:"1. Greeting\n2. Detail discussion\n3. Agreement\n4. 50% payment\n5. Production (1–3 days)\n6. Delivery\n7. Revisions (up to 3 free)\n8. Final payment + review"},
    {q:"💾 What will I receive?",        a:"✅ Quality design\n✅ Polite communication\n✅ Source files PSD/AEP\n✅ 3 free revisions\n✅ Post-delivery support"},
    {q:"✏️ How many revisions?",         a:"🔄 Up to 3 revisions free\n💰 Additional by agreement"},
    {q:"💳 How to pay?",                 a:"💳 Card from any country\n💸 Crypto: CryptoBot (USDT)\n💵 50% prepay → 50% after"},
    {q:"⚡ Urgent orders possible?",     a:"🔥 From 3 hours (depends on complexity)\n💸 Urgency surcharge: +20–50%"},
    {q:"📁 What formats do I get?",      a:"📦 PNG, JPG, PSD, AI, AEP on request\n🗂 All layers separately if needed"},
    {q:"🔒 Confidentiality?",            a:"🔒 Your project stays private\n🚫 Never use others' work without permission"},
  ],
  ua:[
    {q:"📝 Як проходить робота?",        a:"1. Вітання\n2. Обговорення деталей\n3. Узгодження\n4. 50% оплата\n5. Виконання (1–3 дні)\n6. Отримання результату\n7. Правки (до 3 безкоштовних)\n8. Фінал + відгук"},
    {q:"💾 Що я отримаю?",               a:"✅ Якісний дизайн\n✅ Ввічливе спілкування\n✅ Вихідники PSD/AEP\n✅ 3 безкоштовні правки"},
    {q:"✏️ Скільки правок?",             a:"🔄 До 3 правок безкоштовно\n💰 Додаткові — за домовленістю"},
    {q:"💳 Як оплатити?",                a:"💳 Карта будь-якої країни\n💸 Крипта: CryptoBot (USDT)\n💵 50% передоплата → 50% після"},
    {q:"⚡ Терміновий заказ?",            a:"🔥 Від 3 годин\n💸 +20–50% за терміновість"},
    {q:"📁 Які формати отримаю?",        a:"📦 PNG, JPG, PSD, AI, AEP на запит"},
    {q:"🔒 Конфіденційність?",           a:"🔒 Твій проект — тільки твій"},
  ],
  kz:[
    {q:"📝 Жұмыс қалай өтеді?",         a:"1. Сәлемдесу\n2. Талқылау\n3. Келісім\n4. 50% төлем\n5. Орындау (1–3 күн)\n6. Жеткізу\n7. Өзгерістер (3 тегін)\n8. Қорытынды + пікір"},
    {q:"💾 Мен не аламын?",              a:"✅ Сапалы дизайн\n✅ Бастапқы файлдар\n✅ 3 тегін өзгеріс"},
    {q:"✏️ Қанша өзгеріс?",              a:"🔄 3 тегін өзгеріс\n💰 Қосымша — бөлек"},
    {q:"💳 Қалай төлеуге болады?",       a:"💳 Кез келген елдің картасы\n💸 CryptoBot (USDT)\n💵 50%+50%"},
    {q:"⚡ Шұғыл тапсырыс?",             a:"🔥 3 сағаттан\n💸 +20–50% үстеме"},
    {q:"📁 Қандай форматтар?",           a:"📦 PNG, JPG, PSD, AI, AEP"},
    {q:"🔒 Құпиялылық?",                 a:"🔒 Жобаң — тек сенің"},
  ],
  by:[
    {q:"📝 Як праходзіць работа?",       a:"1. Прывітанне\n2. Абмеркаванне\n3. Узгадненне\n4. 50% аплата\n5. Выкананне (1–3 дні)\n6. Вынік\n7. Праўкі (3 бясплатных)\n8. Фінал + водгук"},
    {q:"💾 Што я атрымаю?",              a:"✅ Якасны дызайн\n✅ Зыходнікі PSD/AEP\n✅ 3 бясплатных праўкі"},
    {q:"✏️ Колькі праўкі?",              a:"🔄 3 бясплатных\n💰 Дадатковыя асобна"},
    {q:"💳 Як аплаціць?",                a:"💳 Карта любой краіны\n💸 CryptoBot (USDT)\n💵 50%+50%"},
    {q:"⚡ Тэрміновая замова?",           a:"🔥 Ад 3 гадзін\n💸 +20–50%"},
    {q:"📁 Якія фарматы?",               a:"📦 PNG, JPG, PSD, AI, AEP"},
    {q:"🔒 Канфідэнцыяльнасць?",         a:"🔒 Твой праект — толькі твой"},
  ],
};

const T = {
  ru:{appName:"Rival Studio",tagline:"Графический дизайн",homeHero:"Создаю стильные визуалы",homeSub:"Аватарки · Превью · Баннеры · Логотипы",stats:[{v:"50+",l:"Проектов"},{v:"19+",l:"Клиентов"},{v:"1+",l:"Год опыта"},{v:"5★",l:"Рейтинг"}],navHome:"Главная",navGallery:"Галерея",navReviews:"Отзывы",navPricing:"Прайс",navMore:"Ещё",galleryTitle:"Портфолио",gallerySearch:"Поиск работ...",reviewsTitle:"Отзывы",pricingTitle:"Прайс-лист",cartTitle:"Корзина",cartEmpty:"Корзина пуста",addCart:"В корзину",removeCart:"Удалить",clearCart:"Очистить",orderBtn:"Заказать",total:"Итого",discount:"Скидка 10%",finalPrice:"Итого к оплате",aboutTitle:"Обо мне",aboutText:"Я Rival — графический дизайнер с опытом более года. Превращаю идеи в стильные визуалы.\n\nЧто делаю:\n• Аватарки, превью, баннеры\n• Логотипы и брендинг\n• Дизайн для Twitch/YouTube/TikTok",faqTitle:"FAQ",aiTitle:"AI Генератор",aiSub:"Получи уникальную идею для своего дизайна",aiBtn:"Генерировать идею",aiLoading:"Думаю...",aiEmpty:"Нажми кнопку — получи идею",aiHist:"История идей",settingsTitle:"Настройки",settingsTheme:"Тема",settingsLang:"Язык",settingsSound:"Звук",settingsVol:"Громкость",pricingHint:"Цены в {cur} · 1$ = {rate} {cur}",discountNote:"Скидка 10% при заказе 2+ позиций",orderAll:"Заказать всё",quantityLabel:"кол-во",toTelegram:"Написать в Telegram",copied:"Скопировано!",wishlistAdd:"В избранное",wishlistDone:"В избранном",viewGrid:"Сетка",viewList:"Список",sortPop:"По популярности",sortNew:"Новые",sortAlpha:"А–Я",filterAll:"Все",popular:"Популярное",zoomHint:"Нажми для просмотра",reviewSearch:"Поиск по отзывам...",filterByRating:"По рейтингу",allRatings:"Все",contactTg:"Telegram",contactVk:"VK",contactBe:"Behance"},
  en:{appName:"Rival Studio",tagline:"Graphic Design",homeHero:"Creating stylish visuals",homeSub:"Avatars · Previews · Banners · Logos",stats:[{v:"50+",l:"Projects"},{v:"19+",l:"Clients"},{v:"1+",l:"Yr. exp."},{v:"5★",l:"Rating"}],navHome:"Home",navGallery:"Gallery",navReviews:"Reviews",navPricing:"Pricing",navMore:"More",galleryTitle:"Portfolio",gallerySearch:"Search works...",reviewsTitle:"Reviews",pricingTitle:"Pricing",cartTitle:"Cart",cartEmpty:"Cart is empty",addCart:"Add",removeCart:"Remove",clearCart:"Clear",orderBtn:"Order",total:"Total",discount:"10% off",finalPrice:"Final price",aboutTitle:"About me",aboutText:"I'm Rival — a graphic designer with over a year of experience. I turn ideas into stylish visuals.\n\nWhat I do:\n• Avatars, previews, banners\n• Logos and branding\n• Design for Twitch/YouTube/TikTok",faqTitle:"FAQ",aiTitle:"AI Generator",aiSub:"Get a unique idea for your design",aiBtn:"Generate idea",aiLoading:"Thinking...",aiEmpty:"Press the button to get an idea",aiHist:"Idea history",settingsTitle:"Settings",settingsTheme:"Theme",settingsLang:"Language",settingsSound:"Sound",settingsVol:"Volume",pricingHint:"Prices in {cur} · $1 = {rate} {cur}",discountNote:"10% off when ordering 2+ items",orderAll:"Order all",quantityLabel:"qty",toTelegram:"Write on Telegram",copied:"Copied!",wishlistAdd:"Wishlist",wishlistDone:"Wishlisted",viewGrid:"Grid",viewList:"List",sortPop:"Popular",sortNew:"Newest",sortAlpha:"A–Z",filterAll:"All",popular:"Popular",zoomHint:"Tap to view",reviewSearch:"Search reviews...",filterByRating:"By rating",allRatings:"All",contactTg:"Telegram",contactVk:"VK",contactBe:"Behance"},
  ua:{appName:"Rival Studio",tagline:"Графічний дизайн",homeHero:"Створюю стильні візуали",homeSub:"Аватарки · Прев'ю · Банери · Логотипи",stats:[{v:"50+",l:"Проектів"},{v:"19+",l:"Клієнтів"},{v:"1+",l:"Рік досвіду"},{v:"5★",l:"Рейтинг"}],navHome:"Головна",navGallery:"Галерея",navReviews:"Відгуки",navPricing:"Прайс",navMore:"Ще",galleryTitle:"Портфоліо",gallerySearch:"Пошук робіт...",reviewsTitle:"Відгуки",pricingTitle:"Прайс-лист",cartTitle:"Кошик",cartEmpty:"Кошик порожній",addCart:"У кошик",removeCart:"Видалити",clearCart:"Очистити",orderBtn:"Замовити",total:"Всього",discount:"Знижка 10%",finalPrice:"До сплати",aboutTitle:"Про мене",aboutText:"Я Rival — графічний дизайнер з досвідом понад рік.\n\nЩо роблю:\n• Аватарки, прев'ю, банери\n• Логотипи та брендинг\n• Дизайн для Twitch/YouTube/TikTok",faqTitle:"FAQ",aiTitle:"AI Генератор",aiSub:"Отримай унікальну ідею для дизайну",aiBtn:"Генерувати ідею",aiLoading:"Думаю...",aiEmpty:"Натисни кнопку — отримай ідею",aiHist:"Історія ідей",settingsTitle:"Налаштування",settingsTheme:"Тема",settingsLang:"Мова",settingsSound:"Звук",settingsVol:"Гучність",pricingHint:"Ціни в {cur} · 1$ = {rate} {cur}",discountNote:"Знижка 10% при 2+ позиціях",orderAll:"Замовити все",quantityLabel:"к-сть",toTelegram:"Написати в Telegram",copied:"Скопійовано!",wishlistAdd:"В обране",wishlistDone:"В обраному",viewGrid:"Сітка",viewList:"Список",sortPop:"Популярні",sortNew:"Нові",sortAlpha:"А–Я",filterAll:"Всі",popular:"Популярне",zoomHint:"Натисни для перегляду",reviewSearch:"Пошук відгуків...",filterByRating:"За рейтингом",allRatings:"Всі",contactTg:"Telegram",contactVk:"VK",contactBe:"Behance"},
  kz:{appName:"Rival Studio",tagline:"Графикалық дизайн",homeHero:"Стильді визуалдар жасаймын",homeSub:"Аватарлар · Превью · Баннерлер · Логотиптер",stats:[{v:"50+",l:"Жоба"},{v:"19+",l:"Клиент"},{v:"1+",l:"Жыл тәжір."},{v:"5★",l:"Рейтинг"}],navHome:"Басты",navGallery:"Галерея",navReviews:"Пікірлер",navPricing:"Прайс",navMore:"Көбірек",galleryTitle:"Портфолио",gallerySearch:"Жұмыс іздеу...",reviewsTitle:"Пікірлер",pricingTitle:"Баға тізімі",cartTitle:"Себет",cartEmpty:"Себет бос",addCart:"Себетке",removeCart:"Жою",clearCart:"Тазалау",orderBtn:"Тапсыру",total:"Барлығы",discount:"10% жеңілдік",finalPrice:"Соңғы сома",aboutTitle:"Мен туралы",aboutText:"Мен Rival — графикалық дизайнер.\n\nНе істеймін:\n• Аватарлар, превью, баннерлер\n• Логотиптер және брендинг\n• Twitch/YouTube/TikTok дизайны",faqTitle:"FAQ",aiTitle:"AI Генератор",aiSub:"Бірегей дизайн идеясын алыңыз",aiBtn:"Идея жасау",aiLoading:"Ойланып жатырмын...",aiEmpty:"Батырманы басып идея алыңыз",aiHist:"Идеялар тарихы",settingsTitle:"Параметрлер",settingsTheme:"Тема",settingsLang:"Тіл",settingsSound:"Дыбыс",settingsVol:"Дыбыс деңгейі",pricingHint:"Бағалар {cur} · 1$ = {rate} {cur}",discountNote:"2+ тауарға 10% жеңілдік",orderAll:"Барлығын тапсыру",quantityLabel:"саны",toTelegram:"Telegram-ға жазу",copied:"Көшірілді!",wishlistAdd:"Таңдаулыға",wishlistDone:"Таңдаулыда",viewGrid:"Тор",viewList:"Тізім",sortPop:"Танымал",sortNew:"Жаңа",sortAlpha:"А–Я",filterAll:"Барлығы",popular:"Танымал",zoomHint:"Қарау үшін басыңыз",reviewSearch:"Пікір іздеу...",filterByRating:"Рейтинг бойынша",allRatings:"Барлығы",contactTg:"Telegram",contactVk:"VK",contactBe:"Behance"},
  by:{appName:"Rival Studio",tagline:"Графічны дызайн",homeHero:"Стварую стыльныя візуалы",homeSub:"Аватаркі · Прэв'ю · Банеры · Лагатыпы",stats:[{v:"50+",l:"Праектаў"},{v:"19+",l:"Кліентаў"},{v:"1+",l:"Год вопыту"},{v:"5★",l:"Рэйтынг"}],navHome:"Галоўная",navGallery:"Галерэя",navReviews:"Водгукі",navPricing:"Прайс",navMore:"Яшчэ",galleryTitle:"Партфоліа",gallerySearch:"Пошук работ...",reviewsTitle:"Водгукі",pricingTitle:"Прайс-ліст",cartTitle:"Кошык",cartEmpty:"Кошык пусты",addCart:"У кошык",removeCart:"Выдаліць",clearCart:"Ачысціць",orderBtn:"Замовіць",total:"Усяго",discount:"Зніжка 10%",finalPrice:"Да аплаты",aboutTitle:"Пра мяне",aboutText:"Я Rival — графічны дызайнер з досведам больш за год.\n\nШто раблю:\n• Аватаркі, прэв'ю, банеры\n• Лагатыпы і брэндынг\n• Дызайн для Twitch/YouTube/TikTok",faqTitle:"FAQ",aiTitle:"AI Генератар",aiSub:"Атрымай унікальную ідэю для дызайну",aiBtn:"Генераваць ідэю",aiLoading:"Думаю...",aiEmpty:"Націсні кнопку — атрымай ідэю",aiHist:"Гісторыя ідэй",settingsTitle:"Налады",settingsTheme:"Тэма",settingsLang:"Мова",settingsSound:"Гук",settingsVol:"Гучнасць",pricingHint:"Цэны ў {cur} · 1$ = {rate} {cur}",discountNote:"Зніжка 10% пры 2+ пазіцыях",orderAll:"Замовіць усё",quantityLabel:"колькасць",toTelegram:"Напісаць у Telegram",copied:"Скапіравана!",wishlistAdd:"У абранае",wishlistDone:"У абраным",viewGrid:"Сетка",viewList:"Спіс",sortPop:"Папулярнае",sortNew:"Новыя",sortAlpha:"А–Я",filterAll:"Усе",popular:"Папулярнае",zoomHint:"Націсні для прагляду",reviewSearch:"Пошук водгукаў...",filterByRating:"Па рэйтынгу",allRatings:"Усе",contactTg:"Telegram",contactVk:"VK",contactBe:"Behance"},
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🛠 HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ls = { get:(k,d)=>{ try{const v=localStorage.getItem(k); return v?JSON.parse(v):d;}catch{return d;} }, set:(k,v)=>{ try{localStorage.setItem(k,JSON.stringify(v));}catch{} } };
const vibrate = (ms=30) => { try{ navigator.vibrate?.(ms); }catch{} };
const openTg = (path,msg="") => window.open(`https://t.me/${path}${msg?"?text="+encodeURIComponent(msg):""}`, "_blank");

function getGreeting(lang) {
  const h = new Date().getHours();
  const g = h<6?"🌙":h<12?"🌅":h<18?"☀️":"🌆";
  const map = { ru:[g+"Ночи","Доброе утро","Добрый день","Добрый вечер"], en:[g+"Night","Good morning","Good afternoon","Good evening"], ua:[g+"Ночі","Доброго ранку","Добрий день","Добрий вечір"], kz:[g+"Түн","Қайырлы таң","Қайырлы күн","Қайырлы кеш"], by:[g+"Ночы","Добрай раніцы","Добры дзень","Добры вечар"] };
  const idx = h<6?0:h<12?1:h<18?2:3;
  return (map[lang]||map.ru)[idx];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎆 CONFETTI
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Confetti({ active, accent }) {
  const canRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    const pieces = Array.from({length:60},()=>({
      x: Math.random()*canvas.width, y:-10, vx:(Math.random()-0.5)*4,
      vy: Math.random()*4+2, rot: Math.random()*360, rotV:(Math.random()-0.5)*8,
      w: Math.random()*10+4, h: Math.random()*6+3,
      color: [accent,"#fff","#fbbf24","#f472b6","#34d399"][Math.floor(Math.random()*5)],
      life:1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      let alive = false;
      pieces.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.rot+=p.rotV; p.life-=0.008;
        if(p.life>0&&p.y<canvas.height){ alive=true;
          ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
          ctx.globalAlpha=p.life; ctx.fillStyle=p.color;
          ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore();
        }
      });
      if(alive) raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(raf);
  }, [active, accent]);
  return <canvas ref={canRef} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:9999}} />;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🌐 AURORA BACKGROUND
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function AuroraBg({ accent }) {
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      <div style={{
        position:"absolute",width:"600px",height:"600px",borderRadius:"50%",
        background:`radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
        top:"-200px",left:"-100px",
        animation:"auroraMove1 12s ease-in-out infinite alternate",
      }}/>
      <div style={{
        position:"absolute",width:"500px",height:"500px",borderRadius:"50%",
        background:`radial-gradient(circle, ${accent}10 0%, transparent 70%)`,
        bottom:"-150px",right:"-80px",
        animation:"auroraMove2 15s ease-in-out infinite alternate",
      }}/>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔔 TOAST SYSTEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ToastSystem({ toasts }) {
  return (
    <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:9998,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none",width:"min(360px,90vw)"}}>
      {toasts.map(t=>(
        <div key={t.id} style={{
          padding:"10px 18px", borderRadius:14, fontSize:13, fontWeight:700,
          color:"#fff", textAlign:"center",
          background: t.type==="success"?"#10b981":t.type==="error"?"#ef4444":t.type==="warn"?"#f59e0b":"#6366f1",
          boxShadow:"0 8px 24px rgba(0,0,0,.35)",
          animation:"toastIn .35s cubic-bezier(.175,.885,.32,1.275) both",
        }}>{t.msg}</div>
      ))}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📌 BOTTOM NAV
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const NAV_ITEMS = [
  { id:"home",    icon:"⌂",  label:"navHome" },
  { id:"gallery", icon:"◈",  label:"navGallery" },
  { id:"reviews", icon:"✦",  label:"navReviews" },
  { id:"pricing", icon:"◉",  label:"navPricing" },
  { id:"more",    icon:"⋮",  label:"navMore" },
];

function BottomNav({ active, onChange, th, t, cartCount }) {
  return (
    <nav style={{
      position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
      width:"min(480px,100%)",zIndex:200,
      background:th.nav,
      borderTop:`1px solid ${th.border}`,
      display:"grid",gridTemplateColumns:"repeat(5,1fr)",
      padding:"6px 0 calc(6px + env(safe-area-inset-bottom,0px))",
    }}>
      {NAV_ITEMS.map(n=>{
        const isActive = active===n.id;
        return (
          <button key={n.id} onClick={()=>{SFX.tab();vibrate(20);onChange(n.id);}}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,border:"none",background:"none",cursor:"pointer",padding:"4px 0",position:"relative"}}>
            <span style={{
              fontSize:20, transition:"all .25s cubic-bezier(.4,0,.2,1)",
              color: isActive?th.accent:th.sub,
              filter: isActive?`drop-shadow(0 0 6px ${th.accent})`:"none",
              transform: isActive?"scale(1.25)":"scale(1)",
            }}>{n.icon}</span>
            <span style={{fontSize:9.5,fontWeight:700,color:isActive?th.accent:th.sub,letterSpacing:".02em",transition:"color .25s"}}>{t[n.label]}</span>
            {n.id==="pricing"&&cartCount>0&&(
              <span style={{position:"absolute",top:0,right:"18%",width:16,height:16,borderRadius:999,background:"#ef4444",color:"#fff",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 4px rgba(239,68,68,.5)"}}>{cartCount}</span>
            )}
            {isActive&&<div style={{position:"absolute",bottom:-6,width:24,height:2,borderRadius:999,background:th.accent,boxShadow:`0 0 8px ${th.accent}`}}/>}
          </button>
        );
      })}
    </nav>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ◧ SIDE DRAWER (Settings)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function SideDrawer({ open, onClose, th, t, theme, setTheme, lang, setLang, soundOn, setSoundOn, volume, setVolume }) {
  useEffect(()=>{
    if(open) SFX.drawer();
    document.body.style.overflow = open?"hidden":"";
    return()=>{ document.body.style.overflow=""; };
  },[open]);
  if(!open) return null;
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:300,backdropFilter:"blur(4px)",animation:"fadeIn .25s ease"}}/>
      <div style={{
        position:"fixed",left:0,top:0,bottom:0,width:"78vw",maxWidth:320,
        background:th.nav, borderRight:`1px solid ${th.border}`,
        zIndex:301,display:"flex",flexDirection:"column",gap:0,
        animation:"drawerSlide .3s cubic-bezier(.4,0,.2,1) both",
        overflowY:"auto",
      }}>
        {/* Header */}
        <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${th.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:th.text}}>{t.settingsTitle}</div>
            <div style={{fontSize:11,color:th.sub}}>Rival Studio</div>
          </div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:10,border:`1px solid ${th.border}`,background:"none",color:th.sub,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>

        <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:20}}>
          {/* Theme */}
          <div>
            <div style={{fontSize:12,fontWeight:700,color:th.sub,marginBottom:10,letterSpacing:".06em",textTransform:"uppercase"}}>{t.settingsTheme}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {Object.values(THEMES).map(th2=>(
                <button key={th2.id} onClick={()=>{SFX.theme();setTheme(th2);ls.set("rs_theme",th2.id);}}
                  style={{
                    display:"flex",alignItems:"center",gap:8,padding:"10px 12px",
                    borderRadius:12,border:`1px solid ${theme.id===th2.id?th.accent:th.border}`,
                    background: theme.id===th2.id?th.accent+"22":"transparent",
                    cursor:"pointer",transition:"all .2s ease",
                  }}>
                  <span style={{fontSize:16}}>{th2.emoji}</span>
                  <span style={{fontSize:12,fontWeight:600,color:theme.id===th2.id?th.accent:th.text}}>{th2.label}</span>
                  {theme.id===th2.id&&<span style={{marginLeft:"auto",color:th.accent,fontSize:14,fontWeight:800}}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <div style={{fontSize:12,fontWeight:700,color:th.sub,marginBottom:10,letterSpacing:".06em",textTransform:"uppercase"}}>{t.settingsLang}</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {Object.entries(LANGS).map(([code,l])=>(
                <button key={code} onClick={()=>{SFX.lang();setLang(code);ls.set("rs_lang",code);}}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:12,border:`1px solid ${lang===code?th.accent:th.border}`,background:lang===code?th.accent+"18":"transparent",cursor:"pointer",transition:"all .2s ease"}}>
                  <span style={{fontSize:18}}>{l.flag}</span>
                  <span style={{fontSize:13,fontWeight:600,color:lang===code?th.accent:th.text}}>{l.name}</span>
                  {lang===code&&<span style={{marginLeft:"auto",color:th.accent,fontWeight:800}}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Sound */}
          <div>
            <div style={{fontSize:12,fontWeight:700,color:th.sub,marginBottom:10,letterSpacing:".06em",textTransform:"uppercase"}}>{t.settingsSound}</div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <button onClick={()=>{const n=!soundOn;setSoundOn(n);_soundEnabled=n;ls.set("rs_sound",n);SFX.toggle();}}
                style={{
                  flex:1,padding:"11px",borderRadius:12,border:`1px solid ${th.border}`,
                  background:soundOn?th.accent:"transparent",cursor:"pointer",transition:"all .2s",
                  color:soundOn?th.btnTxt:th.sub,fontWeight:700,fontSize:13,
                }}>
                {soundOn?"🔊 ON":"🔇 OFF"}
              </button>
            </div>
            <div style={{fontSize:12,color:th.sub,marginBottom:8}}>{t.settingsVol}: {Math.round(volume*100)}%</div>
            <input type="range" min={0} max={1} step={0.05} value={volume}
              onChange={e=>{const v=+e.target.value;setVolume(v);_volume=v;ls.set("rs_volume",v);}}
              style={{width:"100%",accentColor:th.accent}}/>
          </div>

          {/* App info */}
          <div style={{padding:"14px",borderRadius:12,border:`1px solid ${th.border}`,background:th.surface,textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:4}}>✦</div>
            <div style={{fontSize:14,fontWeight:800,color:th.text}}>Rival Studio</div>
            <div style={{fontSize:11,color:th.sub}}>v2.0 · © 2025 @Rivaldsg</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🏠 HOME TAB
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function HomeTab({ th, t, lang, onGoGallery, onGoReviews, onGoPricing, onGoMore, wishlistCount, cartCount }) {
  const [counter, setCounter] = useState({p:0,c:0,y:0,r:0});
  const [typed, setTyped] = useState("");
  const fullText = t.homeHero;

  // Typing animation
  useEffect(()=>{
    setTyped(""); let i=0;
    const interval = setInterval(()=>{
      if(i<fullText.length){ setTyped(fullText.slice(0,i+1)); i++; }
      else clearInterval(interval);
    },50);
    return()=>clearInterval(interval);
  },[fullText]);

  // Counter animation
  useEffect(()=>{
    const targets = {p:50,c:19,y:1,r:5};
    let frame=0; const total=60;
    const raf = setInterval(()=>{
      frame++;
      const ratio = Math.min(frame/total,1);
      const ease = 1-Math.pow(1-ratio,3);
      setCounter({p:Math.round(targets.p*ease),c:Math.round(targets.c*ease),y:Math.round(targets.y*ease),r:Math.round(targets.r*ease)});
      if(frame>=total) clearInterval(raf);
    },16);
    return()=>clearInterval(raf);
  },[]);

  const statValues = [counter.p+"+", counter.c+"+", counter.y+"+", counter.r+"★"];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Hero Card */}
      <div style={{
        position:"relative",overflow:"hidden",
        background:th.surface,borderRadius:24,
        border:`1px solid ${th.border}`,
        padding:"28px 22px 22px",
        boxShadow:th.shadow,
      }}>
        {/* Decorative orb */}
        <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${th.accent}25,transparent 70%)`,pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:999,background:th.accent+"20",border:`1px solid ${th.accent}40`,marginBottom:14}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:th.accent,display:"inline-block",boxShadow:`0 0 6px ${th.accent}`,animation:"ping 1.5s ease infinite"}}/>
            <span style={{fontSize:11,fontWeight:700,color:th.accent,letterSpacing:".04em"}}>AVAILABLE FOR ORDERS</span>
          </div>
          <div style={{fontSize:26,fontWeight:900,color:th.text,lineHeight:1.2,marginBottom:6,letterSpacing:"-.03em",minHeight:"1.2em"}}>
            {typed}<span style={{animation:"blink 1s step-end infinite",color:th.accent}}>|</span>
          </div>
          <div style={{fontSize:13,color:th.sub,marginBottom:20}}>{t.homeSub}</div>
          <button onClick={()=>{SFX.order();openTg("Rivaldsg","Привет! Хочу заказать дизайн");}}
            style={{
              display:"inline-flex",alignItems:"center",gap:8,
              background:th.grad,color:th.btnTxt,border:"none",borderRadius:14,
              padding:"13px 22px",fontSize:14,fontWeight:800,cursor:"pointer",
              boxShadow:th.shadow,letterSpacing:".01em",transition:"transform .2s",
            }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
          >
            <span style={{fontSize:16}}>✈</span> {t.toTelegram}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
        {t.stats.map((s,i)=>(
          <div key={i} style={{
            background:th.card,borderRadius:16,border:`1px solid ${th.border}`,
            padding:"14px 8px",textAlign:"center",
            animation:`cardIn .4s ease ${i*.08}s both`,
          }}>
            <div style={{fontSize:18,fontWeight:900,color:th.accent,letterSpacing:"-.02em"}}>{statValues[i]}</div>
            <div style={{fontSize:10,color:th.sub,marginTop:2,fontWeight:600}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[
          {icon:"◈",label:t.navGallery,  color:th.accent, action:onGoGallery},
          {icon:"✦",label:t.navReviews, color:"#f472b6",  action:onGoReviews},
          {icon:"◉",label:t.navPricing, color:"#fbbf24",  action:onGoPricing},
          {icon:"⋮",label:t.navMore,    color:"#34d399",  action:onGoMore},
        ].map((a,i)=>(
          <button key={i} onClick={()=>{SFX.tab();vibrate(15);a.action();}}
            style={{
              display:"flex",alignItems:"center",gap:12,padding:"16px 16px",
              borderRadius:18,border:`1px solid ${th.border}`,background:th.card,cursor:"pointer",
              textAlign:"left",transition:"all .2s",animation:`cardIn .4s ease ${i*.07+.1}s both`,
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=a.color;e.currentTarget.style.boxShadow=`0 0 14px ${a.color}30`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=th.border;e.currentTarget.style.boxShadow="none";}}>
            <div style={{width:40,height:40,borderRadius:12,background:`${a.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:a.color,flexShrink:0}}>{a.icon}</div>
            <span style={{fontSize:13,fontWeight:700,color:th.text}}>{a.label}</span>
            <span style={{marginLeft:"auto",color:th.sub,fontSize:14}}>›</span>
          </button>
        ))}
      </div>

      {/* Recent Work Preview */}
      <div style={{background:th.card,borderRadius:20,border:`1px solid ${th.border}`,overflow:"hidden"}}>
        <div style={{padding:"14px 16px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:14,fontWeight:800,color:th.text}}>{t.popular}</div>
          <button onClick={onGoGallery} style={{fontSize:12,color:th.accent,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>→</button>
        </div>
        <Swiper spaceBetween={10} slidesPerView="auto" style={{padding:"0 16px 16px"}}>
          {(GALLERY[lang]||GALLERY.ru).filter(i=>i.popular).map((item,i)=>(
            <SwiperSlide key={item.id} style={{width:140}}>
              <div style={{borderRadius:14,overflow:"hidden",border:`1px solid ${th.border}`,animation:`cardIn .4s ease ${i*.07}s both`}}>
                <img src={item.img} alt={item.title} style={{width:"100%",height:90,objectFit:"cover",display:"block"}}/>
                <div style={{padding:"8px 10px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:th.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.title}</div>
                  <div style={{fontSize:10,color:th.sub,marginTop:2}}>{item.cat}</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* My links quick */}
      <div style={{display:"flex",gap:8}}>
        {[{icon:"✈",label:"Telegram",url:"https://t.me/Rivaldsg",color:"#229ED9"},{icon:"🔵",label:"VK",url:"https://vk.com/rivaldsg",color:"#4C75A3"},{icon:"◈",label:"Behance",url:"https://behance.net/rivaldsg",color:"#1769FF"}].map(s=>(
          <button key={s.label} onClick={()=>{SFX.tap();window.open(s.url,"_blank");}}
            style={{
              flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,
              padding:"12px 8px",borderRadius:14,border:`1px solid ${th.border}`,
              background:th.card,cursor:"pointer",transition:"all .2s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color;e.currentTarget.style.background=s.color+"12";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=th.border;e.currentTarget.style.background=th.card;}}>
            <span style={{fontSize:18,color:s.color}}>{s.icon}</span>
            <span style={{fontSize:10,fontWeight:700,color:th.sub}}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🖼 GALLERY TAB
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function GalleryTab({ th, t, lang, wishlist, toggleWishlist, onOpenImage }) {
  const items = GALLERY[lang]||GALLERY.ru;
  const cats = useMemo(()=>["all",...[...new Set(items.map(i=>i.cat))]],[items]);
  const [cat,setCat] = useState("all");
  const [search,setSearch] = useState("");
  const [view,setView] = useState("grid"); // grid | list
  const [sort,setSort] = useState("pop"); // pop | new | alpha
  const [showFilter,setShowFilter] = useState(false);

  const filtered = useMemo(()=>{
    let r = items.filter(i=>(cat==="all"||i.cat===cat)&&(search===""||i.title.toLowerCase().includes(search.toLowerCase())||i.desc.toLowerCase().includes(search.toLowerCase())||i.tags.some(t=>t.includes(search.toLowerCase()))));
    if(sort==="pop") r = [...r].sort((a,b)=>(b.popular?1:0)-(a.popular?1:0));
    if(sort==="new") r = [...r].reverse();
    if(sort==="alpha") r = [...r].sort((a,b)=>a.title.localeCompare(b.title));
    return r;
  },[items,cat,search,sort]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {/* Title row */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:22,fontWeight:900,color:th.text,letterSpacing:"-.02em"}}>{t.galleryTitle}</div>
          <div style={{fontSize:12,color:th.sub}}>{filtered.length} {lang==="ru"||lang==="by"?"работ":lang==="ua"?"робіт":lang==="kz"?"жұмыс":"works"}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{SFX.filter();setView(v=>v==="grid"?"list":"grid");}} style={{width:36,height:36,borderRadius:10,border:`1px solid ${th.border}`,background:th.card,color:th.sub,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{view==="grid"?"≡":"⊞"}</button>
          <button onClick={()=>{SFX.filter();setShowFilter(s=>!s);}} style={{width:36,height:36,borderRadius:10,border:`1px solid ${showFilter?th.accent:th.border}`,background:showFilter?th.accent+"22":th.card,color:showFilter?th.accent:th.sub,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>⊿</button>
        </div>
      </div>

      {/* Search */}
      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:th.sub}}>◎</span>
        <input value={search} onChange={e=>{setSearch(e.target.value);SFX.search();}}
          placeholder={t.gallerySearch}
          style={{width:"100%",padding:"10px 12px 10px 36px",borderRadius:14,border:`1px solid ${th.border}`,background:th.card,color:th.text,fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
        {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:th.sub,cursor:"pointer",fontSize:16}}>✕</button>}
      </div>

      {/* Sort */}
      {showFilter&&(
        <div style={{display:"flex",gap:6,animation:"fadeDown .2s ease"}}>
          {[["pop",t.sortPop],["new",t.sortNew],["alpha",t.sortAlpha]].map(([v,l])=>(
            <button key={v} onClick={()=>{SFX.filter();setSort(v);}} style={{flex:1,padding:"8px 6px",borderRadius:10,border:`1px solid ${sort===v?th.accent:th.border}`,background:sort===v?th.accent+"22":"transparent",color:sort===v?th.accent:th.sub,fontSize:11,fontWeight:700,cursor:"pointer"}}>{l}</button>
          ))}
        </div>
      )}

      {/* Category pills */}
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2,scrollbarWidth:"none"}}>
        {cats.map(c=>{
          const active=cat===c;
          const icon = c==="all"?"◆":(CAT_ICONS[c]||"◈");
          return (
            <button key={c} onClick={()=>{setCat(c);SFX.filter();vibrate(10);}}
              style={{
                whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5,
                padding:"7px 14px",borderRadius:999,fontSize:12,fontWeight:700,cursor:"pointer",
                background:active?th.grad:"transparent",
                color:active?th.btnTxt:th.sub,
                border:`1px solid ${active?"transparent":th.border}`,
                boxShadow:active?th.shadow:"none",transition:"all .22s",flexShrink:0,
              }}>
              <span>{icon}</span> {c==="all"?t.filterAll:c}
            </button>
          );
        })}
      </div>

      {/* Items */}
      {filtered.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:th.sub}}>
          <div style={{fontSize:40,marginBottom:12}}>◎</div>
          <div style={{fontSize:14}}>{lang==="ru"?"Ничего не найдено":lang==="en"?"Nothing found":lang==="ua"?"Нічого не знайдено":lang==="kz"?"Ештеңе табылмады":"Нічога не знойдзена"}</div>
        </div>
      ):view==="grid"?(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {filtered.map((item,i)=>{
            const wl = wishlist.includes(item.id);
            return (
              <div key={item.id} style={{borderRadius:18,overflow:"hidden",background:th.card,border:`1px solid ${th.border}`,cursor:"pointer",animation:`cardIn .35s ease ${i*.04}s both`,position:"relative",transition:"box-shadow .2s"}}
                onMouseEnter={e=>e.currentTarget.style.boxShadow=th.shadow}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                <div onClick={()=>{onOpenImage(item);SFX.open();vibrate(20);}} style={{position:"relative"}}>
                  <img src={item.img} alt={item.title} style={{width:"100%",height:110,objectFit:"cover",display:"block"}}/>
                  {item.popular&&<div style={{position:"absolute",top:6,left:6,padding:"2px 7px",borderRadius:999,background:th.accent,color:th.btnTxt,fontSize:9,fontWeight:800}}>★ TOP</div>}
                </div>
                <div style={{padding:"9px 10px 10px"}}>
                  <div style={{fontSize:12,fontWeight:700,color:th.text,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.title}</div>
                  <div style={{fontSize:10,color:th.sub,marginBottom:8}}>{item.desc}</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{fontSize:9,color:th.accent,fontWeight:600}}>{t.zoomHint}</div>
                    <button onClick={e=>{e.stopPropagation();toggleWishlist(item.id);SFX.wishlist();vibrate(15);}}
                      style={{width:24,height:24,borderRadius:8,border:`1px solid ${wl?th.accent:th.border}`,background:wl?th.accent+"22":"transparent",color:wl?th.accent:th.sub,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>♡</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {filtered.map((item,i)=>{
            const wl = wishlist.includes(item.id);
            return (
              <div key={item.id} onClick={()=>{onOpenImage(item);SFX.open();}} style={{
                display:"flex",gap:12,alignItems:"center",
                background:th.card,borderRadius:16,border:`1px solid ${th.border}`,padding:"10px 12px",cursor:"pointer",
                animation:`cardIn .3s ease ${i*.04}s both`,transition:"box-shadow .2s",
              }}
                onMouseEnter={e=>e.currentTarget.style.boxShadow=th.shadow}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                <img src={item.img} alt={item.title} style={{width:64,height:48,objectFit:"cover",borderRadius:10,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:th.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.title}</div>
                  <div style={{fontSize:11,color:th.sub}}>{item.cat} · {item.desc}</div>
                  {item.popular&&<div style={{fontSize:9,color:th.accent,fontWeight:700,marginTop:2}}>★ TOP</div>}
                </div>
                <button onClick={e=>{e.stopPropagation();toggleWishlist(item.id);SFX.wishlist();}}
                  style={{width:30,height:30,borderRadius:9,border:`1px solid ${wl?th.accent:th.border}`,background:wl?th.accent+"22":"transparent",color:wl?th.accent:th.sub,cursor:"pointer",fontSize:14,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>♡</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ✦ REVIEWS TAB
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ReviewsTab({ th, t, lang }) {
  const [likes, setLikes] = useState(()=>ls.get("rs_likes",{}));
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0); // 0 = all
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(()=>REVIEWS.filter(r=>
    (ratingFilter===0||r.rating===ratingFilter)&&
    (search===""||r.name.toLowerCase().includes(search.toLowerCase())||r.text.toLowerCase().includes(search.toLowerCase()))
  ),[search,ratingFilter]);

  const likeReview = (id) => {
    SFX.like(); vibrate(20);
    setLikes(prev=>{
      const n = {...prev, [id]:(prev[id]||0)+1};
      ls.set("rs_likes",n); return n;
    });
  };

  const avgRating = (REVIEWS.reduce((s,r)=>s+r.rating,0)/REVIEWS.length).toFixed(1);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {/* Header */}
      <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:22,fontWeight:900,color:th.text,letterSpacing:"-.02em"}}>{t.reviewsTitle}</div>
          <div style={{fontSize:12,color:th.sub}}>{REVIEWS.length} {lang==="ru"||lang==="by"?"отзывов":lang==="ua"?"відгуків":lang==="kz"?"пікір":"reviews"}</div>
        </div>
        {/* Rating summary */}
        <div style={{background:th.card,borderRadius:14,border:`1px solid ${th.border}`,padding:"10px 14px",textAlign:"center",flexShrink:0}}>
          <div style={{fontSize:24,fontWeight:900,color:th.accent}}>{avgRating}</div>
          <div style={{fontSize:12,color:"#fbbf24"}}>★★★★★</div>
        </div>
      </div>

      {/* Search */}
      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:th.sub}}>◎</span>
        <input value={search} onChange={e=>{setSearch(e.target.value);SFX.search();}}
          placeholder={t.reviewSearch}
          style={{width:"100%",padding:"10px 12px 10px 36px",borderRadius:14,border:`1px solid ${th.border}`,background:th.card,color:th.text,fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
        {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:th.sub,cursor:"pointer",fontSize:16}}>✕</button>}
      </div>

      {/* Rating filter */}
      <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none"}}>
        {[0,5,4,3,2,1].map(r=>(
          <button key={r} onClick={()=>{setRatingFilter(r);SFX.filter();}}
            style={{
              whiteSpace:"nowrap",padding:"6px 12px",borderRadius:999,fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0,
              background:ratingFilter===r?th.accent+"22":"transparent",
              color:ratingFilter===r?th.accent:th.sub,
              border:`1px solid ${ratingFilter===r?th.accent:th.border}`,transition:"all .2s",
            }}>
            {r===0?t.allRatings:"★".repeat(r)}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map((r,i)=>{
          const likeCount = (likes[r.id]||0)+r.liked;
          const exp = expanded===r.id;
          return (
            <div key={r.id} style={{
              background:th.card,borderRadius:18,border:`1px solid ${th.border}`,
              padding:"14px 16px",animation:`cardIn .35s ease ${i*.04}s both`,transition:"box-shadow .2s",
            }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow=th.shadow}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
              {/* Top row */}
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:40,height:40,borderRadius:14,background:th.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:900,color:th.btnTxt,flexShrink:0,boxShadow:th.shadow}}>
                  {r.name[0]}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:800,color:th.text}}>{r.name}</div>
                  <div style={{fontSize:10,color:th.accent,marginTop:1}}>@{r.tg}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                  <div style={{fontSize:12,color:"#fbbf24"}}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
                </div>
              </div>
              {/* Text */}
              <p style={{fontSize:13,color:th.sub,lineHeight:1.6,margin:"0 0 12px",cursor:"pointer",display:"-webkit-box",WebkitLineClamp:exp?100:2,WebkitBoxOrient:"vertical",overflow:"hidden",textOverflow:"ellipsis"}}
                onClick={()=>setExpanded(exp?null:r.id)}>"{r.text}"</p>
              {/* Actions */}
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <button onClick={()=>{window.open(`https://t.me/${r.tg}`,"_blank");SFX.tap();}}
                  style={{fontSize:11,color:th.accent,background:th.accent+"15",border:`1px solid ${th.accent}40`,borderRadius:8,padding:"5px 10px",cursor:"pointer",fontWeight:700}}>
                  ✈ Telegram
                </button>
                <button onClick={()=>likeReview(r.id)}
                  style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:likeCount>0?th.accent:th.sub,background:likeCount>0?th.accent+"15":"transparent",border:`1px solid ${likeCount>0?th.accent+"40":th.border}`,borderRadius:8,padding:"5px 10px",cursor:"pointer",fontWeight:700,transition:"all .2s"}}>
                  ♡ {likeCount>0?likeCount:""}
                </button>
                <button onClick={()=>setExpanded(exp?null:r.id)}
                  style={{marginLeft:"auto",fontSize:11,color:th.sub,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>
                  {exp?"↑":"↓"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length===0&&(
        <div style={{textAlign:"center",padding:"40px 20px",color:th.sub}}>
          <div style={{fontSize:40,marginBottom:10}}>✦</div>
          <div>{lang==="ru"?"Ничего не найдено":lang==="en"?"Nothing found":lang==="ua"?"Нічого не знайдено":lang==="kz"?"Ештеңе табылмады":"Нічога не знойдзена"}</div>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ◉ PRICING TAB
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function PricingTab({ th, t, lang, cart, addToCart, removeFromCart, updateQty, clearCart, showToast }) {
  const L = LANGS[lang]||LANGS.ru;
  const fmt = (usd) => `${Math.round(usd*L.rate)} ${L.cur}`;
  const hint = t.pricingHint.replace("{cur}",L.cur).replace("{rate}",L.rate).replace("{cur}",L.cur);

  const cartTotal = useMemo(()=>{
    const items = cart.reduce((s,i)=>s+i.qty,0);
    const sub   = cart.reduce((s,i)=>s+i.priceUSD*i.qty,0);
    const disc  = items>=2?sub*.1:0;
    return {items,sub,disc,total:sub-disc};
  },[cart]);

  const getSvcName = (svc) => svc[lang]||svc.en;
  const getSvcDesc = (svc) => lang==="en"?svc.descEn:svc.descRu;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div>
        <div style={{fontSize:22,fontWeight:900,color:th.text,letterSpacing:"-.02em"}}>{t.pricingTitle}</div>
        <div style={{fontSize:12,color:th.sub,marginTop:2}}>{hint}</div>
      </div>

      {/* Currency hint */}
      <div style={{padding:"10px 14px",borderRadius:12,background:th.accent+"18",border:`1px solid ${th.accent}40`,fontSize:12,color:th.accent,fontWeight:600}}>
        {t.discountNote}
      </div>

      {/* Services */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {SERVICES.map((svc,i)=>{
          const inCart = cart.find(c=>c.id===svc.id);
          return (
            <div key={svc.id} style={{
              background:th.card,borderRadius:20,border:`1px solid ${inCart?th.accent:th.border}`,
              padding:"16px",transition:"all .25s",
              boxShadow:inCart?th.shadow:"none",
              animation:`cardIn .4s ease ${i*.08}s both`,
            }}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:48,height:48,borderRadius:15,background:th.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,boxShadow:th.shadow}}>{svc.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:15,fontWeight:800,color:th.text}}>{getSvcName(svc)}</div>
                  <div style={{fontSize:11,color:th.sub,marginTop:2}}>{getSvcDesc(svc)}</div>
                </div>
                <div style={{fontSize:20,fontWeight:900,color:th.accent,flexShrink:0}}>{fmt(svc.priceUSD)}</div>
              </div>

              {/* Cart controls */}
              <div style={{marginTop:14,display:"flex",gap:8,alignItems:"center"}}>
                {!inCart?(
                  <button onClick={()=>{addToCart(svc,getSvcName(svc));showToast(getSvcName(svc)+" → 🛒","success");SFX.addCart();vibrate(30);}}
                    style={{flex:1,background:th.grad,color:th.btnTxt,border:"none",borderRadius:12,padding:"11px",fontSize:13,fontWeight:800,cursor:"pointer",boxShadow:th.shadow}}>
                    {t.addCart}
                  </button>
                ):(
                  <>
                    <button onClick={()=>{updateQty(svc.id,inCart.qty-1);SFX.tap();}} style={{width:38,height:38,borderRadius:11,border:`1px solid ${th.border}`,background:"transparent",color:th.text,cursor:"pointer",fontSize:18,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                    <div style={{flex:1,textAlign:"center"}}>
                      <div style={{fontSize:18,fontWeight:900,color:th.accent}}>{inCart.qty}</div>
                      <div style={{fontSize:10,color:th.sub}}>{t.quantityLabel}</div>
                    </div>
                    <button onClick={()=>{updateQty(svc.id,inCart.qty+1);SFX.tap();}} style={{width:38,height:38,borderRadius:11,border:"none",background:th.accent,color:th.btnTxt,cursor:"pointer",fontSize:18,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                    <button onClick={()=>{removeFromCart(svc.id);SFX.remove();}} style={{width:38,height:38,borderRadius:11,border:`1px solid #ef444440`,background:"#ef444418",color:"#ef4444",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      {cart.length>0&&(
        <div style={{background:th.surface,borderRadius:20,border:`1px solid ${th.border}`,padding:"18px",animation:"cardIn .3s ease both"}}>
          <div style={{fontSize:14,fontWeight:800,color:th.text,marginBottom:14}}>{t.cartTitle}</div>
          {cart.map(item=>(
            <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,fontSize:13}}>
              <span style={{color:th.sub}}>{item.name} ×{item.qty}</span>
              <span style={{color:th.text,fontWeight:700}}>{fmt(item.priceUSD*item.qty)}</span>
            </div>
          ))}
          <div style={{borderTop:`1px solid ${th.border}`,marginTop:10,paddingTop:10}}>
            {cartTotal.disc>0&&(
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#10b981",fontWeight:700,marginBottom:6}}>
                <span>{t.discount}</span><span>−{fmt(cartTotal.disc)}</span>
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:900}}>
              <span style={{color:th.text}}>{t.finalPrice}</span>
              <span style={{color:th.accent}}>{fmt(cartTotal.total)}</span>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <button onClick={()=>{clearCart();SFX.clear();}} style={{padding:"10px 16px",borderRadius:12,border:`1px solid ${th.border}`,background:"transparent",color:th.sub,cursor:"pointer",fontSize:12,fontWeight:700}}>{t.clearCart}</button>
            <button onClick={()=>{
              SFX.order();vibrate(40);
              const list=cart.map(i=>`${i.name} ×${i.qty}`).join(", ");
              openTg("Rivaldsg",`Привет! Заказываю: ${list}. Сумма: ${fmt(cartTotal.total)}`);
            }} style={{flex:1,background:th.grad,color:th.btnTxt,border:"none",borderRadius:12,padding:"11px",fontSize:13,fontWeight:800,cursor:"pointer",boxShadow:th.shadow}}>
              {t.orderAll} — {fmt(cartTotal.total)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⋮ MORE TAB (About + FAQ + AI)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function MoreTab({ th, t, lang, showToast }) {
  const [section, setSection] = useState("about"); // about | faq | ai
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [aiIdea, setAiIdea] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState(()=>ls.get("rs_ai_hist",[]));
  const [aiSaved, setAiSaved] = useState(()=>ls.get("rs_ai_saved",[]));

  const faq = FAQ_DATA[lang]||FAQ_DATA.ru;
  const ideas = AI_IDEAS;

  const genIdea = () => {
    SFX.ai(); setAiLoading(true);
    setTimeout(()=>{
      const pool = ideas.filter(i=>!aiHistory.slice(-5).includes(i));
      const list = pool.length>0?pool:ideas;
      const idea = list[Math.floor(Math.random()*list.length)];
      setAiIdea(idea);
      const nh = [...aiHistory.slice(-9),idea];
      setAiHistory(nh); ls.set("rs_ai_hist",nh);
      setAiLoading(false); SFX.aiDone(); vibrate(40);
      showToast("✧ Идея сгенерирована!","success");
    }, 1100+Math.random()*700);
  };

  const saveIdea = (idea) => {
    SFX.wishlist();
    const ns = aiSaved.includes(idea)?aiSaved.filter(i=>i!==idea):[...aiSaved,idea];
    setAiSaved(ns); ls.set("rs_ai_saved",ns);
    showToast(aiSaved.includes(idea)?"Удалено из сохранённых":"Идея сохранена ♡","success");
  };

  const copyIdea = (idea) => {
    SFX.copy();
    try{ navigator.clipboard.writeText(idea); }catch{}
    showToast(t.copied,"success");
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {/* Section switcher */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
        {[["about",t.aboutTitle,"◎"],["faq",t.faqTitle,"?"],["ai",t.aiTitle,"✧"]].map(([id,label,icon])=>(
          <button key={id} onClick={()=>{setSection(id);SFX.tab();}}
            style={{
              display:"flex",flexDirection:"column",alignItems:"center",gap:4,
              padding:"12px 8px",borderRadius:16,border:`1px solid ${section===id?th.accent:th.border}`,
              background:section===id?th.accent+"22":th.card,cursor:"pointer",transition:"all .22s",
            }}>
            <span style={{fontSize:20,color:section===id?th.accent:th.sub}}>{icon}</span>
            <span style={{fontSize:11,fontWeight:700,color:section===id?th.accent:th.sub}}>{label}</span>
          </button>
        ))}
      </div>

      {/* ── ABOUT ── */}
      {section==="about"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10,animation:"cardIn .35s ease both"}}>
          {/* Profile card */}
          <div style={{background:th.card,borderRadius:22,border:`1px solid ${th.border}`,overflow:"hidden"}}>
            <div style={{height:90,background:th.grad,position:"relative"}}>
              <div style={{position:"absolute",bottom:-28,left:20,width:56,height:56,borderRadius:18,background:th.surface,border:`3px solid ${th.card}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,boxShadow:th.shadow}}>✦</div>
            </div>
            <div style={{padding:"36px 20px 20px"}}>
              <div style={{fontSize:20,fontWeight:900,color:th.text}}>Rival</div>
              <div style={{fontSize:12,color:th.accent,fontWeight:700,marginBottom:10}}>@Rivaldsg · Graphic Designer</div>
              <p style={{fontSize:13,color:th.sub,lineHeight:1.7,whiteSpace:"pre-line",margin:0}}>{t.aboutText}</p>
            </div>
          </div>

          {/* Social Links */}
          <div style={{background:th.card,borderRadius:20,border:`1px solid ${th.border}`,padding:"16px"}}>
            <div style={{fontSize:13,fontWeight:800,color:th.text,marginBottom:12}}>Соцсети & контакты</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {icon:"✈",label:"Telegram",      sub:"@Rivaldsg",      url:"https://t.me/Rivaldsg",           color:"#229ED9"},
                {icon:"▶",label:"VK",             sub:"vk.com/rivaldsg",url:"https://vk.com/rivaldsg",         color:"#4C75A3"},
                {icon:"◈",label:"Behance",        sub:"Portfolio",       url:"https://behance.net/rivaldsg",    color:"#1769FF"},
              ].map(s=>(
                <button key={s.label} onClick={()=>{window.open(s.url,"_blank");SFX.tap();}}
                  style={{
                    display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                    borderRadius:14,border:`1px solid ${th.border}`,background:"transparent",cursor:"pointer",
                    width:"100%",transition:"all .2s",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color;e.currentTarget.style.background=s.color+"12";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=th.border;e.currentTarget.style.background="transparent";}}>
                  <div style={{width:38,height:38,borderRadius:12,background:s.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:s.color,flexShrink:0}}>{s.icon}</div>
                  <div style={{flex:1,textAlign:"left"}}>
                    <div style={{fontSize:13,fontWeight:700,color:th.text}}>{s.label}</div>
                    <div style={{fontSize:11,color:th.sub}}>{s.sub}</div>
                  </div>
                  <span style={{color:th.sub,fontSize:16}}>›</span>
                </button>
              ))}
            </div>
          </div>

          {/* Order CTA */}
          <button onClick={()=>{SFX.order();vibrate(40);openTg("Rivaldsg","Привет! Хочу заказать дизайн");}}
            style={{background:th.grad,color:th.btnTxt,border:"none",borderRadius:18,padding:"16px",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:th.shadow,letterSpacing:".01em"}}>
            ✈ {t.toTelegram}
          </button>
        </div>
      )}

      {/* ── FAQ ── */}
      {section==="faq"&&(
        <div style={{display:"flex",flexDirection:"column",gap:8,animation:"cardIn .35s ease both"}}>
          <div style={{fontSize:18,fontWeight:900,color:th.text,marginBottom:2}}>{t.faqTitle}</div>
          {faq.map((item,i)=>{
            const exp = expandedFaq===i;
            return (
              <div key={i} style={{
                background:th.card,borderRadius:18,border:`1px solid ${exp?th.accent:th.border}`,
                overflow:"hidden",transition:"border-color .22s",
                boxShadow:exp?th.shadow:"none",animation:`cardIn .3s ease ${i*.06}s both`,
              }}>
                <button onClick={()=>{setExpandedFaq(exp?null:i);SFX.faq();}}
                  style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",background:"none",border:"none",color:th.text,cursor:"pointer",fontSize:13,fontWeight:700,gap:10,textAlign:"left",fontFamily:"inherit"}}>
                  <span style={{flex:1}}>{item.q}</span>
                  <span style={{color:th.accent,fontSize:20,fontWeight:300,flexShrink:0,transition:"transform .25s",transform:exp?"rotate(45deg)":"none"}}>+</span>
                </button>
                {exp&&(
                  <div style={{padding:"0 16px 16px",fontSize:13,color:th.sub,lineHeight:1.7,whiteSpace:"pre-line",animation:"fadeDown .25s ease"}}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── AI ── */}
      {section==="ai"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12,animation:"cardIn .35s ease both"}}>
          <div>
            <div style={{fontSize:18,fontWeight:900,color:th.text}}>{t.aiTitle}</div>
            <div style={{fontSize:12,color:th.sub,marginTop:2}}>{t.aiSub}</div>
          </div>

          {/* Result */}
          <div style={{
            minHeight:120,background:th.card,borderRadius:20,border:`1px solid ${aiIdea?th.accent:th.border}`,
            padding:"20px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            transition:"border-color .3s,box-shadow .3s",
            boxShadow:aiIdea?th.shadow:"none",gap:12,
          }}>
            {aiLoading?(
              <div style={{textAlign:"center",color:th.sub}}>
                <div style={{fontSize:36,animation:"spin 1s linear infinite",display:"inline-block",marginBottom:10}}>✧</div>
                <div style={{fontSize:13,fontWeight:600}}>{t.aiLoading}</div>
              </div>
            ):aiIdea?(
              <>
                <p style={{fontSize:14,color:th.text,lineHeight:1.7,margin:0,textAlign:"center"}}>{aiIdea}</p>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>copyIdea(aiIdea)} style={{padding:"7px 14px",borderRadius:10,border:`1px solid ${th.border}`,background:"transparent",color:th.sub,cursor:"pointer",fontSize:12,fontWeight:700}}>⎘ Copy</button>
                  <button onClick={()=>saveIdea(aiIdea)} style={{padding:"7px 14px",borderRadius:10,border:`1px solid ${aiSaved.includes(aiIdea)?th.accent:th.border}`,background:aiSaved.includes(aiIdea)?th.accent+"22":"transparent",color:aiSaved.includes(aiIdea)?th.accent:th.sub,cursor:"pointer",fontSize:12,fontWeight:700}}>
                    {aiSaved.includes(aiIdea)?"♥ Saved":"♡ Save"}
                  </button>
                </div>
              </>
            ):(
              <div style={{textAlign:"center",color:th.sub}}>
                <div style={{fontSize:40,marginBottom:10}}>✧</div>
                <div style={{fontSize:13}}>{t.aiEmpty}</div>
              </div>
            )}
          </div>

          <button onClick={genIdea} disabled={aiLoading}
            style={{
              background:aiLoading?"transparent":th.grad,color:aiLoading?th.sub:th.btnTxt,
              border:aiLoading?`1px solid ${th.border}`:"none",
              borderRadius:16,padding:"15px",fontSize:15,fontWeight:800,cursor:aiLoading?"not-allowed":"pointer",
              boxShadow:aiLoading?"none":th.shadow,transition:"all .3s",
              animation:!aiLoading?"glowPulse 3s ease infinite":"none",
            }}>
            {aiLoading?"...":t.aiBtn}
          </button>

          {/* History */}
          {aiHistory.length>0&&(
            <div style={{background:th.card,borderRadius:18,border:`1px solid ${th.border}`,padding:"14px"}}>
              <div style={{fontSize:12,fontWeight:800,color:th.sub,marginBottom:10,letterSpacing:".05em",textTransform:"uppercase"}}>{t.aiHist}</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {[...aiHistory].reverse().slice(0,5).map((idea,i)=>(
                  <div key={i} onClick={()=>{setAiIdea(idea);SFX.tap();}} style={{
                    fontSize:12,color:th.sub,padding:"9px 12px",borderRadius:10,
                    border:`1px solid ${th.border}`,cursor:"pointer",transition:"all .2s",
                    display:"flex",alignItems:"center",gap:8,
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=th.accent;e.currentTarget.style.color=th.text;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=th.border;e.currentTarget.style.color=th.sub;}}>
                    <span style={{flexShrink:0,color:th.accent}}>✧</span>
                    <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{idea}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved ideas */}
          {aiSaved.length>0&&(
            <div style={{background:th.card,borderRadius:18,border:`1px solid ${th.border}`,padding:"14px"}}>
              <div style={{fontSize:12,fontWeight:800,color:th.sub,marginBottom:10,letterSpacing:".05em",textTransform:"uppercase"}}>♥ Saved Ideas</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {aiSaved.map((idea,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:10,border:`1px solid ${th.border}`,background:th.surface}}>
                    <span style={{flex:1,fontSize:12,color:th.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{idea}</span>
                    <button onClick={()=>{setAiIdea(idea);SFX.tap();}} style={{background:"none",border:"none",color:th.accent,cursor:"pointer",fontSize:13,flexShrink:0}}>→</button>
                    <button onClick={()=>saveIdea(idea)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:13,flexShrink:0}}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🖼 IMAGE MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ImageModal({ item, th, t, onClose, onOrder, wishlist, toggleWishlist }) {
  useEffect(()=>{
    document.body.style.overflow="hidden";
    return()=>{ document.body.style.overflow=""; };
  },[]);
  const wl = wishlist.includes(item.id);
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:9000,display:"flex",alignItems:"flex-end",animation:"fadeIn .25s ease",backdropFilter:"blur(8px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",maxWidth:480,margin:"0 auto",
        background:th.nav,borderRadius:"24px 24px 0 0",
        border:`1px solid ${th.border}`,
        animation:"sheetUp .35s cubic-bezier(.4,0,.2,1) both",
        overflow:"hidden",
      }}>
        {/* Drag handle */}
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}><div style={{width:36,height:4,borderRadius:999,background:th.border}}/></div>

        {/* Image */}
        <div style={{position:"relative",margin:"12px 16px 0"}}>
          <img src={item.img} alt={item.title} style={{width:"100%",borderRadius:18,display:"block",maxHeight:"50vh",objectFit:"cover"}}/>
          <button onClick={onClose} style={{position:"absolute",top:10,right:10,width:32,height:32,borderRadius:10,background:"rgba(0,0,0,.7)",border:"none",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>✕</button>
          {item.popular&&<div style={{position:"absolute",top:10,left:10,padding:"4px 10px",borderRadius:999,background:th.accent,color:th.btnTxt,fontSize:11,fontWeight:800}}>★ TOP</div>}
        </div>

        {/* Info */}
        <div style={{padding:"16px 20px 24px"}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
            <div>
              <div style={{fontSize:20,fontWeight:900,color:th.text,letterSpacing:"-.02em"}}>{item.title}</div>
              <div style={{fontSize:12,color:th.sub,marginTop:2}}>{item.cat} · {item.desc}</div>
            </div>
            <button onClick={()=>{toggleWishlist(item.id);SFX.wishlist();vibrate(20);}}
              style={{width:38,height:38,borderRadius:12,border:`1px solid ${wl?th.accent:th.border}`,background:wl?th.accent+"22":"transparent",color:wl?th.accent:th.sub,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {wl?"♥":"♡"}
            </button>
          </div>

          {/* Tags */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
            {item.tags.map(tag=>(
              <span key={tag} style={{padding:"3px 10px",borderRadius:999,background:th.accent+"18",color:th.accent,fontSize:11,fontWeight:700}}>#{tag}</span>
            ))}
          </div>

          {/* Actions */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <button onClick={()=>{SFX.order();vibrate(40);openTg("Rivaldsg",`Привет! Хочу такой же дизайн: ${item.title}`);}}
              style={{background:th.grad,color:th.btnTxt,border:"none",borderRadius:14,padding:"13px",fontSize:14,fontWeight:800,cursor:"pointer",boxShadow:th.shadow}}>
              ✈ {t.orderBtn}
            </button>
            <button onClick={()=>{SFX.copy();try{navigator.clipboard.writeText(item.img);}catch{};showToast?.(t.copied,"info");}}
              style={{background:th.card,color:th.text,border:`1px solid ${th.border}`,borderRadius:14,padding:"13px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
              ⎘ Copy URL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 SPLASH SCREEN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function SplashScreen({ th, onDone }) {
  const [progress, setProgress] = useState(0);
  useEffect(()=>{
    SFX.boot();
    let p=0;
    const iv = setInterval(()=>{
      p+=Math.random()*15+5;
      setProgress(Math.min(p,100));
      if(p>=100){ clearInterval(iv); setTimeout(onDone,300); }
    },80);
    return()=>clearInterval(iv);
  },[]);
  return (
    <div style={{
      position:"fixed",inset:0,background:th.bg,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      zIndex:10000,gap:24,
      animation:"fadeIn .3s ease",
    }}>
      <div style={{fontSize:60,animation:"splashBounce 1s ease infinite"}}>✦</div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:28,fontWeight:900,color:th.text,letterSpacing:"-.03em"}}>Rival Studio</div>
        <div style={{fontSize:13,color:th.sub,marginTop:4}}>Graphic Design</div>
      </div>
      <div style={{width:200,height:3,borderRadius:999,background:th.border,overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:999,background:th.grad,width:`${progress}%`,transition:"width .08s ease"}}/>
      </div>
      <div style={{fontSize:11,color:th.sub}}>{Math.round(progress)}%</div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ◆◆◆ MAIN APP ◆◆◆
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function App() {
  // ── Core
  const [theme, setTheme] = useState(()=>{ const id=ls.get("rs_theme","void"); return THEMES[id]||THEMES.void; });
  const [lang,  setLang]  = useState(()=>{ const l=ls.get("rs_lang","ru");  return LANGS[l]?l:"ru"; });
  const [soundOn, setSoundOn] = useState(()=>{ const s=ls.get("rs_sound",true); _soundEnabled=s; return s; });
  const [volume,  setVolume]  = useState(()=>{ const v=ls.get("rs_volume",.6); _volume=v; return v; });
  // ── Navigation
  const [tab, setTab] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  // ── Data
  const [cart,     setCart]     = useState(()=>ls.get("rs_cart",[]));
  const [wishlist, setWishlist] = useState(()=>ls.get("rs_wl",[]));
  // ── UI
  const [splash,   setSplash]   = useState(true);
  const [confetti, setConfetti] = useState(false);
  const [toasts,   setToasts]   = useState([]);
  const [selImage, setSelImage] = useState(null);

  const th = theme;
  const t  = T[lang]||T.ru;

  useEffect(()=>{ ls.set("rs_cart",cart); },[cart]);
  useEffect(()=>{ ls.set("rs_wl",wishlist); },[wishlist]);

  // ── Toast
  const showToast = useCallback((msg,type="info")=>{
    const id=Date.now();
    setToasts(prev=>[...prev,{id,msg,type}]);
    setTimeout(()=>setToasts(prev=>prev.filter(t=>t.id!==id)),2800);
  },[]);

  // ── Cart ops
  const addToCart = useCallback((svc,name)=>{
    setCart(prev=>{
      const ex=prev.find(i=>i.id===svc.id);
      if(ex) return prev.map(i=>i.id===svc.id?{...i,qty:i.qty+1}:i);
      return [...prev,{...svc,name,qty:1}];
    });
  },[]);
  const removeFromCart = useCallback((id)=>{ setCart(prev=>prev.filter(i=>i.id!==id)); },[]);
  const updateQty = useCallback((id,qty)=>{
    if(qty<1){ removeFromCart(id); return; }
    setCart(prev=>prev.map(i=>i.id===id?{...i,qty}:i));
  },[removeFromCart]);
  const clearCart = useCallback(()=>setCart([]),[]);

  const cartCount = useMemo(()=>cart.reduce((s,i)=>s+i.qty,0),[cart]);

  // ── Wishlist
  const toggleWishlist = useCallback((id)=>{
    setWishlist(prev=>{
      const n=prev.includes(id)?prev.filter(i=>i!==id):[...prev,id];
      ls.set("rs_wl",n); return n;
    });
  },[]);

  // ── Order confetti
  const doOrder = () => {
    SFX.confetti(); vibrate(60);
    setConfetti(true);
    setTimeout(()=>setConfetti(false),3500);
    showToast("🎉 Заказ отправлен!","success");
  };

  const greeting = getGreeting(lang);

  return (
    <div style={{
      minHeight:"100vh",background:th.bg,
      fontFamily:'"Nunito","Sora","DM Sans","Inter",system-ui,sans-serif',
      display:"flex",justifyContent:"center",
      position:"relative",
    }}>
      {/* Global CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        ::-webkit-scrollbar{width:0;height:0;}
        html{scroll-behavior:smooth;}
        body{margin:0;padding:0;overflow-x:hidden;}
        button{font-family:inherit;}
        input{font-family:inherit;}
        @keyframes fadeIn   {from{opacity:0}to{opacity:1}}
        @keyframes fadeDown {from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}
        @keyframes cardIn   {from{opacity:0;transform:translateY(22px) scale(.95)}to{opacity:1;transform:none}}
        @keyframes sheetUp  {from{transform:translateY(100%)}to{transform:none}}
        @keyframes drawerSlide{from{transform:translateX(-100%)}to{transform:none}}
        @keyframes toastIn  {from{opacity:0;transform:translateY(-14px) scale(.9)}to{opacity:1;transform:none}}
        @keyframes spin     {to{transform:rotate(360deg)}}
        @keyframes blink    {0%,100%{opacity:1}50%{opacity:0}}
        @keyframes ping     {0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:.6}}
        @keyframes splashBounce{0%,100%{transform:scale(1) rotate(0deg)}50%{transform:scale(1.2) rotate(15deg)}}
        @keyframes auroraMove1{from{transform:translate(0,0) scale(1)}to{transform:translate(60px,40px) scale(1.15)}}
        @keyframes auroraMove2{from{transform:translate(0,0) scale(1)}to{transform:translate(-50px,-30px) scale(1.1)}}
        @keyframes glowPulse{0%,100%{box-shadow:0 4px 20px rgba(138,92,246,.35)}50%{box-shadow:0 4px 40px rgba(138,92,246,.6),0 0 60px rgba(138,92,246,.2)}}
        @keyframes float    {0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        input[type=range]{-webkit-appearance:none;height:4px;border-radius:99px;outline:none;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:${th.accent};cursor:pointer;box-shadow:0 2px 8px ${th.glow};}
        @media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important;}}
      `}</style>

      {/* Splash */}
      {splash&&<SplashScreen th={th} onDone={()=>setSplash(false)}/>}

      {/* Aurora bg */}
      <AuroraBg accent={th.accent}/>

      {/* Toast */}
      <ToastSystem toasts={toasts}/>

      {/* Confetti */}
      {confetti&&<Confetti active={confetti} accent={th.accent}/>}

      {/* Side Drawer */}
      <SideDrawer
        open={drawerOpen} onClose={()=>setDrawerOpen(false)}
        th={th} t={t} theme={theme} setTheme={setTheme}
        lang={lang} setLang={setLang}
        soundOn={soundOn} setSoundOn={setSoundOn}
        volume={volume} setVolume={setVolume}
      />

      {/* Main shell */}
      <div style={{width:"100%",maxWidth:480,display:"flex",flexDirection:"column",minHeight:"100vh",position:"relative",zIndex:1}}>

        {/* ── TOP HEADER ── */}
        <header style={{
          position:"sticky",top:0,zIndex:100,
          display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"12px 16px",
          background:th.nav,borderBottom:`1px solid ${th.border}`,
        }}>
          {/* Hamburger / Logo */}
          <button onClick={()=>{SFX.drawer();setDrawerOpen(true);}}
            style={{display:"flex",flexDirection:"column",gap:4.5,width:32,height:32,justifyContent:"center",alignItems:"center",background:"none",border:"none",cursor:"pointer",padding:0}}>
            {[0,1,2].map(i=>(
              <div key={i} style={{width:i===1?16:22,height:2,borderRadius:999,background:th.sub,transition:"all .2s"}}/>
            ))}
          </button>

          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:8,position:"absolute",left:"50%",transform:"translateX(-50%)"}}>
            <div style={{width:28,height:28,borderRadius:9,background:th.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:th.btnTxt,boxShadow:th.shadow}}>✦</div>
            <span style={{fontSize:15,fontWeight:900,color:th.text,letterSpacing:"-.02em"}}>{t.appName}</span>
          </div>

          {/* Right: greeting + notification */}
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>{SFX.tap();openTg("Rivaldsg");}}
              style={{width:32,height:32,borderRadius:10,border:`1px solid ${th.border}`,background:"none",color:th.accent,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>
              ✈
            </button>
          </div>
        </header>

        {/* ── Greeting strip ── */}
        {tab==="home"&&(
          <div style={{padding:"10px 16px 0",fontSize:12,color:th.sub,fontWeight:600}}>
            {greeting} 👋
          </div>
        )}

        {/* ── CONTENT ── */}
        <main style={{flex:1,padding:"14px 16px 100px",overflowY:"auto"}}>
          <div key={tab} style={{animation:"cardIn .35s ease both"}}>
            {tab==="home"&&(
              <HomeTab th={th} t={t} lang={lang}
                onGoGallery={()=>setTab("gallery")}
                onGoReviews={()=>setTab("reviews")}
                onGoPricing={()=>setTab("pricing")}
                onGoMore={()=>setTab("more")}
                wishlistCount={wishlist.length}
                cartCount={cartCount}
              />
            )}
            {tab==="gallery"&&(
              <GalleryTab th={th} t={t} lang={lang}
                wishlist={wishlist} toggleWishlist={toggleWishlist}
                onOpenImage={(item)=>setSelImage(item)}
              />
            )}
            {tab==="reviews"&&(
              <ReviewsTab th={th} t={t} lang={lang}/>
            )}
            {tab==="pricing"&&(
              <PricingTab th={th} t={t} lang={lang}
                cart={cart} addToCart={addToCart}
                removeFromCart={removeFromCart} updateQty={updateQty}
                clearCart={clearCart} showToast={showToast}
              />
            )}
            {tab==="more"&&(
              <MoreTab th={th} t={t} lang={lang} showToast={showToast}/>
            )}
          </div>
        </main>

        {/* ── BOTTOM NAV ── */}
        <BottomNav active={tab} onChange={setTab} th={th} t={t} cartCount={cartCount}/>
      </div>

      {/* ── IMAGE MODAL ── */}
      {selImage&&(
        <ImageModal
          item={selImage} th={th} t={t}
          onClose={()=>{ setSelImage(null); SFX.close(); }}
          onOrder={doOrder}
          wishlist={wishlist} toggleWishlist={toggleWishlist}
        />
      )}
    </div>
  );
}
