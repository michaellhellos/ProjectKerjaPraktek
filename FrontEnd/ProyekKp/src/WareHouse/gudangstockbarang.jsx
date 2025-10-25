import React from "react";
import "./gudangstockbarang.css";

const GudangStockBarang = () => {
  const dataBarang = [
    {
      id: "TAS-001",
      nama: "Tas Ransel Gunung Eiger 60L",
      tipe: "Ransel",
      stock: 50,
      tanggal: "2023-05-10",
    },
    {
      id: "TAS-002",
      nama: "Tas Selempang Kulit Pria",
      tipe: "Selempang",
      stock: 120,
      tanggal: "2023-05-12",
    },
    {
      id: "TAS-003",
      nama: "Koper Kabin Polo 20 inch",
      tipe: "Koper",
      stock: 75,
      tanggal: "2023-05-15",
    },
    {
      id: "TAS-004",
      nama: "Tas Laptop Anti Air",
      tipe: "Ransel",
      stock: 85,
      tanggal: "2023-04-20",
    },
    {
      id: "TAS-005",
      nama: "Tas Pinggang Sporty",
      tipe: "Lainnya",
      stock: 200,
      tanggal: "2023-05-18",
    },
    {
      id: "TAS-006",
      nama: "Koper Bagasi American Tourister",
      tipe: "Koper",
      stock: 40,
      tanggal: "2023-05-01",
    },
  ];

  return (
    <div className="gudang-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile">
          <div className="profile-icon">A</div>
          <h3>Acong</h3>
        </div>

        <nav className="nav-menu">
          <a href="#">📊 Dashboard</a>
          <a href="#" className="active">📦 Stock Gudang</a>
          <a href="#">➕ Tambah Barang Masuk</a>
          <a href="#">📤 Barang Keluar</a>
          <a href="#">↩️ Return Barang</a>
        </nav>

        <button className="logout-btn">🚪 Keluar</button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header>
          <h1>Stock Gudang</h1>
          <p>Manage and monitor your warehouse inventory.</p>
        </header>

        {/* Search bar */}
        <div className="search-container">
          <input type="text" placeholder="🔍 Cari barang..." />
        </div>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID BARANG</th>
                <th>NAMA BARANG</th>
                <th>TIPE BARANG</th>
                <th>JUMLAH STOCK</th>
                <th>TANGGAL MASUK</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {dataBarang.map((barang) => (
                <tr key={barang.id}>
                  <td>{barang.id}</td>
                  <td>{barang.nama}</td>
                  <td>
                    <span className={`badge ${barang.tipe.toLowerCase()}`}>
                      {barang.tipe}
                    </span>
                  </td>
                  <td>{barang.stock}</td>
                  <td>{barang.tanggal}</td>
                  <td className="aksi">
                    <button className="edit-btn">✏️</button>
                    <button className="view-btn">👁️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default GudangStockBarang;
