import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./warehouse.css";

const Warehouse = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const handleMenuClick = (key) => {
    setActiveMenu(key);
    if (key === "dashboard") {
      navigate("/WareHouse/warehouse");
    } else if (key === "stock") {
      navigate("/WareHouse/gudangstockbarang");
    } else if (key === "tambahMasuk") {
      navigate("/WareHouse/tambahbaranggudang");
    } else if (key === "barangKeluar") {
      navigate("/WareHouse/tambahbarangkeluar");
    } else if (key === "retur") {
      navigate("/WareHouse/returgudang");
    }
  };

  return (
    <div className="warehouse-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile">
          <div className="profile-icon">A</div>
          <h3>Acong</h3>
        </div>

        <nav className="nav-menu">
          <a
            href="#"
            onClick={() => handleMenuClick("dashboard")}
            className={activeMenu === "dashboard" ? "active" : ""}
          >
            📊 Dashboard
          </a>

          <a
            href="#"
            onClick={() => handleMenuClick("stock")}
            className={activeMenu === "stock" ? "active" : ""}
          >
            📦 Stock Gudang
          </a>

          <a
            href="#"
            onClick={() => handleMenuClick("tambahMasuk")}
            className={activeMenu === "tambahMasuk" ? "active" : ""}
          >
            ➕ Tambah Barang Masuk
          </a>

          <a
            href="#"
            onClick={() => handleMenuClick("barangKeluar")}
            className={activeMenu === "barangKeluar" ? "active" : ""}
          >
            📤 Barang Keluar
          </a>

          <a
            href="#"
            onClick={() => handleMenuClick("retur")}
            className={activeMenu === "retur" ? "active" : ""}
          >
            ↩️ Return Barang
          </a>
        </nav>

        <button className="logout-btn">🚪 Keluar</button>
      </aside>

      {/* Main Dashboard */}
      <main className="dashboard">
        <header>
          <h1>Dashboard</h1>
          <p>Welcome back, Acong! Here's your warehouse overview.</p>
        </header>

        <section className="cards">
          <div className="card">
            <h4>Total Barang Masuk</h4>
            <h2>1,420</h2>
            <p className="positive">↑ 15% vs last month</p>
          </div>

          <div className="card">
            <h4>Total Barang Keluar</h4>
            <h2>875</h2>
            <p className="positive">↑ 8% vs last month</p>
          </div>

          <div className="card">
            <h4>Total Barang</h4>
            <h2>5,210</h2>
            <p className="negative">↓ 2.5% vs last month</p>
          </div>
        </section>

        <section className="charts">
          <div className="chart-card">
            <h3>Total Barang (Monthly)</h3>
            <div className="bar-chart">
              <div style={{ height: "40%" }}>
                <span>400</span>
                <label>Jan</label>
              </div>
              <div style={{ height: "30%" }}>
                <span>300</span>
                <label>Feb</label>
              </div>
              <div style={{ height: "60%" }}>
                <span>600</span>
                <label>Mar</label>
              </div>
              <div style={{ height: "80%" }}>
                <span>800</span>
                <label>Apr</label>
              </div>
              <div style={{ height: "50%" }}>
                <span>500</span>
                <label>Mei</label>
              </div>
              <div style={{ height: "70%" }}>
                <span>700</span>
                <label>Jun</label>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3>Stock Tipe Barang</h3>
            <div className="donut-chart">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                  className="circle ransel"
                  strokeDasharray="40, 100"
                  d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 
                     a15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle selempang"
                  strokeDasharray="30, 100"
                  d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 
                     a15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle koper"
                  strokeDasharray="20, 100"
                  d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 
                     a15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle lainnya"
                  strokeDasharray="10, 100"
                  d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 
                     a15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <ul>
                <li><span className="dot ransel"></span> Ransel: 40%</li>
                <li><span className="dot selempang"></span> Selempang: 30%</li>
                <li><span className="dot koper"></span> Koper: 20%</li>
                <li><span className="dot lainnya"></span> Lainnya: 10%</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Warehouse;
