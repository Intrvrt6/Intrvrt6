# IRENX PRIME Logic Specification

## Decision Hierarchy

### 1. DATA
Inputs:
- OHLC.
- Tick volume as auxiliary evidence for instruments such as XAUUSD CFD.
- Spread.
- Session/time context.
- News state.
- Multi-timeframe bars.

### 2. DATA QUALITY GATE
Reject if:
- Invalid/missing data.
- Abnormal spread.
- Extreme execution conditions.
- Suspected candle anomaly.
- Insufficient liquidity.

### 3. REGIME
Classify the dominant state:
- Trend up/down.
- Range.
- Accumulation.
- Distribution.
- Transition.
- Expansion.
- Compression.

### 4. LIQUIDITY
Map where stops and liquidity are likely concentrated:
- Buy-side liquidity.
- Sell-side liquidity.
- Equal highs/lows.
- Previous day/session highs/lows.
- Major swing points.
- Liquidity voids.

### 5. REFLEXIVITY
Validate market response:
`Sweep → Rejection → Displacement → Follow-through`

A sweep without displacement is not automatically a reversal.

### 6. OROCHI
Structural engine:
- HH/HL and LH/LL.
- BOS.
- CHOCH.
- MSS.
- Displacement.
- Imbalance/FVG.
- Structural invalidation.

### 7. VMAP
VMAP confirms; it does not trigger.
Check:
- Price position.
- Slope.
- Higher-timeframe alignment.
- Distance.

### 8. FORECAST
Predictive evidence can include:
- K-line state.
- Coarse-to-fine representation.
- Forecast path.
- Expected return.
- Forecast volatility.
- Temporal/session context.

Forecast conflict reduces confidence. It cannot override structural evidence by itself.

### 9. CONFLUENCE
A setup becomes executable only when enough independent evidence aligns.

### 10. RISK
Before execution:
- Determine invalidation.
- Estimate volatility.
- Calculate SL/TP.
- Calculate position size.
- Check RR.
- Check spread/slippage.

### 11. EXECUTION
Only then choose market, stop, limit, or retest entry.

## Final States
- `EXECUTE`: all mandatory gates pass.
- `WAIT`: setup is developing but confirmation is incomplete.
- `NO TRADE`: evidence is insufficient or conflicting.
- `BLOCK`: data, spread, volatility, or execution conditions are unsafe.

## Golden Rule
`One indicator = evidence.`
`Multiple aligned layers = setup.`
`No alignment = NO TRADE.`
