# IRENX PRIME — Practical Chart Input Architecture

## Goal
Make IRENX usable with two inputs:

1. **Chart Image Mode** — user uploads a screenshot/photo of a chart.
2. **Live Chart Mode** — website displays a live market chart, with TradingView as the first supported source.

The website is the analysis front-end; the actual IRENX decision engine remains the authoritative layer.

## Image Mode pipeline

`IMAGE → OCR/VISION → SYMBOL/TIMEFRAME DETECTION → CANDLE/LEVEL EXTRACTION → DATA QUALITY → IRENX PRIME → SIGNAL`

The vision layer must return structured observations, not a trade decision:

- symbol
- timeframe
- visible price range
- candle sequence
- swing highs/lows
- liquidity candidates
- support/resistance candidates
- indicators visibly present in the image
- confidence and image-quality score

If symbol/timeframe or chart quality is ambiguous: `WAIT / REQUEST BETTER CHART`.

## Live Mode pipeline

`LIVE CHART → MARKET DATA ADAPTER → NORMALIZER → IRENX PRIME → SIGNAL`

The adapter must normalize data into a common OHLCV/tick-volume schema before the IRENX engine sees it.

## Multi-timeframe capture

Preferred minimum set:

- D1
- H4
- H1/M30
- M15
- M5

The engine should be able to operate with fewer timeframes, but confidence must decrease when context is missing.

## Important boundary

A TradingView embedded chart is a visualization/input surface. It is not, by itself, the IRENX inference backend. For production automated analysis, use an authorized market-data/datafeed integration or broker feed and pass normalized data into the IRENX engine.

## Signal output

```text
IRENX SIGNAL
BIAS: BUY / SELL / WAIT
ENTRY: zone
SL: level
TP1: level
TP2: level
TP3: level
TRIGGER: confirmation
STATUS: EXECUTE / WAIT / NO TRADE
```

## Safety / reliability gates

- Never infer exact prices from a low-resolution image without marking them approximate.
- Never allow one indicator or forecast model to trigger an order by itself.
- Reject stale, incomplete, or contradictory market data.
- Keep `NO TRADE` as a first-class result.
