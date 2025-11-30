import React from "react";
import gallery from "../data/gallery.json";
import ProjectCard from "./ProjectCard";

export default function Gallery() {
  return (
    <div className="card">
      <h2>Галерея работ</h2>
      <p className="muted">Здесь будут твои работы: логотипы, баннеры, постеры и т.д.</p>
      <div className="projects">
        {gallery.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
