import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./tambahkaryawan.css";

const TambahKaryawan = () => {
  const navigate = useNavigate();

  // === STATE FORM ===
  const [foto, setFoto] = useState(null);
  const [ktp, setKtp] = useState(null);
  const [namaLengkap, setNamaLengkap] = useState("");
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [golonganDarah, setGolonganDarah] = useState("");
  const [alamat, setAlamat] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [agama, setAgama] = useState("");

  // === KLIK BATAL ===
  const handleCancel = () => {
    navigate("/Sistem/managekariawan");
  };

  // === KLIK SUBMIT ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("namaLengkap", namaLengkap);
      formData.append("tempatLahir", tempatLahir);
      formData.append("tanggalLahir", tanggalLahir);
      formData.append("jenisKelamin", jenisKelamin);
      formData.append("golonganDarah", golonganDarah);
      formData.append("alamat", alamat);
      formData.append("noTelepon", noTelepon);
      formData.append("agama", agama);

      if (foto) formData.append("foto", foto);
      if (ktp) formData.append("ktp", ktp);

      // 🔹 URL backend Node.js (bukan Firebase)
      const res = await fetch("http://localhost:3000/addKaryawan", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert(`✅ Karyawan berhasil ditambahkan dengan ID: ${data.idKaryawan}`);
        navigate("/Sistem/managekariawan");
      } else {
        alert("❌ Gagal: " + data.error);
      }
    } catch (err) {
      alert("❌ Gagal menyimpan: " + err.message);
    }
  };

  return (
    <div className="add-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin</h2>
        <p className="sidebar-subtitle">Warehouse Manager</p>
        <ul className="sidebar-menu">
          <li>Dashboard</li>
          <li className="active">Manage Karyawan</li>
          <li>Stock Gudang</li>
          <li>Daftar Barang</li>
          <li>Buat Retur</li>
          <li>Daftar Retur</li>
        </ul>
      </aside>

      {/* Form Area */}
      <div className="form-area">
        <h2 className="page-title">Tambah Karyawan</h2>

        <div className="form-box">

          {/* Upload Foto */}
          <div className="upload-section">
            <label className="upload-box">
              {foto ? (
                <img src={URL.createObjectURL(foto)} alt="preview" />
              ) : (
                <span>Upload Foto</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFoto(e.target.files[0])}
              />
            </label>
          </div>

          {/* Form Fields */}
          <div className="form-grid">
            <div>
              <label>Nama Lengkap</label>
              <input
                type="text"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Tempat Lahir</label>
              <input
                type="text"
                value={tempatLahir}
                onChange={(e) => setTempatLahir(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Tanggal Lahir</label>
              <input
                type="date"
                value={tanggalLahir}
                onChange={(e) => setTanggalLahir(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Jenis Kelamin</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Laki-Laki"
                    onChange={(e) => setJenisKelamin(e.target.value)}
                    required
                  />{" "}
                  Laki-laki
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Perempuan"
                    onChange={(e) => setJenisKelamin(e.target.value)}
                  />{" "}
                  Perempuan
                </label>
              </div>
            </div>

            <div>
              <label>Golongan Darah</label>
              <select
                value={golonganDarah}
                onChange={(e) => setGolonganDarah(e.target.value)}
                required
              >
                <option value="">Pilih..</option>
                <option>A</option>
                <option>B</option>
                <option>AB</option>
                <option>O</option>
              </select>
            </div>

            <div className="full">
              <label>Alamat</label>
              <textarea
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                required
              ></textarea>
            </div>

            <div>
              <label>No Telepon</label>
              <input
                type="text"
                value={noTelepon}
                onChange={(e) => setNoTelepon(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Agama</label>
              <select
                value={agama}
                onChange={(e) => setAgama(e.target.value)}
                required
              >
                <option value="">Pilih..</option>
                <option>Islam</option>
                <option>Kristen</option>
                <option>Katolik</option>
                <option>Hindu</option>
                <option>Buddha</option>
                <option>Konghucu</option>
              </select>
            </div>

            <div className="full">
              <label>Upload Scan KTP</label>
              <label className="upload-box ktp">
                {ktp ? <p>{ktp.name}</p> : <span>Upload file (PNG, JPG, PDF)</span>}
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={(e) => setKtp(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-cancel" onClick={handleCancel}>
              Batal
            </button>
            <button className="btn-submit" onClick={handleSubmit}>
              Tambah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahKaryawan;
