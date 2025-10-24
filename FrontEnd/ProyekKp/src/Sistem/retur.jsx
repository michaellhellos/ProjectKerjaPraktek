import React, { useState } from "react";
import { FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./retur.css";

const Retur = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("retur");
  const [showPopup, setShowPopup] = useState(false);

  const [items, setItems] = useState([
    { id: "SKU002", nama: "Tas Ransel Laptop", jumlah: 1, bukti: null },
    { id: "SKU006", nama: "Tas Selempang Travel", jumlah: 2, bukti: null },
  ]);

  const [newItem, setNewItem] = useState({
    id: "",
    nama: "",
    jumlah: 1,
    bukti: null
  });

  const handleMenuClick = (key) => {
    setActiveMenu(key);
    if (key === "karyawan") navigate("/Sistem/managekariawan");
    else if (key === "stock") navigate("/Sistem/stockgudang");
    else if (key === "barang") navigate("/Sistem/daftarBarang");
    else if (key === "dashboard") navigate("/Sistem/sistem");
    else if (key === "retur") navigate("/Sistem/retur");
    
  };

  const handleAddItem = () => {
    setItems([...items, newItem]);
    setNewItem({ id: "", nama: "", jumlah: 1, bukti: null });
    setShowPopup(false);
  };

  const handleDelete = (i) => {
    setItems(items.filter((_, index) => index !== i));
  };

  const handleFileUpload = (index, file) => {
    const updated = [...items];
    updated[index].bukti = file;
    setItems(updated);
  };

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
                        const updated = [...items];
                        updated[index].jumlah = e.target.value;
                        setItems(updated);
                      }}
                    />
                  </td>
                  <td>
                    <label className="upload-btn">
                      Upload
                      <input
                        type="file"
                        hidden
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
            </tbody>
          </table>

          <div className="bottom-actions">
            <button className="btn-cancel">Batal</button>
            <button className="btn-process">Proses Retur</button>
          </div>
        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-header">
              <h3>Tambah Barang Retur</h3>
              <FaTimes className="close-icon" onClick={() => setShowPopup(false)} />
            </div>

            <input type="text" className="popup-input" placeholder="ID Barang" value={newItem.id}
              onChange={(e) => setNewItem({ ...newItem, id: e.target.value })} />

            <input type="text" className="popup-input" placeholder="Nama Barang" value={newItem.nama}
              onChange={(e) => setNewItem({ ...newItem, nama: e.target.value })} />

            <input type="number" className="popup-input" min="1" value={newItem.jumlah}
              onChange={(e) => setNewItem({ ...newItem, jumlah: e.target.value })} />

            <div className="upload-area">Klik atau seret foto bukti ke sini</div>

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
