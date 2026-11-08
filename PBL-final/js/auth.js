// Login (demo: akun petugas & pemilik dibuat langsung di sistem, tidak ada pendaftaran bebas)
// Di versi dengan basis data, data ini berasal dari tabel `pengguna` (password disimpan ter-hash).
const USERS = [
  { nama: "Chelsi Jessica", username: "petugas", password: "bilas1234", role: "petugas" },
  { nama: "Pemilik Bilas",  username: "pemilik", password: "bilas1234", role: "pemilik" },
];
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    loginForm.querySelectorAll("input[required]").forEach((el) => {
      const valid = el.checkValidity() && el.value.trim() !== "";
      el.classList.toggle("is-invalid", !valid);
      if (!valid) ok = false;
    });
    if (!ok) return;
    const u = document.getElementById("username").value.trim().toLowerCase(), p = document.getElementById("password").value;
    const user = USERS.find((x) => x.username === u && x.password === p);
    if (!user) return alert("Username atau kata sandi salah.");
    localStorage.setItem("bilasRole", user.role);
    localStorage.setItem("bilasNama", user.nama);
    window.location.href = "dashboard.html";
  });
}
