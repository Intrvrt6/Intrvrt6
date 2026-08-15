# IRENX PRIME — Kronos-Inspired Forecast Layer

## Purpose
Integrate financial time-series foundation-model concepts as predictive evidence without allowing the model to become the entry trigger.

## Concepts Adopted
- K-line sequence/state representation.
- Hierarchical coarse-to-fine context.
- Autoregressive multi-step forecast path.
- Expected-return aggregation to reduce short-horizon noise.
- Volatility forecasting as a risk input.
- Temporal/session context.
- Data cleaning and anomaly handling.
- Walk-forward/out-of-sample validation.

## IRENX Interpretation
The forecast layer answers:
> Does the predicted path strengthen or weaken the market thesis already built by structure and liquidity?

It does NOT answer:
> Should I buy or sell because the model says so?

## Alignment Logic
### Strong alignment
`HTF structure ↑ + liquidity reaction ↑ + VMAP ↑ + forecast ↑`

→ confidence increases.

### Mixed alignment
`HTF ↑ + LTF compression + forecast neutral`

→ WAIT.

### Major conflict
`Structure ↑ + liquidity failure + forecast ↓`

→ reduce confidence or NO TRADE.

## Volatility Use
Forecast volatility can modify:
- Position size.
- SL distance.
- TP distance.
- Trade eligibility.

Extreme volatility can block execution.

## XAUUSD Note
XAUUSD on a broker/CFD feed does not have centralized exchange volume equivalent to a single consolidated market. Tick volume must therefore remain auxiliary rather than being treated as centralized traded volume.

## Implementation Boundary
The current IRENX architecture is **Kronos-inspired**. The actual Kronos model must not be represented as active in production until its inference pipeline is implemented, benchmarked, and validated on the target XAUUSD feed.
