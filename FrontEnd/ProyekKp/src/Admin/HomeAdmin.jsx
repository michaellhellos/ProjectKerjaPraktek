import { useState } from "react";
import {
  FaBox,
  FaUsers,
  FaChartLine,
  FaSignOutAlt,
  FaWarehouse,
  FaUserCircle,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

function HomeAdmin() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col shadow-2xl">
        <div className="p-6 text-2xl font-bold border-b border-blue-600 text-center tracking-wide">
          🏬 TokoKu Admin
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {[
              { key: "dashboard", label: "Dashboard", icon: <FaChartLine /> },
              { key: "produk", label: "Produk", icon: <FaBox /> },
              { key: "karyawan", label: "Karyawan", icon: <FaUsers /> },
              { key: "gudang", label: "Gudang", icon: <FaWarehouse /> },
            ].map((item) => (
              <li
                key={item.key}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeMenu === item.key
                    ? "bg-blue-600 shadow-lg scale-105"
                    : "hover:bg-blue-800 hover:scale-105"
                }`}
                onClick={() => setActiveMenu(item.key)}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-blue-600">
          <button className="flex items-center gap-2 w-full justify-center py-2 rounded-lg bg-red-500 hover:bg-red-600 transition font-semibold shadow">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <FaUserCircle className="text-3xl text-blue-700" />
            <div>
              <h1 className="text-xl font-bold text-gray-700">Welcome, Admin 👋</h1>
              <p className="text-sm text-gray-500">Hari ini: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-semibold">Status: </span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">Online</span>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeMenu === "dashboard" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="p-6 bg-white rounded-2xl shadow-xl flex flex-col gap-2 border-l-4 border-blue-500">
                  <div className="flex items-center gap-2">
                    <FaBox className="text-blue-500 text-2xl" />
                    <h3 className="text-lg font-semibold text-gray-600">Total Produk</h3>
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-bold text-blue-600 mt-3">120</p>
                    <span className="flex items-center text-green-600 font-semibold text-sm">
                      <FaArrowUp /> 5%
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">Dibanding minggu lalu</span>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-xl flex flex-col gap-2 border-l-4 border-green-500">
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-green-500 text-2xl" />
                    <h3 className="text-lg font-semibold text-gray-600">Karyawan Aktif</h3>
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-bold text-green-600 mt-3">15</p>
                    <span className="flex items-center text-red-500 font-semibold text-sm">
                      <FaArrowDown /> 1%
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">Dibanding minggu lalu</span>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-xl flex flex-col gap-2 border-l-4 border-purple-500">
                  <div className="flex items-center gap-2">
                    <FaChartLine className="text-purple-500 text-2xl" />
                    <h3 className="text-lg font-semibold text-gray-600">Total Penjualan</h3>
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-bold text-purple-600 mt-3">Rp 25.000.000</p>
                    <span className="flex items-center text-green-600 font-semibold text-sm">
                      <FaArrowUp /> 10%
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">Dibanding minggu lalu</span>
                </div>
              </div>
              {/* Dummy Chart */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-700">Grafik Penjualan Mingguan</h4>
                <div className="w-full h-40 bg-gradient-to-r from-blue-200 to-blue-400 rounded-xl flex items-end gap-2 px-4 py-2">
                  {/* Dummy bar chart */}
                  {[30, 50, 40, 70, 60, 90, 80].map((val, idx) => (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-6 rounded-t-lg bg-blue-600"
                        style={{ height: `${val}%` }}
                      ></div>
                      <span className="text-xs mt-1 text-gray-500">
                        {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ...existing code for produk, karyawan, gudang... */}
          {activeMenu === "produk" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">📦 Manajemen Produk</h2>
              <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
                + Tambah Produk
              </button>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-blue-100 text-blue-800">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Nama Produk</th>
                      <th className="p-3">Harga</th>
                      <th className="p-3">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="p-3">P001</td>
                      <td className="p-3">Tas Ransel</td>
                      <td className="p-3">Rp 250.000</td>
                      <td className="p-3">50</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeMenu === "karyawan" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">👥 Manajemen Karyawan</h2>
              <button className="mb-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">
                + Registrasi Karyawan
              </button>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-green-100 text-green-800">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Nama</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="p-3">K001</td>
                      <td className="p-3">Budi</td>
                      <td className="p-3">budi@example.com</td>
                      <td className="p-3 text-green-600 font-semibold">Aktif</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeMenu === "gudang" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">🏭 Stok Gudang</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold">Barang Masuk</h3>
                  <p className="text-gray-500 mt-2">Data barang masuk ke gudang...</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold">Barang Keluar</h3>
                  <p className="text-gray-500 mt-2">Data barang keluar dari gudang...</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default HomeAdmin;