// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Login.css";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   // 🔹 Fungsi login utama
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:3000/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         alert(data.message || "Email atau password salah!");
//         return;
//       }

//       if (data.role === "admin") {
//         alert("Hallo_Admin 👋");
//         navigate("/Sistem/sistem");
//       } else if (data.role === "kepala_gudang") {
//         alert("Hallo Kepala Gudang 👋");
//         navigate("/Sistem/editprofile");
//       }else {
//         alert("Role tidak dikenali!");
//       }
//     } catch (error) {
//       alert("Terjadi kesalahan: " + error.message);
//     }
//   };
//   return (
//     <div className="login-container">
//       <div className="login-box">
//         {/* Logo */}
//         <div className="logo-section">
//           <div className="logo"></div>
//           <p className="brand-name">SEMOGA JADI JAYA</p>
//           <p className="since">• SINCE 1985 •</p>
//         </div>

//         {/* Judul */}
//         <h2 className="login-title">Masuk</h2>

//         {/* Form */}
//         <form onSubmit={handleSubmit}>
//           <label>Email User</label>
//           <input
//             type="email"
//             placeholder="contoh@email.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <label>Password</label>
//           <input
//             type="password"
//             placeholder="********"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <button type="submit" className="login-button">
//             Masuk
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Login.css";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   // Opsional: State untuk menampilkan error di UI
//   const [errorMsg, setErrorMsg] = useState(""); 
//   const navigate = useNavigate();

//   // 🔹 Fungsi login utama
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMsg(""); // Reset pesan error setiap kali submit

//     try {
//       const response = await fetch("http://localhost:3000/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         // <--- PERBAIKAN: Ganti alert() dengan state
//         setErrorMsg(data.message || "Email atau password salah!");
//         return;
//       }

//       // data.role berisi "admin" atau "kepala_gudang"
//       // data adalah objek, misal: { id: 1, email: "...", role: "admin" }

//       if (data.role === "admin") {
//          localStorage.setItem("user", JSON.stringify(data));
//         navigate("/Sistem/sistem");

//       } else if (data.role === "kepala_gudang") {
//        localStorage.setItem("user", JSON.stringify(data));
//         navigate("/WareHouse/warehouse"); 

//       } else if (data.role === "karyawan") { 
//         localStorage.setItem("user", JSON.stringify(data));
// navigate("/Karyawan/homepage"); 
//       } else {
//         // <--- PERBAIKAN: Ganti alert()
//         setErrorMsg("Role tidak dikenali!");
//       }
//     } catch (error) {
//       // <--- PERBAIKAN: Ganti alert()
//       setErrorMsg("Terjadi kesalahan: " + error.message);
//       console.error("Login error:", error);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         {/* Logo */}
//         <div className="logo-section">
//           <div className="logo"></div>
//           <p className="brand-name">SEMOGA JADI JAYA</p>
//           <p className="since">• SINCE 1985 •</p>
//         </div>

//         {/* Judul */}
//         <h2 className="login-title">Masuk</h2>

//         {/* Form */}
//         <form onSubmit={handleSubmit}>
//           <label>Email User</label>
//           <input
//             type="email"
//             placeholder="contoh@email.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <label>Password</label>
//           <input
//             type="password"
//             placeholder="********"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           {/* Tampilkan pesan error di sini jika ada */}
//           {errorMsg && <p className="login-error-message">{errorMsg}</p>}

//           <button type="submit" className="login-button">
//             Masuk
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Email atau password salah!");
        return;
      }

      // Simpan ke localStorage
      localStorage.setItem("user", JSON.stringify(data));

      // 🔥 Arahkan berdasarkan ROLE
      if (data.role === "admin") {
        navigate("/Sistem/sistem");

      } else if (data.role === "kepala_gudang") {
        navigate("/WareHouse/warehouse");

      } else if (data.role === "karyawan") {
        navigate("/Karyawan/homepage");

      } else {
        setErrorMsg("Role tidak dikenali!");
      }

    } catch (error) {
      setErrorMsg("Terjadi kesalahan: " + error.message);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        
        <div className="logo-section">
          <div className="logo"></div>
          <p className="brand-name">SEMOGA JADI JAYA</p>
          <p className="since">• SINCE 1985 •</p>
        </div>

        <h2 className="login-title">Masuk</h2>

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

          {errorMsg && (
            <p className="login-error-message">{errorMsg}</p>
          )}

          <button type="submit" className="login-button">
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
