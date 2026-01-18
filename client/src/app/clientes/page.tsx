"use client";

import { MapPin } from 'lucide-react';

export default function ClientsPage() {
  const clients = [
    { name: "Estadio Racing Club", location: "Avellaneda, Buenos Aires", img: "racing.jpg", desc: "Mantenimiento integral del campo de juego y predio Tita Mattiussi." },
    { name: "Estadio Banfield", location: "Banfield, Buenos Aires", img: "banfield.jpg", desc: "Gestión de campo principal y canchas auxiliares." },
    { name: "Defensa y Justicia", location: "Florencio Varela, Buenos Aires", img: "defensa.jpg", desc: "Renovación completa de césped y sistema de riego." },
    { name: "Argentinos Juniors", location: "La Paternal, CABA", img: "argentinos.jpg", desc: "Mantenimiento de estadio Diego Armando Maradona." },
    { name: "Polideportivo Chacarita", location: "San Martín, Buenos Aires", img: "chacarita.jpg", desc: "Gestión de múltiples superficies (fútbol, tenis, hockey)." },
  ];

  return (
    <div className="clients-page">
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">Nuestros Clientes</h1>
          <p className="page-subtitle">Confían en nosotros los grandes del fútbol argentino.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="clients-grid">
            {clients.map((client, index) => (
              <div key={index} className="client-card">
                <div className="image-placeholder-card">
                  <span className="placeholder-text">Imagen: {client.img}</span>
                </div>
                <div className="client-content">
                  <h3>{client.name}</h3>
                  <div className="client-location">
                    <MapPin size={16} />
                    <span>{client.location}</span>
                  </div>
                  <p>{client.desc}</p>
                </div>
              </div>
            ))}
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

        .clients-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .client-card {
          background: var(--surface);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s;
          border: 1px solid var(--border);
        }

        .client-card:hover {
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

        .client-content {
          padding: 1.5rem;
        }

        .client-content h3 {
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
        }

        .client-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--secondary);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .client-content p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
