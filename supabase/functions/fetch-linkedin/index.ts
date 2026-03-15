import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { linkedin_url, verification_code } = await req.json();
    const PROXYCURL_API_KEY = Deno.env.get("PROXYCURL_API_KEY");

    if (!PROXYCURL_API_KEY) {
      // Return mock data when no API key is configured
      console.log("PROXYCURL_API_KEY not set, returning mock data");
      return new Response(JSON.stringify({
        mock: true,
        verified: true,
        profile: {
          full_name: "Usuário TopVoice",
          headline: "Profissional em Desenvolvimento",
          summary: `Este é um perfil de teste. ${verification_code} está incluído para verificação.`,
          profile_pic_url: null,
          background_cover_image_url: null,
          experiences: [],
          education: [],
          languages: [],
          certifications: [],
          volunteer_work: [],
          recommendations: [],
          skills: [],
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL("https://nubela.co/proxycurl/api/v2/linkedin");
    url.searchParams.set("url", linkedin_url);
    url.searchParams.set("use_cache", "if-recent");
    url.searchParams.set("skills", "include");
    url.searchParams.set("inferred_salary", "include");
    url.searchParams.set("personal_email", "include");
    url.searchParams.set("personal_contact_number", "include");

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${PROXYCURL_API_KEY}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Proxycurl error:", response.status, errorText);
      
      if (response.status === 404) {
        return new Response(JSON.stringify({ error: "Perfil do LinkedIn não encontrado. Verifique a URL." }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em alguns minutos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Proxycurl error: ${response.status}`);
    }

    const profile = await response.json();

    // Check if verification code exists in the summary/about field
    const summary = profile.summary || "";
    const verified = summary.includes(verification_code);

    return new Response(JSON.stringify({
      mock: false,
      verified,
      profile: {
        full_name: profile.full_name,
        headline: profile.headline,
        summary: profile.summary,
        profile_pic_url: profile.profile_pic_url,
        background_cover_image_url: profile.background_cover_image_url,
        experiences: profile.experiences || [],
        education: profile.education || [],
        languages: profile.languages || [],
        certifications: profile.certifications || [],
        volunteer_work: profile.volunteer_work || [],
        recommendations: profile.recommendations || [],
        skills: profile.skills || [],
        accomplishment_publications: profile.accomplishment_publications || [],
        accomplishment_honors_awards: profile.accomplishment_honors_awards || [],
        articles: profile.articles || [],
        groups: profile.groups || [],
        follower_count: profile.follower_count,
        connections: profile.connections,
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-linkedin error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro ao buscar dados do LinkedIn" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
