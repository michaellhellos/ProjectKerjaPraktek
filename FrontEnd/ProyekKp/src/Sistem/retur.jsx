// Retur.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./retur.css";

const Retur = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("retur");
  const [showPopup, setShowPopup] = useState(false);
  const [items, setItems] = useState([
    // contoh awal kosong lebih aman
    // { id: "SKU002", nama: "Tas Ransel Laptop", jumlah: 1, bukti: null },
  ]);
  const [newItem, setNewItem] = useState({ id: "", nama: "", jumlah: 1, bukti: null });
  const [loading, setLoading] = useState(false);

  // navigasi sidebar
  const handleMenuClick = (key) => {
    setActiveMenu(key);
    if (key === "karyawan") navigate("/Sistem/managekariawan");
    else if (key === "stock") navigate("/Sistem/stockgudang");
    else if (key === "barang") navigate("/Sistem/daftarBarang");
    else if (key === "dashboard") navigate("/Sistem/sistem");
    else if (key === "retur") navigate("/Sistem/retur");
  };

  const handleAddItem = () => {
    if (!newItem.id || !newItem.nama || !newItem.jumlah) {
      alert("Isi semua field ID, nama, jumlah sebelum simpan.");
      return;
    }
    setItems((prev) => [...prev, { ...newItem }]);
    setNewItem({ id: "", nama: "", jumlah: 1, bukti: null });
    setShowPopup(false);
  };

  const handleDelete = (i) => {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleFileUpload = (index, file) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], bukti: file };
      return copy;
    });
  };

  const handleNewItemFile = (file) => {
    setNewItem((prev) => ({ ...prev, bukti: file }));
  };

  // submit: kirim setiap item satu-per-satu (opsi A)
  const handleSubmitRetur = async () => {
    if (items.length === 0) {
      alert("Belum ada item retur.");
      return;
    }

    if (!window.confirm("Yakin akan memproses semua retur?")) return;

    setLoading(true);
    try {
      for (const item of items) {
        const formData = new FormData();
        formData.append("idBarang", item.id);
        formData.append("namaBarang", item.nama);
        formData.append("jumlah", item.jumlah);
        // jika tidak ada bukti, append null tidak diperlukan
        if (item.bukti) formData.append("fotoBukti", item.bukti);

        // sesuaikan URL jika backend port beda
        const res = await axios.post("http://localhost:3000/retur", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (!res.data.success) {
          throw new Error(res.data.message || "Gagal menyimpan satu item retur");
        }
      }

      alert("Semua retur berhasil diproses!");
      setItems([]);
    } catch (err) {
      console.error(err);
      alert("Gagal memproses retur: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // helper: render nama file kecil
  const fileLabel = (file) => (file ? file.name || "Bukti terpasang" : "Belum ada");

  return (
    <div className="retur-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin</h2>
        <p className="sidebar-role">Warehouse Manager</p>
        <ul className="sidebar-menu">
          <li className={activeMenu === "dashboard" ? "active" : ""} onClick={() => handleMenuClick("dashboard")}>Dashboard</li>
          <li className={activeMenu === "karyawan" ? "active" : ""} onClick={() => handleMenuClick("karyawan")}>Manage Karyawan</li>
          <li className={activeMenu === "stock" ? "active" : ""} onClick={() => handleMenuClick("stock")}>Stock Gudang</li>
          <li className={activeMenu === "barang" ? "active" : ""} onClick={() => handleMenuClick("barang")}>Daftar Barang</li>
          <li className={activeMenu === "retur" ? "active" : ""} onClick={() => handleMenuClick("retur")}>Buat Retur</li>
        </ul>
      </aside>

      {/* Main */}
      <div className="main-area">
        <h2 className="page-title">Retur Barang</h2>

        <div className="content-box">
          <div className="content-header">
            <h3>Buat Form Retur Barang</h3>
            <button className="btn-add-retur" onClick={() => setShowPopup(true)}>
              <FaPlus /> Tambah Barang
            </button>
          </div>

          <table className="table-retur">
            <thead>
              <tr>
                <th>NO</th>
                <th>ID BARANG</th>
                <th>NAMA BARANG</th>
                <th>JUMLAH</th>
                <th>FOTO BUKTI</th>
                <th>AKSI</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.id}</td>
                  <td>{item.nama}</td>
                  <td>
                    <input
                      type="number"
                      className="input-jumlah"
                      value={item.jumlah}
                      min="1"
                      onChange={(e) => {
                        const val = Number(e.target.value) || 1;
                        setItems((prev) => {
                          const copy = [...prev];
                          copy[index] = { ...copy[index], jumlah: val };
                          return copy;
                        });
                      }}
                    />
                  </td>
                  <td>
                    <label className="upload-btn">
                      {fileLabel(item.bukti)}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleFileUpload(index, e.target.files[0])}
                      />
                    </label>
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => handleDelete(index)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>Belum ada barang retur</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="bottom-actions">
            <button className="btn-cancel" onClick={() => { if (window.confirm("Batal dan kosongkan form?")) setItems([]); }} disabled={loading}>Batal</button>
            <button className="btn-process" onClick={handleSubmitRetur} disabled={loading}>
              {loading ? "Mengirim..." : "Proses Retur"}
            </button>
          </div>
        </div>
      </div>

      {/* POPUP: tambah item */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-header">
              <h3>Tambah Barang Retur</h3>
              <FaTimes className="close-icon" onClick={() => setShowPopup(false)} />
            </div>

            <input
              type="text"
              className="popup-input"
              placeholder="ID Barang"
              value={newItem.id}
              onChange={(e) => setNewItem((p) => ({ ...p, id: e.target.value }))}
            />

            <input
              type="text"
              className="popup-input"
              placeholder="Nama Barang"
              value={newItem.nama}
              onChange={(e) => setNewItem((p) => ({ ...p, nama: e.target.value }))}
            />

            <input
              type="number"
              className="popup-input"
              min="1"
              value={newItem.jumlah}
              onChange={(e) => setNewItem((p) => ({ ...p, jumlah: Number(e.target.value) || 1 }))}
            />

            <label className="upload-area">
              {newItem.bukti ? newItem.bukti.name : "Upload Bukti (opsional)"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleNewItemFile(e.target.files[0])}
              />
            </label>

            <div className="popup-actions">
              <button className="btn-cancel" onClick={() => setShowPopup(false)}>Batal</button>
              <button className="btn-save" onClick={handleAddItem}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Retur;
