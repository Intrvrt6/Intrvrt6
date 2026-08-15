# IRENX SIGNAL Command

## Command
`IRENX SIGNAL`

## Purpose
Shortcut for a concise trading-signal output using the full IRENX PRIME decision pipeline.

## Output
```text
IRENX SIGNAL

BIAS: BUY / SELL / WAIT
ENTRY: price or zone
SL: level
TP1: level
TP2: level
TP3: level
TRIGGER: required confirmation
STATUS: EXECUTE / WAIT / NO TRADE
```

## Rules
1. Never issue an entry from one indicator.
2. Entry must be supported by regime, liquidity, reflexivity/structure, VMAP and risk checks.
3. Forecast is supporting evidence, not a standalone trigger.
4. If confirmation is missing, output WAIT.
5. If risk or market quality fails, output NO TRADE/BLOCK.
6. Keep the signal short and easy to read.
7. For screenshots, distinguish visible chart levels from live market data; do not invent live prices.

## Example
```text
IRENX SIGNAL

BIAS: BUY
ENTRY: 4355–4345
SL: 4328
TP1: 4390
TP2: 4405
TP3: 4425
TRIGGER: bullish sweep + displacement + reclaim
STATUS: WAIT
```

This is a decision format, not a promise of profitability.
