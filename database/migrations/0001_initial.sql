CREATE TYPE driver_status AS ENUM ('online', 'delivering', 'offline');
CREATE TYPE location_source AS ENUM ('gps', 'simulator');
CREATE TYPE shipment_status AS ENUM ('ready', 'assigned', 'in_transit', 'delayed', 'delivered');
CREATE TYPE user_role AS ENUM ('admin', 'operations_manager', 'dispatcher', 'viewer');

CREATE TABLE branches (
  id uuid PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE drivers (
  id text PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL UNIQUE,
  vehicle text NOT NULL,
  plate text NOT NULL UNIQUE,
  status driver_status NOT NULL DEFAULT 'offline',
  latitude double precision NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude double precision NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  accuracy double precision NOT NULL DEFAULT 0 CHECK (accuracy >= 0),
  location_source location_source NOT NULL DEFAULT 'simulator',
  location_sequence bigint NOT NULL DEFAULT -1,
  location_updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE shipments (
  id text PRIMARY KEY,
  tracking_code text NOT NULL UNIQUE,
  customer text NOT NULL,
  address text NOT NULL,
  branch_id uuid REFERENCES branches(id) ON DELETE RESTRICT,
  branch_name text NOT NULL,
  driver_id text REFERENCES drivers(id) ON DELETE SET NULL,
  status shipment_status NOT NULL DEFAULT 'ready',
  eta text NOT NULL,
  price bigint NOT NULL CHECK (price >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE location_events (
  id bigserial PRIMARY KEY,
  driver_id text NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  latitude double precision NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude double precision NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  accuracy double precision NOT NULL CHECK (accuracy >= 0),
  captured_at timestamptz NOT NULL,
  sequence_number bigint NOT NULL,
  source location_source NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (driver_id, sequence_number)
);

CREATE TABLE users (
  id uuid PRIMARY KEY,
  email text NOT NULL UNIQUE,
  display_name text NOT NULL,
  password_hash text NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX shipments_status_idx ON shipments(status);
CREATE INDEX shipments_driver_id_idx ON shipments(driver_id);
CREATE INDEX shipments_created_at_idx ON shipments(created_at DESC);
CREATE INDEX drivers_status_idx ON drivers(status);
CREATE INDEX location_events_driver_captured_idx ON location_events(driver_id, captured_at DESC);
