import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./managekariawan.css";

function ManageKariawan() {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("karyawan");

  const handleMenuClick = (key) => {
    setActiveMenu(key);
    if (key === "karyawan") {
      navigate("/Sistem/managekariawan");
    } else if (key === "stock") {
      navigate("/Sistem/stockgudang");
    } else if (key === "barang") {
      navigate("/Sistem/daftarBarang");
    } else if (key === "retur") {
      navigate("/Sistem/retur");
    } else if (key === "dashboard") {
      navigate("/Sistem/sistem");
    }
  };

  const handleTambahKaryawan = () => {
    navigate("/Sistem/tambahkaryawan");
  };

  const [dataKaryawan, setDataKaryawan] = useState([
    { id: "EMP001", email: "johndoe@example.com", status: "Bekerja" },
    { id: "EMP002", email: "janesmith@example.com", status: "Bekerja" },
    { id: "EMP003", email: "peterjones@example.com", status: "Dipecat" },
  ]);

  const toggleStatus = (index) => {
    const newData = [...dataKaryawan];
    newData[index].status =
      newData[index].status === "Bekerja" ? "Dipecat" : "Bekerja";
    setDataKaryawan(newData);
  };

  return (
    <div className="manage-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin</h2>
        <p className="sidebar-role">Warehouse Manager</p>
        <ul className="sidebar-menu">
          <li className={activeMenu === "dashboard" ? "active" : ""} onClick={() => handleMenuClick("dashboard")}>
            Dashboard
          </li>
          <li className={activeMenu === "karyawan" ? "active" : ""} onClick={() => handleMenuClick("karyawan")}>
            Manage Karyawan
          </li>
          <li className={activeMenu === "stock" ? "active" : ""} onClick={() => handleMenuClick("stock")}>
            Stock Gudang
          </li>
          <li className={activeMenu === "barang" ? "active" : ""} onClick={() => handleMenuClick("barang")}>
            Daftar Barang
          </li>
          <li className={activeMenu === "retur" ? "active" : ""} onClick={() => handleMenuClick("retur")}>
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
              <th>Email</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {dataKaryawan.map((karyawan, index) => (
              <tr key={karyawan.id}>
                <td>{karyawan.id}</td>
                <td>{karyawan.email}</td>
                <td>
                  <span className={`status-badge ${karyawan.status === "Bekerja" ? "active" : "nonactive"}`}>
                    {karyawan.status}
                  </span>
                </td>
                <td>
                  {karyawan.status === "Bekerja" ? (
                    <button className="btn-danger" onClick={() => toggleStatus(index)}>
                      Pecat
                    </button>
                  ) : (
                    <button className="btn-success" onClick={() => toggleStatus(index)}>
                      Rekrut
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default ManageKariawan;
