let speed = 400;

function getFreq(freq) {
    return Tone.Frequency("C4").harmonize([freq - 1])[0];
}

function getNotes() {
    const notes = [];
    const displayWindowX = document.querySelector(".display").getBoundingClientRect().left;

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

function playNotes() {
    activeSynth.forEach(synth => synth.disconnect());
    const volume = document.getElementById("volume").value;
    const notes = getNotes();
    notes.forEach(note => {
        const synth = new Tone.Synth({ volume }).toDestination();
        const now = Tone.now();
        synth.triggerAttackRelease(note.freq, note.dur, now + note.start);
        activeSynth.push(synth);
    });
}