import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import api from '@/api';
import { useAppStore } from '@/store';
import { useT } from '@/i18n';

export default function LoginPage() {
  const t = useT();
  const router = useRouter();
  const { setUser, setToken } = useAppStore();
  const [userType, setUserType] = useState<'express_admin' | 'private_driver'>('express_admin');
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
      const endpoint = userType === 'express_admin' ? '/api/admin/login' : '/api/drivers/login';
      const res = await api.post(endpoint, { email, password, ...(userType === 'express_admin' && { permanent_code: permanentCode }) });

      setToken(res.data.token);
      setUser({ ...res.data.admin || res.data.driver, type: userType });
      router.push(userType === 'express_admin' ? '/admin' : '/driver');
    } catch (err: any) {
      setError(err.response?.data?.error || t('login.error', 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 16px 60px' }}>
        <div style={{ width: '100%', maxWidth: '450px' }}>
          {/* Logo & Branding */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Image src="/logo.png" alt="IHUTE Logo" width={80} height={80} style={{ borderRadius: '12px', marginBottom: '12px' }} />
            <h1 style={{ fontSize: '28px', margin: '8px 0', background: 'linear-gradient(135deg, #f57c00, #2e7d32)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IHUTE</h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '13px' }}>Fast, Safe & Friendly Transport Booking</p>
          </div>

          {/* Login Card */}
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(16,24,40,0.08)', marginBottom: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#1f2937' }}>{t('login.title', 'Login')}</h2>

            {error && <div style={{ padding: '12px', background: '#fee', color: '#c00', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

            <form onSubmit={handleLogin}>
              {/* Account Type Selector */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>{t('login.accountType', 'Login As')}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
                  <div
                    onClick={() => setUserType('express_admin')}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      border: userType === 'express_admin' ? '2px solid #f57c00' : '2px solid #e6e9ef',
                      background: userType === 'express_admin' ? '#fff7f0' : 'white',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>🚌</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>Express Admin</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Manage buses</div>
                  </div>
                  <div
                    onClick={() => setUserType('private_driver')}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      border: userType === 'private_driver' ? '2px solid #2e7d32' : '2px solid #e6e9ef',
                      background: userType === 'private_driver' ? '#f0fdf4' : 'white',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>🚗</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>Private Driver</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Manage trips</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>{t('login.email', 'Email Address')}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>{t('login.password', 'Password')}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
              </div>

              {userType === 'express_admin' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>{t('login.permanentCode', 'Permanent Code')}</label>
                  <input type="text" value={permanentCode} onChange={(e) => setPermanentCode(e.target.value)} placeholder="Optional for Express Admin" style={inputStyle} />
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Provided by Super Admin</div>
                </div>
              )}

              <button type="submit" disabled={loading} style={{ ...buttonStyle, background: userType === 'express_admin' ? '#f57c00' : '#2e7d32' }}>
                {loading ? t('login.loading', 'Logging in...') : t('login.loginButton', 'Login')}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #f0fdf4 100%)', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e6e9ef' }}>
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>Need help?</div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <a href="mailto:ihutefast@gmail.com" style={{ color: '#f57c00', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}>✉️ ihutefast@gmail.com</a>
              <span style={{ color: '#d1d5db' }}>•</span>
              <Link href="/" style={{ color: '#2e7d32', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}>← Back Home</Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const inputStyle = {
  width: '100%',
  padding: '11px 12px',
  border: '1px solid #e6e9ef',
  borderRadius: '8px',
  fontSize: '14px',
  marginTop: '6px',
  marginBottom: '0',
  boxSizing: 'border-box' as const,
  transition: 'all 0.3s ease',
};

const buttonStyle = {
  width: '100%',
  padding: '13px',
  background: '#2e7d32',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
} as const;
