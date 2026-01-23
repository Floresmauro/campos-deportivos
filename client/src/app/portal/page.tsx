"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function PortalLoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/portal/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // Redirección inteligente basada en rol
      const { data: { session } } = await require('@/lib/supabase').supabase.auth.getSession();
      if (session) {
        const { data: profile } = await require('@/lib/supabase').supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role === 'admin' || profile?.role === 'manager') {
          router.push('/admin');
        } else {
          router.push('/portal/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Verifique sus datos.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="portal-login">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-circle">
            <User size={40} />
          </div>
          <h1>Portal del Empleado</h1>
          <p>Ingrese sus credenciales para acceder</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input
              type="email"
              placeholder="Email corporativo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Ingresando...' : (
              <>
                <LogIn size={18} />
                Ingresar
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>
      </div>

      <style jsx>{`
        .portal-login {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary) 0%, #121512 100%);
          padding: 2rem;
        }

        .login-container {
          background: var(--surface);
          padding: 3rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
          width: 100%;
          max-width: 420px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-circle {
          width: 80px;
          height: 80px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .login-header h1 {
          font-family: var(--font-title);
          font-size: 1.75rem;
          color: var(--primary);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .login-header p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 500;
        }

        .error-message {
          background-color: #ffebee;
          color: var(--error);
          padding: 1rem;
          border-radius: var(--radius-sm);
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .input-group {
          position: relative;
          margin-bottom: 1.25rem;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a0a0a0;
        }

        .input-group input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 1px solid var(--border);
          background: var(--background);
          color: var(--text-main);
          border-radius: var(--radius-md);
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .input-group input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(0,51,102,0.1);
        }

        .toggle-btn {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #a0a0a0;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .toggle-btn:hover {
          color: var(--primary);
        }

        .login-btn {
          width: 100%;
          padding: 1rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: background-color 0.2s;
        }

        .login-btn:hover:not(:disabled) {
          background-color: var(--primary-light);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-footer {
          text-align: center;
          margin-top: 2rem;
        }

        .login-footer a {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .login-footer a:hover {
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}
