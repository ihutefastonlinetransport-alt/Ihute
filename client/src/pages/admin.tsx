import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Image from 'next/image';
import api from '@/api';
import { useAppStore } from '@/store';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, token } = useAppStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'bookings' | 'audit' | 'routes' | 'buses'>('bookings');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const bookingsRes = await api.get('/api/admin/bookings');
      setBookings(bookingsRes.data || []);

      if (user?.role === 'super_admin') {
        const auditRes = await api.get('/api/admin/audit-logs');
        setAuditLogs(auditRes.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (bookingId: number) => {
    try {
      await api.post(`/api/admin/bookings/${bookingId}/confirm-payment`, { method: 'cash', amount_rwf: 0 });
      fetchData();
    } catch (err) {
      console.error('Confirm payment failed', err);
      alert('Confirm payment failed');
    }
  };

  if (loading) return (
    <Layout>
      <div style={{ padding: '40px 0' }}><p>Loading...</p></div>
    </Layout>
  );

  return (
    <Layout>
      <div style={{ padding: '40px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
          <Image src="/logo.png" alt="IHUTE" width={56} height={56} style={{ borderRadius: 8 }} />
          <div>
            <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
            <div style={{ color: '#6b7280', fontSize: '13px' }}>Manage buses, routes, bookings and payments</div>
          </div>
        </div>
        <p>Role: {user?.role}</p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          {['bookings', 'audit', 'routes', 'buses'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              style={{ ...tabButtonStyles, background: tab === t ? '#2e7d32' : '#fff', color: tab === t ? 'white' : '#000' }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'bookings' && (
          <div style={tableContainerStyles}>
            <h3>Recent Bookings</h3>
            {bookings.length === 0 ? (
              <p>No bookings found</p>
            ) : (
              <table style={tableStyles}>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Reference</th>
                    <th>Passenger</th>
                    <th>Seats</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.booking_id}>
                      <td>{b.booking_id}</td>
                      <td>{b.booking_reference}</td>
                      <td>{b.passenger_name}</td>
                      <td>{b.num_seats}</td>
                      <td><span style={statusBadgeStyles(b.status)}>{b.status}</span></td>
                      <td>{new Date(b.created_at).toLocaleDateString()}</td>
                      <td>
                        {b.status !== 'paid' && (
                          <button onClick={() => confirmPayment(b.booking_id)} style={{ padding: '6px 10px', borderRadius: 6, background: '#2e7d32', color: 'white', border: 'none', cursor: 'pointer' }}>Confirm Payment</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'audit' && user?.role === 'super_admin' && (
          <div style={tableContainerStyles}>
            <h3>Audit Logs</h3>
            {auditLogs.length === 0 ? (
              <p>No audit logs</p>
            ) : (
              <table style={tableStyles}>
                <thead>
                  <tr>
                    <th>Admin</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.log_id}>
                      <td>{log.admin_name}</td>
                      <td>{log.action}</td>
                      <td>{log.entity_type}#{log.entity_id}</td>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

const tabButtonStyles = { padding: '10px 16px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' };
const tableContainerStyles = { maxWidth: '100%', overflowX: 'auto' };
const tableStyles = { width: '100%', borderCollapse: 'collapse' as const, marginTop: '20px', border: '1px solid #e6e9ef' };
const statusBadgeStyles = (status: string) => ({ padding: '4px 8px', borderRadius: '4px', background: status === 'paid' ? '#c8e6c9' : '#fff3cd' });












































































































































































































































































const tableStyle = { width: '100%', borderCollapse: 'collapse' as const, marginTop: '20px', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' };const buttonStyle = { padding: '12px 24px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };const inputStyle = { width: '100%', padding: '10px', border: '1px solid #e6e9ef', borderRadius: '8px', fontSize: '15px' };const formGroupStyle = { flex: 1 };const formRowStyle = { display: 'flex', gap: '12px', marginBottom: '12px' };const formStyle = { background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' };const tabButtonStyle = { padding: '10px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer' };const tabsStyle = { display: 'flex', gap: '12px', marginBottom: '20px' };}  );    </Layout>      </div>        )}          </div>            )}              </table>                </tbody>                  ))}                    </tr>                      <td>{new Date(log.created_at).toLocaleString()}</td>                      <td>{log.entity_type}</td>                      <td>{log.action}</td>                      <td>{log.admin_name || 'System'}</td>                    <tr key={log.log_id}>                  {auditLogs.slice(0, 50).map((log) => (                <tbody>                </thead>                  </tr>                    <th>Timestamp</th>                    <th>Entity</th>                    <th>Action</th>                    <th>Admin</th>                  <tr>                <thead>              <table style={tableStyle}>            ) : (              <p>No audit logs</p>            ) : auditLogs.length === 0 ? (              <p>Loading...</p>            {loading ? (            <h2>Audit Logs</h2>          <div>        {tab === 'audit' && user.role === 'super_admin' && (        )}          </div>            </form>              </button>                {loading ? 'Creating...' : 'Create Route & Bus'}              <button type="submit" disabled={loading} style={buttonStyle}>              </div>                </div>                  />                    required                    style={inputStyle}                    onChange={(e) => setFormData({ ...formData, seat_count: +e.target.value })}                    value={formData.seat_count}                    type="number"                  <input                  <label>Seats</label>                <div style={formGroupStyle}>                </div>                  </select>                    <option value="BigBus">BigBus</option>                    <option value="MiniBus">MiniBus</option>                    <option value="Coaster">Coaster</option>                  >                    style={inputStyle}                    onChange={(e) => setFormData({ ...formData, bus_type: e.target.value })}                    value={formData.bus_type}                  <select                  <label>Bus Type</label>                <div style={formGroupStyle}>                </div>                  />                    required                    style={inputStyle}                    onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}                    value={formData.plate_number}                  <input                  <label>Plate Number</label>                <div style={formGroupStyle}>              <div style={formRowStyle}>              </div>                </div>                  />                    required                    style={inputStyle}                    onChange={(e) => setFormData({ ...formData, price_rwf: +e.target.value })}                    value={formData.price_rwf}                    type="number"                  <input                  <label>Price (RWF)</label>                <div style={formGroupStyle}>                </div>                  />                    style={inputStyle}                    onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}                    value={formData.distance_km}                    type="number"                  <input                  <label>Distance (km)</label>                <div style={formGroupStyle}>              <div style={formRowStyle}>              </div>                </div>                  />                    required                    style={inputStyle}                    onChange={(e) => setFormData({ ...formData, to_city: e.target.value })}                    value={formData.to_city}                  <input                  <label>To City</label>                <div style={formGroupStyle}>                </div>                  />                    required                    style={inputStyle}                    onChange={(e) => setFormData({ ...formData, from_city: e.target.value })}                    value={formData.from_city}                  <input                  <label>From City</label>                <div style={formGroupStyle}>              <div style={formRowStyle}>            <form onSubmit={handleCreateTrip} style={formStyle}>            <h2>Create Route & Bus</h2>          <div>        {tab === 'management' && (        )}          </div>            )}              </table>                </tbody>                  ))}                    </tr>                      <td>{new Date(b.created_at).toLocaleDateString()}</td>                      <td><span style={{ padding: '4px 8px', borderRadius: '4px', background: b.status === 'paid' ? '#efe' : '#fee', color: b.status === 'paid' ? '#080' : '#c00' }}>{b.status}</span></td>                      <td>{b.num_seats}</td>                      <td>{b.passenger_phone}</td>                      <td>{b.passenger_name}</td>                      <td>{b.booking_reference}</td>                    <tr key={b.booking_id}>                  {bookings.map((b) => (                <tbody>                </thead>                  </tr>                    <th>Date</th>                    <th>Status</th>                    <th>Seats</th>                    <th>Phone</th>                    <th>Passenger</th>                    <th>Reference</th>                  <tr>                <thead>              <table style={tableStyle}>            ) : (              <p>No bookings found</p>            ) : bookings.length === 0 ? (              <p>Loading...</p>            {loading ? (            <h2>Bookings</h2>          <div>        {tab === 'bookings' && (        )}          </div>            {message}          <div style={{ padding: '12px', background: message.includes('success') ? '#efe' : '#fee', color: message.includes('success') ? '#080' : '#c00', borderRadius: '8px', marginBottom: '12px' }}>        {message && (        </div>          ))}            </button>              {tabName === 'audit' ? 'Audit Logs' : tabName === 'management' ? 'Manage Routes' : 'Bookings'}            >              style={{ ...tabButtonStyle, fontWeight: tab === tabName ? 'bold' : 'normal', background: tab === tabName ? '#2e7d32' : '#f7f7fb', color: tab === tabName ? 'white' : '#000' }}              onClick={() => setTab(tabName)}              key={tabName}            <button          {['bookings', 'management', user.role === 'super_admin' ? 'audit' : null].filter(Boolean).map((tabName: any) => (        <div style={tabsStyle}>        <h1>Admin Dashboard — {user.role?.replace('_', ' ').toUpperCase()}</h1>      <div style={{ padding: '40px 0' }}>    <Layout>  return (  if (!user) return <Layout><div>Redirecting...</div></Layout>;  };    }      setLoading(false);    } finally {      setMessage(error.response?.data?.error || 'Failed to create trip');    } catch (error: any) {      setFormData({ name: '', from_city: '', to_city: '', distance_km: '', plate_number: '', bus_type: 'BigBus', seat_count: 50, price_rwf: 25000 });      setMessage('Route, bus, and pricing created successfully!');      });        price_rwf: formData.price_rwf,        route_id: routeRes.data.route_id,      await api.post('/api/admin/express-routes', {      // Set price      });        seat_count: formData.seat_count,        bus_type: formData.bus_type,        plate_number: formData.plate_number,      const busRes = await api.post('/api/admin/buses', {      // Create bus      });        distance_km: formData.distance_km,        to_city: formData.to_city,        from_city: formData.from_city,      const routeRes = await api.post('/api/admin/routes', {      // Create route    try {    setLoading(true);    e.preventDefault();  const handleCreateTrip = async (e: React.FormEvent) => {  };    }      setLoading(false);    } finally {      console.error('Error:', error);    } catch (error) {      }        setAuditLogs(res.data);        const res = await api.get('/api/admin/audit-logs');      } else if (tab === 'audit' && user?.role === 'super_admin') {        setBookings(res.data);        const res = await api.get('/api/admin/bookings');      if (tab === 'bookings') {    try {    setLoading(true);  const fetchData = async () => {  }, [token, tab]);    fetchData();    }      return;      router.push('/login');    if (!token) {  useEffect(() => {  const [message, setMessage] = useState('');  const [formData, setFormData] = useState({ name: '', from_city: '', to_city: '', distance_km: '', plate_number: '', bus_type: 'BigBus', seat_count: 50, price_rwf: 25000 });  const [loading, setLoading] = useState(false);  const [auditLogs, setAuditLogs] = useState<any[]>([]);  const [bookings, setBookings] = useState<any[]>([]);  const [tab, setTab] = useState('bookings');  const { user, token } = useAppStore();  const router = useRouter();export default function AdminDashboard() {import { useAppStore } from '@/store';import api from '@/api';import Layout from '@/components/Layout';import { useRouter } from 'next/router';import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import api from '@/api';
import { useAppStore } from '@/store';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, token } = useAppStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'bookings' | 'audit' | 'routes' | 'buses'>('bookings');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const bookingsRes = await api.get('/api/admin/bookings');
      setBookings(bookingsRes.data);

      if (user?.role === 'super_admin') {
        const auditRes = await api.get('/api/admin/audit-logs');
        setAuditLogs(auditRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <div style={{ padding: '40px 0' }}>
        <h1>Admin Dashboard</h1>
        <p>Role: {user?.role}</p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          {['bookings', 'audit', 'routes', 'buses'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              style={{ ...tabButtonStyles, background: tab === t ? '#2e7d32' : '#fff', color: tab === t ? 'white' : '#000' }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'bookings' && (
          <div style={tableContainerStyles}>
            <h3>Recent Bookings</h3>
            {bookings.length === 0 ? (
              <p>No bookings found</p>
            ) : (
              <table style={tableStyles}>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Reference</th>
                    <th>Passenger</th>
                    <th>Seats</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.booking_id}>
                      <td>{b.booking_id}</td>
                      <td>{b.booking_reference}</td>
                      <td>{b.passenger_name}</td>
                      <td>{b.num_seats}</td>
                      <td><span style={statusBadgeStyles(b.status)}>{b.status}</span></td>
                      <td>{new Date(b.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'audit' && user?.role === 'super_admin' && (
          <div style={tableContainerStyles}>
            <h3>Audit Logs</h3>
            {auditLogs.length === 0 ? (
              <p>No audit logs</p>
            ) : (
              <table style={tableStyles}>
                <thead>
                  <tr>
                    <th>Admin</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.log_id}>
                      <td>{log.admin_name}</td>
                      <td>{log.action}</td>
                      <td>{log.entity_type}#{log.entity_id}</td>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'routes' && (
          <div style={tableContainerStyles}>
            <h3>Create Route</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Route created'); }} style={formStyles}>
              <div>
                <label>From City</label>
                <input placeholder="e.g., Kigali" style={inputStyle} />
              </div>
              <div>
                <label>To City</label>
                <input placeholder="e.g., Musanze" style={inputStyle} />
              </div>
              <div>
                <label>Distance (km)</label>
                <input type="number" placeholder="e.g., 60" style={inputStyle} />
              </div>
              <button type="submit" style={buttonStyle}>Create Route</button>
            </form>
          </div>
        )}

        {tab === 'buses' && (
          <div style={tableContainerStyles}>
            <h3>Add Bus</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Bus added'); }} style={formStyles}>
              <div>
                <label>Plate Number</label>
                <input placeholder="e.g., RW-123-ABC" style={inputStyle} required />
              </div>
              <div>
                <label>Bus Type</label>
                <select style={inputStyle} required>
                  <option value="">Select</option>
                  <option value="Coaster">Coaster</option>
                  <option value="MiniBus">MiniBus</option>
                  <option value="BigBus">BigBus</option>
                </select>
              </div>
              <div>
                <label>Seat Count</label>
                <input type="number" placeholder="e.g., 45" style={inputStyle} required />
              </div>
              <button type="submit" style={buttonStyle}>Add Bus</button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}

const tabButtonStyles = {
  padding: '10px 16px',
  border: '1px solid #e6e9ef',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
};

const tableContainerStyles = {
  background: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 6px 20px rgba(16,24,40,0.08)',
};

const tableStyles = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const statusBadgeStyles = (status: string) => ({
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  background: status === 'paid' ? '#efe' : status === 'pending' ? '#ffe' : '#fee',
  color: status === 'paid' ? '#080' : status === 'pending' ? '#880' : '#c00',
});

const formStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  marginTop: '12px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #e6e9ef',
  borderRadius: '8px',
  fontSize: '14px',
  boxSizing: 'border-box' as const,
};

const buttonStyle = {
  gridColumn: '1 / -1',
  padding: '10px',
  background: '#2e7d32',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};
