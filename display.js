let notes = [
    { start: 0, dur: 2, freq: 8 },
    { start: 1, dur: 2, freq: 7 },
    { start: 2, dur: 2, freq: 6 },
    { start: 3, dur: 2, freq: 5 },
    { start: 4, dur: 2, freq: 4 },
    { start: 5, dur: 2, freq: 3 },
    { start: 6, dur: 2, freq: 2 },
    { start: 7, dur: 2, freq: 1 },
]

const displayWindow = document.querySelector(".display");
const draggedNote = document.querySelector(".drag-note");
let lines = [];

const lineCount = 16;

displayWindow.style.gridTemplateRows = `repeat(${lineCount}, 1fr)`;

for (let i = 0; i < lineCount; i++) {
    let line = document.createElement("div");
    line.classList.add("line");
    displayWindow.appendChild(line);
    lines.push(line);
}

let shadowNote = document.createElement("div");
shadowNote.classList.add("note");
shadowNote.classList.add("shadow-note");
shadowNote.style.display = "none";

function displayNotes(noteList) {
    noteList.forEach(note => {
        displayNote(note);
    });
}

function displayNote(note) {
    let noteElement = document.createElement("div");
    noteElement.classList.add("note");
    noteElement.style.left = `${note.start * 100}px`;
    noteElement.style.width = `${note.dur * 100}px`;
    noteElement.setAttribute("data-freq", note.freq);

    noteElement.addEventListener("mousedown", mouseDown);

    lines[note.freq - 1].appendChild(noteElement);
}

let offsetX = 0;
let offsetY = 0;

let dragging = false;

function mouseDown(event) {
    event.preventDefault();

    let mouseX = event.clientX;
    let mouseY = event.clientY;

    const displayRect = displayWindow.getBoundingClientRect();
    const displayX = displayRect.left;
    const displayY = displayRect.top;

    const note = event.target;
    const noteRect = note.getBoundingClientRect();
    const noteX = noteRect.left - displayX;
    const noteY = noteRect.top - displayY;
    const noteWidth = noteRect.width;
    const noteHeight = noteRect.height;

    offsetX = noteX - mouseX;
    offsetY = noteY - mouseY;

    draggedNote.style.width = `${noteWidth}px`;
    draggedNote.style.height = `${noteHeight}px`;

    dragNote(mouseX, mouseY);

    draggedNote.style.display = "block";
    shadowNote.style.width = `${noteWidth}px`;
    shadowNote.style.display = "block";

    note.remove();

    dragging = true;
}

function mouseUp(event) {
    event.preventDefault();

    if (dragging) {
        let mouseX = event.clientX;
        let mouseY = event.clientY;

        const displayRect = displayWindow.getBoundingClientRect();
        const displayX = displayRect.left;
        const displayY = displayRect.top;

        const lineHeight = displayWindow.clientHeight / lineCount;
        const windowWidth = displayWindow.clientWidth;

        const currentLine = Math.floor((mouseY - displayWindow.getBoundingClientRect().top) / lineHeight);
        if (currentLine < 0 || currentLine >= lineCount || mouseX < displayX || mouseX > displayX + windowWidth) {
            // crazy
        } else {
            const note = document.createElement("div");
            note.classList.add("note");
            const leftValue = Math.min(Math.max(0, mouseX + offsetX), windowWidth - shadowNote.clientWidth);
            note.style.left = `${leftValue}px`;
            note.style.width = `${draggedNote.clientWidth}px`;
            note.setAttribute("data-freq", currentLine + 1);

            note.addEventListener("mousedown", mouseDown);
            lines[currentLine].appendChild(note);
        }
    }

    draggedNote.style.display = "none";
    shadowNote.style.display = "none";

    dragging = false;
}

function dragNote(mouseX, mouseY) {
    draggedNote.style.left = `${mouseX + offsetX}px`;
    draggedNote.style.top = `${mouseY + offsetY}px`;

    const displayRect = displayWindow.getBoundingClientRect();
    const displayX = displayRect.left;
    const displayY = displayRect.top;

    const lineHeight = displayWindow.clientHeight / lineCount;
    const windowWidth = displayWindow.clientWidth;

    const currentLine = Math.floor((mouseY - displayWindow.getBoundingClientRect().top) / lineHeight);
    if (currentLine < 0 || currentLine >= lineCount || mouseX < displayX || mouseX > displayX + windowWidth) {
        shadowNote.style.display = "none";
        return;
    }
    shadowNote.style.display = "block";
    lines[currentLine].appendChild(shadowNote);
    const leftValue = Math.min(Math.max(0, mouseX + offsetX), windowWidth - shadowNote.clientWidth);
    shadowNote.style.left = `${leftValue}px`;
}

function onMouseMove(event) {
    event.preventDefault();

    let mouseX = event.clientX;
    let mouseY = event.clientY;

    if (dragging) {
        dragNote(mouseX, mouseY);
    }
}

window.addEventListener("mouseup", mouseUp);
window.addEventListener("mousemove", onMouseMove);

displayNotes(notes);