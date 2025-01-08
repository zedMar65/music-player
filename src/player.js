function getFreq(freq) {
    return Tone.Frequency("C4").harmonize([16 - freq])[0];
}

function parseNotes(notes) {
    const speed = document.getElementById("speed").value;
    return notes.map(note => {
        const dur = note.dur / speed;
        const start = note.start / speed;
        const freq = getFreq(note.freq);
        return { dur, start, freq };
    })
}

const activeSynth = [];
let playTimeout;

function playNotes() {
    const playIcon = document.getElementById("play");

    if (playIcon.getAttribute("src") == "img/stop.svg") {
        activeSynth.forEach(synth => synth.disconnect());
        playIcon.setAttribute("src", "img/play.svg");
        clearTimeout(playTimeout);
        return;
    }

    playIcon.setAttribute("src", "img/stop.svg");
    let end = 0;

    const volume = document.getElementById("volume").value;
    const notes = parseNotes(getNotes());
    const now = Tone.now();

    notes.forEach(note => {
        const synth = new Tone.Synth({ volume }).toDestination();
        synth.triggerAttackRelease(note.freq, note.dur, now + note.start);
        activeSynth.push(synth);

        if (note.start + note.dur > end) {
            end = note.start + note.dur;
        }
    });

    playTimeout = setTimeout(() => {
        playIcon.setAttribute("src", "img/play.svg");
    }, end * 1000);
}