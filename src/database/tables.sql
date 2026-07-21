-- 1. Aktifkan Ekstensi PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Buat Fungsi & Trigger Auto-Update timestamp 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. Buat Tabel Customers (Dummy / Preparation untuk versi Full)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Buat Tabel Mechanics (Integrasi langsung dengan Supabase Auth)
CREATE TABLE mechanics (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    specialization TEXT,
    rating FLOAT DEFAULT 5.0,
    status TEXT DEFAULT 'OFFLINE' CHECK (status IN ('AVAILABLE', 'BUSY', 'OFFLINE')),
    location GEOGRAPHY(POINT, 4326), -- PostGIS Location (Long, Lat)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger auto-update updated_at untuk mechanics
CREATE TRIGGER update_mechanics_updated_at
    BEFORE UPDATE ON mechanics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Buat Tabel Service Requests
CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL, -- Fallback jika customer cepat tanpa registrasi
    customer_phone TEXT,
    vehicle_type TEXT NOT NULL,
    vehicle_model TEXT,
    problem_description TEXT NOT NULL,
    customer_location GEOGRAPHY(POINT, 4326) NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'COMPLETED', 'CANCELLED')),
    assigned_mechanic_id UUID REFERENCES mechanics(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger auto-update updated_at untuk service_requests
CREATE TRIGGER update_service_requests_updated_at
    BEFORE UPDATE ON service_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Buat Tabel Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mechanic_id UUID NOT NULL REFERENCES mechanics(id) ON DELETE CASCADE,
    request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'REQUEST_CREATED', -- Penanda tipe untuk Frontend UI
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Buat Tabel Tracking Locations (Breadcrumb/Log History)
CREATE TABLE tracking_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
    mechanic_id UUID NOT NULL REFERENCES mechanics(id) ON DELETE CASCADE,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Indeks Performa (Spatial & Dynamic Querying)
CREATE INDEX mechanics_location_idx ON mechanics USING GIST (location);
CREATE INDEX service_requests_location_idx ON service_requests USING GIST (customer_location);
CREATE INDEX service_requests_status_idx ON service_requests (status);
CREATE INDEX notifications_mechanic_unread_idx ON notifications (mechanic_id, is_read);