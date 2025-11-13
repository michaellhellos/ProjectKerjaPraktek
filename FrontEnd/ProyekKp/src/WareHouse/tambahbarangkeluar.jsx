import React, { useState, useEffect } from "react";
import axios from "axios";
import "./tambahbarangkeluar.css";

const TambahBarangKeluar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [dataBarangKeluar, setDataBarangKeluar] = useState([]);
  const [formData, setFormData] = useState({
    idBarang: "",
    namaBarang: "",
    jumlahKeluar: "",
    tanggalKeluar: "",
    karyawan: "",
    fotoInvoice: null,
  });

  useEffect(() => {
    axios.get("http://localhost:3000/barangkeluar")
      .then((res) => setDataBarangKeluar(res.data.data))
      .catch((err) => console.error("Error loading data:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sendData = new FormData();
    Object.keys(formData).forEach((key) => {
      sendData.append(key, formData[key]);
    });

    try {
      const response = await fetch("http://localhost:3000/barangkeluar", {
        method: "POST",
        body: sendData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Barang keluar berhasil disimpan!");
        setShowPopup(false);
        setFormData({
          idBarang: "",
          namaBarang: "",
          jumlahKeluar: "",
          tanggalKeluar: "",
          karyawan: "",
          fotoInvoice: null,
        });
        axios.get("http://localhost:3000/barangkeluar").then((res) => {
          setDataBarangKeluar(res.data.data);
        });
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
      alert("❌ Server error!");
    }
  };

  return (
    <div className="keluar-container">
      <aside className="sidebar">
        <div className="profile">
          <div className="profile-icon">A</div>
          <h3>Acong</h3>
        </div>
        <nav className="nav-menu">
          <a href="/WareHouse/warehouse">📊 Dashboard</a>
          <a href="/WareHouse/gudangstockbarang">📦 Stock Gudang</a>
          <a href="/WareHouse/tambahbaranggudang">➕ Tambah Barang Masuk</a>
          <a href="/WareHouse/tambahbarangkeluar" className="active">📤 Barang Keluar</a>
          <a href="/WareHouse/returgudang">↩️ Return Barang</a>
        </nav>
        <button className="logout-btn">🚪 Keluar</button>
      </aside>

      <main className="main-content">
        <header>
          <h1>Barang Keluar</h1>
          <p>Track and manage outgoing warehouse inventory</p>
        </header>

        <div className="table-container">
          <div className="table-header">
            <h3>Daftar Barang Keluar</h3>
            <button className="add-btn" onClick={() => setShowPopup(true)}>
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
                <th>Karyawan</th>
                <th>Foto Invoice</th>
              </tr>
            </thead>

            <tbody>
              {dataBarangKeluar.length > 0 ? (
                dataBarangKeluar.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.idBarang}</td>
                    <td>{item.namaBarang}</td>
                    <td>{item.jumlahKeluar}</td>
                    <td>{item.tanggalKeluar?.substring(0, 10)}</td>
                    <td>{item.karyawan}</td>
                    <td>
                      {item.fotoInvoice ? (
                        <a
                          href={`http://localhost:3000/uploads/tambahbarangkeluar/foto/${item.fotoInvoice}`}
                          target="_blank"
                          rel="noreferrer"
                          className="lihat-link"
                        >
                          Lihat
                        </a>
                      ) : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <div className="popup-header">
                <h3>Tambah Barang Keluar</h3>
                <button className="close-btn" onClick={() => setShowPopup(false)}>✖</button>
              </div>

              <form onSubmit={handleSubmit}>
                <label>ID Barang</label>
                <input type="text" name="idBarang" required onChange={handleChange} />

                <label>Nama Barang</label>
                <input type="text" name="namaBarang" required onChange={handleChange} />

                <label>Jumlah Keluar</label>
                <input type="number" name="jumlahKeluar" required onChange={handleChange} />

                <label>Tanggal Keluar</label>
                <input type="date" name="tanggalKeluar" required onChange={handleChange} />

                <label>Pilih Karyawan</label>
                <select name="karyawan" required onChange={handleChange}>
                  <option value="">Pilih</option>
                  <option value="Budi Santoso">Budi Santoso</option>
                  <option value="Siti Aminah">Siti Aminah</option>
                  <option value="Joko Widodo">Joko Widodo</option>
                </select>

                <label>Foto Invoice</label>

                  <div className="file-input-wrapper">
                    <button
                      type="button"
                      className="choose-file-btn"
                      onClick={() => document.getElementById("fotoInvoiceInput").click()}
                    >
                      📁 Choose File
                    </button>

                    <span className="file-name">
                      {formData.fotoInvoice ? formData.fotoInvoice.name : "Belum ada file"}
                    </span>

                    {/* Hidden real file input */}
                    <input
                      id="fotoInvoiceInput"
                      type="file"
                      accept="image/*"
                      name="fotoInvoice"
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                  </div>

                <div className="button-row">
                  <button type="button" className="btn-cancel" onClick={() => setShowPopup(false)}>Batal</button>
                  <button type="submit" className="btn-submit">Simpan</button>
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
