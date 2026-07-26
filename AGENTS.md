# Lumina Studio Wiki Authoring Rules

## Purpose

This repository documents the public behavior of Lumina Studio. A control
reference must explain what the current software actually does, not merely
repeat a label, tooltip, issue description, or remembered intent.

## Control reference pages

- Give each user-facing control with non-trivial behavior its own page under
  `docs/reference/<category>/<control-slug>/<control-slug>.mdx`.
- Store that page's publishable images under its local `assets/` directory.
- Use the visible control label as the page title. Parent controls and dependent
  controls must link to each other with relative Markdown links.
- Keep workflow tutorials focused on completing a task. Put exhaustive parameter
  behavior in the control reference and link to it instead of duplicating it.
- Do not turn every button, loading label, or generic UI primitive into a page.
  Group controls that only make sense together into the smallest parent workflow
  that preserves their dependencies, ranges, and side effects.
- Treat a component as public only when it is reachable through the current
  application navigation. Record unreachable or retired components in the
  internal coverage audit instead of presenting them as current UI.

Before writing or revising a control reference, trace the current implementation
from UI state through the request payload to the backend or core behavior. Check:

1. where the control appears and the conditions that show, hide, enable, or
   disable it;
2. accepted range, step, default, units, persistence, and reset behavior;
3. which workflows, input modes, and data sources actually consume the value;
4. what increasing, decreasing, enabling, disabling, and boundary values do;
5. interactions, precedence, mutual exclusions, fallbacks, and ignored states;
6. visible effects, side effects, limitations, and cases where no difference is
   expected;
7. whether the UI tooltip, translation, schema description, tests, and core code
   agree.

When sources disagree, treat executable behavior and focused regression tests as
the source of truth, record the discrepancy, and correct public wording rather
than copying the inaccurate text into the Wiki.

## Writing style

- Lead with the control's concrete purpose and observable effect.
- Use the exact Lumina Studio UI terms, followed by plain-language explanations
  of technical concepts such as lightness, chroma, color space, or thresholds.
- State verified numbers and units explicitly. Explain boundary and sentinel
  values such as `0`; do not call a default value “best” unless testing proves
  that claim for a defined workflow.
- Explain adjustment direction with cause and effect: what changes, what may
  improve, and what may be lost.
- Distinguish examples from requirements. Avoid prescribing one printer, slicer,
  nozzle, material, or value when the software does not require it.
- Do not use conversational filler, “just look at the answer first”, vague
  marketing language, or unsupported recommendations.
- Do not expose internal file paths, private repositories, infrastructure,
  credentials, account data, or unpublished operational details.
- Re-check code and screenshots after relevant software updates. Mark behavior
  as version-sensitive when it cannot be guaranteed across versions.

## Visual evidence

- Use real Lumina Studio UI captures for control location and state.
- Do not generate, repaint, or reconstruct a fake software interface.
- Focus or annotate the exact target without covering labels, values, or click
  targets. Keep enough surrounding UI to orient the reader.
- Diagrams are allowed for algorithms and decision branches, but must be derived
  from verified behavior and labeled as explanatory diagrams rather than real
  output.
- Keep source captures separate from final annotated assets during production.
- Use Docusaurus-supported relative `require('./assets/...').default` image
  sources in MDX and do not add document-level imports.
- Capture Chinese and English UI separately. Do not reuse a Chinese screenshot
  on an English page when the captured interface itself contains localized text.

## Verification

Before handing a page off for review:

- verify every behavior claim against current code and relevant tests;
- confirm the page and every local asset load in both locale builds;
- run `yarn typecheck` and `yarn build`;
- scan changed public files for secrets, machine-local paths, mojibake, stale
  links, and mixed-language publication content;
- confirm every current user-facing control source is either mapped to a
  bilingual page, deliberately grouped with its parent workflow, or explicitly
  classified as unreachable/internal in the coverage audit;
- provide the local browser preview for visual review before publishing.
