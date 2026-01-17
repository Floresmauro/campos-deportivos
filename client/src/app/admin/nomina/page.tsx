"use client";

import { useState } from 'react';
import { Plus, Download, Edit2, Trash2, Search, DollarSign } from 'lucide-react';

interface PayrollRecord {
    id: string;
    user_id: string;
    user_name: string;
    month: number;
    year: number;
    gross_salary: number;
    net_salary: number;
    deductions: number;
    bonuses: number;
    file_url?: string;
    notes?: string;
}

const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function NominaPage() {
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Mock data
    const [records] = useState<PayrollRecord[]>([
        {
            id: '1',
            user_id: '101',
            user_name: 'Juan Pérez',
            month: 12,
            year: 2025,
            gross_salary: 50000,
            net_salary: 42000,
            deductions: 8000,
            bonuses: 5000,
            notes: 'Aguinaldo incluido'
        },
        {
            id: '2',
            user_id: '102',
            user_name: 'María García',
            month: 12,
            year: 2025,
            gross_salary: 45000,
            net_salary: 38000,
            deductions: 7000,
            bonuses: 3000,
        }
    ]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    };

    return (
        <div className="nomina-page">
            <div className="page-header">
                <div>
                    <h1>Gestión de Nómina</h1>
                    <p>Administra los recibos de pago de los empleados</p>
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={20} />
                    Nuevo Recibo
                </button>
            </div>

            {/* Filters */}
            <div className="filters">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por empleado..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="year-select"
                >
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Nómina Mes</span>
                        <span className="stat-value">{formatCurrency(95000)}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Deducciones</span>
                        <span className="stat-value">{formatCurrency(15000)}</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Empleado</th>
                            <th>Período</th>
                            <th>Salario Bruto</th>
                            <th>Deducciones</th>
                            <th>Bonos</th>
                            <th>Salario Neto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <tr key={record.id}>
                                <td>{record.user_name}</td>
                                <td>{MONTHS[record.month - 1]} {record.year}</td>
                                <td>{formatCurrency(record.gross_salary)}</td>
                                <td>{formatCurrency(record.deductions)}</td>
                                <td>{formatCurrency(record.bonuses)}</td>
                                <td className="net-salary">{formatCurrency(record.net_salary)}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-icon" title="Descargar PDF">
                                            <Download size={16} />
                                        </button>
                                        <button className="btn-icon" title="Editar">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="btn-icon btn-danger" title="Eliminar">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Nuevo Recibo de Pago</h2>
                            <button onClick={() => setShowModal(false)} className="modal-close">×</button>
                        </div>
                        <form className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Empleado</label>
                                    <select required>
                                        <option value="">Seleccionar empleado</option>
                                        <option value="101">Juan Pérez</option>
                                        <option value="102">María García</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Mes</label>
                                    <select required>
                                        {MONTHS.map((month, idx) => (
                                            <option key={idx} value={idx + 1}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Año</label>
                                    <input type="number" defaultValue={2025} required />
                                </div>
                                <div className="form-group">
                                    <label>Salario Bruto</label>
                                    <input type="number" step="0.01" placeholder="50000.00" required />
                                </div>
                                <div className="form-group">
                                    <label>Deducciones</label>
                                    <input type="number" step="0.01" placeholder="8000.00" />
                                </div>
                                <div className="form-group">
                                    <label>Bonos</label>
                                    <input type="number" step="0.01" placeholder="5000.00" />
                                </div>
                                <div className="form-group full-width">
                                    <label>Notas</label>
                                    <textarea rows={3} placeholder="Observaciones opcionales..."></textarea>
                                </div>
                                <div className="form-group full-width">
                                    <label>Archivo PDF</label>
                                    <input type="file" accept=".pdf" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    Crear Recibo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
        .nomina-page {
          max-width: 1400px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
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

        .btn-primary {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-primary:hover {
          background: #002244;
        }

        .filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.75rem 1rem;
        }

        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.95rem;
        }

        .year-select {
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: white;
          cursor: pointer;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: var(--shadow-sm);
          display: flex;
          gap: 1rem;
        }

        .stat-icon {
          background: var(--primary);
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table thead {
          background: var(--background);
        }

        .data-table th {
          text-align: left;
          padding: 1rem;
          font-weight: 600;
          color: var(--text-main);
          border-bottom: 2px solid var(--border);
        }

        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          color: var(--text-main);
        }

        .data-table tbody tr:hover {
          background: var(--background);
        }

        .net-salary {
          font-weight: 700;
          color: var(--primary);
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          background: none;
          border: 1px solid var(--border);
          padding: 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .btn-icon:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .btn-danger:hover {
          background: #dc2626;
          border-color: #dc2626;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          color: var(--primary);
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: var(--text-secondary);
          line-height: 1;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
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
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 0.95rem;
        }

        .modal-footer {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }

        .btn-secondary {
          background: white;
          color: var(--text-main);
          border: 1px solid var(--border);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 1rem;
          }

          .filters {
            flex-direction: column;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-group.full-width {
            grid-column: span 1;
          }
        }
      `}</style>
        </div>
    );
}
