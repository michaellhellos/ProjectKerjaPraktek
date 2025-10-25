import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- TAMBAH INI
import "./HomePage.css";

const dataProduk = [
  { id: 1, nama: "Koper Kabin Fiber 20 Inch", harga: 750000, stock: 15 },
  { id: 2, nama: "Ransel Laptop Anti Air", harga: 120000, stock: 25 },
  { id: 3, nama: "Travel Duffel Bag Large", harga: 480000, stock: 8 },
  { id: 4, nama: "Koper Kargo 28 Inch", harga: 1250000, stock: 12 },
  { id: 5, nama: "Tas Selempang Kulit Asli", harga: 650000, stock: 10 },
];

const HomePage = () => {
  const navigate = useNavigate(); // <-- TAMBAH INI

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [jumlah, setJumlah] = useState(1);

  const filteredProduk = dataProduk.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (product) => {
    setSelectedProduct(product);
    setJumlah(1);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const tambahJumlah = () => {
    if (jumlah < selectedProduct.stock) {
      setJumlah(jumlah + 1);
    }
  };

  const kurangJumlah = () => {
    if (jumlah > 1) {
      setJumlah(jumlah - 1);
    }
  };

  const handleTambahKeranjang = () => {
    alert(`Berhasil ditambahkan: ${selectedProduct.nama} x ${jumlah}`);
    closeModal();
  };

  return (
    <div className="home-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="profile">
          <h3>Toko</h3>
          <p>Karyawan</p>
        </div>
        <ul>
          <li className="active" onClick={() => navigate("/Karyawan/homepage")}>List Barang</li>
          <li onClick={() => navigate("/Karyawan/keranjang")}>Keranjang</li> 
          <li onClick={() => navigate("/Karyawan/gudang")}>Catat Stock Gudang</li> 
        </ul>
        <button className="logout">Keluar</button>
      </aside>

      {/* MAIN */}
      <main className="main">
        <input
          type="text"
          className="search-input"
          placeholder="Cari di Toko..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="product-grid">
          {filteredProduk.map((item) => (
            <div className="card" key={item.id}>
              <div className="img-placeholder">Gambar</div>
              <h4>{item.nama}</h4>
              <p>Harga: Rp {item.harga.toLocaleString()}</p>
              <p>Stock: {item.stock}</p>
              <button className="btn-add" onClick={() => openModal(item)}>
                Tambah ke Keranjang
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL */}
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Jumlah Barang</h3>

            <p className="nama-produk">{selectedProduct.nama}</p>
            <p className="stok-info">Stok tersedia: {selectedProduct.stock}</p>

            <div className="jumlah-control">
              <button onClick={kurangJumlah}>-</button>
              <span>{jumlah}</span>
              <button onClick={tambahJumlah}>+</button>
            </div>

            <p className="total-harga">
              Total Harga:
              <br />
              <strong>
                Rp {(selectedProduct.harga * jumlah).toLocaleString()}
              </strong>
            </p>

            <div className="modal-btn">
              <button className="btn-cancel" onClick={closeModal}>
                Batal
              </button>
              <button className="btn-confirm" onClick={handleTambahKeranjang}>
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
