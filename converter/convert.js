const inputBox = document.querySelector("textarea");
const outputBox = document.querySelector(".output p");

const noteDist = 400;

const numberOfLines = 16;

function isPowerOfTwo(number) {
    // Check if number is positive and non-zero and if there's only one bit on
    return number > 0 && (number & (number - 1)) === 0;
}

function isCharANumber(c) {
    return (c >= '0' && c <= 9);
}

function charToNumber(c) {
    return (c - '0');
}

function stringToNumber(str) {
    let number = 0;

    for (let i = 0; i < str.length; i++) {
        if (!isCharANumber(str.charAt(i))) {
            return -1;
        }

        number *= 10;
        number += charToNumber(str.charAt(i));
    }

    return number;
}

function noteToNumber(note) {
    switch (note) {
        case 'c':
            return 0;
        case 'd':
            return 1;
        case 'e':
            return 2;
        case 'f':
            return 3;
        case 'g':
            return 4;
        case 'a':
            return 5;
        case 'b':
            return 6;
        default:
            return -1;
    }
}

function parseNote(str) {
    let number = noteToNumber(str.charAt(0));

    let modifier = 0;

    for (let i = 1; i < str.length; i++) {
        switch (str.charAt(i)) {
            case '-':
                modifier--;
                break;
            case '+':
                modifier++;
                break;
            default:
                break;
        }
    }

    number += (modifier*7);

    return number;
}

function durationToWidth(dur) {
    const power = Math.log2(dur) + 1;

    return noteDist / dur;
}

// Enums
const Clef = Object.freeze({
    TREBLE: "treble",
    BASS: "bass"
});

const LineType = Object.freeze({
    NONE: "none",
    NOTES: "notes",
    REST: "rest",
    DURATION: "duration",
    CLEF: "clef",
    BAR: "bar"
});

const StringType = Object.freeze({
    NOTE: "note",
    REST: "rest",
    DURATION: "duration",
    CLEF: "clef",
    TIE: "tie",
    ACCIDENTAL: "accidental",
    DOT: "dot",
    BAR: "bar",
    COMMENT: "comment",
    INVALID: "invalid"
});

function classifyString(str) {
    if (/^[a-g][+-]*$/.test(str)) {
        return StringType.NOTE;
    }

    if (str == 'r') {
        return StringType.REST;
    }

    if (/^[1-9][0-9]*$/.test(str)) {
        return StringType.DURATION;
    }

    if (str == 'treble' || str == 'bass') {
        return StringType.CLEF;
    }

    if (str == 't') {
        return StringType.TIE;
    }
    
    if (str == '_' || str == '^' || str == '=') {
        return StringType.ACCIDENTAL;
    }

    if (str == '.') {
        return StringType.DOT;
    }

    if (str == '|') {
        return StringType.BAR;
    }

    if (str == '//') {
        return StringType.COMMENT;
    }

    return StringType.INVALID;
}

function classifyClef(str) {
    if (str == 'treble') {
        return Clef.TREBLE;
    }

    if (str == 'bass') {
        return Clef.BASS;
    }
}

function parseText() {
    console.log("Converting...");

    let str = inputBox.value;
    str = str.toLowerCase();

    const lines = str.trim().split('\n');

    let parsedLines = [];

    lines.forEach(function (line, index) {
        const notes = line.split(',');

        let parsedLine = [];

        notes.forEach(function (note, noteIndex) {
            const strings = note.split(/\s+/);

            let parsedNote = [];

            strings.forEach(function (str) {
                const type = classifyString(str);

                if (str == '') {
                    return;
                }

                parsedNote.push({ str: str, type: type });
            });

            parsedLine.push(parsedNote);
        });

        parsedLines.push(parsedLine);
    });

    parseTokens(parsedLines);
}

function parseTokens(lines) {
    let noteArray = [];

    let pos = 0;
    let posTreble = 0;
    let posBass = 0;

    let globalDuration = 4;

    lines.forEach(function (line, lineIndex) {
        // Parsing a line
        let lineType = LineType.NONE;

        let chordWidth = null;

        if (line.length > 1) {
            lineType = LineType.NOTES;
        }

        line.forEach(function (note, noteIndex) {
            // Parsing a note
            let noteDefined = false;
            let durationDefined = false;

            let duration = globalDuration;
            let width = durationToWidth(duration);
            let number = 0;

            let error = false;

            note.forEach(function (token, tokenIndex) {
                // Parsing a token
                if (error) {
                    return;
                }

                if (token.type == StringType.NOTE) {
                    if (lineType != LineType.NONE && lineType != LineType.DURATION && lineType != LineType.NOTES) {
                        console.log("Invalid note at line " + lineIndex + ", note " + noteIndex);
                        error = true;
                        return;
                    }

                    if (noteDefined) {
                        console.log("Multiple definitions of the note at line " + lineIndex + ", note " + noteIndex);
                        error = true;
                        return;
                    }

                    noteDefined = true;

                    lineType = LineType.NOTES;

                    number = parseNote(token.str);

                    return;
                }

                if (token.type == StringType.REST) {
                    if (lineType != LineType.NONE && lineType != LineType.DURATION) {
                        console.log("Invalid rest at line " + lineIndex + ", note " + noteIndex);
                        error = true;
                        return;
                    }

                    if (noteDefined) {
                        console.log("Multiple definitions of the note at line " + lineIndex + ", note " + noteIndex);
                        error = true;
                        return;
                    }

                    noteDefined = true;

                    lineType = LineType.REST;

                    return;
                }

                if (token.type == StringType.DURATION) {
                    if (durationDefined) {
                        console.log("Multiple definitions of the length at line " + lineIndex + ", note " + noteIndex);
                        error = true;
                        return;
                    }

                    if (lineType == LineType.NONE) {
                        lineType = LineType.DURATION;
                    }

                    duration = stringToNumber(token.str);

                    width = durationToWidth(duration);

                    if (duration <= 0 || !isPowerOfTwo(duration)) {
                        console.log("Invalid length at line " + lineIndex + ", note " + noteIndex);
                        error = true;
                        return;
                    }

                    durationDefined = true;

                    return;
                }

                if (token.type == StringType.INVALID) {
                    console.log("Invalid token at line " + lineIndex + ", note " + noteIndex);
                    error = true;
                    return;
                }
            });

            if (error) {
                return;
            }

            if (lineType == LineType.NOTES) {
                if (noteDefined == false) {
                    console.log("No note defined at line " + lineIndex + ", note " + noteIndex);
                    error = true;
                    return;
                }

                const freq = numberOfLines - number;

                if (freq <= 0 || freq > numberOfLines) {
                    console.log("Wrong note pitch at position " + index + ", note " + noteIndex);
                    error = true;
                    return;
                }

                noteArray.push({ start: pos, freq: freq, dur: width });
                if (chordWidth == null) {
                    chordWidth = width;
                } else {
                    chordWidth = Math.min(chordWidth, width);
                }
            }

            if (lineType == LineType.REST) {
                chordWidth = width;
            }

            if (lineType == LineType.DURATION) {
                globalDuration = duration;
            }
        });

        if (lineType == LineType.NOTES || lineType == LineType.REST) {
            pos += chordWidth;
        }
    });

    const output = JSON.stringify({ notes: noteArray, volume: 5, speed: 300 });

    outputBox.innerHTML = output;

    console.log("Conversion complete!");
}

function copyOutput() {
    navigator.clipboard.writeText(outputBox.innerHTML);
}