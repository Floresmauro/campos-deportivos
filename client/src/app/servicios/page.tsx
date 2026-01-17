"use client";

import { Check } from 'lucide-react';

export default function ServicesPage() {
    const services = [
        {
            title: "Mantenimiento de Césped Natural",
            desc: "Planes integrales de fertilización, corte, aireación y resiembra. Utilizamos maquinaria de precisión para lograr el 'corte de estadio'.",
            features: ["Corte helicoidal", "Aireación profunda", "Control de plagas", "Fertilización balanceada"]
        },
        {
            title: "Césped Sintético y Híbrido",
            desc: "Instalación y mantenimiento de superficies artificiales. Cepillado, descompactación y relleno de caucho para maximizar la vida útil.",
            features: ["Descompactación mecánica", "Cepillado y nivelación", "Reparación de juntas", "Limpieza profunda"]
        },
        {
            title: "Gestión Integral de Predios",
            desc: "Nos encargamos de todo: personal, maquinaria, insumos y logística. Usted se ocupa del deporte, nosotros del campo.",
            features: ["Personal in-situ", "Gestión de inventario", "Seguridad y limpieza", "Informes técnicos mensuales"]
        },
        {
            title: "Capacitaciones y Consultoría",
            desc: "Formamos a su personal en las mejores prácticas de canchero. Asesoramos en la construcción y renovación de campos.",
            features: ["Talleres prácticos", "Manuales de procedimiento", "Auditoría de estado", "Planificación de obras"]
        }
    ];

    return (
        <div className="services-page">
            <header className="page-header">
                <div className="container">
                    <h1 className="page-title">Nuestros Servicios</h1>
                    <p className="page-subtitle">Soluciones profesionales para cada necesidad.</p>
                </div>
            </header>

            <section className="section">
                <div className="container">
                    <div className="services-grid">
                        {services.map((service, index) => (
                            <div key={index} className="service-card">
                                <div className="service-header">
                                    <h3>{service.title}</h3>
                                </div>
                                <div className="service-body">
                                    <p>{service.desc}</p>
                                    <ul className="feature-list">
                                        {service.features.map((f, i) => (
                                            <li key={i}>
                                                <Check size={16} className="check-icon" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style jsx>{`
        .page-header {
          background-color: var(--primary);
          color: white;
          padding: 4rem 0;
          text-align: center;
        }

        .page-title {
          font-size: 3rem;
          color: white;
          margin-bottom: 1rem;
        }

        .page-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .section {
          padding: 5rem 0;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .service-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: var(--shadow-sm);
        }

        .service-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--primary-light);
        }

        .service-header {
          background-color: var(--background);
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .service-header h3 {
          margin: 0;
          font-size: 1.4rem;
        }

        .service-body {
          padding: 2rem;
        }

        .service-body p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .feature-list {
          list-style: none;
        }

        .feature-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .check-icon {
          color: var(--success);
          flex-shrink: 0;
        }
      `}</style>
        </div>
    );
}
