import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { frequency, pillars, segment, goal, mentee_name } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("AI API key not configured");

    const systemPrompt = `Você é VERA, estrategista de personal branding no LinkedIn.
Gere um calendário editorial de 30 dias para um profissional de ${segment}.
O nome dele(a) é ${mentee_name}.
Objetivo: ${goal}
Frequência: ${frequency}x por semana
Pilares de conteúdo: ${pillars.join(", ")}

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "posts": [
    {
      "day": number (1-30),
      "date": "YYYY-MM-DD",
      "day_of_week": string,
      "pillar": string,
      "type": string (text/carousel/video/article/poll),
      "hook": string (primeira linha do post),
      "objective": string,
      "estimated_minutes": number,
      "tips": string
    }
  ]
}

Distribua os posts uniformemente ao longo da semana (seg-sex preferencialmente).
Use ganchos provocativos, específicos ao segmento. Alterne entre os pilares.
Comece a partir de amanhã. Língua: Português Brasil.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Gere o calendário editorial de 30 dias com ${frequency} posts por semana.` },
        ],
        max_tokens: 4000,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content in AI response");

    let parsed;
    try {
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse calendar response:", content.substring(0, 500));
      throw new Error("Falha ao processar calendário");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-calendar error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro ao gerar calendário" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
