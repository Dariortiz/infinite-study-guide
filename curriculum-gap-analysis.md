# Curriculum gap analysis

Scope check performed 2026-08-29 against the current 30-guide curriculum (MAT / CSC / CRY domains,
sharing the FND, MOT, ART, INF, SYS, PRV, and OPT bundles). This isn't a first-impressions list — every
claim below was checked against actual module headers and lesson content in `guides/*.html`, because the
curriculum is dense enough that a topic can be quietly present in a guide whose title gives no hint of it
(e.g. category theory living inside a guide called "Foundations: Second Pass").

The corrected picture is more flattering to the existing curriculum than a first skim suggests: several
things I initially flagged as missing turned out to be present, just filed under a guide whose name
doesn't say so. The real gaps are narrower and more specific than "topic X is absent."

## Corrections to the initial pass

These were flagged as gaps in an earlier, shallower read and turned out to be wrong once the guide
contents were actually checked:

- **Category theory and scheme/algebraic geometry are covered.** `guides/xfd.html` (Foundations: Second
  Pass, part of the OPT bundle) has a dedicated Category Theory module (Milewski's lectures against
  Riehl's *Category Theory in Context*) and a Schemes module (Borcherds's lecture against Vakil's *The
  Rising Sea*), plus Malliavin calculus, unbounded operator theory, and several complex variables. It's
  real graduate-level content — just optional and not discoverable from the guide's title or the domain
  card's one-line description ("Optional languages behind the languages").
- **Anonymous credentials are covered.** `guides/mpc.html` Module 10 ("Credentials, tokens, and oblivious
  access") treats anonymous credentials, Privacy Pass, and Oblivious HTTP explicitly, with Lysyanskaya's
  BIU Winter School lecture as the anchor.
- **Side-channel and fault-attack cryptanalysis are covered, deliberately distributed rather than
  centralized.** This is the biggest correction. Side channels show up with clear ownership boundaries:
  - `guides/cth.html` Module 05 (Memory Models & Side Channels) — general-purpose timing/cache/speculative
    leakage, Spectre/Meltdown, Rowhammer, constant-time auditing at the ISA/microarchitecture level.
  - `guides/pqc.html` Module 08 (Constant time, side channels, and faults) — timing, power, EM, fault, and
    rejection-sampling leakage specific to lattice/code/hash-based PQC, with named PQCrypto talks on HQC
    power analysis and chosen-ciphertext side channels.
  - `guides/tee.html` Module 6 (Side channels) — enclave-specific leakage (SGX/Sanctum literature).
  - `guides/trc.html` Module 03 — cache-timing and AES-NI considerations for classical block ciphers.
  Each guide explicitly disclaims overlap with the others (e.g. CTH: "enclave attestation and
  confidential-computing-specific mitigations are deliberately left to the TEE guide"). This is a
  coherent design decision, not an accidental gap — the curriculum treats side-channel analysis as a
  cross-cutting concern owned by whichever guide's threat model it belongs to, rather than a standalone
  subject.
- **Distributed systems *theory* is covered.** `guides/cth.html` Module 02 (Distributed Algorithms) uses
  Kleppmann's Cambridge Distributed Systems series and MIT 6.852, and the conference extras explicitly
  point to the original Raft paper/talk. Consensus impossibility results, agreement protocols, and
  distributed-algorithm proofs are real content here — this is not the same gap as "no distributed
  systems at all."
- **Classical algorithms, discrete math, networking, and OS/architecture all have prerequisite-level
  coverage.** `guides/pre.html` (the FND campus's prerequisite guide) runs through MIT 6.006 (hashing,
  BFS/DFS/shortest paths, P/NP and reductions), MIT 6.042J (discrete math, graph theory, combinatorics),
  Stanford's intro networking course (layering, TCP/UDP/DNS), Nand2Tetris, and MIT 6.S081 (OS
  internals). None of this is deep — it's explicitly scoped as "what you need before the crypto-heavy
  guides make sense" — but it means these subjects aren't blank slates the way, say, machine learning is.
- **Some geometry is present, just always in service of dynamics.** `guides/alg.html` Module 03
  ("Topology for Dynamics") explicitly caps itself at "quotient spaces, homotopy, degree, and homology
  only to the level later dynamics and Conley theory consume." `guides/xds.html` (Dynamics: Second Pass)
  has real symplectic-geometry and Hamiltonian-mechanics content (symplectic manifolds, moment maps, KAM
  theory, Conley theory). So general topology and differential geometry exist as *tools consumed by
  dynamical systems*, never as subjects in their own right.

## Confirmed genuine gaps

These were checked against the full text of every guide (not just titles) and found to have no real
content anywhere in the curriculum — including a keyword sweep for terms like "differential privacy,"
"convex optimization," "PAC learning," "mixnet," and "model theory" across all 30 guide files, all seven
campus indexes, and all three domain indexes.

### 1. Differential privacy — the sharpest gap
The PRV campus ("Mathematical Privacy") bundles TRC, FHE, ZKP, PQC, and MPC — four of the five major
modern privacy primitives. DP (the statistical-noise mechanism behind census disclosure control, RAPPOR,
Apple/Google telemetry, and DP-SGD in ML training) has zero presence: no module, no lesson, no passing
mention. It doesn't fit naturally inside any existing guide either — FHE/ZKP/MPC/TEE are all about
*computing without revealing inputs*, whereas DP is about *bounding what any output reveals*, which is a
different mathematical object (composition theorems, privacy budgets, the exponential mechanism) that
none of them touch. Given how deliberately the PRV bundle already reads as "the five pillars of
privacy tech," this is the one gap that feels structurally incomplete rather than merely additional.

### 2. Machine learning / statistical learning theory
The only ML-adjacent content in the entire curriculum is a single video citation in `guides/arc.html`
(a Tübingen Machine Learning course on neural compression, used only for its relevance to compression) and
a single "Bayesian workflow" video buried in `guides/csf.html`'s MCMC & HPC extras. There is no treatment
of PAC learning, VC dimension, generalization bounds, or any deep learning theory. This is the largest
outright absence in the curriculum relative to its real-world footprint in current CS.

### 3. Mathematical optimization as its own discipline
Every "optimization" hit in the codebase (`plv.html`, `dlt.html`, and others) turned out to be compiler
optimization or smart-contract gas optimization — ordinary engineering usage, not the mathematical field.
There is no convex analysis, LP/duality, or combinatorial optimization content anywhere. `guides/lat.html`
uses "convex" only in the geometry-of-numbers sense (convex bodies, Minkowski's theorem), which is a
different subject entirely. SIM and DSZ cover numerical *simulation* but not optimization as a
mathematical object.

### 4. Statistical inference as a discipline distinct from probability
PRB is explicitly a *probability* guide (measure-theoretic foundations, conditional expectation,
martingales, weak convergence) — it deliberately does not cover estimation theory, hypothesis testing, or
Bayesian inference as statistical practice. CSF's single "Bayesian workflow" video is the only toehold in
the entire curriculum.

### 5. Combinatorics and graph theory as depth subjects
PRE gives graph theory and combinatorics genuine but explicitly introductory treatment (Leighton's 6.042J,
Numberphile). No guide takes either to research depth — no extremal combinatorics, Ramsey theory,
probabilistic method, or algebraic graph theory the way PRB takes probability from PRE's intro level to
measure-theoretic depth.

### 6. Algorithm design as depth subject (separate from complexity theory)
CSF covers automata/computability/complexity and CTH covers average-case and fine-grained complexity
(conditional lower bounds like SETH/3SUM/APSP) — both are about *hardness*, proving what's hard and why.
Neither is a course in *designing* efficient algorithms (greedy strategies, DP as a general paradigm,
amortized analysis, advanced data structures, approximation algorithms). PRE's 6.006 citations are
intro-level. There's a real gap between "here's P vs NP" and "here's how to actually build an efficient
algorithm," which is exactly the gap a classical CLRS-style course fills.

### 7. Mathematical logic, set theory, and model theory
No guide touches Gödel's theorems, model theory, or set-theoretic independence results as mathematical
subjects (CSF's "Computability" module is about Turing machines/decidability, a CS framing, not
foundational logic). A search for "Gödel" and "model theory" across every guide returned nothing.

### 8. Anonymous communication networks
MPC's credentials module covers anonymous *credentials* (issuance/showing/unlinkability for identity
tokens) but nothing covers anonymous *communication* — mixnets, onion routing, or traffic-analysis
resistance as their own subject. This is a narrower, more specific gap than my first pass's "privacy tech
beyond ZK/MPC" — the credentials half of that space is already handled; the network-layer half isn't.

### 9. Quantum computing as its own subject (algorithms/complexity, not just resistance)
PQC treats quantum computers strictly as *the threat model to defend against* (Shor/Grover appear only as
named attacks a scheme must resist). No guide treats quantum computing as a subject in itself — quantum
circuits, BQP, quantum algorithms beyond Shor/Grover, or quantum information theory.

## Things worth double-checking if any of the above get built out

- If differential privacy is added, decide whether it belongs as a new guide in the PRV bundle (matching
  TRC/FHE/ZKP/PQC/MPC's structure) or as a module bolted onto an existing one — a standalone guide seems
  more consistent with how deep every other PRV guide already goes.
- If an algorithms guide is added, it will need an explicit boundary statement against CTH and CSF the
  same way TEE/CTH/PQC/TRC already cross-disclaim side-channel scope, since "algorithm design" abuts
  "algorithm hardness" (CTH) and "computability" (CSF) closely enough that overlap is likely without one.
- If ML is added, FHE and PQC both already gesture at ML workloads as *use cases* (encrypted inference,
  side-channel-resistant inference) — worth checking those guides for lessons that assume ML background
  the curriculum doesn't yet provide.
