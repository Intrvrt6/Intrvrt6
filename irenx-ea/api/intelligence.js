export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });

  try {
    const body = req.body || {};
    const symbol = body.symbol || 'XAUUSD';
    const market = body.market || {};
    const chartContext = body.chartContext || '';
    const prompt = `You are the IRENX PRIME Trading Intelligence Engine for ${symbol}. Return JSON only. Build a decision-support snapshot, not a guaranteed prediction. Follow: DATA QUALITY -> REGIME -> LIQUIDITY -> REFLEXIVITY -> OROCHI -> VMAP -> FORECAST -> CONFLUENCE -> RISK -> EXECUTION. Use supplied market data only; do not invent missing values. Treat forecast as evidence, never as a standalone trigger. If mandatory evidence is missing or conflicting, status=WAIT or NO TRADE. Evaluate: regime, liquidity, reflexivity, structure, vmap, forecast, volatility, spread, session, risk/reward. Return keys: symbol, status, bias, confidence, regime, liquidity, reflexivity, structure, vmap, forecast, volatility, spread, session, entry, sl, tp1, tp2, tp3, trigger, invalidation, risk, reasons, next_action. status must be EXECUTE, WAIT, or NO TRADE; bias BUY, SELL, or NEUTRAL; confidence 0-100.\nMARKET DATA:\n${JSON.stringify(market).slice(0,12000)}\nCHART CONTEXT:\n${chartContext.slice(0,6000)}`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.IRENX_INTELLIGENCE_MODEL || process.env.IRENX_VISION_MODEL || 'gpt-5.6',
        input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }] }],
        max_output_tokens: 2200
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || 'Intelligence request failed' });
    const text = (data.output_text || '').replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const result = JSON.parse(text);
    return res.status(200).json({ ...result, engine: 'IRENX PRIME Trading Intelligence', generated_at: new Date().toISOString() });
  } catch (e) {
    return res.status(502).json({ error: e?.message || 'Invalid intelligence response' });
  }
}
