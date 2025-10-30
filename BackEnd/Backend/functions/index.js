const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();
const bucket = admin.storage().bucket();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

/**
 * ✅ REGISTER USER
 */
exports.registerUser = functions.https.onRequest(async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Semua field wajib diisi" });
    }

    const snapshot = await db.collection("users").where("email", "==", email).get();
    if (!snapshot.empty) {
      return res.status(400).json({ error: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const docRef = await db.collection("users").add({
      name,
      email,
      password: hashedPassword,
      role,
      active: true,
      createdAt: new Date()
    });

    res.json({ success: true, id: docRef.id, message: "User berhasil didaftarkan" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ✅ LOGIN USER
 */
exports.loginUser = functions.https.onRequest(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email dan Password wajib diisi" });
    }

    const snapshot = await db.collection("users").where("email", "==", email).get();
    if (snapshot.empty) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (!userData.active) {
      return res.status(403).json({ error: "Akun sudah dinonaktifkan" });
    }

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    res.json({
      success: true,
      user: {
        id: userDoc.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ✅ ADD KARYAWAN (dengan foto & KTP)
 */

app.post(
  "/addKaryawan",
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "ktp", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const {
        namaLengkap, tempatLahir, tanggalLahir,
        jenisKelamin, golonganDarah, alamat,
        noTelepon, agama
      } = req.body;

      if (!req.files || !req.files.foto || !req.files.ktp) {
        return res.status(400).json({ error: "Foto dan KTP wajib diupload!" });
      }

      // ✅ Generate ID karyawan terbaru
      const snapshot = await db.collection("karyawan")
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

      let nextID = "k001";
      if (!snapshot.empty) {
        const lastId = snapshot.docs[0].data().idKaryawan;
        const num = parseInt(lastId.substring(1)) + 1;
        nextID = "k" + num.toString().padStart(3, "0");
      }

      const uploadFile = async (file, prefix) => {
        const ext = file.originalname.split(".").pop();
        const path = `karyawan/${nextID}_${prefix}.${ext}`;

        const storageFile = bucket.file(path);
        await storageFile.save(file.buffer, {
          metadata: { contentType: file.mimetype },
        });

        const [url] = await storageFile.getSignedUrl({
          action: "read",
          expires: "03-09-2500"
        });

        return url;
      };

      const fotoURL = await uploadFile(req.files.foto[0], "foto");
      const ktpURL = await uploadFile(req.files.ktp[0], "ktp");

      await db.collection("karyawan").add({
        idKaryawan: nextID,
        namaLengkap,
        tempatLahir,
        tanggalLahir,
        jenisKelamin,
        golonganDarah,
        alamat,
        noTelepon,
        agama,
        foto: fotoURL,
        ktp: ktpURL,
        createdAt: new Date()
      });

      return res.json({
        success: true,
        message: "Karyawan berhasil ditambahkan!",
        idKaryawan: nextID,
        foto: fotoURL,
        ktp: ktpURL,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

// ✅ Export function tunggal (tidak boleh duplikat lagi)
exports.addKaryawan = functions.region("us-central1").https.onRequest(app);

/**
 * ✅ TAMBAH BARANG
 */
exports.tambahBarang = functions.https.onRequest(async (req, res) => {
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
      createdAt: new Date(),
    });

    res.json({ success: true, message: "Barang berhasil ditambahkan!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
//delete barang
exports.deleteBarang = functions.https.onRequest(async (req, res) => {
  try {
    const id = req.query.id; // contoh request: ?id=ba001
    if (!id) return res.status(400).json({ message: "ID dibutuhkan!" });

    await db.collection("barang").doc(id).delete();

    res.json({ success: true, message: "Barang berhasil dihapus!" });
    
  } catch (error) {
    console.error("Error deleteBarang:", error);
    res.status(500).json({ error: error.message });
  }
});
//get barang
exports.getBarang = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await db.collection("barang").get();

    let barangList = [];
    snapshot.forEach((doc) => {
      barangList.push(doc.data());
    });

    res.json({
      success: true,
      data: barangList
    });

  } catch (error) {
    console.error("Error getBarang:", error);
    res.status(500).json({ error: error.message });
  }
});
// retur barang 

app.post("/tambahRetur",
  upload.single("fotoRusak"),
  async (req, res) => {
    try {
      const { idBarang, namaBarang, jumlah } = req.body;

      if (!idBarang || !namaBarang || !jumlah) {
        return res.status(400).json({ message: "Data tidak lengkap!" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Foto bukti rusak wajib diupload!" });
      }

      // ✅ Generate ID Retur
      const snap = await db.collection("retur").orderBy("createdAt", "desc").limit(1).get();
      let nextID = "r001";

      if (!snap.empty) {
        const lastID = snap.docs[0].data().idRetur;
        const num = parseInt(lastID.substring(1)) + 1;
        nextID = "r" + num.toString().padStart(3, "0");
      }

      // ✅ Upload foto
      const ext = req.file.originalname.split(".").pop();
      const filename = `retur/${nextID}_rusak.${ext}`;
      const fileUpload = bucket.file(filename);

      await fileUpload.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype },
      });

      const [fotoURL] = await fileUpload.getSignedUrl({
        action: "read",
        expires: "03-09-2500",
      });

      // ✅ Simpan Firestore
      await db.collection("retur").doc(nextID).set({
        idRetur: nextID,
        idBarang,
        namaBarang,
        jumlah: Number(jumlah),
        fotoRusak: fotoURL,
        status: "pending",
        createdAt: new Date(),
      });

      res.json({
        success: true,
        message: "Retur berhasil ditambahkan!",
        idRetur: nextID
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

exports.tambahRetur = functions.https.onRequest(app);
// get retur

app.get("/getRetur", async (req, res) => {
  try {
    const snapshot = await db.collection("retur").orderBy("createdAt", "desc").get();

    const returList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: returList,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
//delete retur
app.delete("/deleteRetur/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection("retur").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Data retur tidak ditemukan" });
    }

    const data = doc.data();

    // ✅ Cari foto di storage dari URL
    if (data.fotoRusak) {
      const filePath = decodeURIComponent(
        data.fotoRusak.split("/o/")[1].split("?")[0]
      );
      await bucket.file(filePath).delete().catch(() => {});
    }

    // ✅ Hapus data retur
    await db.collection("retur").doc(id).delete();

    res.json({
      success: true,
      message: "Data retur berhasil dihapus!"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
//kepala gudang 
