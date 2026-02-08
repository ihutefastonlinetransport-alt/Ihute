import React from 'react';
import Layout from '@/components/Layout';
import BookingForm from '@/components/BookingForm';
import { useT } from '@/i18n';

export default function BookingPage() {
  const t = useT();
  return (
    <Layout>
      <div style={{ padding: '40px 0' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>{t('booking.title', 'Book Your Transport')}</h1>
        <BookingForm />
      </div>
    </Layout>
  );
}
