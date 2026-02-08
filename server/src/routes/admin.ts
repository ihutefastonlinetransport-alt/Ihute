import { Router, Request, Response } from 'express';
import { query } from '../db.js';
import { hashPassword, comparePassword, generateToken, authMiddleware, roleMiddleware } from '../auth.js';
import { logAuditAction, initializeSeatAvailability } from '../services.js';

const router = Router();

// Admin login
router.post('/api/admin/login', async (req, res) => {
  const { email, password, permanent_code } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const result = await query(`SELECT * FROM admins WHERE email = $1`, [email]);
    const admin = result.rows[0];

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For express admins, validate permanent code
    if (admin.role === 'express_admin' && admin.permanent_code !== permanent_code) {
      return res.status(401).json({ error: 'Invalid permanent code' });
    }

    const passwordMatch = await comparePassword(password, admin.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ ...admin, type: 'admin' });
    res.json({ token, admin: { admin_id: admin.admin_id, name: admin.name, role: admin.role, express_id: admin.express_id } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Create express (super admin only)
router.post('/api/admin/expresses', authMiddleware, roleMiddleware(['super_admin']), async (req, res) => {
  const { name, logo_url } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Express name required' });
  }

  try {
    const result = await query(
      `INSERT INTO expresses (name, logo_url, status) VALUES ($1, $2, 'active') RETURNING *`,
      [name, logo_url || null]
    );

    await logAuditAction(req.user!.id, 'CREATE_EXPRESS', 'expresses', result.rows[0].express_id, null, result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

// Create route
router.post('/api/admin/routes', authMiddleware, roleMiddleware(['super_admin', 'express_admin']), async (req, res) => {
  const { from_city, to_city, distance_km } = req.body;

  if (!from_city || !to_city) {
    return res.status(400).json({ error: 'Cities required' });
  }

  try {
    const result = await query(
      `INSERT INTO routes (from_city, to_city, distance_km) VALUES ($1, $2, $3) RETURNING *`,
      [from_city, to_city, distance_km || null]
    );

    await logAuditAction(req.user!.id, 'CREATE_ROUTE', 'routes', result.rows[0].route_id, null, result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

// Create bus
router.post('/api/admin/buses', authMiddleware, roleMiddleware(['super_admin', 'express_admin']), async (req, res) => {
  const { express_id, plate_number, bus_type, seat_count } = req.body;

  if (!plate_number || !bus_type || !seat_count) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await query(
      `INSERT INTO buses (express_id, plate_number, bus_type, seat_count, status) VALUES ($1, $2, $3, $4, 'active') RETURNING *`,
      [express_id || req.user!.express_id, plate_number, bus_type, seat_count]
    );

    // Initialize seat availability
    await initializeSeatAvailability('trip', result.rows[0].bus_id, seat_count);

    await logAuditAction(req.user!.id, 'CREATE_BUS', 'buses', result.rows[0].bus_id, null, result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

// Create trip
router.post('/api/admin/trips', authMiddleware, roleMiddleware(['super_admin', 'express_admin']), async (req, res) => {
  const { bus_id, route_id, departure_date, departure_time } = req.body;

  if (!bus_id || !route_id || !departure_date || !departure_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await query(
      `INSERT INTO trips (bus_id, route_id, departure_date, departure_time, status) VALUES ($1, $2, $3, $4, 'scheduled') RETURNING *`,
      [bus_id, route_id, departure_date, departure_time]
    );

    // Get seat count from bus
    const busResult = await query(`SELECT seat_count FROM buses WHERE bus_id = $1`, [bus_id]);
    if (busResult.rows[0]) {
      await initializeSeatAvailability('trip', result.rows[0].trip_id, busResult.rows[0].seat_count);
    }

    await logAuditAction(req.user!.id, 'CREATE_TRIP', 'trips', result.rows[0].trip_id, null, result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

// Set route price
router.post('/api/admin/express-routes', authMiddleware, roleMiddleware(['super_admin', 'express_admin']), async (req, res) => {
  const { express_id, route_id, price_rwf } = req.body;

  if (!route_id || !price_rwf) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await query(
      `INSERT INTO express_routes (express_id, route_id, price_rwf) VALUES ($1, $2, $3)
       ON CONFLICT (express_id, route_id) DO UPDATE SET price_rwf = $3 RETURNING *`,
      [express_id || req.user!.express_id, route_id, price_rwf]
    );

    await logAuditAction(req.user!.id, 'SET_PRICE', 'express_routes', result.rows[0].id, null, result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

// View bookings for express admin (or all for super admin)
router.get('/api/admin/bookings', authMiddleware, roleMiddleware(['super_admin', 'express_admin', 'viewer_admin']), async (req, res) => {
  try {
    let sql = `SELECT b.*, t.departure_date, t.departure_time, e.name as express_name
               FROM bookings b
               LEFT JOIN trips t ON b.trip_id = t.trip_id
               LEFT JOIN buses bu ON t.bus_id = bu.bus_id
               LEFT JOIN expresses e ON bu.express_id = e.express_id`;

    const params: any[] = [];

    // Express admins can only see their express bookings
    if (req.user!.role === 'express_admin') {
      sql += ` WHERE bu.express_id = $1`;
      params.push(req.user!.express_id);
    }

    sql += ` ORDER BY b.created_at DESC LIMIT 100`;

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

// View audit logs (super admin only)
router.get('/api/admin/audit-logs', authMiddleware, roleMiddleware(['super_admin']), async (req, res) => {
  try {
    const result = await query(
      `SELECT al.*, a.name as admin_name FROM audit_logs al
       LEFT JOIN admins a ON al.admin_id = a.admin_id
       ORDER BY al.created_at DESC LIMIT 500`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

// Export bookings report (CSV) - supports ?type=daily|monthly
router.get('/api/admin/reports', authMiddleware, roleMiddleware(['super_admin', 'express_admin']), async (req, res) => {
  try {
    const type = (req.query.type as string) || 'daily';
    let where = '';
    if (type === 'daily') {
      where = `WHERE DATE(b.created_at) = CURRENT_DATE`;
    } else if (type === 'monthly') {
      where = `WHERE DATE_TRUNC('month', b.created_at) = DATE_TRUNC('month', CURRENT_DATE)`;
    }

    // Express admins only their express
    if (req.user!.role === 'express_admin') {
      where += (where ? ' AND ' : ' WHERE ') + `bu.express_id = ${req.user!.express_id}`;
    }

    const sql = `SELECT b.booking_id, b.booking_reference, b.passenger_name, b.passenger_phone, b.num_seats, b.status, b.created_at, e.name as express_name, r.from_city, r.to_city
                 FROM bookings b
                 LEFT JOIN trips t ON b.trip_id = t.trip_id
                 LEFT JOIN buses bu ON t.bus_id = bu.bus_id
                 LEFT JOIN expresses e ON bu.express_id = e.express_id
                 LEFT JOIN routes r ON t.route_id = r.route_id
                 ${where} ORDER BY b.created_at DESC`;

    const result = await query(sql, []);

    // Build CSV
    const rows = result.rows;
    const header = ['booking_id','booking_reference','passenger_name','passenger_phone','num_seats','status','created_at','express_name','from_city','to_city'];
    const csv = [header.join(',')].concat(rows.map((r: any) => header.map((h) => `"${(r[h] ?? '')}"`).join(','))).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="ihute_report_${type}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Admin confirm cash payment for a booking
router.post('/api/admin/bookings/:booking_id/confirm-payment', authMiddleware, roleMiddleware(['super_admin', 'express_admin']), async (req, res) => {
  const { booking_id } = req.params;
  const { amount_rwf, method, transaction_id } = req.body;
  try {
    const bookingRes = await query(`SELECT * FROM bookings WHERE booking_id = $1`, [booking_id]);
    if (!bookingRes.rows[0]) return res.status(404).json({ error: 'Booking not found' });

    const booking = bookingRes.rows[0];

    // Create payment record
    const paymentResult = await query(
      `INSERT INTO payments (booking_id, amount_rwf, method, status, transaction_id) VALUES ($1, $2, $3, 'completed', $4) RETURNING *`,
      [booking_id, amount_rwf || 0, method || 'cash', transaction_id || `ADMIN-${Date.now()}`]
    );

    // Confirm booking seats
    await query(`UPDATE bookings SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE booking_id = $1`, [booking_id]);

    await logAuditAction(req.user!.id, 'CONFIRM_PAYMENT', 'bookings', Number(booking_id), null, paymentResult.rows[0]);

    res.json({ status: 'completed', payment: paymentResult.rows[0] });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

export default router;


