"use client";

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  QrCode,
  Truck,
  Calendar,
  FileText,
  User,
  Clock,
  MapPin,
  ChevronRight,
  LogOut
} from 'lucide-react';

export default function PortalDashboard() {
  const { user, logout } = useAuth();

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
        <button onClick={logout} className="logout-btn">
          <LogOut size={20} />
        </button>
      </header>

      <main className="portal-main">
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

        <section className="info-sections">
          <div className="info-card">
            <Clock size={20} />
            <span>Ver mi historial de asistencia</span>
            <ChevronRight size={18} />
          </div>
          <div className="info-card">
            <Calendar size={20} />
            <span>Solicitar vacaciones o permisos</span>
            <ChevronRight size={18} />
          </div>
          <div className="info-card">
            <FileText size={20} />
            <span>Mis recibos de sueldo</span>
            <ChevronRight size={18} />
          </div>
          <div className="info-card">
            <User size={20} />
            <span>Mi legajo digital</span>
            <ChevronRight size={18} />
          </div>
        </section>

        <section className="current-status">
          <div className="status-header">
            <MapPin size={18} />
            <h3>Sede Actual</h3>
          </div>
          <div className="status-body">
            <strong>Estadio de Racing</strong>
            <p>Av. Mitre 934, Avellaneda</p>
          </div>
        </section>
      </main>

      <style jsx>{`
        .portal-dashboard {
          max-width: 600px;
          margin: 0 auto;
          min-height: 100vh;
          background: #f8fafc;
          padding-bottom: 2rem;
        }

        .portal-header {
          background: var(--primary);
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

        .logout-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          padding: 0.5rem;
          border-radius: 10px;
          cursor: pointer;
        }

        .portal-main {
          padding: 1.5rem;
          margin-top: -1rem;
        }

        .quick-actions h2 {
          font-size: 1.1rem;
          color: #334155;
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
          background: white;
          padding: 1.25rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          text-decoration: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s, box-shadow 0.2s;
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

        .card-text {
          flex: 1;
        }

        .card-text h3 {
          font-size: 1rem;
          color: #1e293b;
          margin-bottom: 0.2rem;
        }

        .card-text p {
          font-size: 0.85rem;
          color: #64748b;
        }

        .arrow {
          color: #cbd5e1;
        }

        .info-sections {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .info-card {
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid #f1f5f9;
          color: #475569;
          font-size: 0.95rem;
          cursor: pointer;
        }

        .info-card:last-child {
          border-bottom: none;
        }

        .info-card span {
          flex: 1;
        }

        .current-status {
          background: #e2e8f0;
          padding: 1.5rem;
          border-radius: 16px;
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #475569;
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
          color: #1e293b;
          font-size: 1.1rem;
          margin-bottom: 0.2rem;
        }

        .status-body p {
          color: #64748b;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
