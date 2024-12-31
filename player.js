const pxpersecond = 100;

const sounds = [];

let test_notes = [
    { start: 0, dur: 200, freq: 8 },
    { start: 100, dur: 200, freq: 7 },
    { start: 200, dur: 200, freq: 6 },
    { start: 300, dur: 200, freq: 5 },
    { start: 400, dur: 200, freq: 4 },
    { start: 500, dur: 200, freq: 3 },
    { start: 600, dur: 200, freq: 2 },
    { start: 700, dur: 200, freq: 1 },
]


for (let i = 2; i < 13; i++) {
    const sound = T("sin", { freq: i * 100, mul: 0 });
    sound.play();
    sounds.push(sound);
}

function getNotes() {
    const notes = [];
    const displayWindowX = document.querySelector(".display").getBoundingClientRect().left;

    const noteElements = document.querySelectorAll(".note");
    noteElements.forEach(note => {
        if (note.classList.contains("shadow-note")) return;
        const start = note.getBoundingClientRect().left - displayWindowX;
        const freq = note.attributes.getNamedItem("data-freq").value;
        notes.push({ dur: note.clientWidth, start: start, freq: Number(freq) });
    });

    return notes;
}

function playNote(note) {
    setTimeout(() => {
        sounds[note.freq - 1].set({ mul: 0.1 });
        setTimeout(() => sounds[note.freq - 1].pause(), note.dur * 1000 / pxpersecond);
    }, note.start * 1000 / pxpersecond);
}

function playNotes() {
    const notes = getNotes();
    // const notes = test_notes;
    notes.forEach(note => playNote(note));
}