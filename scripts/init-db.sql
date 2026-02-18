-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  roll_number VARCHAR(50) NOT NULL,
  slot_time VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on slot_time for faster queries
CREATE INDEX IF NOT EXISTS idx_slot_time ON bookings(slot_time);

-- Create index on roll_number for uniqueness checks
CREATE INDEX IF NOT EXISTS idx_roll_number ON bookings(roll_number);
