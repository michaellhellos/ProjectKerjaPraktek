import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import axios from "axios";

const ChartBarangMasuk = () => {
  const [data, setData] = useState([]);

 useEffect(() => {
  const fetchBarangMasuk = async () => {
    try {
      const res = await axios.get("http://localhost:3000/barangmasuk");

      console.log("HASIL BACKEND:", res.data);   // ← PENTING

      const formatted = res.data.data.map((item) => ({
        tanggal: new Date(item.tanggalMasuk).toLocaleDateString("id-ID"),
        namaBarang: item.namaBarang,
        jumlah: item.jumlahBarang
      }));

      console.log("HASIL FORMAT:", formatted);   // ← PENTING

      setData(formatted);
    } catch (err) {
      console.error("Gagal memuat data barang masuk:", err);
    }
  };

  fetchBarangMasuk();
}, []);


  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 30, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="tanggal" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Bar dataKey="jumlah" fill="#8884d8" name="Jumlah Masuk" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartBarangMasuk;
