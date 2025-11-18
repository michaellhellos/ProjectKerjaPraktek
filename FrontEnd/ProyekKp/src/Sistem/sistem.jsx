import React, { useState, useEffect } from "react";
import "./sistem.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Sistem = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const navigate = useNavigate();

  // 🔹 STATE UNTUK TOTAL PENJUALAN DAN TOTAL BARANG KELUAR
  const [totalPenjualan, setTotalPenjualan] = useState(0);
  const [totalBarangKeluar, setTotalBarangKeluar] = useState(0);

  useEffect(() => {
    const fetchTransaksi = async () => {
      try {
        const res = await axios.get("http://localhost:3000/checkout");
        if (res.data.success && res.data.data) {
          const transaksiList = res.data.data;

          // 🔹 Hitung total penjualan
          const total = transaksiList.reduce(
            (acc, transaksi) => acc + transaksi.subtotal,
            0
          );
          setTotalPenjualan(total);

          // 🔹 Hitung total barang keluar
          const totalBarang = transaksiList.reduce(
            (acc, transaksi) =>
              acc +
              (transaksi.items
                ? transaksi.items.reduce((sum, item) => sum + item.jumlah, 0)
                : 0),
            0
          );
          setTotalBarangKeluar(totalBarang);
        }
      } catch (err) {
        console.error("Gagal ambil transaksi:", err);
      }
    };

    fetchTransaksi();
  }, []);

  const handleMenuClick = (key) => {
    setActiveMenu(key);
    if (key === "karyawan") navigate("/Sistem/managekariawan");
    else if (key === "stock") navigate("/Sistem/stockgudang");
    else if (key === "barang") navigate("/Sistem/daftarBarang");
    else if (key === "retur") navigate("/Sistem/retur");
    else if (key === "dashboard") navigate("/Sistem/sistem");
    else if (key === "EditProfile") navigate("/Sistem/editprofile");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div
          className="profile-section"
          onClick={() => handleMenuClick("EditProfile")}
        >
          <img src="/images/profile.png" alt="Profile" className="profile-image" />
          <div>
            <h2 className="sidebar-title">Admin</h2>
            <p className="sidebar-role">Warehouse Manager</p>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li
            className={activeMenu === "dashboard" ? "active" : ""}
            onClick={() => handleMenuClick("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={activeMenu === "karyawan" ? "active" : ""}
            onClick={() => handleMenuClick("karyawan")}
          >
            Manage Karyawan
          </li>
          <li
            className={activeMenu === "stock" ? "active" : ""}
            onClick={() => handleMenuClick("stock")}
          >
            Stock Gudang
          </li>
          <li
            className={activeMenu === "barang" ? "active" : ""}
            onClick={() => handleMenuClick("barang")}
          >
            Daftar Barang
          </li>
          <li
            className={activeMenu === "retur" ? "active" : ""}
            onClick={() => handleMenuClick("retur")}
          >
            Daftar Retur
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="dashboard-title">Dashboard</h1>

        {/* Top Cards */}
        <div className="top-cards">
          <div className="card">
            <p>Penjualan Total</p>
            <h2>Rp {totalPenjualan.toLocaleString()}</h2>
          </div>
          <div className="card">
            <p>Total Barang Keluar</p>
            <h2>{totalBarangKeluar.toLocaleString()}</h2>
          </div>
          <div className="card">
            <p>Total Barang</p>
            <h2>89,120</h2>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <h3>Penjualan Bulanan</h3>
            <div className="chart-placeholder">[ Grafik Batang ]</div>
          </div>
          <div className="chart-card">
            <h3>Stock Tiap Barang</h3>
            <div className="chart-placeholder">[ Grafik Pie ]</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sistem;
