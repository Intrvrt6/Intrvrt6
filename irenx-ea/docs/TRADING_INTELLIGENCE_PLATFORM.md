# IRENX PRIME — Trading Intelligence Platform

## Mission
IRENX is a decision-support and execution architecture, not a signal generator based on one indicator. It combines market data, chart vision, multi-timeframe structure, liquidity, reflexivity, OROCHI, VMAP, forecast evidence, confluence, and risk controls.

## Operating modes
1. **Vision Mode** — upload chart screenshots from MT5/TradingView/other platforms.
2. **Live Data Mode** — ingest authorized OHLC/tick/spread/session/news data through a backend adapter.
3. **Hybrid Mode** — live market data + chart image/context + model evidence.
4. **Research Mode** — backtest, walk-forward, Monte Carlo, regime breakdown and post-trade review.

## Core pipeline
`DATA QUALITY → REGIME → LIQUIDITY → REFLEXIVITY → OROCHI → VMAP → FORECAST → CONFLUENCE → RISK → EXECUTION`

## Intelligence layers
- **Data Quality:** stale data, malformed bars, spread anomaly, missing bars, extreme gaps.
- **Regime:** trend, range, accumulation, distribution, transition, expansion, compression.
- **Liquidity:** previous/session highs and lows, equal highs/lows, liquidity pools, sweeps and voids.
- **Reflexivity:** sweep → reaction → displacement → follow-through or failure.
- **OROCHI:** BOS, CHOCH, MSS, displacement, imbalance/FVG and structural invalidation.
- **VMAP:** price relation, slope, multi-timeframe alignment and distance; never a standalone trigger.
- **Forecast:** horizon-aware path, expected return and volatility; evidence only, never authority.
- **Confluence:** weighted evidence plus hard vetoes.
- **Risk:** volatility-adjusted SL/TP/size, spread, RR and exposure limits.
- **Execution:** market/limit/stop only after all gates pass.

## Decision states
- `EXECUTE` — all mandatory gates pass and risk is acceptable.
- `WAIT` — thesis is plausible but trigger is incomplete.
- `NO TRADE` — evidence conflicts, data quality fails, or risk is unacceptable.

## Signal contract
`BIAS, CONFIDENCE, ENTRY, SL, TP1, TP2, TP3, TRIGGER, INVALIDATION, STATUS`

## Safety/quality rules
- Never fabricate unreadable chart prices.
- Never treat model confidence as probability of profit.
- Never allow a single indicator/model to open a trade.
- XAUUSD broker tick volume is auxiliary, not centralized exchange volume.
- Backtests must include spread, commission, slippage and realistic execution assumptions.
- Production promotion requires out-of-sample and walk-forward validation.
- Live execution should remain separately gated from intelligence output.

## Recommended production topology
`Web UI → API Gateway → Data Adapter → Feature/Regime Engine → IRENX Confluence Engine → Forecast Adapter → Risk Engine → Signal API → Optional MT5 Execution Bridge`

The UI is not the trading engine. The backend is the source of truth for data, analysis, audit logs and execution permissions.
