const mongoose = require("mongoose");

const KepalaGudangSchema = new mongoose.Schema({
  Nama_Depan: {
    type: String,
    required: true
  },
  Nama_Belakang: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  Password: {
    type: String,
    required: true
  },
  KTP: {
    type: String,
    required: true
  },
  Status: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("KepalaGudang", KepalaGudangSchema);
