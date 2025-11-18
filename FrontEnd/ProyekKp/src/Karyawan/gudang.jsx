import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./gudang.css";

const Gudang = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dataGudang, setDataGudang] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil data dari backend saat component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/barangmasuk");
        if (response.data.success) {
          // Tambahkan default value untuk nama supaya aman
          const dataWithDefaultNama = response.data.data.map((item) => ({
            ...item,
            nama: item.nama || "Barang Tanpa Nama",
          }));
          setDataGudang(dataWithDefaultNama);
        } else {
          console.error(response.data.message);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Filter data, pastikan item.nama ada
  const filteredData = dataGudang.filter(
    (item) => item.nama && item.nama.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading data...</p>;

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
            <div className="card-gudang" key={item._id || item.id}>
              {/* <div className="img-placeholder-gudang">Gambar</div> */}
              <h4>{item.idBarang}</h4>
              <h4>{item.namaBarang}</h4>
              {/* <p>Rp {item.harga?.toLocaleString() || "0"}</p> */}

              <div
                className={`stock-circle ${
                  item.jumlahBarang <= 10
                    ? "red"
                    : item.jumlahBarang <= 20
                    ? "yellow"
                    : "green"
                }`}
              >
                {item.jumlahBarang ?? 0}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Gudang;
