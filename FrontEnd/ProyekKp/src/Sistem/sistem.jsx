import React, { useState } from "react";
import "./sistem.css";
import { useNavigate } from "react-router-dom";

const Sistem = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const navigate = useNavigate();

  const handleMenuClick = (key) => {
    setActiveMenu(key);
    if (key === "karyawan") {
      navigate("/Sistem/managekariawan"); 
    }else if (key === "stock") {
      navigate("/Sistem/stockgudang"); 
    }else if (key === "barang") {
      navigate("/Sistem/daftarBarang"); 
    }else if (key === "retur") {
      navigate("/Sistem/retur"); 
    }else if (key === "dashboard") {
      navigate("/Sistem/sistem"); 
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin</h2>
        <p className="sidebar-role">Warehouse Manager</p>
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
            <h2>Rp 12.5M</h2>
          </div>
          <div className="card">
            <p>Total Barang Keluar</p>
            <h2>3,450</h2>
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
