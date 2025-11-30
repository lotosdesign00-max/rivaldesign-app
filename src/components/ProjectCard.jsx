import React from "react";

export default function ProjectCard({ project }) {
  return (
    <div className="card">
      <img src={project.image} alt={project.title} className="project-img"/>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
    </div>
  );
}
