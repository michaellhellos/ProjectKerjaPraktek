import { Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import HomeAdmin from "./Admin/HomeAdmin";
import Warehouse from "./WareHouse/warehouse";
import Sistem from "./Sistem/sistem";
import Managekariawan from "./Sistem/managekariawan";
import TambahKaryawan from "./Sistem/tambahkaryawan";
import StockGudang from "./Sistem/stockgudang";
import DaftarBarang from "./Sistem/daftarbarang";
import TambahBarang from "./Sistem/tambahbarang";
import Retur from "./Sistem/retur";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Admin/HomeAdmin" element={<HomeAdmin />} />
      <Route path="/WareHouse/warehouse" element={<Warehouse />} />
      <Route path="/Sistem/sistem" element={<Sistem />} />
      <Route path="/Sistem/managekariawan" element={<Managekariawan />} />
      <Route path="/Sistem/tambahkaryawan" element={<TambahKaryawan />} />
      <Route path="/Sistem/stockgudang" element={<StockGudang />} />
      <Route path="/Sistem/daftarBarang" element={<DaftarBarang />} />
      <Route path="/Sistem/tambahbarang" element={<TambahBarang />} />
      <Route path="/Sistem/retur" element={<Retur />} />
    </Routes>
  );
}

export default App;
