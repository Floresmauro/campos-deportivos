"use client";

import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="contact-page">
            <header className="page-header">
                <div className="container">
                    <h1 className="page-title">Contacto</h1>
                    <p className="page-subtitle">Estamos listos para potenciar su infraestructura deportiva.</p>
                </div>
            </header>

            <section className="section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Info */}
                        <div className="contact-info">
                            <h2>Hablemos</h2>
                            <p className="contact-intro">
                                Complete el formulario o utilicé nuestros canales directos. Respondemos en menos de 24 horas.
                            </p>

                            <div className="info-item">
                                <Phone className="icon" size={24} />
                                <div>
                                    <h4>Teléfono</h4>
                                    <p>+54 11 1234-5678</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <Mail className="icon" size={24} />
                                <div>
                                    <h4>Email</h4>
                                    <p>contacto@camposdeportivos.com</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <MapPin className="icon" size={24} />
                                <div>
                                    <h4>Oficinas</h4>
                                    <p>Av. Libertador 1234, CABA</p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="contact-form-wrapper">
                            <form className="contact-form">
                                <div className="form-group">
                                    <label>Nombre Completo</label>
                                    <input type="text" placeholder="Juan Pérez" />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" placeholder="juan@ejemplo.com" />
                                </div>
                                <div className="form-group">
                                    <label>Asunto</label>
                                    <input type="text" placeholder="Cotización mantenimiento" />
                                </div>
                                <div className="form-group">
                                    <label>Mensaje</label>
                                    <textarea rows={5} placeholder="Escriba su consulta..."></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">
                                    Enviar Mensaje
                                </button>
                            </form>
                        </div>
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

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 4rem;
        }

        .contact-intro {
          margin-bottom: 2rem;
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        .info-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .info-item .icon {
          color: var(--secondary);
          margin-top: 3px;
        }

        .info-item h4 {
          margin-bottom: 0.25rem;
          font-size: 1.1rem;
          color: var(--primary);
        }

        .contact-form-wrapper {
          background: white;
          padding: 2.5rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text-main);
        }

        .form-group input, 
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-size: 1rem;
        }

        .form-group input:focus, 
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(0,51,102,0.1);
        }

        .btn-block {
          width: 100%;
        }

        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}
