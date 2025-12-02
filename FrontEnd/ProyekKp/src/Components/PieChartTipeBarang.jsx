// src/Components/PieChartTipeBarang.jsx
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#AA66CC", "#FF4444"];

const PieChartTipeBarang = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadTipeBarang = async () => {
      try {
        const res = await axios.get("http://localhost:3000/barangmasuk");

        const barang = res.data.data || res.data;

        if (Array.isArray(barang)) {
          const group = {};

          barang.forEach((item) => {
            if (!group[item.tipeBarang]) {
              group[item.tipeBarang] = 0;
            }
            group[item.tipeBarang] += item.jumlahBarang; // FIX
          });

          const chartData = Object.keys(group).map((key) => ({
            name: key,
            value: group[key],
          }));

          setData(chartData);
        }
      } catch (err) {
        console.error("Gagal memuat data tipe barang:", err);
      }
    };

    loadTipeBarang();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={120}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartTipeBarang;
