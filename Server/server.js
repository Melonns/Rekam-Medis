const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const data = [
  { nama: "Alvian", tanggal: "18/02/2025", deskripsi: "Tes dari backend 1" },
  { nama: "Budi", tanggal: "18/02/2025", deskripsi: "Tes dari backend 2" },
  { nama: "Citra", tanggal: "18/02/2025", deskripsi: "Tes dari backend 3" }
];

app.get("/api/data", (req, res) => {
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
