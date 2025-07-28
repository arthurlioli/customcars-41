-- Inserir usuário admin no auth.users (simulando cadastro)
-- Como não podemos inserir diretamente na tabela auth.users, vamos criar um perfil admin para o usuário quando ele se registrar

-- Primeiro, vamos inserir o perfil admin diretamente na nossa tabela admin_profiles
-- Assumindo que o usuário customadm@gmail.com já foi criado via interface do Supabase

-- Para criar o perfil admin, precisamos do user_id. 
-- Vamos criar uma função que permite inserir um admin com email específico

-- Função para criar perfil admin
CREATE OR REPLACE FUNCTION create_admin_profile(admin_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Buscar o user_id do usuário com o email fornecido
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = admin_email;
    
    -- Se o usuário não existir, retornar null
    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuário com email % não encontrado', admin_email;
    END IF;
    
    -- Inserir ou atualizar o perfil admin
    INSERT INTO public.admin_profiles (user_id, email)
    VALUES (admin_user_id, admin_email)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        email = EXCLUDED.email,
        updated_at = now();
    
    RETURN admin_user_id;
END;
$$;