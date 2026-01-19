"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Plus, Clock, CheckCircle, XCircle, ArrowLeft, Home } from 'lucide-react';

export default function SolicitudesPage() {
  const [showForm, setShowForm] = useState(false);

  // Mock data
  const requests = [
    { id: 1, type: 'vacation', dates: '15/02/2026 - 28/02/2026', status: 'pending', createdAt: '10/01/2026' },
    { id: 2, type: 'permit', dates: '05/01/2026', status: 'approved', createdAt: '03/01/2026' },
    { id: 3, type: 'vacation', dates: '20/12/2025 - 25/12/2025', status: 'approved', createdAt: '01/12/2025' },
  ];

  const statusConfig: { [key: string]: { label: string, icon: React.ReactNode, class: string } } = {
    pending: { label: 'Pendiente', icon: <Clock size={16} />, class: 'pending' },
    approved: { label: 'Aprobado', icon: <CheckCircle size={16} />, class: 'approved' },
    rejected: { label: 'Rechazado', icon: <XCircle size={16} />, class: 'rejected' }
  };

  const typeLabels: { [key: string]: string } = {
    vacation: 'Vacaciones',
    permit: 'Permiso'
  };

  return (
    <div className="solicitudes-page">
      <header className="page-header">
        <div className="header-nav">
          <Link href="/portal/dashboard" className="back-btn" title="Volver al portal">
            <ArrowLeft size={20} />
          </Link>
          <Link href="/" className="home-btn" title="Ir al inicio">
            <Home size={20} />
          </Link>
        </div>
        <div className="header-content">
          <h1>Mis Solicitudes</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} /> Nueva
          </button>
        </div>
      </header>

      <main className="page-main">
        {/* Request Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Nueva Solicitud</h2>
              <form className="request-form">
                <div className="form-group">
                  <label>Tipo de Solicitud</label>
                  <select>
                    <option value="vacation">Vacaciones</option>
                    <option value="permit">Permiso</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Fecha de Inicio</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>Fecha de Fin</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>Motivo (opcional)</label>
                  <textarea rows={3} placeholder="Describa el motivo..."></textarea>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Enviar Solicitud
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Requests List */}
        <div className="requests-list">
          {requests.map((req) => (
            <div key={req.id} className="request-card">
              <div className="request-icon">
                <Calendar size={24} />
              </div>
              <div className="request-info">
                <h3>{typeLabels[req.type]}</h3>
                <p className="dates">{req.dates}</p>
                <p className="created">Solicitado: {req.createdAt}</p>
              </div>
              <div className={`status-badge ${statusConfig[req.status].class}`}>
                {statusConfig[req.status].icon}
                {statusConfig[req.status].label}
              </div>
            </div>
          ))}
        </div>
      </main>

      <style jsx>{`
        .solicitudes-page {
          min-height: 100vh;
          background: var(--background);
        }

        .page-header {
          background: linear-gradient(135deg, #1a472a 0%, #2d5a27 100%);
          color: white;
          padding: 1.5rem;
        }

        .header-nav {
          max-width: 600px;
          margin: 0 auto 1rem;
          display: flex;
          gap: 0.5rem;
        }

        .back-btn,
        .home-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white !important;
          padding: 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: background 0.2s;
        }

        .back-btn:hover,
        .home-btn:hover {
          background: rgba(255,255,255,0.25);
        }

        .header-content {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content h1 {
          color: white !important;
          font-size: 1.5rem;
          margin: 0;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .page-main {
          max-width: 600px;
          margin: 0 auto;
          padding: 1.5rem;
        }

        .requests-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .request-card {
          background: var(--surface);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
        }

        .request-icon {
          width: 48px;
          height: 48px;
          background: var(--background);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          flex-shrink: 0;
        }

        .request-info {
          flex: 1;
        }

        .request-info h3 {
          margin: 0 0 0.5rem;
          font-size: 1rem;
        }

        .request-info .dates {
          margin: 0;
          color: var(--text-main);
          font-weight: 500;
        }

        .request-info .created {
          margin: 0.25rem 0 0;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          flex-shrink: 0;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.approved {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal {
          background: var(--surface);
          border-radius: var(--radius-md);
          padding: 2rem;
          width: 100%;
          max-width: 400px;
        }

        .modal h2 {
          margin-bottom: 1.5rem;
          color: var(--text-main);
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-size: 1rem;
          background: var(--background);
          color: var(--text-main);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .form-actions .btn {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
