import React, { useState } from "react";
import galleryData from "../gallery.json";

export default function Gallery() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? galleryData : galleryData.filter(item => item.type === filter);

  return (
    <div>
      <h1>Галерея работ</h1>
      <div className="gallery-buttons">
        <button onClick={() => setFilter("all")}>Все</button>
        <button onClick={() => setFilter("avatar")}>Аватарки</button>
        <button onClick={() => setFilter("preview")}>Превью</button>
        <button onClick={() => setFilter("banner")}>Баннеры</button>
      </div>

      <div className="gallery-grid">
        {filtered.map((item, idx) => (
          <div key={idx} className="gallery-item">
            <img src={item.img} alt={item.text} />
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
