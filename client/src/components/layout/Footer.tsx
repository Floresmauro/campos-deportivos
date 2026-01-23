"use client";

import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Linkedin, Facebook, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__section">
            <h3 className="footer__logo">Campos Deportivos</h3>
            <p className="footer__desc">
              Líderes en gestión integral de predios deportivos y mantenimiento de superficies de alto rendimiento.
            </p>
            <div className="footer__social">
              <a href="#" className="social-btn"><Instagram size={20} /></a>
              <a href="#" className="social-btn"><Facebook size={20} /></a>
              <a href="#" className="social-btn"><Linkedin size={20} /></a>
            </div>
          </div>

          <div className="footer__section">
            <h4>Enlaces Rápidos</h4>
            <ul className="footer__links">
              <li><Link href="/nosotros" className="footer__link--text"><ArrowRight size={14} /> Nosotros</Link></li>
              <li><Link href="/servicios" className="footer__link--text"><ArrowRight size={14} /> Servicios</Link></li>
              <li><Link href="/portfolio" className="footer__link--text"><ArrowRight size={14} /> Portfolio</Link></li>
              <li><Link href="/novedades" className="footer__link--text"><ArrowRight size={14} /> Novedades</Link></li>
              <li><Link href="/contacto" className="footer__link--text"><ArrowRight size={14} /> Contacto</Link></li>
            </ul>
          </div>

          <div className="footer__section">
            <h4>Acceso</h4>
            <div className="footer__access">
              <Link href="/portal" className="access-btn access-btn--portal">Portal Empleados</Link>
              <Link href="/admin" className="access-btn access-btn--admin">Administración</Link>
            </div>
          </div>

          <div className="footer__section">
            <h4>Contacto</h4>
            <ul className="footer__contact">
              <li><MapPin size={18} /><span className="c-text">Buenos Aires, Argentina</span></li>
              <li><Phone size={18} /><span className="c-text">+54 11 1234-5678</span></li>
              <li><Mail size={18} /><span className="c-text">contacto@camposdeportivos.com</span></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="bottom-text">&copy; {new Date().getFullYear()} Campos Deportivos. Todos los derechos reservados.</p>
        </div>
      </div>

      <style jsx>{`
        .footer__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          padding-bottom: 2rem;
        }
        .footer__social { display: flex; gap: 0.75rem; margin-top: 1rem; }
        .social-btn { 
          background: var(--primary); 
          color: white; 
          width: 36px; 
          height: 36px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          text-decoration: none !important;
          transition: transform 0.2s;
        }
        .social-btn:hover {
          transform: scale(1.1);
          background: var(--primary-light);
        }
        .footer__links { list-style: none; }
        .footer__links li { margin-bottom: 0.5rem; }
        .footer__links a { 
          display: flex; 
          align-items: center; 
          gap: 0.5rem;
          text-decoration: none !important;
          color: rgba(255, 255, 255, 0.9) !important;
          transition: color 0.2s;
        }
        .footer__links a:hover {
          color: var(--primary) !important;
        }
        .footer__access { display: flex; flex-direction: column; gap: 0.75rem; }
        .access-btn { 
          padding: 0.75rem; 
          border-radius: var(--radius-md); 
          text-align: center; 
          font-weight: 700;
          text-decoration: none !important;
          transition: all 0.2s;
        }
        .access-btn--portal { 
          background: var(--primary); 
          color: white !important; 
        }
        .access-btn--portal:hover {
          background: var(--primary-light);
        }
        .access-btn--admin { 
          border: 1px solid white; 
          color: white !important; 
        }
        .access-btn--admin:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .footer__contact { list-style: none; }
        .footer__contact li { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
        .footer__bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem; text-align: center; font-size: 0.85rem; }
      `}</style>
    </footer>
  );
};

export default Footer;
