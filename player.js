function getFreq(freq) {
    return Tone.Frequency("C4").harmonize([16 - freq])[0];
}

function getNotes() {
    const notes = [];
    const displayWindowX = document.querySelector(".display").getBoundingClientRect().left;
    const speed = document.getElementById("speed").value;

    const noteElements = document.querySelectorAll(".note");
    noteElements.forEach(note => {
        if (note.classList.contains("shadow-note")) return;
        const dur = note.clientWidth / speed;
        const start = (note.getBoundingClientRect().left - displayWindowX) / speed;
        const freq = getFreq(Number(note.attributes.getNamedItem("data-freq").value));
        notes.push({ dur, start, freq: freq });
    });

    return notes;
}

const activeSynth = [];
let playTimeout;

function playNotes() {
    const playIcon = document.getElementById("play");

    if (playIcon.getAttribute("src") == "./stop.svg") {
        activeSynth.forEach(synth => synth.disconnect());
        playIcon.setAttribute("src", "./play.svg");
        clearTimeout(playTimeout);
        return;
    }

    playIcon.setAttribute("src", "./stop.svg");
    activeSynth.forEach(synth => synth.disconnect());
    let end = 0;

    const volume = document.getElementById("volume").value;
    const notes = getNotes();
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
        playIcon.setAttribute("src", "./play.svg");
    }, end * 1000);
}