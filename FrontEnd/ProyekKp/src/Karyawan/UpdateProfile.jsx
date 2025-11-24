import React, { useState, useEffect } from "react";
import axios from "axios";
import "./updateAuthKaryawan.css";

const UpdateAuthKaryawan = () => {
  const [id, setId] = useState("");

  // Input lama
  const [oldEmail, setOldEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  // Input baru
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");

  // 🔹 Ambil data karyawan saat halaman dibuka
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/karyawan/profile");

        if (res.data.success) {
          setId(res.data.karyawan._id);
          setOldEmail(res.data.karyawan.Email); // otomatis isi email lama
        }
      } catch (err) {
        console.log("Gagal fetch:", err);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Submit update data auth
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pastikan password lama tidak kosong
    if (!oldPassword) {
      setMessage("❌ Password lama wajib diisi!");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:3000/updateAuthKaryawan/${id}`,
        {
          email: newEmail ? newEmail : oldEmail,
          password: newPassword ? newPassword : oldPassword,
        }
      );

      if (res.data.success) {
        setMessage("✅ Email & Password berhasil diperbarui!");
      } else {
        setMessage("❌ Gagal memperbarui data");
      }
    } catch (error) {
      console.log(error);
      setMessage("❌ Terjadi kesalahan server");
    }
  };

  return (
    <div className="auth-update-container">
      <h2 className="auth-title">Update Akun Karyawan</h2>

      {message && <p className="auth-message">{message}</p>}

      <form className="auth-update-form" onSubmit={handleSubmit}>
        
        <label>Email Lama:</label>
        <input type="email" value={oldEmail} disabled />

        <label>Password Lama:</label>
        <input
          type="password"
          placeholder="Masukkan password lama"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <label>Email Baru:</label>
        <input
          type="email"
          placeholder="Masukkan email baru"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />

        <label>Password Baru:</label>
        <input
          type="password"
          placeholder="Masukkan password baru"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit" className="auth-btn">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default UpdateAuthKaryawan;
