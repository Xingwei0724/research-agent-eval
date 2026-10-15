# Current progress

Public snapshot prepared on 2026-10-15. The source task registry and historical
pilot decisions below were recorded on 2026-09-12. Those trials were not rerun
for this snapshot.

## Existing prototype

The source registry contains seven tasks: four `exploratory` and three `pilot`.
None has been promoted to `validated` or `public` in that registry.

| Family | Task IDs | Focus |
| --- | --- | --- |
| Attribution | t4, t7 | Locate the source of a claim, with and without attribution hints |
| Research records | t5 | Metadata, naming rules, and ambiguity in document organization |
| Stability and assumptions | t6, t8 | Distinguish sufficient conditions, stronger claims, and unsupported transfers |
| Consistency | t9 | Compare manuscript statements, implementation, and numerical records |
| Proof boundaries | t10 | Separate conditional arguments, implementation contracts, and finite evidence |

The prototype also contains Task Protocol v0, structured sample answers,
evidence-aware scoring rules, response-capture scripts, and read/search tools
that record their operations.

## What this repository makes reproducible

- The broad-keyword scoring failure in an unchanged early smoke grader.
- A new synthetic evidence task with source/field binding and response samples.
- Local checks for missing, misplaced, or altered evidence.
- An example that passes mechanical citation checks but still needs rejection
  during human review for an unsupported conclusion.
- A scripted list/search/read trace and a targeted fixture-hash validator.

This is a public demonstration of parts of the evaluation design. The synthetic
task was added for this snapshot; it is not one of the seven original tasks and
has not been tested for useful model discrimination.

## Historical pilots and corrected interpretations

The source decision log records a provenance audit that withdrew earlier model
and reasoning-effort comparisons. Its 16 historical cells were ineligible for
the runtime-captured model summary. Their scores are not a leaderboard.

Later records describe two small model-layer captured artifacts and two tool-
instrumented configuration trials. The model artifacts lacked provider-native
response envelopes. Those limited records do not establish stable model
differences, tool efficiency differences, or general research ability.

The public snapshot does not republish those raw trial transcripts or their
scores. Its local demos and tests evaluate code behavior, not model capability.

## Work still required

- Publish complete research tasks with suitable source permissions and clear
  reference evidence.
- Compare automatic checks with independent human judgments, including semantic
  false positives and equivalent mathematical expressions.
- Expand adversarial samples and freeze task/grader versions for a trial.
- Collect repeated, traceable model and configuration runs.
- Assess task validity and discrimination before making comparative claims.
