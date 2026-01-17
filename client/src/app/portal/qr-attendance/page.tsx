"use client";

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, CheckCircle, XCircle, Clock, Navigation } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Dynamically import QRScanner to avoid SSR issues
const QRScanner = dynamic(() => import('@/components/common/QRScanner'), {
    ssr: false,
    loading: () => <div className="scanner-placeholder">Cargando Cámara...</div>
});

export default function QRAttendancePage() {
    const { user } = useAuth();
    const [status, setStatus] = useState<'idle' | 'scanning' | 'validating' | 'success' | 'error'>('idle');
    const [geoStatus, setGeoStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [message, setMessage] = useState('');
    const [attendanceType, setAttendanceType] = useState<'check_in' | 'check_out'>('check_in');

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setGeoStatus('denied');
            setMessage('Tu navegador no soporta geolocalización');
            return;
        }

        setGeoStatus('pending');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setGeoStatus('granted');
                setStatus('scanning');
            },
            (error) => {
                console.error("Geo error:", error);
                setGeoStatus('denied');
                setMessage('Error al obtener ubicación. Por favor, activa el GPS.');
            },
            { enableHighAccuracy: true }
        );
    };

    const handleScanSuccess = useCallback(async (decodedText: string) => {
        if (status !== 'scanning' || !location || !user) return;

        setStatus('validating');
        try {
            const response = await fetch('http://localhost:3001/api/qr/clock-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    qrCodeId: decodedText,
                    userId: user.id,
                    lat: location.lat,
                    lng: location.lng,
                    type: attendanceType
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
    }, [status, location, user, attendanceType]);

    return (
        <div className="portal-container">
            <div className="attendance-header">
                <h1>Fichaje por QR</h1>
                <p>Registra tu entrada o salida escaneando el código de la sede</p>
            </div>

            <div className="attendance-card">
                {status === 'idle' && (
                    <div className="state-view">
                        <div className="type-selector">
                            <button
                                className={`type-btn ${attendanceType === 'check_in' ? 'active' : ''}`}
                                onClick={() => setAttendanceType('check_in')}
                            >
                                <Clock size={20} /> Entrada
                            </button>
                            <button
                                className={`type-btn ${attendanceType === 'check_out' ? 'active' : ''}`}
                                onClick={() => setAttendanceType('check_out')}
                            >
                                <Clock size={20} /> Salida
                            </button>
                        </div>

                        <div className="instructions">
                            <Navigation size={48} className="icon-pulse" />
                            <h3>Paso 1: Ubicación</h3>
                            <p>Necesitamos validar que te encuentras en la sede asignada.</p>
                            <button className="btn-primary" onClick={requestLocation}>
                                Activar GPS y Empezar
                            </button>
                        </div>
                    </div>
                )}

                {status === 'scanning' && (
                    <div className="state-view">
                        <div className="scan-overlay">
                            <QRScanner onScanSuccess={handleScanSuccess} />
                            <div className="scan-info">
                                <MapPin size={16} />
                                <span>GPS Activo - Escanea el código de la sede</span>
                            </div>
                        </div>
                        <button className="btn-outline" onClick={() => setStatus('idle')}>
                            Cancelar
                        </button>
                    </div>
                )}

                {(status === 'validating') && (
                    <div className="state-view loading">
                        <div className="spinner"></div>
                        <p>Validando ubicación y registro...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="state-view result">
                        <CheckCircle size={64} color="var(--success)" />
                        <h2>¡Fichaje Exitoso!</h2>
                        <p>{message}</p>
                        <button className="btn-primary" onClick={() => window.location.reload()}>
                            Volver al inicio
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="state-view result">
                        <XCircle size={64} color="var(--error)" />
                        <h2>Error de Fichaje</h2>
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
          padding: 2rem 1rem;
        }

        .attendance-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .attendance-header h1 {
          font-size: 1.75rem;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .attendance-card {
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

        .type-selector {
          display: flex;
          gap: 1rem;
          width: 100%;
          margin-bottom: 1rem;
        }

        .type-btn {
          flex: 1;
          padding: 1rem;
          border-radius: 12px;
          border: 2px solid var(--border);
          background: var(--background);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .type-btn.active {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(0, 51, 102, 0.05);
        }

        .instructions {
          padding: 1rem;
        }

        .icon-pulse {
          color: var(--primary);
          margin-bottom: 1rem;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
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

        .scan-overlay {
          width: 100%;
          position: relative;
        }

        .scan-info {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--success);
          font-size: 0.9rem;
          font-weight: 600;
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
          margin-bottom: 0.5rem;
        }

        .result p {
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .scanner-placeholder {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eee;
          border-radius: 12px;
        }
      `}</style>
        </div>
    );
}
