import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quantity, customer } = await req.json();

    if (!quantity || quantity < 1) {
      throw new Error("Quantidade inválida");
    }

    // Inicializar Supabase com service role para RLS bypass
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Tentar obter usuário autenticado (opcional para pagamentos de convidado)
    let user = null;
    try {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? ""
      );

      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        user = data.user;
      }
    } catch (error) {
      console.log("Usuario não autenticado, processando como convidado");
    }

    // Sistema de descontos progressivos
    const getTicketPrice = (quantity: number) => {
      if (quantity >= 100) return 3.99;
      if (quantity >= 40) return 4.29;
      if (quantity >= 10) return 4.49;
      return 4.99;
    };
    
    const amount = quantity * getTicketPrice(quantity);
    const mercadoPagoToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");

    if (!mercadoPagoToken) {
      throw new Error("Token do Mercado Pago não configurado");
    }

    console.log("Token length:", mercadoPagoToken.length);
    console.log("Token prefix:", mercadoPagoToken.substring(0, 8));

    // Criar order no banco (com ou sem usuário)
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user?.id || null, // null para convidados
        quantity,
        amount,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Erro ao criar pedido: ${orderError.message}`);
    }

    // Gerar números dos bilhetes
    const { data: ticketNumbers, error: ticketError } = await supabaseAdmin
      .rpc('get_next_ticket_numbers', { quantity });

    if (ticketError) {
      throw new Error(`Erro ao gerar números dos bilhetes: ${ticketError.message}`);
    }

    // Criar bilhetes individuais
    const ticketsToInsert = ticketNumbers.map((ticketNumber: number) => ({
      order_id: order.id,
      user_id: user?.id || null,
      ticket_number: ticketNumber,
    }));

    const { error: insertTicketsError } = await supabaseAdmin
      .from("tickets")
      .insert(ticketsToInsert);

    if (insertTicketsError) {
      throw new Error(`Erro ao criar bilhetes: ${insertTicketsError.message}`);
    }

    // Criar pagamento PIX no Mercado Pago
    const payment = {
      transaction_amount: amount,
      description: `${quantity} bilhetes - Sorteio Kawasaki Ninja`,
      payment_method_id: "pix",
      payer: {
        email: customer?.email || "guest@example.com",
        first_name: customer?.name?.split(' ')[0] || "Cliente",
        last_name: customer?.name?.split(' ').slice(1).join(' ') || "Convidado",
        identification: customer?.identification || {
          type: "CPF",
          number: "11111111111"
        }
      },
      external_reference: order.id,
    };

    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mercadoPagoToken}`,
      },
      body: JSON.stringify(payment),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Erro do Mercado Pago:", error);
      throw new Error(`Erro do Mercado Pago: ${error}`);
    }

    const mpResponse = await response.json();
    console.log("Resposta do Mercado Pago:", JSON.stringify(mpResponse, null, 2));

    // Atualizar order com MP payment ID
    await supabaseAdmin
      .from("orders")
      .update({ mp_preference_id: mpResponse.id?.toString() })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({
        qr_code: mpResponse.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: mpResponse.point_of_interaction?.transaction_data?.qr_code_base64,
        payment_id: mpResponse.id,
        order_id: order.id,
        ticket_numbers: ticketNumbers,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});