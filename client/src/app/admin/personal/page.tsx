"use client";

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, User, Clock, FileCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: string;
    assigned_stadium_id: string | null;
    phone: string | null;
    stadiums?: { name: string } | null;
    dni?: string | null;
    obra_social?: string | null;
    birth_date?: string | null;
    start_date?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
    avatar_url?: string | null;
}

interface AttendanceRecord {
    id: string;
    user_id: string;
    type: string;
    timestamp: string;
    photo_url: string | null;
    profiles: { full_name: string } | null;
}

interface RequestRecord {
    id: string;
    user_id: string;
    type: string;
    start_date: string;
    end_date: string;
    status: string;
    reason: string | null;
    profiles: { full_name: string } | null;
}

interface Stadium {
    id: string;
    name: string;
}

// Form component extracted outside to prevent re-creation on state changes
const EmployeeForm = ({
    formData,
    setFormData,
    stadiums,
    uploading,
    handleFileUpload,
    onSubmit,
    submitLabel,
    isEdit = false
}: {
    formData: any;
    setFormData: (data: any) => void;
    stadiums: Stadium[];
    uploading: boolean;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
    isEdit?: boolean;
}) => (
    <form onSubmit={onSubmit} className="employee-form">
        <div className="form-photo-section">
            <div className="photo-preview">
                {formData.avatar_url ? (
                    <img src={formData.avatar_url} alt="Avatar" />
                ) : (
                    <User size={40} />
                )}
            </div>
            <div className="photo-actions">
                <label className="btn-upload">
                    {uploading ? 'Subiendo...' : 'Subir Foto'}
                    <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
                </label>
                {formData.avatar_url && (
                    <button type="button" className="btn-remove" onClick={() => setFormData({ ...formData, avatar_url: '' })}>Eliminar</button>
                )}
            </div>
        </div>

        <div className="form-row">
            <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                />
            </div>
            <div className="form-group">
                <label>DNI</label>
                <input
                    type="text"
                    value={formData.dni}
                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                />
            </div>
        </div>

        <div className="form-group">
            <label>Email *</label>
            <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isEdit}
            />
            {!isEdit && <small>Contraseña por defecto: password123</small>}
        </div>

        <div className="form-row">
            <div className="form-group">
                <label>Rol *</label>
                <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                >
                    <option value="employee">Empleado</option>
                    <option value="manager">Encargado</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>
            <div className="form-group">
                <label>Sede Asignada</label>
                <select
                    value={formData.assigned_stadium_id}
                    onChange={(e) => setFormData({ ...formData, assigned_stadium_id: e.target.value })}
                >
                    <option value="">Sin asignar / Administración</option>
                    {stadiums.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>
        </div>

        <div className="form-row">
            <div className="form-group">
                <label>Teléfono</label>
                <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label>Obra Social</label>
                <input
                    type="text"
                    value={formData.obra_social}
                    onChange={(e) => setFormData({ ...formData, obra_social: e.target.value })}
                />
            </div>
        </div>

        <div className="form-row">
            <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label>Fecha de Ingreso</label>
                <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
            </div>
        </div>

        <div className="form-section-title">En caso de emergencia</div>
        <div className="form-row">
            <div className="form-group">
                <label>Contacto (Nombre)</label>
                <input
                    type="text"
                    value={formData.emergency_contact_name}
                    onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label>Teléfono de Emergencia</label>
                <input
                    type="text"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                />
            </div>
        </div>

        <div className="form-actions">
            <button type="submit" className="btn btn-primary">{submitLabel}</button>
        </div>
        <style jsx>{`
            .employee-form { display: flex; flex-direction: column; gap: 1rem; }
            .form-photo-section { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 0.5rem; background: var(--background); padding: 1rem; border-radius: var(--radius-md); }
            .photo-preview { width: 80px; height: 80px; background: var(--surface); border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px solid var(--border); }
            .photo-preview img { width: 100%; height: 100%; object-fit: cover; }
            .photo-actions { display: flex; flex-direction: column; gap: 0.5rem; }
            .btn-upload { background: var(--primary); color: white; padding: 0.5rem 1rem; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; cursor: pointer; text-align: center; }
            .btn-remove { background: none; border: none; color: #b91c1c; font-size: 0.8rem; cursor: pointer; padding: 0; }
            .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
            .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
            .form-group label { font-weight: 600; font-size: 0.9rem; }
            .form-group input, .form-group select { padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 1rem; background: var(--surface); color: var(--text-main); }
            .form-section-title { font-weight: 700; font-size: 0.9rem; color: var(--text-secondary); text-transform: uppercase; margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border); }
            .form-actions { display: flex; justify-content: flex-end; padding-top: 1rem; border-top: 1px solid var(--border); }
        `}</style>
    </form>
);

export default function PersonnelPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'requests'>('employees');
    const [loading, setLoading] = useState(true);

    const [employees, setEmployees] = useState<Profile[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [requests, setRequests] = useState<RequestRecord[]>([]);
    const [stadiums, setStadiums] = useState<Stadium[]>([]);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Profile | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        role: 'employee',
        assigned_stadium_id: '',
        phone: '',
        dni: '',
        obra_social: '',
        birth_date: '',
        start_date: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        avatar_url: ''
    });

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'employees') {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, email, full_name, role, assigned_stadium_id, phone, dni, avatar_url, obra_social, birth_date, start_date, emergency_contact_name, emergency_contact_phone')
                    .order('full_name');
                if (error) {
                    console.error('Error loading profiles:', error);
                    throw error;
                }

                setEmployees(data || []);

                const { data: stadiumData, error: stadiumError } = await supabase.from('stadiums').select('id, name');
                if (stadiumError) {
                    console.error('Error loading stadiums:', stadiumError);
                }
                console.log('Loaded stadiums:', stadiumData);
                setStadiums(stadiumData || []);
            } else if (activeTab === 'attendance') {
                const today = new Date().toISOString().split('T')[0];
                const { data, error } = await supabase
                    .from('attendance')
                    .select('id, user_id, type, timestamp, photo_url, profiles:user_id (full_name)')
                    .gte('timestamp', today)
                    .order('timestamp', { ascending: false });
                if (error) throw error;

                const mappedData = (data || []).map((a: any) => ({
                    ...a,
                    profiles: Array.isArray(a.profiles) ? a.profiles[0] : a.profiles
                }));
                setAttendance(mappedData);
            } else if (activeTab === 'requests') {
                const { data, error } = await supabase
                    .from('requests')
                    .select('id, user_id, type, start_date, end_date, status, reason, created_at, profiles:user_id (full_name)')
                    .order('created_at', { ascending: false });
                if (error) throw error;

                const mappedData = (data || []).map((r: any) => ({
                    ...r,
                    profiles: Array.isArray(r.profiles) ? r.profiles[0] : r.profiles
                }));
                setRequests(mappedData);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: 'password123',
                    full_name: formData.full_name,
                    role: formData.role,
                    assigned_stadium_id: formData.assigned_stadium_id || null,
                    phone: formData.phone,
                    dni: formData.dni,
                    obra_social: formData.obra_social,
                    birth_date: formData.birth_date || null,
                    start_date: formData.start_date || null,
                    emergency_contact_name: formData.emergency_contact_name,
                    emergency_contact_phone: formData.emergency_contact_phone,
                    avatar_url: formData.avatar_url
                })
            });

            if (!response.ok) {
                const err = await response.json();
                console.error('Server error response:', err);
                throw new Error(err.error || err.message || 'Error al crear empleado');
            }

            setIsCreateModalOpen(false);
            resetForm();
            loadData();
        } catch (error: any) {
            console.error('Error creating employee:', error);
            alert(error.message);
        }
    };

    const handleEditEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployee) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    role: formData.role,
                    assigned_stadium_id: formData.assigned_stadium_id || null,
                    phone: formData.phone,
                    dni: formData.dni,
                    obra_social: formData.obra_social,
                    birth_date: formData.birth_date || null,
                    start_date: formData.start_date || null,
                    emergency_contact_name: formData.emergency_contact_name,
                    emergency_contact_phone: formData.emergency_contact_phone,
                    avatar_url: formData.avatar_url
                })
                .eq('id', selectedEmployee.id);

            if (error) throw error;

            setIsEditModalOpen(false);
            resetForm();
            loadData();
        } catch (error: any) {
            console.error('Error updating employee:', error);
            alert(error.message);
        }
    };

    const handleDeleteEmployee = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este empleado?')) return;
        try {
            const { error } = await supabase.from('profiles').delete().eq('id', id);
            if (error) throw error;
            loadData();
        } catch (error: any) {
            console.error('Error deleting employee:', error);
            alert(error.message);
        }
    };

    const handleUpdateRequestStatus = async (id: string, status: 'approved' | 'rejected') => {
        try {
            const { error } = await supabase
                .from('requests')
                .update({ status })
                .eq('id', id);
            if (error) throw error;
            loadData();
        } catch (error: any) {
            console.error('Error updating request:', error);
            alert(error.message);
        }
    };

    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fData = new FormData();
            fData.append('file', file);
            fData.append('bucket', 'avatars');

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: fData
            });

            if (!response.ok) throw new Error('Error al subir imagen');
            const data = await response.json();
            setFormData(prev => ({ ...prev, avatar_url: data.url }));
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error al subir la imagen');
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            full_name: '',
            email: '',
            role: 'employee',
            assigned_stadium_id: '',
            phone: '',
            dni: '',
            obra_social: '',
            birth_date: '',
            start_date: '',
            emergency_contact_name: '',
            emergency_contact_phone: '',
            avatar_url: ''
        });
        setSelectedEmployee(null);
    };

    const openEditModal = (emp: any) => {
        setSelectedEmployee(emp);
        setFormData({
            full_name: emp.full_name,
            email: emp.email,
            role: emp.role,
            assigned_stadium_id: emp.assigned_stadium_id || '',
            phone: emp.phone || '',
            dni: emp.dni || '',
            obra_social: emp.obra_social || '',
            birth_date: emp.birth_date || '',
            start_date: emp.start_date || '',
            emergency_contact_name: emp.emergency_contact_name || '',
            emergency_contact_phone: emp.emergency_contact_phone || '',
            avatar_url: emp.avatar_url || ''
        });
        setIsEditModalOpen(true);
    };

    const filtered = employees.filter(e =>
        e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.stadiums?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="personnel-page">
            <div className="page-header">
                <div>
                    <h1>Gestión de Personal</h1>
                    <p>Empleados, fichado y solicitudes.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
                >
                    <Plus size={18} />
                    Nuevo Empleado
                </button>
            </div>

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

            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos...</div>
            ) : (
                <>
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
                                            <th>DNI</th>
                                            <th>Rol</th>
                                            <th>Sede Asignada</th>
                                            <th>Teléfono</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((emp) => (
                                            <tr key={emp.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--background)', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            {emp.avatar_url ? <img src={emp.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={16} />}
                                                        </div>
                                                        <div>
                                                            <strong>{emp.full_name}</strong>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{emp.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{emp.dni || '-'}</td>
                                                <td style={{ textTransform: 'capitalize' }}>{emp.role}</td>
                                                <td>{emp.stadiums?.name || 'Oficina'}</td>
                                                <td>{emp.phone || '-'}</td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button className="icon-btn edit" onClick={() => openEditModal(emp)}><Pencil size={16} /></button>
                                                        <button className="icon-btn delete" onClick={() => handleDeleteEmployee(emp.id)}><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === 'attendance' && (
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Empleado</th>
                                        <th>Tipo</th>
                                        <th>Hora</th>
                                        <th>Evidencia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendance.map((a) => (
                                        <tr key={a.id}>
                                            <td><strong>{a.profiles?.full_name}</strong></td>
                                            <td>
                                                <span className={`status-badge ${a.type === 'check_in' ? 'active' : 'vacation'}`}>
                                                    {a.type === 'check_in' ? 'Entrada' : 'Salida'}
                                                </span>
                                            </td>
                                            <td className="time-cell">{new Date(a.timestamp).toLocaleTimeString()}</td>
                                            <td>
                                                {a.photo_url ? (
                                                    <a href={a.photo_url} target="_blank" rel="noreferrer" className="link">Ver Foto</a>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                    {attendance.length === 0 && (
                                        <tr><td colSpan={4} style={{ textAlign: 'center' }}>No hay registros de hoy</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'requests' && (
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Empleado</th>
                                        <th>Tipo</th>
                                        <th>Periodo</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((r) => (
                                        <tr key={r.id}>
                                            <td><strong>{r.profiles?.full_name}</strong></td>
                                            <td style={{ textTransform: 'capitalize' }}>{r.type}</td>
                                            <td>{new Date(r.start_date).toLocaleDateString()} - {new Date(r.end_date).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`status-badge ${r.status}`}>
                                                    {r.status === 'approved' ? 'Aprobado' : r.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                                                </span>
                                            </td>
                                            <td>
                                                {r.status === 'pending' && (
                                                    <div className="action-btns">
                                                        <button className="btn-sm approve" onClick={() => handleUpdateRequestStatus(r.id, 'approved')}>Aprobar</button>
                                                        <button className="btn-sm reject" onClick={() => handleUpdateRequestStatus(r.id, 'rejected')}>Rechazar</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {requests.length === 0 && (
                                        <tr><td colSpan={5} style={{ textAlign: 'center' }}>No hay solicitudes pendientes</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nuevo Empleado">
                <EmployeeForm formData={formData} setFormData={setFormData} stadiums={stadiums} uploading={uploading} handleFileUpload={handleFileUpload} onSubmit={handleCreateEmployee} submitLabel="Crear Empleado" />
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Empleado">
                <EmployeeForm formData={formData} setFormData={setFormData} stadiums={stadiums} uploading={uploading} handleFileUpload={handleFileUpload} onSubmit={handleEditEmployee} submitLabel="Guardar Cambios" isEdit={true} />
            </Modal>

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
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          border: none;
        }
        .btn-primary { background: var(--primary); color: white; }

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

        .table-wrapper {
          background: var(--surface);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          overflow-x: auto;
          border: 1px solid var(--border);
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

        .time-cell { font-family: monospace; font-size: 1rem; }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.active { background: #d1fae5; color: #065f46; }
        .status-badge.vacation { background: #dbeafe; color: #1e40af; }
        .status-badge.approved { background: #d1fae5; color: #065f46; }
        .status-badge.rejected { background: #fee2e2; color: #991b1b; }
        .status-badge.pending { background: #fef3c7; color: #92400e; }

        .action-btns { display: flex; gap: 0.5rem; }

        .icon-btn {
          padding: 0.5rem;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .icon-btn:hover { opacity: 0.8; }
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

        .link { color: var(--primary); text-decoration: none; font-size: 0.9rem; }
        .link:hover { text-decoration: underline; }

        /* Fix calendar icon visibility in dark mode */
        input[type="date"] {
          color-scheme: dark;
          position: relative;
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: brightness(0) invert(1);
          cursor: pointer;
          opacity: 0.8;
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
      `}</style>
        </div>
    );
}
