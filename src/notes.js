let hiddenNotes = [];

function getDisplayedNotes() {
    const notes = [];
    const displayWindowX = document.querySelector(".display").getBoundingClientRect().left;

    const noteElements = document.querySelectorAll(".note");
    noteElements.forEach(note => {
        if (note.classList.contains("shadow-note")) return;
        const dur = note.clientWidth / +speedInput.value;
        const start = (note.getBoundingClientRect().left - displayWindowX) / +speedInput.value;
        const octave = +note.attributes.getNamedItem("data-octave").value;
        const freq = getFreq(lineCount + 1 - +note.attributes.getNamedItem("data-freq").value, octave);
        notes.push({ dur, start, freq });
    });

    return notes;
}

function getNotes() {
    return [...hiddenNotes, ...getDisplayedNotes()];
}

function exportNotes() {
    const data = { notes: getNotes(), speed: +speedInput.value };
    navigator.clipboard.writeText(JSON.stringify(data));
}

function displayOctave() {
    const notes = getNotes();
    clearNotes();
    hiddenNotes = [];

    notes.forEach(note => {
        const freq = lineCount - (frequencyHz.indexOf(note.freq) - 12 * (+octaveInput.value - 2));
        if (freq > 0 && freq <= lineCount) {
            const start = note.start * +speedInput.value;
            const dur = note.dur * +speedInput.value;
            displayNote({ freq, start, dur });
        } else {
            hiddenNotes.push(note);
        }
    });
}

octaveInput.onchange = () => displayOctave();

async function importNotes() {
    try {
        const text = await navigator.clipboard.readText();
        const data = JSON.parse(text);
        document.getElementById("speed").value = data.speed;
        document.getElementById("speed").nextElementSibling.innerHTML = `Greitis (${data.speed})`;
        clearNotes();
        hiddenNotes = data.notes;
        displayOctave();
    } catch (e) {
        console.log("failed to import data: ", e);
    }
}