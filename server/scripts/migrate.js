#!/bin/bash

echo "Running database migrations..."

# Connect to PostgreSQL and run migrations
PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f migrations/001_init_schema.sql

echo "Database initialized!"

# Optional: Seed sample data
echo "Seeding sample data..."

PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME << EOF

-- Insert sample expresses
INSERT INTO expresses (name, status) VALUES ('RITCO', 'active'), ('Stella', 'active'), ('Muhima', 'active');

-- Insert sample routes
INSERT INTO routes (from_city, to_city, distance_km) VALUES
  ('Kigali', 'Musanze', 78),
  ('Kigali', 'Gitarama', 30),
  ('Kigali', 'Butare', 140),
  ('Kigali', 'Ruhengeri', 95);

-- Insert sample pricing
INSERT INTO express_routes (express_id, route_id, price_rwf) VALUES
  (1, 1, 5000), (1, 2, 2000), (1, 3, 8000),
  (2, 1, 5500), (2, 2, 2500), (2, 3, 8500);

-- Insert sample buses
INSERT INTO buses (express_id, plate_number, bus_type, seat_count, status) VALUES
  (1, 'RG-2024', 'BigBus', 50, 'active'),
  (2, 'RG-2025', 'Coaster', 25, 'active'),
  (3, 'RG-2026', 'MiniBus', 18, 'active');

EOF

echo "✅ Database seeding complete!"
