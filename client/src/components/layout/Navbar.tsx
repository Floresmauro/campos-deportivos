"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, User, Settings, Sun, Moon } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, toggleDarkMode } = useSettings();
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar-custom">
      <div className="container navbar__container">
        <div className="navbar__logo-wrapper">
          <Link href="/" className="navbar__logo">
            <img src="/logo.jpg" alt="Campos Deportivos Walter Aciar" className="logo-image" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar__menu">
          <Link href="/" className="navbar__link">Inicio</Link>
          <Link href="/nosotros" className="navbar__link">Nosotros</Link>
          <Link href="/servicios" className="navbar__link">Servicios</Link>
          <Link href="/clientes" className="navbar__link">Clientes</Link>
          <Link href="/novedades" className="navbar__link">Novedades</Link>
          <Link href="/contacto" className="navbar__link">Contacto</Link>

          <div className="navbar__actions">
            <button
              className="theme-switcher"
              onClick={toggleDarkMode}
              title={settings.darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="navbar__buttons">
              <Link href="/portal" className="btn-portal">
                <User size={16} /> Portal
              </Link>
              <Link href="/admin" className="btn-admin">
                <Settings size={16} /> Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Button Wrapper */}
        <div className="navbar__mobile-actions">
          <button className="theme-switcher mobile" onClick={toggleDarkMode}>
            {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="navbar__toggle" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="navbar__mobile-menu">
            <Link href="/" className="navbar__mobile-link" onClick={() => setIsOpen(false)}>Inicio</Link>
            <Link href="/nosotros" className="navbar__mobile-link" onClick={() => setIsOpen(false)}>Nosotros</Link>
            <Link href="/servicios" className="navbar__mobile-link" onClick={() => setIsOpen(false)}>Servicios</Link>
            <Link href="/novedades" className="navbar__mobile-link" onClick={() => setIsOpen(false)}>Novedades</Link>
            <div className="navbar__mobile-btns">
              <Link href="/portal" className="mobile-btn-portal" onClick={() => setIsOpen(false)}>Acceso Portal</Link>
              <Link href="/admin" className="mobile-btn-admin" onClick={() => setIsOpen(false)}>Panel Admin</Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
                .navbar-custom {
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    background: var(--surface);
                    border-bottom: 1px solid var(--border);
                    height: 80px;
                }
                .navbar__container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 100%;
                }
                .navbar__logo {
                    text-decoration: none;
                    color: inherit;
                }
                .navbar__logo-wrapper {
                    flex: 1;
                }
                .logo-image {
                    height: 55px;
                    width: auto;
                    display: block;
                    transition: transform 0.2s;
                }
                .logo-image:hover {
                    transform: scale(1.05);
                }
                .navbar__menu {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .navbar__link {
                    color: var(--text-main);
                    font-weight: 500;
                    font-size: 0.95rem;
                    transition: color 0.2s;
                    text-decoration: none !important;
                }
                .navbar__link:hover {
                    color: var(--primary);
                    text-decoration: none !important;
                }
                .navbar__link:visited,
                .navbar__link:active {
                    color: var(--text-main);
                    text-decoration: none !important;
                }
                .navbar__actions {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .theme-switcher {
                    background: var(--background);
                    border: 1px solid var(--border);
                    color: var(--text-main);
                    padding: 0.5rem;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .theme-switcher:hover {
                    background: var(--border);
                    transform: rotate(15deg);
                }
                .navbar__buttons {
                    display: flex;
                    gap: 0.75rem;
                }
                .btn-portal {
                    background: var(--primary);
                    color: white !important;
                    padding: 0.6rem 1.2rem;
                    border-radius: var(--radius-md);
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    box-shadow: var(--shadow-sm);
                    text-decoration: none !important;
                }
                .btn-portal:hover {
                    background: var(--primary-light);
                }
                .btn-admin {
                    background: transparent;
                    border: 1px solid var(--primary);
                    color: var(--primary) !important;
                    padding: 0.6rem 1.2rem;
                    border-radius: var(--radius-md);
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    text-decoration: none !important;
                }
                .btn-admin:hover {
                    background: var(--primary);
                    color: white !important;
                }

                @media (min-width: 1025px) {
                    .navbar__menu { display: flex !important; }
                    .navbar__toggle { display: none !important; }
                    .navbar__mobile-actions .theme-switcher { display: none; }
                }

                @media (max-width: 1024px) {
                    .navbar__menu { display: none !important; }
                    .navbar__mobile-actions { display: flex; align-items: center; }
                    .navbar__logo-wrapper {
                        display: flex;
                        justify-content: center;
                        position: absolute;
                        left: 0;
                        right: 0;
                        pointer-events: none;
                    }
                    .navbar__logo { pointer-events: auto; }
                    .navbar__toggle {
                        background: none;
                        border: none;
                        color: var(--text-main);
                        cursor: pointer;
                    }
                    .navbar__mobile-menu {
                        position: absolute;
                        top: 80px;
                        left: 0;
                        right: 0;
                        background: var(--surface);
                        border-bottom: 2px solid var(--primary);
                        display: flex;
                        flex-direction: column;
                        padding: 1.5rem;
                        z-index: 1000;
                        box-shadow: var(--shadow-lg);
                    }
                    .navbar__mobile-link {
                        color: var(--text-main);
                        padding: 1rem;
                        font-weight: 600;
                        font-family: var(--font-title);
                        border-bottom: 1px solid var(--border);
                        text-transform: uppercase;
                        text-decoration: none !important;
                    }
                    .navbar__mobile-link:hover {
                        background: var(--background);
                        color: var(--primary);
                    }
                    .navbar__mobile-btns {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                        margin-top: 1.5rem;
                    }
                    .mobile-btn-portal {
                        background: var(--primary);
                        color: white !important;
                        padding: 1rem;
                        text-align: center;
                        border-radius: var(--radius-md);
                        font-weight: 700;
                        text-decoration: none !important;
                    }
                    .mobile-btn-admin {
                        border: 1px solid var(--primary);
                        color: var(--primary) !important;
                        padding: 1rem;
                        text-align: center;
                        border-radius: var(--radius-md);
                        font-weight: 700;
                        text-decoration: none !important;
                    }
                }
            `}</style>
    </nav>
  );
};

export default Navbar;
