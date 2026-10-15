# Research Agent Eval

An early prototype for evaluating **research workflows**: designing tasks,
checking evidence, and investigating when a score fails to reflect useful work.

[中文说明](README.zh-CN.md) · [Current progress](docs/progress.md) · [Methodology](docs/methodology.md)

The starting point is computational mathematics research. A useful answer needs
to locate its sources, check assumptions, and distinguish a supported conclusion
from a finite observation or an open question. The project explores how to make
those requirements explicit and reviewable.

**Status: exploratory development snapshot.** This repository publishes selected
components from an existing personal prototype and small, runnable demonstrations.
The public evidence task uses newly written synthetic materials. It is not a
release of the complete research task collection or a model leaderboard.

## Start with two examples

| Example | What to inspect | What it shows |
| --- | --- | --- |
| [Keyword grader failure](examples/keyword-grader-failure/) | Original smoke task, grader, and a deliberately empty analysis | A response can collect full points by repeating expected tokens. |
| [Evidence and claim boundaries](examples/evidence-boundary/) | Synthetic sources, structured answers, and a small grader | Check the cited file, line range, exact quotation, and field binding; retain human review of the conclusion. |

The second example also contains an overclaim with mechanically valid citations.
It makes an important limit visible: **matching a quotation does not establish
that the quotation supports the conclusion.**

## Run locally

Requires Node.js 22 or newer. There are no third-party packages, model calls, API
keys, or paid services in these examples.

```sh
git clone https://github.com/Xingwei0724/research-agent-eval.git
cd research-agent-eval
npm run validate
npm test
npm run demo
```

The demo prints local grader diagnostics and writes a scripted read/search trace
to `output/demo-trace.json`. It does not measure an agent's tool selection.

To inspect the structured result for a saved example response:

```sh
node scripts/grade.mjs examples/evidence-boundary/samples/correct.json
```

## Evaluation design

The prototype separates two questions:

- **Model layer:** how an output performs with fixed inputs and a frozen task.
- **Configuration layer:** how a workflow performs with declared tools, context,
  constraints, and review steps.

Candidate task families include literature attribution, theorem-assumption
checks, transfer between settings, paper/code/experiment consistency, and the
boundary between a proof and numerical evidence.

The public components are:

- **Task Protocol v0:** task scope, source locations, fixture hashes, output
  requirements, automatic checks, human review, and critical error categories.
- **Evidence checks:** a small example that binds required evidence fields to
  specific source excerpts.
- **Failure analysis:** a reproducible counterexample to a retained keyword
  scoring rule, plus correct and deliberately flawed response samples.
- **Read-only tools:** portable list/search/read operations with recorded
  arguments, purposes, results, errors, and result hashes.

These components support evaluation design and debugging. Their checks do not
establish the validity or broad discrimination of a benchmark.

## Progress and next steps

The source prototype has seven registered exploratory/pilot tasks, a task
protocol, evidence-aware graders, and small historical capture/tool trials.
[The progress note](docs/progress.md) distinguishes that history from the
examples actually reproducible in this repository.

Next steps are to expand publishable research tasks, calibrate automatic checks
against independent human judgments, strengthen adversarial samples, and collect
repeated runs under frozen conditions. Model quality, latency, token use, and
cost require their own eligible evidence.

## Source and material notes

[Provenance](docs/provenance.md) records which components were retained, adapted,
or added for this snapshot. Private manuscripts, third-party paper full texts,
historical response transcripts, and local service configuration are outside this
public snapshot. Sample answers are deliberately visible for grader debugging;
the public examples are not held-out evaluation data.

## Local maintenance and publication

Within the full research workspace, this repository lives at
`benchmark/research-agent-eval/`. The surrounding `benchmark/` directory holds the
original research tasks, source materials, pilot records, and design decisions.
The `research-agent-eval/` subfolder is a self-contained Git repository for public
code, documentation, and demonstrations.

Select and review material before transferring it into this repository; changes
in the surrounding workspace are not synchronized automatically. Run Git review,
commit, and push operations from this repository root. A standalone clone is
sufficient to run all public examples and does not require the surrounding
research workspace.

Author: [Xingwei](https://github.com/Xingwei0724), Computational Mathematics,
Beijing Normal University.
