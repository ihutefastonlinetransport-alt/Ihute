import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useAppStore } from '@/store';
import { useT } from '@/i18n';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user, token, language, setLanguage, logout } = useAppStore();

  const languages = ['en', 'fr', 'sw', 'rw'];
  const t = useT();

  return (
    <>
      <style>{`
        @keyframes navSlideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes footerSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        nav { animation: navSlideIn 0.6s ease-out; }
        footer { animation: footerSlideUp 0.8s ease-out; }
        .card { transition: transform 0.35s ease, box-shadow 0.35s ease; }
        .card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(2,6,23,0.12); }
        .btn { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .btn:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(245,124,0,0.25); }
        .fade { animation: fadeIn 0.6s ease forwards; }
        a { transition: all 0.3s ease; color: inherit; }
        a:hover { color: #f57c00; text-decoration: none; }
        button { transition: all 0.3s ease; }
        button:hover { color: #f57c00; }
      `}</style>
      <header style={{ ...headerStyles }}>
        <div style={containerStyles}>
          <nav style={navStyles}>
            <div style={brandStyles}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <div style={logoStyles}>
                  <Image src="/logo.png" alt="IHUTE Logo" width={48} height={48} style={{ borderRadius: '8px' }} priority />
                </div>
              </Link>
              {/* Only show logo in header; remove text label as requested */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* logo only - accessible label for screen readers */}
                <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }} aria-hidden={false}>IHUTE - Online Fast Booking</span>
              </div>
            </div>
            <ul style={linksStyles}>
              <li><Link href="/">{t('nav.home','Home')}</Link></li>
              <li><Link href="/booking">{t('nav.book','Book Now')}</Link></li>
              <li><Link href="#about">{t('nav.about','About')}</Link></li>
              {token && user?.role && <li><Link href="/admin">Dashboard</Link></li>}
              {token && user?.type === 'driver' && <li><Link href="/driver">🚗 My Trips</Link></li>}
              {token ? (
                <>
                  <li style={{ color: '#6b7280', fontSize: '14px' }}>👤 {user?.name}</li>
                  <li><button onClick={() => { logout(); router.push('/'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', color: '#6b7280' }}>Logout</button></li>
                </>
              ) : (
                <li><Link href="/login" style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #f57c00, #e67e22)', color: 'white', borderRadius: '999px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 124, 0, 0.4)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>{t('nav.login','Login')}</Link></li>
              )}
              <li>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} style={langStyles}>
                  {languages.map((lang) => <option key={lang} value={lang}>{lang.toUpperCase()}</option>)}
                </select>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main style={{ marginTop: '88px', minHeight: 'calc(100vh - 88px)', background: '#fff' }}>
        <div style={containerStyles}>{children}</div>
      </main>
      <footer style={{ padding: '48px 0', background: 'linear-gradient(135deg, #1f2937, #111827)', color: '#e5e7eb', marginTop: '60px' }}>
        <div style={containerStyles}>
          <div style={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr' }, gap: '40px', paddingBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {/* About Section */}
            <div>
              <h4 style={{ margin: '0 0 16px', color: '#f57c00', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Image src="/logo.png" alt="IHUTE" width={32} height={32} style={{ borderRadius: '6px' }} />
                IHUTE Rwanda
              </h4>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#d1d5db', margin: 0 }}>Fast, safe, and friendly transport booking across Rwanda with real-time tracking and trusted drivers.</p>
            </div>

            {/* Contact Section */}
            <div>
              <h4 style={{ margin: '0 0 12px', color: '#2e7d32', fontSize: '14px', fontWeight: 'bold' }}>📞 Contact</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="mailto:ihutefast@gmail.com" style={{ color: '#fbbf24', textDecoration: 'none', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ✉️ ihutefast@gmail.com
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="tel:+250700000000" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '14px' }}>📱 +250 700 000 000</a>
                </li>
                <li><span style={{ color: '#d1d5db', fontSize: '14px' }}>📍 Kigali, Rwanda</span></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ margin: '0 0 12px', color: '#f57c00', fontSize: '14px', fontWeight: 'bold' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}><Link href="/" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#f57c00'} onMouseOut={(e) => e.currentTarget.style.color = '#d1d5db'}>🏠 Home</Link></li>
                <li style={{ marginBottom: '8px' }}><Link href="/booking" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '14px' }} onMouseOver={(e) => e.currentTarget.style.color = '#f57c00'} onMouseOut={(e) => e.currentTarget.style.color = '#d1d5db'}>📅 Book Now</Link></li>
                <li><Link href="/login" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '14px' }} onMouseOver={(e) => e.currentTarget.style.color = '#f57c00'} onMouseOut={(e) => e.currentTarget.style.color = '#d1d5db'}>🔐 Admin Login</Link></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 style={{ margin: '0 0 12px', color: '#f57c00', fontSize: '14px', fontWeight: 'bold' }}>Follow Us</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ padding: '10px 12px', background: '#374151', borderRadius: '8px', color: '#e5e7eb', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.background = '#f57c00'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#374151'; e.currentTarget.style.transform = 'none'; }}>
                  f
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ padding: '10px 12px', background: '#374151', borderRadius: '8px', color: '#e5e7eb', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.background = '#2e7d32'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#374151'; e.currentTarget.style.transform = 'none'; }}>
                  𝕏
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ padding: '10px 12px', background: '#374151', borderRadius: '8px', color: '#e5e7eb', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.background = '#ec4899'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#374151'; e.currentTarget.style.transform = 'none'; }}>
                  📷
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div style={{ paddingTop: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
            <p style={{ margin: '0 0 8px' }}>
              <strong style={{ color: '#f57c00' }}>IHUTE Rwanda</strong> © {new Date().getFullYear()} All Rights Reserved
            </p>
            <p style={{ margin: 0, fontSize: '12px' }}>
              📧 <a href="mailto:ihutefast@gmail.com" style={{ color: '#fbbf24', textDecoration: 'none' }}>ihutefast@gmail.com</a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

const headerStyles = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(90deg, rgba(255,255,255,0.97) 0%, rgba(245,247,250,0.97) 100%)',
  backdropFilter: 'blur(8px)',
  borderBottom: '2px solid rgba(245,124,0,0.1)',
  zIndex: 40,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const containerStyles = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '0 16px',
};

const navStyles = {
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const brandStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const logoStyles = {
  width: '48px',
  height: '48px',
  borderRadius: '10px',
  background: '#f7f7fb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: '700' as const,
};

const linksStyles = {
  display: 'flex',
  gap: '18px',
  alignItems: 'center',
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const langStyles = {
  padding: '6px 10px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.7)',
  border: '1px solid #eee',
  fontSize: '14px',
};
