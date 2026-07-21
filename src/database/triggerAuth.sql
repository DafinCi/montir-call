-- 1. Buat Function untuk meng-copy user baru dari auth.users ke public.mechanics
CREATE OR REPLACE FUNCTION public.handle_new_mechanic()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.mechanics (id, name, phone, status)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Montir Baru'),
        NEW.raw_user_meta_data->>'phone',
        'OFFLINE'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Pasang Trigger yang berjalan otomatis SETELAH user baru dibuat di auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_mechanic();