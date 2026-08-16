# IRENX PRIME AI Vision Setup

## What is now implemented

`chart.html` can upload chart screenshots and POST them to `/api/analyze`.

`api/analyze.js` sends the images to the OpenAI Responses API and asks the model to follow the IRENX PRIME hierarchy:

REGIME → LIQUIDITY → REFLEXIVITY → OROCHI → VMAP → FORECAST → CONFLUENCE → RISK → EXECUTION

The endpoint returns structured signal fields: bias, confidence, entry, SL, TP1/TP2/TP3, trigger, invalidation, status, regime, liquidity, reflexivity, structure, VMAP, forecast, risk and notes.

## Vercel environment variable

Add this server-side environment variable in the Vercel project:

`OPENAI_API_KEY=...`

Optional:

`IRENX_VISION_MODEL=gpt-5.6`

Never place the API key inside `chart.html` or commit it to GitHub.

## Important

This is an analysis assistant, not a guaranteed trading system. Image interpretation can be uncertain. The prompt explicitly requires WAIT/NO TRADE when evidence is insufficient and forbids inventing unreadable prices.

For true live automatic signal generation without screenshots, add an authorized market-data adapter and feed normalized OHLCV/spread/session/news data into a separate IRENX market-data endpoint. The embedded TradingView widget remains a visualization layer.
