-- 1. Function untuk memindahkan user baru dari auth.users ke public.mechanics
CREATE OR REPLACE FUNCTION public.handle_new_mechanic()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.mechanics (id, name, phone, status)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'name',
            NEW.raw_user_meta_data->>'full_name',
            'Montir Baru'
        ),
        COALESCE(
            NEW.raw_user_meta_data->>'phone',
            NEW.raw_user_meta_data->>'phone_number',
            ''
        ),
        'OFFLINE'
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        name = EXCLUDED.name,
        phone = EXCLUDED.phone;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger otomatis SETELAH user baru berhasil dibuat di auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_mechanic();