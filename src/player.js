const playIcon = document.getElementById("play");
const volumeInput = document.getElementById("volume");
const speedInput = document.getElementById("speed");
const octaveInput = document.getElementById("octave");
const currentLine = document.getElementById("current-line");

let activeSynth = [];
let stopTimeout;

function getFreq(note, octave) {
    return frequencyHz[note - 1 + 12 * (octave - 2)];
}

function stop() {
    clearTimeout(stopTimeout);
    playIcon.setAttribute("src", "img/play.svg");
    currentLine.style.display = "none";
    currentLine.style.left = 0;
    activeSynth.forEach(synth => synth.disconnect());
    activeSynth = [];
}

function play() {
    if (playIcon.getAttribute("src") == "img/stop.svg") return stop();
    playIcon.setAttribute("src", "img/stop.svg");
    currentLine.style.display = "block";

    const notes = getNotes();
    const now = Tone.now();
    let end = 0;

    notes.forEach(note => {
        const synth = new Tone.Synth({ volume: +volumeInput.value }).toDestination();
        synth.triggerAttackRelease(note.freq, note.dur, now + note.start);
        activeSynth.push(synth);

        const end1 = note.start + note.dur;
        end = Math.max(end, end1);
    });

    currentLine.style.transitionDuration = end + "s";
    currentLine.style.left = end * +speedInput.value + "px";

    stopTimeout = setTimeout(() => stop(), (end + 0.5) * 1000);
}