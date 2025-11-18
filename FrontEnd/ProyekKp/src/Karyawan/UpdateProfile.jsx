import React, { useState, useEffect } from "react";
import axios from "axios";
import "./updateProfile.css"; // Buat styling sendiri

const UpdateProfile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 Optional: ambil data user saat load halaman
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/profile"); // route ambil profile
        if (response.data.success) {
          setEmail(response.data.user.email);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put("http://localhost:3000/user/profile", {
        email,
        password,
      });

      if (response.data.success) {
        setMessage("✅ Profile berhasil diperbarui!");
      } else {
        setMessage("❌ Gagal memperbarui profile");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Terjadi kesalahan saat update profile");
    }
  };

  return (
    <div className="update-profile-container">
      <h2>Update Profile</h2>

      {message && <p className="message">{message}</p>}

      <form className="update-profile-form" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          placeholder="Masukkan email baru"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          placeholder="Masukkan password baru"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
