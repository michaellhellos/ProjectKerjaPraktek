import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./keranjang.css";

const Keranjang = () => {
  const navigate = useNavigate();

  const [keranjang, setKeranjang] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  // 🔥 STATE DATA PELANGGAN
  const [pelanggan, setPelanggan] = useState({
    nama: "",
    alamat: "",
    telp: "",
    kota: "",
    kodePos: "",
    negara: "",
  });

  // 🔥 AMBIL DATA KERANJANG
  useEffect(() => {
    const fetchKeranjang = async () => {
      try {
        const res = await axios.get("http://localhost:3000/keranjang");
        setKeranjang(res.data.data || []);
      } catch (err) {
        console.error("Gagal fetch keranjang:", err);
      }
    };
    fetchKeranjang();
  }, []);

  // 🔥 TAMBAH JUMLAH
  const tambahJumlah = async (id) => {
    try {
      await axios.put(`http://localhost:3000/keranjang/tambah/${id}`);
      setKeranjang(
        keranjang.map((item) =>
          item._id === id ? { ...item, jumlah: item.jumlah + 1 } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 KURANG JUMLAH
  const kurangJumlah = async (id, jumlahSekarang) => {
    if (jumlahSekarang <= 1) return;

    try {
      await axios.put(`http://localhost:3000/keranjang/kurang/${id}`);
      setKeranjang(
        keranjang.map((item) =>
          item._id === id ? { ...item, jumlah: item.jumlah - 1 } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 HAPUS ITEM
  const hapusItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/keranjang/${id}`);
      setKeranjang(keranjang.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 TOTAL
  const subtotal = keranjang.reduce(
    (total, item) => total + item.productId.hargaBarang * item.jumlah,
    0
  );

  // ==========================================================
  //      🔥 PROSES CHECKOUT: SIMPAN PELANGGAN + TRANSAKSI
  // ==========================================================
  const handleCheckout = async (paymentMethod) => {
    try {
      // 1️⃣ SIMPAN DATA PELANGGAN
      const pelangganRes = await axios.post("http://localhost:3000/pelanggan", {
        nama: pelanggan.nama,
        alamat: pelanggan.alamat,
        telp: pelanggan.telp,
        kota: pelanggan.kota,
        kodePos: pelanggan.kodePos,
        negara: pelanggan.negara,
      });

      const pelangganId = pelangganRes.data.data._id;

      // 2️⃣ PROSES TRANSAKSI CHECKOUT
      await axios.post("http://localhost:3000/checkout", {
        pelangganId,
        paymentMethod,
      });

      alert(`Transaksi berhasil! Pembayaran: ${paymentMethod.toUpperCase()}`);

      // Reset
      setShowPaymentPopup(false);
      setPelanggan({
        nama: "",
        alamat: "",
        telp: "",
        kota: "",
        kodePos: "",
        negara: "",
      });

    } catch (err) {
      console.error("Error checkout:", err);
      alert("Gagal memproses checkout!");
    }
  };

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
          <li className="active" onClick={() => navigate("/Karyawan/keranjang")}>
            Keranjang
          </li>
          <li onClick={() => navigate("/Karyawan/gudang")}>
            Stock Gudang
          </li>
        </ul>

        <button className="logout"onClick={() => navigate("/")}>Keluar</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="keranjang-main">

        <div className="keranjang-card">
          <h3>Keranjang</h3>

          {keranjang.map((item) => (
            <div className="keranjang-item" key={item._id}>
              <div>
                <strong>{item.productId.namaBarang}</strong>
                <p>Rp {item.productId.hargaBarang.toLocaleString()}</p>
              </div>

              <div className="jumlah-control">
                <button onClick={() => kurangJumlah(item._id, item.jumlah)}>
                  -
                </button>
                <span>{item.jumlah}</span>
                <button onClick={() => tambahJumlah(item._id)}>+</button>
              </div>

              <button className="hapus" onClick={() => hapusItem(item._id)}>
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

      {/* ============================== */}
      {/*       POPUP DATA PELANGGAN     */}
      {/* ============================== */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Data Pelanggan</h3>

            <input
              type="text"
              placeholder="Nama Pelanggan"
              value={pelanggan.nama}
              onChange={(e) => setPelanggan({ ...pelanggan, nama: e.target.value })}
            />

            <input
              type="text"
              placeholder="Alamat Pelanggan"
              value={pelanggan.alamat}
              onChange={(e) => setPelanggan({ ...pelanggan, alamat: e.target.value })}
            />

            <div className="row-input">
              <input
                type="text"
                placeholder="Nomor Telp"
                value={pelanggan.telp}
                onChange={(e) => setPelanggan({ ...pelanggan, telp: e.target.value })}
              />

              <input
                type="text"
                placeholder="Kota"
                value={pelanggan.kota}
                onChange={(e) => setPelanggan({ ...pelanggan, kota: e.target.value })}
              />
            </div>

            <div className="row-input">
              <input
                type="text"
                placeholder="Kode Pos"
                value={pelanggan.kodePos}
                onChange={(e) => setPelanggan({ ...pelanggan, kodePos: e.target.value })}
              />

              <input
                type="text"
                placeholder="Negara"
                value={pelanggan.negara}
                onChange={(e) => setPelanggan({ ...pelanggan, negara: e.target.value })}
              />
            </div>

            <div className="row-button">
              <button className="cancel" onClick={() => setShowPopup(false)}>
                Batal
              </button>

              <button
                className="next"
                onClick={() => {
                  setShowPopup(false);
                  setShowPaymentPopup(true);
                }}
              >
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================== */}
      {/*    POPUP PILIH PEMBAYARAN      */}
      {/* ============================== */}
      {showPaymentPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Pilih Metode Pembayaran</h3>

            <button className="next" onClick={() => handleCheckout("cash")}>
              Cash
            </button>

            <button className="next" onClick={() => handleCheckout("qris")}>
              QRIS
            </button>

            <button className="cancel" onClick={() => setShowPaymentPopup(false)}>
              Batal
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Keranjang;
