import { Router } from 'express';
import { query } from '../db.js';
import { getAvailableSeats, generateBookingReference, lockSeats, unlockSeats, confirmBooking, isWithinBookingCutoff } from '../services.js';

const router = Router();

// Search trips (public)
router.get('/api/trips/search', async (req, res) => {
  const { from_city, to_city, departure_date, num_seats } = req.query as any;

  if (!from_city || !to_city || !departure_date) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const result = await query(
      `SELECT t.trip_id, t.bus_id, t.departure_time, b.plate_number, b.seat_count, b.bus_type,
              e.name as express_name, r.from_city, r.to_city, er.price_rwf
       FROM trips t
       JOIN buses b ON t.bus_id = b.bus_id
       JOIN expresses e ON b.express_id = e.express_id
       JOIN routes r ON t.route_id = r.route_id
       JOIN express_routes er ON e.express_id = er.express_id AND r.route_id = er.route_id
       WHERE r.from_city = $1 AND r.to_city = $2 AND DATE(t.departure_date) = $3 AND t.status = 'scheduled'
       ORDER BY t.departure_time`,
      [from_city, to_city, departure_date]
    );

    // Get available seats for each trip
    for (const trip of result.rows) {
      const available = await getAvailableSeats('trip', trip.trip_id);
      trip.available_seats = available;
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Search private cars
router.get('/api/cars/search', async (req, res) => {
  const { from_city, to_city, departure_date, num_seats } = req.query as any;

  try {
    const result = await query(
      `SELECT c.car_id, d.name as driver_name, d.phone, c.plate_number, c.car_type, c.seat_count, d.lat, d.lng
       FROM private_cars c
       JOIN drivers d ON c.driver_id = d.driver_id
       WHERE c.status = 'active' AND d.status = 'active'`,
      []
    );

    for (const car of result.rows) {
      const available = await getAvailableSeats('car', car.car_id);
      car.available_seats = available;
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Create booking (public)
router.post('/api/bookings', async (req, res) => {
  const { trip_id, car_id, passenger_name, passenger_phone, passenger_email, num_seats } = req.body;

  if (!passenger_name || !passenger_phone || !num_seats) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Only one of trip_id or car_id should be provided
  if (!trip_id && !car_id) {
    return res.status(400).json({ error: 'Either trip_id or car_id required' });
  }

  try {
    // Check booking cutoff for public trips
    if (trip_id) {
      const withinCutoff = await isWithinBookingCutoff(trip_id);
      if (!withinCutoff) {
        return res.status(400).json({ error: 'Booking cutoff has passed (30 minutes before departure)' });
      }
    }

    // Try to lock seats
    const entityType = trip_id ? 'trip' : 'car';
    const entityId = trip_id || car_id;
    const locked = await lockSeats(entityType, entityId, num_seats);

    if (!locked) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    // Create booking
    const reference = generateBookingReference();
    const bookingResult = await query(
      `INSERT INTO bookings (trip_id, car_id, passenger_name, passenger_phone, passenger_email, num_seats, status, booking_reference)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)
       RETURNING *`,
      [trip_id || null, car_id || null, passenger_name, passenger_phone, passenger_email || null, num_seats, reference]
    );

    res.status(201).json({
      booking_id: bookingResult.rows[0].booking_id,
      booking_reference: reference,
      status: 'pending',
      seats_locked: true,
      message: 'Booking created. Proceed to payment.'
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Booking failed' });
  }
});

// Get booking details
router.get('/api/bookings/:booking_id', async (req, res) => {
  const { booking_id } = req.params;

  try {
    const result = await query(
      `SELECT * FROM bookings WHERE booking_id = $1`,
      [booking_id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

// Cancel booking
router.post('/api/bookings/:booking_id/cancel', async (req, res) => {
  const { booking_id } = req.params;

  try {
    const bookingResult = await query(`SELECT * FROM bookings WHERE booking_id = $1`, [booking_id]);
    if (!bookingResult.rows[0]) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    // Unlock seats
    if (booking.trip_id) {
      await unlockSeats('trip', booking.trip_id, booking.num_seats);
    } else {
      await unlockSeats('car', booking.car_id, booking.num_seats);
    }

    // Update booking status
    await query(`UPDATE bookings SET status = 'cancelled' WHERE booking_id = $1`, [booking_id]);

    res.json({ message: 'Booking cancelled', seats_unlocked: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Cancellation failed' });
  }
});

export default router;
