import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";   // ⬅️ TAMBAHKAN INI
import "./updateAuthKaryawan.css";

const UpdateAuthKaryawan = () => {
  const navigate = useNavigate();   // ⬅️ INISIALISASI NAVIGATE

  const [oldEmail, setOldEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");

  // 🔍 CARI DATA BERDASARKAN EMAIL & PASSWORD LAMA
  const handleFind = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/karyawan/find", {
        Email: oldEmail,
        Password: oldPassword,
      })
      .then((res) => {
        setUserId(res.data.data._id);
        setNewEmail(res.data.data.Email);
        setNewPassword(res.data.data.Password);
        setMessage("✅ Data Ditemukan!");
      })
      .catch(() => {
        setMessage("❌ Email atau Password lama salah!");
      });
  };

  // 🔄 UPDATE EMAIL & PASSWORD BARU
  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:3000/updateAuthKaryawan/${userId}`, {
        email: newEmail,
        password: newPassword,
      })
      .then(() => {
        setMessage("✅ Berhasil update!");

        // ⬅️ AUTO PINDAH KE HALAMAN HOME KARYAWAN DALAM 1 DETIK
        setTimeout(() => {
          navigate("/Karyawan/homePage");
        }, 1000);

      })
      .catch(() => {
        setMessage("❌ Gagal update!");
      });
  };

  return (
    <div className="auth-update-container">
      <div className="auth-card">
        <h2 className="auth-title">Update Akun Karyawan</h2>
        {message && <p className="auth-message">{message}</p>}

        {/* FORM CARI */}
        <form className="auth-update-form" onSubmit={handleFind}>
          <label>Email Lama:</label>
          <input
            type="email"
            value={oldEmail}
            onChange={(e) => setOldEmail(e.target.value)}
            required
          />

          <label>Password Lama:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-btn">Cari Data</button>
        </form>

        <hr />

        {/* FORM UPDATE */}
        <form className="auth-update-form" onSubmit={handleUpdate}>
          <label>Email Baru:</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            disabled={!userId}
            required
          />

          <label>Password Baru:</label>
          <input
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={!userId}
            required
          />

          <button type="submit" className="auth-btn" disabled={!userId}>
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAuthKaryawan;
