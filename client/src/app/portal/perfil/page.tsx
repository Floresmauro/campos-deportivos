"use client";

import { useState } from 'react';
import Link from 'next/link';
import { User as UserIcon, Phone, Mail, Building2, Shield, Edit, ArrowLeft, Home, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Modal from '@/components/Modal';

export default function PerfilPage() {
  const { user, updateProfile } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    dni: user?.dni || '',
    obra_social: user?.obra_social || '',
    emergency_contact_name: user?.emergency_contact_name || '',
    emergency_contact_phone: user?.emergency_contact_phone || '',
    avatar_url: user?.avatar_url || ''
  });

  if (!user) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('bucket', 'avatars');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      });

      if (!response.ok) throw new Error('Error al subir imagen');
      const data = await response.json();
      setFormData(prev => ({ ...prev, avatar_url: data.url }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      setIsEditModalOpen(false);
    } catch (error) {
      alert('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="perfil-page">
      <header className="perfil-header">
        <div className="header-nav">
          <Link href="/portal/dashboard" className="back-btn" title="Volver al portal">
            <ArrowLeft size={20} />
          </Link>
          <Link href="/" className="home-btn" title="Ir al inicio">
            <Home size={20} />
          </Link>
        </div>
        <div className="avatar-large">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.full_name} />
          ) : (
            <UserIcon size={48} />
          )}
        </div>
        <h1>{user.full_name}</h1>
        <p style={{ textTransform: 'capitalize' }}>{user.role === 'employee' ? 'Empleado' : user.role === 'manager' ? 'Encargado' : 'Administrador'}</p>
      </header>

      <main className="perfil-main">
        <section className="info-section">
          <div className="section-header">
            <h2>Información Personal</h2>
            <button className="edit-btn" onClick={() => setIsEditModalOpen(true)}>
              <Edit size={16} /> Editar
            </button>
          </div>

          <div className="info-list">
            <div className="info-item">
              <Mail size={20} className="icon" />
              <div>
                <span className="label">Email</span>
                <span className="value">{user.email}</span>
              </div>
            </div>
            <div className="info-item">
              <Phone size={20} className="icon" />
              <div>
                <span className="label">Teléfono</span>
                <span className="value">{user.phone || '-'}</span>
              </div>
            </div>
            <div className="info-item">
              <UserIcon size={20} className="icon" />
              <div>
                <span className="label">DNI</span>
                <span className="value">{user.dni || '-'}</span>
              </div>
            </div>
            <div className="info-item">
              <Shield size={20} className="icon" />
              <div>
                <span className="label">Obra Social</span>
                <span className="value">{user.obra_social || '-'}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="info-section">
          <h2>Datos Laborales</h2>
          <div className="info-grid">
            <div className="info-card">
              <span className="card-label">Fecha de Ingreso</span>
              <span className="card-value">{user.start_date ? new Date(user.start_date).toLocaleDateString() : '-'}</span>
            </div>
            <div className="info-card">
              <span className="card-label">Sede</span>
              <span className="card-value">{user.assigned_stadium ? 'Asignado' : 'Oficina'}</span>
            </div>
          </div>
        </section>

        {(user.emergency_contact_name || user.emergency_contact_phone) && (
          <section className="info-section">
            <h2>Contacto de Emergencia</h2>
            <div className="info-list">
              <div className="info-item">
                <UserIcon size={20} className="icon" />
                <div>
                  <span className="label">Nombre</span>
                  <span className="value">{user.emergency_contact_name || '-'}</span>
                </div>
              </div>
              <div className="info-item">
                <Phone size={20} className="icon" />
                <div>
                  <span className="label">Teléfono</span>
                  <span className="value">{user.emergency_contact_phone || '-'}</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Perfil">
        <form onSubmit={handleUpdate} className="edit-profile-form">
          <div className="photo-edit">
            <div className="avatar-preview">
              {formData.avatar_url ? (
                <img src={formData.avatar_url} alt="Profile" />
              ) : (
                <UserIcon size={32} />
              )}
            </div>
            <label className="btn-upload-photo">
              <Camera size={16} /> {uploading ? 'Subiendo...' : 'Cambiar Foto'}
              <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
            </label>
          </div>

          <div className="form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Obra Social</label>
              <input
                type="text"
                value={formData.obra_social}
                onChange={(e) => setFormData({ ...formData, obra_social: e.target.value })}
              />
            </div>
          </div>

          <div className="form-section-title">En caso de emergencia</div>
          <div className="form-group">
            <label>Nombre del Contacto</label>
            <input
              type="text"
              value={formData.emergency_contact_name}
              onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Teléfono de Emergencia</label>
            <input
              type="text"
              value={formData.emergency_contact_phone}
              onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </Modal>

      <style jsx>{`
        .perfil-page {
          min-height: 100vh;
          background: var(--background);
        }

        .perfil-header {
          background: linear-gradient(135deg, #1a472a 0%, #2d5a27 100%);
          color: white;
          padding: 3.5rem 1.5rem 2rem;
          text-align: center;
        }

        .header-nav {
          max-width: 600px;
          margin: 0 auto 1.5rem;
          display: flex;
          gap: 0.5rem;
          justify-content: flex-start;
          transform: translateY(-2rem);
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

        .avatar-large {
          width: 96px;
          height: 96px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          overflow: hidden;
          border: 3px solid rgba(255,255,255,0.3);
        }

        .avatar-large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .perfil-header h1 {
          color: white !important;
          font-size: 1.75rem;
          margin-bottom: 0.25rem;
        }

        .perfil-header p {
          opacity: 0.8;
          color: white;
        }

        .perfil-main {
          max-width: 600px;
          margin: 0 auto;
          padding: 1.5rem;
        }

        .info-section {
          background: var(--surface);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          font-size: 1.1rem;
          margin: 0;
        }

        .info-section h2 {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }

        .edit-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: 1px solid var(--border);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.85rem;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .info-item .icon {
          color: var(--primary);
          margin-top: 2px;
        }

        .info-item .label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .info-item .value {
          font-weight: 500;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .info-card {
          background: var(--background);
          padding: 1rem;
          border-radius: var(--radius-sm);
          text-align: center;
        }

        .card-label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .card-value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--primary);
        }

        /* Edit Form */
        .edit-profile-form { display: flex; flex-direction: column; gap: 1rem; }
        .photo-edit { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; background: var(--background); padding: 1rem; border-radius: var(--radius-md); }
        .avatar-preview { width: 64px; height: 64px; border-radius: 50%; background: var(--surface); overflow: hidden; display: flex; align-items: center; justify-content: center; border: 2px solid var(--border); }
        .avatar-preview img { width: 100%; height: 100%; object-fit: cover; }
        .btn-upload-photo { font-size: 0.85rem; font-weight: 600; color: var(--primary); cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group label { font-size: 0.9rem; font-weight: 600; }
        .form-group input { padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface); color: var(--text-main); font-size: 1rem; }
        .form-section-title { font-weight: 700; font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase; margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border); }
        .form-actions { display: flex; justify-content: flex-end; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
