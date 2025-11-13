const express = require("express");
const cors = require("cors");
const fs = require("fs");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");


const Admin = require("../Model/Admin");
const KepalaGudang = require("../Model/KepalaGudang");
const Karyawan = require("../Model/Karyawan");
const Product = require("../Model/Product");
const BarangMasukGudang = require("../Model/BarangMasuk");
const BarangKeluarGudang = require("../Model/BarangKeluar");



const app = express();
app.use(express.json());
app.use(cors());

// === Static folder untuk akses file upload ===
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
mongoose.connect("mongodb://127.0.0.1:27017/CvSemogaJadiJaya", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// === Koneksi MongoDB ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let baseFolder = "";
    let subfolder = "";

    // ✅ Tentukan folder berdasarkan route
    if (req.originalUrl.includes("/karyawan")) {
      baseFolder = "karyawan";
      if (file.fieldname === "foto") subfolder = "foto";
      else if (file.fieldname === "ktp") subfolder = "ktp";
    } 
    else if (req.originalUrl.includes("/tambahbarang")) { 
      // ✅ Untuk Product
      baseFolder = "product";
      if (file.fieldname === "fotoBarang") subfolder = "foto";
    }
    else if (req.originalUrl.includes("/retur")) { 
      // ✅ Untuk Retur
      baseFolder = "retur";
      if (file.fieldname === "fotoBukti") subfolder = "foto";
    }else if (req.originalUrl.includes("/barangmasuk")) { 
      // ✅ Untuk Retur
      baseFolder = "barangmasuk";
      if (file.fieldname === "fotoBarang") subfolder = "foto";
    }else if (req.originalUrl.includes("/barangkeluar")) {
  baseFolder = "tambahbarangkeluar";
  if (file.fieldname === "fotoInvoice") subfolder = "foto";
}


    // Buat folder otomatis jika belum ada
    const uploadPath = path.join(__dirname, `../uploads/${baseFolder}/${subfolder}`);
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
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
//add kepala gudang 
app.post("/register-kepalagudang",
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "ktp", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      console.log("BODY:", req.body);
      console.log("FILES:", req.files);

      const { Nama_Depan, Nama_Belakang, Email, Password } = req.body;

      if (!Nama_Depan || !Nama_Belakang || !Email || !Password) {
        return res.status(400).json({
          success: false,
          message: "Semua field harus diisi!"
        });
      }

      const exist = await KepalaGudang.findOne({ Email });
      if (exist) {
        return res.status(409).json({
          success: false,
          message: "Email sudah terdaftar!"
        });
      }

      const fotoUrl = req.files.foto ? req.files.foto[0].path : "";
      const ktpUrl = req.files.ktp ? req.files.ktp[0].path : "";

      const newKepalaGudang = new KepalaGudang({
        Nama_Depan,
        Nama_Belakang,
        Email,
        Password,
        KTP: ktpUrl, // ✅ simpan file path
        Foto: fotoUrl
      });

      await newKepalaGudang.save();

      res.status(201).json({
        success: true,
        message: "Berhasil menambahkan Kepala Gudang!",
        data: newKepalaGudang
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server!"
      });
    }
  }
);
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
app.post("/tambahbarang", upload.single("fotoBarang"), async (req, res) => {
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
//get barang 
app.get("/barang", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data barang",
      error: err.message,
    });
  }
});
//delete by id
app.delete("/barang/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ idBarang: req.params.id });

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Barang tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Barang berhasil dihapus!",
      data: deletedProduct,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus barang",
      error: err.message,
    });
  }
});
app.post("/retur", upload.single("fotoBukti"), async (req, res) => {
  try {
    const { idBarang, namaBarang, jumlah } = req.body;

    if (!idBarang || !namaBarang || !jumlah) {
      return res.status(400).json({
        success: false,
        message: "Semua field harus diisi!",
      });
    }

    const newRetur = new Retur({
      idBarang,
      namaBarang,
      jumlah,
      fotoBukti: req.file ? `/uploads/retur/${req.file.filename}` : null,
    });

    await newRetur.save();

    res.json({
      success: true,
      message: "Data retur berhasil ditambahkan!",
      data: newRetur,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan retur.",
      error: err.message,
    });
  }
});
//kepala gudang 
app.post(
  "/barangmasuk",
  upload.any(),  // ✅ terima semua file dulu untuk debugging
  async (req, res) => {
    try {
      console.log(">>> BODY:", req.body);
      console.log(">>> FILES:", req.files);

      const fotoFile = req.files?.find(f => f.fieldname === "fotoBarang");

      const newData = new BarangMasukGudang({
        idBarang: req.body.idBarang,
        namaBarang: req.body.namaBarang,
        jumlahBarang: req.body.jumlahBarang,
        tipeBarang: req.body.tipeBarang,
        tanggalMasuk: req.body.tanggalMasuk,
        fotoBarang: fotoFile ? fotoFile.filename : null
      });

      await newData.save();

      res.status(201).json({
        success: true,
        message: "✅ Barang masuk berhasil ditambahkan (Debug Mode)",
        files: req.files,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "❌ Gagal menyimpan data",
      });
    }
  }
);
//get
app.get("/barangmasuk", async (req, res) => {
  try {
    const data = await BarangMasukGudang.find();

    res.status(200).json({
      success: true,
      message: "✅ Data barang masuk berhasil diambil",
      data: data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "❌ Gagal mengambil data",
    });
  }
});
//total barang masuk
// ✅ Total Barang (semua stok saat ini)
app.get("/totalbarang", async (req, res) => {
  try {
    const data = await BarangMasukGudang.find();
    let total = 0;

    data.forEach((item) => {
      total += item.jumlahBarang;
    });

    res.status(200).json({
      success: true,
      totalBarang: total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "❌ Gagal mengambil total barang",
    });
  }
});

//barang keluar
app.post("/barangkeluar", upload.single("fotoInvoice"), async (req, res) => {
  try {
    const { idBarang, namaBarang, jumlahKeluar, tanggalKeluar, karyawan } = req.body;

    if (!idBarang || !namaBarang || !jumlahKeluar || !tanggalKeluar || !karyawan) {
      return res.status(400).json({ message: "Semua field harus diisi!" });
    }

    const barangMasuk = await BarangMasukGudang.findOne({ idBarang });

    if (!barangMasuk) {
      return res.status(404).json({ message: "ID Barang tidak ditemukan!" });
    }

    // Cek stok cukup atau tidak
    if (barangMasuk.jumlahBarang < jumlahKeluar) {
      return res.status(400).json({
        message: `Stok tidak cukup! Stok tersedia: ${barangMasuk.jumlahBarang}`
      });
    }

    // Kurangi stok
    barangMasuk.jumlahBarang -= Number(jumlahKeluar);
    await barangMasuk.save();

    const newBarangKeluar = new BarangKeluarGudang({
      idBarang,
      namaBarang,
      jumlahKeluar,
      tanggalKeluar,
      karyawan,
      fotoInvoice: req.file ? req.file.filename : null
    });

    await newBarangKeluar.save();

    res.status(201).json({
      message: "Barang keluar berhasil ditambahkan!",
      data: newBarangKeluar
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error!" });
  }
});
app.get("/barangkeluar", async (req, res) => {
  try {
    const data = await BarangKeluarGudang.find().sort({ tanggalKeluar: -1 });
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error!"
    });
  }
});



// === Jalankan Server ===
app.listen(3000, () => {
  console.log("🚀 Server berjalan di http://localhost:3000");
});
module.exports = app;