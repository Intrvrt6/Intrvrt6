export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const openaiKey = process.env.OPENAI_API_KEY;
  const tdKey = process.env.TWELVE_DATA_API_KEY;
  if (!openaiKey) return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });
  if (!tdKey) return res.status(500).json({ error: 'TWELVE_DATA_API_KEY is not configured' });

  try {
    const { symbol = 'OANDA:XAUUSD', timeframes = ['1day','4h','30min','15min','5min'] } = req.body || {};
    const tdSymbol = symbol.includes('XAUUSD') ? 'XAU/USD' : symbol.replace(/^.*:/, '').replace('USD','/USD');
    const frames = Array.isArray(timeframes) && timeframes.length ? timeframes.slice(0, 5) : ['1day','4h','30min','15min','5min'];

    const series = {};
    for (const interval of frames) {
      const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(tdSymbol)}&interval=${encodeURIComponent(interval)}&outputsize=80&apikey=${encodeURIComponent(tdKey)}`;
      const r = await fetch(url);
      const d = await r.json();
      if (!r.ok || d.status === 'error') throw new Error(d.message || `Market data failed for ${interval}`);
      series[interval] = d.values || [];
    }

    const latest = series[frames[frames.length - 1]]?.[0] || {};
    const prompt = `You are IRENX PRIME LIVE, a selective multi-timeframe trading-analysis engine. Analyze REAL OHLC market data for ${symbol}. The data was fetched live from Twelve Data. Current latest candle for the lowest requested timeframe: ${JSON.stringify(latest)}. Full multi-timeframe OHLC series: ${JSON.stringify(series)}.

Follow this exact hierarchy: REGIME -> LIQUIDITY -> REFLEXIVITY -> OROCHI -> VMAP -> FORECAST -> CONFLUENCE -> RISK -> EXECUTION. Do not invent prices. Calculate observations from the supplied OHLC only. No single indicator/model can trigger a trade. Prefer WAIT/NO TRADE when evidence conflicts, data is stale, or setup quality is insufficient.

Assess HTF bias, trend/range regime, swing highs/lows, liquidity pools, likely sweep/reaction, BOS/CHOCH/MSS/displacement from OHLC structure, approximate VWAP/volume-weighted context only if volume is present, volatility, session context, and conditional entry. Since this is OHLC data rather than a chart image, clearly distinguish observed facts from inference. Entry/SL/TP must be conditional and derived from observed price structure. Never claim certainty or guaranteed profit.

Return ONLY valid JSON with keys: bias, confidence, entry, sl, tp1, tp2, tp3, trigger, invalidation, status, regime, liquidity, reflexivity, structure, vmap, forecast, risk, notes. status must be EXECUTE, WAIT, or NO TRADE. bias must be BUY, SELL, or NEUTRAL. confidence is 0-100. Prices may be strings or null.`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({ model: process.env.IRENX_LIVE_MODEL || 'gpt-5.6', input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }] }], max_output_tokens: 2200 })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || 'AI request failed' });
    const cleaned = (data.output_text || '').replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    let result;
    try { result = JSON.parse(cleaned); } catch { return res.status(502).json({ error: 'Model returned invalid JSON', raw: cleaned.slice(0, 2000) }); }

    return res.status(200).json({ ...result, engine: 'IRENX PRIME LIVE', market: { symbol, provider: 'Twelve Data', intervals: frames, latest: latest.datetime || null }, generated_at: new Date().toISOString() });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Live analysis error' });
  }
}
