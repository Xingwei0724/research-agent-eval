# Original synthetic example

This example was newly authored for the public progress snapshot. Its note and three records are fictional. No solver was run, no model was called, and the response samples are hand-authored calibration fixtures.

The grader receives a JSON string and a Map from the two task-relative fixture paths to their text. It checks three controlled field groups, allowed file paths, valid line intervals, exact text, and whether each interval contains the source block assigned to that field. CRLF/LF differences are normalized. It reads no files and performs no network access by itself.

| Authored sample | Expected automatic points | Purpose |
| --- | ---: | --- |
| correct.json | 30/30 | Intended bounded answer; still requires human review. |
| wrong.json | 20/30 | Wrong record values and source-limit labels. |
| near-miss.json | 20/30 | Exact quote at a real location, attached to the wrong source block. |
| overclaim.json | 30/30 | Correct controlled facts and citations; unsupported free-text conclusion. |

Automatic points cover 5 for required structure, 15 for controlled facts, and 10 for all field-bound citations. The remaining 70 points require the explicit human rubric. The grader reports no overall score and no automatic scientific verdict. In particular, the overclaim sample intentionally passes every mechanical check.

The tests add mutations for fabricated text, unknown paths, invalid or reversed line intervals, omitted citations, wrong assumptions, altered record status, and malformed JSON. These tests calibrate a deterministic checker against authored cases; they do not validate general mathematical reasoning or a model leaderboard.

From the repository root, run:

    node --test test/evidence.test.mjs

The task manifest records SHA-256 hashes for the two fixtures and uses Task Protocol 0.1. Editing a fixture requires revisiting its citations, bindings, hashes, and calibration expectations together.
