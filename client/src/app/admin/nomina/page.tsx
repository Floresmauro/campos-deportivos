"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Upload, FileText, Download, Trash2, FilePlus, Plus, Minus } from 'lucide-react';
import Modal from '@/components/Modal';
import { generateReceiptPDF } from '@/utils/receiptGenerator';

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
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // Form states for Upload
  const [uploadFormData, setUploadFormData] = useState({
    user_id: '',
    month: (new Date().getMonth() + 1).toString(),
    year: new Date().getFullYear(),
    total_amount: '',
    file: null as File | null
  });

  // Form states for Generation
  const [genFormData, setGenFormData] = useState({
    user_id: '',
    month: (new Date().getMonth() + 1).toString(),
    year: new Date().getFullYear(),
    items: [
      { description: 'Sueldo Básico', remunerative: 0, deduction: 0 }
    ]
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
    if (!uploadFormData.file || !uploadFormData.user_id) {
      alert('Por favor selecciona un empleado y un archivo PDF.');
      return;
    }

    try {
      setLoading(true);

      const fileExt = uploadFormData.file.name.split('.').pop();
      const fileName = `${uploadFormData.user_id}/${Date.now()}.${fileExt}`;
      const filePath = `receipts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payroll')
        .upload(filePath, uploadFormData.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payroll')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('payroll')
        .insert({
          user_id: uploadFormData.user_id,
          month: parseInt(uploadFormData.month),
          year: uploadFormData.year,
          net_salary: parseFloat(uploadFormData.total_amount) || 0,
          gross_salary: parseFloat(uploadFormData.total_amount) || 0,
          file_url: publicUrl,
          status: 'paid'
        });

      if (dbError) throw dbError;

      setIsUploadModalOpen(false);
      setUploadFormData({
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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genFormData.user_id) {
      alert('Seleccione un empleado');
      return;
    }

    try {
      setLoading(true);
      const employee = employees.find(e => e.id === genFormData.user_id);
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', genFormData.user_id).single();

      const gross = genFormData.items.reduce((acc, item) => acc + (Number(item.remunerative) || 0), 0);
      const deductions = genFormData.items.reduce((acc, item) => acc + (Number(item.deduction) || 0), 0);
      const net = gross - deductions;

      const pdfBlob = await generateReceiptPDF({
        company: {
          name: 'CAMPOS DEPORTIVOS S.A.',
          address: 'Buenos Aires, Argentina',
          cuit: '30-12345678-9'
        },
        employee: {
          name: employee?.full_name || '',
          cuil: profile?.dni || 'N/A',
          category: profile?.role || 'Empleado',
          entryDate: profile?.start_date || 'N/A'
        },
        period: {
          month: months.find(m => m.value === parseInt(genFormData.month))?.label || '',
          year: genFormData.year
        },
        items: genFormData.items.map(i => ({ ...i, remunerative: Number(i.remunerative), deduction: Number(i.deduction) })),
        totals: { gross, deductions, net }
      });

      // Upload
      const filePath = `receipts/${genFormData.user_id}/GEN-${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage.from('payroll').upload(filePath, pdfBlob);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('payroll').getPublicUrl(filePath);

      // Save Record
      const { error: dbError } = await supabase.from('payroll').insert({
        user_id: genFormData.user_id,
        month: parseInt(genFormData.month),
        year: genFormData.year,
        net_salary: net,
        gross_salary: gross,
        file_url: publicUrl,
        status: 'paid'
      });

      if (dbError) throw dbError;

      setIsGenerateModalOpen(false);
      loadData();
      alert('Recibo generado y guardado con éxito');
    } catch (error: any) {
      console.error('Error generating receipt:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setGenFormData({ ...genFormData, items: [...genFormData.items, { description: '', remunerative: 0, deduction: 0 }] });
  };

  const removeItem = (index: number) => {
    const newItems = genFormData.items.filter((_, i) => i !== index);
    setGenFormData({ ...genFormData, items: newItems });
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
        <div className="page-header-actions">
          <button
            className="btn btn-outline"
            onClick={() => setIsGenerateModalOpen(true)}
            style={{ marginRight: '1rem' }}
          >
            <FilePlus size={18} />
            Generar Recibo
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload size={18} />
            Subir Liquidación
          </button>
        </div>
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
              value={uploadFormData.user_id}
              onChange={(e) => setUploadFormData({ ...uploadFormData, user_id: e.target.value })}
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
                value={uploadFormData.month}
                onChange={(e) => setUploadFormData({ ...uploadFormData, month: e.target.value })}
              >
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Año</label>
              <input
                type="number"
                value={uploadFormData.year}
                onChange={(e) => setUploadFormData({ ...uploadFormData, year: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Monto Neto ($)</label>
            <input
              type="number"
              placeholder="Ej: 850000"
              value={uploadFormData.total_amount}
              onChange={(e) => setUploadFormData({ ...uploadFormData, total_amount: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Recibo (PDF) *</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setUploadFormData({ ...uploadFormData, file: e.target.files?.[0] || null })}
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

      {/* Modal Generación */}
      <Modal isOpen={isGenerateModalOpen} onClose={() => setIsGenerateModalOpen(false)} title="Generar Recibo de Sueldo">
        <form onSubmit={handleGenerate} className="gen-form">
          <div className="form-group">
            <label>Empleado *</label>
            <select
              value={genFormData.user_id}
              onChange={(e) => setGenFormData({ ...genFormData, user_id: e.target.value })}
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
              <select value={genFormData.month} onChange={(e) => setGenFormData({ ...genFormData, month: e.target.value })}>
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Año</label>
              <input type="number" value={genFormData.year} onChange={(e) => setGenFormData({ ...genFormData, year: parseInt(e.target.value) })} />
            </div>
          </div>

          <div className="items-section">
            <div className="section-header">
              <h3>Detalle de Conceptos</h3>
              <button type="button" className="btn-add" onClick={addItem}><Plus size={14} /> Agregar</button>
            </div>

            {genFormData.items.map((item, index) => (
              <div key={index} className="item-row">
                <input
                  type="text"
                  placeholder="Descripción"
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...genFormData.items];
                    newItems[index].description = e.target.value;
                    setGenFormData({ ...genFormData, items: newItems });
                  }}
                />
                <input
                  type="number"
                  placeholder="Remun."
                  value={item.remunerative}
                  onChange={(e) => {
                    const newItems = [...genFormData.items];
                    newItems[index].remunerative = parseFloat(e.target.value) || 0;
                    setGenFormData({ ...genFormData, items: newItems });
                  }}
                />
                <input
                  type="number"
                  placeholder="Deduc."
                  value={item.deduction}
                  onChange={(e) => {
                    const newItems = [...genFormData.items];
                    newItems[index].deduction = parseFloat(e.target.value) || 0;
                    setGenFormData({ ...genFormData, items: newItems });
                  }}
                />
                <button type="button" className="btn-remove" onClick={() => removeItem(index)}><Minus size={14} /></button>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Generando...' : 'Generar y Guardar PDF'}
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

                .btn-outline { background: white; color: var(--primary); border: 1px solid var(--primary); display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; }
                
                .gen-form { display: flex; flex-direction: column; gap: 1rem; }
                .items-section { margin-top: 1rem; border: 1px solid var(--border); padding: 1rem; border-radius: var(--radius-md); }
                .items-section .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .items-section .section-header h3 { font-size: 0.9rem; margin: 0; }
                .btn-add { background: #EBF7ED; color: var(--primary); border: none; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 0.25rem; }
                
                .item-row { display: grid; grid-template-columns: 2fr 1fr 1fr 40px; gap: 0.5rem; margin-bottom: 0.5rem; }
                .item-row input { padding: 0.5rem; border: 1px solid var(--border); border-radius: 4px; font-size: 0.85rem; }
                .btn-remove { background: #FEE2E2; color: #B91C1C; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
            `}</style>
    </div>
  );
}
