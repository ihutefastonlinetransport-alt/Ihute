import { Router } from 'express';
import { query } from '../db.js';
import { hashPassword, comparePassword, generateToken, authMiddleware } from '../auth.js';

const router = Router();

// Driver registration
router.post('/api/drivers/register', async (req, res) => {
  const { name, phone, email, password, license_number } = req.body;

  if (!name || !phone || !email || !password || !license_number) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    const passwordHash = await hashPassword(password);
    const result = await query(
      `INSERT INTO drivers (name, phone, email, password_hash, license_number, status)
       VALUES ($1, $2, $3, $4, $5, 'active') RETURNING driver_id, name, email`,
      [name, phone, email, passwordHash, license_number]
    );

    const token = generateToken({ ...result.rows[0], type: 'driver' });
    res.status(201).json({ token, driver: result.rows[0] });
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email, phone, or license already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Driver login
router.post('/api/drivers/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const result = await query(`SELECT * FROM drivers WHERE email = $1`, [email]);
    const driver = result.rows[0];

    if (!driver) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await comparePassword(password, driver.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ ...driver, type: 'driver' });
    res.json({ token, driver: { driver_id: driver.driver_id, name: driver.name, email: driver.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get driver trips
router.get('/api/drivers/:driver_id/trips', authMiddleware, async (req, res) => {
  const { driver_id } = req.params;

  // Verify the user owns this profile
  if (req.user!.type !== 'driver' || req.user!.id != driver_id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const result = await query(
      `SELECT t.*, b.plate_number, r.from_city, r.to_city, r.distance_km
       FROM trips t
       JOIN buses b ON t.bus_id = b.bus_id
       JOIN routes r ON t.route_id = r.route_id
       WHERE b.bus_id IN (SELECT bus_id FROM buses WHERE express_id IN (SELECT express_id FROM buses JOIN drivers ON drivers.driver_id = $1))
       ORDER BY t.departure_date, t.departure_time`,
      [driver_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

// Update trip status (driver)
router.patch('/api/drivers/trips/:trip_id/status', authMiddleware, async (req, res) => {
  const { trip_id } = req.params;
  const { status } = req.body;

  if (!['in_progress', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const result = await query(`UPDATE trips SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE trip_id = $2 RETURNING *`, [status, trip_id]);

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

// Update driver location
router.patch('/api/drivers/:driver_id/location', authMiddleware, async (req, res) => {
  const { driver_id } = req.params;
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude required' });
  }

  try {
    const result = await query(
      `UPDATE drivers SET lat = $1, lng = $2, updated_at = CURRENT_TIMESTAMP WHERE driver_id = $3 RETURNING *`,
      [lat, lng, driver_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

export default router;
