import { useEffect, useState } from "react";

export default function Album() {
  const [eras, setEras] = useState([]);

  useEffect(() => {
    fetch('https://theerasstore-production.up.railway.app/api/albums')
      .then((res) => res.json())
      .then((data) => setEras(data));
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {eras.map((era) => (
        <div
          key={era.id}
          className="p-6 rounded-xl border-2 text-center font-folklore"
          style={{
            backgroundColor: era.bg_color,
            color: era.text_color,
            borderColor: era.border_color,
          }}
        >
          <p className="font-bold">{era.name}</p>
          <audio controls src={era.audio_url} className="mt-3 w-full" />
        </div>
      ))}
    </div>
  );
}
