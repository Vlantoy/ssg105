# Endless phrase mode

Active gameplay uses `endless.js`: a phrase of four possible arrow directions, entered in order, then Space at the target timing line. Touch has the same four arrows plus a commit button. Wrong direction resets phrase entry while time remains; incomplete entry, early/late commit or timeout loses one life. Three lives, no fixed song ending. Each resolved phrase advances the round (including misses). Pause freezes the clock and phrase. Direct entry remains: first input begins the session.

Initial phrase: 3 arrows / 6 seconds / ±240 ms good / ±90 ms perfect. Every three rounds adds a direction, capped at 10. Phrase time decreases 160 ms per round to 2.3 s; good window decreases to ±75 ms. BPM rises from 80 to 160. Bounds prevent impossible zero-time or unbounded phrase growth. High score is stored separately from the former difficulty-based mode.

Tests: `node --test nhay-sap/tests/*.cjs`. Includes successful phrase scoring, progression, timeout lives, pause/resume, all four directions, difficulty bounds and scene initialization.
