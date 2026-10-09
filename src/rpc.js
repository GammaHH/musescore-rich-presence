const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);
const path = require("path");
const fs = require("fs");
const os = require("os");

const { Client } = require("discord-rpc");
const client = new Client({ transport: "ipc" });

const SCORE_INFO_PATH = path.join(os.tmpdir(), "musescore-rich-presence.json");

let start = new Date();
let lastfile = "";
let stateindex = -1;

async function findMuseScoreProcess() {
    const { stdout } = await execFileAsync(
        "tasklist.exe",
        ["/FO", "CSV", "/NH"],
        {
            windowsHide: true,
            maxBuffer: 1024 * 1024
        }
    );

    const lines = stdout.split(/\r?\n/);

    for (const line of lines) {
        const match = line.match(/^"([^"]+)","(\d+)"/);

        if (!match) {
            continue;
        }

        const name = match[1];
        const pid = Number(match[2]);

        if (
            /^MuseScore(?:\d+)?\.exe$/i.test(name) ||
            /^MuseScore.*\.exe$/i.test(name)
        ) {
            return {
                name,
                pid
            };
        }
    }

    return null;
}

function readScoreInfo() {
    if (!fs.existsSync(SCORE_INFO_PATH)) {
        return null;
    }

    try {

        const score = JSON.parse(fs.readFileSync(SCORE_INFO_PATH, "utf8"));
        if (!score || Object.keys(score).length === 0) {
            return null;
        }
        return score;
    } catch (error) {
        console.log("X Unable to read MuseScore Rich Presence data:", error.message);
        return null;
    }
}

function getAppPresentation(app) {
    let largeImageKey = "musescore-square";
    let smallImageKey = "musescore-circle";
    let appTitle = "MuseScore";

    if (/MuseScore3\\.exe/i.test(app.name)) {
        largeImageKey = "musescore3-square";
        smallImageKey = "musescore3-circle";
        appTitle = "MuseScore 3";
    } else if (/MuseScore4\\.exe/i.test(app.name)) {
        largeImageKey = "musescore4-square";
        smallImageKey = "musescore4-circle";
        appTitle = "MuseScore Studio 4";
    }

    return { largeImageKey, smallImageKey, appTitle };
}

async function update() {
    try {
        const app = await findMuseScoreProcess();

        if (!app) {
            lastfile = "";
            stateindex = -1;
            start = new Date();
            try {
                client.clearActivity();
            } catch (error) {
                // Discord may already have cleared it.
            }
            return;
        }

        const sheet = readScoreInfo();
        const { largeImageKey, smallImageKey, appTitle } = getAppPresentation(app);

        if (sheet) {
            const scoreName = sheet.scoreName || "Untitled";
            if (scoreName !== lastfile) {
                start = new Date();
                lastfile = scoreName;
                stateindex = -1;
            }

            const states = [];
            if (sheet.title) states.push(`Title: ${sheet.title}`);
            if (sheet.subtitle) states.push(`Subtitle: ${sheet.subtitle}`);
            if (sheet.composer) states.push(`Composer: ${sheet.composer}`);
            states.push(`Contains ${sheet.nmeasures || 0} Measures`);
            states.push(`Contains ${sheet.npages || 0} Pages`);
            states.push(`Contains ${sheet.ntracks || 0} Tracks`);

            stateindex = (stateindex + 1) % states.length;

            client.setActivity({
                details: `Editing ${scoreName}`,
                state: states[stateindex],
                startTimestamp: start,
                largeImageKey,
                smallImageKey,
                largeImageText: appTitle,
                smallImageText: `Contains ${sheet.nmeasures || 0} Measures`
            }, app.pid);
            return;
        }

        client.setActivity({
            details: "MuseScore",
            state: "Waiting for score data",
            startTimestamp: start,
            largeImageKey,
            smallImageKey,
            largeImageText: appTitle,
            smallImageText: "Composing"
        }, app.pid);
    } catch (error) {
        console.error("X Rich Presence update failed:", error);
    }
}

client.on("ready", () => {
    console.log("[OK] Online and ready to rock!");
    console.log(`[OK] Reading score data from ${SCORE_INFO_PATH}`);
    update();
    setInterval(update, 5000);
});

console.log("Connecting...");
client.login({ clientId: "1558054747397824562" });

process.on("unhandledRejection", console.error);
