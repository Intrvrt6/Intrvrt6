# IRENX PRIME EA — MT5 Implementation Roadmap

## Stage A — Research Prototype
- Build pure MQL5 market-data and structure modules.
- Implement regime/liquidity/structure states.
- Produce a decision log without trading.

## Stage B — Signal Engine
- Implement IRENX SIGNAL state machine.
- Add setup scoring and mandatory gates.
- Add chart annotations and audit logs.

## Stage C — Backtestable Execution
- Market/stop/limit execution modules.
- Structure-based SL/TP.
- Position sizing.
- Spread and slippage guards.
- Session/news filters.

## Stage D — Forecast Adapter
- Define a stable input schema for external predictive inference.
- Pass normalized K-line sequences and context.
- Receive forecast path, expected return, and volatility.
- Fail closed: unavailable/invalid forecast → no predictive advantage; never force a trade.

## Stage E — Risk Engine
- Dynamic risk by volatility.
- Max daily loss.
- Max concurrent exposure.
- Consecutive-loss cooldown.
- Equity drawdown protection.
- Broker execution checks.

## Stage F — Validation
- In-sample research only for development.
- Walk-forward optimization.
- Out-of-sample verification.
- Monte Carlo.
- Spread/slippage stress.
- Regime segmentation.
- Demo forward test.

## Stage G — Production
- Versioned configuration.
- Immutable decision logs.
- Error/fail-safe handling.
- Monitoring dashboard.
- Controlled rollout.

## Non-Negotiable Safety Gates
- No trade when data quality fails.
- No trade when spread is abnormal.
- No trade when required structure confirmation is absent.
- No trade when risk limits fail.
- No model failure should cause an automatic order.

## Suggested Module Layout
```text
MQL5/
  IRENX_Core.mq5
  modules/
    DataQuality.mqh
    Regime.mqh
    Liquidity.mqh
    Reflexivity.mqh
    Orochi.mqh
    VMAP.mqh
    ForecastAdapter.mqh
    Confluence.mqh
    Risk.mqh
    Execution.mqh
    Signal.mqh
    Logger.mqh
```
