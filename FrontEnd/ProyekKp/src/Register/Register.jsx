
import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password dan konfirmasi password tidak sama!");
      return;
    }
    alert(`Nama: ${name}\nEmail: ${email}\nPassword: ${password}`);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-700">
        <div className="bg-white/30 dark:bg-gray-800/60 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-md transform transition-all duration-500 hover:scale-105">
          
          {/* Toggle Mode */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-200/70 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:scale-105 transition"
            >
              {darkMode ? "🌞 Light" : "🌙 Dark"}
            </button>
          </div>

          {/* Judul */}
          <h1 className="text-4xl font-extrabold text-center text-white dark:text-indigo-200 drop-shadow-lg mb-2">
            ✨ Daftar Akun
          </h1>
          <p className="text-center text-gray-100 dark:text-gray-400 mb-8">
            Buat akun baru untuk melanjutkan
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama */}
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-500 dark:text-gray-300" />
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-500 dark:text-gray-300" />
              <input
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-500 dark:text-gray-300" />
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400"
                required
              />
            </div>

            {/* Konfirmasi Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-500 dark:text-gray-300" />
              <input
                type="password"
                placeholder="Konfirmasi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400"
                required
              />
            </div>

            {/* Tombol Register */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold transition duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
            >
              🎉 Daftar
            </button>
          </form>

          {/* Link tambahan */}
          <p className="text-sm text-gray-200 dark:text-gray-400 text-center mt-6">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="text-yellow-300 hover:text-yellow-400 hover:underline font-semibold"
            >
              Login di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
