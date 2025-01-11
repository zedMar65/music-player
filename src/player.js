const frequencyHz = [
    65.41, 69.3, 73.42, 77.78, 82.41, 87.31, 92.5, 98, 103.83, 110, 116.54, 123.47,
    130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185, 196, 207.65, 220, 233.08, 246.94,
    261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392, 415.3, 440, 466.16, 493.88,
    523.25, 554.37, 587.33, 622.25, 659.26, 698.46, 739.99, 783.99, 830.61, 880, 932.33, 987.77,
    1046.5, 1108.73, 1174.66, 1244.51, 1318.51, 1396.91, 1479.98, 1567.98, 1661.22, 1760, 1864.66, 1975.53,
];

function getFreq(note, octave) {
    return frequencyHz[note - 1 + 12 * (octave - 1)];
}

function parseNotes(notes) {
    const speed = document.getElementById("speed").value;
    const octave = document.getElementById("octave").value;
    return notes.map(note => {
        const dur = note.dur / speed;
        const start = note.start / speed;
        const freq = getFreq(14 - note.freq, octave);
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