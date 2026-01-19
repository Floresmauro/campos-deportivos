"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  QrCode,
  Truck,
  Calendar,
  FileText,
  User,
  Clock,
  MapPin,
  ChevronRight,
  LogOut,
  Newspaper,
  Bell,
  Home
} from 'lucide-react';

interface News {
  id: string;
  title: string;
  excerpt: string;
  created_at: string;
  category: string;
}

export default function PortalDashboard() {
  const { user, logout } = useAuth();
  const [news, setNews] = useState<News[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('id, title, excerpt, created_at, category')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        if (error.code === 'PGRST204' || error.code === 'PGRST205' || error.code === '42P01') {
          console.warn('La tabla news no existe aún. Por favor ejecute las migraciones.');
        } else {
          throw error;
        }
      }
      setNews(data || []);
    } catch (error) {
      console.error('Error loading news:', error);
      setNews([]); // Ensure we don't leave it loading forever
    } finally {
      setLoadingNews(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  };

  if (!user) return null;

  return (
    <div className="portal-dashboard">
      <header className="portal-header">
        <div className="user-welcome">
          <div className="avatar">{user.full_name?.charAt(0).toUpperCase()}</div>
          <div>
            <h1>Hola, {user.full_name?.split(' ')[0]}</h1>
            <p className="role-chip">{user.role}</p>
          </div>
        </div>
        <div className="header-actions">
          <Link href="/" className="home-btn" title="Volver al inicio">
            <Home size={20} />
          </Link>
          <button onClick={logout} className="logout-btn" title="Cerrar sesión">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="portal-main">
        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Operaciones Rápidas</h2>
          <div className="action-grid">
            <Link href="/portal/qr-attendance" className="action-card primary">
              <div className="card-icon"><QrCode size={32} /></div>
              <div className="card-text">
                <h3>Fichar Asistencia</h3>
                <p>Marcar entrada/salida vía QR</p>
              </div>
              <ChevronRight size={20} className="arrow" />
            </Link>

            <Link href="/portal/qr-assets" className="action-card secondary">
              <div className="card-icon"><Truck size={32} /></div>
              <div className="card-text">
                <h3>Mover Maquinaria</h3>
                <p>Escaneo de activos y traslados</p>
              </div>
              <ChevronRight size={20} className="arrow" />
            </Link>
          </div>
        </section>

        {/* Menu Links - Now all functional */}
        <section className="info-sections">
          <Link href="/portal/fichar" className="info-card">
            <Clock size={20} />
            <span>Ver mi historial de asistencia</span>
            <ChevronRight size={18} />
          </Link>
          <Link href="/portal/solicitudes" className="info-card">
            <Calendar size={20} />
            <span>Solicitar vacaciones o permisos</span>
            <ChevronRight size={18} />
          </Link>
          <Link href="/portal/recibos" className="info-card">
            <FileText size={20} />
            <span>Mis recibos de sueldo</span>
            <ChevronRight size={18} />
          </Link>
          <Link href="/portal/perfil" className="info-card">
            <User size={20} />
            <span>Mi legajo digital</span>
            <ChevronRight size={18} />
          </Link>
        </section>

        {/* News/Novedades Section */}
        <section className="news-section">
          <div className="section-header">
            <div className="section-title">
              <Bell size={20} />
              <h2>Novedades</h2>
            </div>
            <span className="badge">{news.length} nuevas</span>
          </div>

          {loadingNews ? (
            <div className="loading-news">Cargando novedades...</div>
          ) : news.length === 0 ? (
            <div className="empty-news">
              <Newspaper size={32} />
              <p>No hay novedades por el momento</p>
            </div>
          ) : (
            <div className="news-list">
              {news.map((item) => (
                <div key={item.id} className="news-item">
                  <div className="news-date">{formatDate(item.created_at)}</div>
                  <div className="news-content">
                    <span className="news-category">{item.category || 'General'}</span>
                    <h4>{item.title}</h4>
                    <p>{item.excerpt || 'Sin descripción'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Current Location */}
        <section className="current-status">
          <div className="status-header">
            <MapPin size={18} />
            <h3>Sede Actual</h3>
          </div>
          <div className="status-body">
            <strong>{user.assigned_stadium || 'Sin sede asignada'}</strong>
            <p>Ubicación de trabajo actual</p>
          </div>
        </section>
      </main>

      <style jsx>{`
        .portal-dashboard {
          max-width: 600px;
          margin: 0 auto;
          min-height: 100vh;
          background: var(--background);
          padding-bottom: 2rem;
        }

        .portal-header {
          background: linear-gradient(135deg, #1a472a 0%, #2d5a27 100%);
          color: white;
          padding: 2.5rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom-left-radius: 24px;
          border-bottom-right-radius: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .user-welcome {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .avatar {
          width: 56px;
          height: 56px;
          background: var(--accent);
          color: var(--primary);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 800;
        }

        .portal-header h1 {
          font-size: 1.5rem;
          margin: 0;
          font-weight: 700;
          color: white !important;
        }

        .role-chip {
          display: inline-block;
          background: rgba(255,255,255,0.2);
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 0.25rem;
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
        }

        .home-btn,
        .logout-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white !important;
          padding: 0.5rem;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          text-decoration: none;
        }

        .home-btn:hover,
        .logout-btn:hover {
          background: rgba(255,255,255,0.25);
        }

        .portal-main {
          padding: 1.5rem;
          margin-top: -1rem;
        }

        .quick-actions h2 {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .action-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .action-card {
          background: var(--surface);
          padding: 1.25rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          text-decoration: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid var(--border);
        }

        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .card-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .primary .card-icon { background: #e0f2fe; color: #0369a1; }
        .secondary .card-icon { background: #fef3c7; color: #b45309; }

        .card-text { flex: 1; }
        .card-text h3 { font-size: 1rem; color: var(--text-main); margin-bottom: 0.2rem; }
        .card-text p { font-size: 0.85rem; color: var(--text-secondary); }

        .arrow { color: #cbd5e1; }

        .info-sections {
          background: var(--surface);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
        }

        .info-sections :global(.info-card) {
          padding: 1.25rem;
          display: flex !important;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid var(--border);
          color: var(--text-secondary) !important;
          font-size: 0.95rem;
          cursor: pointer;
          text-decoration: none !important;
          transition: background 0.2s;
        }

        .info-sections :global(.info-card:hover) {
          background: var(--background);
        }

        .info-sections :global(.info-card:last-child) { border-bottom: none; }
        .info-sections :global(.info-card span) { flex: 1; }

        /* News Section */
        .news-section {
          background: var(--surface);
          border-radius: 16px;
          padding: 1.25rem;
          margin-bottom: 2rem;
          border: 1px solid var(--border);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary);
        }

        .section-title h2 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
        }

        .badge {
          background: var(--accent);
          color: var(--primary);
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .loading-news, .empty-news {
          text-align: center;
          padding: 2rem 1rem;
          color: var(--text-secondary);
        }

        .empty-news svg {
          opacity: 0.4;
          margin-bottom: 0.5rem;
        }

        .news-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .news-item {
          display: flex;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .news-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .news-date {
          min-width: 50px;
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .news-content {
          flex: 1;
        }

        .news-category {
          display: inline-block;
          background: #e0f2fe;
          color: #0369a1;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .news-content h4 {
          font-size: 0.95rem;
          color: var(--text-main);
          margin: 0.25rem 0;
        }

        .news-content p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.4;
        }

        /* Current Status */
        .current-status {
          background: var(--surface);
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid var(--border);
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
        }

        .status-header h3 {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }

        .status-body strong {
          display: block;
          color: var(--text-main);
          font-size: 1.1rem;
          margin-bottom: 0.2rem;
        }

        .status-body p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
