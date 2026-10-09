# MuseScore Rich Presence

Discord Rich Presence integration for MuseScore Studio.

This maintained version targets current MuseScore Studio 4 releases and keeps the legacy MuseScore 2/3 plugin files for older installations.

## Compatibility

| MuseScore Studio | Status |
| --- | --- |
| 4.7.x (including 4.7.5) | ✅ Supported target |
| 4.0–4.6 | ⚠️ Expected to work, not the primary target |
| MuseScore 3 | ✅ Legacy plugin included |
| MuseScore 2 | ✅ Legacy plugin included |

The MuseScore 4 bridge uses the legacy `MuseScore 3.0` / `FileIO 3.0` plugin API that is still available in MuseScore Studio 4.7.x.

## Installation & Usage

### MuseScore Studio 4.7.x

1. Install Node.js.
2. Copy `src/plugin/CurrentScoreInfo-MS4.qml` and `src/plugin/current_score_info.png` to your MuseScore plugins folder.
3. Open MuseScore Studio and enable **Current Score Info** in the plugin manager.
4. Run **Current Score Info** once to start the score-data bridge.
5. Clone this repository and run `npm install`.
6. Run `node src/rpc.js`.

You do **not** need to run MuseScore Studio as administrator.

The plugin writes its bridge data to the operating system temporary directory as `musescore-rich-presence.json`. `rpc.js` reads only fresh bridge data, so stale score information is ignored automatically.

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

## Notes

- Windows is the primary supported platform for the current Node.js process-detection logic.
- MuseScore Studio 4.7.x restricts plugin file writes to approved locations. This fork therefore uses the system temporary directory instead of relying on the MuseScore installation path.
- If MuseScore is closed, the Discord activity is cleared.
- If the score-data file stops updating, it is treated as stale after 10 seconds.

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
