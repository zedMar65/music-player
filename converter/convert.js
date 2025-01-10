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
        case 'h':
        case 'a':
            return 5;
        case 'i':
        case 'b':
            return 6;
        default:
            return -1;
    }
}

function distanceToNext(dur) {
    const power = Math.log2(dur) + 1;

    return noteDist / dur;
}

function parseText() {
    let noteArray = [];

    let str = inputBox.value;

    str = str.toLowerCase();

    const notes = str.trim().split(/ +/);

    let pos = 0;

    notes.forEach(function (note, index) {
        let i = 0;

        const letter = note.charAt(i);

        if (letter == 0 && letter != '0') return;

        let number = noteToNumber(letter);

        if (number == -1) {
            return;
        }

        i++;

        let modifier = 0;
    
        for (; i < note.length && (note.charAt(i) == '-' || note.charAt(i) == '+'); i++) {
            switch (note.charAt(i)) {
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

        number

        let duration = 0;
        let durationInputed = false;

        for (; i < note.length && isCharANumber(note.charAt(i)); i++) {
            duration *= 10;
            duration += charToNumber(note.charAt(i));
            durationInputed = true;
        }

        if (i < note.length) {
            console.log("Wrong symbol at position " + index + ".");
            return;
        }

        if (!durationInputed) {
            duration = 4;
        }

        if (duration <= 0 || !isPowerOfTwo(duration)) {
            console.log("Wrong duration at position " + index + ". Duration should be a power of two and greater than 0.");
            return;
        }

        const width = distanceToNext(duration);
        const freq = numberOfLines - number;

        if (freq <= 0 || freq > numberOfLines) {
            console.log("Wrong note height at position " + index);
            return;
        }

        noteArray.push({ dur: width, start: pos, freq: (16-number) });

        pos += width;
    });

    const output = JSON.stringify({ notes: noteArray, volume: 5, speed: 300 });

    outputBox.innerHTML = output;
}

function copyOutput() {
    navigator.clipboard.writeText(outputBox.innerHTML);
}