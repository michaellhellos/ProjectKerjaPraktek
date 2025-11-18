const mongoose = require("mongoose");

const KaryawanSchema = new mongoose.Schema({
  idKaryawan: {
    type: String,
    unique: true,
  },
  namaLengkap: String,
  tempatLahir: String,
  tanggalLahir: String,
  jenisKelamin: String,
  golonganDarah: String,
  alamat: String,
  noTelepon: String,
  agama: String,

  // 🔥 Tambahkan ini
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },

  foto: String,
  ktp: String,

  status: {
    type: String,
    enum: ["aktif", "nonaktif", "cuti"],
    default: "aktif",
  },

  createdAt: { type: Date, default: Date.now },
});

// Auto generate ID K001, K002, dst
KaryawanSchema.pre("save", async function (next) {
  if (this.isNew) {
    const Karyawan = mongoose.model("Karyawan", KaryawanSchema);
    const lastKaryawan = await Karyawan.findOne().sort({ createdAt: -1 });

    let newId = "K001";
    if (lastKaryawan && lastKaryawan.idKaryawan) {
      const lastNumber = parseInt(lastKaryawan.idKaryawan.substring(1));
      newId = "K" + (lastNumber + 1).toString().padStart(3, "0");
    }

    this.idKaryawan = newId;
  }
  next();
});

module.exports = mongoose.model("Karyawan", KaryawanSchema);
