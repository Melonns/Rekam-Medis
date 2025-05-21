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

  const [newPasien, setNewPasien] = useState({
    nama: "",
    tanggal: "",
    deskripsi: "",
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
    fetch(`/api/data?${params.toString()}`)
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

  const handleEdit = (id) => {
    const selectedData = data.find((item) => item.id === id);
    setEditData(selectedData);
  };

  const handleDelete = (id) => {
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini?"
    );
    if (isConfirmed) {
      fetch(`api/data/delete/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => {
          setData(data.filter((item) => item.id !== id));
          refreshStats();
        })
        .catch((err) => console.error("Gagal hapus:", err));
    }
  };

 const handleUpdate = () => {
  // Ambil yyyy-mm-dd langsung tanpa time-zone offset
  const dateObj = new Date(editData.tanggal);
  const formattedTanggal = [
    dateObj.getFullYear(),
    String(dateObj.getMonth() + 1).padStart(2, '0'),
    String(dateObj.getDate()).padStart(2, '0'),
  ].join('-');

  const updatedData = {
    ...editData,
    tanggal: formattedTanggal, // ⬅️ ini pasti sesuai lokal
  };

  fetch(`api/data/edit/${editData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  })
    .then((res) => res.json())
    .then(() => {
      fetchData("");
      setEditData(null);
    })
    .catch((err) => console.error("Gagal update:", err));
};



  const handleAddPasienChange = (e) => {
    const { name, value } = e.target;
    setNewPasien((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPasien = () => {
    const { nama, tanggal, deskripsi } = newPasien;

    console.log("📩 Memulai handleAddPasien...");

    if (!nama || !deskripsi) {
      alert("Semua field harus diisi!");
      return;
    }

    const dateObj = tanggal ? new Date(tanggal) : new Date();
    const formattedTanggal = [
      dateObj.getFullYear(),
      String(dateObj.getMonth() + 1).padStart(2, "0"),
      String(dateObj.getDate()).padStart(2, "0"),
    ].join("-");

    const pasienData = {
      nama,
      tanggal: formattedTanggal,
      deskripsi,
    };

    console.log("📤 Mengirim data:", pasienData);

    fetch("api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pasienData),
    })
      .then((res) => res.json())
      .then(() => {
        console.log("✅ Data berhasil disimpan. Fetch data & stats...");

        refreshStats();
        fetchData("");

        setNewPasien({ nama: "", tanggal: "", deskripsi: "" });
        setShowModal(false);
      })
      .catch((err) => {
        console.error("❌ Gagal tambah data:", err);
      });
  };

  return (
    <main className="bg-white min-h-screen">
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
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
              <h3 className="text-xl font-bold mb-4">Tambah Pasien Baru</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pasien
                </label>
                <input
                  type="text"
                  name="nama"
                  value={newPasien.nama}
                  onChange={handleAddPasienChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  placeholder="Masukkan nama pasien"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Pemeriksaan
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={newPasien.tanggal}
                  onChange={handleAddPasienChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi / Diagnosis
                </label>
                <input
                  type="text"
                  name="deskripsi"
                  value={newPasien.deskripsi}
                  onChange={handleAddPasienChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  placeholder="Masukkan deskripsi"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleAddPasien}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Simpan
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setNewPasien({ nama: "", tanggal: "", deskripsi: "" });
                  }}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
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
            <div class="text-green-600 font-semibold">Pasien Hari Ini</div>
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
            data.map((item, index) => {
              const formattedDate = format(
                new Date(item.tanggal),
                "dd-MMMM-yyyy"
              );
              return (
                <Card
                  key={index}
                  id={item.id}
                  nama={item.nama}
                  tanggal={formattedDate}
                  deskripsi={item.deskripsi}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              );
            })
          ) : (
            <p>Data tidak ditemukan.</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default Utama;