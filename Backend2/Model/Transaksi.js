const TransaksiSchema = new mongoose.Schema(
  {
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

    paymentMethod: {
      type: String,
      enum: ["cash", "qris"],
      required: true
    }
  },
  { timestamps: true } // 🔥 WAJIB DIBERI
);
