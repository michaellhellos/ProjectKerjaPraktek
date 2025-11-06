const mongoose = require("mongoose");

const KaryawanSchema = new mongoose.Schema({
  idKaryawan: {
    type: String,
    unique: true, // pastikan tidak duplikat
  },
  namaLengkap: String,
  tempatLahir: String,
  tanggalLahir: String,
  jenisKelamin: String,
  golonganDarah: String,
  alamat: String,
  noTelepon: String,
  agama: String,
  foto: String, // path foto
  ktp: String,  // path KTP
  status: {
    type: String,
    enum: ["aktif", "nonaktif", "cuti"],
    default: "aktif",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Generate ID otomatis: K001, K002, dst
KaryawanSchema.pre("save", async function (next) {
  if (this.isNew) {
    const Karyawan = mongoose.model("Karyawan", KaryawanSchema);

    // Ambil data terakhir berdasarkan idKaryawan (urut descending)
    const lastKaryawan = await Karyawan.findOne().sort({ createdAt: -1 });

    let newId = "K001";
    if (lastKaryawan && lastKaryawan.idKaryawan) {
      const lastNumber = parseInt(lastKaryawan.idKaryawan.substring(1)); // ambil angka dari K001
      const nextNumber = lastNumber + 1;
      newId = "K" + nextNumber.toString().padStart(3, "0"); // hasil: K002
    }

    this.idKaryawan = newId;
  }
  next();
});

module.exports = mongoose.model("Karyawan", KaryawanSchema);
