function getNotes() {
    const notes = [];
    const displayWindowX = document.querySelector(".display").getBoundingClientRect().left;

    const noteElements = document.querySelectorAll(".note");
    noteElements.forEach(note => {
        if (note.classList.contains("shadow-note")) return;
        const dur = note.clientWidth;
        const start = note.getBoundingClientRect().left - displayWindowX;
        const freq = Number(note.attributes.getNamedItem("data-freq").value);
        notes.push({ dur, start, freq });
    });

    return notes;
}

function exportNotes() {
    const volume = document.getElementById("volume").value;
    const speed = document.getElementById("speed").value;
    const data = { notes: getNotes(), volume, speed };
    navigator.clipboard.writeText(JSON.stringify(data));
}

async function importNotes() {
    try {
        const text = await navigator.clipboard.readText();
        const data = JSON.parse(text);
        document.getElementById("volume").value = data.volume;
        document.getElementById("speed").value = data.speed;
        // note display to do
    } catch (e) {
        console.log("failed to import data: ", e);
    }
}