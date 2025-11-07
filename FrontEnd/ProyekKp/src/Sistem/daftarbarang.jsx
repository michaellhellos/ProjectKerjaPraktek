import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./daftarbarang.css";

const DaftarBarang = () => {
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState("barang");
  const [daftarBarang, setDaftarBarang] = useState([]);
  const navigate = useNavigate();

  // ✅ Load Data dari Backend
  const fetchBarang = async () => {
    try {
      const res = await axios.get("http://localhost:3000/barang");
      setDaftarBarang(res.data.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  const handleTambahBarang = () => {
    navigate("/Sistem/tambahbarang");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus barang ini?")) return;

    try {
      await axios.delete(`http://localhost:3000/barang/${id}`);
      alert("Barang berhasil dihapus!");

      // ✅ Refresh data setelah delete
      fetchBarang();
    } catch (err) {
      console.error("Gagal menghapus barang:", err);
      alert("Gagal menghapus barang!");
    }
  };

  const filteredBarang = daftarBarang.filter((item) =>
    item.namaBarang.toLowerCase().includes(search.toLowerCase())
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
                <th>Harga</th>
                <th>Stock</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredBarang.map((item) => (
                <tr key={item.idBarang}>
                  <td>{item.idBarang}</td>
                  <td>{item.namaBarang}</td>
                  <td>{item.hargaBarang}</td>
                  <td>{item.stockBarang}</td>
                  <td className="action-col">
                    <button className="btn-edit"><FaEdit /></button>
                    <button className="btn-delete" onClick={() => handleDelete(item.idBarang)}>
                      <FaTrash />
                    </button>
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
