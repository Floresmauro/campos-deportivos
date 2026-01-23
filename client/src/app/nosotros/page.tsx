"use client";

import { Users, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Header */}
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">Sobre Nosotros</h1>
          <p className="page-subtitle">13 años cuidando el deporte argentino.</p>
        </div>
      </header>

      {/* Mission/Vision */}
      <section className="section">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <Target size={40} className="mv-icon" />
              <h3>Nuestra Misión</h3>
              <p>
                Proveer soluciones integrales de mantenimiento y gestión deportiva con los más altos estándares de calidad,
                garantizando que cada evento se desarrolle en una superficie perfecta.
              </p>
            </div>
            <div className="mv-card">
              <Users size={40} className="mv-icon" />
              <h3>Nuestra Visión</h3>
              <p>
                Ser la empresa referente en Latinoamérica en tecnología y gestión de campos deportivos,
                innovando constantemente en procesos y capacitación humana.
              </p>
            </div>
            <div className="mv-card">
              <Heart size={40} className="mv-icon" />
              <h3>Nuestros Valores</h3>
              <p>
                Compromiso, Profesionalismo, Pasión por el detalle y Respeto por el medio ambiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="section history-section">
        <div className="container">
          <div className="history-content">
            <h2>Nuestra Historia</h2>
            <p>
              "Campos Deportivos" nació con la convicción de que el fútbol argentino merece escenarios de clase mundial.
              Fundada por expertos en agronomía y gestión deportiva, comenzamos trabajando con clubes de ascenso
              y rápidamente ganamos la confianza de las instituciones más grandes del país.
            </p>
            <p>
              Hoy, administramos más de 50 predios, desde estadios de primera división hasta polideportivos municipales,
              llevando nuestra experiencia a cada rincón donde rueda una pelota.
            </p>
          </div>
          <div className="history-image">
            {/* Placeholder code for user */}
            <div className="image-placeholder">
              <p>Colocar imagen aquí: public/images/team/historia.jpg</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
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

        .mv-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .mv-card {
          background: var(--surface);
          padding: 2.5rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          text-align: center;
          transition: transform 0.2s;
          border: 1px solid var(--border);
        }

        .mv-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
        }

        .mv-icon {
          color: var(--accent);
          margin-bottom: 1.5rem;
        }

        .history-section {
          background-color: var(--background);
        }

        .history-content h2 {
          margin-bottom: 2rem;
        }

        .history-content p {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        .image-placeholder {
          width: 100%;
          height: 300px;
          background-color: var(--surface);
          border: 2px dashed var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
}
