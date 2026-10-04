# 繁體中文在地化原始檔

這裡儲存 Impeccable 中文社群增強版的可維護翻譯源，不儲存產生後的宿主副本。

## 翻譯與審校狀態

- 43/43 個上游核心檔案均有繁體中文版本，並接受與簡體版相同的結構、連結、規則標記及上游 blob 門禁。
- 全量參考文件以 OpenCC `s2twp` 建立台灣正體基線；入口、術語表、三個中文增強、Web 與評測場景已完成台灣軟體術語校訂。
- `terminology-policy.json` 禁止常見簡體或中國大陸軟體術語回流。未來上游同步仍需人工逐檔複核語意，不能只重新執行轉換。

規則：

- `source-map.json` 中的 `sourceBlob` 鎖定翻譯所依據的上游檔案。
- 上游檔案變化後，校驗會失敗，必須人工複核並更新翻譯與 blob。
- 命令名、設定鍵、JSON 欄位、檔名和程式碼識別符號保持英文。
- `<!-- rule:... -->` 標記和 `{{placeholder}}` 必須完整保留。
- 繁體中文增強內容放在 `extensions/`，不偽裝成上游翻譯。

驗證：

```bash
npm run localization:check
npm run localization:report
```

產生臨時中文 Skill 源樹：

```bash
npm run localization:compose -- --locale zh-TW --out /tmp/impeccable-zh-TW-skill
```

使用臨時合成源執行上游建置，且不改寫英文 `skill/`：

```bash
npm run localization:build:zh-TW
```

釋出門禁要求全部跟蹤原始檔完成對映：

```bash
npm run localization:check -- --release
```

釋出門禁要求覆蓋率維持 100%，並同時通過正體術語檢查。
