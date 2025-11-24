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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC", "#FF6666"];

const Warehouse = () => {
  const navigate = useNavigate();
  const [barangMasuk, setBarangMasuk] = useState(0);
  const [barangKeluar, setBarangKeluar] = useState(0);
  const [totalBarang, setTotalBarang] = useState(0);

  const [chartMasuk, setChartMasuk] = useState([]);
  const [chartKeluar, setChartKeluar] = useState([]);

  const [pieMasuk, setPieMasuk] = useState([]);
  const [tipeTotal, setTipeTotal] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const masukRes = await axios.get("http://localhost:3000/barangmasuk");
      const keluarRes = await axios.get("http://localhost:3000/barangkeluar");
      const totalRes = await axios.get("http://localhost:3000/totalbarang");

      const masukData = masukRes.data.data || [];
      const keluarData = keluarRes.data.data || [];

      setTotalBarang(totalRes.data.totalBarang || 0);

      // TOTAL MASUK
      const totalMasuk = masukData.reduce(
        (sum, i) => sum + (i.jumlahBarang || i.jumlahMasuk || 0),
        0
      );
      setBarangMasuk(totalMasuk);

      // TOTAL KELUAR
      const totalKeluar = keluarData.reduce(
        (sum, i) => sum + (i.jumlahKeluar || i.jumlah || 0),
        0
      );
      setBarangKeluar(totalKeluar);

      // PIE MASUK
      const masukTipe = {};
      masukData.forEach((i) => {
        const tipe = i.tipeBarang || i.namaBarang || "Lainnya";
        const jumlah = i.jumlahBarang || i.jumlahMasuk || 0;
        masukTipe[tipe] = (masukTipe[tipe] || 0) + jumlah;
      });
      setPieMasuk(Object.entries(masukTipe).map(([name, value]) => ({ name, value })));

      // BAR MASUK PER BULAN
      const masukPerBulan = {};
      masukData.forEach((i) => {
        if (!i.tanggalMasuk) return;
        const bulan = new Date(i.tanggalMasuk).toLocaleString("id-ID", { month: "short" });
        masukPerBulan[bulan] = (masukPerBulan[bulan] || 0) + (i.jumlahBarang || 0);
      });
      setChartMasuk(Object.entries(masukPerBulan).map(([bulan, jumlah]) => ({ bulan, jumlah })));

      // BAR KELUAR PER BULAN
      const keluarPerBulan = {};
      keluarData.forEach((i) => {
        if (!i.tanggalKeluar) return;
        const bulan = new Date(i.tanggalKeluar).toLocaleString("id-ID", { month: "short" });
        keluarPerBulan[bulan] = (keluarPerBulan[bulan] || 0) + (i.jumlahKeluar || 0);
      });
      setChartKeluar(Object.entries(keluarPerBulan).map(([bulan, jumlah]) => ({ bulan, jumlah })));

      // TOTAL TIPE BARANG
      const tipeCount = {};
      masukData.forEach((i) => {
        const tipe = i.tipeBarang || i.namaBarang || "Lainnya";
        const jumlah = i.jumlahBarang || i.jumlahMasuk || 0;
        tipeCount[tipe] = (tipeCount[tipe] || 0) + jumlah;
      });
      setTipeTotal(Object.entries(tipeCount).map(([name, value]) => ({ name, value })));

    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div className="warehouse-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="profile">
          <div className="profile-icon">A</div>
          <h3>Acong</h3>
        </div>

        <nav className="nav-menu">
          <a className="active">📊 Dashboard</a>
          <a href="/WareHouse/gudangstockbarang">📦 Stock Gudang</a>
          <a href="/WareHouse/tambahbaranggudang">➕ Tambah Barang Masuk</a>
          <a href="/WareHouse/tambahbarangkeluar">📤 Barang Keluar</a>
          <a href="/WareHouse/returgudang">↩️ Return Barang</a>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn">Keluar</button>
        </div>
      </aside>

      {/* MAIN PAGE */}
      <main className="dashboard">
        <header className="dashboard-header">
          <h1>Dashboard Gudang</h1>
          <p>Welcome back! Berikut ringkasan gudangmu.</p>
        </header>

        {/* CARDS */}
        <section className="cards">
          <div className="card clickable">
            <h4>Total Barang Masuk</h4>
            <h2>{barangMasuk}</h2>
          </div>

          <div className="card clickable">
            <h4>Total Barang Keluar</h4>
            <h2>{barangKeluar}</h2>
          </div>

          <div className="card">
            <h4>Total Barang</h4>
            <h2>{totalBarang}</h2>

            <div className="tipe-list">
              {tipeTotal.map((t, i) => (
                <div key={i} className="tipe-row">
                  <span>• {t.name}</span>
                  <span>{t.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BAR CHART MASUK */}
        <section className="chart-card">
          <h3>📈 Total Barang Masuk per Bulan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartMasuk}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jumlah" fill="#0088FE" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* BAR CHART KELUAR */}
        <section className="chart-card">
          <h3>📤 Total Barang Keluar per Bulan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartKeluar}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jumlah" fill="#FF8042" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* PIE CHART MASUK (ONLY ONE LEFT) */}
        <section className="charts">
          <div className="chart-card single">
            <h3>📥 Persentase Barang Masuk</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieMasuk} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {pieMasuk.map((e, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
