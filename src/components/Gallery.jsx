import React, { useState } from "react";
import gallery from "../data/gallery.json";
import ProjectCard from "./ProjectCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const CATEGORIES = ["Аватарки", "Превью", "Баннеры"];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

  const filteredProjects = gallery.filter(p => p.category === activeCategory);

  return (
    <div className="card">
      <h3>Галерея работ</h3>
      <div className="muted">Листай свайпом — нажми «Подробнее» для кейса</div>

      {/* Фильтры категории в виде заголовков */}
      <div style={{ display: "flex", justifyContent: "space-around", margin: "12px 0" }}>
        {CATEGORIES.map(cat => (
          <h4
            key={cat}
            style={{
              cursor: "pointer",
              borderBottom: activeCategory === cat ? "2px solid #ff3040" : "2px solid transparent",
              paddingBottom: "4px"
            }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </h4>
        ))}
      </div>

      {/* Свайп */}
      <div className="swiper">
        <Swiper spaceBetween={12} slidesPerView={"auto"}>
          {filteredProjects.map(p => (
            <SwiperSlide key={p.id} style={{ width: 320 }}>
              <ProjectCard project={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
