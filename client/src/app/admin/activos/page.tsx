"use client";

import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, QrCode, Wrench } from 'lucide-react';

export default function AssetsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Mock data
    const assets = [
        { id: 1, name: 'Tractor John Deere X300', type: 'machinery', serial: 'JD-2024-001', status: 'available', location: 'Racing Club' },
        { id: 2, name: 'Cortadora de Césped Z-Turn', type: 'machinery', serial: 'CT-2023-015', status: 'in_use', location: 'Banfield' },
        { id: 3, name: 'Aireador de Suelo ProCore', type: 'machinery', serial: 'AR-2022-008', status: 'maintenance', location: 'Taller Central' },
        { id: 4, name: 'Rastrillo Manual Grande', type: 'tool', serial: 'RM-2024-042', status: 'available', location: 'Depósito' },
        { id: 5, name: 'Fertilizadora Scotts', type: 'machinery', serial: 'FS-2023-003', status: 'available', location: 'Argentinos Jr.' },
    ];

    const filtered = assets.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.serial.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || a.type === filterType;
        return matchesSearch && matchesType;
    });

    const statusLabels: { [key: string]: { label: string, class: string } } = {
        available: { label: 'Disponible', class: 'success' },
        in_use: { label: 'En Uso', class: 'info' },
        maintenance: { label: 'Mantenimiento', class: 'warning' },
        out_of_service: { label: 'Fuera de Servicio', class: 'error' }
    };

    return (
        <div className="assets-page">
            <div className="page-header">
                <div>
                    <h1>Gestión de Activos</h1>
                    <p>Inventario de maquinaria y herramientas.</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} />
                    Nuevo Activo
                </button>
            </div>

            {/* Filters */}
            <div className="filters-row">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o serie..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="filter-select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="all">Todos los tipos</option>
                    <option value="machinery">Maquinaria</option>
                    <option value="tool">Herramientas</option>
                </select>
            </div>

            {/* Grid */}
            <div className="assets-grid">
                {filtered.map((asset) => (
                    <div key={asset.id} className="asset-card">
                        <div className="asset-header">
                            <Wrench size={24} />
                            <span className={`status-dot ${statusLabels[asset.status].class}`}></span>
                        </div>
                        <h3>{asset.name}</h3>
                        <div className="asset-meta">
                            <span className="serial"><QrCode size={14} /> {asset.serial}</span>
                            <span className="location">{asset.location}</span>
                        </div>
                        <div className="asset-footer">
                            <span className={`status-badge ${statusLabels[asset.status].class}`}>
                                {statusLabels[asset.status].label}
                            </span>
                            <div className="action-btns">
                                <button className="icon-btn edit"><Pencil size={14} /></button>
                                <button className="icon-btn delete"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .assets-page {
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

        .page-header h1 {
          margin-bottom: 0.25rem;
        }

        .page-header p {
          color: var(--text-secondary);
          margin: 0;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filters-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          flex: 1;
          min-width: 250px;
        }

        .search-bar input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 1rem;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: white;
          font-size: 1rem;
        }

        .assets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .asset-card {
          background: white;
          border-radius: var(--radius-md);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 0.2s;
        }

        .asset-card:hover {
          box-shadow: var(--shadow-md);
        }

        .asset-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          color: var(--primary);
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .status-dot.success { background: #22c55e; }
        .status-dot.info { background: #3b82f6; }
        .status-dot.warning { background: #f59e0b; }
        .status-dot.error { background: #ef4444; }

        .asset-card h3 {
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
        }

        .asset-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .serial {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .asset-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border);
          padding-top: 1rem;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.success { background: #dcfce7; color: #166534; }
        .status-badge.info { background: #dbeafe; color: #1e40af; }
        .status-badge.warning { background: #fef3c7; color: #92400e; }
        .status-badge.error { background: #fee2e2; color: #991b1b; }

        .action-btns {
          display: flex;
          gap: 0.5rem;
        }

        .icon-btn {
          padding: 0.4rem;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .icon-btn.edit { background: #e0f2fe; color: #0369a1; }
        .icon-btn.delete { background: #fee2e2; color: #b91c1c; }
      `}</style>
        </div>
    );
}
