const express = require("express");
const cors = require("cors");
const db = require("./database.js");
const moment = require("moment");
// const ratelimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

// const limiter = ratelimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: "Terlalu banyak permintaan, coba lagi nanti.",
// });

// app.use(limiter);
app.use(cors());
app.use(express.json());

// app.on("connection", (socket) => {
//   console.log("🔌 New connection");
//   socket.on("close", () => {
//     console.log("❌ Connection closed");
//   });
// });

// app.use((req, res, next) => {
//   const start = Date.now();
//   res.on("finish", () => {
//     const duration = Date.now() - start;
//     console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);
//   });
//   next();
// });
// const dns = require('dns');

app.get("/pasien", (req, res) => {
  const { search, tanggal } = req.query;
  let query = `
    SELECT p.*, GROUP_CONCAT(
  IF(r.id IS NOT NULL, JSON_OBJECT(
    'id', r.id,
    'tanggal', r.tanggal,
    'keluhan', r.keluhan,
    'pemeriksaanfisik', r.pemeriksaanfisik,
    'pemeriksaanlab', r.pemeriksaanlab,
    'diagnosa', r.diagnosa,
    'terapi', r.terapi,
    'norekammedis', r.norekammedis
  ), NULL)
) AS rekamMedis
    FROM pasien p
    LEFT JOIN rekammedis r ON p.id = r.id_pasien
  `;

  const where = [];
  const params = [];

  if (search) {
    where.push(`p.nama LIKE ?`);
    params.push(`%${search}%`);
  }

  if (tanggal) {
    where.push(`DATE(r.tanggal) = ?`);
    params.push(tanggal);
  }

  if (where.length > 0) {
    query += ` WHERE ` + where.join(" AND ");
  }

  query += ` GROUP BY p.id`;

  db.query(query, params, (err, results) => {
    if (err)
      return res.status(500).json({ error: "Gagal ambil data", detail: err });

    const parsed = results.map((row) => ({
      ...row,
      rekamMedis: row.rekamMedis ? JSON.parse("[" + row.rekamMedis + "]") : [],
    }));

    res.json(parsed);
  });
});

// GET data pasien
app.get("/data", (req, res) => {
  const { search, tanggal } = req.query;
  let sqlQuery = `
    SELECT 
      rm.id AS rekam_medis_id,
      rm.tanggal,
      rm.keluhan,
      rm.pemeriksaanfisik,
      rm.pemeriksaanlab,
      rm.diagnosa,
      rm.terapi,
      rm.norekammedis,
      p.id AS pasien_id,
      p.nama,
      p.tanggallahir,
      p.alamat,
      p.noHp
    FROM RekamMedis rm
    JOIN Pasien p ON rm.id_pasien = p.id
  `;

  let whereClause = [];

  // Filter berdasarkan nama pasien
  if (search) {
    whereClause.push(`p.nama LIKE '%${search}%'`);
  }

  // Filter berdasarkan tanggal rekam medis
  if (tanggal) {
    whereClause.push(`DATE(rm.tanggal) = '${tanggal}'`);
  }

  // Jika tidak ada filter, default ke data hari ini
  if (!search && !tanggal) {
    const today = moment().format("YYYY-MM-DD");
    whereClause.push(`DATE(rm.tanggal) = '${today}'`);
  }

  if (whereClause.length > 0) {
    sqlQuery += ` WHERE ${whereClause.join(" AND ")}`;
  }

  sqlQuery += ` ORDER BY rm.tanggal DESC`;

  db.query(sqlQuery, (err, rows) => {
    if (err) {
      console.error("Query gagal:", err);
      return res.status(500).json({ error: "Gagal ambil data" });
    }
    res.json(rows);
  });
});

app.get("/stats", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", 0);

  const today = moment().format("YYYY-MM-DD");

  const totalQuery = "SELECT COUNT(*) AS total FROM pasien";
  const todayQuery = `SELECT COUNT(*) AS hari_ini FROM rekammedis WHERE DATE(tanggal) = '${today}'`;

  db.query(totalQuery, (err, totalResult) => {
    if (err)
      return res.status(500).json({ error: "Gagal ambil total rekam medis" });

    db.query(todayQuery, (err2, todayResult) => {
      if (err2)
        return res.status(500).json({ error: "Gagal ambil data hari ini" });

      res.json({
        total: totalResult[0].total,
        hari_ini: todayResult[0].hari_ini,
      });
    });
  });
});

// POST data pasien
app.post("/data", (req, res) => {
  const {
    id_pasien,
    tanggal,
    keluhan,
    pemeriksaanfisik,
    pemeriksaanlab,
    diagnosa,
    terapi,
    norekammedis,
  } = req.body;

  const sqlQuery = `
    INSERT INTO RekamMedis 
      (id_pasien, tanggal, keluhan, pemeriksaanfisik, pemeriksaanlab, diagnosa, terapi, norekammedis)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sqlQuery,
    [
      id_pasien,
      tanggal,
      keluhan || null,
      pemeriksaanfisik || null,
      pemeriksaanlab || null,
      diagnosa || null,
      terapi || null,
      norekammedis,
    ],
    (err) => {
      if (err) {
        console.error("Gagal menyimpan data rekam medis:", err);
        return res
          .status(500)
          .json({ error: "Gagal menyimpan data rekam medis" });
      }
      res.status(201).json({ message: "Rekam medis berhasil disimpan" });
    }
  );
});

app.post("/pasien", (req, res) => {
  const { nama, tanggallahir, alamat, noHp } = req.body;

  // Validasi sederhana
  if (!nama || !tanggallahir || !alamat || !noHp) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }

  const sqlQuery = `
    INSERT INTO Pasien (nama, tanggallahir, alamat, noHp)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sqlQuery, [nama, tanggallahir, alamat, noHp], (err, result) => {
    if (err) {
      console.error("Gagal menyimpan data pasien:", err);
      return res.status(500).json({ error: "Gagal menyimpan data pasien" });
    }

    res.status(201).json({
      message: "Pasien berhasil ditambahkan",
      pasien_id: result.insertId,
    });
  });
});

// DELETE data pasien
app.delete("/pasien/:id", (req, res) => {
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

app.delete("/data/:id", (req, res) => {
  const id = req.params.id;
  const sqlQuery = `DELETE FROM rekammedis WHERE id = ${id}`;

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
  const {
    tanggal,
    keluhan,
    pemeriksaanfisik,
    pemeriksaanlab,
    diagnosa,
    terapi,
    norekammedis,
  } = req.body;

  const sqlQuery = `
    UPDATE RekamMedis SET 
      tanggal = ?, 
      keluhan = ?, 
      pemeriksaanfisik = ?, 
      pemeriksaanlab = ?, 
      diagnosa = ?, 
      terapi = ?, 
      norekammedis = ?
    WHERE id = ?
  `;

  db.query(
    sqlQuery,
    [
      tanggal,
      keluhan || null,
      pemeriksaanfisik || null,
      pemeriksaanlab || null,
      diagnosa,
      terapi,
      norekammedis,
      id,
    ],
    (err) => {
      if (err) {
        console.error("Gagal memperbarui data rekam medis:", err);
        return res
          .status(500)
          .json({ error: "Gagal memperbarui data rekam medis" });
      }
      res.status(200).json({ message: "Rekam medis berhasil diperbarui" });
    }
  );
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

// app.maxConnections = 100;
// server.setTimeout(30000);
