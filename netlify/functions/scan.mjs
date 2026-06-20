// netlify/functions/scan.mjs
// Server-side fridge scanner. The API key stays here, never in the browser.
// Set ANTHROPIC_API_KEY in Netlify: Site settings -> Environment variables.

export default async (req) => {
  try {
    const { image, mediaType } = await req.json(); // image = base64 (no "data:" prefix)

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        // Haiku is the cheapest/fastest and is plenty for "what's in this photo".
        // Swap to claude-sonnet-4-6 if you want higher accuracy.
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: image } },
              {
                type: "text",
                text:
                  "List the food ingredients you can clearly see in this fridge photo. " +
                  'Reply with ONLY a JSON array of short lowercase names, e.g. ["tomato","eggs","milk"]. ' +
                  "No prose, no markdown, max 12 items.",
              },
            ],
          },
        ],
      }),
    });

    const data = await r.json();
    const text = (data.content || []).map((b) => b.text || "").join("");
    let ingredients = [];
    try {
      ingredients = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (!Array.isArray(ingredients)) ingredients = [];
    } catch {
      ingredients = [];
    }

    return new Response(JSON.stringify({ ingredients }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ingredients: [], error: String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};
