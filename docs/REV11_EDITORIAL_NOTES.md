# Λletheia website — editorial status of technical evidence

## Version sources (11 November 2026)

**Current website documentation:** v1.0-RC1 — draft PR #5 `release/v1.0-rc1` based on Rev13. Evidence: 131 Rust tests, Lean 96 guards, 26/26 differential, 16/16 SIGKILL recovery, grant harness 33/33 refusals and 8/8 controls, no paid Groq calls. RC1 is *not* merged.

## Release and review sources (10 November 2026)

| Track | Status | Evidence |
| --- | --- | --- |
| Marco Zero v0.9 | Consolidated on `Antoniorjr4/Aletheia:main` (`245214b`) | https://github.com/Antoniorjr4/Aletheia |
| Rev10 | Draft PR #1 targeting main | https://github.com/Antoniorjr4/Aletheia/pull/1 |
| Rev11 | Draft PR #2 targeting rev10 | https://github.com/Antoniorjr4/Aletheia/pull/2 |
| Rev11 report | Branch source; *not released* | https://github.com/Antoniorjr4/Aletheia/blob/rev11/docs/REV11.md |
| Rev11 structural matrix | Offline / scripted compromised-oracle experiment | https://github.com/Antoniorjr4/Aletheia/blob/rev11/bench/adversarial/results/MATRIX.md |

## Editorial mapping

- **Consolidated v0.9**: T1, T2, T3, T6 and T9 over the Lean core; 400 keyless and 400 saga core programs compared across Lean, ARX and Python; first official AgentDojo banking batch 19/144 attack pairs. The bundled legacy PDF is an **archive**, not the latest primary source.
- **Rev10 draft progress (not a stable release)**: 94/144 official AgentDojo banking pairs checked; do not silently overwrite the 19/144 first-batch dashboard denominator or attribute all new results to Rev11.
- **Rev11 review branch**: 600 generated programs with keyed operations, ARX/Python byte-identical and Lean matched after **key normalization** (not identical raw bytes in all three); 1,969 journal mutation rejections; eight deterministic keyed scenarios; formal TimeoutUnknown handler and key lifecycle under model assumptions.
- **Rev11 offline structural adversarial matrix**: 29/29 forbidden cases stopped before effects; 4/4 legitimate controls performed; **3/3 residual within-policy cases were performed**. This is not a live model result and not AgentDojo ASR.
- **Rev11 paid calls**: US$ 0.00 in new model calls. No new Groq/AgentDojo live results were generated in that revision.
- **Open obligations**: key minted independently from capability is Phase 2 and remains unimplemented; no complete Lean-to-Rust/Python refinement proof; policy adequacy is not guaranteed by type soundness.

## Presentation rules

Do not state the draft Rev11 features as a released version. Always differentiate Lean proofs, differential runtime agreement, AgentDojo model behavior (H1), offline structural stress tests (H2), and residual attacks within policy.

The website's visual identity, layout, CSS and assets are not changed by this editorial branch. No secrets or private project identifiers should be published.
