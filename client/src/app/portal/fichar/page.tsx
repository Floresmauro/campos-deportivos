"use client";

import { useState } from 'react';
import { Camera, CheckCircle, XCircle, MapPin } from 'lucide-react';

export default function FicharPage() {
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

    const startScan = () => {
        setStatus('scanning');

        // Request geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    });
                    // Simulate successful QR scan after 2 seconds
                    setTimeout(() => {
                        setStatus('success');
                    }, 2000);
                },
                (err) => {
                    console.error(err);
                    setStatus('error');
                }
            );
        } else {
            setStatus('error');
        }
    };

    const reset = () => {
        setStatus('idle');
        setLocation(null);
    };

    return (
        <div className="fichar-page">
            <header className="fichar-header">
                <h1>Fichado QR</h1>
                <p>Escanee el código QR de la sede para registrar su entrada o salida.</p>
            </header>

            <div className="scanner-area">
                {status === 'idle' && (
                    <button className="scan-btn" onClick={startScan}>
                        <Camera size={48} />
                        <span>Iniciar Escaneo</span>
                    </button>
                )}

                {status === 'scanning' && (
                    <div className="scanning-animation">
                        <div className="scanner-box">
                            <div className="scanner-line"></div>
                        </div>
                        <p>Escaneando...</p>
                        {location && (
                            <div className="location-info">
                                <MapPin size={16} />
                                <span>Ubicación capturada</span>
                            </div>
                        )}
                    </div>
                )}

                {status === 'success' && (
                    <div className="result success">
                        <CheckCircle size={64} />
                        <h2>¡Fichado Exitoso!</h2>
                        <p>Entrada registrada a las {new Date().toLocaleTimeString()}</p>
                        <button className="btn btn-primary" onClick={reset}>Volver</button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="result error">
                        <XCircle size={64} />
                        <h2>Error</h2>
                        <p>No se pudo acceder a la cámara o ubicación. Verifique los permisos.</p>
                        <button className="btn btn-primary" onClick={reset}>Reintentar</button>
                    </div>
                )}
            </div>

            <style jsx>{`
        .fichar-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--primary) 0%, #001a33 100%);
          color: white;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .fichar-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .fichar-header h1 {
          color: white;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .fichar-header p {
          opacity: 0.8;
        }

        .scanner-area {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .scan-btn {
          background: rgba(255,255,255,0.1);
          border: 2px dashed rgba(255,255,255,0.3);
          color: white;
          padding: 4rem;
          border-radius: var(--radius-lg);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          transition: background 0.2s;
          width: 100%;
        }

        .scan-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .scanning-animation {
          text-align: center;
        }

        .scanner-box {
          width: 250px;
          height: 250px;
          border: 3px solid white;
          border-radius: var(--radius-md);
          position: relative;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .scanner-line {
          position: absolute;
          width: 100%;
          height: 3px;
          background: var(--accent);
          animation: scan 1.5s infinite;
        }

        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }

        .location-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          color: var(--accent);
        }

        .result {
          text-align: center;
          padding: 2rem;
        }

        .result.success {
          color: #4ade80;
        }

        .result.error {
          color: #f87171;
        }

        .result h2 {
          color: inherit;
          margin: 1rem 0 0.5rem;
        }

        .result p {
          margin-bottom: 2rem;
          opacity: 0.9;
        }
      `}</style>
        </div>
    );
}
