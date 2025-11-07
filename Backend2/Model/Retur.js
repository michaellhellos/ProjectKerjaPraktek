const mongoose = require("mongoose");

const ReturSchema = new mongoose.Schema({
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
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Retur", ReturSchema);
