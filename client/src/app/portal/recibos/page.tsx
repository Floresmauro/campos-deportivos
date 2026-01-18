"use client";

import { FileText, Download, Calendar } from 'lucide-react';

export default function RecibosPage() {
  // Mock data
  const recibos = [
    { id: 1, month: 'Enero 2026', date: '05/01/2026', amount: '$350.000', downloaded: false },
    { id: 2, month: 'Diciembre 2025', date: '05/12/2025', amount: '$350.000', downloaded: true },
    { id: 3, month: 'Noviembre 2025', date: '05/11/2025', amount: '$340.000', downloaded: true },
    { id: 4, month: 'Octubre 2025', date: '05/10/2025', amount: '$340.000', downloaded: true },
    { id: 5, month: 'Septiembre 2025', date: '05/09/2025', amount: '$330.000', downloaded: true },
  ];

  return (
    <div className="recibos-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Recibos de Sueldo</h1>
        </div>
      </header>

      <main className="page-main">
        <div className="recibos-list">
          {recibos.map((recibo) => (
            <div key={recibo.id} className={`recibo-card ${!recibo.downloaded ? 'new' : ''}`}>
              <div className="recibo-icon">
                <FileText size={24} />
                {!recibo.downloaded && <span className="new-badge">Nuevo</span>}
              </div>
              <div className="recibo-info">
                <h3>{recibo.month}</h3>
                <div className="recibo-meta">
                  <span><Calendar size={14} /> {recibo.date}</span>
                  <span className="amount">{recibo.amount}</span>
                </div>
              </div>
              <button className="download-btn">
                <Download size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="info-note">
          <p>Los recibos están disponibles en formato PDF. Si tiene alguna consulta sobre su liquidación, contacte a Recursos Humanos.</p>
        </div>
      </main>

      <style jsx>{`
        .recibos-page {
          min-height: 100vh;
          background: var(--background);
        }

        .page-header {
          background: linear-gradient(135deg, #1a472a 0%, #2d5a27 100%);
          color: white;
          padding: 1.5rem;
        }

        .header-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .header-content h1 {
          color: white !important;
          font-size: 1.5rem;
          margin: 0;
        }

        .page-main {
          max-width: 600px;
          margin: 0 auto;
          padding: 1.5rem;
        }

        .recibos-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .recibo-card {
          background: var(--surface);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s;
          border: 1px solid var(--border);
        }

        .recibo-card:hover {
          transform: translateX(5px);
        }

        .recibo-card.new {
          border-left: 4px solid var(--secondary);
        }

        .recibo-icon {
          width: 48px;
          height: 48px;
          background: var(--background);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          flex-shrink: 0;
          position: relative;
        }

        .new-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--secondary);
          color: white;
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: 600;
        }

        .recibo-info {
          flex: 1;
        }

        .recibo-info h3 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
        }

        .recibo-meta {
          display: flex;
          gap: 1.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .recibo-meta span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .recibo-meta .amount {
          color: var(--primary);
          font-weight: 600;
        }

        .download-btn {
          width: 44px;
          height: 44px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .download-btn:hover {
          background: var(--primary-light);
        }

        .info-note {
          margin-top: 2rem;
          padding: 1rem;
          background: var(--surface);
          border-radius: var(--radius-md);
          border-left: 4px solid var(--accent);
        }

        .info-note p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
