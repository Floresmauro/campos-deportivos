"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  Calendar,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Home,
  FileText,
  Upload,
  Loader2,
  X
} from 'lucide-react';

interface Request {
  id: string;
  type: 'vacation' | 'permit' | 'other';
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  file_url?: string | null;
  created_at: string;
}

export default function SolicitudesPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    type: 'vacation',
    start_date: '',
    end_date: '',
    reason: '',
    file: null as File | null
  });

  const statusConfig: { [key: string]: { label: string, icon: React.ReactNode, class: string } } = {
    pending: { label: 'Pendiente', icon: <Clock size={16} />, class: 'pending' },
    approved: { label: 'Aprobado', icon: <CheckCircle size={16} />, class: 'approved' },
    rejected: { label: 'Rechazado', icon: <XCircle size={16} />, class: 'rejected' }
  };

  const typeLabels: { [key: string]: string } = {
    vacation: 'Vacaciones',
    permit: 'Permiso',
    other: 'Otro'
  };

  useEffect(() => {
    if (user?.id) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSubmitting(true);
      let file_url = null;

      // 1. Upload file if exists
      if (formData.file) {
        const fileExt = formData.file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const filePath = `solicitudes/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('solicitudes')
          .upload(filePath, formData.file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          // If the bucket doesn't exist, we'll continue but notify later
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('solicitudes')
            .getPublicUrl(filePath);
          file_url = publicUrl;
        }
      }

      // 2. Insert record
      const { error: dbError } = await supabase
        .from('requests')
        .insert({
          user_id: user.id,
          type: formData.type,
          start_date: formData.start_date,
          end_date: formData.end_date,
          reason: formData.reason,
          status: 'pending',
          file_url: file_url
        });

      if (dbError) throw dbError;

      setShowForm(false);
      setFormData({
        type: 'vacation',
        start_date: '',
        end_date: '',
        reason: '',
        file: null
      });
      loadRequests();
    } catch (error: any) {
      console.error('Error creating request:', error);
      alert('Error al crear la solicitud. Es posible que el servidor necesite una actualización de base de datos.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-AR');
  };

  return (
    <div className="solicitudes-page">
      <header className="page-header">
        <div className="header-nav">
          <Link href="/portal/dashboard" className="back-btn" title="Volver al portal">
            <ArrowLeft size={20} />
          </Link>
          <Link href="/" className="home-btn" title="Ir al inicio">
            <Home size={20} />
          </Link>
        </div>
        <div className="header-content">
          <h1>Mis Solicitudes</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} /> Nueva
          </button>
        </div>
      </header>

      <main className="page-main">
        {/* Request Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => !submitting && setShowForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Nueva Solicitud</h2>
                <button className="close-btn" onClick={() => setShowForm(false)} disabled={submitting}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="request-form">
                <div className="form-group">
                  <label>Tipo de Solicitud</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    required
                  >
                    <option value="vacation">Vacaciones</option>
                    <option value="permit">Permiso</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de Inicio</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha de Fin</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Motivo</label>
                  <textarea
                    rows={3}
                    placeholder="Describa el motivo de su solicitud..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Adjuntar PDF (opcional)</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                      id="file-upload"
                      className="hidden-input"
                    />
                    <label htmlFor="file-upload" className="file-label">
                      {formData.file ? (
                        <><FileText size={18} /> {formData.file.name}</>
                      ) : (
                        <><Upload size={18} /> Seleccionar archivo PDF</>
                      )}
                    </label>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? <><Loader2 className="spinner" size={18} /> Enviando...</> : 'Enviar Solicitud'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Requests List */}
        {loading ? (
          <div className="loading-state">
            <Loader2 className="spinner" size={40} />
            <p>Cargando solicitudes...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <Calendar size={64} opacity={0.3} />
            <h3>No tienes solicitudes</h3>
            <p>Aquí aparecerán tus pedidos de vacaciones y permisos.</p>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map((req) => (
              <div key={req.id} className="request-card">
                <div className="request-icon">
                  <Calendar size={24} />
                </div>
                <div className="request-info">
                  <h3>{typeLabels[req.type]}</h3>
                  <p className="dates">
                    {formatDate(req.start_date)} - {formatDate(req.end_date)}
                  </p>
                  <div className="request-details">
                    <p className="reason">{req.reason}</p>
                    {req.file_url && (
                      <a href={req.file_url} target="_blank" rel="noopener noreferrer" className="attachment-link">
                        <FileText size={14} /> Ver Adjunto
                      </a>
                    )}
                  </div>
                </div>
                <div className={`status-badge ${statusConfig[req.status]?.class || 'pending'}`}>
                  {statusConfig[req.status]?.icon || <Clock size={16} />}
                  {statusConfig[req.status]?.label || 'Pendiente'}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        .solicitudes-page {
          min-height: 100vh;
          background: var(--background);
        }

        .page-header {
          background: linear-gradient(135deg, #1a472a 0%, #2d5a27 100%);
          color: white;
          padding: 1.5rem;
        }

        .header-nav {
          max-width: 600px;
          margin: 0 auto 1rem;
          display: flex;
          gap: 0.5rem;
        }

        .back-btn,
        .home-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white !important;
          padding: 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: background 0.2s;
        }

        .back-btn:hover,
        .home-btn:hover {
          background: rgba(255,255,255,0.25);
        }

        .header-content {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content h1 {
          color: white !important;
          font-size: 1.5rem;
          margin: 0;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .btn-primary {
          background: var(--accent);
          color: white !important;
        }

        .btn-primary:hover {
          background: #e5f5e0;
        }

        .page-main {
          max-width: 600px;
          margin: 0 auto;
          padding: 1.5rem;
        }

        .loading-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          color: var(--text-secondary);
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .requests-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .request-card {
          background: var(--surface);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
        }

        .request-icon {
          width: 48px;
          height: 48px;
          background: var(--background);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          flex-shrink: 0;
        }

        .request-info {
          flex: 1;
        }

        .request-info h3 {
          margin: 0 0 0.5rem;
          font-size: 1rem;
        }

        .request-info .dates {
          margin: 0;
          color: var(--text-main);
          font-weight: 600;
        }

        .request-details {
          margin-top: 0.5rem;
        }

        .reason {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .attachment-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.5rem;
          color: var(--primary);
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          background: #f0fdf4;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .status-badge.pending { background: #fef3c7; color: #92400e; }
        .status-badge.approved { background: #d1fae5; color: #065f46; }
        .status-badge.rejected { background: #fee2e2; color: #991b1b; }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal {
          background: var(--surface);
          border-radius: var(--radius-md);
          padding: 2rem;
          width: 100%;
          max-width: 450px;
          box-shadow: var(--shadow-lg);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .modal-header h2 { margin: 0; }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .form-group select,
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--background);
          color: var(--text-main);
          font-size: 1rem;
        }

        .file-input-wrapper {
          position: relative;
        }

        .hidden-input {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
          border: 0;
        }

        .file-label {
          display: flex !important;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          border: 2px dashed var(--border);
          border-radius: var(--radius-sm);
          cursor: pointer;
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .file-label:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(45, 90, 39, 0.05);
        }

        .form-actions {
          margin-top: 1rem;
        }

        .form-actions .btn {
          width: 100%;
          justify-content: center;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
}
