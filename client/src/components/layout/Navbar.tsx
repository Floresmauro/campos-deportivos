"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, User, Settings } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar-custom">
      <div className="container navbar__container">
        <Link href="/" className="navbar__logo">
          Campos Deportivos
        </Link>

        {/* Desktop Menu */}
        <div className="navbar__menu">
          <Link href="/" className="navbar__link">Inicio</Link>
          <Link href="/nosotros" className="navbar__link">Nosotros</Link>
          <Link href="/servicios" className="navbar__link">Servicios</Link>
          <Link href="/clientes" className="navbar__link">Clientes</Link>
          <Link href="/novedades" className="navbar__link">Novedades</Link>
          <Link href="/capacitaciones" className="navbar__link">Capacitaciones</Link>
          <Link href="/contacto" className="navbar__link">Contacto</Link>

          <div className="navbar__buttons">
            <Link href="/portal" className="navbar__btn navbar__btn--portal">
              <User size={16} /> Portal
            </Link>
            <Link href="/admin" className="navbar__btn navbar__btn--admin">
              <Settings size={16} /> Admin
            </Link>
          </div>
        </div>

        {/* Mobile Button */}
        <button className="navbar__toggle" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="navbar__mobile-menu">
            <Link href="/" className="navbar__mobile-link" onClick={() => setIsOpen(false)}>Inicio</Link>
            <Link href="/nosotros" className="navbar__mobile-link" onClick={() => setIsOpen(false)}>Nosotros</Link>
            <Link href="/servicios" className="navbar__mobile-link" onClick={() => setIsOpen(false)}>Servicios</Link>
            <Link href="/novedades" className="navbar__mobile-link" onClick={() => setIsOpen(false)}>Novedades</Link>
            <Link href="/portal" className="navbar__mobile-btn portal" onClick={() => setIsOpen(false)}>Portal</Link>
            <Link href="/admin" className="navbar__mobile-btn admin" onClick={() => setIsOpen(false)}>Admin</Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .navbar__container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }
        .navbar__menu {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .navbar__buttons {
          display: flex;
          gap: 0.5rem;
          margin-left: 1rem;
        }
        .navbar__btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
        }
        .navbar__btn--portal { background: #ffd700; color: #000; }
        .navbar__btn--admin { background: #fff; color: #003366; }
        
        .navbar__toggle {
          display: none;
          background: none;
          border: 1px solid white;
          color: white;
          padding: 0.25rem;
          border-radius: 4px;
        }

        @media (max-width: 1024px) {
          .navbar__menu { display: none; }
          .navbar__toggle { display: block; }
          .navbar__mobile-menu {
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            background: #001f3f;
            display: flex;
            flex-direction: column;
            padding: 1rem;
            z-index: 1000;
          }
          .navbar__mobile-link { color: white; padding: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .navbar__mobile-btn { margin-top: 1rem; padding: 1rem; text-align: center; border-radius: 6px; font-weight: 700; }
          .navbar__mobile-btn.portal { background: #ffd700; color: #000; }
          .navbar__mobile-btn.admin { background: #fff; color: #003366; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
