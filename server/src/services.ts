import { query } from './db.js';

// Generate unique booking reference
export function generateBookingReference(): string {
  return 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Initialize seat availability for a trip or car
export async function initializeSeatAvailability(entityType: 'trip' | 'car', entityId: number, totalSeats: number) {
  try {
    await query(
      `INSERT INTO seat_availability (entity_type, entity_id, total_seats, booked_seats, locked_seats)
       VALUES ($1, $2, $3, 0, 0)
       ON CONFLICT (entity_type, entity_id) DO NOTHING`,
      [entityType, entityId, totalSeats]
    );
  } catch (error) {
    console.error('Error initializing seat availability:', error);
  }
}

// Lock seats during payment (temporarily reserve)
export async function lockSeats(entityType: 'trip' | 'car', entityId: number, numSeats: number): Promise<boolean> {
  try {
    const result = await query(
      `UPDATE seat_availability 
       SET locked_seats = locked_seats + $1
       WHERE entity_type = $2 AND entity_id = $3 
       AND (booked_seats + locked_seats + $1 <= total_seats)
       RETURNING id`,
      [numSeats, entityType, entityId]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error locking seats:', error);
    return false;
  }
}

// Unlock seats (if payment fails)
export async function unlockSeats(entityType: 'trip' | 'car', entityId: number, numSeats: number) {
  try {
    await query(
      `UPDATE seat_availability 
       SET locked_seats = GREATEST(0, locked_seats - $1)
       WHERE entity_type = $2 AND entity_id = $3`,
      [numSeats, entityType, entityId]
    );
  } catch (error) {
    console.error('Error unlocking seats:', error);
  }
}

// Confirm booking (move locked seats to booked)
export async function confirmBooking(entityType: 'trip' | 'car', entityId: number, numSeats: number) {
  try {
    await query(
      `UPDATE seat_availability 
       SET booked_seats = booked_seats + $1, locked_seats = GREATEST(0, locked_seats - $1)
       WHERE entity_type = $2 AND entity_id = $3`,
      [numSeats, entityType, entityId]
    );
  } catch (error) {
    console.error('Error confirming booking:', error);
  }
}

// Get available seats
export async function getAvailableSeats(entityType: 'trip' | 'car', entityId: number): Promise<number | null> {
  try {
    const result = await query(
      `SELECT total_seats - booked_seats - locked_seats as available
       FROM seat_availability 
       WHERE entity_type = $1 AND entity_id = $2`,
      [entityType, entityId]
    );
    return result.rows[0]?.available || 0;
  } catch (error) {
    console.error('Error getting available seats:', error);
    return null;
  }
}

// Check if booking cutoff has passed (30 minutes before departure)
export async function isWithinBookingCutoff(tripId: number): Promise<boolean> {
  try {
    const result = await query(
      `SELECT departure_date, departure_time FROM trips WHERE trip_id = $1`,
      [tripId]
    );
    if (!result.rows[0]) return false;

    const { departure_date, departure_time } = result.rows[0];
    const departureDateTime = new Date(`${departure_date}T${departure_time}`);
    const cutoffTime = new Date(departureDateTime.getTime() - 30 * 60000); // 30 minutes before
    return new Date() < cutoffTime;
  } catch (error) {
    console.error('Error checking booking cutoff:', error);
    return false;
  }
}

// Log admin action
export async function logAuditAction(adminId: number, action: string, entityType: string, entityId: number, oldValue?: any, newValue?: any, ipAddress?: string) {
  try {
    await query(
      `INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, old_value, new_value, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [adminId, action, entityType, entityId, oldValue ? JSON.stringify(oldValue) : null, newValue ? JSON.stringify(newValue) : null, ipAddress || '']
    );
  } catch (error) {
    console.error('Error logging audit action:', error);
  }
}
