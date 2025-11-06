import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔹 Fungsi login utama
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // ✅ Jika response tidak OK (misalnya 401)
      if (!response.ok) {
        alert(data.message || "Email atau password salah!");
        return;
      }

      // ✅ Cek role dari backend
      if (data.role === "admin") {
        alert("Hallo_Admin 👋");
        navigate("/Sistem/sistem");
      } else if (data.role === "kepala_gudang") {
        alert("Hallo Kepala Gudang 👋");
        navigate("/Warehouse/warehouse");
      } else {
        alert("Role tidak dikenali!");
      }
    } catch (error) {
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  // 🔹 Tombol tambahan (opsional)
  const handleHaiClick = () => {
    navigate("/Warehouse/warehouse");
  };

  const handleHaiClickk = () => {
    navigate("/Karyawan/homepage");
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

        {/* ✅ Tombol opsional */}
        <button onClick={handleHaiClick} className="hai-button">
          Hai 👋
        </button>
        <button onClick={handleHaiClickk} className="hello-button">
          hellok 👋
        </button>
      </div>
    </div>
  );
}

export default Login;
