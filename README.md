<!-- markdownlint-disable MD033 MD041 -->

<p align="center">
  <img alt="MuseScore Rich Presence logo" src="src/plugin/current_score_info.png" width="220" />
</p>

<div align="center">

# MuseScore Rich Presence

_✨ Discord Rich Presence for MuseScore Studio｜Show what you're editing directly on Discord ✨_

English | [中文](README_zh.md)

</div>

---

Discord Rich Presence integration for MuseScore Studio.

This maintained version targets current MuseScore Studio 4 releases and keeps the legacy MuseScore 2/3 plugin files for older installations.

Tested with **MuseScore Studio 4.7.5 on Windows**.

## Compatibility

| MuseScore Studio | Status |
| --- | --- |
| 4.7.x (including 4.7.5) | ✅ Supported and tested |
| 4.0–4.6 | ⚠️ Expected to work, not the primary target |
| MuseScore 3 | ✅ Legacy plugin included |
| MuseScore 2 | ✅ Legacy plugin included |

The MuseScore 4 bridge uses the legacy `MuseScore 3.0` / `FileIO 3.0` plugin API that is still available in MuseScore Studio 4.7.x.

## Installation & Usage

### MuseScore Studio 4.7.x

1. Install Node.js.
2. Copy `src/plugin/CurrentScoreInfo-MS4.qml` and `src/plugin/current_score_info.png` to your MuseScore plugins folder.
3. Open MuseScore Studio and enable **Current Score Info** in the plugin manager.
4. Open a score.
5. Run **Current Score Info** once to start the score-data bridge.
6. Clone this repository and run `npm install`.
7. Run `node src/rpc.js`.

You do **not** need to run MuseScore Studio as administrator.

The plugin writes score metadata to the operating system temporary directory as:

```text
musescore-rich-presence.json
```

On Windows, this is normally located at:

```text
%TEMP%\musescore-rich-presence.json
```

`rpc.js` reads this file and updates Discord Rich Presence every 5 seconds.

### MuseScore 3

Use `CurrentScoreInfo-MS3.qml`, then run `npm install` and `node src/rpc.js`.

### MuseScore 2

Use `CurrentScoreInfo-MS2.qml`, then run `npm install` and `node src/rpc.js`.

## What is shown on Discord

- Score name
- Title
- Subtitle
- Composer
- Number of measures
- Number of pages
- Number of tracks
- Editing duration

The displayed state rotates automatically while MuseScore is running.

## MuseScore 4.7.x Changes

This maintained version includes several compatibility updates:

- Updated MuseScore Studio 4.7.x support
- Tested with MuseScore Studio 4.7.5
- Moved score-data output to the system temporary directory
- Removed dependency on MuseScore installation-relative paths
- Replaced `find-process` / WMIC process detection with Windows `tasklist.exe`
- Improved compatibility with newer Windows versions
- Added UTF-8 metadata support
- Added separate Discord Rich Presence assets for MuseScore 3 and MuseScore 4
- Updated Discord Rich Presence application configuration

## Windows Process Detection

Older versions of this project relied on `find-process`, which in turn depended on WMIC.

Modern Windows installations may no longer include WMIC by default, causing process detection to fail.

This maintained version now uses the built-in Windows command:

```text
tasklist.exe
```

to detect the running MuseScore process and PID.

## Score Data Bridge

The MuseScore 4 plugin writes score information to:

```text
%TEMP%\musescore-rich-presence.json
```

Example:

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

The Node.js process reads this JSON file and sends the corresponding activity information to Discord.

## Discord Rich Presence Assets

The current Rich Presence setup supports separate image assets for MuseScore 3 and MuseScore 4:

```text
musescore3-square
musescore3-circle
musescore4-square
musescore4-circle
```

## Notes

- Windows is the primary supported platform.
- MuseScore process detection uses the built-in Windows `tasklist.exe` command.
- WMIC is no longer required.
- MuseScore Studio 4.7.x restricts plugin file writes to approved locations.
- This maintained version therefore uses the system temporary directory instead of relying on the MuseScore installation path.
- If MuseScore is closed, the Discord activity is cleared.
- Score metadata is exchanged through `%TEMP%\musescore-rich-presence.json`.
- UTF-8 metadata is supported.
- The MuseScore 4 plugin currently uses the legacy `MuseScore 3.0` / `FileIO 3.0` compatibility API provided by MuseScore Studio 4.7.x.
- Future versions may migrate to MuseScore's newer Extension API.

## Troubleshooting

### Discord shows `Waiting for score data`

Check whether the bridge file exists:

```powershell
Test-Path "$env:TEMP\musescore-rich-presence.json"
```

If it exists, inspect it with UTF-8 decoding:

```powershell
Get-Content "$env:TEMP\musescore-rich-presence.json" -Encoding UTF8
```

If the file does not exist:

1. Make sure `CurrentScoreInfo-MS4.qml` is installed in the MuseScore plugins folder.
2. Enable **Current Score Info** in MuseScore.
3. Open a score.
4. Run the plugin once.

### MuseScore process is not detected

Check whether Windows can see the MuseScore process:

```powershell
tasklist | findstr /I MuseScore
```

A running MuseScore Studio 4 instance should normally appear as:

```text
MuseScore4.exe
```

### Discord Rich Presence image shows a question mark

Confirm that the Discord Rich Presence asset names match the keys used by `rpc.js`:

```text
musescore4-square
musescore4-circle
musescore3-square
musescore3-circle
```

Also confirm that the configured Discord Application ID matches the application containing those Rich Presence assets.

## Examples

![](https://i.imgur.com/9jbFAto.png)  
![](https://i.imgur.com/jDGESp9.png)  
![](https://i.imgur.com/Z7xH5ku.png)  
![](https://i.imgur.com/7sWW6Rw.png)  
![](https://i.imgur.com/pJ2ACGV.png)  

![](https://i.imgur.com/4QCRN4D.png)  
![](https://i.imgur.com/bDRqdES.png)

## Credits and Trademark Notice

MuseScore and the MuseScore logo are trademarks of their respective owners.

The MuseScore icon used by this project is sourced from Wikimedia Commons and is licensed under the GNU General Public License v2.0 (GPL-2.0).

This project is unofficial and is not affiliated with or endorsed by MuseScore.

Icon source:  
https://commons.wikimedia.org/wiki/File:MuseScore_Icon.svg
