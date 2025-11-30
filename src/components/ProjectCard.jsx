import React from "react";

export default function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <img className="project-img" src={project.image} alt={project.title} />
      <h4>{project.title}</h4>
      <p className="muted">{project.description}</p>
      <p className="muted">Срок: {project.time}</p>
    </div>
  );
}
