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
    const { quantity } = await req.json();
    
    if (!quantity || quantity < 1) {
      throw new Error("Quantidade inválida");
    }

    // Inicializar Supabase com service role para RLS bypass
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Inicializar Supabase client para autenticação
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Verificar usuário autenticado
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const amount = quantity * 4.99;
    const mercadoPagoToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");

    if (!mercadoPagoToken) {
      throw new Error("Token do Mercado Pago não configurado");
    }

    // Criar order no banco
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user.id,
        quantity,
        amount,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Erro ao criar pedido: ${orderError.message}`);
    }

    // Criar preference no Mercado Pago
    const preference = {
      items: [
        {
          title: `${quantity} bilhetes - Sorteio Audi A3`,
          quantity: 1,
          unit_price: amount,
          currency_id: "BRL",
        },
      ],
      payment_methods: {
        excluded_payment_types: [
          { id: "credit_card" },
          { id: "debit_card" },
          { id: "ticket" },
        ],
        excluded_payment_methods: [],
      },
      back_urls: {
        success: `${req.headers.get("origin")}/payment-success?order_id=${order.id}`,
        failure: `${req.headers.get("origin")}/payment-failed`,
        pending: `${req.headers.get("origin")}/payment-pending`,
      },
      auto_return: "approved",
      external_reference: order.id,
      notification_url: `${req.headers.get("origin")}/webhook/mercadopago`,
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mercadoPagoToken}`,
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro do Mercado Pago: ${error}`);
    }

    const mpResponse = await response.json();

    // Atualizar order com MP preference ID
    await supabaseAdmin
      .from("orders")
      .update({ mp_preference_id: mpResponse.id })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({
        checkout_url: mpResponse.init_point,
        order_id: order.id,
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