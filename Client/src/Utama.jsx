import { useEffect, useState } from "react";
import Card from "./Card";

function Utama() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("/api/data")
            .then((res) => res.json())
            .then((result) => setData(result))
            .catch((err) => console.error("Error fetching data:", err));
    }, []);

    return (
        <main>
            <h2>Data dari Backend</h2>
            <div>
                {data.length > 0 ? (
                    data.map((item, index) => (
                        <Card 
                            key={index}
                            nama={item.nama}
                            tanggal={item.tanggal}
                            deskripsi={item.deskripsi}
                        />
                    ))
                ) : (
                    <p>Loading data...</p>
                )}
            </div>
        </main>
    );
}

export default Utama;
