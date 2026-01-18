"use client";

import Link from "next/link";
import { CheckCircle, Shield, Award, ArrowRight } from 'lucide-react';
import ImageGrid from '@/components/ImageGrid';

const estadiosData = [
  {
    url: 'https://images.unsplash.com/photo-1556011522-aaaff071869e?q=80&w=800&auto=format&fit=crop',
    estadio: 'Arena Central',
    descripcion: 'Campo profesional de césped sintético alta densidad.'
  },
  {
    url: 'https://images.unsplash.com/photo-1521733606456-621813f28392?q=80&w=800&auto=format&fit=crop',
    estadio: 'Complejo Norte',
    descripcion: 'Sede con 5 campos de fútbol y vestuarios premium.'
  },
  {
    url: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=800&auto=format&fit=crop',
    estadio: 'Estadio del Este',
    descripcion: 'Césped natural nivel FIFA Pro.'
  },
];

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__overlay"></div>
        <div className="container hero__content">
          <h1 className="hero__title">Excelencia en Gestión Deportiva</h1>
          <p className="hero__subtitle">
            Expertos en mantenimiento de campos deportivos, logística de maquinaria y administración de personal para clubes de primera línea.
          </p>
          <div className="hero__actions">
            <Link href="/servicios" className="btn btn-primary">
              Nuestros Servicios
            </Link>
            <Link href="/contacto" className="btn btn-outline">
              Contactar
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section about">
        <div className="container">
          <div className="about__grid">
            <div className="about__text">
              <span className="section-label">Sobre Nosotros</span>
              <h2>Tradición y Profesionalismo</h2>
              <p>
                En <strong>Campos Deportivos</strong>, combinamos años de experiencia con tecnología de vanguardia para asegurar que cada campo de juego cumpla con los estándares más exigentes del deporte profesional.
              </p>
              <p>
                Trabajamos con instituciones como Racing, Banfield, Defensa y Justicia, y Argentinos Juniors, garantizando superficies de juego impecables.
              </p>
              <Link href="/nosotros" className="text-link">Conozca nuestra historia &rarr;</Link>
            </div>
            <div className="about__stats">
              <div className="stat-card">
                <span className="stat-number">50+</span>
                <span className="stat-label">Estadios Gestionados</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">200+</span>
                <span className="stat-label">Colaboradores</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">15</span>
                <span className="stat-label">Años de Trayectoria</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fields Section (TIPO INSTAGRAM) */}
      <section className="section fields-grid">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Portafolio</span>
            <h2>Nuestros Campos</h2>
            <p>Instalaciones de primer nivel diseñadas para el rendimiento deportivo máximo.</p>
          </div>
          <ImageGrid images={estadiosData} />
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/estadios" className="btn btn-primary">
              Ver todas las sedes <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Servicios</span>
            <h2>Nuestra Propuesta de Valor</h2>
            <p>Soluciones integrales para la infraestructura deportiva moderna.</p>
          </div>

          <div className="features__grid">
            <div className="feature-card">
              <div className="feature-icon"><CheckCircle size={32} /></div>
              <h3>Mantenimiento de Césped</h3>
              <p>Cuidado especializado de superficies naturales y sintéticas con maquinaria de última generación.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Shield size={32} /></div>
              <h3>Gestión de Activos</h3>
              <p>Control total de maquinaria y herramientas mediante sistemas de trazabilidad y mantenimiento preventivo.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Award size={32} /></div>
              <h3>Personal Capacitado</h3>
              <p>Equipo humano formado continuamente en las mejores prácticas del mercado.</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Hero */
        .hero {
          position: relative;
          height: 650px;
          background-image: url('https://images.unsplash.com/photo-1522778119026-d647f0565c6a?auto=format&fit=crop&q=80');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          color: white;
        }

        .hero__overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to right, rgba(45, 90, 39, 0.9), rgba(0,0,0,0.4));
        }

        .hero__content {
          position: relative;
          z-index: 2;
          max-width: 800px;
        }

        .hero__title {
          font-size: 4rem;
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          font-family: var(--font-title);
          text-transform: uppercase;
        }

        .hero__subtitle {
          font-size: 1.35rem;
          margin-bottom: 2.5rem;
          opacity: 0.95;
          max-width: 600px;
        }

        .hero__actions {
          display: flex;
          gap: 1.25rem;
        }

        .btn-outline {
            border: 2px solid white;
            color: white;
            background: transparent;
        }
        
        .btn-outline:hover {
            background: white;
            color: var(--primary);
        }

        /* Sections */
        .section {
          padding: 6rem 0;
        }

        .section-label {
          color: var(--primary);
          text-transform: uppercase;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 2px;
          display: block;
          margin-bottom: 0.75rem;
        }

        /* About */
        .about__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .about__stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .stat-card {
          background: var(--surface);
          padding: 2.5rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          text-align: center;
          border-top: 4px solid var(--primary);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-md);
        }

        .stat-card:nth-child(3) {
          grid-column: span 2;
        }

        .stat-number {
          display: block;
          font-size: 2.75rem;
          font-weight: 700;
          color: var(--primary);
          font-family: var(--font-title);
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .text-link {
          display: inline-block;
          margin-top: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 1px;
        }

        /* Features */
        .features {
          background-color: var(--background);
        }

        .section-header {
          text-align: center;
          margin-bottom: 4.5rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .features__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2.5rem;
        }

        .feature-card {
          background: var(--surface);
          padding: 3rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
          border: 1px solid var(--border);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary);
        }

        .feature-icon {
          color: var(--primary);
          margin-bottom: 1.75rem;
        }

        .feature-card h3 {
            margin-bottom: 1rem;
        }

        @media (max-width: 1024px) {
            .about__grid { gap: 3rem; }
        }

        @media (max-width: 768px) {
          .hero__title {
            font-size: 2.75rem;
          }
          
          .about__grid {
            grid-template-columns: 1fr;
          }

          .hero { height: auto; padding: 100px 0; }
        }
      `}</style>
    </div>
  );
}
