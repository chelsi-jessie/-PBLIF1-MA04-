-- Skema basis data bilas (sesuai flowchart revisi v3 & PRO-04): pengguna, pelanggan, layanan, order_laundry
CREATE TABLE pengguna (
  id_pengguna INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,            -- simpan hash (mis. password_hash), bukan teks asli
  peran ENUM('petugas','pemilik') NOT NULL
);
CREATE TABLE pelanggan (
  id_pelanggan INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(100) NOT NULL,
  no_hp VARCHAR(20) NOT NULL,
  alamat VARCHAR(200)
);
CREATE TABLE layanan (
  id_layanan INT PRIMARY KEY AUTO_INCREMENT,
  nama_layanan VARCHAR(50) NOT NULL,
  harga_per_kg DECIMAL(10,2) NOT NULL,
  estimasi_hari INT NOT NULL,
  aktif TINYINT(1) NOT NULL DEFAULT 1
);
CREATE TABLE order_laundry (
  id_order INT PRIMARY KEY AUTO_INCREMENT,
  kode_order VARCHAR(20) NOT NULL UNIQUE,
  id_pelanggan INT NOT NULL,
  id_layanan INT NOT NULL,
  tgl_masuk DATE NOT NULL,
  berat_kg DECIMAL(5,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,              -- berat_kg x harga_per_kg
  status VARCHAR(20) NOT NULL DEFAULT 'Diterima',  -- Diterima, Dicuci, Selesai, Diambil
  tgl_ambil DATE NULL,
  FOREIGN KEY (id_pelanggan) REFERENCES pelanggan(id_pelanggan),
  FOREIGN KEY (id_layanan) REFERENCES layanan(id_layanan)
);
