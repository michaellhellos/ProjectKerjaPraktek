import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  const [dataProduk, setDataProduk] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [jumlah, setJumlah] = useState(1);

  // 🔹 STATE USER
  const [user, setUser] = useState({ nama: "Karyawan" });
  const [loadingUser, setLoadingUser] = useState(true);

  // 🔹 STATE SCAN BARCODE
  const [scanMode, setScanMode] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");

  // 🔥 AMBIL DATA PRODUK
  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const res = await axios.get("http://localhost:3000/barang");
        setDataProduk(res.data.data || []);
      } catch (err) {
        console.error("Gagal fetch barang:", err);
      }
    };
    fetchProduk();

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/getKaryawan");
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Gagal ambil user:", err);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  // 🔹 FILTER PRODUK
  const filteredProduk = dataProduk.filter((item) =>
    (item.namaBarang || "").toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 MODAL
  const openModal = (product) => {
    setSelectedProduct(product);
    setJumlah(1);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const tambahJumlah = () => {
    if (jumlah < selectedProduct.stockBarang) setJumlah(jumlah + 1);
  };

  const kurangJumlah = () => {
    if (jumlah > 1) setJumlah(jumlah - 1);
  };

  const handleTambahKeranjang = async () => {
    try {
      await axios.post("http://localhost:3000/add-to-cart", {
        productId: selectedProduct._id,
        jumlah: jumlah,
      });

      alert("Berhasil ditambahkan ke keranjang!");

      const res = await axios.get("http://localhost:3000/barang");
      setDataProduk(res.data.data || []);

      closeModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal tambah ke keranjang");
    }
  };

  // 🔹 SCAN BARCODE MULAI
  const startScan = () => {
    setScanMode(true);
    setBarcodeInput("");

    setTimeout(() => {
      const input = document.getElementById("barcodeInputField");
      if (input) input.focus();
    }, 200);
  };

  // 🔹 JIKA BARCODE SUDAH TERBACA (ENTER)
  const handleBarcodeEnter = (e) => {
    if (e.key === "Enter") {
      const kode = barcodeInput.trim();

      const produk = dataProduk.find(
        (p) => p.idBarang?.toString() === kode.toString()
      );

      if (!produk) {
        alert("Produk tidak ditemukan!");
        setScanMode(false);
        return;
      }

      // buka modal otomatis
      openModal(produk);

      setScanMode(false);
    }
  };

  return (
    <div className="home-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div
          className="profile"
          onClick={() => navigate("/Karyawan/updateprofile")}
          style={{ cursor: "pointer" }}
        >
          <h3>Toko</h3>
          <p>{loadingUser ? "Loading..." : user?.namaLengkap || "Karyawan"}</p>
        </div>

        <ul>
          <li className="active" onClick={() => navigate("/Karyawan/homepage")}>
            List Barang
          </li>
          <li onClick={() => navigate("/Karyawan/keranjang")}>Keranjang</li>
          <li onClick={() => navigate("/Karyawan/gudang")}>Stock Gudang</li>
        </ul>

        <button className="logout" onClick={() => navigate("/")}>
          Keluar
        </button>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* 🔵 BUTTON SCAN BARANG */}
        <button
          className="scan-btn"
          onClick={startScan}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          + Scan Barang
        </button>

        {/* 🔵 INPUT HIDDEN UNTUK SCANNER */}
        {scanMode && (
          <input
            id="barcodeInputField"
            type="text"
            autoFocus
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyDown={handleBarcodeEnter}
            style={{
              position: "absolute",
              opacity: 0,
              pointerEvents: "none",
            }}
          />
        )}

        {/* SEARCH */}
        <input
          type="text"
          className="search-input"
          placeholder="Cari di Toko..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* GRID PRODUK */}
        <div className="product-grid">
          {filteredProduk.map((item) => (
            <div className="card" key={item._id}>
              <h4>{item.idBarang}</h4>
              <h4>{item.namaBarang}</h4>
              <p>Harga: Rp {(item.hargaBarang || 0).toLocaleString()}</p>
              <p>Stock: {item.stockBarang}</p>

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

            <p className="nama-produk">{selectedProduct.namaBarang}</p>
            <p className="stok-info">
              Stok tersedia: {selectedProduct.stockBarang}
            </p>

            <div className="jumlah-control">
              <button onClick={kurangJumlah}>-</button>
              <span>{jumlah}</span>
              <button onClick={tambahJumlah}>+</button>
            </div>

            <p className="total-harga">
              Total Harga:
              <br />
              <strong>
                Rp{" "}
                {((selectedProduct.hargaBarang || 0) * jumlah).toLocaleString()}
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
