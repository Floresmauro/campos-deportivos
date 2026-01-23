"use client";

import { Building2, Users, Wrench, AlertTriangle, MapPin, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: 'Predios Gestionados', value: 0, icon: <Building2 size={24} />, color: '#003366' },
    { label: 'Empleados', value: 0, icon: <Users size={24} />, color: '#2E8B57' },
    { label: 'Maquinarias', value: 0, icon: <Wrench size={24} />, color: '#6B7280' },
    { label: 'Alertas', value: 0, icon: <AlertTriangle size={24} />, color: '#DC2626' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [
        { count: stadiumsCount },
        { count: profilesCount },
        { count: assetsCount }
      ] = await Promise.all([
        supabase.from('stadiums').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('assets').select('*', { count: 'exact', head: true })
      ]);

      setStats([
        { label: 'Predios Gestionados', value: stadiumsCount || 0, icon: <Building2 size={24} />, color: '#003366' },
        { label: 'Empleados', value: profilesCount || 0, icon: <Users size={24} />, color: '#2E8B57' },
        { label: 'Maquinarias', value: assetsCount || 0, icon: <Wrench size={24} />, color: '#6B7280' },
        { label: 'Alertas', value: 3, icon: <AlertTriangle size={24} />, color: '#DC2626' }, // Keep dummy for now
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Panel de Administración</h1>
        <p>Resumen ejecutivo y control operativo.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card" style={{ '--stat-color': stat.color } as React.CSSProperties}>
            <div className="stat-icon">{stat.icon}</div>
            <div>
              <span className="stat-value">
                {loading ? <Loader2 className="animate-spin" size={20} /> : stat.value}
              </span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Map Section */}
      <section className="map-section">
        <h2><MapPin size={20} /> Mapa en Tiempo Real</h2>
        <div className="map-placeholder">
          <p>Integrar mapa de Google Maps o Leaflet aquí.</p>
          <p>Mostrar ubicación de maquinaria en movimiento.</p>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="activity-section">
        <h2>Actividad Reciente</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-dot" style={{ background: '#2E8B57' }}></span>
            <div className="activity-content">
              <p><strong>Juan Pérez</strong> fichó entrada en Racing Club.</p>
              <span>Hace 5 minutos</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-dot" style={{ background: '#003366' }}></span>
            <div className="activity-content">
              <p><strong>Tractor 03</strong> fue trasladado a Banfield.</p>
              <span>Hace 30 minutos</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-dot" style={{ background: '#DC2626' }}></span>
            <div className="activity-content">
              <p><strong>Alerta:</strong> Cortadora 07 requiere mantenimiento.</p>
              <span>Hace 1 hora</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .admin-dashboard {
          max-width: 1200px;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          margin-bottom: 0.5rem;
        }

        .dashboard-header p {
          color: var(--text-secondary);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          background: var(--surface);
          padding: 1.5rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 1rem;
          border-left: 4px solid var(--stat-color);
        }

        .stat-icon {
          color: var(--stat-color);
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .map-section, .activity-section {
          background: var(--surface);
          padding: 1.5rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
          margin-bottom: 2rem;
        }

        .map-section h2, .activity-section h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .map-placeholder {
          width: 100%;
          height: 300px;
          background: #f0f0f0;
          border: 2px dashed #ccc;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #888;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .activity-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .activity-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .activity-content p {
          margin: 0 0 0.25rem;
          font-size: 0.95rem;
        }

        .activity-content span {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
