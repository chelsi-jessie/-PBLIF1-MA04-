/* ===== bilas - halaman Petugas: Pelanggan, Order Laundry, Jenis Layanan (data & fungsi dari app.js) ===== */
const page = document.body.dataset.page;
const TONE = [["#dbe8ff", "#2563eb"], ["#ffefd0", "#b7791f"], ["#ece4fb", "#7c4dcc"], ["#d8f5e8", "#0f8a5c"]];
const B = t => `<b class="dk">${t}</b>`;
const opts = a => a.map(x => `<option>${x}</option>`).join("");
const ini = n => n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const topSearch = document.querySelector(".topbar .search input");
const acts = (id, extra = "") => `<div class="act"><button class="btn-o plain" data-act="edit" data-id="${id}">${icon("edit", 13)}Edit</button><button class="btn-o red" data-act="hapus" data-id="${id}">${icon("trash", 13)}Hapus</button></div>`;
const nextBtn = t => `<button type="button" data-act="next" data-id="${t.id}" title="${t.cucian === "Diambil" ? "Order sudah diambil" : "Klik untuk lanjut ke tahap berikutnya"}" style="border:0;background:none;padding:0;cursor:${t.cucian === "Diambil" ? "default" : "pointer"}">${pill(t.cucian)}</button>`;
const empty = '<div class="empty">Data tidak ditemukan.</div>';
function toast(msg, ok = true) {
  document.querySelector(".toast")?.remove();
  const t = Object.assign(document.createElement("div"), { className: "toast" + (ok ? "" : " bad"), textContent: msg });
  document.body.appendChild(t); setTimeout(() => t.remove(), 2800);
}

/* Konfigurasi halaman tabel */
const PAGES = {
  order: {
    search: "Cari kode, pelanggan, status...", statuses: ["Semua status", ...STATUS], date: true, btn: "Order Baru",
    cols: ["Kode Order", "Pelanggan", "Layanan", "Tgl Masuk", "Berat", "Total", "Status", "Aksi"],
    rows: () => TRX.map(t => ({ q: `${t.id} ${cname(t)} ${lname(t)} ${t.cucian} ${t.tgl} ${fmt(t.tgl)}`, date: t.tgl, status: t.cucian,
      cells: [B(t.id), cname(t), lname(t), fmt(t.tgl), B(t.berat + " kg"), B(rp(t.total)), nextBtn(t), acts(t.id)] }))
  },
  pelanggan: {
    search: "Cari nama, no. HP, atau alamat...", btn: "Pelanggan Baru",
    cols: ["Pelanggan", "No. HP", "Alamat", "Total Order", "Aksi"],
    rows: () => CUST.map((c, i) => ({ q: `${c.nama} ${c.telp} ${c.alamat || ""}`,
      cells: [`<div class="cell-user"><span class="av" style="background:${TONE[i % 4][0]};color:${TONE[i % 4][1]}">${ini(c.nama)}</span>${B(c.nama)}</div>`,
        c.telp, c.alamat || "-", TRX.filter(t => t.pel === c.id).length + " order", acts(c.id)] }))
  }
};
const root = document.getElementById("page");
const $ = id => document.getElementById(id);

if (PAGES[page]) {
  const c = PAGES[page];
  root.innerHTML = `<div class="card-x table-card admin-tbl">
    <div class="filters tool">
      <label class="field-search">${icon("search", 16)}<input id="q" type="search" placeholder="${c.search}"></label>
      ${c.date ? `<label class="date-field">${icon("cal", 14)}<b style="font-weight:700">Tgl masuk</b><input type="date" id="fDate"></label>` : ""}
      ${c.statuses ? `<select id="fStatus">${opts(c.statuses)}</select>` : ""}
      <button class="btn-green" data-act="new">${icon("plus", 15)}${c.btn}</button>
    </div>
    <div class="tbl-scroll"><table class="tbl"><thead><tr>${c.cols.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody id="tb"></tbody></table></div>
    <div id="empty"></div></div>`;
  initDropdowns();
  const draw = () => {
    const words = [$("q").value, topSearch ? topSearch.value : ""].map(v => v.trim().toLowerCase());
    const st = $("fStatus"), dt = $("fDate");
    const list = c.rows().filter(r => words.every(w => !w || r.q.toLowerCase().includes(w)) &&
      (!st || st.selectedIndex === 0 || r.status === st.value) && (!dt || !dt.value || r.date === dt.value));
    $("tb").innerHTML = list.map(r => `<tr>${r.cells.map(x => `<td>${x}</td>`).join("")}</tr>`).join("");
    $("empty").innerHTML = list.length ? "" : empty;
  };
  [$("q"), topSearch, $("fDate")].forEach(el => el && el.addEventListener("input", draw));
  $("fStatus")?.addEventListener("change", draw);
  window.redraw = () => { persist(); draw(); }; draw();
}

/* Jenis Layanan: tampilan kartu */
if (page === "jenis-layanan") {
  root.innerHTML = `<div class="filters svc-tool">
      <label class="field-search">${icon("search", 16)}<input id="q" type="search" placeholder="Cari layanan..."></label>
      <select id="fStatus">${opts(["Semua status", "Aktif", "Nonaktif"])}</select>
      <button class="btn-green" data-act="new">${icon("plus", 15)}Layanan Baru</button>
    </div><div class="svc-grid" id="grid"></div><div id="empty"></div>`;
  initDropdowns();
  const draw = () => {
    const w = [$("q").value, topSearch ? topSearch.value : ""].map(v => v.trim().toLowerCase()), st = $("fStatus");
    const list = SVC.filter(s => w.every(x => !x || s.nama.toLowerCase().includes(x)) && (st.selectedIndex === 0 || (s.aktif ? "Aktif" : "Nonaktif") === st.value));
    $("grid").innerHTML = list.map(s => `<article class="card-x svc">
      <div class="svc-top"><div class="ico blue">${icon(s.est <= 1 && s.harga >= 15000 ? "clock" : "bag", 18)}</div><span class="tag ${s.aktif ? "on" : "off"}">${s.aktif ? "Aktif" : "Nonaktif"}</span></div>
      <h3>${s.nama}</h3><div class="sub">Per kilogram</div>
      <div class="svc-mid"><div><small>Harga</small><div class="price">${rp(s.harga)} <i>/kg</i></div></div><div style="text-align:right"><small>Estimasi</small><b>${s.est} hari</b></div></div>
      <div class="act"><button class="square" data-act="edit" data-id="${s.id}" aria-label="Edit">${icon("edit", 15)}</button><button class="square" data-act="hapus" data-id="${s.id}" aria-label="Hapus">${icon("trash", 15)}</button></div></article>`).join("");
    $("empty").innerHTML = list.length ? "" : empty;
  };
  [$("q"), topSearch].forEach(el => el && el.addEventListener("input", draw));
  $("fStatus").addEventListener("change", draw);
  window.redraw = () => { persist(); draw(); }; draw();
}

/* ================= POP UP (MODAL) ================= */
const esc = v => String(v ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const optsSel = (arr, cur) => arr.map(x => `<option${x === cur ? " selected" : ""}>${esc(x)}</option>`).join("");
const fld = (label, html) => `<div class="m-f"><span class="m-l">${label}</span>${html}</div>`;
const sel = (name, arr, cur) => `<div class="filters m-sel"><select name="${name}">${optsSel(arr, cur)}</select></div>`;
const mHead = (t, s) => `<div class="m-head"><div><h2>${t}</h2><p>${s}</p></div><button type="button" class="square lg" data-close aria-label="Tutup">${icon("x", 18)}</button></div>`;
const mFoot = label => `<div class="m-foot"><button type="button" class="btn-cancel" data-close>Batal</button><button type="submit" class="btn-green">${label}</button></div>`;

function closeModal() { document.querySelector(".modal-bg")?.remove(); }
function openModal(html) {
  closeModal();
  const bg = document.createElement("div");
  bg.className = "modal-bg";
  bg.innerHTML = `<div class="m-box" role="dialog" aria-modal="true">${html}</div>`;
  document.body.appendChild(bg);
  bg.addEventListener("mousedown", e => { if (e.target === bg) closeModal(); });
  bg.querySelectorAll("[data-close]").forEach(x => x.onclick = closeModal);
  initDropdowns();                       // dropdown biru juga di dalam pop up
  return bg.querySelector(".m-box");
}
document.addEventListener("keydown", e => e.key === "Escape" && closeModal());

/* Validasi sederhana: kolom wajib yang kosong diberi garis merah */
function check(form, names) {
  let ok = true;
  names.forEach(n => {
    const el = form.elements[n], bad = !String(el.value).trim() || (el.type === "number" && +el.value <= 0);
    el.classList.toggle("bad", bad);
    if (bad && ok) { el.focus(); ok = false; }
  });
  return ok;
}

const nextId = a => a.length ? Math.max(...a.map(x => x.id)) + 1 : 1;
const today = () => iso(0);

/* 1) Order baru / edit order (total = berat x harga layanan) */
function ordForm(id) {
  const t = id ? TRX.find(x => x.id === id) : null;
  if (!t && !CUST.length) return toast("Tambahkan data pelanggan terlebih dahulu.", false);
  const lay = SVC.filter(s => s.aktif || (t && s.id === t.lay));
  if (!lay.length) return toast("Aktifkan minimal satu layanan di menu Jenis Layanan.", false);
  const box = openModal(`<form id="mForm" novalidate>${mHead(t ? "Edit Order " + t.id : "Order Baru", t ? "Perbarui berat, layanan, atau status order." : "Catat cucian yang baru masuk.")}
    <div class="m-body">
      ${fld("Pelanggan", sel("pelanggan", CUST.map(c => c.nama), t ? cname(t) : CUST[0].nama))}
      <div class="m-two">${fld("Layanan", sel("layanan", lay.map(s => s.nama), t ? lname(t) : lay[0].nama))}${fld("Berat (kg)", `<input class="m-in" type="number" name="berat" min="0.1" step="0.1" placeholder="0" value="${t ? t.berat : ""}">`)}</div>
      <div class="m-two">${fld("Tanggal Masuk", `<input class="m-in" type="date" name="tgl" value="${t ? t.tgl : today()}">`)}${fld("Status", sel("status", STATUS, t ? t.cucian : "Diterima"))}</div>
      <div class="m-total"><span>Estimasi selesai</span><b id="mEst">–</b></div>
      <div class="m-total"><span>Total (berat x harga)</span><b id="mTotal">Rp0</b></div>
    </div>${mFoot(t ? "Simpan Perubahan" : "Simpan Order")}</form>`);
  const f = box.querySelector("form");
  const svcNow = () => SVC.find(x => x.nama === f.elements.layanan.value);
  const calc = () => {
    const s = svcNow(), tg = f.elements.tgl.value;
    $("mTotal").textContent = rp(Math.round((s ? s.harga : 0) * (+f.elements.berat.value || 0)));
    if (s && tg) { const d = new Date(tg + "T00:00"); d.setDate(d.getDate() + s.est); $("mEst").textContent = fmt(d.toLocaleDateString("sv-SE")); } else $("mEst").textContent = "–";
  };
  ["input", "change"].forEach(ev => f.addEventListener(ev, calc)); calc();
  f.onsubmit = e => {
    e.preventDefault();
    if (!check(f, ["berat", "tgl"])) return toast("Lengkapi data yang wajib diisi.", false);
    const s = svcNow(), c = CUST.find(x => x.nama === f.elements.pelanggan.value), berat = +f.elements.berat.value, status = f.elements.status.value;
    const v = { pel: c.id, lay: s.id, berat, tgl: f.elements.tgl.value, cucian: status };
    if (t) {
      const ulang = t.lay !== s.id || t.berat !== berat;           // total hanya dihitung ulang jika layanan/berat berubah
      Object.assign(t, v, ulang ? { total: Math.round(s.harga * berat) } : {});
      t.tglAmbil = status === "Diambil" ? (t.tglAmbil || today()) : null;
    } else {
      const n = TRX.length ? Math.max(...TRX.map(x => +x.id.split("-")[1])) + 1 : 1;
      TRX.unshift({ id: "LDR-" + String(n).padStart(4, "0"), ...v, total: Math.round(s.harga * berat), tglAmbil: status === "Diambil" ? today() : null });
    }
    closeModal(); window.redraw(); toast(t ? "Order berhasil diubah." : "Order berhasil disimpan.");
  };
}

/* 2) Tambah / edit pelanggan */
function custForm(id) {
  const c = id ? CUST.find(x => x.id === +id) : null;
  const box = openModal(`<form id="mForm" novalidate>${mHead(c ? "Edit Pelanggan" : "Tambah Pelanggan", c ? "Perbarui data pelanggan." : "Isi data pelanggan baru.")}
    <div class="m-body">
      ${fld("Nama Lengkap", `<input class="m-in" name="nama" maxlength="100" placeholder="Masukkan nama pelanggan" value="${esc(c?.nama)}">`)}
      ${fld("No. HP", `<input class="m-in" name="telp" maxlength="20" placeholder="08xx xxxx xxxx" value="${esc(c?.telp)}">`)}
      ${fld("Alamat", `<textarea class="m-in" name="alamat" maxlength="200" placeholder="Masukkan alamat pelanggan">${esc(c?.alamat)}</textarea>`)}
    </div>${mFoot(c ? "Simpan Perubahan" : "Simpan Pelanggan")}</form>`);
  const f = box.querySelector("form");
  f.onsubmit = e => {
    e.preventDefault();
    if (!check(f, ["nama", "telp"])) return toast("Nama dan No. HP wajib diisi.", false);
    const v = { nama: f.elements.nama.value.trim(), telp: f.elements.telp.value.trim(), alamat: f.elements.alamat.value.trim() };
    if (c) Object.assign(c, v); else CUST.push({ id: nextId(CUST), ...v });
    closeModal(); window.redraw(); toast(c ? "Pelanggan berhasil diubah." : "Pelanggan berhasil disimpan.");
  };
}

/* 3) Tambah / edit layanan (estimasi dalam hari) */
function svcForm(id) {
  const s = id ? SVC.find(x => x.id === +id) : null;
  const box = openModal(`<form id="mForm" novalidate>${mHead(s ? "Edit Layanan" : "Layanan Baru", s ? "Perbarui harga dan estimasi layanan." : "Tambahkan jenis layanan laundry.")}
    <div class="m-body">
      ${fld("Nama Layanan", `<input class="m-in" name="nama" maxlength="50" placeholder="Contoh: Cuci Kering" value="${esc(s?.nama)}">`)}
      <div class="m-two">
        ${fld("Harga per kg (Rp)", `<input class="m-in" type="number" name="harga" min="1" placeholder="7000" value="${esc(s?.harga)}">`)}
        ${fld("Estimasi (hari)", `<input class="m-in" type="number" name="est" min="1" step="1" placeholder="2" value="${esc(s?.est)}">`)}
      </div>
      ${fld("Status", sel("status", ["Aktif", "Nonaktif"], s && !s.aktif ? "Nonaktif" : "Aktif"))}
    </div>${mFoot(s ? "Simpan Perubahan" : "Simpan Layanan")}</form>`);
  const f = box.querySelector("form");
  f.onsubmit = e => {
    e.preventDefault();
    if (!check(f, ["nama", "harga", "est"])) return toast("Lengkapi data yang wajib diisi.", false);
    const v = { nama: f.elements.nama.value.trim(), harga: +f.elements.harga.value, est: Math.round(+f.elements.est.value), aktif: f.elements.status.value === "Aktif" };
    if (s) Object.assign(s, v); else SVC.push({ id: nextId(SVC), ...v });
    closeModal(); window.redraw(); toast(s ? "Layanan berhasil diubah." : "Layanan berhasil disimpan.");
  };
}

/* Tombol aksi: tambah, edit, hapus, ubah status */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-act]");
  if (!b) return;
  const a = b.dataset.act, id = b.dataset.id;
  if (a === "next") {
    const t = TRX.find(x => x.id === id);
    if (t && t.cucian !== "Diambil") { t.cucian = STATUS[STATUS.indexOf(t.cucian) + 1]; if (t.cucian === "Diambil") t.tglAmbil = today(); window.redraw(); toast("Status order diperbarui: " + t.cucian + "."); }
  } else if (a === "new") (page === "order" || page === "dashboard" ? ordForm : page === "pelanggan" ? custForm : svcForm)();
  else if (a === "edit") (page === "order" ? ordForm : page === "pelanggan" ? custForm : svcForm)(id);
  else if (a === "hapus") {
    if (page === "order") { const i = TRX.findIndex(x => x.id === id); if (i > -1 && confirm(`Hapus order ${id}?`)) { TRX.splice(i, 1); window.redraw(); toast("Order berhasil dihapus."); } return; }
    const isC = page === "pelanggan", src = isC ? CUST : SVC, it = src.find(x => x.id === +id);
    if (!it) return;
    if (TRX.some(t => t[isC ? "pel" : "lay"] === it.id)) return toast(isC ? "Pelanggan masih dipakai pada order, tidak dapat dihapus." : "Layanan masih dipakai pada order. Nonaktifkan saja lewat Edit.", false);
    if (confirm(`Hapus "${it.nama}"?`)) { src.splice(src.indexOf(it), 1); window.redraw(); toast("Data berhasil dihapus."); }
  }
});

/* Tombol "Order Baru" di Dashboard membuka form ini langsung */
if (page === "dashboard") window.redraw = () => { persist(); location.reload(); };
if (page === "order" && location.search.includes("baru")) ordForm();
