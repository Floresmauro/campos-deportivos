"use client";

import Link from "next/link";
import { CheckCircle, Shield, Award } from 'lucide-react';

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
            <Link href="/contacto" className="btn btn-secondary">
              Contactar
            </Link>
          </div>
        </div>
      </section>

      {/* About Section - University Style */}
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

      {/* Features Section */}
      <section className="section features">
        <div className="container">
          <div className="section-header">
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
          height: 600px;
          background-image: url('https://images.unsplash.com/photo-1522778119026-d647f0565c6a?auto=format&fit=crop&q=80'); /* Sample Stadium Image */
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
          background: linear-gradient(rgba(0,51,102,0.8), rgba(0,30,60,0.6));
        }

        .hero__content {
          position: relative;
          z-index: 2;
          max-width: 800px;
        }

        .hero__title {
          font-size: 3.5rem;
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }

        .hero__subtitle {
          font-size: 1.25rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
        }

        .hero__actions {
          display: flex;
          gap: 1rem;
        }

        /* Sections */
        .section {
          padding: 5rem 0;
        }

        .section-label {
          color: var(--secondary);
          text-transform: uppercase;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 0.5rem;
        }

        /* About */
        .about__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .about__stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .stat-card {
          background: white;
          padding: 2rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          text-align: center;
          border-top: 4px solid var(--primary);
        }

        .stat-card:nth-child(3) {
          grid-column: span 2;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary);
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .text-link {
          display: inline-block;
          margin-top: 1rem;
          font-weight: 600;
        }

        /* Features */
        .features {
          background-color: var(--background);
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .features__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          padding: 2.5rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
        }

        .feature-icon {
          color: var(--secondary);
          margin-bottom: 1.5rem;
        }

        @media (max-width: 768px) {
          .hero__title {
            font-size: 2.5rem;
          }
          
          .about__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
