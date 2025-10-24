import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:5001/demo-no-project/us-central1/loginUser", // 🔥 GANTI sesuai URL emulator
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.error || "Email atau password salah");
        return;
      }

      // ✅ SIMPAN USER KE LOCAL STORAGE (opsional)
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ CEK ROLE & REDIRECT
      if (data.user.role === "admin") {
        alert("Hallo Admin 👋");
        navigate("/Sistem/sistem");
      } else if (data.user.role === "kepala_gudang") {
        alert("Hallo Kepala Gudang 👋");
        navigate("/Sistem/kepalagudang");
      } else if (data.user.role === "karyawan") {
        alert("Hallo Karyawan 👋");
        navigate("/Sistem/karyawan");
      } else {
        alert("Role tidak dikenali!");
      }
    } catch (error) {
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Logo */}
        <div className="logo-section">
          <div className="logo"></div>
          <p className="brand-name">SEMOGA JADI JAYA</p>
          <p className="since">• SINCE 1985 •</p>
        </div>

        {/* Judul */}
        <h2 className="login-title">Masuk</h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label>Email User</label>
          <input
            type="email"
            placeholder="contoh@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
