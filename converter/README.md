
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

## Note tokens

All tokens, except Pitch, are optional.

### Pitch

Note pitch is described by letters from `A` to `G`.

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

### Dot

A dot is defined with a `.` or a `*` symbol.

Increases the note length by half of its original (set by length [token](#length) or [global modifier](#length-1)).

Multiple dots can be used on the same note. A second dot additionally increases the length by 1/4 of the original value. A third - by 1/8 and so on.

## Rests

A rest is defined with a letter `R`.

A rest is used in its own line.

It can have a [length](#length) or [dot](#dot) tokens it the same line as well. They work the same as for notes.

## Global modifiers

Global modifiers affect all the chords after them up to the next modifier of the same type.

### Length

Modifies the global length of notes, which is applied to all notes that do not have a [length token](#length).

The default global note length (if none is applied manually) is 4.

## Errors

While converting, syntax errors can occur.

The errors are logged in the browser's console window.

Experiencing an error while converting a note skips the conversion of that note and does not include it in the output. All other succesfully converted notes in the same and other chords will still be converted and outputed.

Be aware that line and note numbers that are outputed in the console are counted starting from 0. That means that `line 0` means the first line and `line 5` means the fourth.