"use client";

import { MapPin } from 'lucide-react';

export default function PortfolioPage() {
  const projects = [
    { name: "Gestión Racing Club", location: "Avellaneda, Buenos Aires", img: "racing.jpg", desc: "Mantenimiento integral y tratamiento de césped en Estadio Principal y Predio Tita Mattiussi." },
    { name: "Mantenimiento Banfield", location: "Banfield, Buenos Aires", img: "banfield.jpg", desc: "Gestión técnica de superficies deportivas aplicadas al fútbol de alto rendimiento." },
    { name: "Renovación Defensa y Justicia", location: "Florencio Varela, Buenos Aires", img: "defensa.jpg", desc: "Planificación y ejecución de resembrado y optimización de sistemas de riego." },
    { name: "Soporte Argentinos Juniors", location: "La Paternal, CABA", img: "argentinos.jpg", desc: "Control de calidad y mantenimiento preventivo de superficie profesional." },
    { name: "Logística Polideportivo Chacarita", location: "San Martín, Buenos Aires", img: "chacarita.jpg", desc: "Coordinación de personal y maquinaria para mantenimiento multideporte." },
  ];

  return (
    <div className="portfolio-page">
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">Nuestros Trabajos</h1>
          <p className="page-subtitle">Experiencia y resultados en los predios más exigentes del país.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="portfolio-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="image-placeholder-card">
                  <span className="placeholder-text">Imagen: {project.img}</span>
                </div>
                <div className="project-content">
                  <h3>{project.name}</h3>
                  <div className="project-location">
                    <MapPin size={16} />
                    <span>{project.location}</span>
                  </div>
                  <p>{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .portfolio-page {
          min-height: 100vh;
        }

        .page-header {
          background: linear-gradient(135deg, #1a472a 0%, #2d5a27 50%, #1a3d1a 100%);
          color: white;
          padding: 4rem 0;
          text-align: center;
        }

        .page-title {
          font-size: 3rem;
          color: white !important;
          margin-bottom: 1rem;
        }

        .page-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          color: white;
        }

        .section {
          padding: 5rem 0;
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .project-card {
          background: var(--surface);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s;
          border: 1px solid var(--border);
        }

        .project-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
        }

        .image-placeholder-card {
          width: 100%;
          height: 200px;
          background-color: var(--background);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border);
        }

        .project-content {
          padding: 1.5rem;
        }

        .project-content h3 {
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
        }

        .project-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--secondary);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .project-content p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
