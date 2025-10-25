import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./gudang.css";

const dataGudang = [
  { id: 1, nama: "Koper Kabin Fiber 20 Inch", harga: 750000, stock: 15 },
  { id: 2, nama: "Ransel Laptop Anti Air", harga: 120000, stock: 25 },
  { id: 3, nama: "Travel Duffel Bag Large", harga: 480000, stock: 8 },
  { id: 4, nama: "Koper Kargo 28 Inch", harga: 1250000, stock: 12 },
  { id: 5, nama: "Tas Selempang Kulit Asli", harga: 650000, stock: 18 },
  { id: 6, nama: "Backpack Hiking 40L", harga: 950000, stock: 22 },
  { id: 7, nama: "Koper Anak Motif Kartun", harga: 500000, stock: 30 },
  { id: 8, nama: "Tas Pinggang Sporty", harga: 100000, stock: 40 },
];

const Gudang = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredData = dataGudang.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="gudang-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="profile">
          <h3>Toko</h3>
          <p>Karyawan</p>
        </div>

        <ul>
          <li onClick={() => navigate("/")}>List Barang</li>
          <li onClick={() => navigate("/keranjang")}>Keranjang</li>
          <li className="active">Cek Stok Gudang</li>
        </ul>

        <button className="logout">Keluar</button>
      </aside>

      {/* MAIN */}
      <main className="main-gudang">
        <h2>Stok Gudang</h2>

        <input
          type="text"
          className="search-barang"
          placeholder="Cari nama barang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="gudang-grid">
          {filteredData.map((item) => (
            <div className="card-gudang" key={item.id}>
              <div className="img-placeholder-gudang">Gambar</div>
              <h4>{item.nama}</h4>
              <p>Rp {item.harga.toLocaleString()}</p>

              <div
                className={`stock-circle ${
                  item.stock <= 10
                    ? "red"
                    : item.stock <= 20
                    ? "yellow"
                    : "green"
                }`}
              >
                {item.stock}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Gudang;
