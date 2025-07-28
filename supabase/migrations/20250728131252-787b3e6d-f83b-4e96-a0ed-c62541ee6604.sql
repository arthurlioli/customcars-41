-- Corrigir função para tornar todos os usuários existentes em administradores
DROP FUNCTION IF EXISTS public.make_all_users_admin();

CREATE OR REPLACE FUNCTION public.make_all_users_admin()
RETURNS TABLE(user_id uuid, email text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- Inserir todos os usuários como administradores usando DECLARE explícito
    FOR user_record IN 
        SELECT au.id, au.email
        FROM auth.users au
        LEFT JOIN public.admin_profiles ap ON au.id = ap.user_id
        WHERE ap.user_id IS NULL
    LOOP
        INSERT INTO public.admin_profiles (user_id, email)
        VALUES (user_record.id, user_record.email)
        ON CONFLICT (user_id) DO NOTHING;
    END LOOP;
    
    -- Retornar todos os administradores
    RETURN QUERY
    SELECT ap.user_id, ap.email
    FROM public.admin_profiles ap;
END;
$$;

-- Executar a função para tornar todos os usuários em administradores
SELECT * FROM public.make_all_users_admin();