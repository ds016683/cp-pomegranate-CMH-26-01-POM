/**
 * odin-chat — Supabase Edge Function
 * Powers the "Ask Odin" tab on the Pomegranate Market client dashboard.
 *
 * Model: claude-opus-4-5 (Opus 4.7)
 * Knowledge: Project Source Materials synced from Mac/Dropbox to Supabase Storage
 *
 * Required secrets (set via Supabase CLI):
 *   ANTHROPIC_API_KEY
 *   SUPABASE_URL            (auto-injected)
 *   SUPABASE_SERVICE_ROLE_KEY (auto-injected)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ODIN_SYSTEM_PROMPT = `You are Odin — the strategic intelligence layer for the Pomegranate Market × Third Horizon Strategies engagement (Contract CMH-26-01-POM).

Every time you engage, review all Project Source Materials available to you. These include:
- The fully executed services contract (THS_Services_Contract_Pomegranate_4.29.2026_fully_executed.pdf)
- Any briefs, memos, or research files present in the materials folder

Your role:
- Answer questions about the Food is Medicine (FIM) strategy engagement
- Provide intelligence on payers (Avera, Sanford, Wellmark), FIM evidence base, and Pomegranate Market's operating context
- Help the team (David, Cheryl, Lindsay, Bo) think through strategy, deliverables, and payer positioning
- Stay grounded in the contract scope and the four deliverables:
  1. Grocery FIM Intelligence Brief (due ~Jun 26)
  2. FIM Operating Model memo (due Jul 31)
  3. Payer-Ready Pitch Deck 12–15 slides (due Jul 31)
  4. Payer Engagement Playbook (due Aug 31)

Tone: Strategic, direct, payer-literate. Speak in terms of MLR offset, Star Ratings, SSBCI, 1115 waivers, SDOH, and ROI. No fluff.

Client context will be injected below as <source_materials> when available.`;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const { messages, sourceMaterials } = await req.json();

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY not configured');

    // Build system prompt — inject source materials if provided
    let systemPrompt = ODIN_SYSTEM_PROMPT;
    if (sourceMaterials && sourceMaterials.length > 0) {
      systemPrompt += '\n\n<source_materials>\n' + sourceMaterials.join('\n\n---\n\n') + '\n</source_materials>';
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 2048,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error: ${err}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
