"use client";

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Truck, CheckCircle, XCircle, Info, RefreshCw, Move, ArrowLeft, Home, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const QRScanner = dynamic(() => import('@/components/common/QRScanner'), {
  ssr: false,
  loading: () => <div className="scanner-placeholder">Cargando Cámara...</div>
});

export default function QRAssetsPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'scanning' | 'options' | 'validating' | 'success' | 'error'>('idle');
  const [scannedQr, setScannedQr] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [stadiums, setStadiums] = useState<any[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Request GPS location
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setMessage('Tu navegador no soporta geolocalización');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setStatus('scanning');
      },
      (error) => {
        console.error("Geo error:", error);
        setMessage('Error al obtener ubicación. Por favor, activa el GPS.');
      },
      { enableHighAccuracy: true }
    );
  };

  // Fetch stadiums when entering options
  const fetchStadiums = async () => {
    try {
      const resp = await fetch('http://localhost:3001/api/stadiums');
      const data = await resp.json();
      setStadiums(data);
    } catch (error) {
      console.error("Error fetching stadiums:", error);
    }
  };

  const handleScanSuccess = useCallback((decodedText: string) => {
    setScannedQr(decodedText);
    setStatus('options');
    fetchStadiums();
  }, []);

  const handleAction = async (action: 'receive' | 'transfer', targetStadiumId?: string) => {
    if (!scannedQr || !user) return;

    setStatus('validating');
    try {
      const response = await fetch('http://localhost:3001/api/qr/asset-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetQrCode: scannedQr,
          userId: user.id,
          action,
          targetStadiumId,
          lat: location?.lat || null,
          lng: location?.lng || null
        })
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.message || result.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setStatus('error');
      setMessage('Error de conexión con el servidor');
    }
  };

  return (
    <div className="portal-container">
      <header className="page-header">
        <div className="header-nav">
          <Link href="/portal/dashboard" className="back-btn" title="Volver al portal">
            <ArrowLeft size={20} />
          </Link>
          <Link href="/" className="home-btn" title="Ir al inicio">
            <Home size={20} />
          </Link>
        </div>
        <div className="assets-header">
          <h1>Movimiento de Activos</h1>
          <p>Escanea el código QR de la maquinaria para registrar su traslado o recepción</p>
        </div>
      </header>

      <div className="assets-card">
        {status === 'idle' && (
          <div className="state-view">
            <Truck size={48} className="icon-main" />
            <div className="instructions">
              <h3>Control de Maquinaria</h3>
              <p>Para evitar fraude, necesitamos verificar tu ubicación GPS.</p>
              <button className="btn-primary" onClick={requestLocation}>
                <MapPin size={18} style={{ marginRight: '0.5rem' }} />
                Activar GPS y Escanear
              </button>
              <details style={{ marginTop: '1rem', width: '100%' }}>
                <summary style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  padding: '0.5rem'
                }}>
                  Solo para emergencias técnicas
                </summary>
                <div style={{
                  marginTop: '0.5rem',
                  padding: '1rem',
                  background: 'rgba(220, 38, 38, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(220, 38, 38, 0.3)'
                }}>
                  <p style={{ fontSize: '0.8rem', margin: '0 0 0.75rem 0', color: 'var(--text-secondary)' }}>
                    ⚠️ <strong>Advertencia:</strong> Este modo NO valida ubicación. El sistema registrará que fue sin verificación.
                  </p>
                  <button
                    className="btn-outline"
                    onClick={() => setStatus('scanning')}
                    style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}
                  >
                    Continuar sin GPS
                  </button>
                </div>
              </details>
            </div>
          </div>
        )}

        {status === 'scanning' && (
          <div className="state-view">
            <QRScanner onScanSuccess={handleScanSuccess} />
            <div className="scan-info">
              {location ? (
                <>
                  <MapPin size={16} />
                  <span>GPS Activo - Escanea el código de la maquinaria</span>
                </>
              ) : (
                <>
                  <XCircle size={16} style={{ color: '#dc2626' }} />
                  <span style={{ color: '#dc2626' }}>⚠️ Sin verificación GPS - Se registrará como no validado</span>
                </>
              )}
            </div>
            <button className="btn-outline" onClick={() => setStatus('idle')}>
              Cancelar
            </button>
          </div>
        )}

        {status === 'options' && (
          <div className="state-view">
            <Info size={40} color="var(--primary)" />
            <h3>Maquinaria Identificada</h3>
            <p>¿Qué acción deseas realizar?</p>

            <div className="action-grid">
              <div className="action-box">
                <h4><RefreshCw size={20} /> Recepción</h4>
                <p>Confirmar que la maquinaria llegó a esta sede.</p>
                <select
                  className="stadium-select"
                  onChange={(e) => handleAction('receive', e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Seleccionar Sede...</option>
                  {stadiums.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="action-separator">O</div>

              <div className="action-box">
                <h4><Move size={20} /> Traslado</h4>
                <p>Iniciar el traslado de esta maquinaria hacia otra ubicación.</p>
                <button
                  className="btn-primary-sm"
                  onClick={() => handleAction('transfer')}
                >
                  Iniciar Traslado
                </button>
              </div>
            </div>

            <button className="btn-outline" onClick={() => setStatus('idle')}>
              Cancelar
            </button>
          </div>
        )}

        {status === 'validating' && (
          <div className="state-view loading">
            <div className="spinner"></div>
            <p>Procesando movimiento...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="state-view result">
            <CheckCircle size={64} color="var(--success)" />
            <h2>Registro Exitoso</h2>
            <p>{message}</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Continuar
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="state-view result">
            <XCircle size={64} color="var(--error)" />
            <h2>Error en Registro</h2>
            <p>{message}</p>
            <button className="btn-primary" onClick={() => setStatus('scanning')}>
              Reintentar Escaneo
            </button>
            <button className="btn-outline" onClick={() => setStatus('idle')}>
              Cancelar
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .portal-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 1rem;
        }

        .page-header {
          background: linear-gradient(135deg, #1a472a 0%, #2d5a27 100%);
          color: white;
          padding: 1.5rem;
          margin: -1rem -1rem 2rem -1rem;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
        }

        .header-nav {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
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

        .assets-header {
          text-align: center;
        }

        .assets-header h1 {
          font-size: 1.5rem;
          color: white !important;
          margin-bottom: 0.5rem;
        }

        .assets-header p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          margin: 0;
        }

        .assets-card {
          background: var(--surface);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
          min-height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .state-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          text-align: center;
        }

        .icon-main {
          color: var(--primary);
        }

        .btn-primary {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
        }

        .btn-primary-sm {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.6rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
        }

        .btn-outline {
          background: none;
          border: 2px solid var(--border);
          color: var(--text-secondary);
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
        }

        .action-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          margin: 1rem 0;
        }

        .action-box {
          background: var(--background);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          text-align: left;
        }

        .action-box h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: var(--primary);
        }

        .action-box p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .stadium-select {
          width: 100%;
          padding: 0.6rem;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-main);
        }

        .action-separator {
          font-weight: 700;
          color: var(--text-secondary);
          font-size: 0.8rem;
        }

        .loading .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .result h2 {
          color: var(--text-main);
        }

        .scanner-placeholder {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--background);
          color: var(--text-secondary);
          border-radius: 12px;
        }

        @media (min-width: 480px) {
          .action-grid {
            flex-direction: row;
            align-items: stretch;
          }
          .action-box {
            flex: 1;
          }
          .action-separator {
            display: flex;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
