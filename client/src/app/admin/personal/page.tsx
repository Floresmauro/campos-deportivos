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
        phone: ''
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
                    .select('*, stadiums!assigned_stadium_id (name)')
                    .order('full_name');
                if (error) throw error;
                setEmployees(data || []);

                const { data: stadiumData } = await supabase.from('stadiums').select('id, name');
                setStadiums(stadiumData || []);
            } else if (activeTab === 'attendance') {
                const today = new Date().toISOString().split('T')[0];
                const { data, error } = await supabase
                    .from('attendance')
                    .select('*, profiles:user_id (full_name)')
                    .gte('timestamp', today)
                    .order('timestamp', { ascending: false });
                if (error) throw error;
                setAttendance(data || []);
            } else if (activeTab === 'requests') {
                const { data, error } = await supabase
                    .from('requests')
                    .select('*, profiles:user_id (full_name)')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setRequests(data || []);
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
            // Note: In a real system, we'd use a cloud function to create the auth user
            // For now, we assume the admin creates the profile and the user signs up later
            // (or we use the 'admin create user' endpoint if using service key on backend)
            // Here we just insert into profiles (assuming user exists or will exist)
            // BUT wait, profiles table references auth.users. 
            // Better to show a message or call our backend API if available.

            // To be realistic with Supabase, we should call the backend /api/auth/register
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: 'password123', // temporary
                    full_name: formData.full_name,
                    role: formData.role,
                    assigned_stadium_id: formData.assigned_stadium_id || null
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Error al crear empleado');
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
                    phone: formData.phone
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
            // Only admins can delete profiles through the API or Trigger
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

    const resetForm = () => {
        setFormData({
            full_name: '',
            email: '',
            role: 'employee',
            assigned_stadium_id: '',
            phone: ''
        });
        setSelectedEmployee(null);
    };

    const openEditModal = (emp: Profile) => {
        setSelectedEmployee(emp);
        setFormData({
            full_name: emp.full_name,
            email: emp.email,
            role: emp.role,
            assigned_stadium_id: emp.assigned_stadium_id || '',
            phone: emp.phone || ''
        });
        setIsEditModalOpen(true);
    };

    const filtered = employees.filter(e =>
        e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.stadiums?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const EmployeeForm = ({ onSubmit, submitLabel, isEdit = false }: { onSubmit: (e: React.FormEvent) => void, submitLabel: string, isEdit?: boolean }) => (
        <form onSubmit={onSubmit} className="employee-form">
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
            <div className="form-group">
                <label>Teléfono</label>
                <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">{submitLabel}</button>
            </div>
            <style jsx>{`
                .employee-form { display: flex; flex-direction: column; gap: 1rem; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .form-group label { font-weight: 600; font-size: 0.9rem; }
                .form-group input, .form-group select { padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 1rem; }
                .form-actions { display: flex; justify-content: flex-end; padding-top: 1rem; border-top: 1px solid var(--border); }
            `}</style>
        </form>
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

            {/* Content */}
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
                                                    <strong>{emp.full_name}</strong>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{emp.email}</div>
                                                </td>
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

            {/* Modals */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nuevo Empleado">
                <EmployeeForm onSubmit={handleCreateEmployee} submitLabel="Crear Empleado" />
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Empleado">
                <EmployeeForm onSubmit={handleEditEmployee} submitLabel="Guardar Cambios" isEdit={true} />
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
      `}</style>
        </div>
    );
}
