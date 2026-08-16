# IRENX PRIME — TradingView / Live Chart Integration

## Phase 1 — Embedded chart

Use the official TradingView Advanced Chart Widget for the website UI. It supports an embeddable real-time chart, symbol switching, date ranges, indicators and drawing tools.

Default UX:

- XAUUSD / gold symbol
- dark theme
- M5/M15/M30/H1/H4/D1 quick timeframe buttons
- symbol selector
- clean chart
- IRENX Signal panel beside/below the chart

Reference: https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/

## Phase 2 — Data adapter

Do not treat the embedded visualization as the trading-data backend. Add a dedicated data adapter for an authorized feed/broker API.

Normalized interface:

```text
getBars(symbol, timeframe, from, to)
→ timestamp, open, high, low, close, volume
```

The adapter feeds the same IRENX engine used by image mode.

## Phase 3 — Automatic analysis

`DATA → QUALITY → REGIME → LIQUIDITY → REFLEXIVITY → OROCHI → VMAP → FORECAST → CONFLUENCE → RISK → SIGNAL`

The website should automatically refresh analysis when a new bar closes rather than repeatedly changing a signal intrabar without confirmation.

## Phase 4 — Broker execution

Execution must remain separate from the public website analysis layer. A future MT5 bridge can receive a validated IRENX decision and perform order/risk controls.

## Practical rule

TradingView is the first visualization integration. Other chart sources can be supported through adapters, provided their data can be normalized and legally/technically accessed.
