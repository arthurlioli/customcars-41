-- Função para tornar todos os usuários existentes em administradores
CREATE OR REPLACE FUNCTION public.make_all_users_admin()
RETURNS TABLE(user_id uuid, email text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Inserir todos os usuários como administradores
    INSERT INTO public.admin_profiles (user_id, email)
    SELECT 
        au.id,
        au.email
    FROM auth.users au
    LEFT JOIN public.admin_profiles ap ON au.id = ap.user_id
    WHERE ap.user_id IS NULL  -- Apenas usuários que ainda não são admin
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Retornar todos os administradores
    RETURN QUERY
    SELECT 
        ap.user_id,
        ap.email
    FROM public.admin_profiles ap;
END;
$$;