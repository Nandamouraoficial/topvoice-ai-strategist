import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mentee_name, mentee_email, access_code, app_url } = await req.json();
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured, skipping email send");
      return new Response(JSON.stringify({ success: false, message: "Email não configurado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const firstName = mentee_name ? mentee_name.split(" ")[0] : "Profissional";
    const whatsappNumber = Deno.env.get("WHATSAPP_NUMBER") || "5511999999999";

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0e1a;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#0a0e1a;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f1729,#1a2744);padding:40px 30px;text-align:center;border-radius:0 0 20px 20px;">
      <div style="display:inline-flex;align-items:center;gap:10px;">
        <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#d4a017,#e8b84b);display:flex;align-items:center;justify-content:center;font-weight:bold;color:#0a0e1a;font-size:16px;">TV</div>
        <span style="font-size:22px;font-weight:bold;color:#e8e6e1;">TopVoice <span style="color:#d4a017;">AI</span></span>
      </div>
    </div>
    
    <!-- Content -->
    <div style="padding:30px;">
      <h1 style="color:#e8e6e1;font-size:24px;margin-bottom:10px;">Olá, ${firstName}! 🎉</h1>
      <p style="color:#8b8d93;font-size:15px;line-height:1.6;">
        Seu acesso ao <strong style="color:#d4a017;">TopVoice AI</strong> está pronto! Você está a poucos passos de receber a análise mais completa do seu perfil LinkedIn.
      </p>
      
      <!-- Code Box -->
      <div style="background:#141a2e;border:2px solid #1f2a45;border-radius:16px;padding:24px;text-align:center;margin:24px 0;">
        <p style="color:#8b8d93;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">Seu código de acesso</p>
        <div style="font-size:24px;font-family:monospace;font-weight:bold;color:#d4a017;letter-spacing:3px;">${access_code}</div>
      </div>
      
      <!-- Steps -->
      <div style="margin:24px 0;">
        <p style="color:#e8e6e1;font-weight:bold;margin-bottom:16px;">Como usar:</p>
        ${["Acesse a plataforma pelo link abaixo", "Insira seu código de acesso", "Preencha o questionário estratégico (5 min)", "Receba sua análise completa com IA"].map((step, i) => `
          <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
            <div style="width:28px;height:28px;border-radius:50%;background:#1f2a45;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;color:#d4a017;flex-shrink:0;">${i+1}</div>
            <p style="color:#e8e6e1;font-size:14px;margin:4px 0;">${step}</p>
          </div>
        `).join("")}
      </div>
      
      <!-- CTA -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${app_url || 'https://topvoice.ai'}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#d4a017,#e8b84b);color:#0a0e1a;font-weight:bold;font-size:16px;text-decoration:none;border-radius:50px;">
          Acessar TopVoice AI →
        </a>
      </div>
      
      <!-- What you get -->
      <div style="background:#141a2e;border-radius:16px;padding:20px;margin:24px 0;">
        <p style="color:#e8e6e1;font-weight:bold;margin-bottom:12px;">O que você vai receber:</p>
        ${["Análise completa das 17 dimensões do seu perfil", "Score geral e por seção (0-100)", "Diagnóstico executivo personalizado com IA", "Headline reescrita pronta para usar", "Seção Sobre reescrita com CTA", "Plano de ação de 90 dias", "Calendário editorial de 30 dias", "Avaliação do seu potencial Top Voice"].map(item => `
          <p style="color:#8b8d93;font-size:13px;margin:6px 0;">✅ ${item}</p>
        `).join("")}
      </div>
      
      <!-- Signature -->
      <div style="border-top:1px solid #1f2a45;padding-top:20px;margin-top:30px;">
        <p style="color:#e8e6e1;font-weight:bold;font-size:14px;">Fernanda Moura</p>
        <p style="color:#8b8d93;font-size:13px;">Estrategista de Carreira Executiva</p>
        <a href="https://wa.me/${whatsappNumber}" style="color:#d4a017;font-size:13px;text-decoration:none;">💬 Fale comigo no WhatsApp</a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background:#070a14;padding:20px 30px;text-align:center;border-radius:20px 20px 0 0;">
      <p style="color:#4a4c52;font-size:11px;">TopVoice AI — Análise Estratégica de LinkedIn com Inteligência Artificial</p>
      <p style="color:#4a4c52;font-size:11px;">Este email foi enviado porque um acesso foi criado para ${mentee_email}</p>
    </div>
  </div>
</body>
</html>`;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "TopVoice AI <noreply@topvoice.ai>",
        to: mentee_email,
        subject: `🏆 Seu acesso ao TopVoice AI está pronto, ${firstName}`,
        html,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend error:", emailResponse.status, errorText);
      return new Response(JSON.stringify({ success: false, error: "Falha ao enviar email" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-welcome-email error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro ao enviar email" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
