"use client";

import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, User, Clock, FileCheck } from 'lucide-react';

export default function PersonnelPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'requests'>('employees');

    // Mock data
    const employees = [
        { id: 1, name: 'Juan Pérez', role: 'Operario', stadium: 'Racing Club', status: 'active', phone: '+54 11 1234-5678' },
        { id: 2, name: 'María García', role: 'Encargada', stadium: 'Banfield', status: 'active', phone: '+54 11 2345-6789' },
        { id: 3, name: 'Pedro López', role: 'Chofer', stadium: 'Logística', status: 'vacation', phone: '+54 11 3456-7890' },
        { id: 4, name: 'Laura Martínez', role: 'Administrativa', stadium: 'Oficina Central', status: 'active', phone: '+54 11 4567-8901' },
    ];

    const attendance = [
        { id: 1, name: 'Juan Pérez', date: 'Hoy', checkIn: '07:45', checkOut: '-', location: 'Racing Club' },
        { id: 2, name: 'María García', date: 'Hoy', checkIn: '08:00', checkOut: '-', location: 'Banfield' },
        { id: 3, name: 'Laura Martínez', date: 'Hoy', checkIn: '09:00', checkOut: '-', location: 'Oficina Central' },
    ];

    const requests = [
        { id: 1, name: 'Pedro López', type: 'Vacaciones', dates: '15/01 - 30/01', status: 'approved' },
        { id: 2, name: 'Juan Pérez', type: 'Permiso', dates: '20/01', status: 'pending' },
    ];

    const filtered = employees.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.stadium.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="personnel-page">
            <div className="page-header">
                <div>
                    <h1>Gestión de Personal</h1>
                    <p>Empleados, fichado y solicitudes.</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} />
                    Nuevo Empleado
                </button>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'employees' ? 'active' : ''}`}
                    onClick={() => setActiveTab('employees')}
                >
                    <User size={18} /> Empleados
                </button>
                <button
                    className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
                    onClick={() => setActiveTab('attendance')}
                >
                    <Clock size={18} /> Fichado Hoy
                </button>
                <button
                    className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('requests')}
                >
                    <FileCheck size={18} /> Solicitudes
                </button>
            </div>

            {/* Employees Tab */}
            {activeTab === 'employees' && (
                <>
                    <div className="search-bar">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Buscar empleado..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Rol</th>
                                    <th>Sede Asignada</th>
                                    <th>Teléfono</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((emp) => (
                                    <tr key={emp.id}>
                                        <td><strong>{emp.name}</strong></td>
                                        <td>{emp.role}</td>
                                        <td>{emp.stadium}</td>
                                        <td>{emp.phone}</td>
                                        <td>
                                            <span className={`status-badge ${emp.status}`}>
                                                {emp.status === 'active' ? 'Activo' : 'Vacaciones'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="icon-btn edit"><Pencil size={16} /></button>
                                                <button className="icon-btn delete"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Fecha</th>
                                <th>Entrada</th>
                                <th>Salida</th>
                                <th>Ubicación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((a) => (
                                <tr key={a.id}>
                                    <td><strong>{a.name}</strong></td>
                                    <td>{a.date}</td>
                                    <td className="time-cell">{a.checkIn}</td>
                                    <td className="time-cell">{a.checkOut}</td>
                                    <td>{a.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Empleado</th>
                                <th>Tipo</th>
                                <th>Fechas</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((r) => (
                                <tr key={r.id}>
                                    <td><strong>{r.name}</strong></td>
                                    <td>{r.type}</td>
                                    <td>{r.dates}</td>
                                    <td>
                                        <span className={`status-badge ${r.status}`}>
                                            {r.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td>
                                        {r.status === 'pending' && (
                                            <div className="action-btns">
                                                <button className="btn-sm approve">Aprobar</button>
                                                <button className="btn-sm reject">Rechazar</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <style jsx>{`
        .personnel-page {
          max-width: 1200px;
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

        .tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid var(--border);
          padding-bottom: 0;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--text-secondary);
          font-size: 0.95rem;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          transition: all 0.2s;
        }

        .tab:hover { color: var(--primary); }
        .tab.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
          font-weight: 600;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          margin-bottom: 1.5rem;
        }

        .search-bar input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 1rem;
        }

        .table-wrapper {
          background: white;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th, .data-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }

        .data-table th {
          background: var(--background);
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.85rem;
          text-transform: uppercase;
        }

        .time-cell { font-family: monospace; font-size: 1.1rem; }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.active { background: #d1fae5; color: #065f46; }
        .status-badge.vacation { background: #dbeafe; color: #1e40af; }
        .status-badge.approved { background: #d1fae5; color: #065f46; }
        .status-badge.pending { background: #fef3c7; color: #92400e; }

        .action-btns { display: flex; gap: 0.5rem; }

        .icon-btn {
          padding: 0.5rem;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }
        .icon-btn.edit { background: #e0f2fe; color: #0369a1; }
        .icon-btn.delete { background: #fee2e2; color: #b91c1c; }

        .btn-sm {
          padding: 0.4rem 0.75rem;
          border: none;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          cursor: pointer;
        }
        .btn-sm.approve { background: #d1fae5; color: #065f46; }
        .btn-sm.reject { background: #fee2e2; color: #b91c1c; }
      `}</style>
        </div>
    );
}
