import { Router } from 'express';
import { query } from '../db.js';
import { confirmBooking, logAuditAction } from '../services.js';

const router = Router();

// Process payment (simulated)
router.post('/api/payments', async (req, res) => {
  const { booking_id, amount_rwf, method, transaction_id } = req.body;

  if (!booking_id || !amount_rwf || !method) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!['momo', 'airtel', 'card', 'cash'].includes(method)) {
    return res.status(400).json({ error: 'Invalid payment method' });
  }

  try {
    // Get booking details
    const bookingResult = await query(`SELECT * FROM bookings WHERE booking_id = $1`, [booking_id]);
    if (!bookingResult.rows[0]) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    // Simulate payment processing
    // In production, integrate with actual payment providers
    const paymentStatus = 'completed'; // Simulated success

    if (paymentStatus === 'completed') {
      // Confirm booking
      await confirmBooking(booking.trip_id ? 'trip' : 'car', booking.trip_id || booking.car_id, booking.num_seats);

      // Create payment record
      const paymentResult = await query(
        `INSERT INTO payments (booking_id, amount_rwf, method, status, transaction_id) 
         VALUES ($1, $2, $3, 'completed', $4) RETURNING *`,
        [booking_id, amount_rwf, method, transaction_id || `TXN-${Date.now()}`]
      );

      // Update booking status
      await query(`UPDATE bookings SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE booking_id = $1`, [booking_id]);

      res.status(201).json({
        payment_id: paymentResult.rows[0].payment_id,
        status: 'completed',
        booking_id,
        amount_rwf,
        message: 'Payment successful. Your booking is confirmed.'
      });
    } else {
      res.status(400).json({ error: 'Payment failed' });
    }
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Get payment details
router.get('/api/payments/:payment_id', async (req, res) => {
  const { payment_id } = req.params;

  try {
    const result = await query(`SELECT * FROM payments WHERE payment_id = $1`, [payment_id]);

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

export default router;
