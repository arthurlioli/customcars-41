-- Criar tabela orders para armazenar pedidos
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  mp_preference_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela tickets para armazenar bilhetes individuais  
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ticket_number INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Função para gerar números sequenciais de bilhetes
CREATE OR REPLACE FUNCTION public.get_next_ticket_numbers(quantity INTEGER)
RETURNS INTEGER[] AS $$
DECLARE
  start_number INTEGER;
  result INTEGER[];
  i INTEGER;
BEGIN
  -- Encontrar o próximo número disponível
  SELECT COALESCE(MAX(ticket_number), 0) + 1 INTO start_number FROM public.tickets;
  
  -- Criar array com os números sequenciais
  result := ARRAY[]::INTEGER[];
  FOR i IN 0..(quantity-1) LOOP
    result := array_append(result, start_number + i);
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Políticas para orders
CREATE POLICY "insert_order" ON public.orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "update_order" ON public.orders
  FOR UPDATE
  USING (true);

CREATE POLICY "select_own_orders" ON public.orders
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Políticas para tickets  
CREATE POLICY "insert_ticket" ON public.tickets
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "select_own_tickets" ON public.tickets
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Índices para performance
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_tickets_order_id ON public.tickets(order_id);
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_number ON public.tickets(ticket_number);