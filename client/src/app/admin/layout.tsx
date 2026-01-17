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
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { href: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { href: '/admin/estadios', icon: <Building2 size={20} />, label: 'Estadios' },
  { href: '/admin/activos', icon: <Wrench size={20} />, label: 'Activos' },
  { href: '/admin/personal', icon: <Users size={20} />, label: 'Personal' },
  { href: '/admin/nomina', icon: <Banknote size={20} />, label: 'Nómina' },
  { href: '/admin/noticias', icon: <FileText size={20} />, label: 'Noticias' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      await logout();
      router.push('/login');
    }
  };

  // Redirect to login if not authenticated
  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  // Show loading while checking auth
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
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Campos Deportivos</h2>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {user && (
          <div className="user-info">
            <div className="user-avatar">
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="user-name">{user.full_name}</div>
              <div className="user-role">{user.role}</div>
            </div>
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
          background: var(--primary);
          color: white;
          padding: 1rem;
          z-index: 100;
          align-items: center;
          gap: 1rem;
        }

        .menu-btn, .close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        .brand {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .sidebar {
          width: 260px;
          background: var(--primary);
          color: white;
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
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-header h2 {
          font-size: 1.25rem;
          color: white !important;
          margin: 0;
        }

        .close-btn {
          display: none;
        }

        .user-info {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--accent);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .user-name {
          font-weight: 600;
          color: white;
          font-size: 0.9rem;
        }

        .user-role {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.7);
          text-transform: capitalize;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.5rem;
          text-decoration: none;
          transition: background 0.2s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-size: 0.95rem;
          cursor: pointer;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.1);
        }

        .nav-item.active {
          background: rgba(255,255,255,0.15);
          border-left: 3px solid var(--accent);
        }

        .sidebar-footer {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 1rem 0;
        }

        .nav-item.logout {
          color: #f87171;
        }

        .sidebar-overlay {
          display: none;
        }

        .admin-main {
          flex: 1;
          margin-left: 260px;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .mobile-header {
            display: flex;
          }

          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .close-btn {
            display: block;
          }

          .sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 150;
          }

          .admin-main {
            margin-left: 0;
            padding-top: 5rem;
          }
        }
      `}</style>
    </div>
  );
}
