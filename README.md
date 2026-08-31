# FX Command Center

`branzfamily01/fx-command-center` の静的MVPです。EAの収益性・健全性・リスクを一つの画面で確認し、MT4 / MT5のCSVをブラウザ内で集計できます。

## Features

- Dashboard: Equity Curve / EA Allocation / EA Health Snapshot
- EA Analysis: EA別の損益、Return、Max DD、勝率、フィルター
- EA Health: uptime / heartbeat / status / watch signal
- CSV Import: MT4 / MT5の一般的なヘッダーを自動認識、localStorage保存
- Lab: ロット倍率・勝率・スプレッド・期間のwhat-ifシナリオ
- Risk Console: 残高、リスク率、SL、pip valueから推奨ロットを計算
- AI Prompt: 現在の分析データを含む日本語プロンプトを生成・コピー
- `manual.html`: 操作方法とデータポリシー
- `my-hub.json`: hub manifest

## Local preview

静的ファイルなので、次のいずれかでプレビューできます。

```bash
python -m http.server 8080
```

`http://localhost:8080/` を開いてください。GitHub Pagesは `main` へのpushで `.github/workflows/deploy-pages.yml` がデプロイします。

> FX/CFDの表示値は分析補助の参考値です。利益を保証するものではありません。
