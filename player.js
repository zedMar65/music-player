const pxpersecond = 100;

const sounds = [];

for (let i = 3; i < 11; i++) {
    const sound = T("sin", { freq: i * 100, mul: 0 });
    sound.play();
    sounds.push(sound);
}

function playNote(note) {
    setTimeout(() => {
        sounds[note.freq].set({ mul: 0.1 });
        setTimeout(() => sounds[note.freq].pause(), note.dur * 1000 / pxpersecond);
    }, note.start * 1000 / pxpersecond);
}

function playNotes(notes) {
    notes.forEach(note => playNote(note));
}
