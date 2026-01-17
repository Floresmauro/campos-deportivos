"use client";

import { Calendar, Clock, Users, MapPin, CheckCircle } from 'lucide-react';

export default function CapacitacionesPage() {
    const cursos = [
        {
            id: 1,
            title: 'Manejo de Césped Híbrido',
            description: 'Aprenda las técnicas modernas para el cuidado de superficies híbridas utilizadas en estadios de primera división.',
            date: '15-17 Febrero 2026',
            duration: '24 horas',
            capacity: 20,
            location: 'Centro de Capacitación - Avellaneda',
            topics: ['Instalación', 'Riego y fertilización', 'Corte especializado', 'Reparación de daños']
        },
        {
            id: 2,
            title: 'Operación de Maquinaria Pesada',
            description: 'Curso teórico-práctico sobre el manejo seguro de tractores, aireadores y cortadoras profesionales.',
            date: '10-12 Marzo 2026',
            duration: '16 horas',
            capacity: 12,
            location: 'Predio Racing Club',
            topics: ['Seguridad operacional', 'Mantenimiento preventivo', 'Técnicas de corte', 'Diagnóstico de fallas']
        },
        {
            id: 3,
            title: 'Gestión de Predios Deportivos',
            description: 'Formación para encargados de sede sobre administración integral de instalaciones deportivas.',
            date: '5-6 Abril 2026',
            duration: '12 horas',
            capacity: 25,
            location: 'Oficinas Centrales - CABA',
            topics: ['Planificación de tareas', 'Gestión de personal', 'Control de inventario', 'Reportes técnicos']
        }
    ];

    return (
        <div className="capacitaciones-page">
            <header className="page-header">
                <div className="container">
                    <h1 className="page-title">Capacitaciones</h1>
                    <p className="page-subtitle">Formación profesional para el sector deportivo.</p>
                </div>
            </header>

            <section className="section intro">
                <div className="container">
                    <div className="intro-content">
                        <h2>Invertimos en conocimiento</h2>
                        <p>
                            En Campos Deportivos creemos que la excelencia nace de la formación continua.
                            Ofrecemos cursos y talleres para profesionales del mantenimiento de superficies deportivas,
                            dictados por expertos con décadas de experiencia en el rubro.
                        </p>
                    </div>
                </div>
            </section>

            <section className="section cursos">
                <div className="container">
                    <h2>Próximos Cursos</h2>
                    <div className="cursos-list">
                        {cursos.map((curso) => (
                            <div key={curso.id} className="curso-card">
                                <div className="curso-header">
                                    <h3>{curso.title}</h3>
                                    <span className="badge">Inscripciones Abiertas</span>
                                </div>
                                <p className="curso-desc">{curso.description}</p>

                                <div className="curso-meta">
                                    <div className="meta-item">
                                        <Calendar size={16} />
                                        <span>{curso.date}</span>
                                    </div>
                                    <div className="meta-item">
                                        <Clock size={16} />
                                        <span>{curso.duration}</span>
                                    </div>
                                    <div className="meta-item">
                                        <Users size={16} />
                                        <span>Cupo: {curso.capacity} personas</span>
                                    </div>
                                    <div className="meta-item">
                                        <MapPin size={16} />
                                        <span>{curso.location}</span>
                                    </div>
                                </div>

                                <div className="curso-topics">
                                    <h4>Temas a cubrir:</h4>
                                    <ul>
                                        {curso.topics.map((topic, i) => (
                                            <li key={i}>
                                                <CheckCircle size={14} />
                                                {topic}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button className="btn btn-primary">Solicitar Inscripción</button>
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

        .intro {
          background: var(--background);
        }

        .intro-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .intro-content h2 {
          margin-bottom: 1.5rem;
        }

        .intro-content p {
          font-size: 1.1rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .cursos h2 {
          text-align: center;
          margin-bottom: 3rem;
        }

        .cursos-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .curso-card {
          background: white;
          border-radius: var(--radius-md);
          padding: 2rem;
          box-shadow: var(--shadow-sm);
          border-left: 4px solid var(--secondary);
        }

        .curso-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .curso-header h3 {
          margin: 0;
          font-size: 1.4rem;
        }

        .badge {
          background: #d1fae5;
          color: #065f46;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .curso-desc {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .curso-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: var(--background);
          border-radius: var(--radius-sm);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-main);
        }

        .meta-item svg {
          color: var(--primary);
        }

        .curso-topics h4 {
          font-size: 0.95rem;
          margin-bottom: 0.75rem;
        }

        .curso-topics ul {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .curso-topics li {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .curso-topics li svg {
          color: var(--secondary);
        }
      `}</style>
        </div>
    );
}
