"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Wrench,
  Users,
  FileText,
  Banknote,
  Clock,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  QrCode
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';

const navItems = [
  { href: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { href: '/admin/estadios', icon: <Building2 size={20} />, label: 'Estadios' },
  { href: '/admin/activos', icon: <Wrench size={20} />, label: 'Activos' },
  { href: '/admin/personal', icon: <Users size={20} />, label: 'Personal' },
  { href: '/admin/asistencia', icon: <Clock size={20} />, label: 'Asistencia' },
  { href: '/admin/nomina', icon: <Banknote size={20} />, label: 'Nómina' },
  { href: '/admin/reportes', icon: <BarChart3 size={20} />, label: 'Reportes' },
  { href: '/admin/noticias', icon: <FileText size={20} />, label: 'Noticias' },
  { href: '/admin/qr-generator', icon: <QrCode size={20} />, label: 'Códigos QR' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const { settings, toggleDarkMode } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      await logout();
      router.push('/login');
    }
  };

  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <span className="brand">Admin Panel</span>
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src="/logo.jpg" alt="Campos Deportivos" className="sidebar-logo" />
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {user && (
          <div className="user-profile-section">
            <div className="user-info-card">
              <div className="user-avatar">
                {user.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-details">
                <span className="user-name">{user.full_name}</span>
                <span className="user-role">{user.role}</span>
              </div>
            </div>
            <button className="sidebar-theme-toggle" onClick={toggleDarkMode} title="Cambiar Tema">
              {settings.darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        )}

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link href="/admin/config" className="nav-item">
            <Settings size={20} />
            <span>Configuración</span>
          </Link>
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: var(--background);
        }

        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 0.75rem 1.25rem;
          z-index: 100;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          font-family: var(--font-title);
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--primary);
          text-transform: uppercase;
        }

        .menu-btn, .theme-toggle {
          background: none;
          border: none;
          color: var(--text-main);
          cursor: pointer;
        }

        .sidebar {
          width: 260px;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 200;
          transition: transform 0.3s;
        }

        .sidebar-header {
          padding: 1.5rem;
          background: var(--primary);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-logo {
          height: 45px;
          width: auto;
        }

        .close-btn {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        .user-profile-section {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--background);
          margin: 0.75rem;
          border-radius: var(--radius-md);
        }

        .user-info-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          color: var(--text-main);
          font-size: 0.85rem;
        }

        .user-role {
          font-size: 0.7rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .sidebar-theme-toggle {
            background: var(--surface);
            border: 1px solid var(--border);
            color: var(--text-main);
            width: 30px;
            height: 30px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0.5rem 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          margin: 0.2rem 0.75rem;
          border-radius: var(--radius-md);
          text-decoration: none !important;
          color: var(--text-secondary) !important;
          transition: all 0.2s;
          font-weight: 500;
          font-size: 0.9rem;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .nav-item span {
          flex: 1;
          text-align: left;
        }

        .nav-item svg {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
        }

        .nav-item:hover {
          background: var(--background);
          color: var(--primary) !important;
          text-decoration: none !important;
        }

        .nav-item:visited,
        .nav-item:active {
          color: var(--text-secondary) !important;
          text-decoration: none !important;
        }

        .nav-item.active {
          background: #EBF7ED;
          color: var(--primary) !important;
          font-weight: 600;
          border-left: none;
        }

        .nav-item.active:visited,
        .nav-item.active:active {
          color: var(--primary) !important;
        }

        .dark-mode .nav-item.active {
            background: rgba(74, 222, 128, 0.1);
        }

        .sidebar-footer {
          border-top: 1px solid var(--border);
          padding: 1rem 0;
        }

        .nav-item.logout {
          color: var(--error) !important;
        }

        .nav-item.logout:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error) !important;
        }

        .admin-main {
          flex: 1;
          margin-left: 260px;
          padding: 2.5rem;
          transition: margin-left 0.3s;
        }

        @media (max-width: 1024px) {
          .mobile-header {
            display: flex;
          }

          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 150;
          }

          .close-btn {
            display: block;
          }

          .admin-main {
            margin-left: 0;
            padding-top: 5rem;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
