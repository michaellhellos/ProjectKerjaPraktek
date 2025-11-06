const express = require("express");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const Admin = require("../Model/Admin");
const KepalaGudang = require("../Model/KepalaGudang");
const Karyawan = require("../Model/Karyawan");

const app = express();
app.use(express.json());
app.use(cors());

// === Static folder untuk akses file upload ===
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === Koneksi MongoDB ===
mongoose.connect("mongodb://localhost:27017/CvSemogaJadiJaya", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ Error MongoDB:", err));

// === Konfigurasi Multer ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let baseFolder = "";
    let subfolder = "";

    // Tentukan folder utama berdasarkan route/form
    if (req.originalUrl.includes("/karyawan")) {
      baseFolder = "karyawan";
      if (file.fieldname === "foto") subfolder = "foto";
      else if (file.fieldname === "ktp") subfolder = "ktp";
    } else if (req.originalUrl.includes("/product")) {
      baseFolder = "product";
      if (file.fieldname === "fotoBarang") subfolder = "foto";
    }

    // Path lengkap upload
    const uploadPath = path.join(__dirname, `../uploads/${baseFolder}`, subfolder);
    fs.mkdirSync(uploadPath, { recursive: true }); // buat folder otomatis

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});



const upload = multer({ storage });

// === Route Login ===
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ Email: email, Password: password });
  if (admin) return res.json({ message: "Hello_Admin", role: "admin" });

  const manager = await KepalaGudang.findOne({ Email: email, Password: password });
  if (manager) return res.json({ message: "Hallo_KepalaGudang", role: "kepala_gudang" });

  return res.status(401).json({ message: "Email atau Password salah!" });
});

// === Route Tambah Karyawan ===
app.post(
  "/addKaryawan",
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "ktp", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        namaLengkap,
        tempatLahir,
        tanggalLahir,
        jenisKelamin,
        golonganDarah,
        alamat,
        noTelepon,
        agama,
        status,
      } = req.body;

      const foto = req.files["foto"] ? req.files["foto"][0].path : null;
      const ktp = req.files["ktp"] ? req.files["ktp"][0].path : null;

      const newKaryawan = new Karyawan({
        namaLengkap,
        tempatLahir,
        tanggalLahir,
        jenisKelamin,
        golonganDarah,
        alamat,
        noTelepon,
        agama,
        foto,
        ktp,
        status,
      });

      await newKaryawan.save();

      res.json({
        success: true,
        message: "Karyawan berhasil ditambahkan!",
        idKaryawan: newKaryawan.idKaryawan, // ✅ kirim ID custom ke frontend
      });
    } catch (err) {
      console.error("❌ Error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);
app.get("/getKaryawan", async (req, res) => {
  try {
    const karyawanList = await Karyawan.find().sort({ createdAt: 1 });
    res.json({
      success: true,
      data: karyawanList,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.put("/updateStatus/:id", async (req, res) => {
  try {
    const { status } = req.body;
    await Karyawan.findByIdAndUpdate(req.params.id, { status });
    res.json({ success: true, message: "Status berhasil diupdate!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
//Tambah barang
router.post("/tambahbarang", upload.single("fotoBarang"), async (req, res) => {
  try {
    const { idBarang, namaBarang, hargaBarang, stockBarang } = req.body;

    if (!idBarang || !namaBarang || !hargaBarang || !stockBarang) {
      return res.status(400).json({
        success: false,
        message: "Semua field harus diisi!",
      });
    }

    const newProduct = new Product({
      idBarang,
      namaBarang,
      hargaBarang,
      stockBarang,
      fotoBarang: req.file ? `/uploads/product/foto/${req.file.filename}` : null,
    });

    await newProduct.save();

    res.json({
      success: true,
      message: "Barang berhasil ditambahkan!",
      data: newProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan barang.",
      error: err.message,
    });
  }
});
// === Jalankan Server ===
app.listen(3000, () => {
  console.log("🚀 Server berjalan di http://localhost:3000");
});
module.exports = app;