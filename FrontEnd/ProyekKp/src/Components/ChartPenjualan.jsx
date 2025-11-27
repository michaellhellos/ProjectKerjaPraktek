import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ChartPenjualan = () => {
  const [dataBulan, setDataBulan] = useState([]);

  useEffect(() => {
    const fetchTransaksi = async () => {
      try {
        const res = await axios.get("http://localhost:3000/checkout");

        if (!res.data.success) return;

        const transaksi = res.data.data;

        const monthlyData = {};

        transaksi.forEach((trx) => {
          const tanggal = new Date(trx.createdAt);
          const bulan = tanggal.getMonth();
          const namaBulan = [
            "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
            "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
          ][bulan];

          if (!monthlyData[namaBulan]) {
            monthlyData[namaBulan] = 0;
          }

          monthlyData[namaBulan] += trx.subtotal;
        });

        const formatted = Object.entries(monthlyData).map(([bulan, total]) => ({
          bulan,
          total,
        }));

        setDataBulan(formatted);
      } catch (err) {
        console.log("Error:", err);
      }
    };

    fetchTransaksi();
  }, []);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={dataBulan}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bulan" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#4a90e2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartPenjualan;
