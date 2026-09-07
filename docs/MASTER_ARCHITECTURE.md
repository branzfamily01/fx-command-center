# FX Command Center Master Architecture

Status: approved baseline consolidated by Sol; Astra architecture review pending
Last updated: 2026-09-07

## 1. Current product architecture
The current implementation is a static browser application. MT4/MT5 CSV files are imported locally, normalized for analysis, and persisted locally under the current MVP design.

## 2. Data boundaries
Keep these layers distinct:
- imported/raw trade data
- deterministic derived metrics and risk calculations
- AI-generated interpretation/prompts

AI text must not silently replace original source data or deterministic calculated values.

## 3. Risk-engine boundary
Position/risk arithmetic should be deterministic and testable. Inputs such as account currency, balance, risk %, stop distance, pip/point value and contract assumptions must be explicit. Any cross-symbol/cross-currency conversion must have a defined data source and timestamp when live data is introduced.

## 4. Market intelligence
Fundamental/macro analysis is an intelligence layer that can consume structured evidence on rates, central banks, inflation, employment, GDP, geopolitics and sentiment. It must preserve source freshness/provenance and remain separate from actual order execution.

## 5. Knowledge-material boundary
User-provided chart/trading books may create source-attributed rule libraries or analysis context. The application must distinguish source-derived rules from verified market data and from AI interpretation.

## 6. Execution boundary
The current architecture does not place trades. Broker connectivity, credential storage or autonomous execution would be a root architecture/safety change rather than a small feature.

## 7. Storage evolution
Local browser persistence is acceptable for the current static MVP. A durable backend/live-data layer should be introduced only with a defined data contract, provenance/freshness rules, backup/migration plan and security model.

## 8. Governance
- Astra: live data/provider topology, canonical durable data model, risk-engine redesign, broker/execution connectivity, major automation/security.
- Sol: routine dashboard/analysis/risk UI, CSV mapping, prompt/report design, bounded features, documentation and Codex tasks.
- Codex: scoped implementation/tests.

## 9. Escalation
Astra review is required before adding broker execution, changing core risk formulas/contracts, adopting a live-data source-of-truth, storing trading credentials, or introducing autonomous trade actions.
