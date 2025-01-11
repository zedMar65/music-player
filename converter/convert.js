const inputBox = document.querySelector("textarea");
const outputBox = document.querySelector(".output p");

const noteAmount = frequencyHz.length;

const noteDist = 400;

let defaultOctave = 4;

function convertUnits(length) {
    return length / 300;
}

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
            return 2;
        case 'e':
            return 4;
        case 'f':
            return 5;
        case 'g':
            return 7;
        case 'a':
            return 9;
        case 'b':
            return 11;
        default:
            return -1;
    }
}

function parseNote(str) {
    let number = noteToNumber(str.charAt(0));

    let modifier = defaultOctave - 2;

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

    number += (modifier*12);

    return number;
}

function getActualLength(length) {
    return noteDist / length;
}

// Enums
const Clef = Object.freeze({
    TREBLE: "treble",
    BASS: "bass"
});

const Accidental = Object.freeze({
    SHARP: "sharp",
    FLAT: "flat",
    NATURAL: "natural"
});

const LineType = Object.freeze({
    NONE: "none",
    NOTES: "notes",
    REST: "rest",
    LENGTH: "length",
    CLEF: "clef",
    BAR: "bar"
});

const StringType = Object.freeze({
    NOTE: "note",
    REST: "rest",
    LENGTH: "length",
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
        return StringType.LENGTH;
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

    if (str == '.' || str == '*') {
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

function classifyAccidental(str) {
    if (str == '^') {
        return Accidental.SHARP;
    }

    if (str == '_') {
        return Accidental.FLAT;
    }

    if (str == '=') {
        return Accidental.NATURAL;
    }
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

    let currentClef = Clef.TREBLE;

    let globalLength = 4;

    const accidentals = new Map();

    lines.forEach(function (line, lineIndex) {
        let error = false;

        // Parsing a line
        let lineType = LineType.NONE;

        let chordWidth = null;

        if (line.length > 1) {
            lineType = LineType.NOTES;
        }

        line.forEach(function (note, noteIndex) {
            // Parsing a note
            if (error) {
                return;
            }

            let noteDefined = false;
            let lengthDefined = false;

            let dotMultiplier = 0.5;
            let widthMultiplier = 1;

            let dotDefined = false;

            let length = globalLength;
            let actualLength = getActualLength(length);
            let number = 0;

            let accidentalType = null;
            let accidentalShift = 0;
            let accidentalDefined = false;

            let newClef = null;

            note.forEach(function (token, tokenIndex) {
                // Parsing a token
                if (error) {
                    return;
                }

                if (token.type == StringType.INVALID) {
                    console.log("Invalid token at line " + lineIndex + ", note " + noteIndex);
                    error = true;
                    return;
                }

                if (token.type == StringType.NOTE) {
                    if (lineType != LineType.NONE && lineType != LineType.LENGTH && lineType != LineType.NOTES) {
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
                    if (lineType != LineType.NONE && lineType != LineType.LENGTH) {
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

                if (token.type == StringType.LENGTH) {
                    if (lineType != LineType.NONE && lineType != LineType.NOTES && lineType != LineType.REST) {
                        console.log("Invalid length at line " + lineIndex + ", note " + noteIndex);
                        error = true;
                        return;
                    }

                    if (lengthDefined) {
                        console.log("Multiple definitions of the length at line " + lineIndex + ", note " + noteIndex);
                        error = true;
                        return;
                    }

                    if (lineType == LineType.NONE) {
                        lineType = LineType.LENGTH;
                    }

                    length = stringToNumber(token.str);

                    actualLength = getActualLength(length);

                    if (length <= 0 || !isPowerOfTwo(length)) {
                        console.log("Invalid length at line " + lineIndex + ", note " + noteIndex);
                        error = true;
                        return;
                    }

                    lengthDefined = true;

                    return;
                }

                if (token.type == StringType.DOT) {
                    if (lineType != LineType.LENGTH && lineType != LineType.NOTES && lineType != LineType.REST && lineType != LineType.NONE) {
                        console.log("Invalid dot at line " + lineIndex + ", note " + noteIndex);
                        error = true;
                        return;
                    }

                    widthMultiplier += dotMultiplier;
                    dotMultiplier /= 2;

                    dotDefined = true;

                    return;
                }

                if (token.type == StringType.ACCIDENTAL) {
                    if (lineType != LineType.NONE && lineType != LineType.NOTES && lineType != LineType.LENGTH) {
                        console.log("Invalid accidental at line " + lineIndex + ", note " + noteIndex);
                        error = true;
                        return;
                    }

                    lineType = LineType.NOTES;

                    const accidental = classifyAccidental(token.str);

                    if (accidentalType != null && accidentalType != accidental) {
                        console.log("Different accidental types at line " + lineIndex + ", note " + noteIndex);
                        error = true;
                        return;
                    }

                    accidentalDefined = true;

                    accidentalType = accidental;

                    if (accidental == Accidental.SHARP) {
                        accidentalShift++;
                    }

                    if (accidental == Accidental.FLAT) {
                        accidentalShift--;
                    }

                    return;
                }

                if (lineType != LineType.NONE) {
                    console.log("Invalid " + token.type + " at line " + lineIndex + ", note " + noteIndex);
                    error = true;
                    return;
                }

                if (token.type == StringType.CLEF) {
                    lineType = LineType.CLEF;

                    newClef = classifyClef(token.str);

                    return;
                }

                if (token.type == StringType.BAR) {
                    lineType = LineType.BAR;

                    return;
                }
            });

            if (error) {
                return;
            }

            actualLength *= widthMultiplier;

            if (dotDefined && lineType != LineType.NOTES && lineType != LineType.REST) {
                console.log("Invalid dot at line " + lineIndex + ", note " + noteIndex);
                error = true;
                return;
            }

            if (lineType == LineType.NOTES) {
                // Add the note to the array

                if (noteDefined == false) {
                    console.log("No note defined at line " + lineIndex + ", note " + noteIndex);
                    error = true;
                    return;
                }

                if (accidentalDefined) {
                    accidentals.set(number, accidentalShift);
                } else {
                    if (accidentals.has(number)) {
                        accidentalShift = accidentals.get(number);
                    }
                }

                number += accidentalShift;

                if (number < 0 || number >= noteAmount) {
                    console.log("Unsupported note pitch at position " + index + ", note " + noteIndex);
                    error = true;
                    return;
                }

                const frequency = frequencyHz[number];

                noteArray.push({ start: convertUnits(pos), dur: convertUnits(actualLength), freq: frequency });

                if (chordWidth == null) {
                    chordWidth = actualLength;
                } else {
                    chordWidth = Math.min(chordWidth, actualLength);
                }
            }

            if (lineType == LineType.CLEF) {
                if (newClef == currentClef) {
                    return;
                }

                currentClef = newClef;

                if (newClef == Clef.TREBLE) {
                    // Switch to treble
                    posBass = pos;
                    pos = posTreble;
                    defaultOctave = 4;
                } else {
                    // Switch to bass
                    posTreble = pos;
                    pos = posBass;
                    defaultOctave = 3;
                }
            }

            if (lineType == LineType.BAR) {
                accidentals.clear();
            }

            if (lineType == LineType.REST) {
                chordWidth = actualLength;
            }

            if (lineType == LineType.LENGTH) {
                globalLength = length;
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