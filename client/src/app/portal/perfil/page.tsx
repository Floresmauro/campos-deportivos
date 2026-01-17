"use client";

import { User, Phone, Mail, Building2, Shield, Edit } from 'lucide-react';

export default function PerfilPage() {
    // Mock user data
    const user = {
        name: "Juan Pérez",
        email: "juan.perez@camposdeportivos.com",
        phone: "+54 11 1234-5678",
        role: "Operario de Campo",
        stadium: "Racing Club",
        startDate: "15/03/2022",
        obraSocial: "OSDE 310"
    };

    return (
        <div className="perfil-page">
            <header className="perfil-header">
                <div className="avatar-large">
                    <User size={48} />
                </div>
                <h1>{user.name}</h1>
                <p>{user.role}</p>
            </header>

            <main className="perfil-main">
                <section className="info-section">
                    <div className="section-header">
                        <h2>Información Personal</h2>
                        <button className="edit-btn"><Edit size={16} /> Editar</button>
                    </div>

                    <div className="info-list">
                        <div className="info-item">
                            <Mail size={20} className="icon" />
                            <div>
                                <span className="label">Email</span>
                                <span className="value">{user.email}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <Phone size={20} className="icon" />
                            <div>
                                <span className="label">Teléfono</span>
                                <span className="value">{user.phone}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <Building2 size={20} className="icon" />
                            <div>
                                <span className="label">Sede Asignada</span>
                                <span className="value">{user.stadium}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <Shield size={20} className="icon" />
                            <div>
                                <span className="label">Obra Social</span>
                                <span className="value">{user.obraSocial}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="info-section">
                    <h2>Datos Laborales</h2>
                    <div className="info-grid">
                        <div className="info-card">
                            <span className="card-label">Fecha de Ingreso</span>
                            <span className="card-value">{user.startDate}</span>
                        </div>
                        <div className="info-card">
                            <span className="card-label">Antigüedad</span>
                            <span className="card-value">2 años, 10 meses</span>
                        </div>
                    </div>
                </section>

                <div className="actions">
                    <button className="btn btn-secondary">Cambiar Contraseña</button>
                </div>
            </main>

            <style jsx>{`
        .perfil-page {
          min-height: 100vh;
          background: var(--background);
        }

        .perfil-header {
          background: var(--primary);
          color: white;
          padding: 3rem 1.5rem 2rem;
          text-align: center;
        }

        .avatar-large {
          width: 96px;
          height: 96px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .perfil-header h1 {
          color: white;
          font-size: 1.75rem;
          margin-bottom: 0.25rem;
        }

        .perfil-header p {
          opacity: 0.8;
        }

        .perfil-main {
          max-width: 600px;
          margin: 0 auto;
          padding: 1.5rem;
        }

        .info-section {
          background: white;
          border-radius: var(--radius-md);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: var(--shadow-sm);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          font-size: 1.1rem;
          margin: 0;
        }

        .info-section h2 {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }

        .edit-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: 1px solid var(--border);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.85rem;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .info-item .icon {
          color: var(--primary);
          margin-top: 2px;
        }

        .info-item .label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .info-item .value {
          font-weight: 500;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .info-card {
          background: var(--background);
          padding: 1rem;
          border-radius: var(--radius-sm);
          text-align: center;
        }

        .card-label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .card-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--primary);
        }

        .actions {
          text-align: center;
          padding: 1rem 0;
        }
      `}</style>
        </div>
    );
}
