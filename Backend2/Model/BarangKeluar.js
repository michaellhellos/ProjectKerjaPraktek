const mongoose = require("mongoose");

const BarangKeluarSchema = new mongoose.Schema({
  idBarang: { type: String, required: true },
  namaBarang: { type: String, required: true },
  jumlahKeluar: { type: Number, required: true },
  tanggalKeluar: { type: Date, required: true },
  karyawan: { type: String, required: true },
  fotoInvoice: { type: String }, // Path upload foto invoice
}, { timestamps: true });

module.exports = mongoose.model("BarangKeluarGudang", BarangKeluarSchema);
