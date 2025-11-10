import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";

// Login
import Login from "./Login/Login";

// Admin
import HomeAdmin from "./Admin/homeKaryawanPage";
import Sistem from "./Sistem/sistem";
import Managekariawan from "./Sistem/managekariawan";
import TambahKaryawan from "./Sistem/tambahkaryawan";
import StockGudang from "./Sistem/stockgudang";
import DaftarBarang from "./Sistem/daftarbarang";
import TambahBarang from "./Sistem/tambahbarang";
import Retur from "./Sistem/retur";
import EditProfile from "./Sistem/editprofile";

// Kepala Gudang
import Warehouse from "./WareHouse/warehouse";
import GudangStockBarang from "./WareHouse/gudangstockbarang";
import TambahBarangGudang from "./WareHouse/tambahbaranggudang";
import TambahBarangKeluar from "./WareHouse/tambahbarangkeluar";
import ReturGudang from "./WareHouse/returgudang";

// Karyawan
import HomePage from "./Karyawan/homePage";
import Keranjang from "./Karyawan/keranjang";
import Gudang from "./Karyawan/gudang";

function App() {
  return (
    <Routes>
      {/* LOGIN bebas akses */}
      <Route path="/" element={<Login />} />

      {/* ✅ ADMIN ONLY */}
      <Route
        path="/Admin/HomeAdmin"
        element={
          <ProtectedRoute allow={["admin"]}>
            <HomeAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Sistem/sistem"
        element={
          <ProtectedRoute allow={["admin"]}>
            <Sistem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Sistem/managekariawan"
        element={
          <ProtectedRoute allow={["admin"]}>
            <Managekariawan />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Sistem/tambahkaryawan"
        element={
          <ProtectedRoute allow={["admin"]}>
            <TambahKaryawan />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Sistem/stockgudang"
        element={
          <ProtectedRoute allow={["admin"]}>
            <StockGudang />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Sistem/daftarBarang"
        element={
          <ProtectedRoute allow={["admin"]}>
            <DaftarBarang />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Sistem/tambahbarang"
        element={
          <ProtectedRoute allow={["admin"]}>
            <TambahBarang />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Sistem/retur"
        element={
          <ProtectedRoute allow={["admin"]}>
            <Retur />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Sistem/editprofile"
        element={
          <ProtectedRoute allow={["admin"]}>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      

      {/* ✅ KEPALA GUDANG ONLY */}
       <Route
        path="/WareHouse/warehouse"
        element={
          <ProtectedRoute allow={["kepala_gudang"]}>
            {/* Gunakan nama komponen yang benar */}
            <Warehouse /> 
          </ProtectedRoute>
        }
      />
      <Route
        path="/WareHouse/gudangstockbarang"
        element={
          <ProtectedRoute allow={["kepala_gudang"]}>
            <GudangStockBarang />
          </ProtectedRoute>
        }
      />
      <Route
        path="/WareHouse/tambahbaranggudang"
        element={
          <ProtectedRoute allow={["kepala_gudang"]}>
            <TambahBarangGudang />
          </ProtectedRoute>
        }
      />
      <Route
        path="/WareHouse/tambahbarangkeluar"
        element={
          <ProtectedRoute allow={["kepala_gudang"]}>
            <TambahBarangKeluar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/WareHouse/returgudang"
        element={
          <ProtectedRoute allow={["kepala_gudang"]}>
            <ReturGudang />
          </ProtectedRoute>
        }
      />

      {/* ✅ KARYAWAN ONLY */}
      <Route
        path="/Karyawan/homepage"
        element={
          <ProtectedRoute allow={["karyawan"]}>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Karyawan/keranjang"
        element={
          <ProtectedRoute allow={["karyawan"]}>
            <Keranjang />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Karyawan/gudang"
        element={
          <ProtectedRoute allow={["karyawan"]}>
            <Gudang />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
