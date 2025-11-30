import React, { useState } from "react";
import gallery from "../data/gallery.json";
import ProjectCard from "./ProjectCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const CATEGORIES = ["Лого", "Постеры", "Баннеры"]; // добавляем категории

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

  const filteredProjects = gallery.filter(
    (p) => p.category === activeCategory
  );

  return (
    <div className="card">
      <h3>Галерея работ</h3>
      <div className="muted">Листай свайпом — нажми «Подробнее» для кейса</div>

      {/* Категории */}
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

      {/* Свайп */}
      <div className="swiper">
        <Swiper spaceBetween={12} slidesPerView={"auto"}>
          {filteredProjects.map((p) => (
            <SwiperSlide key={p.id} style={{ width: 320 }}>
              <ProjectCard project={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
