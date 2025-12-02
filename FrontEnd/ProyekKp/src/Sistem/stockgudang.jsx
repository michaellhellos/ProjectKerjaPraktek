import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import "./stockgudang.css";
import Logo from "../images/Logo.jpg";
const StockGudang = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("stock");

  // State utk backend
  const [dataBarang, setDataBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter dan Search
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  // ======== FETCH DATA BACKEND ========
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/barangmasuk");

        if (res.data.success) {
          setDataBarang(res.data.data);
        } else {
          setError("Gagal mengambil data dari server");
        }
      } catch (err) {
        setError("Terjadi kesalahan: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ======== FILTER & SEARCH ========
  const filteredBarang = dataBarang.filter(
    (item) =>
      (filter === "Semua" || item.tipe === filter) &&
      item.namaBarang.toLowerCase().includes(search.toLowerCase())
  );

  // ======== MENU NAVIGATION ========
  const handleMenuClick = (key) => {
    setActiveMenu(key);
    if (key === "karyawan") navigate("/Sistem/managekariawan");
    else if (key === "stock") navigate("/Sistem/stockgudang");
    else if (key === "barang") navigate("/Sistem/daftarBarang");
    else if (key === "retur") navigate("/Sistem/retur");
    else if (key === "dashboard") navigate("/Sistem/sistem");
  };

  // ======== LOADING UI ========
  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading data...</h2>;
  }

  // ======== ERROR UI ========
  if (error) {
    return <h2 style={{ textAlign: "center", color: "red", marginTop: "50px" }}>{error}</h2>;
  }

  // ========== MAIN UI ==========
  return (
    <div className="stock-container">

      {/* Sidebar */}
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
      localStorage.removeItem("token");
      navigate("/");
    }}
  >
    Logout
  </button>
      </aside>

      {/* Main Content */}
      <div className="main-area">
        <h2 className="page-title">Stock Gudang</h2>

        <div className="content-box">
          <div className="content-header">
            <h3>Stock Di Gudang</h3>

            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Cari barang..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-row">
            <label>Filter Tipe:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="Semua">Semua</option>
              <option value="Hard Case">Hard Case</option>
              <option value="Backpack">Backpack</option>
              <option value="Soft Case">Soft Case</option>
              <option value="Duffel Bag">Duffel Bag</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <table className="table-stock">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Jumlah</th>
                <th>Tgl Masuk</th>
                <th>Tipe</th>
              </tr>
            </thead>

            <tbody>
              {filteredBarang.map((item, index) => (
                <tr key={index}>
                  <td>{item.idBarang}</td>
                  <td>{item.namaBarang}</td>
                  <td className={item.jumlah <= 3 ? "warning" : ""}>{item.jumlah}</td>
                  <td>{item.tanggalMasuk}</td>
                  <td>{item.tipeBarang}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default StockGudang;
