import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import api from '@/api';
import { useAppStore } from '@/store';

export default function DriverDashboard() {
  const router = useRouter();
  const { user, token } = useAppStore();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchTrips();
  }, [token, user?.id]);

  const fetchTrips = async () => {
    try {
      const res = await api.get(`/api/drivers/${user?.id}/trips`);
      setTrips(res.data);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTripStatus = async () => {
    if (!selectedTrip || !newStatus) return;

    try {
      await api.patch(`/api/drivers/trips/${selectedTrip.trip_id}/status`, { status: newStatus });
      alert('Trip status updated');
      setSelectedTrip(null);
      setNewStatus('');
      fetchTrips();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <div style={{ padding: '40px 0' }}>
        <h1>My Trips</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div>
            <h3>Assigned Trips</h3>
            {trips.length === 0 ? (
              <p>No trips assigned yet</p>
            ) : (
              trips.map((trip) => (
                <div
                  key={trip.trip_id}
                  onClick={() => setSelectedTrip(trip)}
                  style={{
                    ...tripCardStyles,
                    background: selectedTrip?.trip_id === trip.trip_id ? '#f0f7ff' : 'white',
                    borderLeft: selectedTrip?.trip_id === trip.trip_id ? '4px solid #2e7d32' : '4px solid transparent',
                  }}
                >
                  <strong>{trip.from_city} → {trip.to_city}</strong>
                  <p style={{ color: '#6b7280', margin: '4px 0' }}>Date: {trip.departure_date} @ {trip.departure_time}</p>
                  <p style={{ color: '#6b7280', margin: '4px 0' }}>Bus: {trip.plate_number} | {trip.distance_km}km</p>
                  <span style={statusBadgeStyles(trip.status)}>{trip.status}</span>
                </div>
              ))
            )}
          </div>

          {selectedTrip && (
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(16,24,40,0.08)', height: 'fit-content' }}>
              <h4>Update Trip Status</h4>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>New Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #e6e9ef', borderRadius: '8px' }}>
                  <option value="">Select Status</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button onClick={updateTripStatus} style={{ width: '100%', padding: '10px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Update</button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const tripCardStyles = {
  padding: '16px',
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 6px 20px rgba(16,24,40,0.08)',
  marginBottom: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const statusBadgeStyles = (status: string) => ({
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  background: status === 'completed' ? '#efe' : status === 'in_progress' ? '#efe' : '#ffe',
  color: status === 'completed' ? '#080' : status === 'in_progress' ? '#080' : '#880',
});
