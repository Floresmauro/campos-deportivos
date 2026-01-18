"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Search,
    Calendar as CalendarIcon,
    MapPin,
    Clock,
    User,
    Building2,
    Filter,
    Download
} from 'lucide-react';

interface AttendanceRecord {
    id: string;
    timestamp: string;
    type: 'check_in' | 'check_out';
    location_lat: number;
    location_lng: number;
    profiles: {
        full_name: string;
        stadiums?: { name: string } | null;
    } | null;
}

export default function AttendanceAdminPage() {
    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'check_in' | 'check_out'>('all');

    // Filters
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        loadAttendance();
    }, [dateFilter]);

    const loadAttendance = async () => {
        setLoading(true);
        try {
            // Get records for the selected date
            const startOfDay = `${dateFilter}T00:00:00Z`;
            const endOfDay = `${dateFilter}T23:59:59Z`;

            const { data, error } = await supabase
                .from('attendance')
                .select(`
                    *,
                    profiles:user_id (
                        full_name,
                        stadiums:assigned_stadium_id (name)
                    )
                `)
                .gte('timestamp', startOfDay)
                .lte('timestamp', endOfDay)
                .order('timestamp', { ascending: false });

            if (error) throw error;
            setAttendance(data || []);
        } catch (error) {
            console.error('Error loading attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAttendance = attendance.filter(record => {
        const matchesSearch = record.profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || record.type === filterType;
        return matchesSearch && matchesType;
    });

    const stats = {
        total: filteredAttendance.length,
        check_ins: filteredAttendance.filter(r => r.type === 'check_in').length,
        check_outs: filteredAttendance.filter(r => r.type === 'check_out').length,
    };

    return (
        <div className="attendance-admin">
            <header className="page-header">
                <div>
                    <h1>Control de Asistencia</h1>
                    <p>Monitoreo de entradas y salidas del personal.</p>
                </div>
                <div className="header-actions">
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="date-input"
                    />
                    <button className="btn btn-outline">
                        <Download size={18} />
                        Exportar
                    </button>
                </div>
            </header>

            {/* Stats Summary */}
            <div className="stats-row">
                <div className="stat-mini-card">
                    <span className="label">Total Movimientos</span>
                    <span className="value">{stats.total}</span>
                </div>
                <div className="stat-mini-card">
                    <span className="label">Entradas</span>
                    <span className="value check-in">{stats.check_ins}</span>
                </div>
                <div className="stat-mini-card">
                    <span className="label">Salidas</span>
                    <span className="value check-out">{stats.check_outs}</span>
                </div>
            </div>

            <div className="filters-bar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Buscar empleado..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="tab-filters">
                    <button
                        className={`tab-btn ${filterType === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterType('all')}
                    >
                        Todos
                    </button>
                    <button
                        className={`tab-btn ${filterType === 'check_in' ? 'active' : ''}`}
                        onClick={() => setFilterType('check_in')}
                    >
                        Entradas
                    </button>
                    <button
                        className={`tab-btn ${filterType === 'check_out' ? 'active' : ''}`}
                        onClick={() => setFilterType('check_out')}
                    >
                        Salidas
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Cargando registros...</div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Empleado</th>
                                <th>Sede Asignada</th>
                                <th>Tipo</th>
                                <th>Hora</th>
                                <th>Ubicación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAttendance.map((record) => (
                                <tr key={record.id}>
                                    <td>
                                        <div className="user-info">
                                            <div className="avatar-small">
                                                {record.profiles?.full_name.charAt(0)}
                                            </div>
                                            <strong>{record.profiles?.full_name}</strong>
                                        </div>
                                    </td>
                                    <td>{record.profiles?.stadiums?.name || 'No asignada'}</td>
                                    <td>
                                        <span className={`type-badge ${record.type}`}>
                                            {record.type === 'check_in' ? 'Check-In' : 'Check-Out'}
                                        </span>
                                    </td>
                                    <td className="time-cell">
                                        {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td>
                                        <a
                                            href={`https://www.google.com/maps?q=${record.location_lat},${record.location_lng}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="map-link"
                                        >
                                            <MapPin size={14} /> Ver Mapa
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            {filteredAttendance.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="empty-row">
                                        No se encontraron registros para esta fecha.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <style jsx>{`
                .attendance-admin { max-width: 1200px; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .header-actions { display: flex; gap: 1rem; }
                .date-input { padding: 0.5rem; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface); color: var(--text-main); }

                .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
                .stat-mini-card { background: var(--surface); padding: 1.25rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; border: 1px solid var(--border); }
                .stat-mini-card .label { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; }
                .stat-mini-card .value { font-size: 1.75rem; font-weight: 700; color: var(--text-main); }
                .stat-mini-card .value.check-in { color: #059669; }
                .stat-mini-card .value.check-out { color: #d97706; }

                .filters-bar { background: var(--surface); padding: 1rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border); }
                .search-box { display: flex; align-items: center; gap: 0.75rem; flex: 1; max-width: 400px; }
                .search-box input { border: none; outline: none; width: 100%; font-size: 0.95rem; background: transparent; color: var(--text-main); }
                
                .tab-filters { display: flex; background: var(--background); padding: 0.25rem; border-radius: var(--radius-md); }
                .tab-btn { padding: 0.5rem 1rem; border: none; background: none; cursor: pointer; border-radius: var(--radius-md); font-size: 0.9rem; font-weight: 500; color: var(--text-secondary); }
                .tab-btn.active { background: var(--surface); color: var(--primary); box-shadow: var(--shadow-sm); }

                .table-container { background: var(--surface); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); overflow: hidden; border: 1px solid var(--border); }
                .data-table { width: 100%; border-collapse: collapse; }
                .data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--border); }
                .data-table th { background: var(--background); font-weight: 600; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase; }
                
                .user-info { display: flex; align-items: center; gap: 0.75rem; }
                .avatar-small { width: 32px; height: 32px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.8rem; }
                
                .type-badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
                .type-badge.check_in { background: #d1fae5; color: #065f46; }
                .type-badge.check_out { background: #fef3c7; color: #92400e; }

                .time-cell { font-family: monospace; font-weight: 600; font-size: 1rem; }
                .map-link { display: inline-flex; align-items: center; gap: 0.25rem; color: var(--primary); text-decoration: none; font-size: 0.85rem; }
                .map-link:hover { text-decoration: underline; }

                .loading-state, .empty-row { padding: 3rem; text-align: center; color: var(--text-secondary); }
            `}</style>
        </div>
    );
}
