# Component provenance

This repository is a selected development snapshot of a personal computational-
mathematics workflow evaluation prototype. The original workspace remains the
research baseline. Paths below are logical paths within that source project;
they do not depend on the author's computer.

| Public component | Origin | Treatment |
| --- | --- | --- |
| `protocol/task-schema.json` | `protocol/task-schema.json` | Retained schema v0.1 |
| `protocol/validate.mjs` | `protocol/validate.mjs` | Adapted to discover public examples instead of a fixed private task list; adds portable path checks |
| `configuration/toolbox.mjs` | `configuration/toolbox.mjs`, `configuration/toolbox-cli.mjs` | Portable adaptation of list/search/read and result recording; adds real-path checks |
| `examples/keyword-grader-failure/check.mjs` | `tasks/t3-inconsistency/check.mjs` | Grading logic retained unchanged to demonstrate a failure |
| `examples/keyword-grader-failure/prompt.md` | `tasks/t3-inconsistency/prompt.md` | Retained fictional report task |
| `examples/evidence-boundary/`, `src/grade-evidence.mjs` | Added for this snapshot | Original synthetic materials and a small mechanical evidence-checking example |
| Demo scripts, tests, CI, public documentation | Added for this snapshot | Portable reproduction and explanation of the selected progress |

The files retained from the source may have line endings normalized by Git.
Original source-file SHA-256 values, before that normalization:

```text
protocol/task-schema.json
46b97137c8637f15502d5c7eb16b7f8c487d2d74356a62cd89d1bccf0c04b556

protocol/validate.mjs
48d246f287100536ecb0c525ed60bcdfd5f5ce3a48be7552c35ba535d0d7b864

configuration/toolbox.mjs
df7faa8e8c8e4e892d2062da1621beccdc8c2631f451e0c33b3edbe39f48f1c5

configuration/toolbox-cli.mjs
ca6822ba35bd101fb09d99fa65c90b9ac2e77c23250238e3142d2785a5e566c9

tasks/t3-inconsistency/check.mjs
d5f81170ec7e23b92a809b43ab991250a0989b260e62f1a6094dffbceae7c706

tasks/t3-inconsistency/prompt.md
9fdc153ab0d94f295f7609686a17bc48c51fcd5be55aa34bc26a5160a6f2de70
```

The synthetic evidence task is an illustrative public adaptation of the
prototype's design ideas. It is not an anonymized copy of an unpublished
manuscript, an actual experimental result, or a captured model response.

No third-party paper full texts are distributed. No open-source license has been
selected for this development snapshot.
