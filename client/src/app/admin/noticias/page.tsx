"use client";

import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Calendar } from 'lucide-react';

export default function NoticiasPage() {
  const [showEditor, setShowEditor] = useState(false);

  // Mock data
  const noticias = [
    {
      id: 1,
      title: 'Renovación del estadio de Racing completada',
      excerpt: 'Terminamos exitosamente la renovación completa del césped del Cilindro de Avellaneda.',
      published: true,
      date: '12/01/2026'
    },
    {
      id: 2,
      title: 'Nueva maquinaria incorporada a la flota',
      excerpt: 'Adquirimos 3 nuevos tractores John Deere para mejorar nuestros servicios.',
      published: true,
      date: '05/01/2026'
    },
    {
      id: 3,
      title: 'Próxima capacitación: Manejo de césped híbrido',
      excerpt: 'Inscripciones abiertas para el curso de febrero 2026.',
      published: false,
      date: '20/12/2025'
    },
  ];

  return (
    <div className="noticias-page">
      <div className="page-header">
        <div>
          <h1>Gestión de Noticias</h1>
          <p>Administre el blog y novedades del sitio web.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowEditor(true)}>
          <Plus size={18} />
          Nueva Noticia
        </button>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="modal-overlay" onClick={() => setShowEditor(false)}>
          <div className="modal editor-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Nueva Noticia</h2>
            <form className="editor-form">
              <div className="form-group">
                <label>Título</label>
                <input type="text" placeholder="Ingrese el título de la noticia" />
              </div>
              <div className="form-group">
                <label>Extracto</label>
                <textarea rows={2} placeholder="Breve descripción para la lista..."></textarea>
              </div>
              <div className="form-group">
                <label>Contenido</label>
                <textarea rows={8} placeholder="Escriba el contenido completo de la noticia..."></textarea>
              </div>
              <div className="form-group">
                <label>Imagen Principal (URL)</label>
                <input type="text" placeholder="https://..." />
              </div>
              <div className="form-row">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  Publicar inmediatamente
                </label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditor(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* News List */}
      <div className="noticias-list">
        {noticias.map((noticia) => (
          <div key={noticia.id} className="noticia-card">
            <div className="noticia-content">
              <div className="noticia-status">
                {noticia.published ? (
                  <span className="status published"><Eye size={14} /> Publicada</span>
                ) : (
                  <span className="status draft"><EyeOff size={14} /> Borrador</span>
                )}
                <span className="date"><Calendar size={14} /> {noticia.date}</span>
              </div>
              <h3>{noticia.title}</h3>
              <p>{noticia.excerpt}</p>
            </div>
            <div className="noticia-actions">
              <button className="icon-btn edit"><Pencil size={16} /></button>
              <button className="icon-btn delete"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .noticias-page {
          max-width: 1000px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-header h1 { margin-bottom: 0.25rem; }
        .page-header p { color: var(--text-secondary); margin: 0; }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .noticias-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .noticia-card {
          background: var(--surface);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          display: flex;
          gap: 1.5rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
        }

        .noticia-content {
          flex: 1;
        }

        .noticia-status {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .status, .date {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
        }

        .status.published { color: #059669; }
        .status.draft { color: #9ca3af; }
        .date { color: var(--text-secondary); }

        .noticia-content h3 {
          margin: 0 0 0.5rem;
          font-size: 1.15rem;
        }

        .noticia-content p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .noticia-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .icon-btn {
          padding: 0.5rem;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }
        .icon-btn.edit { background: #e0f2fe; color: #0369a1; }
        .icon-btn.delete { background: #fee2e2; color: #b91c1c; }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
          overflow-y: auto;
        }

        .modal {
          background: var(--surface);
          border-radius: var(--radius-md);
          padding: 2rem;
          width: 100%;
          max-width: 600px;
          margin-top: 2rem;
        }

        .modal h2 { margin-bottom: 1.5rem; color: var(--text-main); }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-size: 1rem;
          background: var(--background);
          color: var(--text-main);
        }

        .form-row {
          margin-bottom: 1.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkbox-label input {
          width: 18px;
          height: 18px;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
        }

        .form-actions .btn {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
