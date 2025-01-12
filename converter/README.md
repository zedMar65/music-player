
# Music converter documentation

## Notice

Chord here - a combination of two or more notes played at the same time.

## General syntax

Everything is written in any letter case.

## Lines

While music is written left to right, here it is written top to bottom, in lines.

A single line can contain:
- [A combination of notes (a single note or a chord)](#notes);
- [A rest](#rests);
- [A global modifier](#global-modifiers).

## Notes

Notes are described by a sequence of tokens seperated by spaces. The tokens are described [below](#note-tokens).

Multiple notes can be written in a single line seperated by commas (`,`), creating a chord.

Notes in different lines are played one after another. Notes in the same line are played at the same time.

## Note tokens

All tokens, except Pitch, are optional.

### Pitch

Note pitch is described by letters from `A` to `G`.

The default octave is 4. It can be modified with [clefs](#clefs).

A note's octave can be increased by adding `+` symbols right after the letter (without a space).

The number of symbols corresponds to the number of octaves the pitch is increased by.

The octave can be decreased by adding `-` symbols the same way.

Pitch token can only be used once in a note.

### Length

Modifies the length of the note.

Length is written as a number that is a power of two.

Length of 1 signifies a whole note, a length of 4 - a quarter note and so on.

If the length token is unused, the note becomes of the [global length](#length-1).

Length token can only be used once in a note.

### Accidentals

A flat is defined with a `_`.

A sharp is defined with a `^`.

A natural is defined with a `=`.

Multiple accidentals of the same type can be used on the same note. That allows to create double flats and double sharps.

### Dot

A dot is defined with a `.` or a `*` symbol.

Increases the note length by half of its original (set by length [token](#length) or [global modifier](#length-1)).

Multiple dots can be used on the same note. A second dot additionally increases the length by 1/4 of the original value. A third - by 1/8 and so on.

### Tie

A tie is created with a `t`.

Tying of more than 2 notes is possible.

A tie applied to a note indicates that it is tied to the next note of the same intial pitch (ignoring [accidentals](#accidentals)).

The last note of the tie should not have a tie token.

Tied notes can't have different accidentals, except for when the first note has an accidental, then other notes can omit it, it will be applied automatically. But they cannot apply a different accidental.

Tie token can only be used once in a note.

## Rests

A rest is defined with a letter `R`.

A rest is used in its own line.

It can have a [length](#length) or [dot](#dot) tokens it the same line as well. They work the same as for notes.

## Global modifiers

Global modifiers affect all the chords after them up to the next modifier of the same type.

### Length

Modifies the global length of notes, which is applied to all notes that do not have a [length token](#length).

The default global note length (if none is applied manually) is 4.

### Clefs

Clefs are changed with keywords `treble` and `bass` in a seperate line.

The default clef is treble.

Treble clef sets the default octave to 4.

Bass clef sets the default octave to 3.

Clefs use two different pointers to add notes. That means that notes in treble clef are added after notes only in treble clef, ignoring notes in bass clef and vice versa.

Clef pointers are synchronized by using a [bar](#bars) - the pointer that is further behind is set to the position of the pointer that is ahead. That means that all notes in treble and bass clefs in the same measure should be written before a bar.

### Bars

A bar is defined with `|`.

A bar cancels all [accidentals](#accidentals).

A bar synchronizes [clef pointers](#clefs).

## Comments

A comment can be created with `//` seperated by spaces from both sides.

Everything after the `//` in the same line is ignored and covertion is continued from the next line.

Comments are used to leave notes for people, they have no impact to the conversion process.

## Errors

While converting, syntax errors can occur.

The errors are logged in the browser's console window.

Be aware that line and note numbers that are outputed in the console are counted starting from 0. That means that `line 0` means the first line and `line 5` means the fourth.

Experiencing an error while converting an item skips the conversion of that line item and does not take it into account when creating the output. All other succesfully converted lines will still be taken into account and used in the output.