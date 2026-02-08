import nodemailer from 'nodemailer';
import { query } from './db.js';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: +process.env.EMAIL_PORT!,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendBookingConfirmation(booking: any, passenger: any) {
  try {
    const html = `
      <h2>Booking Confirmation</h2>
      <p>Dear ${passenger.name},</p>
      <p>Your booking has been confirmed!</p>
      <h3>Booking Details</h3>
      <ul>
        <li><strong>Reference:</strong> ${booking.booking_reference}</li>
        <li><strong>Seats:</strong> ${booking.num_seats}</li>
        <li><strong>Status:</strong> ${booking.status}</li>
        <li><strong>Booked on:</strong> ${new Date(booking.created_at).toLocaleString()}</li>
      </ul>
      <p>Please arrive 15 minutes before departure.</p>
      <p>Safe travels!<br>IHUTE Team</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: passenger.email || passenger.passenger_email,
      subject: `Booking Confirmation - ${booking.booking_reference}`,
      html,
    });

    console.log('Booking confirmation sent to:', passenger.email);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
}

export async function sendPaymentReceipt(payment: any, booking: any) {
  try {
    const html = `
      <h2>Payment Receipt</h2>
      <p>Your payment has been processed successfully.</p>
      <h3>Payment Details</h3>
      <ul>
        <li><strong>Amount:</strong> ${payment.amount_rwf} RWF</li>
        <li><strong>Method:</strong> ${payment.method}</li>
        <li><strong>Transaction ID:</strong> ${payment.transaction_id}</li>
        <li><strong>Booking Reference:</strong> ${booking.booking_reference}</li>
      </ul>
      <p>Thank you for using IHUTE!<br>IHUTE Team</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: booking.passenger_email,
      subject: `Payment Receipt - ${payment.payment_id}`,
      html,
    });

    console.log('Payment receipt sent');
  } catch (error) {
    console.error('Email sending failed:', error);
  }
}

export async function sendCancellationNotice(booking: any) {
  try {
    const html = `
      <h2>Booking Cancellation</h2>
      <p>Your booking has been cancelled.</p>
      <h3>Details</h3>
      <ul>
        <li><strong>Booking Reference:</strong> ${booking.booking_reference}</li>
        <li><strong>Seats Released:</strong> ${booking.num_seats}</li>
      </ul>
      <p>If you were charged, you will receive a refund within 5 business days.</p>
      <p>IHUTE Team</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: booking.passenger_email,
      subject: `Booking Cancelled - ${booking.booking_reference}`,
      html,
    });

    console.log('Cancellation notice sent');
  } catch (error) {
    console.error('Email sending failed:', error);
  }
}
