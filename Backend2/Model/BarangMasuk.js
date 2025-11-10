const mongoose = require("mongoose");

const BarangMasukSchema = new mongoose.Schema({
  idBarang: { type: String, required: true },
  namaBarang: { type: String, required: true },
  jumlahBarang: { type: Number, required: true },
  tipeBarang: { type: String, required: true },
  tanggalMasuk: { type: Date, required: true },
  fotoBarang: { type: String }
});

module.exports = mongoose.model("BarangMasukGudang", BarangMasukSchema);
