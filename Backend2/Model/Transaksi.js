const mongoose = require("mongoose");

const TransaksiSchema = new mongoose.Schema({
  pelanggan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pelanggan",
    required: true
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      jumlah: Number,
      harga: Number
    }
  ],

  subtotal: {
    type: Number,
    required: true
  },

  // 🟦 METHOD PEMBAYARAN
  paymentMethod: {
    type: String,
    enum: ["cash", "qris"],
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Transaksi", TransaksiSchema);
