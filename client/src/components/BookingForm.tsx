import React, { useState } from 'react';
import api from '@/api';
import { useT } from '@/i18n';

interface BookingFormProps {
  onSuccess?: (bookingId: number) => void;
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const t = useT();
  const [step, setStep] = useState(1);
  const [transportType, setTransportType] = useState('public');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState('');
  const [numSeats, setNumSeats] = useState(1);
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const searchTrips = async () => {
    if (!fromCity || !toCity || !date) {
      setError(t('booking.fillAllFields', 'Please fill all fields'));
      return;
    }

    setLoading(true);
    try {
      const res = await api.get('/api/trips/search', { params: { from_city: fromCity, to_city: toCity, departure_date: date, num_seats: numSeats } });
      setTrips(res.data);
      setStep(2);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || t('booking.bookingFailed', 'Search failed'));
    } finally {
      setLoading(false);
    }
  };

  const submitBooking = async () => {
    if (!passengerName || !passengerPhone) {
      setError(t('booking.fillAllFields', 'Name and phone required'));
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/bookings', {
        trip_id: selectedTrip?.trip_id || null,
        car_id: null,
        passenger_name: passengerName,
        passenger_phone: passengerPhone,
        passenger_email: passengerEmail,
        num_seats: numSeats,
      });
      setSuccess(`Booking created! Reference: ${res.data.booking_reference}`);
      onSuccess?.(res.data.booking_id);
      setStep(5);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={formContainerStyles}>
      <h2>Book Your Ride</h2>

      {error && <div style={{ ...messageStyles, background: '#fee', color: '#c00' }}>{error}</div>}
      {success && <div style={{ ...messageStyles, background: '#efe', color: '#080' }}>{success}</div>}

      {step === 1 && (
        <>
          <div style={stepStyles}>
            <label>Transport Type</label>
            <select value={transportType} onChange={(e) => setTransportType(e.target.value)} style={inputStyles}>
              <option value="public">Public Express</option>
              <option value="private">Private Vehicle</option>
            </select>
          </div>
          <div style={stepStyles}>
            <label>From</label>
            <input value={fromCity} onChange={(e) => setFromCity(e.target.value)} placeholder="e.g., Kigali" style={inputStyles} />
          </div>
          <div style={stepStyles}>
            <label>To</label>
            <input value={toCity} onChange={(e) => setToCity(e.target.value)} placeholder="e.g., Musanze" style={inputStyles} />
          </div>
          <div style={rowStyles}>
            <div style={{ flex: 1 }}>
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyles} />
            </div>
            <div style={{ width: '120px' }}>
              <label>Seats</label>
              <input type="number" min={1} value={numSeats} onChange={(e) => setNumSeats(+e.target.value)} style={inputStyles} />
            </div>
          </div>
          <button onClick={searchTrips} disabled={loading} style={buttonStyles}>{loading ? 'Searching...' : 'Search'}</button>
        </>
      )}

      {step === 2 && (
        <>
          <h3>Select a Trip</h3>
          {trips.length === 0 ? (
            <p>No trips found</p>
          ) : (
            trips.map((trip) => (
              <div
                key={trip.trip_id}
                onClick={() => { setSelectedTrip(trip); setStep(4); }}
                style={{ ...tripCardStyles, cursor: 'pointer' }}
              >
                <strong>{trip.express_name}</strong> | {trip.departure_time} | {trip.available_seats} seats | {trip.price_rwf} RWF
              </div>
            ))
          )}
          <button onClick={() => setStep(1)} style={{ ...buttonStyles, background: '#fff', color: '#000', border: '1px solid #ddd' }}>Back</button>
        </>
      )}

      {step === 4 && (
        <>
          <h3>Passenger Information</h3>
          <div style={stepStyles}>
            <label>Full Name</label>
            <input value={passengerName} onChange={(e) => setPassengerName(e.target.value)} style={inputStyles} />
          </div>
          <div style={stepStyles}>
            <label>Phone</label>
            <input value={passengerPhone} onChange={(e) => setPassengerPhone(e.target.value)} style={inputStyles} />
          </div>
          <div style={stepStyles}>
            <label>Email (optional)</label>
            <input type="email" value={passengerEmail} onChange={(e) => setPassengerEmail(e.target.value)} style={inputStyles} />
          </div>
          <button onClick={submitBooking} disabled={loading} style={buttonStyles}>{loading ? 'Processing...' : 'Proceed to Payment'}</button>
        </>
      )}

      {step === 5 && (
        <>
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <h3>✓ Booking Confirmed!</h3>
            <p>Check your email and SMS for confirmation details.</p>
          </div>
        </>
      )}
    </div>
  );
}

const formContainerStyles = {
  background: 'white',
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0 6px 20px rgba(16,24,40,0.08)',
  maxWidth: '500px',
  margin: '0 auto',
};

const stepStyles = {
  marginBottom: '12px',
};

const inputStyles = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #e6e9ef',
  fontSize: '15px',
  marginTop: '6px',
};

const rowStyles = {
  display: 'flex',
  gap: '8px',
  marginBottom: '12px',
};

const buttonStyles = {
  width: '100%',
  padding: '12px',
  background: '#2e7d32',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '12px',
};

const messageStyles = {
  padding: '12px',
  borderRadius: '8px',
  marginBottom: '12px',
};

const tripCardStyles = {
  padding: '12px',
  background: '#f7f7fb',
  borderRadius: '8px',
  marginBottom: '8px',
  border: '1px solid #e6e9ef',
};
