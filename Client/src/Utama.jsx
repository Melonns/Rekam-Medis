import { useEffect, useState } from "react";
import Card from "./Card";
import { format } from 'date-fns';

function Utama() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [newPasien, setNewPasien] = useState({
    nama: "",
    tanggal: "",
    deskripsi: ""
  });

  useEffect(() => {
    fetchData(""); // Panggil fetchData dengan query kosong saat awal
  }, []);

  const fetchData = (query) => {
    console.log("fetchData dipanggil dengan query:", query);
    setLoading(true);
    fetch(`api/data?search=${query}`)
      .then((res) => res.json())
      .then((result) => {
        console.log("Data dari backend:", result);
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchData(search);
    }
  };

  const handleEdit = (id) => {
    const selectedData = data.find(item => item.id === id);
    setEditData(selectedData);
  };

  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (isConfirmed) {
      fetch(`api/data/delete/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
          setData(data.filter(item => item.id !== id));
        })
        .catch(err => console.error("Gagal hapus:", err));
    }
  };

  const handleUpdate = () => {
    fetch(`api/data/edit/${editData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editData)
    })
    .then(res => res.json())
    .then(() => {
      fetchData("");
      setEditData(null); // Sembunyikan form edit setelah update
    })
    .catch(err => console.error("Gagal update:", err));
  };

  const handleAddPasienChange = (e) => {
    const { name, value } = e.target;
    setNewPasien(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPasien = () => {
    const { nama, tanggal, deskripsi } = newPasien;

    if (!nama || !tanggal || !deskripsi) {
      alert("Semua field harus diisi!");
      return;
    }

    fetch("api/data", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPasien)
    })
    .then(res => res.json())
    .then(() => {
      // Setelah data berhasil ditambahkan, reload data
      fetchData("");
      setNewPasien({ nama: "", tanggal: "", deskripsi: "" }); // Reset form
    })
    .catch(err => console.error("Gagal tambah data:", err));
  };
  

  return (
    <main className="">
      <h2 className="mb-2">Data Pasien</h2>
      <input className="border-solid border-2 border-gray-300 rounded-md p-2 mb-4"
        type="text"
        placeholder="Cari Nama"
        value={search}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeyDown}
      />

      {/* Form Add Pasien */}
      <div>
        <h3 className="mb-2 ">Tambah Pasien</h3>
        <input className="border-solid border-2 border-gray-300 rounded-md p-2 mr-4"
          type="text"
          name="nama"
          placeholder="Nama Pasien"
          value={newPasien.nama}
          onChange={handleAddPasienChange}
        />
        <input className="border-solid border-2 border-gray-300 rounded-md p-2 mr-4"
          type="date"
          name="tanggal"
          value={newPasien.tanggal}
          onChange={handleAddPasienChange}
        />
        <textarea className="border border-gray-300 rounded-md p-2 h-[40px] mt-2 w-full resize-none"
          name="deskripsi"
          placeholder="Deskripsi"
          value={newPasien.deskripsi}
          onChange={handleAddPasienChange}
        />
        <button className="bg-[#10B981] border-solid border-2 border-gray-500 rounded-md p-2" onClick={handleAddPasien}>Tambah Pasien</button>
      </div>

      {/* Form Edit Data */}
      {editData && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
      <h3 className="text-xl font-bold mb-4">Edit Data Pasien</h3>
      <input
        className="w-full border border-gray-300 rounded-md p-2 mb-4"
        type="text"
        value={editData.nama}
        onChange={(e) => setEditData({ ...editData, nama: e.target.value })}
      />
      <input
        className="w-full border border-gray-300 rounded-md p-2 mb-4"
        type="date"
        value={editData.tanggal}
        onChange={(e) => setEditData({ ...editData, tanggal: e.target.value })}
      />
      <textarea
        className="w-full border border-gray-300 rounded-md p-2 mb-4 resize-none h-[40px]"
        value={editData.deskripsi}
        onChange={(e) => setEditData({ ...editData, deskripsi: e.target.value })}
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


      <div>
        {loading ? (
          <p>Sedang memuat data...</p>
        ) : data.length > 0 ? (
          data.map((item, index) => {
            const formattedDate = format(new Date(item.tanggal), 'dd-MMMM-yyyy');
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
    </main>
  );
}

export default Utama;
