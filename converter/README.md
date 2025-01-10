
# Music converter documentation

## Notice

Chord here - a combination of two or more notes played at the same time.

## General syntax

Everything is written in any letter case.

## Lines

While music is written left to right, here it is written top to bottom, in lines.

A single line contains a combination of notes (a single note or a chord) or a global modifier.

## Notes

Notes are described by a sequence of tokens seperated by spaces. The tokens are described [below](#note-tokens).

Multiple notes can be written in a single line seperated by commas (`,`) creating a chord.

## Note tokens

All tokens can only be used once in a single note and all of them, except Pitch, are optional.

### Pitch

Note pitch is described by letters from `A` to `G`.

A note's octave can be increased by adding `+` symbols right after the letter (without a space).

The number of symbols corresponds to the number of octaves the pitch is increased by.

The octave can be decreased by adding `-` symbols the same way.

### Length

Modifies the length of the note.

Length is written as a number that is a power of two.

Length of 1 signifies a whole note, a length of 4 - a quarter note and so on.

## Global modifiers

Global modifiers affect all the chords after them up to the next modifier of the same type.

## Global modifier types

### Length

Modifies the global length of notes, which is applied to all notes that do not have a [length token](#length).

The default global note length (if none is applied manually) is 4.

## Errors

While converting, syntax errors can occur.

The errors are logged in the browser's console window.

Experiencing an error while converting a note skips the conversion of that note and does not include it in the output. All other succesfully converted notes in the same and other chords will still be converted and outputed.