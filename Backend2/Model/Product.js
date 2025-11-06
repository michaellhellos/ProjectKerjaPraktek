const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  idBarang: {
    type: String,
    required: true,
    unique: true,
  },
  namaBarang: {
    type: String,
    required: true,
  },
  hargaBarang: {
    type: Number,
    required: true,
  },
  stockBarang: {
    type: Number,
    required: true,
  },
  fotoBarang: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
