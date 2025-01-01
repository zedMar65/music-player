let notes = [
    {start:   0, dur: 200, freq: 8},
    {start: 100, dur: 200, freq: 7},
    {start: 200, dur: 200, freq: 6},
    {start: 300, dur: 200, freq: 5},
    {start: 400, dur: 200, freq: 4},
    {start: 500, dur: 200, freq: 3},
    {start: 600, dur: 200, freq: 2},
    {start: 700, dur: 200, freq: 1},
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
shadowNote.classList.add("note-position");
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
    noteElement.classList.add("note-position");
    noteElement.style.left = `${note.start}px`;
    noteElement.style.width = `${note.dur}px`;

    let resizeLeft = document.createElement("div");
    resizeLeft.classList.add("resize-left");
    noteElement.appendChild(resizeLeft);

    let resizeRight = document.createElement("div");
    resizeRight.classList.add("resize-right");
    noteElement.appendChild(resizeRight);

    noteElement.addEventListener("mousedown", mouseDown);

    lines[note.freq - 1].appendChild(noteElement);
}

const minNoteWidth = 30;

let offsetX = 0; // used for dragging
let offsetY = 0; // used for dragging

let resizeOffset = 0; // used for resizing
let rightAnchor = 0; // used for resizing

let dragging = false;
let resizingLeft = false;
let resizingRight = false;

let resizedNote = null;

function startDragging(note, mouseX, mouseY) {
    const displayRect = displayWindow.getBoundingClientRect();
    const displayX = displayRect.left;
    const displayY = displayRect.top;

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

function startResizingLeft(note, mouseX, mouseY) {
    const displayRect = displayWindow.getBoundingClientRect();
    const displayX = displayRect.left;

    const noteRect = note.getBoundingClientRect();
    const noteX = noteRect.left - displayX;
    const noteWidth = noteRect.width;

    resizeOffset = mouseX - noteX;
    rightAnchor = noteX + noteWidth;

    resizedNote = note;
    resizingLeft = true;
}

function startResizingRight(note, mouseX, mouseY) {
    const displayRect = displayWindow.getBoundingClientRect();
    const displayX = displayRect.left;

    const noteRect = note.getBoundingClientRect();
    const noteX = noteRect.left - displayX;
    const noteWidth = noteRect.width;

    resizeOffset = noteWidth - mouseX;

    resizedNote = note;
    resizingRight = true;
}

function mouseDown(event) {
    event.preventDefault();

    let mouseX = event.clientX;
    let mouseY = event.clientY;

    const target = event.target;

    if (target.classList.contains("note")) {
        startDragging(target, mouseX, mouseY);
    }

    if (target.classList.contains("resize-left")) {
        startResizingLeft(target.parentElement, mouseX, mouseY);
    }

    if (target.classList.contains("resize-right")) {
        startResizingRight(target.parentElement, mouseX, mouseY);
    }
}

function stopDragging(event) {
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
            const leftValue = Math.min(Math.max(0, mouseX + offsetX), windowWidth - shadowNote.clientWidth);
            displayNote({start: leftValue, dur: draggedNote.clientWidth, freq: currentLine + 1});
        }
    }

    draggedNote.style.display = "none";
    shadowNote.style.display = "none";

    dragging = false;
}

function stopResizingLeft() {
    resizingLeft = false;
    resizedNote = null;
}

function stopResizingRight() {
    resizingRight = false;
    resizedNote = null;
}

function mouseUp(event) {
    event.preventDefault();

    stopDragging(event);
    stopResizingLeft();
    stopResizingRight();
}

function dragNote(mouseX, mouseY) {
    draggedNote.style.left = `${mouseX+offsetX}px`;
    draggedNote.style.top = `${mouseY+offsetY}px`;

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

function resizeLeft(mouseX, mouseY) {
    const maxNoteWidth = rightAnchor;

    const width = Math.max(minNoteWidth, Math.min(maxNoteWidth, rightAnchor - mouseX + resizeOffset));

    resizedNote.style.width = `${width}px`;
    resizedNote.style.left = `${rightAnchor - width}px`;
}

function resizeRight(mouseX, mouseY) {
    const displayRect = displayWindow.getBoundingClientRect();
    const displayEndX = displayRect.right;

    const maxNoteWidth = displayEndX - resizedNote.getBoundingClientRect().left;

    const width = Math.max(minNoteWidth, Math.min(maxNoteWidth, mouseX + resizeOffset));
    
    resizedNote.style.width = `${width}px`;
}

function onMouseMove(event) {
    event.preventDefault();

    let mouseX = event.clientX;
    let mouseY = event.clientY;

    if (dragging) {
        dragNote(mouseX, mouseY);
    }

    if (resizingLeft) {
        resizeLeft(mouseX, mouseY);
    }

    if (resizingRight) {
        resizeRight(mouseX, mouseY);
    }
}

window.addEventListener("mouseup", mouseUp);
window.addEventListener("mousemove", onMouseMove);

displayNotes(notes);