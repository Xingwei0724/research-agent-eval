# Evaluation methodology

## Task unit

Use a research workflow as the unit of evaluation where the materials allow it:
read the source, locate the relevant statement, inspect assumptions, assess a
proposed transfer or claim, and record a supported conclusion and uncertainty.
A task must state which of those steps it actually covers.

Task metadata records the sources, content hashes, evidence locations, expected
output fields, scoring dimensions, and review responsibilities. The public
validator checks important structural and provenance requirements; it is not a
general JSON Schema validator and does not verify a source's scientific truth.

## Automatic checks and human judgment

| Dimension | Suitable automatic checks | Review still required |
| --- | --- | --- |
| Output completeness | Parseability and required fields | Whether the answer addresses the task |
| Evidence | Declared file, valid line range, exact quotation, field binding | Whether the evidence supports the claim |
| Assumptions | Presence of structured assumption fields | Missing, misinterpreted, or silently strengthened assumptions |
| Mathematical correctness | Narrow, independently specified checks where available | Free-form derivations and scientific conclusions |
| Workflow | Declared tool operations and recorded results | Relevance, planning, and recovery from failed steps |
| Efficiency | Comparable usage records under a frozen setup | Whether the delivered quality justifies the cost |

The evidence demonstration deliberately leaves 70 review points unassigned. Its
30 automatic points cover a narrow mechanical contract. An automatic maximum
must not be reported as a total quality score.

Keep two separate records:

1. **Run integrity:** were the required inputs, raw output, versions, and transport
   records captured? Was the run truncated or unavailable?
2. **Answer quality:** did the output meet the task, use valid evidence, and stay
   within the supported claim boundary?

A well-captured wrong answer remains an observed wrong answer. A poor score,
invalid answer JSON, or unsupported claim is not a reason to silently remove a
run. Critical quality flags belong to quality analysis, not transport validity.

## Failure-driven calibration

Start with a known answer and change one feature: remove evidence, cite the wrong
file, move the line range, alter the quotation, attach an unrelated excerpt to a
required field, or retain the excerpt while overstating the conclusion.

The retained keyword failure demonstrates why format and token matches can
overestimate performance. The evidence task adds narrower checks and preserves
human review for cases those checks cannot resolve. Neither small example is
evidence of general grader robustness.

## Tool traces

The read-only toolbox records the requested operation, its purpose, arguments,
result or error, and a result hash. A trace created by the local demo is labelled
`scripted-local-demo`. It illustrates instrumentation only.

These tools are utilities for controlled fixture workspaces, not an operating
system security sandbox. Their traces can be edited locally and are not signed
provider attestations. Real agent evaluations also need frozen task and model
configuration, raw response provenance, access controls, and review procedures.
