const express = require("express");
const cors = require("cors");
const db = require("../Database/database.js");
const moment = require("moment"); // pastikan sudah install: npm install moment

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ambil data dari tabel Pasien dengan opsi pencarian berdasarkan nama
app.get("/data", (req, res) => {
  const searchQuery = req.query.search;
  let sqlQuery = "SELECT * FROM Pasien";

  if (searchQuery) {
    sqlQuery += ` WHERE nama LIKE '%${searchQuery}%'`; // Penyisipan langsung (tidak aman)
  }else{
    const oneWeekAgo = moment().subtract(7, 'days').format("YYYY-MM-DD");
    const oneMonthAgo = moment().subtract(1, 'months').format("YYYY-MM-DD");
    sqlQuery += ` WHERE tanggal >= '${oneMonthAgo}' ORDER BY tanggal DESC`;
  }

  db.query(sqlQuery, (err, rows) => { // Tanpa queryParams
    if (err) {
      console.error("Query gagal:", err);
      return res.status(500).json({ error: "Gagal ambil data" });
    }
    res.json(rows);
  });
});

app.post("/data", (req, res) => {
  const { nama, tanggal, deskripsi } = req.body;
  const sqlQuery = `INSERT INTO Pasien (nama, tanggal, deskripsi) VALUES ('${nama}', '${tanggal}', '${deskripsi}')`;

  db.query(sqlQuery, (err) => {
    if (err) {
      console.error("Gagal menyimpan data:", err);
      return res.status(500).json({ error: "Gagal menyimpan data" });
    }
    res.status(201).json({ message: "Data berhasil disimpan" });
  });
})

app.delete("/data/:id", (req, res) => {
  const id = req.params.id;
  const sqlQuery = `DELETE FROM Pasien WHERE id = ${id}`;

  db.query(sqlQuery, (err) => {
    if (err) {
      console.error("Gagal menghapus data:", err);
      return res.status(500).json({ error: "Gagal menghapus data" });
    }
    res.status(200).json({ message: "Data berhasil dihapus" });
  });
});

app.put("/data/:id", (req, res) => {
  const id = req.params.id;
  const { nama, tanggal, deskripsi } = req.body;
  const sqlQuery = `UPDATE Pasien SET nama = '${nama}', tanggal = '${tanggal}', deskripsi = '${deskripsi}' WHERE id = ${id}`;

  db.query(sqlQuery, (err) => {
    if (err) {
      console.error("Gagal memperbarui data:", err);
      return res.status(500).json({ error: "Gagal memperbarui data" });
    }
    res.status(200).json({ message: "Data berhasil diperbarui" });
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});