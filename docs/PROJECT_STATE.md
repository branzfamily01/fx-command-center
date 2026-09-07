# FX Command Center Project State

Snapshot: 2026-09-07

## Current baseline
- Static browser MVP.
- Dashboard, EA analysis/health, MT4/MT5 CSV import, local persistence, scenario lab, Risk Console, AI Prompt and manual exist.
- GitHub Pages deployment is configured.
- No broker execution/live-data integration is part of the current baseline.

## Governance work
This snapshot adds architecture/governance documents only. Runtime calculations, imported data and deployment behavior are not changed.

## Immediate next work
1. Run Astra review using `docs/ASTRA_REVIEW_PACKAGE.md` before choosing live-data/broker integration architecture.
2. Keep deterministic risk calculations testable and document units/assumptions.
3. Add macro/fundamental intelligence as a sourced analysis layer rather than mixing it with imported trade data.
4. Preserve source attribution for user-provided chart/trading materials.
5. Keep execution connectivity out of bounded Sol/Codex tasks unless explicitly escalated and adopted.
