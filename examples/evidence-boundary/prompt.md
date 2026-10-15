# Synthetic evidence-boundary exercise

Both fixtures are original, fictional calibration data. They contain no executed solver experiment, real model response, or unpublished research.

Assess this candidate claim:

> The three recorded iteration counts prove a bound independent of problem size and tolerance, as well as parallel scalability.

Read fixtures/study-note.md and fixtures/pilot-runs.json. Report the configuration, the finite records, and the limits stated by the source. Distinguish conditions assumed for these rows from conditions sufficient for a mathematical theorem. Explain what the candidate claim can and cannot derive from the supplied material.

Return one JSON object with these fields:

- configuration: method, tolerance, assumptions, citation. Use the two assumption labels fixed-matrix-per-run and zero-initial-guess, in that order.
- observations: kind, sizes, iterations, citation. Preserve the source order.
- source_limits: uniform_bound and parallel_scaling, using not-established and not-measured respectively when stated by the source, plus citation.
- claim_assessment: supported, partially-supported, or not-established.
- conclusion: your reasoned assessment in free text.
- uncertainties: a nonempty array of limitations or information still needed.

Each citation is an object with file, start, end, quote. File must be one of the two relative fixture paths above. Lines are numbered from 1. Quote must reproduce the entire selected interval exactly, with line breaks; CRLF and LF are treated equivalently. To support the corresponding controlled fields, cite study-note.md lines 4-5 for configuration, pilot-runs.json lines 6-8 for observations, and study-note.md lines 6-7 for source_limits. A wider interval is allowed when it contains the required lines.

Automatic checks award at most 30 points: required structure (5), three groups of controlled source facts (15), and exact, field-bound citations (10). They do not decide whether free prose is mathematically correct or whether a conclusion overstates the evidence. Human review uses rubric.json for the remaining 70 points. No overall score is available before that review.
