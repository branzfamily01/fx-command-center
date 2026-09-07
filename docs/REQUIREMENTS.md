# FX Command Center Requirements

Status: current approved baseline, 2026-09-07

## Purpose
A decision-support dashboard for FX/EA operation that combines performance, health, imported MT4/MT5 trade data, risk calculations, scenario analysis and AI-assisted interpretation without pretending to guarantee returns.

## Core requirements
- Import MT4/MT5 CSV data and preserve source values separately from derived analysis.
- Dashboard and EA-level profitability/health views.
- Risk Console with explicit assumptions, units, account balance/risk rate/SL/pip-value inputs and reproducible calculations.
- Scenario/what-if analysis for lot size, spread, win rate and time ranges where applicable.
- AI Prompt/analysis output must be clearly distinguished from original imported data and deterministic calculations.
- Current product is analysis/support, not automated trade execution.

## Fundamental/macro expansion
The system may analyze drivers relevant to USD, JPY and other currencies, including central-bank policy, rates, CPI/inflation, employment, GDP, geopolitical events, risk sentiment and other material fundamentals.

## Knowledge sources
User-provided chart-analysis books or trading materials may be used as a traceable knowledge/rule source. Derived rules must remain attributable to their source and should not be presented as universal market truths.

## Safety
- Do not guarantee profits or imply backtest/historical results guarantee future outcomes.
- Never commit broker credentials, API secrets or account secrets.
- Analysis and actual order execution remain separate under the current scope.
- Risk calculations must make assumptions/units visible and avoid silent currency/pip/contract-size assumptions.

## Governance
Astra owns live market-data/provider architecture, durable data model, deterministic risk-engine redesign, broker/execution connectivity and major automation. Sol owns routine analytics, UI, prompts, CSV handling and bounded risk features. Codex implements approved changes.
