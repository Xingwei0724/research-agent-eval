# Task Protocol v0.1

The retained schema describes a task's scope, workflow steps, evidence sources,
fixture hashes, evaluation layers, scoring responsibilities, and output fields.

The [public example](../examples/evidence-boundary/task.json) uses synthetic
materials. Its `exploratory` status describes validation maturity; publication
of a demonstration does not promote it to a validated task.

```sh
npm run validate
```

The adapted validator discovers every `examples/*/task.json` and checks key
structural requirements and fixture SHA-256 values. It rejects missing material,
fixture paths escaping the task, hash mismatches, and unknown evidence fixtures.
It is a targeted validator, not complete JSON Schema conformance checking.

Expected answers and review rules remain visible in this development snapshot
so that its grader can be examined. A future held-out evaluation needs a separate
material access and task-versioning policy.
