let notes = [
    {start: 0, dur: 2, freq: 1},
    {start: 1, dur: 3, freq: 2},
]

const displayWindow = document.querySelector(".display-window");
const lines = document.querySelectorAll(".line");

function DisplayNotes(noteList) {
    noteList.forEach(note => {
        DisplayNote(note);
    });
}

function DisplayNote(note) {
    let noteElement = document.createElement("div");
    noteElement.classList.add("note");
    noteElement.style.left = `${note.start * 100}px`;
    noteElement.style.width = `${note.dur * 100}px`;
    lines[note.freq - 1].appendChild(noteElement);
}

DisplayNotes(notes);