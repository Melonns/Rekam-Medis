import React, { useState } from "react";
import { format } from "date-fns";
import "./Card.css";

const Card = ({
  id,
  nama,
  tanggallahir,
  alamat,
  noHp,
  rekamMedis = [],
  onEdit,
  onDelete,
  onAddRekamMedis,
}) => {
  const [showRekamMedis, setShowRekamMedis] = useState(false);
  const [editRekamMedis, setEditRekamMedis] = useState(null);
  const [showRekamModal, setShowRekamModal] = useState(false);
  const [editRekamId, setEditRekamId] = useState(null);
  const [modeEdit, setModeEdit] = useState(false);

  const handleSubmitRekamMedis = () => {
    const {
      id_pasien,
      tanggal,
      keluhan,
      pemeriksaanfisik,
      pemeriksaanlab,
      diagnosa,
      terapi,
      norekammedis,
    } = newRekam;

    if (
      !id_pasien ||
      !tanggal ||
      !keluhan ||
      !diagnosa ||
      !terapi ||
      !norekammedis
    ) {
      alert("Field wajib belum diisi!");
      return;
    }

    const url = modeEdit
      ? `http://localhost:3000/data/${editRekamId}`
      : `/api/rekammedis`;

    const method = modeEdit ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRekam),
    })
      .then((res) => res.json())
      .then(() => {
        setShowRekamModal(false);
        setNewRekam({
          id_pasien: id,
          tanggal: "",
          keluhan: "",
          pemeriksaanfisik: "",
          pemeriksaanlab: "",
          diagnosa: "",
          terapi: "",
          norekammedis: "",
        });
        setEditRekamId(null);
        setModeEdit(false);
        window.location.reload(); // atau panggil props fetchData jika ada
      })
      .catch((err) => console.error("❌ Gagal simpan rekam medis:", err));
  };

  const [newRekam, setNewRekam] = useState({
    id_pasien: id,
    tanggal: "",
    keluhan: "",
    pemeriksaanfisik: "",
    pemeriksaanlab: "",
    diagnosa: "",
    terapi: "",
    norekammedis: "",
  });

  const handleEditRekamMedis = (rekamMedis, pasienId) => {
    setNewRekam({
      id_pasien: pasienId,
      tanggal: rekamMedis.tanggal.split("T")[0], // agar sesuai input type="date"
      keluhan: rekamMedis.keluhan,
      pemeriksaanfisik: rekamMedis.pemeriksaanfisik,
      pemeriksaanlab: rekamMedis.pemeriksaanlab,
      diagnosa: rekamMedis.diagnosa,
      terapi: rekamMedis.terapi,
      norekammedis: rekamMedis.norekammedis,
    });
    setEditRekamId(rekamMedis.id); // simpan ID rekam medis
    setModeEdit(true);
    setShowRekamModal(true);
  };

  const handleUpdateRekamMedis = () => {
    const {
      id,
      pasienId,
      tanggal,
      keluhan,
      pemeriksaanfisik,
      pemeriksaanlab,
      diagnosa,
      terapi,
      norekammedis,
    } = editRekamMedis;

    if (!tanggal || !norekammedis) {
      alert("Tanggal dan No. Rekam Medis wajib diisi!");
      return;
    }

    const formattedTanggal = new Date(tanggal).toISOString().split("T")[0];

    const updatedData = {
      id_pasien: pasienId,
      tanggal: formattedTanggal,
      keluhan,
      pemeriksaanfisik,
      pemeriksaanlab,
      diagnosa,
      terapi,
      norekammedis,
    };

    fetch(`/api/data/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then(() => {
        fetchData();
        setShowModal(false);
        setEditRekamMedis(null);
      })
      .catch((err) => console.error("❌ Gagal update:", err));
  };

  const handleDeleteRekamMedis = (rekamId) => {
    const confirm = window.confirm("Yakin ingin menghapus rekam medis ini?");
    if (!confirm) return;

    fetch(`http://localhost:3000/data/${rekamId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        window.location.reload();
      })
      .catch((err) => console.error("❌ Gagal hapus:", err));
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
      {showRekamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">
              {modeEdit
                ? `Edit Rekam Medis untuk ${nama}`
                : `Tambah Rekam Medis untuk ${nama}`}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitRekamMedis(); // dipanggil saat Simpan
              }}
              className="space-y-3"
            >
              {/* Tanggal */}
              <label>Tanggal</label>
              <input
                type="date"
                name="tanggal"
                value={newRekam.tanggal}
                onChange={(e) =>
                  setNewRekam({ ...newRekam, tanggal: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />

              {/* Keluhan */}
              <label>Keluhan</label>
              <input
                type="text"
                name="keluhan"
                placeholder="Keluhan"
                value={newRekam.keluhan}
                onChange={(e) =>
                  setNewRekam({ ...newRekam, keluhan: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />

              {/* Pemeriksaan Fisik */}
              <label>Pemeriksaan Fisik</label>
              <textarea
                name="pemeriksaanfisik"
                placeholder="Pemeriksaan Fisik"
                value={newRekam.pemeriksaanfisik}
                onChange={(e) =>
                  setNewRekam({ ...newRekam, pemeriksaanfisik: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />

              {/* Pemeriksaan Lab */}
              <label>Pemeriksaan Lab</label>
              <textarea
                name="pemeriksaanlab"
                placeholder="Pemeriksaan Laboratorium"
                value={newRekam.pemeriksaanlab}
                onChange={(e) =>
                  setNewRekam({ ...newRekam, pemeriksaanlab: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />

              {/* Diagnosa */}
              <label>Diagnosa</label>
              <input
                type="text"
                name="diagnosa"
                placeholder="Diagnosa"
                value={newRekam.diagnosa}
                onChange={(e) =>
                  setNewRekam({ ...newRekam, diagnosa: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />

              {/* Terapi */}
              <label>Terapi</label>
              <input
                type="text"
                name="terapi"
                placeholder="Terapi"
                value={newRekam.terapi}
                onChange={(e) =>
                  setNewRekam({ ...newRekam, terapi: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />

              {/* No. Rekam Medis */}
              <label>No Rekam Medis</label>
              <input
                type="text"
                name="norekammedis"
                placeholder="No. Rekam Medis"
                value={newRekam.norekammedis}
                onChange={(e) =>
                  setNewRekam({ ...newRekam, norekammedis: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />

              {/* Tombol */}
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRekamModal(false);
                    setModeEdit(false);
                    setEditRekamId(null);
                    setNewRekam({
                      id_pasien: id,
                      tanggal: "",
                      keluhan: "",
                      pemeriksaanfisik: "",
                      pemeriksaanlab: "",
                      diagnosa: "",
                      terapi: "",
                      norekammedis: "",
                    });
                  }}
                  className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="card-content">
          <h2 className="text-xl font-bold">{nama}</h2>
          <p className="text-sm text-gray-600">Tanggal Lahir: {tanggallahir}</p>
          <p className="text-sm text-gray-600">Alamat: {alamat}</p>
          <p className="text-sm text-gray-600">No HP: {noHp}</p>
        </div>
        <div className="text-right">
          <button
            onClick={() => setShowRekamMedis(!showRekamMedis)}
            className="text-sm text-blue-600 hover:underline mr-3"
          >
            {showRekamMedis ? "Sembunyikan" : "Lihat Rekam Medis"}
          </button>
          <div className="mt-2 space-y-2">
            <button
              className="bg-blue-500 text-white rounded-md px-3 py-1 mr-2 btn-edit hover:bg-blue-600"
              onClick={() => onEditRekamMedis(rm)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white rounded-md px-3 py-1 btn-delete hover:bg-red-600"
              onClick={() => onDelete(id)}
            >
              Delete
            </button>
            <button
              className="bg-green-500 text-white rounded-md ml-2 px-3 py-1 hover:bg-green-600"
              onClick={() => onAddRekamMedis(id)} // pastikan fungsi ini disediakan via props
            >
              + Rekam Medis
            </button>
          </div>
        </div>
      </div>

      {showRekamMedis && (
        <div className="mt-4 bg-white border-t pt-3">
          <h4 className="text-md font-semibold mb-2">Rekam Medis:</h4>
          {rekamMedis && rekamMedis.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {rekamMedis.map((rm, idx) => (
                <div key={idx} className="bg-gray-100 p-3 rounded mb-2">
                  <p>
                    <strong>Tanggal:</strong>{" "}
                    {rm.tanggal
                      ? format(new Date(rm.tanggal), "dd-MM-yyyy")
                      : "-"}
                  </p>
                  <p>
                    <strong>No. Rekam Medis:</strong> {rm.norekammedis}
                  </p>
                  <p>
                    <strong>Keluhan:</strong> {rm.keluhan}
                  </p>
                  <p>
                    <strong>Pemeriksaan Fisik:</strong> {rm.pemeriksaanfisik}
                  </p>
                  <p>
                    <strong>Pemeriksaan Lab:</strong> {rm.pemeriksaanlab}
                  </p>
                  <p>
                    <strong>Diagnosa:</strong> {rm.diagnosa}
                  </p>
                  <p>
                    <strong>Terapi:</strong> {rm.terapi}
                  </p>

                  {/* Tombol Aksi */}
                  <div className="flex gap-2 mt-2">
                    <button
                      className="text-sm text-blue-600 underline"
                      onClick={() => handleEditRekamMedis(rm, id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm text-red-600 underline"
                      onClick={() => handleDeleteRekamMedis(rm.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">
              Belum ada rekam medis.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
