"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Upload, FileText, Download, Trash2, Filter } from 'lucide-react';
import Modal from '@/components/Modal';

interface Profile {
  id: string;
  full_name: string;
}

interface PayrollRecord {
  id: string;
  user_id: string;
  month: number;
  year: number;
  net_salary: number;
  file_url: string | null;
  status: string;
  created_at: string;
  profiles: { full_name: string } | null;
}

export default function PayrollPage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    user_id: '',
    month: (new Date().getMonth() + 1).toString(),
    year: new Date().getFullYear(),
    total_amount: '',
    file: null as File | null
  });

  const months = [
    { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' }, { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: payrollData, error: payrollError } = await supabase
        .from('payroll')
        .select('*, profiles:user_id (full_name)')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (payrollError) throw payrollError;
      setRecords(payrollData || []);

      const { data: employeeData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');
      setEmployees(employeeData || []);
    } catch (error) {
      console.error('Error loading payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file || !formData.user_id) {
      alert('Por favor selecciona un empleado y un archivo PDF.');
      return;
    }

    try {
      setLoading(true);

      // 1. Upload to Supabase Storage
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${formData.user_id}/${Date.now()}.${fileExt}`;
      const filePath = `receipts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payroll')
        .upload(filePath, formData.file);

      if (uploadError) {
        console.warn('Storage upload failed', uploadError);
        // throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('payroll')
        .getPublicUrl(filePath);

      // 2. Insert into DB
      const { error: dbError } = await supabase
        .from('payroll')
        .insert({
          user_id: formData.user_id,
          month: parseInt(formData.month),
          year: formData.year,
          net_salary: parseFloat(formData.total_amount) || 0,
          gross_salary: parseFloat(formData.total_amount) || 0,
          file_url: publicUrl,
          status: 'paid'
        });

      if (dbError) throw dbError;

      setIsUploadModalOpen(false);
      setFormData({
        user_id: '',
        month: (new Date().getMonth() + 1).toString(),
        year: new Date().getFullYear(),
        total_amount: '',
        file: null
      });
      loadData();
    } catch (error: any) {
      console.error('Error uploading payroll:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, fileUrl: string | null) => {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;
    try {
      const { error } = await supabase.from('payroll').delete().eq('id', id);
      if (error) throw error;
      loadData();
    } catch (error: any) {
      console.error('Error deleting record:', error);
      alert(error.message);
    }
  };

  const filteredRecords = records.filter(r =>
    r.profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    months.find(m => m.value === r.month)?.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="payroll-page">
      <div className="page-header">
        <div>
          <h1>Nómina y Liquidaciones</h1>
          <p>Gestión de de pagos y recibos de sueldo.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Upload size={18} />
          Subir Liquidación
        </button>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Buscar por empleado o mes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && records.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando registros...</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Periodo</th>
                <th>Monto Neto</th>
                <th>Archivo</th>
                <th>Fecha Carga</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.profiles?.full_name}</strong></td>
                  <td style={{ textTransform: 'capitalize' }}>
                    {months.find(m => m.value === r.month)?.label} {r.year}
                  </td>
                  <td className="amount">${r.net_salary.toLocaleString()}</td>
                  <td>
                    {r.file_url ? (
                      <a href={r.file_url} target="_blank" rel="noreferrer" className="receipt-link">
                        <FileText size={16} /> Ver Recibo
                      </a>
                    ) : 'No disponible'}
                  </td>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(r.id, r.file_url)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center' }}>No se encontraron registros</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Subida */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Subir Nueva Liquidación">
        <form onSubmit={handleUpload} className="upload-form">
          <div className="form-group">
            <label>Empleado *</label>
            <select
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              required
            >
              <option value="">Seleccionar Empleado</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.full_name}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mes</label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              >
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Año</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Monto Neto ($)</label>
            <input
              type="number"
              placeholder="Ej: 850000"
              value={formData.total_amount}
              onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Recibo (PDF) *</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Subiendo...' : 'Subir Liquidación'}
            </button>
          </div>
        </form>
      </Modal>

      <style jsx>{`
                .payroll-page { max-width: 1200px; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .page-header h1 { margin-bottom: 0.25rem; }
                .page-header p { color: var(--text-secondary); margin: 0; }

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
                .search-bar input { border: none; outline: none; flex: 1; font-size: 1rem; background: transparent; color: var(--text-main); }

                .table-wrapper { background: var(--surface); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); overflow-x: auto; border: 1px solid var(--border); }
                .data-table { width: 100%; border-collapse: collapse; }
                .data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--border); }
                .data-table th { background: var(--background); font-weight: 600; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase; }
                
                .amount { font-weight: 600; color: #059669; }
                
                .receipt-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--primary);
                    text-decoration: none;
                    background: #eff6ff;
                    padding: 0.4rem 0.75rem;
                    border-radius: var(--radius-sm);
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                .receipt-link:hover { background: #dbeafe; }

                .icon-btn { padding: 0.5rem; border: none; border-radius: var(--radius-sm); cursor: pointer; }
                .icon-btn.delete { background: #fee2e2; color: #b91c1c; }

                .upload-form { display: flex; flex-direction: column; gap: 1rem; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .form-group label { font-weight: 600; font-size: 0.9rem; }
                .form-group input, .form-group select { padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 1rem; background: var(--surface); color: var(--text-main); }
                .form-actions { display: flex; justify-content: flex-end; padding-top: 1rem; border-top: 1px solid var(--border); }
            `}</style>
    </div>
  );
}
