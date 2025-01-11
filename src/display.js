let notes = [];

let mouseX = 0;
let mouseY = 0;

const scrollContainer = document.querySelector(".scroll");
const displayWindow = document.querySelector(".display");
const verticalLineContainer = document.querySelector(".vertical-lines");
const draggedNote = document.querySelector(".drag-note");
let lines = [];

const lineCount = 13;

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

function clearNotes() {
    document.querySelectorAll(".note").forEach(note => {
        note.remove();
    });
}

function displayNotes(noteList) {
    noteList.forEach(note => {
        displayNote(note);
    });
    resizeDisplay();
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
    noteElement.addEventListener("contextmenu", deleteNote);

    lines[note.freq - 1].appendChild(noteElement);

    resizeDisplay();
}

function deleteNote(event) {
    event.preventDefault();
    event.stopPropagation();

    let note = event.target;

    if (note.classList.contains("resize-left") || note.classList.contains("resize-right")) {
        note = note.parentElement;
    }

    if (!note.classList.contains("note")) {
        return;
    }

    note.remove();
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
let displayingPlacePositionShadow = false;

let resizedNote = null;

const minimumWindowWidth = 2100;
const rightClearance = 600;
let currentWindowWidth = minimumWindowWidth;

function drawVerticalLines(n) {
    verticalLineContainer.innerHTML = "";

    for (let i = 0; i < n; i++) {
        let line = document.createElement("div");
        line.classList.add("line");
        line.style.left = `${i * 100}px`;
        verticalLineContainer.appendChild(line);
    }
}

function resizeDisplay() {
    let displayWidth = 0;

    const noteElements = document.querySelectorAll(".note");
    const displayX = displayWindow.getBoundingClientRect().left;
    noteElements.forEach(note => {
        const noteRight = note.getBoundingClientRect().right - displayX;
        displayWidth = Math.max(displayWidth, noteRight);
    });

    displayWidth = Math.max(displayWidth + rightClearance, minimumWindowWidth);
    displayWindow.style.width = `${displayWidth}px`;

    drawVerticalLines(displayWidth / 100);
}

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

    return { left: leftValue, freq: currentLine + 1 };
}

function updateShadowNote() {
    if (dragging || (displayingPlacePositionShadow && !resizingLeft && !resizingRight)) {
        const position = calculateNotePosition();

        if (position) {
            shadowNote.style.display = "block";
            lines[position.freq - 1].appendChild(shadowNote);
            shadowNote.style.left = `${position.left}px`;
            shadowNote.style.width = `${noteWidth}px`;
        } else {
            shadowNote.style.display = "none";
        }
    } else {
        shadowNote.style.display = "none";
    }
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
    dragging = true;
    updateShadowNote();

    draggedNote.style.display = "block";

    note.remove();
}

function startResizingLeft(note) {
    resizedNote = note;
    resizingLeft = true;

    const displayRect = displayWindow.getBoundingClientRect();
    const displayX = displayRect.left;

    const noteRect = note.getBoundingClientRect();
    const noteX = noteRect.left;
    noteWidth = noteRect.width;

    rawResizeLeftOffset = noteX - mouseX;
    rawRightAnchor = noteX + noteWidth - displayX;

    recalculateOffsets();
}

function startResizingRight(note) {
    resizedNote = note;
    resizingRight = true;

    const displayRect = displayWindow.getBoundingClientRect();
    const displayX = displayRect.left;

    const noteRect = note.getBoundingClientRect();
    noteWidth = noteRect.width;

    rawResizeRightOffset = noteWidth - mouseX + displayX;

    recalculateOffsets();
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

    resizeDisplay();

    draggedNote.style.display = "none";

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
    updateShadowNote();
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

    if (displayingPlacePositionShadow) {
        updateShadowNote();
    }

    if (resizingLeft) {
        resizeLeft();
    }

    if (resizingRight) {
        resizeRight();
    }
}

function mouseDown(event) {
    if (event.button !== 0) {
        return;
    }

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
    stopDragging();
    stopResizingLeft();
    stopResizingRight();
    noteWidth = 100;
    rawOffsetX = 0;
    recalculateOffsets();
    updateShadowNote();
}

function onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;

    callMoveFunctions();
}

function onClick(event) {
    event.preventDefault();

    if (event.target.classList.contains("line") && event.target.parentElement.classList.contains("display")) {
        rawOffsetX = 0;

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

function onKeyPress(event) {
    if (event.key === "Shift") {
        displayingPlacePositionShadow = true;
        if (!dragging) {
            rawOffsetX = 0;
            recalculateOffsets();
            updateShadowNote();
        }
    }
}

function onKeyRelease(event) {
    if (event.key === "Shift") {
        displayingPlacePositionShadow = false;
        updateShadowNote();
    }
}

window.addEventListener("mouseup", mouseUp);
window.addEventListener("mousemove", onMouseMove);
displayWindow.addEventListener("click", onClick);
document.addEventListener("keydown", onKeyPress);
document.addEventListener("keyup", onKeyRelease);

displayNotes(notes);