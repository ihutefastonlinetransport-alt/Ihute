-- IHUTE Database Schema

-- Expresses (Public Transport Companies)
CREATE TABLE IF NOT EXISTS expresses (
  express_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  logo_url TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes (City-to-City)
CREATE TABLE IF NOT EXISTS routes (
  route_id SERIAL PRIMARY KEY,
  from_city VARCHAR(50) NOT NULL,
  to_city VARCHAR(50) NOT NULL,
  distance_km INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(from_city, to_city)
);

-- Express-Routes (pricing per route per express)
CREATE TABLE IF NOT EXISTS express_routes (
  id SERIAL PRIMARY KEY,
  express_id INT REFERENCES expresses(express_id) ON DELETE CASCADE,
  route_id INT REFERENCES routes(route_id) ON DELETE CASCADE,
  price_rwf NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(express_id, route_id)
);

-- Buses (vehicles owned by expresses)
CREATE TABLE IF NOT EXISTS buses (
  bus_id SERIAL PRIMARY KEY,
  express_id INT REFERENCES expresses(express_id) ON DELETE CASCADE,
  plate_number VARCHAR(20) NOT NULL UNIQUE,
  bus_type VARCHAR(20) NOT NULL CHECK (bus_type IN ('Coaster', 'MiniBus', 'BigBus')),
  seat_count INT NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trips (scheduled journeys)
CREATE TABLE IF NOT EXISTS trips (
  trip_id SERIAL PRIMARY KEY,
  bus_id INT REFERENCES buses(bus_id) ON DELETE CASCADE,
  route_id INT REFERENCES routes(route_id) ON DELETE CASCADE,
  departure_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers (for private vehicles)
CREATE TABLE IF NOT EXISTS drivers (
  driver_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  license_number VARCHAR(20) UNIQUE,
  status VARCHAR(20) DEFAULT 'active',
  lat NUMERIC(10, 8),
  lng NUMERIC(10, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Private Cars
CREATE TABLE IF NOT EXISTS private_cars (
  car_id SERIAL PRIMARY KEY,
  driver_id INT REFERENCES drivers(driver_id) ON DELETE CASCADE,
  plate_number VARCHAR(20) NOT NULL UNIQUE,
  car_type VARCHAR(30) NOT NULL,
  seat_count INT NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  booking_id SERIAL PRIMARY KEY,
  trip_id INT REFERENCES trips(trip_id) ON DELETE SET NULL,
  car_id INT REFERENCES private_cars(car_id) ON DELETE SET NULL,
  passenger_name VARCHAR(100) NOT NULL,
  passenger_phone VARCHAR(20) NOT NULL,
  passenger_email VARCHAR(100),
  num_seats INT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'confirmed', 'completed', 'cancelled')),
  booking_reference VARCHAR(20) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  payment_id SERIAL PRIMARY KEY,
  booking_id INT REFERENCES bookings(booking_id) ON DELETE CASCADE,
  amount_rwf NUMERIC(10, 2) NOT NULL,
  method VARCHAR(20) CHECK (method IN ('momo', 'airtel', 'card', 'cash')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seat Availability (tracks booked seats per trip/car)
CREATE TABLE IF NOT EXISTS seat_availability (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(20) CHECK (entity_type IN ('trip', 'car')),
  entity_id INT NOT NULL,
  total_seats INT NOT NULL,
  booked_seats INT DEFAULT 0,
  locked_seats INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(entity_type, entity_id)
);

-- Admins & Users
CREATE TABLE IF NOT EXISTS admins (
  admin_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'express_admin', 'viewer_admin', 'private_admin')),
  express_id INT REFERENCES expresses(express_id) ON DELETE SET NULL,
  permanent_code VARCHAR(20) UNIQUE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs (for admin actions)
CREATE TABLE IF NOT EXISTS audit_logs (
  log_id SERIAL PRIMARY KEY,
  admin_id INT REFERENCES admins(admin_id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  old_value JSONB,
  new_value JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_trips_bus_id ON trips(bus_id);
CREATE INDEX idx_trips_route_id ON trips(route_id);
CREATE INDEX idx_trips_departure_date ON trips(departure_date);
CREATE INDEX idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX idx_bookings_car_id ON bookings(car_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_seat_availability_entity ON seat_availability(entity_type, entity_id);
