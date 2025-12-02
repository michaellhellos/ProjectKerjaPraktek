import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./tambahbarang.css";
import Logo from "../images/Logo.jpg";
const TambahBarang = () => {
  const navigate = useNavigate(); // <--- TAMBAH INI

  const [formData, setFormData] = useState({
    idBarang: "",
    namaBarang: "",
    hargaBarang: "",
    stockBarang: "",
  });

  const [fotoFile, setFotoFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [barcodeUrl, setBarcodeUrl] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFotoFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fotoFile) {
      alert("Harap pilih foto barang!");
      return;
    }

    const data = new FormData();
    data.append("idBarang", formData.idBarang);
    data.append("namaBarang", formData.namaBarang);
    data.append("hargaBarang", formData.hargaBarang);
    data.append("stockBarang", formData.stockBarang);
    data.append("fotoBarang", fotoFile);

    try {
      const res = await axios.post("http://localhost:3000/tambahbarang", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("✅ Barang berhasil ditambahkan!");

        setBarcodeUrl("http://localhost:3000" + res.data.barcode);
        setShowPopup(true);

        setFormData({
          idBarang: "",
          namaBarang: "",
          hargaBarang: "",
          stockBarang: "",
        });
        setFotoFile(null);
        setPreview(null);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan: " + err.message);
    }
  };

  return (
    <div className="tambahbarang-container">
      <div className="tambahbarang-box">
        <h2>Tambah Barang Baru</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ID Barang</label>
            <input
              type="text"
              name="idBarang"
              value={formData.idBarang}
              onChange={handleChange}
              placeholder="Contoh: SKU001"
              required
            />
          </div>

          <div className="form-group">
            <label>Nama Barang</label>
            <input
              type="text"
              name="namaBarang"
              value={formData.namaBarang}
              onChange={handleChange}
              placeholder="Masukkan nama barang"
              required
            />
          </div>

          <div className="form-group">
            <label>Harga Barang</label>
            <input
              type="number"
              name="hargaBarang"
              value={formData.hargaBarang}
              onChange={handleChange}
              placeholder="Masukkan harga barang"
              required
            />
          </div>

          <div className="form-group">
            <label>Stock Barang</label>
            <input
              type="number"
              name="stockBarang"
              value={formData.stockBarang}
              onChange={handleChange}
              placeholder="Masukkan jumlah stock"
              required
            />
          </div>

          <div className="upload-wrapper">
            <label htmlFor="fotoBarang" className="upload-btn">
              Pilih Foto Barang
            </label>
            <input
              id="fotoBarang"
              name="fotoBarang"
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              hidden
              required
            />
          </div>

          {preview && (
            <div className="preview">
              <img src={preview} alt="Preview Barang" />
            </div>
          )}

          <div className="btn-group">
            <button type="submit" className="btn-save">
              Simpan
            </button>

            <button
              type="button"
              className="btn-reset"
              onClick={() => {
                setFormData({
                  idBarang: "",
                  namaBarang: "",
                  hargaBarang: "",
                  stockBarang: "",
                });
                setFotoFile(null);
                setPreview(null);
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* POPUP BARCODE */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Barcode Berhasil Dibuat</h3>

            {barcodeUrl && (
              <img
                src={barcodeUrl}
                alt="Barcode"
                className="barcode-image"
              />
            )}

            <div className="popup-buttons">
              <button className="btn-print" onClick={() => window.print()}>
                Print Barcode
              </button>

              <button
                className="btn-close"
                onClick={() => {
                  setShowPopup(false);
                  navigate("/Sistem/daftarBarang"); // <--- REDIRECT DI SINI
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TambahBarang;
