import React, { useState } from "react";
import axios from "axios";
import "./tambahbarang.css";

const TambahBarang = () => {
  const [formData, setFormData] = useState({
    idBarang: "",
    namaBarang: "",
    hargaBarang: "",
    stockBarang: "",
  });

  const [fotoFile, setFotoFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // handle input text
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle foto
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFotoFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  // handle submit
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
    data.append("fotoBarang", fotoFile); // ini penting: nama field harus sama dengan backend

    try {
      const res = await axios.post("http://localhost:3000/tambahbarang", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("✅ Barang berhasil ditambahkan!");
        setFormData({
          idBarang: "",
          namaBarang: "",
          hargaBarang: "",
          stockBarang: "",
        });
        setFotoFile(null);
        setPreview(null);
      } else {
        alert("❌ Gagal menambahkan barang: " + res.data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="tambahbarang-container">
      <div className="tambahbarang-box">
        <h2>Tambah Barang Baru</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
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

          {/* === BAGIAN FOTO BARANG === */}
          <div className="form-group">
            <label>Foto Barang</label>
            <input
              type="file"
              name="fotoBarang"
              accept="image/*"
              onChange={handleFotoChange}
              required
            />
          </div>

          {/* Preview Foto */}
          {preview && (
            <div className="preview">
              <p>Preview Gambar:</p>
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </div>
          )}

          <div className="btn-group">
            <button type="submit" className="btn-save">
              Simpan
            </button>
            <button
              type="reset"
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
    </div>
  );
};

export default TambahBarang;
