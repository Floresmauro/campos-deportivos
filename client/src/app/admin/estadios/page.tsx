"use client";

import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, MapPin } from 'lucide-react';

export default function StadiumsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data
    const stadiums = [
        { id: 1, name: 'Estadio Racing Club', city: 'Avellaneda', manager: 'Carlos Ruiz', status: 'Activo' },
        { id: 2, name: 'Estadio Banfield', city: 'Banfield', manager: 'María García', status: 'Activo' },
        { id: 3, name: 'Defensa y Justicia', city: 'Florencio Varela', manager: 'Pedro López', status: 'Activo' },
        { id: 4, name: 'Argentinos Juniors', city: 'La Paternal', manager: 'Laura Martínez', status: 'Mantenimiento' },
    ];

    const filtered = stadiums.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="stadiums-page">
            <div className="page-header">
                <div>
                    <h1>Gestión de Estadios</h1>
                    <p>Administre las sedes y asigne encargados.</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} />
                    Nuevo Estadio
                </button>
            </div>

            {/* Search */}
            <div className="search-bar">
                <Search size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre o ciudad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Ciudad</th>
                            <th>Encargado</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((stadium) => (
                            <tr key={stadium.id}>
                                <td>
                                    <div className="cell-with-icon">
                                        <MapPin size={16} />
                                        {stadium.name}
                                    </div>
                                </td>
                                <td>{stadium.city}</td>
                                <td>{stadium.manager}</td>
                                <td>
                                    <span className={`status-badge ${stadium.status === 'Activo' ? 'active' : 'maintenance'}`}>
                                        {stadium.status}
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

            <style jsx>{`
        .stadiums-page {
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

        .data-table th,
        .data-table td {
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

        .cell-with-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary);
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.maintenance {
          background: #fef3c7;
          color: #92400e;
        }

        .action-btns {
          display: flex;
          gap: 0.5rem;
        }

        .icon-btn {
          padding: 0.5rem;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background 0.2s;
        }

        .icon-btn.edit {
          background: #e0f2fe;
          color: #0369a1;
        }

        .icon-btn.delete {
          background: #fee2e2;
          color: #b91c1c;
        }

        .icon-btn:hover {
          filter: brightness(0.9);
        }
      `}</style>
        </div>
    );
}
