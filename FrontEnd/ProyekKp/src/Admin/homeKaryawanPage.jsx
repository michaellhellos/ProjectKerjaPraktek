import React, { useState } from "react";
import "./homeKaryawanPage.css";

const dataProduk = [
  { id: 1, nama: "Koper Kabin Fiber 20 Inch", harga: 750000, stock: 15 },
  { id: 2, nama: "Ransel Laptop Anti Air", harga: 120000, stock: 25 },
  { id: 3, nama: "Travel Duffel Bag Large", harga: 480000, stock: 8 },
  { id: 4, nama: "Koper Kargo 28 Inch", harga: 1250000, stock: 12 },
  { id: 5, nama: "Tas Selempang Kulit Asli", harga: 650000, stock: 10 },
  { id: 6, nama: "Backpack Hiking 40L", harga: 720000, stock: 20 },
  { id: 7, nama: "Koper Anak Motif Kartun", harga: 320000, stock: 18 },
  { id: 8, nama: "Tas Pinggang Sporty", harga: 98000, stock: 30 },
];

const HomeKaryawanPage = () => {
  const [search, setSearch] = useState("");

  const filteredProduk = dataProduk.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="profile">
          <h3>Toko</h3>
          <p>Karyawan</p>
        </div>
        <ul>
          <li className="active">List Barang</li>
          <li>Keranjang</li>
          <li>Catat Stok Gudang</li>
        </ul>
        <button className="logout">Keluar</button>
      </aside>

      {/* MAIN KONTAINER */}
      <main className="main">
        <div className="search-container">
          <input
            type="text"
            placeholder="Cari di Toko..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="product-grid">
          {filteredProduk.map((item) => (
            <div className="card" key={item.id}>
              <div className="img-placeholder">Gambar</div>
              <h4>{item.nama}</h4>
              <p>Harga: Rp {item.harga.toLocaleString()}</p>
              <p>Stock: {item.stock}</p>
              <button className="btn-add">Tambah ke Keranjang</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomeKaryawanPage;
