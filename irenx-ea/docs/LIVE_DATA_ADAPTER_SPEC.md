# IRENX Live Data Adapter Specification

The intelligence API accepts normalized market snapshots. The adapter must be the only component responsible for connecting to an authorized data provider.

## Minimum payload
```json
{
  "symbol": "XAUUSD",
  "timestamp": "ISO-8601",
  "price": {"bid": 0, "ask": 0, "mid": 0},
  "spread": 0,
  "bars": {
    "M5": [{"time": "ISO-8601", "open": 0, "high": 0, "low": 0, "close": 0, "volume": 0}],
    "M15": [], "M30": [], "H1": [], "H4": [], "D1": []
  },
  "session": "NEW_YORK"
}
```

## Provider boundary
Do not scrape or bypass platform restrictions. Use an authorized broker/data-provider API, MT5 bridge, or another licensed feed. Normalize the provider output into the schema above, then call `/api/intelligence`.

## Execution boundary
`/api/intelligence` produces intelligence only. A separate execution bridge must validate signal freshness, account risk, symbol specifications, market state, and user execution permissions before placing an order.
