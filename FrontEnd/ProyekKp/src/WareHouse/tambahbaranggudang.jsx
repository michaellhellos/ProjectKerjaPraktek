import React, { useState } from "react";
import axios from "axios";
import "./tambahbaranggudang.css";
import Logo from "../images/Logo.jpg";
import { useNavigate } from "react-router-dom";   // ← WAJIB

const TambahBarangGudang = () => {

  const navigate = useNavigate();   // ← WAJIB

  const [formData, setFormData] = useState({
    idBarang: "",
    namaBarang: "",
    jumlah: 0,
    tipeBarang: "",
    tanggalMasuk: "",
    fotoBarang: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "fotoBarang") {
      const file = files[0];
      setFormData({ ...formData, fotoBarang: file });

      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("idBarang", formData.idBarang);
      data.append("namaBarang", formData.namaBarang);
      data.append("jumlahBarang", formData.jumlah);
      data.append("tipeBarang", formData.tipeBarang);
      data.append("tanggalMasuk", formData.tanggalMasuk);
      if (formData.fotoBarang) {
        data.append("fotoBarang", formData.fotoBarang);
      }

      await axios.post("http://localhost:3000/barangmasuk", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("✅ Data Barang Berhasil Disimpan!");

      setFormData({
        idBarang: "",
        namaBarang: "",
        jumlah: 0,
        tipeBarang: "",
        tanggalMasuk: "",
        fotoBarang: null,
      });
      setPreviewImage(null);

    } catch (error) {
      console.error(error);
      alert("❌ Gagal menyimpan data!");
    }

    setLoading(false);
  };

  return (
    <div className="tambah-container">

      <aside className="sidebar">
        <div className="profile">
          <img
            src={Logo}
            alt="Profil"
            className="profile-image clickable-image"
            onClick={() => navigate("/WareHouse/editprofile")}
          />
          <h3>Semoga Jadi Jaya</h3>
        </div>

        <nav className="nav-menu">
          <a href="/WareHouse/warehouse">📊 Dashboard</a>
          <a href="/WareHouse/gudangstockbarang">📦 Stock Gudang</a>
          <a href="/WareHouse/tambahbaranggudang" className="active">
            ➕ Tambah Barang Masuk
          </a>
          <a href="/WareHouse/tambahbarangkeluar">📤 Barang Keluar</a>
        </nav>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header>
          <h1>Add Incoming Goods</h1>
          <p>Fill out the form to add new items to inventory.</p>
        </header>

        <div className="form-container">
          <h3>Tambah Barang Masuk</h3>

          <form onSubmit={handleSubmit}>

            <div className="form-row">
              <div className="form-group">
                <label>ID Barang</label>
                <input type="text" name="idBarang" value={formData.idBarang} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Nama Barang</label>
                <input type="text" name="namaBarang" value={formData.namaBarang} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Jumlah Barang</label>
                <input type="number" name="jumlah" value={formData.jumlah} onChange={handleChange} min="0" required />
              </div>
              <div className="form-group">
                <label>Tipe Barang</label>
                <select name="tipeBarang" value={formData.tipeBarang} onChange={handleChange} required>
                  <option value="">Pilih Tipe</option>
                  <option value="Ransel">Ransel</option>
                  <option value="Selempang">Selempang</option>
                  <option value="Koper">Koper</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Tanggal Masuk</label>
              <input type="date" name="tanggalMasuk" value={formData.tanggalMasuk} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Foto Barang</label>

              <div className="upload-area" onClick={() => document.getElementById("uploadFile").click()}>
                {formData.fotoBarang ? (
                  <span>{formData.fotoBarang.name}</span>
                ) : (
                  <span>Klik untuk pilih foto barang</span>
                )}
              </div>

              <input
                id="uploadFile"
                type="file"
                name="fotoBarang"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleChange}
                hidden
              />

              {previewImage && (
                <div className="preview-box">
                  <img src={previewImage} alt="Preview Barang" className="preview-image" />
                </div>
              )}
            </div>

            <div className="button-row">
              <button type="button" className="btn-cancel">Batal</button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default TambahBarangGudang;
