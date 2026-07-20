// src/components/AddAlbumForm.jsx
import { useState } from "react";

export default function AddAlbumForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "", bg_color: "#ffffff", text_color: "#000000", border_color: "#000000",
  });
  const [audioFile, setAudioFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = {
    success: (message) => {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        icon: 'success',
        title: message,
        position: 'center',
        customClass: {
          popup: 'folk-folklore',
          title: 'font-folkore',
        },
        showClass: { popup: 'animate__animated animate__zoomInDown' },
        hideClass: { popup: 'animate__animated animate__zoomOutDown' }
      });
    },
    error: (message) => {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: message,
        position: 'center',
        customClass: {
          popup: 'folk-folklore',
          title: 'font-folkore',
        },
        showClass: { popup: 'animate__animated animate__zoomInDown' },
        hideClass: { popup: 'animate__animated animate__zoomOutDown' }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    formData.append("audio", audioFile);

    try {
      const res = await fetch('theerasstore-production.up.railway.app/api/albums', {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Album berhasil ditambahkan!");
        setForm({ name: "", bg_color: "#ffffff", text_color: "#000000", border_color: "#000000" });
        setAudioFile(null);
        onSuccess?.();
      } else {
        alert("Gagal menambahkan album");
      }
    } catch (err) {
      toast.error(err);
      alert("Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-folklore">
      <input
        type="text" placeholder="Nama Album"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 rounded w-full"
        required
      />
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          Background: <input type="color" value={form.bg_color}
            onChange={(e) => setForm({ ...form, bg_color: e.target.value })} />
        </label>
        <label className="flex items-center gap-2">
          Text: <input type="color" value={form.text_color}
            onChange={(e) => setForm({ ...form, text_color: e.target.value })} />
        </label>
        <label className="flex items-center gap-2">
          Border: <input type="color" value={form.border_color}
            onChange={(e) => setForm({ ...form, border_color: e.target.value })} />
        </label>
      </div>
      <input
        type="file" accept="audio/*"
        onChange={(e) => setAudioFile(e.target.files[0])}
        required
      />
      <button type="submit" disabled={submitting} className="bg-black text-white px-4 py-2 rounded">
        {submitting ? "Mengunggah..." : "Tambah Album"}
      </button>
    </form>
  );
}
