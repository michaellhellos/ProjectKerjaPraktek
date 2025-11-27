import React, { useState, useEffect } from "react";
import "./sistem.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChartPenjualan from "../Components/ChartPenjualan";
const Sistem = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const navigate = useNavigate();

  const [totalPenjualan, setTotalPenjualan] = useState(0);
  const [totalBarangKeluar, setTotalBarangKeluar] = useState(0);

  // DATA TRANSAKSI
  const [transaksi, setTransaksi] = useState([]);

  // DATA BARANG KELUAR
  const [barangKeluar, setBarangKeluar] = useState([]);

  // POPUP TRANSAKSI
  const [showPopup, setShowPopup] = useState(false);

  // POPUP BARANG KELUAR
  const [showPopupBarangKeluar, setShowPopupBarangKeluar] = useState(false);
const [totalBarang, setTotalBarang] = useState(0);

useEffect(() => {
  const fetchBarang = async () => {
    try {
      const res = await axios.get("http://localhost:3000/barang");
      if (res.data.success) {
        const listBarang = res.data.data;

        const totalStock = listBarang.reduce(
          (acc, item) => acc + (item.stockBarang || 0),
          0
        );

        setTotalBarang(totalStock);
      }
    } catch (err) {
      console.error("Gagal ambil data barang:", err);
    }
  };

  fetchBarang();
}, []);


  // GET TRANSAKSI
  useEffect(() => {
    const fetchTransaksi = async () => {
      try {
        const res = await axios.get("http://localhost:3000/checkout");
        if (res.data.success && res.data.data) {
          const transaksiList = res.data.data;
          setTransaksi(transaksiList);

          // Hitung total penjualan
          const total = transaksiList.reduce(
            (acc, transaksi) => acc + transaksi.subtotal,
            0
          );
          setTotalPenjualan(total);

          // Hitung total barang keluar dari transaksi
          const totalBarang = transaksiList.reduce(
            (acc, transaksi) =>
              acc +
              (transaksi.items
                ? transaksi.items.reduce((sum, item) => sum + item.jumlah, 0)
                : 0),
            0
          );
          setTotalBarangKeluar(totalBarang);
        }
      } catch (err) {
        console.error("Gagal ambil transaksi:", err);
      }
    };

    fetchTransaksi();
  }, []);

  // GET BARANG KELUAR
  useEffect(() => {
    const fetchBarangKeluar = async () => {
      try {
        const res = await axios.get("http://localhost:3000/barangkeluar");
        if (res.data.success) {
          setBarangKeluar(res.data.data);
        }
      } catch (err) {
        console.error("Gagal ambil data barang keluar:", err);
      }
    };

    fetchBarangKeluar();
  }, []);

  // FILTER PENJUALAN HARI INI
  const transaksiHariIni = transaksi.filter((t) => {
    const today = new Date();
    const tanggal = new Date(t.createdAt);

    return (
      tanggal.getDate() === today.getDate() &&
      tanggal.getMonth() === today.getMonth() &&
      tanggal.getFullYear() === today.getFullYear()
    );
  });

  // PRINT NOTA
  const handlePrintNota = (data) => {
    const notaWindow = window.open("", "_blank");

    let html = `
      <html>
      <head>
      <title>Nota Transaksi</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
        .total { font-weight: bold; }
      </style>
      </head>
      <body>
        <h2>Nota Pembelian</h2>
        <p><strong>ID Transaksi:</strong> ${data._id}</p>
        <p><strong>Pelanggan:</strong> ${data.pelanggan?.nama || "-"}</p>

        <table>
          <tr>
            <th>Produk</th>
            <th>Harga</th>
            <th>Jumlah</th>
            <th>Subtotal</th>
          </tr>
    `;

    data.items.forEach((item) => {
      html += `
        <tr>
          <td>${item.productId?.namaBarang || "-"}</td>
          <td>Rp ${item.harga.toLocaleString()}</td>
          <td>${item.jumlah}</td>
          <td>Rp ${(item.harga * item.jumlah).toLocaleString()}</td>
        </tr>
      `;
    });

    html += `
      <tr class="total">
        <td colspan="3">TOTAL</td>
        <td>Rp ${data.subtotal.toLocaleString()}</td>
      </tr>
      </table>

      <script>
      window.print();
      </script>
      </body>
      </html>
    `;

    notaWindow.document.write(html);
    notaWindow.document.close();
  };

  // NAVIGASI SIDEBAR
  const handleMenuClick = (key) => {
    setActiveMenu(key);
    if (key === "karyawan") navigate("/Sistem/managekariawan");
    else if (key === "stock") navigate("/Sistem/stockgudang");
    else if (key === "barang") navigate("/Sistem/daftarBarang");
    else if (key === "retur") navigate("/Sistem/retur");
    else if (key === "dashboard") navigate("/Sistem/sistem");
    else if (key === "EditProfile") navigate("/Sistem/editprofile");
  };

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="profile-section" onClick={() => handleMenuClick("EditProfile")}>
          <img src="/images/profile.png" alt="Profile" className="profile-image" />
          <div>
            <h2 className="sidebar-title">Admin</h2>
            <p className="sidebar-role">Warehouse Manager</p>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li className={activeMenu === "dashboard" ? "active" : ""} onClick={() => handleMenuClick("dashboard")}>Dashboard</li>
          <li className={activeMenu === "karyawan" ? "active" : ""} onClick={() => handleMenuClick("karyawan")}>Manage Karyawan</li>
          <li className={activeMenu === "stock" ? "active" : ""} onClick={() => handleMenuClick("stock")}>Stock Gudang</li>
          <li className={activeMenu === "barang" ? "active" : ""} onClick={() => handleMenuClick("barang")}>Daftar Barang</li>
          <li className={activeMenu === "retur" ? "active" : ""} onClick={() => handleMenuClick("retur")}>Daftar Retur</li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <h1 className="dashboard-title">Dashboard</h1>

        <div className="top-cards">

          {/* CARD PENJUALAN */}
          <div className="card" onClick={() => setShowPopup(true)}>
            <p>Penjualan Hari Ini</p>
            <h2>Rp {totalPenjualan.toLocaleString()}</h2>
          </div>

          {/* CARD BARANG KELUAR → BUKA POPUP */}
          <div className="card" onClick={() => setShowPopupBarangKeluar(true)}>
            <p>Total Barang Keluar Dari Gudang</p>
            <h2>{totalBarangKeluar.toLocaleString()}</h2>
          </div>

         <div className="card">
            <p>Total Barang</p>
            <h2>{totalBarang.toLocaleString()}</h2>
          </div>

        </div>

        {/* POPUP TRANSAKSI */}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>Penjualan Hari Ini</h2>

              <table className="popup-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>ID Transaksi</th>
                    <th>Pelanggan</th>
                    <th>Total</th>
                    <th>Print Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {transaksiHariIni.map((t, index) => (
                    <tr key={t._id}>
                      <td>{index + 1}</td>
                      <td>{t._id}</td>
                      <td>{t.pelanggan?.nama || "-"}</td>
                      <td>Rp {t.subtotal.toLocaleString()}</td>
                      <td>
                        <button className="print-btn" onClick={() => handlePrintNota(t)}>Print</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button className="close-btn" onClick={() => setShowPopup(false)}>Tutup</button>
            </div>
          </div>
        )}

        {/* POPUP BARANG KELUAR */}
        {showPopupBarangKeluar && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>Data Barang Keluar Dari Gudang</h2>

              <table className="popup-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>ID Barang</th>
                    <th>Nama Barang</th>
                    <th>Jumlah</th>
                    <th>Tanggal</th>
                    <th>Karyawan</th>
                  </tr>
                </thead>
                <tbody>
                  {barangKeluar.map((b, index) => (
                    <tr key={b._id}>
                      <td>{index + 1}</td>
                      <td>{b.idBarang}</td>
                      <td>{b.namaBarang}</td>
                      <td>{b.jumlahKeluar}</td>
                      <td>{new Date(b.tanggalKeluar).toLocaleDateString()}</td>
                      <td>{b.karyawan}</td>
                     
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="close-btn" onClick={() => setShowPopupBarangKeluar(false)}>
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* GRAFIK */}
        <div className="charts-section">
          <div className="chart-card">
            <h3>Penjualan Bulanan</h3>

            {/* MASUKKAN GRAFIK */}
            <ChartPenjualan />
          </div>

          <div className="chart-card">
            <h3>Stock Tiap Barang</h3>
            <div className="chart-placeholder">[ Grafik Pie ]</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sistem;
