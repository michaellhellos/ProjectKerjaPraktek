const mongoose = require("mongoose");

const PelangganSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  alamat: { type: String, required: true },
  telp: { type: String, required: true },
  kota: { type: String, required: true },
  kodePos: { type: String, required: true },
  negara: { type: String, required: true },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Pelanggan", PelangganSchema);
