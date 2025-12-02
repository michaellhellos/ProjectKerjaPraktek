import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./tambahkaryawan.css";
import Logo from "../images/Logo.jpg";
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
const [activeMenu, setActiveMenu] = useState("managekaryawan");

  // === TAMBAHAN BARU UNTUK LOGIN ===
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // === BATAL ===
  const handleCancel = () => {
    navigate("/Sistem/managekariawan");
  };
  const handleMenuClick = (key) => {
    setActiveMenu(key);
    if (key === "karyawan") navigate("/Sistem/managekariawan");
    else if (key === "stock") navigate("/Sistem/stockgudang");
    else if (key === "barang") navigate("/Sistem/daftarBarang");
    else if (key === "retur") navigate("/Sistem/retur");
    else if (key === "dashboard") navigate("/Sistem/sistem");
    else if (key === "EditProfile") navigate("/Sistem/editprofile");
  };

  // === SUBMIT ===
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

      // 🔹 DATA LOGIN BARU
      formData.append("email", email);
      formData.append("password", password);

      if (foto) formData.append("foto", foto);
      if (ktp) formData.append("ktp", ktp);

      const res = await fetch("http://localhost:3000/addKaryawan", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert(`✅ Karyawan berhasil ditambahkan dengan ID: ${data.idKaryawan}`);
        navigate("/Sistem/managekariawan");
      } else {
        alert("❌ Gagal: " + data.message || data.error);
      }
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  return (
    <div className="add-container">
      <aside className="sidebar">
      <img src={Logo} alt="Profil" className="profile-image" />
                        <div>
                          <h2 className="sidebar-title">Admin</h2>
                          <p className="sidebar-role">CV SEMOGA JADI JAYA</p>
                        </div>
        <ul className="sidebar-menu">
            <li className={activeMenu === "dashboard" ? "active" : ""} onClick={() => handleMenuClick("dashboard")}>Dashboard</li>
          <li className={activeMenu === "karyawan" ? "active" : ""} onClick={() => handleMenuClick("karyawan")}>Manage Karyawan</li>
          <li className={activeMenu === "stock" ? "active" : ""} onClick={() => handleMenuClick("stock")}>Stock Gudang</li>
          <li className={activeMenu === "barang" ? "active" : ""} onClick={() => handleMenuClick("barang")}>Daftar Barang</li>
          <li className={activeMenu === "retur" ? "active" : ""} onClick={() => handleMenuClick("retur")}>Daftar Retur</li>
        </ul>
           <button 
          className="logout-btn" 
          onClick={() => {
            localStorage.removeItem("token"); // kalau Anda pakai token
            navigate("/");               // arahkan ke halaman login
          }}
        >
          Logout
        </button>
      </aside>

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

            {/* === EMAIL BARU === */}
            <div>
              <label>Email Login</label>
              <input
                type="email"
                placeholder="emailkaryawan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* === PASSWORD BARU === */}
            <div>
              <label>Password Login</label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  />
                  Laki-laki
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Perempuan"
                    onChange={(e) => setJenisKelamin(e.target.value)}
                  />
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
