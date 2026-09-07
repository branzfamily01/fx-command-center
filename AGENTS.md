# AGENTS.md — FX Command Center

## Governance
- Astra: Chief Architect for live-data/provider topology, durable data model, core risk-engine contracts, security and broker/execution architecture.
- Sol: Main Operator for routine analysis/UI/CSV/risk features, prompts/reports, docs, Codex tasks and review.
- Codex: Repository Implementer.

## Read first
- `README.md`
- `docs/REQUIREMENTS.md`
- `docs/MASTER_ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/PROJECT_STATE.md`

## Data/risk invariants
- Preserve imported/raw trade data separately from derived metrics and AI interpretation.
- Deterministic risk/lot calculations must expose assumptions and units.
- Never let free-form AI output silently overwrite verified/imported numerical data.
- Do not imply guaranteed returns.
- Do not commit broker credentials, API secrets or account secrets.
- The current product analyzes; it does not autonomously execute trades.

## Web app delivery
- Public entry point remains `index.html`.
- Keep all required static assets in the repository so the app remains directly deployable from the repo root where applicable.

## Escalation
Do not independently add broker execution, credential storage, a live market-data source-of-truth, autonomous trade actions, or a breaking risk-engine redesign. Report to Sol for Astra escalation.

## Change control
Classify major proposals Maintain / Modify / Retire / Hold. Major changes require explicit user acceptance.

## Verification
For changes, inspect the full diff and test relevant CSV import, calculations, persistence, scenario outputs, dashboard rendering and manual access. Verify formulas with deterministic fixtures where possible. Report anything not verified.
