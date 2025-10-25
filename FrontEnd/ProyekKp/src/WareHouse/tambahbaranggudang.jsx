import React, { useState } from "react";
import "./tambahbaranggudang.css";

const TambahBarangGudang = () => {
  const [formData, setFormData] = useState({
    idBarang: "",
    namaBarang: "",
    jumlah: 0,
    tipeBarang: "",
    tanggalMasuk: "",
    fotoBarang: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "fotoBarang") {
      setFormData({ ...formData, fotoBarang: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Data Barang berhasil disimpan!");
    console.log(formData);
  };

  return (
    <div className="tambah-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile">
          <div className="profile-icon">A</div>
          <h3>Acong</h3>
        </div>

        <nav className="nav-menu">
          <a href="#">📊 Dashboard</a>
          <a href="#">📦 Stock Gudang</a>
          <a href="#" className="active">➕ Tambah Barang Masuk</a>
          <a href="#">📤 Barang Keluar</a>
          <a href="#">↩️ Return Barang</a>
        </nav>

        <button className="logout-btn">🚪 Keluar</button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header>
          <h1>Add Incoming Goods</h1>
          <p>Fill out the form to add new items to inventory.</p>
        </header>

        <div className="form-container">
          <h3>Tambah Barang Masuk</h3>

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="form-row">
              <div className="form-group">
                <label>ID Barang</label>
                <input
                  type="text"
                  name="idBarang"
                  placeholder="Contoh: TAS-008"
                  value={formData.idBarang}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nama Barang</label>
                <input
                  type="text"
                  name="namaBarang"
                  placeholder="Contoh: Tas Carrier Consina 70L"
                  value={formData.namaBarang}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="form-row">
              <div className="form-group">
                <label>Jumlah Barang</label>
                <input
                  type="number"
                  name="jumlah"
                  value={formData.jumlah}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tipe Barang</label>
                <select
                  name="tipeBarang"
                  value={formData.tipeBarang}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Tipe</option>
                  <option value="Ransel">Ransel</option>
                  <option value="Selempang">Selempang</option>
                  <option value="Koper">Koper</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div className="form-row">
              <div className="form-group">
                <label>Tanggal Masuk</label>
                <input
                  type="date"
                  name="tanggalMasuk"
                  value={formData.tanggalMasuk}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 4 - Upload */}
            <div className="form-group file-upload">
              <label>Foto Barang</label>
              <div className="upload-area">
                <input
                  type="file"
                  name="fotoBarang"
                  id="fotoBarang"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleChange}
                />
                <p>
                  <span>Klik untuk memilih</span> atau seret file foto<br />
                  <small>PNG, JPG, GIF hingga 10MB</small>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="button-row">
              <button type="button" className="btn-cancel">Batal</button>
              <button type="submit" className="btn-submit">Simpan</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TambahBarangGudang;
