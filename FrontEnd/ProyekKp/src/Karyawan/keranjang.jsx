import React, { useState } from "react";
import "./keranjang.css";

const Keranjang = () => {
  const [keranjang, setKeranjang] = useState([
    { id: 1, nama: "Koper Kabin Fiber 20 Inch", harga: 750000, jumlah: 1 },
  ]);

  const [showPopup, setShowPopup] = useState(false); // <-- TAMBAH INI

  const tambahJumlah = (id) => {
    setKeranjang(
      keranjang.map((item) =>
        item.id === id ? { ...item, jumlah: item.jumlah + 1 } : item
      )
    );
  };

  const kurangJumlah = (id) => {
    setKeranjang(
      keranjang.map((item) =>
        item.id === id && item.jumlah > 1
          ? { ...item, jumlah: item.jumlah - 1 }
          : item
      )
    );
  };

  const hapusItem = (id) => {
    setKeranjang(keranjang.filter((item) => item.id !== id));
  };

  const subtotal = keranjang.reduce(
    (total, item) => total + item.harga * item.jumlah,
    0
  );

  return (
    <div className="keranjang-container">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="profile">
          <h3>Toko</h3>
          <p>Karyawan</p>
        </div>
        <ul>
          <li onClick={() => navigate("/Karyawan/homepage")}>List Barang</li>
          <li className="active" onClick={() => navigate("/Karyawan/keranjang")}>Keranjang</li> 
          <li onClick={() => navigate("/Karyawan/gudang")}>Catat Stock Gudang</li> 
        </ul>
        <button className="logout">Keluar</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="keranjang-main">

        <div className="keranjang-card">
          <h3>Keranjang</h3>

          {keranjang.map((item) => (
            <div className="keranjang-item" key={item.id}>
              <div>
                <strong>{item.nama}</strong>
                <p>Rp {item.harga.toLocaleString()}</p>
              </div>

              <div className="jumlah-control">
                <button onClick={() => kurangJumlah(item.id)}>-</button>
                <span>{item.jumlah}</span>
                <button onClick={() => tambahJumlah(item.id)}>+</button>
              </div>

              <button className="hapus" onClick={() => hapusItem(item.id)}>
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="ringkasan">
          <h3>Ringkasan Pesanan</h3>
          <p>Subtotal</p>
          <h2>Rp {subtotal.toLocaleString()}</h2>
          <button className="btn-proses" onClick={() => setShowPopup(true)}>
            Proses
          </button>
        </div>

      </main>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Data Pelanggan</h3>

            <input type="text" placeholder="Nama Pelanggan" />
            <input type="text" placeholder="Alamat Pelanggan" />

            <div className="row-input">
              <input type="text" placeholder="Nomor Telp" />
              <input type="text" placeholder="Kota" />
            </div>

            <div className="row-input">
              <input type="text" placeholder="Kode Pos" />
              <input type="text" placeholder="Negara" />
            </div>

            <div className="row-button">
              <button className="cancel" onClick={() => setShowPopup(false)}>
                Batal
              </button>
              <button className="next">
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Keranjang;
