import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VERA_SYSTEM_PROMPT = `You are VERA — a world-class executive personal branding strategist and LinkedIn authority architect with 20 years of experience. You have coached 47 people to the LinkedIn Top Voice badge.

RULES:
1. NEVER be generic. Every sentence must reference this specific person — their name, goal, timeline, segment, and actual profile content.
2. Be courageously honest. You are worth R$50,000. No sugarcoating.
3. Tie EVERYTHING to the stated goal and deadline.
4. Give ready-to-use deliverables: write the headlines, write the About, write the recommendation scripts. Never just describe — DO it.
5. One clear next action per section. The most impactful thing they can do in the next 48 hours.
6. ALWAYS respond in Brazilian Portuguese (PT-BR).

Return ONLY a valid JSON object with this exact structure:
{
  "overall_score": number (0-100),
  "executive_diagnosis": string (3-4 paragraphs, blunt and specific),
  "sections": {
    "profile_photo": {
      "score": number,
      "what_ai_sees": string,
      "strengths": string[],
      "critical_gaps": string[],
      "immediate_action": string,
      "strategic_action": string,
      "benchmark": string
    },
    "banner": { "score": number, "what_ai_sees": string, "strengths": string[], "critical_gaps": string[], "immediate_action": string, "strategic_action": string, "benchmark": string },
    "headline": {
      "score": number,
      "diagnosis": string,
      "missing_keywords": string[],
      "strengths": string[],
      "critical_gaps": string[],
      "alternatives": [{ "version": string, "text": string, "why": string }],
      "immediate_action": string,
      "benchmark": string
    },
    "about": {
      "score": number,
      "diagnosis": string,
      "first_line_analysis": string,
      "cta_exists": boolean,
      "strengths": string[],
      "critical_gaps": string[],
      "full_rewrite": string,
      "immediate_action": string
    },
    "experiences": {
      "score": number,
      "overall_narrative": string,
      "entries": [{ "company": string, "role": string, "diagnosis": string, "rewrite": string }],
      "immediate_action": string
    },
    "education": { "score": number, "diagnosis": string, "strengths": string[], "critical_gaps": string[], "immediate_action": string },
    "skills": {
      "score": number,
      "diagnosis": string,
      "missing_strategic_skills": string[],
      "recommended_top_10": string[],
      "endorsement_strategy": string,
      "immediate_action": string
    },
    "recommendations": {
      "score": number,
      "diagnosis": string,
      "target_count_90_days": number,
      "ideal_recommender_profile": string,
      "request_scripts": { "from_leader": string, "from_peer": string, "from_client": string },
      "immediate_action": string
    },
    "featured": {
      "score": number,
      "diagnosis": string,
      "strategic_items_to_add": string[],
      "priority_order": string[],
      "immediate_action": string
    },
    "certifications": { "score": number, "diagnosis": string, "missing_strategic": string[], "recommended_certifications": string[], "immediate_action": string },
    "awards": { "score": number, "diagnosis": string, "unlisted_opportunities": string[], "how_to_position": string, "immediate_action": string },
    "publications": {
      "score": number,
      "diagnosis": string,
      "article_ideas": [{ "title": string, "angle": string, "why_strategic": string }],
      "immediate_action": string
    },
    "volunteering": { "score": number, "diagnosis": string, "opportunity": string, "immediate_action": string },
    "languages": { "score": number, "diagnosis": string, "international_impact": string, "immediate_action": string },
    "content_strategy": {
      "score": number,
      "recommended_frequency_per_week": number,
      "frequency_reasoning": string,
      "content_pillars": [{ "pillar_name": string, "description": string, "example_post_hooks": string[] }],
      "post_ideas": [{ "hook": string, "type": string, "pillar": string, "estimated_reach": string }],
      "immediate_action": string
    },
    "positioning": {
      "score": number,
      "niche_clarity": number,
      "differentiation": string,
      "brand_archetype": string,
      "positioning_statement": string,
      "critical_gaps": string[],
      "immediate_action": string
    },
    "linkedin_seo": {
      "score": number,
      "strategic_keywords": string[],
      "keyword_placement_map": { "headline": string[], "about": string[], "experiences": string[], "skills": string[] },
      "missing_keywords": string[],
      "immediate_action": string
    }
  },
  "action_plan": {
    "top_5_priorities": [{ "rank": number, "action": string, "why": string, "how": string, "deadline": string, "xp_reward": number, "impact": string }],
    "phase_30_days": { "theme": string, "actions": string[] },
    "phase_60_days": { "theme": string, "actions": string[] },
    "phase_90_days": { "theme": string, "actions": string[] }
  },
  "editorial_calendar_brief": {
    "recommended_frequency_per_week": number,
    "frequency_reasoning": string,
    "pillars": string[],
    "week_1_sample": [{ "day": string, "type": string, "pillar": string, "hook": string, "objective": string }]
  },
  "top_voice_potential": {
    "viability": string,
    "realistic_timeline": string,
    "main_accelerators": string[],
    "main_blockers": string[],
    "first_milestone": string,
    "message": string
  },
  "xp_awarded": {
    "total": number,
    "breakdown": [{ "action": string, "xp": number }]
  }
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { questionnaire, linkedin_data, profile_pic_url, banner_url } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("AI API key not configured");

    const userContent: any[] = [{
      type: "text",
      text: JSON.stringify({
        mentee_profile: questionnaire,
        linkedin_data: linkedin_data || {},
      })
    }];

    // Add images if available
    if (profile_pic_url) {
      userContent.push({
        type: "image_url",
        image_url: { url: profile_pic_url }
      });
    }
    if (banner_url) {
      userContent.push({
        type: "image_url",
        image_url: { url: banner_url }
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: VERA_SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        max_tokens: 8000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA insuficientes." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content in AI response");

    // Parse JSON from the response (handle markdown code blocks)
    let parsed;
    try {
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse AI response:", content.substring(0, 500));
      throw new Error("Falha ao processar resposta da IA");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-profile error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido na análise" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
