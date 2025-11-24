import React, { useState } from "react";
import "./returgudang.css";

function ReturGudang() {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const dataRetur = [
    {
      no: 1,
      idBarang: "TAS-002",
      namaBarang: "Tas Selempang Kulit Pria",
      jumlah: 1,
      foto: "foto-cacat-kulit.jpg",
      status: "Sudah di retur",
      warna: "green",
    },
    {
      no: 2,
      idBarang: "TAS-004",
      namaBarang: "Tas Laptop Anti Air",
      jumlah: 2,
      foto: "resleting-rusak.png",
      status: "Sudah di ambil",
      warna: "blue",
    },
    {
      no: 3,
      idBarang: "TAS-001",
      namaBarang: "Tas Ransel Gunung Eiger 60L",
      jumlah: 1,
      foto: "jahitan-lepas.jpg",
      status: "Belum di ambil",
      warna: "yellow",
    },
  ];

  return (
    <div className="retur-container">
      <h2 className="title">Goods Return</h2>
      <p className="subtitle">Create and manage goods return requests.</p>
      <nav className="nav-menu">
          <a href="/WareHouse/warehouse">📊 Dashboard</a>
          <a href="/WareHouse/gudangstockbarang" >📦 Stock Gudang</a>
          <a href="/WareHouse/tambahbaranggudang">➕ Tambah Barang Masuk</a>
          <a href="/WareHouse/tambahbarangkeluar">📤 Barang Keluar</a>
          <a href="/WareHouse/returgudang" className="active">↩️ Return Barang</a>
          <button className="logout-btn"href="/">🚪 Keluar</button>
        </nav>

      <div className="retur-card">
        <div className="card-header">
          <h3>Buat Pengajuan Retur Barang</h3>
          <button className="btn-add" onClick={toggleModal}>
            + Tambah Barang
          </button>
        </div>

        <table className="retur-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>ID BARANG</th>
              <th>NAMA BARANG</th>
              <th>JUMLAH</th>
              <th>FOTO BUKTI</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {dataRetur.map((item) => (
              <tr key={item.no}>
                <td>{item.no}</td>
                <td className="id">{item.idBarang}</td>
                <td>{item.namaBarang}</td>
                <td>{item.jumlah}</td>
                <td>
                  <a href="#!" className="link-foto">
                    {item.foto}
                  </a>
                </td>
                <td>
                  <span className={`status-badge ${item.warna}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="action-buttons">
          <button className="btn-cancel">Batal</button>
          <button className="btn-submit">Ajukan Retur</button>
        </div>
      </div>

      {/* ✅ Popup Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tambah Barang untuk Diretur</h3>
              <button className="close-btn" onClick={toggleModal}>
                ✕
              </button>
            </div>

            <form className="modal-form">
              <label>ID Barang</label>
              <input type="text" placeholder="Contoh: TAS-002" />

              <label>Nama Barang</label>
              <input type="text" placeholder="Contoh: Tas Selempang Kulit Pria" />

              <label>Jumlah Retur</label>
              <input type="number" min="1" defaultValue="1" />

              <label>Foto Bukti (Opsional)</label>
              <div className="upload-box">
                <p>
                  <span className="upload-link">Klik untuk memilih foto</span>{" "}
                  atau seret file foto <br /> PNG, JPG hingga 10MB
                </p>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={toggleModal}>
                  Batal
                </button>
                <button type="submit" className="btn-submit">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReturGudang;
