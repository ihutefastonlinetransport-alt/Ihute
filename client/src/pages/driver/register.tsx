import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import api from '@/api';
import { useAppStore } from '@/store';

export default function DriverRegisterPage() {
  const router = useRouter();
  const { setUser, setToken } = useAppStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicle_type: 'bus',
    vehicle_plate: '',
    vehicle_capacity: '50',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/drivers/register', formData);
      setToken(res.data.token);
      setUser({ ...res.data.driver, type: 'driver' });
      router.push('/driver');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '500px', margin: '60px auto', padding: '40px', background: 'white', borderRadius: '12px', boxShadow: '0 6px 20px rgba(16,24,40,0.08)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Driver Registration</h1>
        {error && <div style={{ padding: '12px', background: '#fee', color: '#c33', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyles} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyles} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={inputStyles} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={inputStyles} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Vehicle Type</label>
            <select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} style={inputStyles}>
              <option value="bus">Bus</option>
              <option value="van">Van</option>
              <option value="car">Car</option>
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Vehicle Plate</label>
            <input type="text" name="vehicle_plate" value={formData.vehicle_plate} onChange={handleChange} required style={inputStyles} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Vehicle Capacity</label>
            <input type="number" name="vehicle_capacity" value={formData.vehicle_capacity} onChange={handleChange} required style={inputStyles} />
          </div>
          <button type="submit" disabled={loading} style={{ ...buttonStyles, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Registering...' : 'Register as Driver'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280' }}>
          Already have an account? <Link href="/login">Login here</Link>
        </p>
      </div>
    </Layout>
  );
}

const inputStyles = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  border: '1px solid #e6e9ef',
  borderRadius: '8px',
  fontSize: '15px',
  boxSizing: 'border-box' as const,
};

const buttonStyles = {
  width: '100%',
  padding: '12px',
  background: '#f57c00',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
};





































































































const buttonStyle = { width: '100%', padding: '12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '12px' };const inputStyle = { width: '100%', padding: '10px', border: '1px solid #e6e9ef', borderRadius: '8px', fontSize: '15px', marginTop: '6px', boxSizing: 'border-box' as const };}  );    </Layout>      </div>        </div>          </div>            Already a driver? <Link href="/login">Login here</Link>          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>          </form>            <button type="submit" disabled={loading} style={buttonStyle}>{loading ? 'Registering...' : 'Register'}</button>            </div>              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} style={inputStyle} required />              <label>Confirm Password</label>            <div style={{ marginBottom: '12px' }}>            </div>              <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} required />              <label>Password</label>            <div style={{ marginBottom: '12px' }}>            </div>              <input name="license_number" value={formData.license_number} onChange={handleChange} style={inputStyle} required />              <label>License Number</label>            <div style={{ marginBottom: '12px' }}>            </div>              <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} required />              <label>Email</label>            <div style={{ marginBottom: '12px' }}>            </div>              <input name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} required />              <label>Phone</label>            <div style={{ marginBottom: '12px' }}>            </div>              <input name="name" value={formData.name} onChange={handleChange} style={inputStyle} required />              <label>Full Name</label>            <div style={{ marginBottom: '12px' }}>          <form onSubmit={handleSubmit}>          {error && <div style={{ padding: '12px', background: '#fee', color: '#c00', borderRadius: '8px', marginBottom: '12px' }}>{error}</div>}          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Driver Registration</h2>        <div style={{ width: '100%', maxWidth: '500px', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(16,24,40,0.08)' }}>      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>    <Layout>  return (  };    }      setLoading(false);    } finally {      setError(err.response?.data?.error || 'Registration failed');    } catch (err: any) {      router.push('/driver');      setUser({ ...res.data.driver, type: 'driver' });      setToken(res.data.token);      });        license_number: formData.license_number,        password: formData.password,        email: formData.email,        phone: formData.phone,        name: formData.name,      const res = await api.post('/api/drivers/register', {    try {    setError('');    setLoading(true);    }      return;      setError('Passwords do not match');    if (formData.password !== formData.confirmPassword) {    e.preventDefault();  const handleSubmit = async (e: React.FormEvent) => {  };    setFormData({ ...formData, [e.target.name]: e.target.value });  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {  const [error, setError] = useState('');  const [loading, setLoading] = useState(false);  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '', confirmPassword: '', license_number: '' });  const { setUser, setToken } = useAppStore();  const router = useRouter();export default function DriverRegister() {import { useAppStore } from '@/store';import api from '@/api';import Layout from '@/components/Layout';import Link from 'next/link';import { useRouter } from 'next/router';import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import api from '@/api';

export default function DriverRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/drivers/register', {
        name,
        phone,
        email,
        password,
        license_number: licenseNumber,
      });

      localStorage.setItem('token', res.data.token);
      router.push('/driver');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
        <div style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(16,24,40,0.08)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Driver Registration</h2>

          {error && <div style={{ padding: '12px', background: '#fee', color: '#c00', borderRadius: '8px', marginBottom: '12px' }}>{error}</div>}

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '12px' }}>
              <label>Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label>Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} required />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label>License Number</label>
              <input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} style={inputStyle} required />
            </div>

            <button type="submit" disabled={loading} style={buttonStyle}>{loading ? 'Registering...' : 'Register'}</button>
          </form>

          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
            Already registered? <Link href="/login">Login here</Link>
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
