"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, UserCircle, ShieldCheck, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/contexts/SettingsContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, toggleDarkMode } = useSettings();
  const pathname = usePathname();
  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => {
    if (!pathname) return false;
    const cleanPath = pathname.split('?')[0].split('#')[0];
    if (path === '/') return cleanPath === '/';
    return cleanPath.startsWith(path);
  };

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
          <Link href="/" className={`navbar__link ${isActive('/') ? 'active' : ''}`}>Inicio</Link>
          <Link href="/nosotros" className={`navbar__link ${isActive('/nosotros') ? 'active' : ''}`}>Nosotros</Link>
          <Link href="/servicios" className={`navbar__link ${isActive('/servicios') ? 'active' : ''}`}>Servicios</Link>
          <Link href="/portfolio" className={`navbar__link ${isActive('/portfolio') ? 'active' : ''}`}>Portfolio</Link>
          <Link href="/novedades" className={`navbar__link ${isActive('/novedades') ? 'active' : ''}`}>Novedades</Link>
          <Link href="/contacto" className={`navbar__link ${isActive('/contacto') ? 'active' : ''}`}>Contacto</Link>

          <div className="navbar__actions">
            <div className="navbar__buttons">
              <Link href="/portal" className="btn-portal">
                <UserCircle size={18} /> Portal
              </Link>
              <Link href="/admin" className="btn-admin">
                <ShieldCheck size={18} /> Admin
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
            <Link href="/" className={`navbar__mobile-link ${isActive('/') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Inicio</Link>
            <Link href="/nosotros" className={`navbar__mobile-link ${isActive('/nosotros') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Nosotros</Link>
            <Link href="/servicios" className={`navbar__mobile-link ${isActive('/servicios') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Servicios</Link>
            <Link href="/portfolio" className={`navbar__mobile-link ${isActive('/portfolio') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Portfolio</Link>
            <Link href="/novedades" className={`navbar__mobile-link ${isActive('/novedades') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>Novedades</Link>
            <div className="navbar__mobile-btns">
              <Link href="/portal" className="mobile-btn-portal" onClick={() => setIsOpen(false)}>Acceso Portal</Link>
              <Link href="/admin" className="mobile-btn-admin" onClick={() => setIsOpen(false)}>Panel Admin</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
