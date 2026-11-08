/* ===== bilas - logika bersama Dashboard & Laporan ===== */
const P = {
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>', x:'<path d="M18 6 6 18M6 6l12 12"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  right:'<path d="m9 6 6 6-6 6"/>', down:'<path d="m6 9 6 6 6-6"/>', plus:'<path d="M12 5v14M5 12h14"/>',
  doc:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  bag:'<path d="M4 8h16l-1.3 10.2a2 2 0 0 1-2 1.8H7.3a2 2 0 0 1-2-1.8zM8 8V7a4 4 0 0 1 8 0v1"/><path d="M9.5 13.5c.7.8 1.5 1.2 2.5 1.2s1.8-.4 2.5-1.2"/>',
  check:'<path d="m5 12 5 5 9-10"/>',
  wallet:'<path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2"/><circle cx="16" cy="14" r="1"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  users:'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M17 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6"/>',
  refresh:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  chart:'<path d="M3 3v18h18M7 15l4-4 3 3 5-6"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  print:'<path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2"/><rect x="6" y="14" width="12" height="7" rx="1"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
};
const icon = (n, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;

/* Data contoh - strukturnya meniru tabel basis data: pelanggan, layanan, order_laundry (relasi lewat id) */
const store=(k,def)=>{try{return JSON.parse(localStorage.getItem(k))||def}catch(e){return def}};
const iso=n=>{const d=new Date();d.setDate(d.getDate()-n);return d.toLocaleDateString("sv-SE")};
const fmt=s=>new Date(s+"T00:00").toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});
const STATUS=["Diterima","Dicuci","Selesai","Diambil"];
const CUST=[{id:1,nama:"Nadia Putri",telp:"0812 3456 7890",alamat:"Jl. Melati No. 5"},{id:2,nama:"Rizky Ananda",telp:"0857 1122 3344",alamat:"Jl. Kenanga No. 12"},{id:3,nama:"Dewi Sartika",telp:"0813 9988 7766",alamat:"Jl. Mawar No. 3"},{id:4,nama:"Fajar Ramadhan",telp:"0821 5566 7788",alamat:"Jl. Anggrek No. 8"}];
const SVC=[{id:1,nama:"Cuci + Setrika",harga:7000,est:2,aktif:true},{id:2,nama:"Cuci Kering",harga:6000,est:1,aktif:true},{id:3,nama:"Express",harga:15000,est:1,aktif:true},{id:4,nama:"Setrika Saja",harga:4000,est:1,aktif:true},{id:5,nama:"Selimut & Bedcover",harga:12000,est:3,aktif:false}];
const mk=(n,p,l,b,d,s)=>({id:"LDR-"+String(n).padStart(4,"0"),pel:p,lay:l,berat:b,tgl:iso(d),cucian:s,total:b*SVC.find(x=>x.id===l).harga,tglAmbil:s==="Diambil"?iso(Math.max(d-2,0)):null});
const TRX=[mk(8,1,1,8,0,"Diterima"),mk(7,2,2,10,0,"Dicuci"),mk(6,3,3,6,1,"Selesai"),mk(5,4,2,6,2,"Diambil"),mk(4,1,1,9,5,"Diambil"),mk(3,2,4,3,12,"Diambil"),mk(2,3,1,7,33,"Diambil"),mk(1,4,2,5,40,"Diambil")];
/* Penyimpanan sementara di browser (pengganti database) */
[["bilas2CUST",CUST],["bilas2SVC",SVC],["bilas2TRX",TRX]].forEach(([k,a])=>{const v=store(k,null);if(v){a.length=0;a.push(...v)}});
const persist=()=>{localStorage.setItem("bilas2CUST",JSON.stringify(CUST));localStorage.setItem("bilas2SVC",JSON.stringify(SVC));localStorage.setItem("bilas2TRX",JSON.stringify(TRX))};
const cname=t=>(CUST.find(c=>c.id===t.pel)||{}).nama||"-", lname=t=>(SVC.find(s=>s.id===t.lay)||{}).nama||"-";
const rp=n=>"Rp"+n.toLocaleString("id-ID");
const cls=s=>({Diterima:"siap",Dicuci:"proses",Selesai:"selesai",Diambil:"diambil"}[s]);
const pill=s=>`<span class="pill ${cls(s)}">${s}</span>`;
const ROLE_LBL=()=>localStorage.getItem("bilasRole")==="petugas"?"Petugas Laundry":"Pemilik";

/* Menu samping mengikuti peran yang dipilih saat login (disimpan auth.js di localStorage) */
const ROLE = localStorage.getItem("bilasRole");
const MENU = [  // [kunci, file, ikon, nama, peran yang boleh akses, badge]
  ["dashboard", "dashboard.html", "grid", "Dashboard", ["petugas", "pemilik"]],
  ["pelanggan", "pelanggan.html", "users", "Pelanggan", ["petugas"]],
  ["order", "order.html", "doc", "Order", ["petugas"]],
  ["jenis-layanan", "jenis-layanan.html", "bag", "Jenis Layanan", ["petugas"]],
  ["laporan", "laporan.html", "chart", "Laporan", ["petugas", "pemilik"]]
];
const NAMA=localStorage.getItem("bilasNama")||"Pengguna", INI=NAMA.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const shell = document.getElementById("shell");
if (shell) {
  const d = shell.dataset, me = MENU.find(m => m[0] === d.active);
  if (!["petugas", "pemilik"].includes(ROLE)) location.replace("index.html");          // belum login
  else if (me && !me[4].includes(ROLE)) location.replace("dashboard.html");           // tidak punya akses
  const links = MENU.filter(m => m[4].includes(ROLE)).map(m =>
    `<a href="${m[1]}" class="sb-link ${d.active === m[0] ? "active" : ""}">${icon(m[2], 17)}${m[3]}${m[5] ? `<span class="sb-badge">${m[5]}</span>` : ""}</a>`).join("");
  shell.innerHTML = `
  <header class="topbar">
    <button class="icon-btn" id="openMenu" aria-label="Buka menu">${icon("menu")}</button>
    <div><h1 class="page-title">${d.title}</h1><div class="page-sub">${d.sub}</div></div>
    <div class="topbar-right">
      <label class="search">${icon("search", 15)}<input type="search" placeholder="${d.search}"></label>
      <button class="icon-btn" aria-label="Notifikasi">${icon("bell", 17)}${ROLE === "petugas" ? '<i class="dot"></i>' : ""}</button>
      <a href="#" class="profile"><span class="avatar">${INI}</span><div><b>${NAMA}</b><small>${ROLE_LBL()}</small></div>${icon("right", 14)}</a>
    </div>
  </header>
  <div class="overlay" id="overlay"></div>
  <aside class="sidebar" id="sidebar">
    <div class="sb-head"><span class="logo">${icon("bag", 20)}</span><div><b>bilas</b><small>Manajemen Laundry</small></div>
      <button class="icon-btn" id="closeMenu" aria-label="Tutup menu">${icon("x", 18)}</button></div>
    <div class="sb-label">MENU UTAMA</div>
    ${links}
    <div class="sb-foot"><span>${NAMA}</span><a href="index.html" id="logoutBtn" title="Keluar" aria-label="Keluar">${icon("logout", 17)}</a></div>
  </aside>`;
  const toggle = open => {
    document.getElementById("sidebar").classList.toggle("open", open);
    document.getElementById("overlay").classList.toggle("show", open);
  };
  document.getElementById("openMenu").onclick = () => toggle(true);
  document.getElementById("closeMenu").onclick = () => toggle(false);
  document.getElementById("overlay").onclick = () => toggle(false);
  document.addEventListener("keydown", e => e.key === "Escape" && toggle(false));
  if (ROLE !== "petugas") document.querySelectorAll(".admin-only").forEach(el => el.remove());   // pemilik hanya memantau
}


document.getElementById("logoutBtn")?.addEventListener("click",()=>{localStorage.removeItem("bilasRole");localStorage.removeItem("bilasNama")});

/* ---------- Dashboard ---------- */
if (document.getElementById("recentBody")) {
  const set=(i,v)=>document.getElementById(i).textContent=v, today=iso(0), bln=today.slice(0,7);
  const jam=new Date().getHours(); set("greet",`Selamat ${jam<11?"pagi":jam<15?"siang":jam<19?"sore":"malam"}, ${(localStorage.getItem("bilasNama")||"").split(" ")[0]}!`);
  const hari=TRX.filter(t=>t.tgl===today), proses=TRX.filter(t=>t.cucian==="Diterima"||t.cucian==="Dicuci"), sel=TRX.filter(t=>t.cucian==="Selesai"), bulan=TRX.filter(t=>t.tgl.slice(0,7)===bln);
  set("st0",hari.length); set("st1",proses.length); set("st2",sel.length); set("st3",rp(bulan.reduce((s,t)=>s+t.total,0))); set("st3n",bulan.length+" order bulan ini");
  document.getElementById("recentBody").innerHTML=[...TRX].sort((a,b)=>b.tgl.localeCompare(a.tgl)||b.id.localeCompare(a.id)).slice(0,5).map(t=>
    `<tr><td>${t.id}</td><td>${cname(t)}</td><td>${lname(t)}</td><td>${fmt(t.tgl)}</td><td class="strong">${rp(t.total)}</td><td>${pill(t.cucian)}</td></tr>`).join("")||'<tr><td colspan="6"><div class="empty">Data tidak ditemukan.</div></td></tr>';
}

/* ---------- Laporan (semua angka dihitung dari data order) ---------- */
const tabs = document.querySelectorAll(".tab");
if (tabs.length) {
  const $=id=>document.getElementById(id), dari=$("dari"), sampai=$("sampai"), st=$("stFilter"), grp=$("grp");
  dari.value=iso(60); sampai.value=iso(0);
  const filtered=()=>TRX.filter(t=>(!dari.value||t.tgl>=dari.value)&&(!sampai.value||t.tgl<=sampai.value)&&(!st.value||t.cucian===st.value));
  const sum=a=>a.reduce((s,t)=>s+t.total,0), none='<div class="empty">Data tidak ditemukan.</div>';
  const groups=data=>{const g={};data.forEach(t=>{const k=grp.value==="bulan"?t.tgl.slice(0,7):t.tgl;(g[k]=g[k]||[]).push(t)});return Object.entries(g).sort((a,b)=>a[0].localeCompare(b[0]))};
  const lbl=k=>grp.value==="bulan"?new Date(k+"-01T00:00").toLocaleDateString("id-ID",{month:"long",year:"numeric"}):fmt(k);
  const foot=(a,b)=>`<tr><td class="name">Total</td><td class="strong">${a}</td><td class="strong">${b}</td></tr>`;
  function render(){
    const data=filtered(); $("sOrd").textContent=data.length; $("sRev").textContent=rp(sum(data)); $("sKg").textContent=data.reduce((s,t)=>s+t.berat,0)+" kg";
    $("statusBody").innerHTML=STATUS.map(s=>{const a=data.filter(t=>t.cucian===s);return `<tr><td>${pill(s)}</td><td class="strong">${a.length} order</td><td>${data.length?Math.round(a.length/data.length*100):0}%</td><td class="strong">${rp(sum(a))}</td></tr>`}).join("")+`<tr><td class="name">Total</td><td class="strong">${data.length} order</td><td>100%</td><td class="strong">${rp(sum(data))}</td></tr>`;
    const g=groups(data), max=Math.max(1,...g.map(([,a])=>sum(a))), last=g.slice(-12);
    $("bars").innerHTML=last.map(([k,a])=>`<div class="bar" style="height:${sum(a)/max*100}%" title="${lbl(k)}: ${rp(sum(a))}"></div>`).join("");
    $("barLabels").innerHTML=last.map(([k])=>`<span style="width:auto">${grp.value==="bulan"?k.slice(5)+"/"+k.slice(2,4):k.slice(8)+"/"+k.slice(5,7)}</span>`).join("");
    $("periodeBody").innerHTML=g.map(([k,a])=>`<tr><td class="name">${lbl(k)}</td><td>${a.length} order</td><td class="strong">${rp(sum(a))}</td></tr>`).join("")+(g.length?foot(data.length+" order",rp(sum(data))):"");
    $("trxBody").innerHTML=data.map(t=>`<tr><td>${t.id}</td><td>${cname(t)}</td><td>${lname(t)}</td><td>${fmt(t.tgl)}</td><td>${t.berat} kg</td><td class="strong">${rp(t.total)}</td><td>${pill(t.cucian)}</td></tr>`).join("");
    document.querySelectorAll(".empty-slot").forEach(e=>e.innerHTML=data.length?"":none);
  }
  [dari,sampai,st,grp].forEach(el=>el.onchange=render); render();
  tabs.forEach(b=>b.onclick=()=>{tabs.forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".tab-pane").forEach(p=>p.classList.toggle("active",p.id===b.dataset.tab))});
  $("downloadBtn").onclick=()=>{
    const tab=document.querySelector(".tab.active").dataset.tab, data=filtered();
    const rows={status:[["Status","Jumlah Order","Pendapatan"],...STATUS.map(s=>{const a=data.filter(t=>t.cucian===s);return [s,a.length,sum(a)]})],
      periode:[["Periode","Jumlah Order","Pendapatan"],...groups(data).map(([k,a])=>[k,a.length,sum(a)])],
      detail:[["Kode","Pelanggan","Layanan","Tgl Masuk","Berat","Total","Status"],...data.map(t=>[t.id,cname(t),lname(t),t.tgl,t.berat,t.total,t.cucian])]}[tab];
    const a=Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([rows.map(r=>r.join(",")).join("\n")],{type:"text/csv"})),download:`laporan-${tab}.csv`});a.click();URL.revokeObjectURL(a.href);
  };
}

/* Dropdown custom (sorotan biru) menggantikan <select> bawaan browser */
function initDropdowns() {
  document.querySelectorAll(".filters select:not([data-dd])").forEach(sel => {
    sel.dataset.dd = 1;
    const dd = document.createElement("div");
    dd.className = "dd";
    dd.innerHTML = `<button type="button" class="dd-btn"><span class="dd-l">${sel.dataset.icon ? icon(sel.dataset.icon, 15) : ""}<span></span></span>${icon("down", 15)}</button><ul class="dd-list"></ul>`;
    sel.after(dd);
    sel.hidden = true;
    const btn = dd.querySelector(".dd-btn"), list = dd.querySelector(".dd-list");
    const draw = () => {
      btn.querySelector(".dd-l span").textContent = sel.options[sel.selectedIndex].text;
      list.innerHTML = [...sel.options].map((o, i) => `<li data-idx="${i}" class="${i === sel.selectedIndex ? "on" : ""}">${o.text}</li>`).join("");
    };
    btn.onclick = () => dd.classList.toggle("open");
    list.onclick = e => {
      const li = e.target.closest("li");
      if (!li) return;
      sel.selectedIndex = +li.dataset.idx;
      sel.dispatchEvent(new Event("change"));
      draw();
      dd.classList.remove("open");
    };
    document.addEventListener("click", e => { if (!dd.contains(e.target)) dd.classList.remove("open"); });
    draw();
  });
}
initDropdowns();

/* Isi semua ikon dari atribut data-i */
document.querySelectorAll("[data-i]").forEach(el => el.innerHTML = icon(el.dataset.i, +el.dataset.s || 18));
