// Supabase Edge Function: AI gateway.
// Deploy: `supabase functions deploy ai --no-verify-jwt` (add JWT verification
// in production). Set the provider key as a secret:
//   supabase secrets set ANTHROPIC_API_KEY=sk-...
//
// This is the ONLY place a model-vendor key lives. The app calls this endpoint
// with { kind, system, user, image?, mediaType? } and gets back { text, model }.
// Swapping models = editing MODEL_FOR_KIND here; the app never changes.
//
// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const MODEL_FOR_KIND: Record<string, string> = {
  vision: 'claude-haiku-4-5-20251001', // cheap + fast, plenty for "what's in this photo"
  nutrition: 'claude-haiku-4-5-20251001',
  recipe: 'claude-sonnet-4-6', // higher quality for generation/coaching
  coach: 'claude-sonnet-4-6',
};

serve(async (req) => {
  try {
    const { kind, system, user, image, mediaType } = await req.json();
    const model = MODEL_FOR_KIND[kind] ?? 'claude-haiku-4-5-20251001';

    const content: any[] = [];
    if (image) {
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: mediaType ?? 'image/jpeg', data: image },
      });
    }
    content.push({ type: 'text', text: user });

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1500,
        system,
        messages: [{ role: 'user', content }],
      }),
    });

    const data = await r.json();
    const text = (data.content ?? []).map((b: any) => b.text ?? '').join('');
    return new Response(JSON.stringify({ text, model }), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ text: '', model: 'error', error: String(e) }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
});
