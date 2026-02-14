"use client";

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, QrCode, Wrench, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

interface Asset {
  id: string;
  name: string;
  type: string;
  serial_number: string;
  status: string;
  current_stadium_id: string | null;
  location: string;
  notes?: string | null;
  technical_specs?: Record<string, string> | null;
  created_at: string;
  location_display?: string;
}

interface Stadium {
  id: string;
  name: string;
}

// Form component extracted outside to prevent re-creation on state changes
const AssetForm = ({
  formData,
  setFormData,
  stadiums,
  onSubmit,
  submitLabel
}: {
  formData: any;
  setFormData: (data: any) => void;
  stadiums: Stadium[];
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
}) => (
  <form onSubmit={onSubmit} className="asset-form">
    <div className="form-row">
      <div className="form-group">
        <label>Nombre *</label>
        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
      </div>
      <div className="form-group">
        <label>Nº Serie *</label>
        <input type="text" value={formData.serial_number} onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })} required />
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <label>Tipo *</label>
        <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required>
          <option value="machinery">Maquinaria</option>
          <option value="tool">Herramienta</option>
          <option value="vehicle">Vehículo</option>
          <option value="other">Otro</option>
        </select>
      </div>
      <div className="form-group">
        <label>Estado *</label>
        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} required>
          <option value="available">Disponible</option>
          <option value="in_use">En Uso</option>
          <option value="maintenance">Mantenimiento</option>
          <option value="out_of_service">Fuera de Servicio</option>
        </select>
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <label>Sede</label>
        <select value={formData.current_stadium_id} onChange={(e) => setFormData({ ...formData, current_stadium_id: e.target.value })}>
          <option value="">Sin asignar</option>
          {stadiums.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Ubicación</label>
        <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
      </div>
    </div>
    <div className="form-group">
      <label>Observaciones</label>
      <textarea
        value={formData.notes || ''}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        rows={3}
        placeholder="Detalles adicionales, mantenimiento, especificaciones..."
      />
    </div>
    <div className="form-actions">
      <button type="submit" className="btn btn-primary">{submitLabel}</button>
    </div>
    <style jsx>{`
      .asset-form { display: flex; flex-direction: column; gap: 1rem; }
      .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
      .form-group label { font-weight: 600; font-size: 0.85rem; }
      .form-group input, .form-group select, .form-group textarea { padding: 0.6rem; border: 1px solid var(--border); border-radius: 8px; background: var(--background); color: var(--text-main); }
      .form-actions { display: flex; justify-content: flex-end; padding-top: 1rem; border-top: 1px solid var(--border); }
    `}</style>
  </form>
);

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    type: 'machinery',
    serial_number: '',
    status: 'available',
    current_stadium_id: '',
    location: '',
    notes: ''
  });

  // Load data on mount
  useEffect(() => {
    loadAssets();
    loadStadiums();
  }, []);

  const loadAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          stadiums:current_stadium_id (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedAssets = (data || []).map((asset: any) => ({
        ...asset,
        location_display: asset.stadiums?.name
          ? `${asset.stadiums.name}${asset.location ? ` - ${asset.location}` : ''}`
          : (asset.location || 'Sin ubicación')
      }));

      setAssets(mappedAssets);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStadiums = async () => {
    try {
      const { data, error } = await supabase
        .from('stadiums')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setStadiums(data || []);
    } catch (error) {
      console.error('Error loading stadiums:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const insertData = { ...formData, current_stadium_id: formData.current_stadium_id || null };
      const { data, error } = await supabase.from('assets').insert([insertData]).select().single();
      if (error) throw error;
      setIsCreateModalOpen(false);
      resetForm();
      loadAssets();

      // Show QR modal automatically for the new asset
      if (data) {
        setSelectedAsset({
          ...data,
          location_display: stadiums.find(s => s.id === data.current_stadium_id)?.name || data.location || 'Sin ubicación'
        } as Asset);
        setIsQrModalOpen(true);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    try {
      const updateData = { ...formData, current_stadium_id: formData.current_stadium_id || null };
      const { error } = await supabase.from('assets').update(updateData).eq('id', selectedAsset.id);
      if (error) throw error;
      setIsEditModalOpen(false);
      setSelectedAsset(null);
      resetForm();
      loadAssets();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro?')) return;
    try {
      await supabase.from('assets').delete().eq('id', id);
      loadAssets();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const openEditModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormData({
      name: asset.name,
      type: asset.type,
      serial_number: asset.serial_number || '',
      status: asset.status,
      current_stadium_id: asset.current_stadium_id || '',
      location: asset.location || '',
      notes: asset.notes || ''
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '', type: 'machinery', serial_number: '', status: 'available', current_stadium_id: '', location: '', notes: ''
    });
  };

  const filtered = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.serial_number && a.serial_number.toLowerCase().includes(searchTerm.toLowerCase()));
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
        <button className="btn btn-primary" onClick={() => { resetForm(); setIsCreateModalOpen(true); }}>
          <Plus size={18} /> Nuevo Activo
        </button>
      </div>

      <div className="filters-row">
        <div className="search-bar">
          <Search size={20} />
          <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">Todos</option>
          <option value="machinery">Maquinaria</option>
          <option value="tool">Herramientas</option>
          <option value="vehicle">Vehículos</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <div className="assets-grid">
          {filtered.map(asset => (
            <div key={asset.id} className="asset-card">
              <div className="asset-header">
                <Wrench size={24} />
                <span className={`status-dot ${statusLabels[asset.status]?.class}`}></span>
              </div>
              <h3>{asset.name}</h3>
              <div className="asset-meta">
                <span><QrCode size={14} /> {asset.serial_number}</span>
                <span>{asset.location_display}</span>
                {asset.notes && <p className="asset-notes">{asset.notes}</p>}
                {asset.technical_specs && Object.keys(asset.technical_specs).length > 0 && (
                  <button
                    className="specs-trigger"
                    onClick={() => { setSelectedAsset(asset); setIsSpecsModalOpen(true); }}
                  >
                    Ver Ficha Técnica
                  </button>
                )}
              </div>
              <div className="asset-footer">
                <span className={`status-badge ${statusLabels[asset.status]?.class}`}>
                  {statusLabels[asset.status]?.label}
                </span>
                <div className="action-btns">
                  <button className="icon-btn qr" onClick={() => { setSelectedAsset(asset); setIsQrModalOpen(true); }}><QrCode size={14} /></button>
                  <button className="icon-btn edit" onClick={() => openEditModal(asset)}><Pencil size={14} /></button>
                  <button className="icon-btn delete" onClick={() => handleDelete(asset.id)}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nuevo Activo">
        <AssetForm formData={formData} setFormData={setFormData} stadiums={stadiums} onSubmit={handleCreate} submitLabel="Crear Activo" />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Activo">
        <AssetForm formData={formData} setFormData={setFormData} stadiums={stadiums} onSubmit={handleEdit} submitLabel="Guardar Cambios" />
      </Modal>

      <Modal isOpen={isQrModalOpen} onClose={() => { setIsQrModalOpen(false); setSelectedAsset(null); }} title="Código QR">
        {selectedAsset && (
          <div className="qr-container">
            <div className="qr-content" id="printable-qr">
              <QRCodeSVG value={selectedAsset.id} size={200} level="H" includeMargin={true} />
              <div className="qr-info">
                <h2>{selectedAsset.name}</h2>
                <p>S/N: {selectedAsset.serial_number}</p>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => {
              const svg = document.querySelector('#printable-qr svg');
              if (svg) {
                const svgData = new XMLSerializer().serializeToString(svg);
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const img = new Image();
                img.onload = () => {
                  canvas.width = img.width; canvas.height = img.height;
                  ctx?.drawImage(img, 0, 0);
                  const downloadLink = document.createElement("a");
                  downloadLink.download = `QR-${selectedAsset.name}.png`;
                  downloadLink.href = canvas.toDataURL("image/png");
                  downloadLink.click();
                };
                img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
              }
            }}>
              <Download size={18} /> Descargar PNG
            </button>
          </div>
        )}
      </Modal>

      <Modal isOpen={isSpecsModalOpen} onClose={() => { setIsSpecsModalOpen(false); setSelectedAsset(null); }} title={`Ficha Técnica: ${selectedAsset?.name}`}>
        {selectedAsset && selectedAsset.technical_specs && (
          <div className="specs-modal-content">
            <div className="specs-grid">
              {Object.entries(selectedAsset.technical_specs).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-key">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
            {selectedAsset.notes && (
              <div className="specs-notes">
                <h4>Observaciones Adicionales</h4>
                <p>{selectedAsset.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <style jsx>{`
        .assets-page { max-width: 1200px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .filters-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        .search-bar { display: flex; align-items: center; gap: 0.5rem; background: var(--surface); padding: 0.5rem 1rem; border-radius: 8px; flex: 1; border: 1px solid var(--border); }
        .search-bar input { border: none; outline: none; width: 100%; background: transparent; color: var(--text-main); }
        .assets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
        .asset-card { background: var(--surface); padding: 1.5rem; border-radius: 12px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); }
        .asset-header { display: flex; justify-content: space-between; margin-bottom: 1rem; color: var(--primary); }
        .status-dot { width: 10px; height: 10px; border-radius: 50%; }
        .status-dot.success { background: #22c55e; }
        .status-dot.info { background: #3b82f6; }
        .status-dot.warning { background: #f59e0b; }
        .status-dot.error { background: #ef4444; }
        .asset-meta { font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
        .asset-notes { 
          margin-top: 0.5rem; 
          font-style: italic; 
          font-size: 0.8rem; 
          border-left: 2px solid var(--border); 
          padding-left: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .asset-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 1rem; }
        .status-badge { padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
        .status-badge.success { background: #dcfce7; color: #166534; }
        .status-badge.info { background: #dbeafe; color: #1e40af; }
        .status-badge.warning { background: #fef3c7; color: #92400e; }
        .status-badge.error { background: #fee2e2; color: #991b1b; }
        .action-btns { display: flex; gap: 0.5rem; }
        .icon-btn { padding: 0.4rem; border: none; border-radius: 4px; cursor: pointer; }
        .icon-btn.edit { background: #e0f2fe; color: #0369a1; }
        .icon-btn.qr { background: #f0fdf4; color: #166534; }
        .icon-btn.delete { background: #fee2e2; color: #b91c1c; }
        .qr-container { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
        .qr-content { background: var(--surface); padding: 1.5rem; border: 1px solid var(--border); border-radius: 12px; text-align: center; }
        .filter-select { padding: 0.5rem 1rem; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text-main); }
        .specs-trigger {
          margin-top: 0.75rem;
          background: none;
          border: 1px solid var(--primary);
          color: var(--primary);
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          width: fit-content;
        }
        .specs-trigger:hover {
          background: var(--primary);
          color: white;
        }
        .specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .spec-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.75rem;
          background: var(--background);
          border-radius: 8px;
          border: 1px solid var(--border);
        }
        .spec-key {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-weight: 700;
        }
        .spec-value {
          font-size: 0.95rem;
          color: var(--text-main);
          font-weight: 500;
        }
        .specs-notes {
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .specs-notes h4 {
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          color: var(--primary);
        }
        .specs-notes p {
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
