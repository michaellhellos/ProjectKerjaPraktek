import React, { useState } from "react";
import "./tambahbarang.css";

const TambahBarang = () => {
  const [foto, setFoto] = useState(null);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFoto(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Barang berhasil ditambahkan!");
  };

  return (
    <div className="tambahbarang-container">
      <div className="tambahbarang-box">
        <h2>Tambah Barang Baru</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ID Barang</label>
            <input type="text" placeholder="Contoh: SKU001" required />
          </div>

          <div className="form-group">
            <label>Nama Barang</label>
            <input type="text" placeholder="Masukkan nama barang" required />
          </div>

          <div className="form-group">
            <label>Harga Barang</label>
            <input type="number" placeholder="Masukkan harga barang" required />
          </div>

          <div className="form-group">
            <label>Stock Barang</label>
            <input type="number" placeholder="Masukkan jumlah stock" required />
          </div>

          <div className="form-group">
            <label>Foto Barang</label>
            <input type="file" accept="image/*" onChange={handleFotoChange} required />
          </div>

          {foto && (
            <div className="preview">
              <p>Preview Gambar:</p>
              <img src={foto} alt="Preview" />
            </div>
          )}

          <div className="btn-group">
            <button type="submit" className="btn-save">Simpan</button>
            <button type="reset" className="btn-reset" onClick={() => setFoto(null)}>
              Reset
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default TambahBarang;
