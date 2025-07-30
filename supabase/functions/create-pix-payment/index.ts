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
    console.log("Iniciando processamento do pagamento PIX");

    const requestBody = await req.json();
    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    const { quantity, customer } = requestBody;

    if (!quantity || quantity < 1) {
      console.error("Quantidade inválida:", quantity);
      throw new Error("Quantidade inválida");
    }

    // Verificar token do Mercado Pago primeiro
    const mercadoPagoToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    if (!mercadoPagoToken) {
      console.error("Token do Mercado Pago não configurado");
      throw new Error("Token do Mercado Pago não configurado");
    }

    console.log("Token MP configurado, length:", mercadoPagoToken.length);

    // Inicializar Supabase
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Tentar obter usuário autenticado
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
        console.log("Usuário autenticado:", user?.id);
      }
    } catch (error) {
      console.log("Usuário não autenticado, processando como convidado");
    }

    // Sistema de descontos progressivos
    const getTicketPrice = (quantity: number) => {
      if (quantity >= 100) return 3.99;
      if (quantity >= 40) return 4.29;
      if (quantity >= 10) return 4.49;
      return 4.99;
    };
    
    const unitPrice = getTicketPrice(quantity);
    const amount = Math.round((quantity * unitPrice) * 100) / 100;
    
    console.log("Cálculo do preço:");
    console.log("- Quantity:", quantity);
    console.log("- Unit price:", unitPrice);
    console.log("- Total amount:", amount);

    // Criar order no banco
    console.log("Criando pedido no banco...");
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user?.id || null,
        quantity: quantity,
        amount: amount,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Erro ao criar pedido:", orderError);
      throw new Error(`Erro ao criar pedido: ${orderError.message}`);
    }

    console.log("Pedido criado:", order.id);

    // Gerar números dos bilhetes
    console.log("Gerando números dos bilhetes...");
    const { data: ticketNumbers, error: ticketError } = await supabaseAdmin
      .rpc('get_next_ticket_numbers', { quantity });

    if (ticketError) {
      console.error("Erro ao gerar números dos bilhetes:", ticketError);
      throw new Error(`Erro ao gerar números dos bilhetes: ${ticketError.message}`);
    }

    console.log("Números gerados:", ticketNumbers);

    // Criar bilhetes individuais
    console.log("Criando bilhetes no banco...");
    const ticketsToInsert = ticketNumbers.map((ticketNumber: number) => ({
      order_id: order.id,
      user_id: user?.id || null,
      ticket_number: ticketNumber,
    }));

    const { error: insertTicketsError } = await supabaseAdmin
      .from("tickets")
      .insert(ticketsToInsert);

    if (insertTicketsError) {
      console.error("Erro ao criar bilhetes:", insertTicketsError);
      throw new Error(`Erro ao criar bilhetes: ${insertTicketsError.message}`);
    }

    console.log("Bilhetes criados com sucesso");

    // Preparar dados do pagamento para Mercado Pago
    const paymentData = {
      transaction_amount: Number(amount.toFixed(2)),
      description: `${quantity} bilhetes - Sorteio Kawasaki Ninja`,
      payment_method_id: "pix",
      payer: {
        email: customer?.email || "guest@example.com",
        first_name: customer?.name?.split(' ')[0] || "Cliente",
        last_name: customer?.name?.split(' ').slice(1).join(' ') || "Convidado",
        identification: {
          type: "CPF",
          number: customer?.identification?.number || "11111111111"
        }
      },
      external_reference: order.id,
    };

    console.log("Dados do pagamento MP:", JSON.stringify(paymentData, null, 2));

    // Gerar chave de idempotência
    const idempotencyKey = `pix-${order.id}-${Date.now()}`;
    console.log("Chave de idempotência:", idempotencyKey);

    // Fazer chamada para Mercado Pago
    console.log("Fazendo chamada para Mercado Pago...");
    const mpResponse = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mercadoPagoToken}`,
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(paymentData),
    });

    console.log("Status da resposta MP:", mpResponse.status);

    if (!mpResponse.ok) {
      const errorText = await mpResponse.text();
      console.error("Erro da API do Mercado Pago:", errorText);
      throw new Error(`Erro do Mercado Pago (${mpResponse.status}): ${errorText}`);
    }

    const mpResult = await mpResponse.json();
    console.log("Resposta do Mercado Pago:", JSON.stringify(mpResult, null, 2));

    // Atualizar order com payment ID
    if (mpResult.id) {
      console.log("Atualizando pedido com payment ID:", mpResult.id);
      await supabaseAdmin
        .from("orders")
        .update({ mp_preference_id: mpResult.id.toString() })
        .eq("id", order.id);
    }

    // Retornar dados do PIX
    const result = {
      qr_code: mpResult.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: mpResult.point_of_interaction?.transaction_data?.qr_code_base64,
      payment_id: mpResult.id,
      order_id: order.id,
      ticket_numbers: ticketNumbers,
    };

    console.log("Sucesso! Retornando resultado:", JSON.stringify(result, null, 2));

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("ERRO GERAL:", error);
    console.error("Stack trace:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});