import React, { useState } from 'react';
import gallery from '../data/gallery.json';
import ProjectCard from './ProjectCard';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function Gallery() {
  const [category, setCategory] = useState('avatars'); // default category

  const categories = [
    { id: 'avatars', label: 'Аватарки' },
    { id: 'preview', label: 'Превью' },
    { id: 'banners', label: 'Баннеры' },
  ];

  const filteredGallery = gallery.filter(item => item.category === category);

  return (
    <div className="card">
      <h3>Галерея работ</h3>
      <div className="muted">Листай свайпом — нажми «Подробнее» для кейса</div>

      {/* Категории */}
      <div className="row" style={{ margin: '12px 0' }}>
        {categories.map(c => (
          <button
            key={c.id}
            className="btn"
            style={{
              opacity: category === c.id ? 1 : 0.6,
            }}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Свайп */}
      <div className="swiper">
        <Swiper spaceBetween={12} slidesPerView={'auto'}>
          {filteredGallery.map(p => (
            <SwiperSlide key={p.id} style={{ width: 320 }}>
              <ProjectCard project={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
