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
    const currentLine = document.getElementById("current-line");

    if (playIcon.getAttribute("src") == "img/stop.svg") {
        activeSynth.forEach(synth => synth.disconnect());
        playIcon.setAttribute("src", "img/play.svg");
        currentLine.style.display = "none";
        currentLine.style.left = 0;
        clearTimeout(playTimeout);
        return;
    }

    playIcon.setAttribute("src", "img/stop.svg");
    currentLine.style.display = "block";
    let end = 0;

    const volume = document.getElementById("volume").value;
    const speed = document.getElementById("speed").value;
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

    currentLine.style.transitionDuration = end + "s";
    currentLine.style.left = end * speed + "px";

    playTimeout = setTimeout(() => {
        playIcon.setAttribute("src", "img/play.svg");
        currentLine.style.display = "none";
        currentLine.style.left = 0;
    }, end * 1000);
}