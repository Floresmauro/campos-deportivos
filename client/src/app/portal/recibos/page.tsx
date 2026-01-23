"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { FileText, Download, Calendar, ArrowLeft, Home, Loader2 } from 'lucide-react';

interface Recibo {
  id: string;
  month: number;
  year: number;
  net_salary: number;
  file_url: string | null;
  created_at: string;
}

export default function RecibosPage() {
  const { user } = useAuth();
  const [recibos, setRecibos] = useState<Recibo[]>([]);
  const [loading, setLoading] = useState(true);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  useEffect(() => {
    if (user?.id) {
      fetchRecibos();
    }
  }, [user]);

  const fetchRecibos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payroll')
        .select('*')
        .eq('user_id', user?.id)
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;
      setRecibos(data || []);
    } catch (error) {
      console.error('Error fetching recibos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-AR');
  };

  return (
    <div className="recibos-page">
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
          <h1>Recibos de Sueldo</h1>
        </div>
      </header>

      <main className="page-main">
        {loading ? (
          <div className="loading-state">
            <Loader2 className="spinner" size={40} />
            <p>Cargando tus recibos...</p>
          </div>
        ) : recibos.length === 0 ? (
          <div className="empty-state">
            <FileText size={64} />
            <h3>No se encontraron recibos</h3>
            <p>Aún no tienes liquidaciones cargadas en el sistema.</p>
          </div>
        ) : (
          <div className="recibos-list">
            {recibos.map((recibo) => (
              <div key={recibo.id} className="recibo-card">
                <div className="recibo-icon">
                  <FileText size={24} />
                </div>
                <div className="recibo-info">
                  <h3>{months[recibo.month - 1]} {recibo.year}</h3>
                  <div className="recibo-meta">
                    <span><Calendar size={14} /> {formatDate(recibo.created_at)}</span>
                    <span className="amount">${recibo.net_salary.toLocaleString('es-AR')}</span>
                  </div>
                </div>
                {recibo.file_url ? (
                  <a
                    href={recibo.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-btn"
                    title="Ver PDF"
                  >
                    <Download size={20} />
                  </a>
                ) : (
                  <div className="no-file" title="PDF no disponible">
                    <FileText size={20} opacity={0.3} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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

        .loading-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          color: var(--text-secondary);
        }

        .spinner {
          animation: spin 1s linear infinite;
          color: var(--primary);
          margin-bottom: 1rem;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .empty-state h3 {
          margin: 1.5rem 0 0.5rem;
          color: var(--text-main);
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
          transition: all 0.2s;
          border: 1px solid var(--border);
        }

        .recibo-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
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
          color: white !important;
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

        .no-file {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }

        .info-note {
          margin-top: 2rem;
          padding: 1rem;
          background: var(--surface);
          border-radius: var(--radius-md);
          border-left: 4px solid var(--accent);
          border: 1px solid var(--border);
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
