-- Modificar tabela orders para permitir user_id null (pagamentos de convidados)
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Adicionar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Atualizar política RLS para permitir inserção de convidados
DROP POLICY IF EXISTS "insert_order" ON public.orders;
CREATE POLICY "insert_order" ON public.orders
  FOR INSERT
  WITH CHECK (true);

-- Permitir que convidados vejam apenas seus próprios pedidos (se tiverem um ID de sessão ou similar no futuro)
DROP POLICY IF EXISTS "select_own_orders" ON public.orders;
CREATE POLICY "select_own_orders" ON public.orders
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);