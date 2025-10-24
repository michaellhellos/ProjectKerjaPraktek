import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import "./stockgudang.css";

const StockGudang = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("stock");
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  const dataBarang = [
    { id: "SKU001", nama: "Koper Kabin Hard Case", jumlah: 25, masuk: "2023-01-15", keluar: "2023-03-20", tipe: "Hard Case" },
    { id: "SKU002", nama: "Tas Ransel Laptop", jumlah: 8, masuk: "2023-02-10", keluar: "-", tipe: "Backpack" },
    { id: "SKU003", nama: "Koper Medium Soft Case", jumlah: 0, masuk: "2023-01-20", keluar: "2023-04-01", tipe: "Soft Case" },
    { id: "SKU004", nama: "Duffel Bag Olahraga", jumlah: 15, masuk: "2023-03-05", keluar: "-", tipe: "Duffel Bag" },
    { id: "SKU005", nama: "Koper Besar Hard Case", jumlah: 40, masuk: "2023-02-25", keluar: "-", tipe: "Hard Case" },
    { id: "SKU006", nama: "Tas Selempang Travel", jumlah: 3, masuk: "2023-04-10", keluar: "2023-04-12", tipe: "Lainnya" },
  ];

  const filteredBarang = dataBarang.filter(
    (item) =>
      (filter === "Semua" || item.tipe === filter) &&
      item.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleMenuClick = (key) => {
    setActiveMenu(key);
    if (key === "karyawan") navigate("/Sistem/managekariawan");
    else if (key === "stock") navigate("/Sistem/stockgudang");
    else if (key === "barang") navigate("/Sistem/daftarBarang");
    else if (key === "retur") navigate("/Sistem/retur");
    else if (key === "dashboard") navigate("/Sistem/sistem");
  };

  return (
    <div className="stock-container">

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
                <th>Tgl Keluar</th>
                <th>Tipe</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredBarang.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.nama}</td>
                  <td className={item.jumlah <= 3 ? "warning" : ""}>{item.jumlah}</td>
                  <td>{item.masuk}</td>
                  <td>{item.keluar}</td>
                  <td>{item.tipe}</td>
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

export default StockGudang;
