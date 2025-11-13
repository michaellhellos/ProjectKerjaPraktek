const mongoose = require("mongoose");

const ReturBarangSchema = new mongoose.Schema({
  idBarang: {
    type: String,
    required: true,
  },
  namaBarang: {
    type: String,
    required: true,
  },
  jumlah: {
    type: Number,
    required: true,
  },
  fotoBukti: {
    type: String, // simpan path foto
    required: false,
  },
  tanggalRetur: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Belum di ambil", // status awal retur
  },
});

module.exports = mongoose.model("ReturBarang", ReturBarangSchema);
