import { useEffect, useState } from "react";
import Card from "./Card";
import { format } from 'date-fns';

function Utama() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(""); // Panggil fetchData dengan query kosong saat awal
    fetch("http://localhost:3000/test")
  .then(res => res.json())
  .then(data => console.log(data));
  }, []);

  const fetchData = (query) => {
    console.log("fetchData dipanggil dengan query:", query); // Tambahkan ini
    setLoading(true);
    fetch(`http://localhost:3000/data?search=${query}`)
      .then((res) => res.json())
      .then((result) => {
        console.log("Data dari backend:", result); // Tambahkan ini
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

  return (
    <main>
      <h2>Data Pasien</h2>
      <input
        type="text"
        placeholder="Cari Nama"
        value={search}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeyDown} // Pindahkan ke onKeyDown
      />
      <div>
        {loading ? (
          <p>Sedang memuat data...</p>
        ) : data.length > 0 ? (
          data.map((item, index) => {
            const formattedDate = format(new Date(item.tanggal), 'dd-MMMM-yyyy');
            return (
              <Card
                key={index}
                nama={item.nama}
                tanggal={formattedDate}
                deskripsi={item.deskripsi}
              />
            );
          })
        ) : (
          <p>Data tidak ditemukan.</p> // Tambahkan pesan jika data kosong setelah pencarian
        )}
      </div>
    </main>
  );
}

export default Utama;