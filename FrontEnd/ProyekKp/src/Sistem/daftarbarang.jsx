import React, { useState } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import "./daftarbarang.css";

const DaftarBarang = () => {
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState("barang"); // ✅ Tambah ini
  const navigate = useNavigate();

  const handleTambahBarang = () => {
    navigate("/Sistem/tambahbarang");
  };

  const daftarBarang = [
    { id: "SKU001", nama: "Koper Kabin Hard Case", tipe: "Hard Case", harga: "Rp 750.000" },
    { id: "SKU002", nama: "Tas Ransel Laptop", tipe: "Backpack", harga: "Rp 450.000" },
    { id: "SKU003", nama: "Koper Medium Soft Case", tipe: "Soft Case", harga: "Rp 950.000" },
    { id: "SKU004", nama: "Duffel Bag Olahraga", tipe: "Duffel Bag", harga: "Rp 350.000" },
    { id: "SKU005", nama: "Koper Besar Hard Case", tipe: "Hard Case", harga: "Rp 1.250.000" },
    { id: "SKU006", nama: "Tas Selempang Travel", tipe: "Lainnya", harga: "Rp 250.000" },
    { id: "SKU007", nama: "Koper Anak Lucu", tipe: "Hard Case", harga: "Rp 600.000" },
  ];

  const filteredBarang = daftarBarang.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleMenuClick = (key) => {
    setActiveMenu(key);
    if (key === "dashboard") navigate("/Sistem/sistem");
    else if (key === "karyawan") navigate("/Sistem/managekariawan");
    else if (key === "stock") navigate("/Sistem/stockgudang");
    else if (key === "barang") navigate("/Sistem/daftarBarang");
    else if (key === "retur") navigate("/Sistem/retur");
  };

  return (
    <div className="barang-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin</h2>
        <p className="sidebar-role">Warehouse Manager</p>
        <ul className="sidebar-menu">
          <li className={activeMenu === "dashboard" ? "active" : ""} onClick={() => handleMenuClick("dashboard")}>Dashboard</li>
          <li className={activeMenu === "karyawan" ? "active" : ""} onClick={() => handleMenuClick("karyawan")}>Manage Karyawan</li>
          <li className={activeMenu === "stock" ? "active" : ""} onClick={() => handleMenuClick("stock")}>Stock Gudang</li>
          <li className={activeMenu === "barang" ? "active" : ""} onClick={() => handleMenuClick("barang")}>Daftar Barang</li>
          <li className={activeMenu === "retur" ? "active" : ""} onClick={() => handleMenuClick("retur")}>Daftar Retur</li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="main-area">
        <h2 className="page-title">Daftar Barang</h2>

        <div className="content-box">
          <div className="content-header">
            <h3>Daftar Semua Barang</h3>

            <div className="top-actions">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Cari barang..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button className="btn-add" onClick={handleTambahBarang}>
                + Tambah Barang
              </button>
            </div>
          </div>

          <table className="table-barang">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Barang</th>
                <th>Tipe</th>
                <th>Harga</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredBarang.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.nama}</td>
                  <td>{item.tipe}</td>
                  <td>{item.harga}</td>
                  <td className="action-col">
                    <button className="btn-edit"><FaEdit /></button>
                    <button className="btn-delete"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default DaftarBarang;
