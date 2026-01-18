"use client";

import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

export default function NovedadesPage() {
  // Mock data - would come from API
  const noticias = [
    {
      id: 1,
      slug: 'renovacion-racing',
      title: 'Renovación del estadio de Racing completada',
      excerpt: 'Terminamos exitosamente la renovación completa del césped del Cilindro de Avellaneda, implementando las últimas tecnologías en mantenimiento de superficies deportivas.',
      image: '/images/stadiums/racing.jpg',
      date: '12 Enero 2026'
    },
    {
      id: 2,
      slug: 'nueva-maquinaria',
      title: 'Nueva maquinaria incorporada a la flota',
      excerpt: 'Adquirimos 3 nuevos tractores John Deere de última generación para mejorar nuestros servicios de corte y mantenimiento.',
      image: '/images/services/tractor.jpg',
      date: '05 Enero 2026'
    },
    {
      id: 3,
      slug: 'capacitacion-cesped-hibrido',
      title: 'Próxima capacitación: Manejo de césped híbrido',
      excerpt: 'Inscripciones abiertas para el curso de febrero 2026. Aprenda las mejores técnicas para el cuidado de superficies híbridas.',
      image: '/images/services/training.jpg',
      date: '20 Diciembre 2025'
    },
  ];

  return (
    <div className="novedades-page">
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">Novedades</h1>
          <p className="page-subtitle">Últimas noticias y actualizaciones de Campos Deportivos.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="noticias-grid">
            {noticias.map((noticia) => (
              <article key={noticia.id} className="noticia-card">
                <div className="noticia-image">
                  <div className="image-placeholder">
                    <span>Imagen: {noticia.image}</span>
                  </div>
                </div>
                <div className="noticia-content">
                  <div className="noticia-date">
                    <Calendar size={14} />
                    {noticia.date}
                  </div>
                  <h2>{noticia.title}</h2>
                  <p>{noticia.excerpt}</p>
                  <Link href={`/novedades/${noticia.slug}`} className="read-more">
                    Leer más <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
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

        .noticias-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .noticia-card {
          background: var(--surface);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid var(--border);
        }

        .noticia-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
        }

        .noticia-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          background: var(--background);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .noticia-content {
          padding: 1.5rem;
        }

        .noticia-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
        }

        .noticia-content h2 {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .noticia-content p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .read-more {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary);
          font-weight: 600;
          font-size: 0.95rem;
        }

        .read-more:hover {
          text-decoration: none;
          color: var(--secondary);
        }

        @media (max-width: 768px) {
          .noticias-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
