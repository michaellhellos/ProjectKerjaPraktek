const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const bcrypt = require("bcryptjs"); // pastikan install: npm install bcryptjs



admin.initializeApp();

const storage = admin.storage().bucket();
const multer = require("multer");


const db = admin.firestore();

/**
 * REGISTER USER
 * body: { name, email, password, role }
 * role: "admin" | "karyawan" | "kepala_gudang"
 */
exports.registerUser = functions.https.onRequest(async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Semua field wajib diisi" });
    }

    // cek apakah email sudah ada
    const snapshot = await db.collection("users").where("email", "==", email).get();
    if (!snapshot.empty) {
      return res.status(400).json({ error: "Email sudah terdaftar" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // simpan user
    const docRef = await db.collection("users").add({
      name,
      email,
      password: hashedPassword,
      role,
      active: true, // default aktif
      createdAt: new Date(),
    });

    res.json({ success: true, id: docRef.id, message: "User berhasil didaftarkan" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * LOGIN Sistem
 * body: { email, password }
 */
exports.loginUser = onRequest(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email dan Password wajib diisi" });
    }

    // cari user berdasarkan email
    const snapshot = await db.collection("users").where("email", "==", email).get();
    if (snapshot.empty) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // cek apakah user aktif
    if (!userData.active) {
      return res.status(403).json({ error: "Akun sudah dinonaktifkan" });
    }

    // verifikasi password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    // ---- LOGIC ROLE & GREETING ----
    let greeting = "Hallo Karyawan"; // default

    if (userData.role === "admin") {
      greeting = "Hallo Admin";
    } else if (userData.role === "kepala_gudang") {
      greeting = "Hallo Kepala Gudang";
    }

    res.json({
      success: true,
      message: greeting,
      user: {
        id: userDoc.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
    });

  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
});
// konfigurasi multer untuk upload foto KTP
const upload = multer({
  storage: multer.memoryStorage(),
});

exports.addKaryawan = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
  try {
    const {
      namaLengkap,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      golonganDarah,
      alamat,
      noTelepon,
      agama
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Foto KTP wajib diupload" });
    }

    // Ambil ID terakhir
    const snapshot = await db.collection("karyawan").orderBy("createdAt", "desc").limit(1).get();
    let nextID = "k001";

    if (!snapshot.empty) {
      const lastId = snapshot.docs[0].data().idKaryawan; // contoh: k007
      const num = parseInt(lastId.substring(1)) + 1;
      nextID = "k" + num.toString().padStart(3, "0");
    }

    // Upload foto ke Storage
    const fileName = `karyawan/${nextID}_ktp.jpg`;
    const file = storage.file(fileName);

    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });

    const fotoKTP_URL = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2035",
    });

    // Simpan data ke Firestore
    const docRef = await db.collection("karyawan").add({
      idKaryawan: nextID,
      namaLengkap,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      golonganDarah,
      alamat,
      noTelepon,
      agama,
      fotoKTP: fotoKTP_URL[0],
      createdAt: new Date(),
    });

    res.json({
      success: true,
      message: "Karyawan berhasil ditambahkan ✅",
      id: docRef.id,
      idKaryawan: nextID,
    });

  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
});
});



//Gudang
//Tambah Barang Gudang
exports.tambahBarang = functions.https.onRequest(async (req, res) => {
  // Allow CORS (biar bisa dipanggil dari frontend)
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  try {
    const { id, nama, harga, stok, foto, tipe } = req.body;

    if (!id || !nama || !harga || !stok) {
      return res.status(400).json({ message: "Data tidak lengkap!" });
    }

    await db.collection("barang").doc(id).set({
      id,
      nama,
      harga: Number(harga),
      stok: Number(stok),
      foto: foto || "",
      tipe: tipe || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({ message: "Barang berhasil ditambahkan!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
});
