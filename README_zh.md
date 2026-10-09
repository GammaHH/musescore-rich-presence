<!-- markdownlint-disable MD033 MD041 -->

<p align="center">
  <img alt="MuseScore Rich Presence logo" src="src/plugin/current_score_info.png" width="220" />
</p>

<div align="center">

# MuseScore Rich Presence

_✨ MuseScore Studio 的 Discord Rich Presence｜讓 Discord 顯示你正在編輯的樂譜 ✨_

[English](README.md) | 中文

</div>

---

MuseScore Studio 的 Discord Rich Presence 整合工具。

此維護版本主要針對目前的 MuseScore Studio 4，並保留 MuseScore 2 / 3 的舊版外掛檔案以提供相容性。

已在 **Windows 上的 MuseScore Studio 4.7.5** 實際測試。

## 相容性

| MuseScore Studio | 狀態 |
| --- | --- |
| 4.7.x（包含 4.7.5） | ✅ 已支援並測試 |
| 4.0–4.6 | ⚠️ 預期可用，但不是主要測試目標 |
| MuseScore 3 | ✅ 保留舊版外掛 |
| MuseScore 2 | ✅ 保留舊版外掛 |

MuseScore 4 bridge 目前使用 MuseScore Studio 4.7.x 仍保留的舊版 `MuseScore 3.0` / `FileIO 3.0` 外掛 API。

## 安裝與使用

### MuseScore Studio 4.7.x

1. 安裝 Node.js。
2. 將 `src/plugin/CurrentScoreInfo-MS4.qml` 與 `src/plugin/current_score_info.png` 複製到 MuseScore 的外掛資料夾。
3. 開啟 MuseScore Studio，並在外掛管理器中啟用 **Current Score Info**。
4. 開啟一份樂譜。
5. 執行一次 **Current Score Info**，啟動樂譜資料 bridge。
6. Clone 此 repository，並執行 `npm install`。
7. 執行 `node src/rpc.js`。

MuseScore Studio **不需要以系統管理員身分執行**。

外掛會將樂譜資料寫入作業系統的暫存目錄：

```text
musescore-rich-presence.json
```

在 Windows 上通常位於：

```text
%TEMP%\musescore-rich-presence.json
```

`rpc.js` 會讀取此檔案，並每 5 秒更新一次 Discord Rich Presence。

### MuseScore 3

使用 `CurrentScoreInfo-MS3.qml`，接著執行 `npm install` 與 `node src/rpc.js`。

### MuseScore 2

使用 `CurrentScoreInfo-MS2.qml`，接著執行 `npm install` 與 `node src/rpc.js`。

## Discord 上會顯示的資訊

- 樂譜名稱
- 標題
- 副標題
- 作曲者
- 小節數
- 頁數
- Track 數量
- 編輯時間

MuseScore 執行期間，顯示的狀態資訊會自動輪替。

## MuseScore 4.7.x 版本更新

此維護版本包含以下相容性調整：

- 更新 MuseScore Studio 4.7.x 支援
- 已在 MuseScore Studio 4.7.5 實際測試
- 將樂譜資料輸出位置改至系統暫存目錄
- 不再依賴 MuseScore 安裝路徑的相對位置
- 將舊的 `find-process` / WMIC 程序偵測改為 Windows `tasklist.exe`
- 改善新版 Windows 的相容性
- 支援 UTF-8 樂譜 metadata
- MuseScore 3 與 MuseScore 4 使用不同的 Discord Rich Presence 圖示
- 更新 Discord Rich Presence Application 設定

## Windows 程序偵測

舊版本使用 `find-process`，其底層會依賴 WMIC。

新版 Windows 可能已不再預設提供 WMIC，因此會造成 MuseScore 程序偵測失敗。

此維護版本改用 Windows 內建的：

```text
tasklist.exe
```

來偵測正在執行的 MuseScore 程序與 PID。

## 樂譜資料 Bridge

MuseScore 4 外掛會將樂譜資訊寫入：

```text
%TEMP%\musescore-rich-presence.json
```

範例：

```json
{
  "scoreName": "Eternity in a Breath",
  "title": "Eternity in a Breath",
  "subtitle": "副标题",
  "composer": "作曲 / 编排",
  "nmeasures": 92,
  "npages": 1,
  "nstaves": 2,
  "ntracks": 8,
  "mscoreVersion": "4.7.5"
}
```

Node.js 程式會讀取此 JSON，並將對應的活動狀態傳送至 Discord。

## Discord Rich Presence 圖示

目前的 Rich Presence 設定支援 MuseScore 3 與 MuseScore 4 各自的圖片素材：

```text
musescore3-square
musescore3-circle
musescore4-square
musescore4-circle
```

## 注意事項

- Windows 是目前主要支援的平台。
- MuseScore 程序偵測使用 Windows 內建的 `tasklist.exe`。
- 不再需要 WMIC。
- MuseScore Studio 4.7.x 會限制外掛可寫入的檔案位置。
- 因此此維護版本改用系統暫存目錄，而不是依賴 MuseScore 安裝路徑。
- MuseScore 關閉時，Discord Activity 會被清除。
- 樂譜資料透過 `%TEMP%\musescore-rich-presence.json` 傳遞。
- 支援 UTF-8 metadata。
- MuseScore 4 外掛目前仍使用 MuseScore Studio 4.7.x 提供的舊版 `MuseScore 3.0` / `FileIO 3.0` 相容 API。
- 未來版本可能會遷移至 MuseScore 較新的 Extension API。

## 疑難排解

### Discord 顯示 `Waiting for score data`

先確認 bridge 檔案是否存在：

```powershell
Test-Path "$env:TEMP\musescore-rich-presence.json"
```

如果存在，可以使用 UTF-8 讀取內容：

```powershell
Get-Content "$env:TEMP\musescore-rich-presence.json" -Encoding UTF8
```

若檔案不存在：

1. 確認 `CurrentScoreInfo-MS4.qml` 已放入 MuseScore 外掛資料夾。
2. 在 MuseScore 啟用 **Current Score Info**。
3. 開啟一份樂譜。
4. 執行一次外掛。

### 無法偵測 MuseScore 程序

可使用：

```powershell
tasklist | findstr /I MuseScore
```

正常執行中的 MuseScore Studio 4 通常會顯示：

```text
MuseScore4.exe
```

### Discord Rich Presence 圖片顯示問號

請確認 Discord Rich Presence 的 Asset 名稱與 `rpc.js` 使用的 key 完全相同：

```text
musescore4-square
musescore4-circle
musescore3-square
musescore3-circle
```

也請確認 `rpc.js` 設定的 Discord Application ID，對應的是包含這些 Rich Presence Assets 的 Application。

## 範例

![](https://i.imgur.com/9jbFAto.png)  
![](https://i.imgur.com/jDGESp9.png)  
![](https://i.imgur.com/Z7xH5ku.png)  
![](https://i.imgur.com/7sWW6Rw.png)  
![](https://i.imgur.com/pJ2ACGV.png)  

![](https://i.imgur.com/4QCRN4D.png)  
![](https://i.imgur.com/bDRqdES.png)

## Credits and Trademark Notice

MuseScore 與 MuseScore Logo 為其各自權利人的商標。

本專案使用的 MuseScore icon 來源為 Wikimedia Commons，並依 GNU General Public License v2.0（GPL-2.0）授權。

本專案為非官方專案，與 MuseScore 無隸屬、合作或官方背書關係。

Icon source:  
https://commons.wikimedia.org/wiki/File:MuseScore_Icon.svg
