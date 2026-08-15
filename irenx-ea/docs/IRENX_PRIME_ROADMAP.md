# IRENX PRIME EA — Master Roadmap

## Vision
IRENX PRIME adalah trading-system architecture untuk XAUUSD/Forex yang mengutamakan selective execution, multi-timeframe evidence, liquidity awareness, predictive evidence, dan risk control.

**Core principle:** NO TRADE adalah keputusan valid. Tidak ada indikator, model AI, forecast, atau pattern tunggal yang boleh membuka trade.

## Core Pipeline
`DATA → QUALITY → REGIME → LIQUIDITY → REFLEXIVITY → OROCHI → VMAP → FORECAST → CONFLUENCE → RISK → EXECUTION`

## Phase 1 — Core Market Engine
- Multi-timeframe OHLC/tick-volume ingestion.
- Spread/session/news filters.
- Data-quality and anomaly gate.
- Regime classification: trend, range, accumulation, distribution, transition, expansion, compression.

## Phase 2 — Liquidity & Structure
- Buy-side/sell-side liquidity mapping.
- Previous/session highs and lows.
- Equal highs/lows and liquidity pools.
- Sweep detection.
- BOS, CHOCH, MSS, displacement, imbalance/FVG and structural invalidation.

## Phase 3 — Reflexivity / OROCHI
- Detect sweep → rejection → displacement → follow-through.
- Separate genuine reversal from simple liquidity grab.
- Multi-timeframe structural confirmation.
- Continuation vs reversal state.

## Phase 4 — VMAP Filter
VMAP is a confirmation/filter, never a standalone trigger.
- Price vs VMAP.
- VMAP slope.
- Cross-timeframe alignment.
- Distance from VMAP.
- Reject setups where VMAP conflicts with structure/liquidity.

## Phase 5 — Predictive Evidence
Kronos-inspired principles are used as an additional evidence layer:
- K-line state representation.
- Coarse-to-fine context.
- Multi-step forecast path.
- Expected-return/forecast-edge assessment.
- Forecast volatility.
- Session/temporal context.

The actual Kronos model is not assumed to be running inside MT5 until a validated inference pipeline exists.

## Phase 6 — Confluence Engine
Evidence is combined rather than allowing one signal to dominate.
Suggested conceptual weights:
- Regime 20%
- Liquidity 20%
- Reflexivity 15%
- Orochi 15%
- VMAP 10%
- Forecast 10%
- Session/timing 5%
- Market quality 5%

These are research defaults, not guaranteed optimal weights.

## Phase 7 — Execution
Possible execution modes:
- Market entry.
- Buy/Sell Stop.
- Buy/Sell Limit.
- Retest entry.

Execution occurs only after the confluence gate passes.

## Phase 8 — Dynamic Risk
- Structure-based invalidation.
- Forecast-volatility-aware SL/TP.
- Dynamic position sizing.
- Spread/slippage protection.
- Breakeven and trailing logic.
- Partial exits where validated.
- Extreme-volatility trade block.

## Phase 9 — Validation
Required before live deployment:
- Backtest.
- Walk-forward testing.
- Out-of-sample testing.
- Spread/slippage/commission modeling.
- Regime-by-regime evaluation.
- Monte Carlo robustness testing.
- Parameter sensitivity testing.
- Forward demo validation.

## Phase 10 — Production EA
Target architecture:
- MQL5 execution/risk engine.
- External predictive inference layer where required.
- Logging and decision audit trail.
- Signal snapshot storage.
- Versioned configuration.
- Fail-safe behavior: if data/model dependency fails → NO TRADE.

## Success Criteria
IRENX is considered production-ready only when the complete system demonstrates robust out-of-sample behavior, controlled drawdown, realistic execution assumptions, and stable performance across multiple market regimes.

**No claim of guaranteed win rate or guaranteed profitability.**
