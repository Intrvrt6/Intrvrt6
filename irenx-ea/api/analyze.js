export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });
  try {
    const { images = [], symbol = 'XAUUSD', timeframe = 'multi' } = req.body || {};
    if (!Array.isArray(images) || images.length === 0) return res.status(400).json({ error: 'At least one chart image is required' });
    if (images.length > 8) return res.status(400).json({ error: 'Maximum 8 images per analysis' });

    const prompt = `You are IRENX PRIME, a selective multi-timeframe trading-analysis engine. Analyze the supplied ${symbol} chart image(s), timeframe context: ${timeframe}. Do NOT invent unreadable prices. If a level cannot be reliably read, return null. Follow this exact hierarchy: REGIME -> LIQUIDITY -> REFLEXIVITY -> OROCHI -> VMAP -> FORECAST -> CONFLUENCE -> RISK -> EXECUTION. No single indicator/model can trigger a trade. Prefer WAIT/NO TRADE when evidence conflicts or the chart is insufficient. Identify HTF bias, liquidity pools, sweep/reaction, BOS/CHOCH/MSS/displacement, VMAP alignment if visible, volatility/risk conditions, and a conditional entry. Return ONLY valid JSON with keys: bias, confidence, entry, sl, tp1, tp2, tp3, trigger, invalidation, status, regime, liquidity, reflexivity, structure, vmap, forecast, risk, notes. status must be one of EXECUTE, WAIT, NO TRADE. bias must be BUY, SELL, or NEUTRAL. confidence is 0-100. Prices may be strings or null. This is analysis assistance, not a guarantee of future price.`;

    const content = [{ type: 'input_text', text: prompt }];
    for (const image of images) content.push({ type: 'input_image', image_url: image });

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: process.env.IRENX_VISION_MODEL || 'gpt-5.6', input: [{ role: 'user', content }], max_output_tokens: 1800 })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || 'Vision request failed' });
    const text = data.output_text || '';
    const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    let result;
    try { result = JSON.parse(cleaned); } catch { return res.status(502).json({ error: 'Model returned invalid JSON', raw: text.slice(0, 2000) }); }
    return res.status(200).json({ ...result, engine: 'IRENX PRIME Vision', generated_at: new Date().toISOString() });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Internal analysis error' });
  }
}
