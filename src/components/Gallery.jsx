import React, { useState } from "react";
import gallery from "../data/gallery.json";
import ProjectCard from "./ProjectCard";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Gallery() {
  const CATEGORIES = ["Аватарки", "Превью", "Баннеры"];
  const [activeCategory, setActiveCategory] = useState("Аватарки");

  const filtered = gallery.filter((p) => p.category === activeCategory);

  return (
    <div className="card">
      <h3>Галерея работ</h3>
      <div className="muted">Выберите категорию и листайте свайпом</div>

      {/* Фильтры категорий */}
      <div className="category-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={"tab-btn" + (activeCategory === cat ? " tab-btn-active" : "")}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Свайп проектов */}
      <div className="swiper">
        <Swiper spaceBetween={12} slidesPerView={"auto"}>
          {filtered.map((p) => (
            <SwiperSlide key={p.id} style={{ width: 320 }}>
              <ProjectCard project={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
