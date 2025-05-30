import { useEffect, useState } from "react";
import Card from "./Card";
import { format } from "date-fns";

function Utama() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ total: 0, hari_ini: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTanggal, setSearchTanggal] = useState("");
  const [showRekamMedisModal, setShowRekamMedisModal] = useState(false);
  const [editRekamMedis, setEditRekamMedis] = useState(null); // null = mode tambah
  const [newRekamMedis, setNewRekamMedis] = useState({
    id_pasien: "",
    tanggal: "",
    keluhan: "",
    pemeriksaanfisik: "",
    pemeriksaanlab: "",
    diagnosa: "",
    terapi: "",
    norekammedis: "",
  });

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [newPasien, setNewPasien] = useState({
    nama: "",
    tanggallahir: "",
    alamat: "",
    noHp: "",
  });

  const [showForm, setShowForm] = useState(false);

  const refreshStats = () => {
    console.log("🔁 Memanggil refreshStats()");
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        console.log("📊 Data statistik dari server:", data);
        setStats(data);
      })
      .catch((err) => {
        console.error("❌ Gagal ambil statistik:", err);
      });
  };

  // useEffect(() => {
  //   fetch("api/stats")
  //     .then((res) => res.json())
  //     .then((data) => setStats(data))
  //     .catch((err) => console.error("Gagal ambil statistik:", err));
  // }, []);

  useEffect(() => {
    refreshStats();
    fetchData(""); // Panggil fetchData dengan query kosong saat awal
  }, []);

  const fetchData = (search = "", tanggal = "") => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (tanggal) params.append("tanggal", tanggal);

    console.log("fetchData dipanggil dengan:", params.toString());

    setLoading(true);
    fetch(`/api/pasien?${params.toString()}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  };

  const handleTanggalChange = (value) => {
    setSearchTanggal(value);
    fetchData(search, value); // ← search adalah state nama
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchData(value, searchTanggal); // ← tanggal adalah state tanggal
  };

  const handleResetFilter = () => {
    setSearch("");
    setSearchTanggal("");
    fetchData("", ""); // ambil data default (misalnya hari ini saja)
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchData(search);
    }
  };

  const handleDelete = (id) => {
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini?"
    );
    if (isConfirmed) {
      fetch(`/api/pasien/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => {
          setData(data.filter((item) => item.id !== id));
          refreshStats();
        })
        .catch((err) => console.error("Gagal hapus:", err));
    }
  };

  const handleUpdate = () => {
    const { nama, tanggallahir, alamat, noHp, id } = editData;

    if (!nama || !tanggallahir || !alamat || !noHp) {
      alert("Semua field harus diisi!");
      return;
    }

    const formattedTanggal = new Date(tanggallahir).toISOString().split("T")[0];

    const updatedPasien = {
      nama,
      tanggallahir: formattedTanggal,
      alamat,
      noHp,
    };

    fetch(`/api/pasien/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPasien),
    })
      .then((res) => res.json())
      .then(() => {
        fetchData("");
        setEditData(null);
      })
      .catch((err) => console.error("Gagal update pasien:", err));
  };

  const handleAddPasienChange = (e) => {
    const { name, value } = e.target;
    setNewPasien((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPasien = () => {
    const { nama, tanggallahir, alamat, noHp } = newPasien;

    console.log("📩 Memulai handleAddPasien...");

    // Validasi input
    if (!nama || !tanggallahir || !alamat || !noHp) {
      alert("Semua field harus diisi!");
      return;
    }

    // Format tanggal ke YYYY-MM-DD
    const dateObj = new Date(tanggallahir);
    const formattedTanggal = [
      dateObj.getFullYear(),
      String(dateObj.getMonth() + 1).padStart(2, "0"),
      String(dateObj.getDate()).padStart(2, "0"),
    ].join("-");

    const pasienData = {
      nama,
      tanggallahir: formattedTanggal,
      alamat,
      noHp,
    };

    console.log("📤 Mengirim data pasien:", pasienData);

    fetch("/api/pasien", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pasienData),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("✅ Pasien berhasil ditambahkan:", result);
        refreshStats();
        fetchData("");
        setNewPasien({ nama: "", tanggallahir: "", alamat: "", noHp: "" });
        setShowModal(false);
      })
      .catch((err) => {
        console.error("❌ Gagal tambah pasien:", err);
      });
  };

  const handleSubmitRekamMedis = () => {
    const {
      id,
      id_pasien,
      tanggal,
      keluhan,
      pemeriksaanfisik,
      pemeriksaanlab,
      diagnosa,
      terapi,
      norekammedis,
    } = newRekamMedis;

    if (
      !id_pasien ||
      !tanggal ||
      !keluhan ||
      !pemeriksaanfisik ||
      !diagnosa ||
      !terapi ||
      !norekammedis
    ) {
      alert("Semua field wajib diisi!");
      return;
    }

    const rekamData = {
      id_pasien,
      tanggal,
      keluhan,
      pemeriksaanfisik,
      pemeriksaanlab,
      diagnosa,
      terapi,
      norekammedis,
    };

    const url = id ? `/api/data/${id}` : "/api/data";
    const method = id ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rekamData),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(
          id
            ? "✅ Rekam medis berhasil diperbarui:"
            : "✅ Rekam medis berhasil ditambahkan:",
          result
        );
        setShowRekamMedisModal(false);
        setNewRekamMedis({}); // reset form
        fetchData(); // refresh data
      })
      .catch((err) => {
        console.error("❌ Gagal simpan rekam medis:", err);
      });
  };

  const handleUpdateRekamMedis = (rekamMedis) => {
    setNewRekamMedis(rekamMedis);
    setShowRekamMedisModal(true);
  };

  const handleEdit = (id) => {
    const selectedData = data.find((item) => item.id === id);
    setEditData(selectedData); // ← ini akan munculkan modal di Utama.jsx
  };

  const handleDeleteRekamMedis = (idRekam) => {
    const konfirmasi = confirm("Yakin ingin menghapus data ini?");
    if (!konfirmasi) return;

    fetch(`/api/data/${idRekam}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        console.log("🗑️ Rekam medis berhasil dihapus");
        fetchData(); // Refresh data
      })
      .catch((err) => console.error("❌ Gagal hapus rekam medis:", err));
  };

  const handleAddRekamMedis = (idPasien) => {
    setNewRekamMedis({
      id_pasien: idPasien,
      tanggal: "",
      keluhan: "",
      pemeriksaanfisik: "",
      pemeriksaanlab: "",
      diagnosa: "",
      terapi: "",
      norekammedis: "",
    });
    setShowRekamMedisModal(true);
  };

  return (
    <main className="bg-white min-h-screen px-6 py-4">
      {showRekamMedisModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-lg shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-blue-700 mb-6 text-center">
              Tambah Rekam Medis
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitRekamMedis();
                setShowRekamMedisModal(false); // tutup modal sementara
              }}
              className="space-y-4"
            >
              {/* Tanggal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Pemeriksaan
                </label>
                <input
                  type="date"
                  value={newRekamMedis.tanggal}
                  onChange={(e) =>
                    setNewRekamMedis({
                      ...newRekamMedis,
                      tanggal: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Keluhan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keluhan
                </label>
                <input
                  type="text"
                  value={newRekamMedis.keluhan}
                  onChange={(e) =>
                    setNewRekamMedis({
                      ...newRekamMedis,
                      keluhan: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Pemeriksaan Fisik */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pemeriksaan Fisik
                </label>
                <textarea
                  value={newRekamMedis.pemeriksaanfisik}
                  onChange={(e) =>
                    setNewRekamMedis({
                      ...newRekamMedis,
                      pemeriksaanfisik: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                ></textarea>
              </div>

              {/* Pemeriksaan Lab */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pemeriksaan Lab
                </label>
                <textarea
                  value={newRekamMedis.pemeriksaanlab}
                  onChange={(e) =>
                    setNewRekamMedis({
                      ...newRekamMedis,
                      pemeriksaanlab: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                ></textarea>
              </div>

              {/* Diagnosa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosa
                </label>
                <input
                  type="text"
                  value={newRekamMedis.diagnosa}
                  onChange={(e) =>
                    setNewRekamMedis({
                      ...newRekamMedis,
                      diagnosa: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Terapi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Terapi
                </label>
                <input
                  type="text"
                  value={newRekamMedis.terapi}
                  onChange={(e) =>
                    setNewRekamMedis({
                      ...newRekamMedis,
                      terapi: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* No. Rekam Medis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Rekam Medis
                </label>
                <input
                  type="text"
                  value={newRekamMedis.norekammedis}
                  onChange={(e) =>
                    setNewRekamMedis({
                      ...newRekamMedis,
                      norekammedis: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Tombol Aksi */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRekamMedisModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-blue-600">Rekam Medis</h1>
        <button
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            navigate("/");
          }}
          className="text-sm text-red-500 underline"
        >
          Logout
        </button>
      </div>
      {/* <h2 className="mb-2">Data Pasien</h2> */}
      {/* <input
        className="border-solid border-2 border-gray-300 rounded-md p-2 mb-4"
        type="text"
        placeholder="Cari Nama"
        value={search}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeyDown}
      /> */}

      {/* Data Sekilas */}
      <div class="bg-white mb-5 border border-gray-200 shadow-md rounded-lg p-6">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-2xl font-semibold text-gray-800">
            Rekam Medis Pasien
          </h2>
          <button
            onClick={() => setShowModal(true)}
            class="bg-blue-600 hover:bg-blue-700 text-white text-sm mr-2 px-4 py-2 rounded-lg shadow-sm transition"
          >
            + Tambah Pasien Baru
          </button>
        </div>
        <p class="text-gray-500 mb-6">Kelola dan telusuri rekam medis pasien</p>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md border border-gray-200">
              <h3 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                Tambah Pasien Baru
              </h3>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddPasien();
                }}
              >
                {/* Nama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Pasien
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={newPasien.nama}
                    onChange={handleAddPasienChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Contoh: Siti Aminah"
                  />
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    name="tanggallahir"
                    value={newPasien.tanggallahir}
                    onChange={handleAddPasienChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Alamat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <input
                    type="text"
                    name="alamat"
                    value={newPasien.alamat}
                    onChange={handleAddPasienChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Contoh: Jl. Merdeka No. 45"
                  />
                </div>

                {/* Nomor HP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. HP
                  </label>
                  <input
                    type="text"
                    name="noHp"
                    value={newPasien.noHp}
                    onChange={handleAddPasienChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Contoh: 08123456789"
                  />
                </div>

                {/* Tombol Aksi */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setNewPasien({
                        nama: "",
                        tanggallahir: "",
                        alamat: "",
                        noHp: "",
                      });
                    }}
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* <p class="text-gray-500 mb-6">Kelola dan telusuri rekam medis pasien</p> */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
          <div class="bg-blue-50 shadow-lg rounded-lg p-5">
            <div class="text-blue-600 font-semibold">Total Pasien</div>
            <div class="text-3xl font-bold text-gray-800">{stats.total}</div>
          </div>
          <div class="bg-green-50 shadow-lg rounded-lg p-5">
            <div class="text-green-600 font-semibold">Rekam Medis Hari Ini</div>
            <div class="text-3xl font-bold text-gray-800">{stats.hari_ini}</div>
          </div>
          {/* <div class="bg-yellow-50 shadow-lg rounded-lg p-5">
            <div class="text-yellow-600 font-semibold">Menunggu</div>
            <div class="text-3xl font-bold text-gray-800">3</div>
          </div> */}
        </div>
      </div>

      {/* Cari Pasien */}
      <div className="bg-white mb-5 border border-gray-200 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Cari Pasien
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Input Nama Pasien */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pasien
            </label>
            <input
              type="text"
              placeholder="Masukkan nama pasien..."
              value={search}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={handleSearchKeyDown}
              onChange={handleSearchChange}
            />
          </div>

          {/* Input Tanggal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Rekam Medis
            </label>
            <input
              type="date"
              value={searchTanggal}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const value = e.target.value;
                handleTanggalChange(value);
              }}
            />
          </div>

          {/* Tombol Reset */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilter}
              className="w-full border border-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-100 transition"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Form Add Pasien
      <div>
        <h3 className="mb-2 ">Tambah Pasien</h3>
        <input
          className="border-solid border-2 border-gray-300 rounded-md p-2 mr-4"
          type="text"
          name="nama"
          placeholder="Nama Pasien"
          value={newPasien.nama}
          onChange={handleAddPasienChange}
        />
        <input
          className="border-solid border-2 border-gray-300 rounded-md p-2 mr-4"
          type="date"
          name="tanggal"
          value={newPasien.tanggal}
          onChange={handleAddPasienChange}
        />
        <textarea
          className="border border-gray-300 rounded-md p-2 h-[40px] mt-2 w-full resize-none"
          name="deskripsi"
          placeholder="Deskripsi"
          value={newPasien.deskripsi}
          onChange={handleAddPasienChange}
        />
        <button
          className="bg-[#10B981] border-solid border-2 border-gray-500 rounded-md p-2"
          onClick={handleAddPasien}
        >
          Tambah Pasien
        </button>
      </div> */}

      {/* Form Edit Data */}
      {editData && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4">Edit Data Pasien</h3>
            <input
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
              type="text"
              value={editData.nama}
              onChange={(e) =>
                setEditData({ ...editData, nama: e.target.value })
              }
            />
            <input
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
              type="date"
              value={editData.tanggal}
              onChange={(e) =>
                setEditData({ ...editData, tanggal: e.target.value })
              }
            />
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 mb-4 resize-none h-[40px]"
              value={editData.deskripsi}
              onChange={(e) =>
                setEditData({ ...editData, deskripsi: e.target.value })
              }
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setEditData(null)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Daftar Rekam Medis
        </h2>

        <div className="flex flex-col gap-4">
          {loading ? (
            <p>Sedang memuat data...</p>
          ) : data.length > 0 ? (
            data.map((item) => (
              <Card
                key={item.id}
                id={item.id}
                nama={item.nama}
                tanggallahir={formatDate(item.tanggallahir)}
                alamat={item.alamat}
                noHp={item.noHp}
                rekamMedis={item.rekamMedis}
                onEditRekamMedis={handleUpdateRekamMedis} 
                onDelete={handleDelete}
                onAddRekamMedis={handleAddRekamMedis}
                onRefresh={() => fetchData(search, searchTanggal)}
              />
            ))
          ) : (
            <p>Data tidak ditemukan.</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default Utama;
