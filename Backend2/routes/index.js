const express = require("express");
const cors = require("cors");
const fs = require("fs");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const bwipjs = require("bwip-js");

const Admin = require("../Model/Admin");
const KepalaGudang = require("../Model/KepalaGudang");
const Karyawan = require("../Model/Karyawan");
const Product = require("../Model/Product");
const BarangMasukGudang = require("../Model/BarangMasuk");
const BarangKeluarGudang = require("../Model/BarangKeluar");
const Cart = require("../Model/Cart");

const Pelanggan = require("../Model/Pelanggan");
const Transaksi = require("../Model/Transaksi");

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

  try {
    // 🔹 Check Admin
    const admin = await Admin.findOne({ Email: email, Password: password });
    if (admin) {
      return res.json({
        message: "Hello_Admin",
        role: "admin",
        user: admin,
      });
    }

    // 🔹 Check Kepala Gudang
    const manager = await KepalaGudang.findOne({
      Email: email,
      Password: password,
    });
    if (manager) {
      return res.json({
        message: "Hallo_KepalaGudang",
        role: "kepala_gudang",
        user: manager,
      });
    }

    // 🔹 Check Karyawan
    const karyawan = await Karyawan.findOne({
      Email: email,
      Password: password,
    });

    if (karyawan) {
      // Jika karyawan dinonaktifkan (opsional)
      if (karyawan.active === false) {
        return res.status(403).json({
          message: "Akun Anda telah dinonaktifkan!",
        });
      }

      return res.json({
        message: "Hallo_Karyawan",
        role: "karyawan",
        user: karyawan,
      });
    }

    // Jika semua gagal
    return res.status(401).json({
      message: "Email atau Password salah!",
    });

  } catch (err) {
    console.error("❌ Error Login:", err);
    return res.status(500).json({
      message: "Terjadi kesalahan server!",
    });
  }
});
//admin update
app.put("/update", async (req, res) => {
  const { Email, Password } = req.body;

  try {
    // Pastikan admin ada (ambil admin pertama)
    const admin = await Admin.findOne();

    if (!admin) {
      return res.status(404).json({ message: "Admin tidak ditemukan!" });
    }

    // Update data
    admin.Email = Email;
    admin.Password = Password;

    await admin.save();

    res.json({ message: "Profil admin berhasil diperbarui!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui admin!" });
  }
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
//update kepala gudang
app.post("/kepalagudang/find", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const kepala = await KepalaGudang.findOne({ Email, Password });

    if (!kepala) {
      return res.status(404).json({
        success: false,
        message: "Email atau Password lama salah!"
      });
    }

    res.json({
      success: true,
      message: "Data ditemukan!",
      data: kepala
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server!"
    });
  }
});
app.put("/update-kepalagudang/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { Email, Password } = req.body;

    const kepala = await KepalaGudang.findById(id);
    if (!kepala) {
      return res.status(404).json({
        success: false,
        message: "Kepala Gudang tidak ditemukan!"
      });
    }

    kepala.Email = Email;
    kepala.Password = Password;

    await kepala.save();

    res.json({
      success: true,
      message: "Profile berhasil diperbarui!",
      data: kepala
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error!" });
  }
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
        email,
        password
      } = req.body;

      const foto = req.files["foto"] ? req.files["foto"][0].path : null;
      const ktp = req.files["ktp"] ? req.files["ktp"][0].path : null;

      // Cek email tidak boleh duplikat
      const cekEmail = await Karyawan.findOne({ Email: email });
      if (cekEmail) {
        return res.status(400).json({
          success: false,
          message: "Email sudah digunakan!",
        });
      }

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
        Email: email,
        Password: password,
      });

      await newKaryawan.save();

      res.json({
        success: true,
        message: "Karyawan berhasil ditambahkan!",
        idKaryawan: newKaryawan.idKaryawan,
      });
    } catch (err) {
      console.error("❌ Error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

//update email dan password karyawan
// 🔍 CARI KARYAWAN BERDASARKAN EMAIL & PASSWORD LAMA
app.post("/karyawan/find", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({
        success: false,
        message: "Email dan Password lama wajib diisi!",
      });
    }

    // CARI EMAIL DAN PASSWORD LAMA
    const karyawan = await Karyawan.findOne({ Email, Password });

    if (!karyawan) {
      return res.status(404).json({
        success: false,
        message: "Email atau Password lama salah!",
      });
    }

    res.json({
      success: true,
      message: "Data ditemukan!",
      data: karyawan,
    });

  } catch (err) {
    console.error("❌ Error find:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});
app.put("/updateAuthKaryawan/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    const karyawan = await Karyawan.findById(id);
    if (!karyawan) {
      return res.status(404).json({
        success: false,
        message: "Karyawan tidak ditemukan!",
      });
    }

    if (email && email !== karyawan.Email) {
      const cekEmail = await Karyawan.findOne({ Email: email });
      if (cekEmail) {
        return res.status(400).json({
          success: false,
          message: "Email sudah digunakan!",
        });
      }
      karyawan.Email = email;
    }

    if (password) {
      karyawan.Password = password;
    }

    await karyawan.save();

    res.json({
      success: true,
      message: "Email dan password berhasil diperbarui!",
    });

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


app.get("/getKaryawan", async (req, res) => {
  try {
    const karyawan = await Karyawan.find();

    res.json({
      success: true,
      data: karyawan, // <-- HARUS "data"
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Gagal mengambil data"
    });
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

    // 🔹 Simpan produk
    const newProduct = new Product({
      idBarang,
      namaBarang,
      hargaBarang,
      stockBarang,
      fotoBarang: req.file ? `/uploads/product/foto/${req.file.filename}` : null,
    });

    await newProduct.save();

    // =======================================================
    // 🔹 GENERATE BARCODE BERDASARKAN idBarang
    // =======================================================
    const barcodePath = path.join(__dirname, "uploads/barcode");
    if (!fs.existsSync(barcodePath)) fs.mkdirSync(barcodePath, { recursive: true });

    const barcodeFile = `${idBarang}.png`;
    const fullBarcodePath = path.join(barcodePath, barcodeFile);

    await bwipjs.toBuffer({
      bcid: "code128",   // tipe barcode
      text: idBarang,     // isi barcode
      scale: 3,
      height: 10,
      includetext: true,
    }).then((png) => {
      fs.writeFileSync(fullBarcodePath, png);
    });

    // Simpan URL barcode ke MongoDB (optional)
    newProduct.barcode = `/uploads/barcode/${barcodeFile}`;
    await newProduct.save();

    // =======================================================

    res.json({
      success: true,
      message: "Barang berhasil ditambahkan!",
      data: newProduct,
      barcode: `/uploads/barcode/${barcodeFile}`,  // ini bisa ditampilkan di frontend
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
//karyawan
app.post("/add-to-cart", async (req, res) => {
  try {
    const { productId, jumlah } = req.body;

    // VALIDASI
    if (!productId || !jumlah) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap! (productId dan jumlah wajib)"
      });
    }

    // AMBIL PRODUK
    const produk = await Product.findById(productId);
    if (!produk) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan!"
      });
    }

    if (produk.stockBarang < jumlah) {
      return res.status(400).json({
        success: false,
        message: "Stok tidak mencukupi!"
      });
    }

    // SIMPAN KE CART (TANPA KARYAWAN)
    const newCart = new Cart({
      productId,
      jumlah
    });

    await newCart.save();

    // KURANGI STOK PRODUK
    produk.stockBarang -= jumlah;
    await produk.save();

    res.json({
      success: true,
      message: "Berhasil menambahkan ke keranjang!"
    });

  } catch (err) {
    console.error("Error add-to-cart:", err);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server!"
    });
  }
});


app.get("/keranjang", async (req, res) => {
  try {
    const cartItems = await Cart.find()
      .populate("productId", "namaBarang hargaBarang stockBarang fotoBarang");

    res.json({
      success: true,
      data: cartItems
    });

  } catch (err) {
    console.error("Error get keranjang:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data keranjang!"
    });
  }
});
//update
app.put("/keranjang/tambah/:id", async (req, res) => {
  try {
    const item = await Cart.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item keranjang tidak ditemukan!"
      });
    }

    item.jumlah += 1;
    await item.save();

    res.json({
      success: true,
      message: "Jumlah berhasil ditambah!"
    });

  } catch (err) {
    console.error("Error update tambah:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server"
    });
  }
});

app.put("/keranjang/kurang/:id", async (req, res) => {
  try {
    const item = await Cart.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item keranjang tidak ditemukan!"
      });
    }

    if (item.jumlah <= 1) {
      return res.status(400).json({
        success: false,
        message: "Jumlah minimal 1"
      });
    }

    item.jumlah -= 1;
    await item.save();

    res.json({
      success: true,
      message: "Jumlah berhasil dikurangi!"
    });

  } catch (err) {
    console.error("Error update kurang:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server"
    });
  }
});

//delete
app.delete("/keranjang/:id", async (req, res) => {
  try {
    const item = await Cart.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item keranjang tidak ditemukan!"
      });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: "Item berhasil dihapus dari keranjang!"
    });

  } catch (err) {
    console.error("Error delete keranjang:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server"
    });
  }
});
app.post("/pelanggan", async (req, res) => {
  try {
    const { nama, alamat, telp, kota, kodePos, negara } = req.body;

    if (!nama || !alamat || !telp || !kota || !kodePos || !negara) {
      return res.status(400).json({
        success: false,
        message: "Semua field pelanggan wajib diisi!"
      });
    }

    const pelanggan = new Pelanggan({
      nama,
      alamat,
      telp,
      kota,
      kodePos,
      negara
    });

    await pelanggan.save();

    res.json({
      success: true,
      message: "Data pelanggan berhasil disimpan!",
      data: pelanggan
    });

  } catch (err) {
    console.error("Error simpan pelanggan:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.post("/checkout", async (req, res) => {
  try {
    const { pelangganId, paymentMethod } = req.body;

    if (!pelangganId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "pelangganId dan paymentMethod wajib!"
      });
    }

    // Validasi metode pembayaran
    if (!["cash", "qris"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Metode pembayaran tidak valid!"
      });
    }

    // Ambil isi keranjang
    const cartItems = await Cart.find().populate("productId");

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Keranjang kosong!" });
    }

    // Hitung subtotal
    const subtotal = cartItems.reduce((total, item) => {
      return total + item.productId.hargaBarang * item.jumlah;
    }, 0);

    // Buat transaksi
    const transaksi = new Transaksi({
      pelanggan: pelangganId,
      paymentMethod,
      subtotal,
      items: cartItems.map((item) => ({
        productId: item.productId._id,
        jumlah: item.jumlah,
        harga: item.productId.hargaBarang
      }))
    });

    await transaksi.save();

    // HAPUS KERANJANG
    await Cart.deleteMany({});

    res.json({
      success: true,
      message: "Transaksi berhasil dibuat!",
      data: transaksi
    });

  } catch (err) {
    console.error("Error checkout:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Ambil semua transaksi
app.get("/checkout", async (req, res) => {
  try {
    // Jika ingin semua transaksi
    const transaksiList = await Transaksi.find()
      .populate("pelanggan") // populate data pelanggan
      .populate("items.productId"); // populate data produk di item

    res.status(200).json({
      success: true,
      message: "✅ Data transaksi berhasil diambil",
      data: transaksiList
    });

  } catch (err) {
    console.error("Error get transaksi:", err);
    res.status(500).json({
      success: false,
      message: "❌ Gagal mengambil data transaksi",
    });
  }
});




// === Jalankan Server ===
app.listen(3000, () => {
  console.log("🚀 Server berjalan di http://localhost:3000");
});
module.exports = app;