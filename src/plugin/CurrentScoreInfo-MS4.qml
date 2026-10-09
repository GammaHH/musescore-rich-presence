import QtQuick 2.2
import MuseScore 3.0
import FileIO 3.0

MuseScore {
    version: "1.1.1"
    title: "Current Score Info"
    description: qsTr("Outputs the current score information for Discord Rich Presence.")
    categoryCode: "current-score-info"
    thumbnailName: "current_score_info.png"
    requiresScore: false

    FileIO {
        id: outfile
        onError: console.log("[RichPresence] FileIO error: " + msg)
    }

    Timer {
        id: csitimer
        interval: 1000
        repeat: true
        running: false
        onTriggered: makeScoreInfo()
    }

    onRun: {
        outfile.source = outfile.tempPath() + "/musescore-rich-presence.json";

        console.log("[RichPresence] Plugin started");
        console.log("[RichPresence] Output: " + outfile.source);

        var probe = outfile.write('{"probe":true}');
        console.log("[RichPresence] Probe write: " + probe);

        makeScoreInfo();
        csitimer.start();
    }

    function makeScoreInfo() {
        outfile.source = outfile.tempPath() + "/musescore-rich-presence.json";

        if (curScore === null) {
            outfile.write("{}");
            return;
        }

        var score = {
            scoreName: String(curScore.scoreName || ""),
            title: String(curScore.title || ""),
            subtitle: String(curScore.metaTag("subtitle") || ""),
            composer: String(curScore.composer || ""),
            nmeasures: Number(curScore.nmeasures || 0),
            npages: Number(curScore.npages || 0),
            nstaves: Number(curScore.nstaves || 0),
            ntracks: Number(curScore.ntracks || 0),
            mscoreVersion: String(curScore.mscoreVersion || "")
        };

        outfile.write(JSON.stringify(score, null, 2));
    }
}