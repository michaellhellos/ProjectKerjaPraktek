import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";   // ⬅ WAJIB
import "./editprofile.css";

const EditProfile = () => {
  const navigate = useNavigate();   // ⬅ INISIASI NAVIGATE

  const [oldEmail, setOldEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [userId, setUserId] = useState(null);

  // 🔍 CARI DATA BERDASARKAN EMAIL & PASSWORD LAMA
  const handleFind = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/kepalagudang/find", {
        Email: oldEmail,
        Password: oldPassword
      })
      .then((res) => {
        alert("Data ditemukan!");

        setUserId(res.data.data._id);
        setNewEmail(res.data.data.Email);
        setNewPassword(res.data.data.Password);
      })
      .catch(() => {
        alert("Email lama atau Password lama salah!");
      });
  };

  // 🔄 UPDATE EMAIL & PASSWORD BARU
  const handleUpdate = (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Cari data terlebih dahulu!");
      return;
    }

    axios
      .put(`http://localhost:3000/update-kepalagudang/${userId}`, {
        Email: newEmail,
        Password: newPassword
      })
      .then((res) => {
        alert("Profile berhasil diperbarui!");
        navigate("/WareHouse/warehouse");   // ⬅ PINDAH HALAMAN
      })
      .catch(() => {
        alert("Gagal update profile!");
      });
  };

  return (
    <div className="edit-container">
      <h2>Edit Profile</h2>

      {/* FORM PENCARIAN */}
      <form className="form-edit" onSubmit={handleFind}>
        <label>Email Lama:</label>
        <input
          type="email"
          value={oldEmail}
          onChange={(e) => setOldEmail(e.target.value)}
          required
        />

        <label>Password Lama:</label>
        <input
          type="text"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <button type="submit">Cari Data</button>
      </form>

      <hr />

      {/* FORM UPDATE */}
      <form className="form-edit" onSubmit={handleUpdate}>
        <label>Email Baru:</label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
        />

        <label>Password Baru:</label>
        <input
          type="text"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={!userId}>
          Update
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
