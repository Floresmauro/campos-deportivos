"use client";

import { useState, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, MapPin, Clock, ArrowUpCircle, ArrowDownCircle, ArrowLeft, Home } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface AttendanceRecord {
  id: string;
  type: 'check_in' | 'check_out';
  timestamp: string;
  location_lat: number | null;
  location_lng: number | null;
}

export default function FicharPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeTab, setActiveTab] = useState<'scanner' | 'history'>('history');

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(30);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const startScan = () => {
    setStatus('scanning');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setTimeout(() => {
            setStatus('success');
            loadHistory(); // Reload history after success
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group records by date
  const groupedHistory = history.reduce((groups, record) => {
    const date = formatDate(record.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, AttendanceRecord[]>);

  return (
    <div className="fichar-page">
      <header className="page-header">
        <div className="header-nav">
          <Link href="/portal/dashboard" className="back-btn" title="Volver al portal">
            <ArrowLeft size={20} />
          </Link>
          <Link href="/" className="home-btn" title="Ir al inicio">
            <Home size={20} />
          </Link>
        </div>
        <div>
          <h1>Mi Asistencia</h1>
          <p>Historial y fichaje QR</p>
        </div>
      </header>

      {/* Tab Switcher */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={18} />
          Historial
        </button>
        <button
          className={`tab ${activeTab === 'scanner' ? 'active' : ''}`}
          onClick={() => setActiveTab('scanner')}
        >
          <Camera size={18} />
          Fichar QR
        </button>
      </div>

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="history-section">
          {loadingHistory ? (
            <div className="loading">Cargando historial...</div>
          ) : history.length === 0 ? (
            <div className="empty-state">
              <Clock size={48} />
              <p>No hay registros de asistencia</p>
            </div>
          ) : (
            <div className="history-list">
              {Object.entries(groupedHistory).map(([date, records]) => (
                <div key={date} className="history-group">
                  <div className="date-header">{date}</div>
                  {records.map((record) => (
                    <div key={record.id} className="history-item">
                      <div className={`type-icon ${record.type}`}>
                        {record.type === 'check_in' ?
                          <ArrowDownCircle size={20} /> :
                          <ArrowUpCircle size={20} />
                        }
                      </div>
                      <div className="record-info">
                        <span className="record-type">
                          {record.type === 'check_in' ? 'Entrada' : 'Salida'}
                        </span>
                        <span className="record-time">{formatTime(record.timestamp)}</span>
                      </div>
                      {record.location_lat && (
                        <MapPin size={14} className="location-icon" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Scanner Tab */}
      {activeTab === 'scanner' && (
        <div className="scanner-section">
          <div className="scanner-area">
            {status === 'idle' && (
              <button className="scan-btn" onClick={startScan}>
                <Camera size={48} />
                <span>Iniciar Escaneo</span>
                <p>Escanee el código QR de la sede</p>
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
        </div>
      )}

      <style jsx>{`
                .fichar-page {
                    min-height: 100vh;
                    background: var(--background);
                }

                .page-header {
                    background: linear-gradient(135deg, #1a472a 0%, #2d5a27 100%);
                    color: white;
                    padding: 1.5rem;
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

                .page-header h1 {
                    font-size: 1.25rem;
                    margin: 0;
                    color: white !important;
                }

                .page-header p {
                    font-size: 0.85rem;
                    opacity: 0.8;
                    margin: 0;
                    color: white;
                }

                .tabs {
                    display: flex;
                    background: var(--surface);
                    border-bottom: 1px solid var(--border);
                }

                .tab {
                    flex: 1;
                    padding: 1rem;
                    border: none;
                    background: transparent;
                    color: var(--text-secondary);
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }

                .tab.active {
                    color: var(--primary);
                    border-bottom: 2px solid var(--primary);
                    background: var(--background);
                }

                /* History Styles */
                .history-section {
                    padding: 1rem;
                }

                .loading, .empty-state {
                    text-align: center;
                    padding: 3rem 1rem;
                    color: var(--text-secondary);
                }

                .empty-state svg {
                    opacity: 0.4;
                    margin-bottom: 1rem;
                }

                .history-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .history-group {
                    background: var(--surface);
                    border-radius: var(--radius-md);
                    overflow: hidden;
                    border: 1px solid var(--border);
                }

                .date-header {
                    background: var(--background);
                    padding: 0.75rem 1rem;
                    font-weight: 600;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .history-item {
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    border-bottom: 1px solid var(--border);
                }

                .history-item:last-child {
                    border-bottom: none;
                }

                .type-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .type-icon.check_in {
                    background: #d1fae5;
                    color: #059669;
                }

                .type-icon.check_out {
                    background: #fee2e2;
                    color: #dc2626;
                }

                .record-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .record-type {
                    font-weight: 600;
                    color: var(--text-main);
                }

                .record-time {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                }

                .location-icon {
                    color: var(--text-secondary);
                    opacity: 0.5;
                }

                /* Scanner Styles */
                .scanner-section {
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-height: 60vh;
                }

                .scanner-area {
                    width: 100%;
                    max-width: 400px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .scan-btn {
                    background: var(--surface);
                    border: 2px dashed var(--border);
                    color: var(--text-main);
                    padding: 3rem;
                    border-radius: var(--radius-lg);
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    transition: all 0.2s;
                    width: 100%;
                }

                .scan-btn:hover {
                    border-color: var(--primary);
                    background: var(--background);
                }

                .scan-btn span {
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                .scan-btn p {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }

                .scanning-animation {
                    text-align: center;
                }

                .scanner-box {
                    width: 250px;
                    height: 250px;
                    border: 3px solid var(--primary);
                    border-radius: var(--radius-md);
                    position: relative;
                    overflow: hidden;
                    margin-bottom: 1.5rem;
                    background: var(--surface);
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
                    color: var(--primary);
                }

                .result {
                    text-align: center;
                    padding: 2rem;
                }

                .result.success { color: #4ade80; }
                .result.error { color: #f87171; }

                .result h2 {
                    color: inherit;
                    margin: 1rem 0 0.5rem;
                }

                .result p {
                    margin-bottom: 2rem;
                    color: var(--text-secondary);
                }
            `}</style>
    </div>
  );
}
