import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import api from '@/api';

export default function PaymentPage() {
  const router = useRouter();
  const { booking_id } = router.query;
  const [booking, setBooking] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [amount, setAmount] = useState(5000);

  useEffect(() => {
    if (booking_id) {
      fetchBooking();
    }
  }, [booking_id]);

  const fetchBooking = async () => {
    try {
      const res = await api.get(`/api/bookings/${booking_id}`);
      setBooking(res.data);
      setAmount(res.data.num_seats * 5000); // Mock price calculation
    } catch (err: any) {
      setError(err.response?.data?.error || 'Booking not found');
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async () => {
    if (!booking) return;

    setProcessing(true);
    setError('');

    try {
      const res = await api.post('/api/payments', {
        booking_id: booking.booking_id,
        amount_rwf: 25000, // Example amount, calculate based on seats & price
        method: paymentMethod,
        transaction_id: `TXN-${Date.now()}`,
      });

      setSuccess('Payment successful! Your booking is confirmed.');
      setTimeout(() => router.push('/'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Layout><p>Loading...</p></Layout>;
  if (!booking) return <Layout><p>Booking not found</p></Layout>;

  return (
    <Layout>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '40px 0', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(16,24,40,0.08)' }}>
          <h3>Booking Summary</h3>
          <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e6e9ef' }}>
            <p style={{ margin: '4px 0' }}><strong>Reference:</strong> {booking.booking_reference}</p>
            <p style={{ margin: '4px 0' }}><strong>Passenger:</strong> {booking.passenger_name}</p>
            <p style={{ margin: '4px 0' }}><strong>Phone:</strong> {booking.passenger_phone}</p>
            <p style={{ margin: '4px 0' }}><strong>Seats:</strong> {booking.num_seats}</p>
            <p style={{ margin: '4px 0' }}><strong>Status:</strong> <span style={{ background: '#ffe', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>{booking.status}</span></p>
          </div>
          <div style={{ marginTop: '12px' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2e7d32' }}>RWF 25,000</p>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>(Example: 5 seats × 5,000 RWF per seat)</p>
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(16,24,40,0.08)' }}>
          <h3>Select Payment Method</h3>

          {error && <div style={{ padding: '12px', background: '#fee', color: '#c00', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' }}>{error}</div>}
          {success && <div style={{ padding: '12px', background: '#efe', color: '#080', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' }}>{success}</div>}

          <div style={{ marginBottom: '12px' }}>
            {['momo', 'airtel', 'card', 'cash'].map((method) => (
              <label key={method} style={{ display: 'block', marginBottom: '12px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                {method === 'momo' && '📱 MTN MOMO'}
                {method === 'airtel' && '📱 Airtel Money'}
                {method === 'card' && '💳 Card'}
                {method === 'cash' && '💵 Cash to Driver'}
              </label>
            ))}
          </div>

          <button
            onClick={processPayment}
            disabled={processing}
            style={{ width: '100%', padding: '12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
          >
            {processing ? 'Processing...' : `Pay RWF 25,000`}
          </button>

          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '12px', textAlign: 'center' }}>Your payment is secure and encrypted.</p>
        </div>
      </div>
    </Layout>
  );
}
