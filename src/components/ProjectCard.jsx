import React from "react";

export default function ProjectCard({ project }) {
  return (
    <div className="card">
      <img src={project.img} alt={project.title} className="project-img" />
      <h4>{project.title}</h4>
      <p className="muted">{project.description}</p>
      <button className="primary-btn wide">Подробнее</button>
    </div>
  );
}
