import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./managekariawan.css";

function ManageKariawan() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("karyawan");
  const [dataKaryawan, setDataKaryawan] = useState([]);

  // === GET DATA KARYAWAN ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/getKaryawan");
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setDataKaryawan(data.data);
        } else {
          console.error("Data dari backend bukan array:", data);
          setDataKaryawan([]); // Cegah error
        }
      } catch (err) {
        console.error("❌ Error:", err);
        alert("Tidak dapat terhubung ke server.");
      }
    };

    fetchData();
  }, []);

  // === HANDLE MENU CLICK ===
  const handleMenuClick = (key) => {
    setActiveMenu(key);
    if (key === "karyawan") navigate("/Sistem/managekariawan");
    else if (key === "stock") navigate("/Sistem/stockgudang");
    else if (key === "barang") navigate("/Sistem/daftarBarang");
    else if (key === "retur") navigate("/Sistem/retur");
    else if (key === "dashboard") navigate("/Sistem/sistem");
  };

  // === TAMBAH KARYAWAN ===
  const handleTambahKaryawan = () => {
    navigate("/Sistem/tambahkaryawan");
  };

  // === UPDATE STATUS ===
  const handleUpdateStatus = async (id, statusBaru) => {
    try {
      const res = await fetch(`http://localhost:3000/updateStatus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusBaru }),
      });

      const data = await res.json();

      if (data.success) {
        setDataKaryawan((prev) =>
          prev.map((k) =>
            k._id === id ? { ...k, status: statusBaru } : k
          )
        );
      } else {
        alert("Gagal update status!");
      }
    } catch (err) {
      alert("Gagal terhubung ke server!");
      console.error(err);
    }
  };

  return (
    <div className="manage-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin</h2>
        <p className="sidebar-role">Warehouse Manager</p>
        <ul className="sidebar-menu">
          <li
            className={activeMenu === "dashboard" ? "active" : ""}
            onClick={() => handleMenuClick("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={activeMenu === "karyawan" ? "active" : ""}
            onClick={() => handleMenuClick("karyawan")}
          >
            Manage Karyawan
          </li>
          <li
            className={activeMenu === "stock" ? "active" : ""}
            onClick={() => handleMenuClick("stock")}
          >
            Stock Gudang
          </li>
          <li
            className={activeMenu === "barang" ? "active" : ""}
            onClick={() => handleMenuClick("barang")}
          >
            Daftar Barang
          </li>
          <li
            className={activeMenu === "retur" ? "active" : ""}
            onClick={() => handleMenuClick("retur")}
          >
            Daftar Retur
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <h2 className="page-title">Manage Karyawan</h2>

        <div className="top-action">
          <h3 className="table-title">Daftar Karyawan</h3>
          <button className="btn-add" onClick={handleTambahKaryawan}>
            + Tambah Karyawan
          </button>
        </div>

        <table className="table-karyawan">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(dataKaryawan) && dataKaryawan.length > 0 ? (
              dataKaryawan.map((karyawan) => (
                <tr key={karyawan._id}>
                  <td>{karyawan.idKaryawan}</td>
                  <td>{karyawan.namaLengkap}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        karyawan.status === "aktif" ? "active" : "nonactive"
                      }`}
                    >
                      {karyawan.status === "aktif" ? "Bekerja" : "Dipecat"}
                    </span>
                  </td>
                  <td>
                    {karyawan.status === "aktif" ? (
                      <button
                        className="btn-danger"
                        onClick={() =>
                          handleUpdateStatus(karyawan._id, "nonaktif")
                        }
                      >
                        Pecat
                      </button>
                    ) : (
                      <button
                        className="btn-success"
                        onClick={() =>
                          handleUpdateStatus(karyawan._id, "aktif")
                        }
                      >
                        Rekrut
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Tidak ada data karyawan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageKariawan;
