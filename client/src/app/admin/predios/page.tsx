"use client";

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, MapPin, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

interface Predio {
  id: string;
  name: string;
  address: string;
  city: string;
  location_lat: number | null;
  location_lng: number | null;
  created_at: string;
}

// Move form component outside to prevent re-creation
const PredioForm = ({
  formData,
  setFormData,
  onSubmit,
  submitLabel
}: {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
}) => (
  <form onSubmit={onSubmit} className="stadium-form">
    <div className="form-group">
      <label>Nombre del Predio *</label>
      <input
        type="text"
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        required
        placeholder="Ej: Predio Racing Club"
      />
    </div>
    <div className="form-group">
      <label>Dirección</label>
      <input
        type="text"
        value={formData.address}
        onChange={e => setFormData({ ...formData, address: e.target.value })}
        placeholder="Ej: Av. Mitre 1234"
      />
    </div>
    <div className="form-group">
      <label>Ciudad</label>
      <input
        type="text"
        value={formData.city}
        onChange={e => setFormData({ ...formData, city: e.target.value })}
        placeholder="Ej: Avellaneda"
      />
    </div>
    <div className="form-row">
      <div className="form-group">
        <label>Latitud (GPS)</label>
        <input
          type="number"
          step="any"
          value={formData.location_lat}
          onChange={e => setFormData({ ...formData, location_lat: e.target.value })}
          placeholder="-34.6692"
        />
      </div>
      <div className="form-group">
        <label>Longitud (GPS)</label>
        <input
          type="number"
          step="any"
          value={formData.location_lng}
          onChange={e => setFormData({ ...formData, location_lng: e.target.value })}
          placeholder="-58.3650"
        />
      </div>
    </div>

    <button type="submit" className="btn btn-primary btn-block">{submitLabel}</button>

    <style jsx>{`
      .stadium-form { display: flex; flex-direction: column; gap: 1rem; }
      .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
      .form-group label { font-weight: 500; color: var(--text-main); }
      .form-group input, .form-group select {
        padding: 0.75rem;
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        font-size: 1rem;
        background: var(--background);
        color: var(--text-main);
      }
      .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      .btn-block { width: 100%; margin-top: 0.5rem; }
    `}</style>
  </form>
);

export default function PrediosPage() {
  const [predios, setPredios] = useState<Predio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedPredio, setSelectedPredio] = useState<Predio | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    location_lat: '',
    location_lng: ''
  });

  useEffect(() => {
    loadPredios();
  }, []);

  const loadPredios = async () => {
    try {
      const { data, error } = await supabase
        .from('stadiums')
        .select('*')
        .order('name');

      if (error) throw error;
      setPredios(data || []);
    } catch (error) {
      console.error('Error loading predios:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      location_lat: '',
      location_lng: ''
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const insertData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        location_lat: formData.location_lat ? parseFloat(formData.location_lat) : null,
        location_lng: formData.location_lng ? parseFloat(formData.location_lng) : null
      };

      const { data, error } = await supabase.from('stadiums').insert([insertData]).select().single();
      if (error) throw error;

      setIsCreateModalOpen(false);
      resetForm();
      loadPredios();

      // Show QR modal for new predio
      if (data) {
        setSelectedPredio(data);
        setIsQrModalOpen(true);
      }
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPredio) return;

    try {
      const updateData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        location_lat: formData.location_lat ? parseFloat(formData.location_lat) : null,
        location_lng: formData.location_lng ? parseFloat(formData.location_lng) : null
      };

      const { error } = await supabase.from('stadiums').update(updateData).eq('id', selectedPredio.id);
      if (error) throw error;

      setIsEditModalOpen(false);
      setSelectedPredio(null);
      resetForm();
      loadPredios();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este predio?')) return;

    try {
      const { error } = await supabase.from('stadiums').delete().eq('id', id);
      if (error) throw error;
      loadPredios();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const openEditModal = (predio: Predio) => {
    setSelectedPredio(predio);
    setFormData({
      name: predio.name,
      address: predio.address || '',
      city: predio.city || '',
      location_lat: predio.location_lat?.toString() || '',
      location_lng: predio.location_lng?.toString() || ''
    });
    setIsEditModalOpen(true);
  };

  const openQrModal = (predio: Predio) => {
    setSelectedPredio(predio);
    setIsQrModalOpen(true);
  };

  const filtered = predios.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.city || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="stadiums-page">
      <div className="page-header">
        <div>
          <h1>Gestión de Predios</h1>
          <p>Administre los predios para fichaje de personal.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setIsCreateModalOpen(true); }}>
          <Plus size={18} />
          Nuevo Predio
        </button>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Buscar por nombre o ciudad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Cargando predios...</div>
      ) : predios.length === 0 ? (
        <div className="empty-state">
          <MapPin size={48} />
          <p>No hay predios registrados. Crea el primero.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((predio) => (
                <tr key={predio.id}>
                  <td>
                    <div className="cell-with-icon">
                      <MapPin size={16} />
                      {predio.name}
                    </div>
                    <div className="predio-meta">
                      <p>{predio.address}, {predio.city}</p>
                    </div>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="icon-btn qr" onClick={() => openQrModal(predio)} title="Ver QR">
                        <QrCode size={16} />
                      </button>
                      <button className="icon-btn edit" onClick={() => openEditModal(predio)} title="Editar">
                        <Pencil size={16} />
                      </button>
                      <button className="icon-btn delete" onClick={() => handleDelete(predio.id)} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nuevo Predio">
        <PredioForm formData={formData} setFormData={setFormData} onSubmit={handleCreate} submitLabel="Crear Predio" />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedPredio(null); }} title="Editar Predio">
        <PredioForm formData={formData} setFormData={setFormData} onSubmit={handleEdit} submitLabel="Guardar Cambios" />
      </Modal>

      {/* QR Modal */}
      <Modal isOpen={isQrModalOpen} onClose={() => { setIsQrModalOpen(false); setSelectedPredio(null); }} title="Código QR para Fichaje">
        {selectedPredio && (
          <div className="qr-container">
            <div className="qr-preview">
              <QRCodeSVG value={selectedPredio.id} size={200} level="H" includeMargin={true} fgColor="#1a472a" />
            </div>
            <h3>{selectedPredio.name}</h3>
            <p>Los empleados pueden escanear este código para fichar su entrada/salida.</p>
            <button className="btn btn-primary btn-block" onClick={() => window.print()}>
              Imprimir QR
            </button>
          </div>
        )}
      </Modal>

      <style jsx>{`
        .stadiums-page { max-width: 1200px; }
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
        .btn { display: inline-flex; align-items: center; gap: 0.5rem; }
        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--surface);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          margin-bottom: 1.5rem;
          border: 1px solid var(--border);
        }
        .search-bar input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 1rem;
          background: transparent;
          color: var(--text-main);
        }
        .loading-state, .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
        }
        .empty-state svg { margin-bottom: 1rem; opacity: 0.5; }
        .table-wrapper {
          background: var(--surface);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          overflow-x: auto;
          border: 1px solid var(--border);
        }
        .data-table { width: 100%; border-collapse: collapse; }
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
        .status-badge.active { background: #d1fae5; color: #065f46; }
        .status-badge.maintenance { background: #fef3c7; color: #92400e; }
        .status-badge.inactive { background: #e5e7eb; color: #4b5563; }
        .action-btns { display: flex; gap: 0.5rem; }
        .icon-btn {
          padding: 0.5rem;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background 0.2s;
        }
        .icon-btn.qr { background: #e0f2fe; color: #0369a1; }
        .icon-btn.edit { background: #fef3c7; color: #92400e; }
        .icon-btn.delete { background: #fee2e2; color: #b91c1c; }
        .icon-btn:hover { filter: brightness(0.9); }
        .qr-container { text-align: center; }
        .qr-preview {
          background: white;
          padding: 1rem;
          border-radius: var(--radius-md);
          display: inline-block;
          margin-bottom: 1rem;
        }
        .qr-container h3 { margin: 0 0 0.5rem; color: var(--primary); }
        .qr-container p { color: var(--text-secondary); margin-bottom: 1.5rem; }
        .btn-block { width: 100%; }
      `}</style>
    </div>
  );
}
