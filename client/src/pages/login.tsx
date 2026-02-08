import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import api from '@/api';
import { useAppStore } from '@/store';
import { useT } from '@/i18n';

export default function LoginPage() {
  const t = useT();
  const router = useRouter();
  const { setUser, setToken } = useAppStore();
  const [userType, setUserType] = useState<'admin' | 'driver'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [permanentCode, setPermanentCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = userType === 'admin' ? '/api/admin/login' : '/api/drivers/login';
      const res = await api.post(endpoint, { email, password, ...(userType === 'admin' && { permanent_code: permanentCode }) });

      setToken(res.data.token);
      setUser({ ...res.data[userType], type: userType });
      router.push(userType === 'admin' ? '/admin' : '/driver');
    } catch (err: any) {
      setError(err.response?.data?.error || t('login.error', 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
        <div style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(16,24,40,0.08)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{t('login.title', 'Login')}</h2>

          {error && <div style={{ padding: '12px', background: '#fee', color: '#c00', borderRadius: '8px', marginBottom: '12px' }}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '12px' }}>
              <label>{t('login.accountType', 'Account Type')}</label>
              <select value={userType} onChange={(e) => setUserType(e.target.value as any)} style={inputStyle}>
                <option value="admin">{t('login.admin', 'Admin')}</option>
                <option value="driver">{t('login.driver', 'Driver')}</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label>{t('login.email', 'Email Address')}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label>{t('login.password', 'Password')}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
            </div>

            {userType === 'admin' && (
              <div style={{ marginBottom: '12px' }}>
                <label>{t('login.permanentCode', 'Permanent Code (Admin only)')}</label>
                <input type="text" value={permanentCode} onChange={(e) => setPermanentCode(e.target.value)} style={inputStyle} />
              </div>
            )}

            <button type="submit" disabled={loading} style={buttonStyle}>{loading ? t('login.loading', 'Logging in...') : t('login.loginButton', 'Login')}</button>
          </form>

          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
            {t('login.noAccount', "Don't have an account?")} <Link href="/driver/register">{t('login.register', 'Register as Driver')}</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #e6e9ef',
  borderRadius: '8px',
  fontSize: '15px',
  marginTop: '6px',
  marginBottom: '8px',
  boxSizing: 'border-box' as const,
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  background: '#2e7d32',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  fontSize: '16px',
  cursor: 'pointer',
};
