import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { useT } from '@/i18n';

export default function Home() {
  const t = useT();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  const [paused, setPaused] = useState(false);
  
  const slides = [
    '/1769485936552.png',
    '/1769486169104.png',
    '/1769537119944.png',
    '/file_00000000b37c71f8b8f07f22ce33cc4c.png',
  ];

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timer | null = null;
    if (!paused) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [paused]);

  const styles = {
    fadeInAnimation: {
      animation: 'fadeIn 0.8s ease-in',
      animationFillMode: 'both',
    },
    slideAnimation: {
      animation: 'slideInUp 0.8s ease-out',
      animationFillMode: 'both',
    },
    pageStyle: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: 'calc(100vh - 88px)',
    },
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0.3;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .slide-container {
          animation: slideIn 0.8s ease-out;
        }
        .fade-on-hover:hover {
          transition: all 0.3s ease;
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(16,24,40,0.12) !important;
        }
      `}</style>
      <Layout>
        <div style={styles.pageStyle}>
          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'center', padding: '48px 0', ...styles.fadeInAnimation }}>
            <div style={{ ...styles.slideAnimation, animationDelay: '0.2s' }}>
              <h1 style={{ fontSize: '2.5rem', margin: '0 0 12px', background: 'linear-gradient(135deg, #f57c00, #2e7d32)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {t('home.title', 'Fast, Safe, and Friendly Travel Across Rwanda')}
              </h1>
              <p style={{ color: '#6b7280', margin: '0 0 20px', fontSize: '1.1rem', lineHeight: '1.6' }}>
                {t('home.subtitle', 'Book Public or Private Transport in Minutes — Real-time seat availability, secure payments, and trusted drivers.')}
              </p>
              <Link href="/booking" className="btn" style={{ display: 'inline-flex', gap: '10px', alignItems: 'center', padding: '14px 28px', background: 'linear-gradient(135deg, #f57c00, #e67e22)', color: 'white', borderRadius: '999px', textDecoration: 'none', fontWeight: 'bold', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 4px 15px rgba(245, 124, 0, 0.4)' }} onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(245, 124, 0, 0.6)'; }} onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(245, 124, 0, 0.4)'; }}>
                {t('home.bookNow', 'Book Now')}
              </Link>
            </div>
            <div
              style={{ ...styles.slideAnimation, animationDelay: '0.4s', position: 'relative', height: '360px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
              className="slide-container"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <Image
                src={slides[currentSlide]}
                alt={`Slide ${currentSlide + 1}`}
                fill
                style={{ objectFit: 'cover', transition: 'opacity 0.8s ease' }}
                priority
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.35))', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
                {slides.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: index === currentSlide ? '#f57c00' : 'rgba(255,255,255,0.6)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: index === currentSlide ? '0 0 8px rgba(245, 124, 0, 0.8)' : 'none',
                    }}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
              <div style={{ position: 'absolute', left: '18px', bottom: '22px', color: 'white', textShadow: '0 6px 18px rgba(0,0,0,0.6)', pointerEvents: 'none', maxWidth: '60%' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{t('home.slideTag', 'Comfortable travel with IHUTE')}</h3>
              </div>
            </div>
          </section>

          <section style={{ margin: '48px 0', ...styles.slideAnimation, animationDelay: '0.6s' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '36px', color: '#1f2937', fontSize: '2rem' }}>{t('home.whyChoose', 'Why Choose IHUTE?')}</h2>
            <div style={{ display: 'flex', gap: '20px' }}>
              {[
                { title: t('home.fastBooking', '⚡ Fast Booking'), desc: t('home.fastDesc', 'Complete booking in a few easy steps'), color: '#f57c00' },
                { title: t('home.safeComfort', '🔒 Safe & Comfortable'), desc: t('home.safeDesc', 'Trusted drivers and modern vehicles'), color: '#2e7d32' },
                { title: t('home.realTime', '📍 Real-Time Availability'), desc: t('home.realTimeDesc', 'Seat locking prevents overbooking'), color: '#0066cc' },
              ].map((card, i) => (
                <div key={i} className="card" style={{ flex: 1, background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(16,24,40,0.08)', borderLeft: `4px solid ${card.color}`, transition: 'all 0.3s ease', cursor: 'pointer' }}>
                  <h4 style={{ color: card.color, marginBottom: '8px', fontSize: '1.2rem' }}>{card.title}</h4>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '0.95rem' }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', padding: '40px 0', ...styles.slideAnimation, animationDelay: '0.8s' }}>
            <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(16,24,40,0.08)' }}>
              <h3 style={{ color: '#1f2937', marginBottom: '16px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Image src="/logo.png" alt="IHUTE" width={32} height={32} style={{ borderRadius: '6px' }} />
                {t('home.aboutIHUTE', 'About IHUTE')}
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.8' }}>{t('home.aboutDesc', 'IHUTE provides fast, friendly, and secure transport booking across Rwanda. Book public express buses or private vehicles with real-time tracking and SMS confirmations. We prioritize your safety and comfort on every journey.')}</p>
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #f0f0f0' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>✅ Verified & Licensed Operator</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>✅ 24/7 Customer Support</div>
              </div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f57c00, #e67e22)', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(245, 124, 0, 0.2)', color: 'white' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '1.5rem' }}>📞 Get in Touch</h3>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>✉️ Email</div>
                <a href="mailto:ihutefast@gmail.com" style={{ color: 'white', fontSize: '15px', fontWeight: 500, textDecoration: 'none', display: 'block', marginBottom: '16px' }}>ihutefast@gmail.com</a>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>📱 Phone</div>
                <a href="tel:+250700000000" style={{ color: 'white', fontSize: '15px', fontWeight: 500, textDecoration: 'none', display: 'block', marginBottom: '16px' }}>+250 700 000 000</a>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>📍 Location</div>
                <span style={{ fontSize: '14px', opacity: 0.95 }}>Kigali, Rwanda</span>
              </div>
              <button onClick={() => { window.location.href = '/booking'; }} style={{ width: '100%', padding: '12px', background: 'white', color: '#f57c00', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>Book Now →</button>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}

const inputStyles: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: '2px solid #e6e9ef',
  borderRadius: '8px',
  fontSize: '15px',
  transition: 'all 0.3s ease',
  boxSizing: 'border-box',
};

const buttonStyles: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  background: 'linear-gradient(135deg, #f57c00, #e67e22)',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(245, 124, 0, 0.3)',
};
