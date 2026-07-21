CREATE OR REPLACE FUNCTION get_nearest_mechanics(
    customer_lat FLOAT,
    customer_lng FLOAT,
    radius_meters FLOAT DEFAULT 5000, -- Default radius 5 km
    max_results INT DEFAULT 10        -- Maksimal mengambil 10 montir
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    phone TEXT,
    specialization TEXT,
    rating FLOAT,
    status TEXT,
    lat FLOAT,
    lng FLOAT,
    distance_meters FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    customer_point GEOGRAPHY;
BEGIN
    -- 1. Buat titik geografi dari input customer (Urutan PostGIS: Longitude dulu, baru Latitude!)
    customer_point := ST_SetSRID(ST_MakePoint(customer_lng, customer_lat), 4326)::geography;

    -- 2. Query montir terdekat
    RETURN QUERY
    SELECT 
        m.id,
        m.name,
        m.phone,
        m.specialization,
        m.rating,
        m.status,
        ST_Y(m.location::geometry) AS lat, -- Mengambil Latitude
        ST_X(m.location::geometry) AS lng, -- Mengambil Longitude
        ST_Distance(m.location, customer_point) AS distance_meters
    FROM public.mechanics m
    WHERE m.status = 'AVAILABLE' -- Hanya cari montir yang sedang ONLINE/AVAILABLE
      AND m.location IS NOT NULL
      AND ST_DWithin(m.location, customer_point, radius_meters) -- Pakai Spatial Index GIST
    ORDER BY distance_meters ASC -- Urutkan dari yang terdekat
    LIMIT max_results;
END;
$$;