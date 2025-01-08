let notes = [
    { start: 0, dur: 200, freq: 8 },
    { start: 100, dur: 200, freq: 7 },
    { start: 200, dur: 200, freq: 6 },
    { start: 300, dur: 200, freq: 5 },
    { start: 400, dur: 200, freq: 4 },
    { start: 500, dur: 200, freq: 3 },
    { start: 600, dur: 200, freq: 2 },
    { start: 700, dur: 200, freq: 1 },
]

let mouseX = 0;
let mouseY = 0;

const scrollContainer = document.querySelector(".scroll");
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
    noteElement.setAttribute("data-freq", note.freq);

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
let noteWidth = 100;

// Dragging
let rawOffsetX = 0;
let rawOffsetY = 0;

let offsetX = 0;
let offsetY = 0;

// Resizing
let rawResizeRightOffset = 0;
let rawResizeLeftOffset = 0;
let rawRightAnchor = 0;

let resizeRightOffset = 0;
let resizeLeftOffset = 0;
let rightAnchor = 0;

let dragging = false;
let resizingLeft = false;
let resizingRight = false;

let resizedNote = null;

function recalculateOffsets() { // Fixes the offsets when the window position changes
    const displayRect = displayWindow.getBoundingClientRect();
    const displayX = displayRect.left;
    const displayY = displayRect.top;

    offsetX = rawOffsetX - displayX;
    offsetY = rawOffsetY - displayY;

    resizeRightOffset = rawResizeRightOffset - displayX;
    resizeLeftOffset = rawResizeLeftOffset - displayX;

    rightAnchor = rawRightAnchor;

    callMoveFunctions();
}

scrollContainer.addEventListener("scroll", recalculateOffsets);

function calculateNotePosition() {
    const displayRect = displayWindow.getBoundingClientRect();
    const displayX = displayRect.left;
    const displayY = displayRect.top;

    const lineHeight = displayWindow.clientHeight / lineCount;
    const windowWidth = displayWindow.clientWidth;

    const currentLine = Math.floor((mouseY - displayY) / lineHeight);
    if (currentLine < 0 || currentLine >= lineCount || mouseX < displayX || mouseX > displayX + windowWidth) {
        return false;
    }
    const leftValue = Math.min(Math.max(0, mouseX + offsetX), windowWidth - noteWidth);

    return {left: leftValue, freq: currentLine + 1};
}

function startDragging(note) {
    const displayRect = displayWindow.getBoundingClientRect();
    const displayX = displayRect.left;
    const displayY = displayRect.top;

    const noteRect = note.getBoundingClientRect();
    const noteX = noteRect.left;
    const noteY = noteRect.top;
    noteWidth = noteRect.width;
    const noteHeight = noteRect.height;

    rawOffsetX = noteX - mouseX;
    rawOffsetY = noteY - mouseY;

    recalculateOffsets();

    draggedNote.style.width = `${noteWidth}px`;
    draggedNote.style.height = `${noteHeight}px`;

    dragNote();

    draggedNote.style.display = "block";
    shadowNote.style.width = `${noteWidth}px`;
    shadowNote.style.display = "block";

    note.remove();

    dragging = true;
}

function startResizingLeft(note) {
    const displayRect = displayWindow.getBoundingClientRect();
    const displayX = displayRect.left;

    const noteRect = note.getBoundingClientRect();
    const noteX = noteRect.left;
    noteWidth = noteRect.width;

    rawResizeLeftOffset = noteX - mouseX;
    rawRightAnchor = noteX + noteWidth - displayX;

    recalculateOffsets();

    resizedNote = note;
    resizingLeft = true;
}

function startResizingRight(note) {
    const displayRect = displayWindow.getBoundingClientRect();
    const displayX = displayRect.left;

    const noteRect = note.getBoundingClientRect();
    noteWidth = noteRect.width;

    rawResizeRightOffset = noteWidth - mouseX + displayX;

    recalculateOffsets();

    resizedNote = note;
    resizingRight = true;
}

function stopDragging() {
    if (dragging) {
        const position = calculateNotePosition();

        if (position) {
            displayNote({
                start: position.left,
                dur: noteWidth,
                freq: position.freq
            });
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

function dragNote() {
    draggedNote.style.left = `${mouseX + offsetX}px`;
    draggedNote.style.top = `${mouseY + offsetY}px`;

    const position = calculateNotePosition();

    if (position) {
        shadowNote.style.display = "block";
        lines[position.freq - 1].appendChild(shadowNote);
        shadowNote.style.left = `${position.left}px`;
    } else {
        shadowNote.style.display = "none";
    }    
}

function resizeLeft() {
    const maxNoteWidth = rightAnchor;

    const width = Math.max(minNoteWidth, Math.min(maxNoteWidth, rightAnchor - mouseX - resizeLeftOffset));

    resizedNote.style.width = `${width}px`;
    resizedNote.style.left = `${rightAnchor - width}px`;
}

function resizeRight() {
    const displayRect = displayWindow.getBoundingClientRect();
    const displayEndX = displayRect.right;

    const maxNoteWidth = displayEndX - resizedNote.getBoundingClientRect().left;

    const width = Math.max(minNoteWidth, Math.min(maxNoteWidth, mouseX + resizeRightOffset));

    resizedNote.style.width = `${width}px`;
}

function callMoveFunctions() {
    if (dragging) {
        dragNote();
    }

    if (resizingLeft) {
        resizeLeft();
    }

    if (resizingRight) {
        resizeRight();
    }
}

function mouseDown(event) {
    event.preventDefault();

    const target = event.target;

    if (target.classList.contains("note")) {
        startDragging(target);
    }

    if (target.classList.contains("resize-left")) {
        startResizingLeft(target.parentElement);
    }

    if (target.classList.contains("resize-right")) {
        startResizingRight(target.parentElement);
    }
}

function mouseUp(event) {
    event.preventDefault();

    stopDragging();
    stopResizingLeft();
    stopResizingRight();
    noteWidth = 100;
}

function onMouseMove(event) {
    event.preventDefault();

    mouseX = event.clientX;
    mouseY = event.clientY;

    callMoveFunctions();
}

function onClick(event) {
    event.preventDefault();

    if (event.target.classList.contains("line") && event.target.parentElement.classList.contains("display")) {
        rawOffsetX = 0;
        rawOffsetY = 0;

        recalculateOffsets();

        const position = calculateNotePosition();

        if (position) {
            displayNote({
                start: position.left,
                dur: 100,
                freq: position.freq
            });
        }
    }
}

displayWindow.addEventListener("mouseup", mouseUp);
displayWindow.addEventListener("mousemove", onMouseMove);
displayWindow.addEventListener("click", onClick);

displayNotes(notes);