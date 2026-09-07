# ASTRA REVIEW PACKAGE — FX Command Center

## Mode
ASTRA ARCHITECTURE REVIEW

## Current design
- Static browser analysis MVP.
- MT4/MT5 CSV is imported locally; raw/source data is distinct from derived metrics and AI interpretation.
- Risk calculations are deterministic and should expose units/assumptions.
- Macro/fundamental intelligence may be added as sourced analysis.
- No broker execution/credential storage in the current design.

## Inspect
- `README.md`
- current CSV parser/normalization, Risk Console and local-storage code
- `docs/REQUIREMENTS.md`
- `docs/MASTER_ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/PROJECT_STATE.md`
- `AGENTS.md`

## Questions for Astra
1. What canonical trade/EA/risk data contracts should precede live market-data integration?
2. What provider architecture should supply current prices, FX conversion, macro releases and provenance/freshness metadata?
3. What deterministic risk-engine contract prevents unit/currency/pip mistakes across symbols/brokers?
4. How should user-provided chart-analysis material be represented as traceable rules/context?
5. If broker connectivity is ever considered, what hard isolation should exist between analytics, approval and execution?
6. What durable backend/source-of-truth is justified, if any, beyond the current local MVP?

## Required output
Classify proposed deltas Maintain / Modify / Retire / Hold. Do not auto-adopt major changes. Return architecture findings, target data/risk contracts, provider/security risks, migration phases, docs to update and SOL HANDOFF.
