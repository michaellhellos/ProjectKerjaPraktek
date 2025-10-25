import React, { useState } from "react";
import "./tambahbarangkeluar.css";

const TambahBarangKeluar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    idBarang: "",
    jumlah: 0,
    tanggalKeluar: "",
    kurir: "",
    fotoInvoice: null,
  });

  const dataBarang = [
    {
      no: 1,
      id: "TAS-002",
      nama: "Tas Selempang Kulit Pria",
      jumlah: 2,
      tanggal: "2023-05-14",
      kurir: "Budi Santoso",
    },
    {
      no: 2,
      id: "TAS-004",
      nama: "Tas Laptop Anti Air",
      jumlah: 5,
      tanggal: "2023-05-15",
      kurir: "Siti Aminah",
    },
    {
      no: 3,
      id: "TAS-001",
      nama: "Tas Ransel Gunung Eiger 60L",
      jumlah: 1,
      tanggal: "2023-05-16",
      kurir: "Joko Widodo",
    },
    {
      no: 4,
      id: "TAS-006",
      nama: "Koper Bagasi American Tourister",
      jumlah: 3,
      tanggal: "2023-05-18",
      kurir: "Budi Santoso",
    },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "fotoInvoice") {
      setFormData({ ...formData, fotoInvoice: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Barang keluar berhasil disimpan!");
    console.log(formData);
    setShowPopup(false);
  };

  return (
    <div className="keluar-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile">
          <div className="profile-icon">A</div>
          <h3>Acong</h3>
        </div>

        <nav className="nav-menu">
          <a href="#">📊 Dashboard</a>
          <a href="#">📦 Stock Gudang</a>
          <a href="#">➕ Tambah Barang Masuk</a>
          <a href="#" className="active">📤 Barang Keluar</a>
          <a href="#">↩️ Return Barang</a>
        </nav>

        <button className="logout-btn">🚪 Keluar</button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header>
          <h1>Barang Keluar</h1>
          <p>Track and manage all outgoing goods from the warehouse.</p>
        </header>

        <div className="table-container">
          <div className="table-header">
            <h3>Daftar Barang Keluar</h3>
            <button
              className="add-btn"
              onClick={() => setShowPopup(true)}
            >
              + Tambah Barang Keluar
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>ID Barang</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Tgl Keluar</th>
                <th>Kurir</th>
                <th>Foto Invoice</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataBarang.map((item) => (
                <tr key={item.no}>
                  <td>{item.no}</td>
                  <td>{item.id}</td>
                  <td>{item.nama}</td>
                  <td>{item.jumlah}</td>
                  <td>{item.tanggal}</td>
                  <td>{item.kurir}</td>
                  <td>
                    <a href="#" className="lihat-link">
                      Lihat
                    </a>
                  </td>
                  <td>
                    <button className="edit-btn">✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* POPUP FORM */}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <div className="popup-header">
                <h3>Tambah Barang Keluar</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowPopup(false)}
                >
                  ✖
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>ID / Nama Barang</label>
                  <input
                    type="text"
                    name="idBarang"
                    placeholder="Cari berdasarkan ID atau Nama"
                    value={formData.idBarang}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Jumlah Keluar</label>
                  <input
                    type="number"
                    name="jumlah"
                    min="0"
                    value={formData.jumlah}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tanggal Keluar</label>
                  <input
                    type="date"
                    name="tanggalKeluar"
                    value={formData.tanggalKeluar}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Karyawan (Kurir)</label>
                  <select
                    name="kurir"
                    value={formData.kurir}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih Karyawan</option>
                    <option value="Budi Santoso">Budi Santoso</option>
                    <option value="Siti Aminah">Siti Aminah</option>
                    <option value="Joko Widodo">Joko Widodo</option>
                  </select>
                </div>

                <div className="form-group file-upload">
                  <label>Foto Invoice</label>
                  <div className="upload-area">
                    <input
                      type="file"
                      name="fotoInvoice"
                      id="fotoInvoice"
                      accept="image/png, image/jpeg, image/gif"
                      onChange={handleChange}
                    />
                    <p>
                      <span>Klik untuk memilih</span> atau seret file foto<br />
                      <small>PNG, JPG, GIF hingga 10MB</small>
                    </p>
                  </div>
                </div>

                <div className="button-row">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowPopup(false)}
                  >
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
      </main>
    </div>
  );
};

export default TambahBarangKeluar;
