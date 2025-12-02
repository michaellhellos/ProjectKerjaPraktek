import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // <-- tambah ini
import "./editprofile.css";

const EditProfileSistem = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // <-- navigate

  // Ambil data admin saat halaman dibuka
  useEffect(() => {
    axios
      .get("http://localhost:3000/admin/detail")
      .then((res) => {
        setEmail(res.data.Email); // Auto isi email lama
      })
      .catch((err) => console.log(err));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Email dan Password tidak boleh kosong!");
      return;
    }

    try {
      const response = await axios.put("http://localhost:3000/update", {
        Email: email,
        Password: password,
      });

      setMessage(response.data.message || "Berhasil diperbarui!");

      // Reset password input
      setPassword("");

      // ⏳ Pindah halaman setelah 1 detik
      setTimeout(() => {
        navigate("/Sistem/sistem");
      }, 1000);

    } catch (err) {
      setMessage("Gagal memperbarui!");
      console.error(err);
    }
  };

  return (
    <div className="editprofile-container">
      <div className="editprofile-card">
        <h2>Edit Profile Admin</h2>

        <form onSubmit={handleUpdate}>
          <label>Email Baru</label>
          <input
            type="email"
            placeholder="Masukkan email baru..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password Baru</label>
          <input
            type="password"
            placeholder="Masukkan password baru..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btn-save">
            Simpan Perubahan
          </button>
        </form>

        {message && <p className="msg">{message}</p>}
      </div>
    </div>
  );
};

export default EditProfileSistem;
