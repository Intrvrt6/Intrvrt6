export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const expectedKey = process.env.IRENX_MT5_KEY;
  if (!expectedKey) return res.status(500).json({ error: 'IRENX_MT5_KEY is not configured' });
  const suppliedKey = req.headers['x-irenx-key'];
  if (!suppliedKey || suppliedKey !== expectedKey) return res.status(401).json({ error: 'Unauthorized IRENX adapter' });

  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });

  try {
    const body = req.body || {};
    const symbol = body.symbol || 'XAUUSD';
    const market = body.market || {};
    const source = body.source || 'unknown';
    if (source !== 'MT5') return res.status(400).json({ error: 'This endpoint accepts MT5 market snapshots only' });
    if (!market.timeframes || !market.timeframes.M5 || !market.timeframes.M15) {
      return res.status(400).json({ error: 'M5 and M15 data are required' });
    }

    const prompt = `You are IRENX PRIME Trading Intelligence for ${symbol}. This is decision-support, NOT a guaranteed prediction and NOT permission to place an order. Analyze the supplied MT5 market snapshot only. Follow exactly: DATA QUALITY -> REGIME -> LIQUIDITY -> REFLEXIVITY -> OROCHI -> VMAP -> FORECAST -> CONFLUENCE -> RISK -> EXECUTION. Use higher timeframes for context and lower timeframes for timing. No single indicator/model can trigger a trade. Forecast is evidence only. Never invent unreadable/missing prices. If mandatory evidence is missing, stale, contradictory, or market quality is poor, status=WAIT or NO TRADE. Treat broker tick volume as auxiliary, not centralized exchange volume. Check spread and volatility before suggesting execution. Return ONLY JSON with keys: symbol,status,bias,confidence,regime,liquidity,reflexivity,structure,vmap,forecast,volatility,spread,session,entry,sl,tp1,tp2,tp3,trigger,invalidation,risk,reasons,next_action,data_quality. status must be EXECUTE, WAIT, or NO TRADE; bias BUY, SELL, or NEUTRAL; confidence 0-100. A signal should be EXECUTE only when structure/liquidity/reaction/VMAP/risk are sufficiently aligned; otherwise WAIT. Keep entry/SL/TP conditional and realistic for the supplied price precision.`;

    const input = `${prompt}\n\nMT5 SNAPSHOT:\n${JSON.stringify({ symbol, source, adapter_version: body.adapter_version, timestamp: body.timestamp, market }).slice(0, 24000)}`;
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.IRENX_INTELLIGENCE_MODEL || 'gpt-5.6',
        input: [{ role: 'user', content: [{ type: 'input_text', text: input }] }],
        max_output_tokens: 2400
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || 'Intelligence request failed' });
    const text = (data.output_text || '').replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    let result;
    try { result = JSON.parse(text); } catch { return res.status(502).json({ error: 'Model returned invalid JSON', raw: text.slice(0, 2000) }); }

    return res.status(200).json({
      ...result,
      engine: 'IRENX PRIME Live Intelligence',
      source: 'MT5',
      received_at: new Date().toISOString()
    });
  } catch (e) {
    return res.status(502).json({ error: e?.message || 'Invalid intelligence response' });
  }
}
