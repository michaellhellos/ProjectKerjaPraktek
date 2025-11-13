import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./warehouse.css";

const Warehouse = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const [barangMasuk, setBarangMasuk] = useState(0);
  const [barangKeluar, setBarangKeluar] = useState(0);
  const [totalBarang, setTotalBarang] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const masukRes = await axios.get("http://localhost:3000/barangmasuk");
      const keluarRes = await axios.get("http://localhost:3000/barangkeluar");
      const totalRes = await axios.get("http://localhost:3000/totalbarang");

      const masukData = masukRes.data.data;
      const keluarData = keluarRes.data.data;
      setTotalBarang(totalRes.data.totalBarang);

      // Hitung total
      const totalMasuk = masukData.reduce((sum, item) => sum + (item.jumlahBarang || 0), 0);
      const totalKeluar = keluarData.reduce((sum, item) => sum + (item.jumlahKeluar || 0), 0);
      setBarangMasuk(totalMasuk);
      setBarangKeluar(totalKeluar);

      // 🔹 Data chart per bulan
      const perBulan = {};
      masukData.forEach((item) => {
        const bulan = new Date(item.tanggalMasuk).toLocaleString("id-ID", { month: "short" });
        perBulan[bulan] = (perBulan[bulan] || 0) + item.jumlahBarang;
      });
      const barData = Object.entries(perBulan).map(([bulan, jumlah]) => ({
        bulan,
        jumlah,
      }));
      setChartData(barData);

      // 🔸 Data pie (tipe barang)
      const tipeCount = {};
      masukData.forEach((item) => {
        const tipe = item.tipeBarang || "Lainnya";
        tipeCount[tipe] = (tipeCount[tipe] || 0) + item.jumlahBarang;
      });
      const pieChartData = Object.entries(tipeCount).map(([tipe, value]) => ({
        name: tipe,
        value,
      }));
      setPieData(pieChartData);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    }
  };

  const handleMenuClick = (key) => {
    setActiveMenu(key);
    if (key === "dashboard") navigate("/WareHouse/warehouse");
    else if (key === "stock") navigate("/WareHouse/gudangstockbarang");
    else if (key === "tambahMasuk") navigate("/WareHouse/tambahbaranggudang");
    else if (key === "barangKeluar") navigate("/WareHouse/tambahbarangkeluar");
    else if (key === "retur") navigate("/WareHouse/returgudang");
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC", "#FF6666"];

  return (
    <div className="warehouse-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile">
          <div className="profile-icon">A</div>
          <h3>Acong</h3>
        </div>

        <nav className="nav-menu">
          <a onClick={() => handleMenuClick("dashboard")} className={activeMenu === "dashboard" ? "active" : ""}>
            📊 Dashboard
          </a>
          <a onClick={() => handleMenuClick("stock")} className={activeMenu === "stock" ? "active" : ""}>
            📦 Stock Gudang
          </a>
          <a onClick={() => handleMenuClick("tambahMasuk")} className={activeMenu === "tambahMasuk" ? "active" : ""}>
            ➕ Tambah Barang Masuk
          </a>
          <a onClick={() => handleMenuClick("barangKeluar")} className={activeMenu === "barangKeluar" ? "active" : ""}>
            📤 Barang Keluar
          </a>
          <a onClick={() => handleMenuClick("retur")} className={activeMenu === "retur" ? "active" : ""}>
            ↩️ Return Barang
          </a>
        </nav>

        <button className="logout-btn">🚪 Keluar</button>
      </aside>

      {/* Dashboard */}
      <main className="dashboard">
        <header>
          <h1>Dashboard Gudang</h1>
          <p>Welcome back, Acong! Berikut ringkasan gudangmu.</p>
        </header>

        {/* Cards */}
        <section className="cards">
          <div className="card clickable" onClick={() => navigate("/WareHouse/gudangstockbarang")}>
            <h4>Total Barang Masuk</h4>
            <h2>{barangMasuk}</h2>
          </div>
          <div className="card clickable" onClick={() => navigate("/WareHouse/tambahbarangkeluar")}>
            <h4>Total Barang Keluar</h4>
            <h2>{barangKeluar}</h2>
          </div>
          <div className="card">
            <h4>Total Barang</h4>
            <h2>{totalBarang}</h2>
          </div>
        </section>

        {/* Chart Section */}
        <section className="charts">
          <div className="chart-card">
            <h3>📈 Total Barang Masuk per Bulan</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bulan" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jumlah" fill="#0088FE" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>🍩 Persentase Tipe Barang</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Warehouse;
