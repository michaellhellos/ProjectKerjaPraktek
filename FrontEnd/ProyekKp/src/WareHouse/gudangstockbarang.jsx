import React, { useEffect, useState } from "react";
import axios from "axios";
import "./gudangstockbarang.css";
import Logo from "../images/Logo.jpg";
import { useNavigate } from "react-router-dom";

const GudangStockBarang = () => {
  const navigate = useNavigate();   // ← WAJIB

  const [dataBarang, setDataBarang] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDataBarang();
  }, []);

  const fetchDataBarang = async () => {
    try {
      const res = await axios.get("http://localhost:3000/barangmasuk");
      setDataBarang(res.data.data || []); 
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
  };

  const filteredData = dataBarang.filter((barang) =>
    barang.namaBarang?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="gudang-container">
      
      <aside className="sidebar">
        <div className="profile">
          <img
            src={Logo}
            alt="Profil"
            className="profile-image clickable-image"
            onClick={() => navigate("/WareHouse/editprofile")}
          />
          <h3>Semoga Jadi Jaya</h3>
        </div>

        <nav className="nav-menu">
          <a href="/WareHouse/warehouse">📊 Dashboard</a>
          <a href="/WareHouse/gudangstockbarang" className="active">📦 Stock Gudang</a>
          <a href="/WareHouse/tambahbaranggudang">➕ Tambah Barang Masuk</a>
          <a href="/WareHouse/tambahbarangkeluar">📤 Barang Keluar</a>
        </nav>

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

      <main className="main-content">
        <header>
          <h1>Stock Gudang</h1>
          <p>Manage and monitor your warehouse inventory.</p>
        </header>

        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Cari barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID BARANG</th>
                <th>NAMA BARANG</th>
                <th>TIPE BARANG</th>
                <th>JUMLAH STOCK</th>
                <th>TANGGAL MASUK</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((barang, index) => (
                  <tr key={index}>
                    <td>{barang.idBarang}</td>
                    <td>{barang.namaBarang}</td>
                    <td>
                      <span className={`badge ${barang.tipeBarang?.toLowerCase()}`}>
                        {barang.tipeBarang}
                      </span>
                    </td>
                    <td>{barang.jumlahBarang}</td>
                    <td>{barang.tanggalMasuk?.slice(0, 10)}</td>
                    <td className="aksi">
                      <button className="edit-btn">✏️</button>
                      <button className="view-btn">👁️</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

    </div>
  );
};

export default GudangStockBarang;
