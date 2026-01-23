"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Calendar,
    Building2,
    Package,
    Briefcase,
    CalendarDays
} from 'lucide-react';

export default function ReportsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalPredios: 0,
        totalAssets: 0,
        attendanceLast7Days: [] as any[],
        assetsByStatus: {} as any,
        requestsByStatus: {} as any
    });

    useEffect(() => {
        loadReportData();
    }, []);

    const loadReportData = async () => {
        setLoading(true);
        try {
            // 1. Basic counts
            const { count: empCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: stadiumCount } = await supabase.from('stadiums').select('*', { count: 'exact', head: true });
            const { count: assetCount } = await supabase.from('assets').select('*', { count: 'exact', head: true });

            // 2. Attendance history (last 7 days)
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const { data: attendanceData } = await supabase
                .from('attendance')
                .select('timestamp, type')
                .gte('timestamp', weekAgo.toISOString());

            // Process attendance for a simple bar chart
            const daysMap: any = {};
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                daysMap[d.toISOString().split('T')[0]] = 0;
            }
            attendanceData?.forEach(a => {
                const date = a.timestamp.split('T')[0];
                if (daysMap[date] !== undefined && a.type === 'check_in') {
                    daysMap[date]++;
                }
            });
            const attendanceChart = Object.entries(daysMap).map(([date, count]) => ({ date, count }));

            // 3. Asset distribution
            const { data: assetDist } = await supabase.from('assets').select('status');
            const assetStatusMap = assetDist?.reduce((acc: any, cur: any) => {
                acc[cur.status] = (acc[cur.status] || 0) + 1;
                return acc;
            }, {});

            // 4. Requests status
            const { data: requestDist } = await supabase.from('requests').select('status');
            const requestStatusMap = requestDist?.reduce((acc: any, cur: any) => {
                acc[cur.status] = (acc[cur.status] || 0) + 1;
                return acc;
            }, {});

            setStats({
                totalEmployees: empCount || 0,
                totalPredios: stadiumCount || 0,
                totalAssets: assetCount || 0,
                attendanceLast7Days: attendanceChart,
                assetsByStatus: assetStatusMap || {},
                requestsByStatus: requestStatusMap || {}
            });

        } catch (error) {
            console.error('Error loading report:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Cargando inteligencia de negocio...</div>;

    return (
        <div className="reports-page">
            <header className="page-header">
                <div>
                    <h1>Reportes y Estadísticas</h1>
                    <p>Visión general del rendimiento y estado del servicio.</p>
                </div>
            </header>

            {/* Top Cards */}
            <div className="stats-grid">
                <div className="report-card">
                    <div className="icon-box blue"><Briefcase size={24} /></div>
                    <div className="content">
                        <h3>{stats.totalEmployees}</h3>
                        <p>Total Personal</p>
                    </div>
                </div>
                <div className="report-card">
                    <div className="icon-box green"><Building2 size={24} /></div>
                    <div className="content">
                        <h3>{stats.totalPredios}</h3>
                        <p>Predios Gestionados</p>
                    </div>
                </div>
                <div className="report-card">
                    <div className="icon-box orange"><Package size={24} /></div>
                    <div className="content">
                        <h3>{stats.totalAssets}</h3>
                        <p>Activos Registrados</p>
                    </div>
                </div>
            </div>

            <div className="charts-container">
                {/* Attendance Chart */}
                <section className="chart-section">
                    <h2><TrendingUp size={20} /> Asistencia (Últimos 7 días)</h2>
                    <div className="bar-chart">
                        {stats.attendanceLast7Days.map((item, idx) => (
                            <div key={idx} className="bar-wrapper">
                                <div
                                    className="bar"
                                    style={{ height: `${Math.min((item.count / 20) * 100, 100)}%` }}
                                    title={`${item.count} ingresos`}
                                >
                                    <span className="bar-value">{item.count}</span>
                                </div>
                                <span className="bar-label">
                                    {new Date(item.date).toLocaleDateString('es-ES', { weekday: 'narrow' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="side-grid">
                    {/* Assets Status */}
                    <section className="chart-section mini">
                        <h2><Package size={20} /> Estado de Activos</h2>
                        <div className="status-list">
                            {Object.entries(stats.assetsByStatus).map(([status, count]: [any, any]) => (
                                <div key={status} className="status-item">
                                    <div className="status-info">
                                        <span className={`dot ${status}`}></span>
                                        <span className="status-name">{status}</span>
                                    </div>
                                    <span className="status-count">{count}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Requests Summary */}
                    <section className="chart-section mini">
                        <h2><CalendarDays size={20} /> Solicitudes</h2>
                        <div className="status-list">
                            {Object.entries(stats.requestsByStatus).map(([status, count]: [any, any]) => (
                                <div key={status} className="status-item">
                                    <div className="status-info">
                                        <span className={`dot req-${status}`}></span>
                                        <span className="status-name">{status}</span>
                                    </div>
                                    <span className="status-count">{count}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <style jsx>{`
                .reports-page { max-width: 1200px; }
                .page-header { margin-bottom: 2rem; }
                
                .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem; }
                .report-card { background: var(--surface); padding: 1.5rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1.5rem; border: 1px solid var(--border); }
                .icon-box { padding: 1rem; border-radius: 12px; }
                .icon-box.blue { background: #eff6ff; color: #1e40af; }
                .icon-box.green { background: #ecfdf5; color: #065f46; }
                .icon-box.orange { background: #fff7ed; color: #9a3412; }
                .report-card h3 { font-size: 1.5rem; font-weight: 700; margin: 0; }
                .report-card p { color: var(--text-secondary); margin: 0; font-size: 0.9rem; }

                .charts-container { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
                .chart-section { background: var(--surface); padding: 1.5rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid var(--border); }
                .chart-section h2 { font-size: 1.1rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; color: var(--text-main); }
                
                .bar-chart { height: 250px; display: flex; align-items: flex-end; justify-content: space-around; padding-top: 2rem; }
                .bar-wrapper { display: flex; flex-direction: column; align-items: center; height: 100%; width: 40px; }
                .bar { width: 100%; background: var(--primary); border-radius: 4px 4px 0 0; position: relative; transition: height 0.5s ease; cursor: pointer; }
                .bar:hover { background: #004d99; }
                .bar-value { position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 0.8rem; font-weight: 700; color: var(--primary); }
                .bar-label { margin-top: 1rem; font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase; }

                .side-grid { display: flex; flex-direction: column; gap: 2rem; }
                .status-list { display: flex; flex-direction: column; gap: 1rem; }
                .status-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--border); }
                .status-item:last-child { border-bottom: none; }
                .status-info { display: flex; align-items: center; gap: 0.75rem; }
                .dot { width: 10px; height: 10px; border-radius: 50%; }
                
                /* Asset Colors */
                .dot.available { background: #10b981; }
                .dot.maintenance { background: #f59e0b; }
                .dot.out_of_service { background: #ef4444; }
                .dot.in_use { background: #3b82f6; }

                /* Request Colors */
                .dot.req-approved { background: #10b981; }
                .dot.req-pending { background: #f59e0b; }
                .dot.req-rejected { background: #ef4444; }

                .status-name { font-size: 0.9rem; text-transform: capitalize; color: var(--text-secondary); }
                .status-count { font-weight: 700; color: var(--text-main); }

                @media (max-width: 900px) {
                    .charts-container { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
