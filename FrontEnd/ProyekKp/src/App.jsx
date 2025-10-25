import { Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import HomeAdmin from "./Admin/homeKaryawanPage";
import Warehouse from "./WareHouse/warehouse";
import Sistem from "./Sistem/sistem";
import Managekariawan from "./Sistem/managekariawan";
import TambahKaryawan from "./Sistem/tambahkaryawan";
import StockGudang from "./Sistem/stockgudang";
import DaftarBarang from "./Sistem/daftarbarang";
import TambahBarang from "./Sistem/tambahbarang";
import Retur from "./Sistem/retur";
//kepala gudang
import GudangStockBarang from "./WareHouse/gudangstockbarang";
import TambahBarangGudang from "./WareHouse/tambahbaranggudang";
import TambahBarangKeluar from "./WareHouse/tambahbarangkeluar"; 
import ReturGudang from "./WareHouse/returgudang";
//karyawan
import HomePage from "./Karyawan/homePage";
import Keranjang from "./Karyawan/keranjang";
import Gudang from "./Karyawan/gudang";

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
      {/* //kepala gudang */}
      <Route path="/WareHouse/gudangstockbarang" element={<GudangStockBarang />} />
      <Route path="/WareHouse/tambahbaranggudang" element={<TambahBarangGudang />} />
      <Route path="/WareHouse/tambahbarangkeluar" element={<TambahBarangKeluar />} />
      <Route path="/WareHouse/returgudang" element={<ReturGudang />} />
      {/* karyawan */}
      <Route path="/Karyawan/homepage" element={<HomePage />} />
      <Route path="/Karyawan/keranjang" element={<Keranjang />} />
      <Route path="/Karyawan/gudang" element={<Gudang />} />
    </Routes>
  );
}

export default App;
