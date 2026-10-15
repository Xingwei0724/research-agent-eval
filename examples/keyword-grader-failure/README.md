# A reproducible scoring failure

This is a retained smoke task from the initial prototype. The task and grader are
unchanged. The report is fictional. This folder is a diagnostic example, not a
validated benchmark task.

The task asks for five contradictions in a short report. The grader searches the
combined response for broad keyword patterns. `demonstrate.mjs` constructs five
empty analyses that repeat the expected tokens. The grader awards full points.

```sh
node examples/keyword-grader-failure/demonstrate.mjs
```

This demonstrates a failure of the scoring rule. It does not show that a model
completed the task, nor that a model deliberately exploited the rule.

The accompanying [evidence example](../evidence-boundary/) illustrates a narrower
check: bind each required field to a specific fixture, line range and quotation,
and reserve substantive research judgment for human review. That example also
needs further adversarial testing; exact evidence matching is not a general
mathematical evaluator.
