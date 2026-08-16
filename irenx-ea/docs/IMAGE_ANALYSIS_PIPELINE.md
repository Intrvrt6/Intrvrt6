# IRENX PRIME — Chart Image Analysis Pipeline

## User experience

The user should be able to:

1. Upload one chart screenshot.
2. Optionally upload multiple screenshots for D1/H4/M30/M15/M5.
3. Press `IRENX SIGNAL`.
4. Receive a compact signal and the reasons behind it.

## Required vision extraction

The image analyzer identifies:

- instrument/symbol when visible
- timeframe
- current price when visible
- OHLC candle geometry
- visible swing points
- obvious liquidity pools
- market-structure breaks
- VMAP/MA/other visible overlays
- session markers if visible
- chart quality / ambiguity

## Confidence policy

Vision extraction has its own confidence score.

```text
Image confidence < threshold
→ REQUEST BETTER IMAGE

Image confidence OK
→ IRENX PRIME analysis
```

The vision model must never fabricate missing prices or indicators.

## Multi-image fusion

When multiple timeframes are supplied:

```text
D1/H4 = regime context
M30/M15 = structure + liquidity
M5 = execution context
```

Conflicting images are preserved as conflicts; they are not silently averaged into a fake consensus.

## Output

```text
IRENX SIGNAL
BIAS: 🟢 BUY / 🔴 SELL / ⚪ WAIT
ENTRY: ...
SL: ...
TP1: ...
TP2: ...
TP3: ...
TRIGGER: ...
STATUS: ...
```

Then one short explanation:

`REGIME + LIQUIDITY + REFLEXIVITY + OROCHI + VMAP + FORECAST`

## Backend requirement

A production image-analysis button needs a server-side vision/inference endpoint. A static GitHub Pages/Vercel HTML page can preview the image locally, but it should not expose private API keys in browser code.
