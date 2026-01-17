"use client";

import { useState, useEffect } from 'react';
import {
  User, Lock, Bell, Building2, Palette, Globe,
  Shield, Database, Mail, Clock, Smartphone, Save, CheckCircle
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

type Tab = 'perfil' | 'seguridad' | 'notificaciones' | 'empresa' | 'sistema';

export default function ConfigPage() {
  const { settings, toggleDarkMode, updateNotification, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<Tab>('perfil');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile form
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
  });

  // Password form
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  // Company form
  const [company, setCompany] = useState({
    name: 'Campos Deportivos S.A.',
    cuit: '30-12345678-9',
    phone: '+54 11 4000-0000',
    address: 'Av. Corrientes 1234, CABA',
    city: 'Buenos Aires',
    province: 'Buenos Aires',
  });

  useEffect(() => {
    // Load user profile from localStorage or API
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      // Default values
      setProfile({
        name: 'Admin Usuario',
        email: 'admin@campos.com',
        phone: '+54 9 11 1234-5678',
        role: 'Administrador General',
      });
    }
  }, []);

  const handleSaveProfile = async () => {
    try {
      // Save to localStorage (in production, call API)
      localStorage.setItem('user_profile', JSON.stringify(profile));

      // TODO: Call API
      // await fetch('/api/users/me', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profile)
      // });

      showSuccess();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error al guardar el perfil');
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (passwords.new.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      // TODO: Call API
      // await fetch('/api/auth/update-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     current_password: passwords.current,
      //     new_password: passwords.new
      //   })
      // });

      setPasswords({ current: '', new: '', confirm: '' });
      showSuccess();
      alert('Contraseña actualizada correctamente');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error al cambiar la contraseña');
    }
  };

  const handleSaveCompany = async () => {
    try {
      localStorage.setItem('company_info', JSON.stringify(company));
      showSuccess();
    } catch (error) {
      console.error('Error saving company:', error);
      alert('Error al guardar la información');
    }
  };

  const handleSaveNotifications = () => {
    // Settings are already saved via context
    showSuccess();
  };

  const handleSaveSystem = () => {
    // Settings are already saved via context
    showSuccess();
  };

  const showSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'perfil', label: 'Mi Perfil', icon: <User size={18} /> },
    { id: 'seguridad', label: 'Seguridad', icon: <Shield size={18} /> },
    { id: 'notificaciones', label: 'Notificaciones', icon: <Bell size={18} /> },
    { id: 'empresa', label: 'Empresa', icon: <Building2 size={18} /> },
    { id: 'sistema', label: 'Sistema', icon: <Database size={18} /> },
  ];

  const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="config-page">
      <div className="page-header">
        <h1>Configuración</h1>
        <p>Gestiona las preferencias del sistema y tu cuenta</p>
      </div>

      {/* Success toast */}
      {saveSuccess && (
        <div className="success-toast">
          <CheckCircle size={20} />
          <span>Cambios guardados correctamente</span>
        </div>
      )}

      <div className="config-container">
        {/* Tabs */}
        <div className="tabs-sidebar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as Tab)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="tab-content">
          {/* Perfil Tab */}
          {activeTab === 'perfil' && (
            <div className="section">
              <h2>Información Personal</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Cargo</label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Foto de Perfil</label>
                  <div className="file-upload">
                    <input type="file" accept="image/*" id="avatar" />
                    <label htmlFor="avatar" className="upload-label">
                      <User size={20} />
                      Seleccionar imagen
                    </label>
                  </div>
                </div>
              </div>
              <button className="btn-save" onClick={handleSaveProfile}>
                <Save size={18} />
                Guardar Cambios
              </button>
            </div>
          )}

          {/* Seguridad Tab */}
          {activeTab === 'seguridad' && (
            <div className="section">
              <h2>Seguridad de la Cuenta</h2>

              <div className="security-section">
                <h3>Cambiar Contraseña</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Contraseña Actual</label>
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    />
                  </div>
                  <div className="form-group"></div>
                  <div className="form-group">
                    <label>Nueva Contraseña</label>
                    <input
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirmar Contraseña</label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </div>
                </div>
                <button className="btn-save" onClick={handleChangePassword}>
                  <Lock size={18} />
                  Actualizar Contraseña
                </button>
              </div>

              <div className="security-section">
                <h3>Autenticación de Dos Factores (2FA)</h3>
                <div className="toggle-option">
                  <div>
                    <strong>Activar 2FA</strong>
                    <p>Agrega una capa extra de seguridad a tu cuenta</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="security-section">
                <h3>Sesiones Activas</h3>
                <div className="session-list">
                  <div className="session-item">
                    <Smartphone size={20} />
                    <div className="session-info">
                      <strong>Chrome en Windows</strong>
                      <span>Buenos Aires, Argentina - Activa ahora</span>
                    </div>
                    <button className="btn-danger-sm">Cerrar</button>
                  </div>
                  <div className="session-item">
                    <Smartphone size={20} />
                    <div className="session-info">
                      <strong>Safari en iPhone</strong>
                      <span>Buenos Aires, Argentina - Hace 2 días</span>
                    </div>
                    <button className="btn-danger-sm">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notificaciones Tab */}
          {activeTab === 'notificaciones' && (
            <div className="section">
              <h2>Preferencias de Notificaciones</h2>

              <div className="notification-section">
                <h3>Canales de Notificación</h3>
                <div className="toggle-list">
                  <div className="toggle-option">
                    <div>
                      <Mail size={20} />
                      <div>
                        <strong>Email</strong>
                        <p>Recibir notificaciones por correo electrónico</p>
                      </div>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) => updateNotification('email', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="toggle-option">
                    <div>
                      <Bell size={20} />
                      <div>
                        <strong>Push Notifications</strong>
                        <p>Notificaciones en el navegador</p>
                      </div>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.notifications.push}
                        onChange={(e) => updateNotification('push', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="toggle-option">
                    <div>
                      <Smartphone size={20} />
                      <div>
                        <strong>SMS</strong>
                        <p>Notificaciones por mensaje de texto</p>
                      </div>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.notifications.sms}
                        onChange={(e) => updateNotification('sms', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="notification-section">
                <h3>Eventos a Notificar</h3>
                <div className="toggle-list">
                  <div className="toggle-option">
                    <div>
                      <strong>Nuevos Empleados</strong>
                      <p>Cuando se registra un nuevo empleado</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.notifications.nuevosEmpleados}
                        onChange={(e) => updateNotification('nuevosEmpleados', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="toggle-option">
                    <div>
                      <strong>Solicitudes Pendientes</strong>
                      <p>Vacaciones, permisos u otras solicitudes</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.notifications.solicitudesPendientes}
                        onChange={(e) => updateNotification('solicitudesPendientes', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="toggle-option">
                    <div>
                      <strong>Reportes Semanales</strong>
                      <p>Resumen semanal de actividades</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.notifications.reportesSemanales}
                        onChange={(e) => updateNotification('reportesSemanales', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <button className="btn-save" onClick={handleSaveNotifications}>
                <Save size={18} />
                Guardar Preferencias
              </button>
            </div>
          )}

          {/* Empresa Tab */}
          {activeTab === 'empresa' && (
            <div className="section">
              <h2>Información de la Empresa</h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Nombre de la Empresa</label>
                  <input
                    type="text"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>CUIT/CUIL</label>
                  <input
                    type="text"
                    value={company.cuit}
                    onChange={(e) => setCompany({ ...company, cuit: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono Principal</label>
                  <input
                    type="tel"
                    value={company.phone}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Dirección</label>
                  <input
                    type="text"
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Ciudad</label>
                  <input
                    type="text"
                    value={company.city}
                    onChange={(e) => setCompany({ ...company, city: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Provincia</label>
                  <input
                    type="text"
                    value={company.province}
                    onChange={(e) => setCompany({ ...company, province: e.target.value })}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Logo de la Empresa</label>
                  <div className="file-upload">
                    <input type="file" accept="image/*" id="logo" />
                    <label htmlFor="logo" className="upload-label">
                      <Building2 size={20} />
                      Seleccionar logo
                    </label>
                  </div>
                </div>
              </div>
              <button className="btn-save" onClick={handleSaveCompany}>
                <Save size={18} />
                Actualizar Información
              </button>
            </div>
          )}

          {/* Sistema Tab */}
          {activeTab === 'sistema' && (
            <div className="section">
              <h2>Configuración del Sistema</h2>

              <div className="system-section">
                <h3>Apariencia</h3>
                <div className="toggle-option">
                  <div>
                    <Palette size={20} />
                    <div>
                      <strong>Modo Oscuro</strong>
                      <p>Activa el tema oscuro del sistema</p>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={toggleDarkMode}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="system-section">
                <h3>Región y Formato</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label><Globe size={16} /> Idioma</label>
                    <select
                      value={settings.language}
                      onChange={(e) => updateSettings({ language: e.target.value })}
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label><Clock size={16} /> Zona Horaria</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => updateSettings({ timezone: e.target.value })}
                    >
                      <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                      <option value="America/New_York">New York (GMT-4)</option>
                      <option value="Europe/Madrid">Madrid (GMT+1)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Formato de Fecha</label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => updateSettings({ dateFormat: e.target.value })}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Moneda</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => updateSettings({ currency: e.target.value })}
                    >
                      <option value="ARS">Peso Argentino (ARS)</option>
                      <option value="USD">Dólar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="system-section">
                <h3>Mantenimiento de Datos</h3>
                <div className="maintenance-actions">
                  <button className="btn-outline" onClick={() => alert('Función de exportación en desarrollo')}>
                    <Database size={18} />
                    Exportar Base de Datos
                  </button>
                  <button className="btn-outline" onClick={() => alert('Función de respaldo en desarrollo')}>
                    <Database size={18} />
                    Respaldar Sistema
                  </button>
                  <button className="btn-danger" onClick={() => {
                    if (confirm('¿Estás seguro de limpiar la caché?')) {
                      localStorage.clear();
                      alert('Caché limpiada. La página se recargará.');
                      window.location.reload();
                    }
                  }}>
                    <Database size={18} />
                    Limpiar Caché
                  </button>
                </div>
              </div>

              <button className="btn-save" onClick={handleSaveSystem}>
                <Save size={18} />
                Guardar Configuración
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .config-page {
          max-width: 1400px;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--primary);
        }

        .page-header p {
          color: var(--text-secondary);
        }

        .success-toast {
          position: fixed;
          top: 2rem;
          right: 2rem;
          background: var(--success);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: var(--shadow-lg);
          animation: slideIn 0.3s ease;
          z-index: 9999;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .config-container {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 2rem;
          background: var(--surface);
          border-radius: 12px;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }

        .tabs-sidebar {
          background: var(--background);
          padding: 1.5rem 0;
          border-right: 1px solid var(--border);
        }

        .tab-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.5rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          font-size: 0.95rem;
        }

        .tab-btn:hover {
          background: rgba(0, 51, 102, 0.05);
          color: var(--primary);
        }

        .tab-btn.active {
          background: var(--primary);
          color: white;
          border-left: 4px solid var(--accent);
        }

        .tab-content {
          padding: 2rem;
        }

        .section h2 {
          font-size: 1.5rem;
          color: var(--primary);
          margin-bottom: 1.5rem;
        }

        .section h3 {
          font-size: 1.1rem;
          color: var(--text-main);
          margin-bottom: 1rem;
          margin-top: 2rem;
        }

        .section h3:first-of-type {
          margin-top: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group.full-width {
          grid-column: span 2;
        }

        .form-group label {
          font-weight: 600;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-group input,
        .form-group select {
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 0.95rem;
          background: var(--surface);
          color: var(--text-main);
        }

        .file-upload {
          display: flex;
          align-items: center;
        }

        .file-upload input[type="file"] {
          display: none;
        }

        .upload-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: var(--background);
          border: 2px dashed var(--border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-secondary);
        }

        .upload-label:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .btn-save {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }

        .btn-save:hover {
          background: var(--primary-light);
        }

        .security-section,
        .notification-section,
        .system-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border);
        }

        .security-section:last-child,
        .notification-section:last-child,
        .system-section:last-child {
          border-bottom: none;
        }

        .toggle-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--background);
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .toggle-option > div:first-child {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .toggle-option strong {
          display: block;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }

        .toggle-option p {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin: 0;
        }

        .toggle {
          position: relative;
          display: inline-block;
          width: 52px;
          height: 28px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.3s;
          border-radius: 28px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: var(--primary);
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }

        .toggle-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .session-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .session-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--background);
          border-radius: 8px;
        }

        .session-info {
          flex: 1;
        }

        .session-info strong {
          display: block;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }

        .session-info span {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .btn-danger-sm {
          padding: 0.5rem 1rem;
          background: var(--error);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .btn-danger-sm:hover {
          background: #b91c1c;
        }

        .maintenance-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-outline {
          padding: 0.75rem 1.5rem;
          border: 2px solid var(--primary);
          background: var(--surface);
          color: var(--primary);
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }

        .btn-outline:hover {
          background: var(--primary);
          color: white;
        }

        .btn-danger {
          padding: 0.75rem 1.5rem;
          border: 2px solid var(--error);
          background: var(--surface);
          color: var(--error);
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }

        .btn-danger:hover {
          background: var(--error);
          color: white;
        }

        @media (max-width: 968px) {
          .config-container {
            grid-template-columns: 1fr;
          }

          .tabs-sidebar {
            border-right: none;
            border-bottom: 1px solid var(--border);
            display: flex;
            overflow-x: auto;
            padding: 1rem;
          }

          .tab-btn {
            white-space: nowrap;
            padding: 0.75rem 1rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-group.full-width {
            grid-column: span 1;
          }

          .maintenance-actions {
            flex-direction: column;
          }

          .btn-outline,
          .btn-danger {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
