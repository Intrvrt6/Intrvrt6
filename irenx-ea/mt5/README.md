# IRENX PRIME — MT5 Live Data Adapter

This adapter turns an MT5 terminal into a live market-data source for the IRENX Trading Intelligence Platform.

## Flow

`MT5 XAUUSD -> M5/M15/M30/H4/D1/MN OHLC + tick data -> HTTPS -> IRENX Intelligence -> IRENX SIGNAL`

The adapter is **analysis-only**. It does not place, modify, or close trades.

## 1. Deploy the website/API

Use the repository root as the Vercel project root. The live endpoint is:

`https://YOUR-DOMAIN.vercel.app/api/intelligence`

The root `api/intelligence.js` delegates to `irenx-ea/api/intelligence.js`.

## 2. Configure Vercel environment variables

Required:

- `OPENAI_API_KEY` — your server-side OpenAI API key.
- `IRENX_MT5_KEY` — a long random shared secret used only between MT5 and IRENX.
- `IRENX_INTELLIGENCE_MODEL` — optional model override.

Never put `OPENAI_API_KEY` in MQL5 or frontend JavaScript.

## 3. Configure MT5

Compile `IRENX_Live_Data_Adapter.mq5` and attach it to any chart.

Set:

- `InpEndpoint` = `https://YOUR-DOMAIN.vercel.app/api/intelligence`
- `InpApiKey` = exactly the same value as `IRENX_MT5_KEY`
- `InpSymbol` = blank for current symbol, or your broker's gold symbol such as `XAUUSDm`
- `InpBarsPerTF` = 40 by default
- `InpSendOnNewBar` = true by default

In MT5 go to:

`Tools -> Options -> Expert Advisors -> Allow WebRequest for listed URL`

Add your Vercel domain, for example:

`https://YOUR-DOMAIN.vercel.app`

## 4. Signal behavior

IRENX receives:

- bid/ask/last
- spread in points
- server timestamp
- MN, D1, H4, M30, M15, M5 bars
- OHLC
- tick volume
- broker spread per bar

IRENX then applies:

`DATA QUALITY -> REGIME -> LIQUIDITY -> REFLEXIVITY -> OROCHI -> VMAP -> FORECAST -> CONFLUENCE -> RISK -> EXECUTION`

The AI layer is not allowed to act as a standalone trigger. Missing/conflicting evidence produces `WAIT` or `NO TRADE`.

## 5. Important

Broker tick volume is treated as auxiliary evidence. It is not assumed to be centralized exchange volume.

This version is a **live intelligence adapter**, not an auto-trading bridge. Keep execution separated until the intelligence layer has passed backtests, walk-forward validation, spread/slippage testing, and live paper-trading.
