# Within-guide gap analysis

Scope check performed 2026-08-29 against the current 30-guide curriculum. `curriculum-gap-analysis.md`
already catalogs *entirely absent subjects* (differential privacy, ML/statistical learning theory,
optimization, mixnets, etc.) — fields the curriculum doesn't touch anywhere. This document is the
complementary, finer-grained pass: for each of the 30 existing guides, does the guide deliver on what its
*own* module structure implies, and does it match what a graduate-level self-study course in that specific
subfield should contain? These are gaps inside subjects the curriculum has already committed to teaching.

**Method.** Seven parallel reviews, one per campus, each reading the full lesson-level content of every
guide file in that campus (not just the homepage cards or module titles) and checking it against standard
graduate coverage for that subfield. Findings were then spot-checked directly against the HTML source with
targeted searches (`grep`) for the specific terms each claimed gap depends on — e.g. searching `trc.html`
for `argon2|bcrypt|scrypt|PBKDF|HKDF|PAKE` before concluding key derivation is absent. Every gap below
survived that second check: the search returned either nothing, or (as in TRC's case) a single incidental
mention nowhere near a dedicated lesson. Where a search surfaced content that looked like it might close a
gap, it's noted inline as a false lead rather than silently dropped.

A recurring shape is worth naming up front because it's sharper than an ordinary omission: **a guide's own
exit artifact, exit criteria, or module description names a technique or comparison it never actually
teaches.** SRC asks students to benchmark against a Krichevsky–Trofimov estimator it never derives; SIM's
rare-event module leans on large-deviations reasoning that STO/SPZ never establish; PLV's whole reason for
existing is to feed verification machinery to the protocol guides, and E2E is exactly the guide that needed
it and didn't get it. These aren't missing nice-to-haves — they're internal IOUs the curriculum wrote to
itself and hasn't paid.

**Update, 2026-08-29 — two items closed.** The two gaps this document's "Suggested next step" section
flagged as highest-leverage have been fixed: SRC now teaches the Krichevsky–Trofimov estimator it
benchmarks against, STO now has a Large Deviations module covering exactly what SIM's rare-event module
assumed, and TRC now covers key derivation, password hashing, and password-authenticated key exchange. Each
fix is marked inline below with what was added; the original gap description is left in place as the record
of what was wrong before the fix.

---

## Foundations (FND — `pre`, `ana`, `prb`, `alg`, `csf`)

### ANA — Analysis
No dedicated treatment of **L^p space theory**: Riesz–Fischer completeness, Hölder/Minkowski inequalities,
and L^p duality never appear as their own unit, despite sitting exactly between Module 01 (Measure &
Integration) and Module 02 (Functional Analysis) — both of which need L^p as a working example the moment
they start talking about Banach spaces. A direct source search for `Riesz-Fischer|Hölder|Minkowski
inequality|Banach-Alaoglu|weak-*|reflexive` returned nothing (the one hit was the `placeholder` attribute
on the search box, a false positive).

Relatedly, **weak and weak-\* topology, Banach–Alaoglu, and reflexivity** are absent — standard
second-course functional analysis, and load-bearing for anything that later wants compactness in
infinite dimensions (e.g. calculus of variations, PDE theory, or even just a rigorous treatment of dual
spaces). The guide's spectral theory module also stops at compact self-adjoint operators; general bounded
self-adjoint/normal operator spectral theory and unbounded self-adjoint operators (only gestured at via a
conference-extra Barry Simon talk) are never built up as core content.

### PRB — Probability Language
No coverage of the **Kolmogorov extension theorem** — the result that actually licenses talking about "an
infinite iid sequence" or "a stochastic process" as a single random object living on one probability space,
rather than an infinite family of finite-dimensional distributions asserted by fiat. This is about as
foundational as measure-theoretic probability gets, and every later process-heavy guide (STO, SPZ, DSZ's
random dynamics module) implicitly relies on it having been established somewhere. It hasn't been, in this
guide or any other.

**Kolmogorov's 0-1 law and the Hewitt–Savage 0-1 law** are likewise absent — the standard companion result
students meet in the same breath as tail σ-algebras, and directly useful for the martingale-convergence
module that comes right after in this same guide.

### ALG — Algebra & Spectra
No **field theory or Galois theory** anywhere, despite the assigned textbook (Artin's *Algebra*) covering
both in chapters just past the range this guide actually cites (2–12). For a guide whose stated purpose is
"structure first," stopping at rings/modules without reaching field extensions, splitting fields, or the
Galois correspondence is a genuine hole — not a deferral, since no other guide claims this territory either
(NUM's algebraic number theory module assumes number fields as objects without building the Galois-theory
machinery that explains why they behave the way they do).

**Sylow's theorems** are never explicitly named, only approached obliquely through group actions and the
class equation — core enough to finite group theory that their absence stands out on its own.

The topology module (Module 03, "Topology for Dynamics") explicitly scopes itself as feeding "later
dynamics and Conley theory," but stops at the fundamental group, van Kampen, and CW complexes — no
**homology**. Conley index theory (which does appear later, in `xds.html`) is genuinely homology-based;
this guide sets up the audience for a tool it then doesn't hand them.

### CSF — Computing Foundations
Three numerical-methods gaps cluster around the same seam: no **numerical ODE methods** (time-stepping
schemes, stability regions/A-stability) despite the assigned course (Harvard AM205) covering them; no
**numerical optimization** (gradient descent, Newton's method, line search); and no **numerical eigenvalue
algorithms** (the QR algorithm, power iteration, Lanczos). The last one is the most structurally odd,
because it falls squarely between two guides that each do half the job: ALG builds the *theory* of
eigenvalues/SVD/spectral decomposition with zero numerics, and CSF builds numerical linear algebra
(QR factorization, least squares, quadrature) but never applies numerics to the eigenvalue problem itself.
A student who did both guides back to back still couldn't tell you how `eig()` actually works.

### PRE — Prerequisites
No significant content gaps relative to its actual, narrower job (placement-level math/programming/systems
literacy feeding into the crypto-heavy guides). One navigation rough edge, not a content gap: `pre.html`'s
own hero text, routes, and footer are written entirely in terms of the 8-guide applied-cryptography
sequence (TRC/FHE/ZKP/PQC/MPC/DLT/TEE/E2E) and never mention ANA/PRB/ALG/CSF, even though FND's breadcrumb
sends learners here first. `campuses/fnd/appendix.html` explains this is intentional — PRE is a shared
appendix reused across campuses — but a learner arriving from FND with no prior context would reasonably
wonder why the prerequisite guide for "Analysis" is full of AES and RSA.

---

## Motion (MOT — `dyn`, `sto`, `spz`, `dsz`, `sim`)

### DYN — Dynamical Systems Spine, and DSZ — Dynamical Systems Zoo (paired finding)
**Global bifurcation theory of continuous flows** — homoclinic and heteroclinic bifurcations, and
Shilnikov's theorem on chaos generated near a homoclinic orbit to a saddle-focus — falls into the gap
between these two guides rather than being owned by either. DYN's Module 04 (Bifurcation) covers only
*local* normal forms: saddle-node, Hopf, and the center-manifold reduction that justifies them. DSZ's
Module 05 (homoclinic tangles, Smale horseshoes) covers the *discrete-map* side of homoclinic dynamics.
Global bifurcation theory for flows — the continuous-time analogue — never gets picked up by either guide,
even though DSZ's own module numerically explores the standard map and observes homoclinic tangles forming
without ever connecting that picture to a flow-based bifurcation theorem.

### DYN specifically
No **Floquet theory** — linearizing around a periodic orbit via its monodromy matrix and Floquet
multipliers to determine orbital stability. This is the standard next step after Module 03 (Lyapunov
methods) and is usually taught in the same breath as the Poincaré return map, which the guide does cover;
the guide builds the tool (Poincaré map) but not the theorem that uses it to certify stability.

### DSZ specifically
**Billiards** (Sinai/dispersing billiards) are entirely absent. This is a strange omission for a "zoo"
this exhaustive (15 modules), because billiards are one of the canonical example families in hyperbolic
dynamics and ergodic theory — exactly the territory Module 08 (Hyperbolic Systems) and the thermodynamic
formalism modules are already deep in.

**KAM theory** is reduced to a single conference-extra link (a Trujillo lecture) rather than being taught
as core or optional content in Module 06 (Conservative & Symplectic Maps) — even though that module's own
labs have students numerically observe KAM curves in the standard map without ever proving (or even
stating precisely) the persistence theorem that explains why they're there. `xds.html` (the second-pass
dynamics guide) does eventually give KAM theory a real module, but a learner going through DSZ alone hits a
numerical phenomenon the guide names but doesn't explain.

### STO / SPZ — Stochastic Processes Spine and Zoo (paired finding)
**Large deviations theory** — Cramér's theorem, Sanov's theorem, Varadhan's lemma — is not taught anywhere
in either guide, despite `sim.html`'s rare-event simulation module (Module 05) explicitly building
importance-sampling and exponential-tilting techniques whose entire justification is large-deviations
reasoning (the Bucklew reference cited there assumes it). This is the clearest instance of the "cites a
tool it never teaches" pattern in the whole review: a downstream guide (SIM) assumes upstream content
(STO/SPZ) that was never actually delivered.

> **Fixed 2026-08-29:** added a new Module 08 (Large Deviations) to `sto.html`, with two lessons — Hugo
> Touchette's "A Basic Introduction to Large Deviations" (arXiv:1106.4146), which builds Cramér's theorem,
> Sanov's theorem, Varadhan's lemma, and the contraction principle from one rate-function idea and connects
> directly to importance sampling, plus Durrett's §2.6 (already cited twice elsewhere in this guide) for the
> full measure-theoretic proof of Cramér's theorem that Touchette's applied survey skips. STO's module count,
> unit count, exit criteria, minimum portfolio, and reference shelf were all updated. SIM's rare-event module
> (Module 05) now points back to STO Module 08 by name at the two spots where it was silently assuming the
> theory. SPZ itself was left untouched — the dependency ran through STO/SIM, not SPZ.

A secondary, smaller gap in STO: mixing-time theory beyond the spectral gap — coupling arguments,
total-variation mixing bounds, path coupling — is thin. Module 00 gets the spectral-gap convergence rate
for finite Markov chains but not the broader coupling toolkit that's now the standard modern treatment
(Levin–Peres style).

### SIM — Numerics & Simulation
**MCMC (Metropolis–Hastings, Gibbs sampling)** is missing from the Monte Carlo module (Module 01), which
covers only classical Monte Carlo estimators, importance sampling, and variance reduction — all
*non-adaptive* sampling. This is a genuinely surprising absence given the site's own Markov-chain
foundation is sitting right there in STO Module 00, and given CSF separately has an MCMC & HPC module
(Metropolis–Hastings, diagnostics, Stan) that SIM never cross-references. The two guides each own half of
"how do you actually sample from a hard distribution" without pointing at each other.

Module 05 is titled "Parallel & Rare-Event Methods," but the parallel-simulation half doesn't really exist
as taught content — RNG stream management and parallel seeding strategy show up only as an incidental lab
instruction, not as a lesson with its own reference material.

---

## Arithmetic (ART — `num`, `lat`, `cod`)

### NUM — Number Theory
The analytic number theory module (Module 03) states the Prime Number Theorem but never reaches the
**Riemann zeta function's analytic continuation, functional equation, or zero-free regions** — the
machinery that actually explains *why* the PNT is true and connects to the error term in π(x). For a
module explicitly branded "analytic," stopping at the theorem's statement without any of its proof
apparatus is a real gap, not a stylistic choice, even at a conceptual/non-rigorous level.

**Elliptic curves** get no standalone treatment as number-theoretic objects — they only appear implicitly
via the arithmetic dynamics module (iterating maps on curves), never via their group law, torsion
structure, or the number theory that makes them useful. Given this guide sits directly adjacent to a
cryptography guide network that leans on elliptic curves constantly (TRC's ECDH/ECDSA modules), the absence
of even a pointer to where elliptic-curve arithmetic *is* built is a missing cross-link, not just a missing
topic.

*Explicitly not a gap:* the guide states outright that it stops before class field theory — that's a
disclosed scope boundary, not a silent omission, and is correctly not counted here.

### LAT — Lattices as Mathematics
The most complete guide reviewed in this campus. The one thinness worth naming: **BKZ** — the actual
state-of-the-art lattice-basis-reduction algorithm underlying real cryptographic security estimates — is
never named. LLL is taught thoroughly (Module 06), but a learner leaves this guide able to describe LLL in
detail and unaware that LLL alone hasn't been the security-relevant algorithm for two decades. This is
minor rather than severe, since deep algorithmic hardness analysis is arguably PQC's job, but even a single
pointer lesson would close it.

### COD — Channel Coding
**Turbo codes** are entirely absent — no lesson, no mention, no explicit deferral to another guide. This is
a genuine hole: turbo codes are the historically pivotal capacity-approaching code family that predates and
motivated the modern revival of LDPC codes (which this guide does cover in depth in Module 07), and skipping
straight from classical block/convolutional codes (Modules 01–05) to LDPC/polar (Modules 07–08) leaves out
the construction that bridges them historically and conceptually (parallel concatenation + iterative
decoding, the direct ancestor of belief propagation as taught here).

**General algebraic-geometry codes** beyond Reed-Solomon are absent — the guide's only AG-code contact is a
crossing-pointer to McEliece-style Goppa codes for post-quantum crypto, never the general Goppa/AG
construction as a coding-theory object in its own right.

**Network coding** is absent with no deferral anywhere in the curriculum — a legitimate, established
subfield (linear network coding, random linear network coding) that simply isn't on the map.

---

## Information (INF — `src`, `arc`, `scx`)

### SRC — Source Coding
The clearest "cites a tool it never teaches" instance in the review. Module 04's context-tree-weighting
exit artifact instructs students to "compare binary CTW with fixed-order KT estimators," and Module 07's
exit criteria again ask students to benchmark "excess codelength... for KT, CTW, and LZ" — but no lesson
anywhere in the guide derives or explains the **Krichevsky–Trofimov estimator** itself. Confirmed directly
in the source: `KT estimator` and `Krichevsky-Trofimov` appear only inside exit-artifact and exit-criteria
text (lines 207, 293 of `src.html`), never as the subject of a lesson.

The **method of types** (Cover–Thomas's types/Sanov's-theorem machinery) — the standard large-deviations
technique behind rigorous minimax/finite-block redundancy bounds — is absent, even though Module 07
("Finite-Block Redundancy") assigns Rissanen's paper on exactly this and asks students to "estimate regret"
without ever having been given the apparatus that makes such an estimate rigorous rather than hand-wavy.

> **Fixed 2026-08-29:** added a dedicated lesson on the KT estimator (Krichevsky &amp; Trofimov, "The
> Performance of Universal Encoding," IEEE TIT 1981) as the first lesson in Module 04, deriving the
> closed-form estimator and its minimax redundancy before the CTW lectures that mix over it. Module 04's
> intro, its exit artifact, Module 07's exit artifact, and the guide-wide exit criteria were all updated to
> stop citing an untaught baseline. The method-of-types gap is unchanged — that's a separate, larger piece
> of unaddressed scope, not part of the two items fixed in this pass.

### ARC — Compression Algorithms
Module 01 builds **rANS**, but the production formats the guide studies later — RFC 8878 Zstandard in
Module 07, plus a Yann Collet talk cited in the same module — actually use **tANS/FSE** (a table-based ANS
variant chosen specifically for the speed properties rANS doesn't have). The guide teaches the range-coding
member of the ANS family and then asks students to trace implementations built on the table-based member,
without ever introducing the latter.

**Length-limited (canonical) Huffman construction via package-merge** is absent from both ARC and SRC.
Module 07 has students study DEFLATE, which *mandates* length-limited codes by spec, but no lesson anywhere
teaches the package-merge algorithm (or any other method) for actually constructing them — only
unconstrained Huffman and canonical-code numbering are covered.

**Optimal (cost-based) LZ parsing** is missing — match-finder coverage stops at naive vs. hash-chain
matching, never reaching price-based/optimal parsing, the technique that separates a correctness-level LZ
implementation from a ratio-competitive one like LZMA's real encoder.

### SCX — Compression × Cryptography
This is the tightest guide in the campus, and its one gap is asymmetric rather than missing wholesale:
**attacks are taught as theory, defenses are only assigned as exercises.** CRIME, BREACH, HEIST, dedup
attacks, timing side channels, and zip bombs all get full lessons with primary sources. But the defensive
side — padding schemes, length-hiding, and how you'd formally evaluate whether a given padding strategy
actually resists traffic analysis — appears only inside open-ended lab prompts ("evaluate context
separation, padding, rate limits") with no accompanying lesson on padding-scheme theory or its trade-offs.

*Explicitly not a gap:* lossy compression, neural compression, compressed sensing, succinct data
structures, rsync, Slepian–Wolf coding, and algorithmic information theory are all deliberately deferred to
`xcp.html`, and are genuinely present there — confirmed by skimming that guide for cross-check.

---

## Mathematical Privacy (PRV — `trc`, `fhe`, `zkp`, `pqc`, `mpc`)

### TRC — Traditional Cryptography
**Password hashing and key-derivation functions are entirely absent.** No PBKDF2, bcrypt, scrypt, or
Argon2 (RFC 9106) anywhere in the guide, and no dedicated key-derivation lesson at all — the only mention of
HKDF in the entire file is one clause inside the TLS 1.3 capstone's description ("HKDF for the key
schedule"), confirmed directly in the source (`trc.html` line 215). For a guide explicitly framed as "the
classical toolbox" that every other crypto guide assumes you already have, this is a load-bearing gap:
password storage and key derivation are among the most common cryptographic tasks a working engineer
actually does, arguably more often than implementing RSA from scratch.

**No CSPRNG/DRBG construction.** Module 1 teaches the *failure* mode in depth (the 2008 Debian OpenSSL PRNG
disaster) but never teaches how a cryptographically secure PRNG is built correctly — NIST SP 800-90A's
Hash_DRBG/HMAC_DRBG/CTR_DRBG, or Fortuna. The guide diagnoses the disease thoroughly and never presents the
cure.

**No PAKE protocols** (SPAKE2, OPAQUE, or WPA3's Dragonfly). Given the guide already builds Diffie–Hellman
and ElGamal from first principles, password-authenticated key exchange — how you get a strong shared secret
out of a weak, human-memorable password without leaking it to an eavesdropper or offline dictionary attack —
is a natural and currently very relevant extension (OPAQUE is an active IETF draft) that's simply not there.

> **Fixed 2026-08-29:** added three lessons. Module 05 (Hash functions and MACs) gained RFC 5869 (HKDF) as
> its own dedicated lesson — general-purpose key derivation, previously only a one-clause mention inside the
> TLS capstone — and RFC 9106 (Argon2) covering the PBKDF2 → bcrypt → scrypt → Argon2 password-hashing
> lineage and why password hashing needs the opposite property (deliberate, memory-hard slowness) from
> HKDF's speed. Module 08 (DH, ElGamal &amp; ECC) gained RFC 9382 (SPAKE2) as a PAKE lesson, contrasting it
> with the certificate-based MITM fix two lessons earlier and naming OPAQUE as the asymmetric successor now
> moving through IETF standardization. The module intros, "Stay in this guide" callout, exit criteria,
> minimum portfolio, and reference shelf were all updated; the guide's unit count moved from 50 to 53 and its
> full-deep-route estimate from ~48h to ~50h.

### FHE — Fully Homomorphic Encryption
No significant gaps. This is the most complete guide in the campus: lattices/LWE, Gentry's bootstrapping
blueprint, BGV/BFV/CKKS, TFHE, compiler tooling (OpenFHE, Concrete, HEIR), and even a security notion
specific to approximate schemes (IND-CPA^D) are all present. Threshold/multi-key FHE is mentioned only in
passing, but the guide explicitly treats that as MPC-composition territory belonging to `mpc.html`, which is
a defensible scope call rather than an oversight.

### ZKP — Zero-Knowledge Proofs
**MPC-in-the-head is completely absent.** This is a major, independent ZK paradigm (Ishai–Kushilevitz–
Ostrovsky–Sahai and onward) that produced real standardized-track output — Picnic was a NIST PQC signature
round-2 candidate, and the ZKBoo/Banquet/Limbo line continues it. Given how exhaustively this guide
otherwise tracks every other SNARK/STARK lineage (Groth16 through folding schemes and zkVMs), a complete
silence on the one paradigm that bridges MPC and ZK stands out as a genuine hole rather than a scope choice.

Smaller: **Bulletproofs** (logarithmic-size range proofs with no trusted setup) are never named explicitly,
though the guide does cover inner-product-argument commitments generically enough that this is closer to a
missing label than a missing concept.

### PQC — Post-Quantum Cryptography
No significant gaps. The most exhaustive guide reviewed in the entire curriculum: quantum threat models,
SIS/LWE, ML-KEM/ML-DSA, SLH-DSA and the hash-based-signature lineage, code-based KEMs (HQC, Classic
McEliece, FrodoKEM), FN-DSA, side-channel and fault-attack content, and migration/deployment guidance are
all present with current (2025–2026) sourcing. The only omission worth naming is isogeny-based signatures
(SQIsign, the post-SIKE-break research direction) — defensible to leave out since nothing in that family is
standardized yet.

### MPC — Secure Multiparty Computation
**Secure aggregation for federated learning** (Bonawitz et al.'s Google-style protocol, also used at Apple)
is absent. This is a widely deployed, practically important MPC application — combining secret sharing or
pairwise masking with dropout-resilience at scale — that is genuinely distinct from the generic BGW/SPDZ
material and from the PSI/anonymous-credentials modules already present. Given how much attention this
guide already pays to deployed real-world systems (private-set-intersection ad measurement, CSAM detection,
threshold wallets), the absence of the flagship deployed federated-learning protocol is a real hole rather
than scope creep.

*Explicitly not a gap:* anonymous credentials, Privacy Pass, and Oblivious HTTP are all genuinely covered
(Module 10, anchored on Lysyanskaya's BIU lecture) — an earlier shallow read of this guide would have
missed this since it's not obvious from the module title, but it's real content.

---

## Systems & Protocols (SYS — `dlt`, `tee`, `e2e`, `plv`, `cth`)

### DLT — Consensus & Settlement
**State expiry / statelessness** (Verkle trees, witness-carrying stateless clients) is absent — a major
pillar of Ethereum's actual scaling roadmap that sits alongside the data-availability/blob content this
guide already covers in depth (Module 08). Confirmed absent via direct source search (`verkle|state
expiry|statelessness` returns nothing in `dlt.html`).

**On-chain governance and upgrade coordination** — contentious hard-fork mechanics, the EIP process,
timelock/multisig governance of protocol parameters — is never treated as its own topic. The guide covers
*smart-account*-level permission and upgrade authority deeply (account abstraction, ERC-4337) and repeatedly
flags "who controls the upgrade key" as a trust assumption worth naming, but never turns that lens on
protocol-level governance itself.

### TEE — Confidential Computing
**Confidential GPU/accelerator computing** — NVIDIA Hopper-generation confidential computing, composite
CPU+GPU attestation chains — appears as exactly one conference-extra link, not a core module, despite the
guide itself naming confidential ML inference as a primary current use case for TEEs.

**Physical fault-injection attacks** (voltage and clock glitching — Plundervolt, VoltPillager, CLKSCREW) are
absent from the threat model. Module 6 (Side Channels) is thorough on purely microarchitectural and software
leakage (controlled channels, Foreshadow, Spectre) but never addresses the physical-adversary fault class,
which is a standard component of the TEE threat model in the actual literature this guide otherwise cites
carefully.

### E2E — TLS, Noise, Signal & MLS
**Formal protocol-verification tooling** — Tamarin, ProVerif, CryptoVerif — is missing. Noise Explorer's
symbolic analysis gets one mention, but the actual methodology used to produce the formal security proofs
this guide cites for TLS 1.3, Signal, and MLS is never taught. This is a notable asymmetry given that PLV,
the sibling guide in the same campus, exists specifically to supply verification machinery (TLA+, Coq,
SMT) to protocols elsewhere in the curriculum — E2E is exactly the guide that needed it, and the two never
connect.

### PLV — Languages & Verification
**Hoare logic and separation logic are completely absent.** Confirmed via direct source search — zero
hits for either term anywhere in `plv.html`. This is the standard bridge between operational semantics
(Module 0, which this guide does build) and practical program verification of real systems code, and it's
exactly the kind of tool the rest of this campus needs to verify the enclave code, ratchet
implementations, and consensus logic that DLT/TEE/E2E are all about. Its absence is a structural gap, not
a stylistic one, and it directly connects to the E2E gap above: PLV is the guide that should be teaching
the machinery E2E is missing.

Smaller: no polymorphism/parametricity (System F) or type-and-effect systems — the type-theory module stops
at simply-typed progress/preservation before reaching a proof assistant, which is thin for a "graduate
level" claim on type theory specifically.

### CTH — Complexity & Hardware
**Parallel algorithm complexity** (PRAM models, work-span analysis, Brent's theorem) is missing. Module 02
covers only message-passing distributed-algorithm models (Kleppmann-style, plus Raft/consensus
impossibility results) — genuinely good content, but a different model of parallelism than shared-memory
PRAM analysis, which would sit naturally alongside this guide's hardware modules (pipelining, caches,
out-of-order execution) since those are fundamentally about multicore execution. Everything else in this
guide — average-case complexity, fine-grained/conditional lower bounds, speculative-execution attacks,
constant-time coding — is well covered with no significant gaps.

---

## Optional / Second-Pass (OPT — `xcp`, `xsp`, `xds`, `xfd`)

These four guides are explicitly framed as selective "whatever's interesting beyond the core" extensions,
not complete curricula, so they're held to a different bar here: not "is the whole field covered" (it's not
supposed to be) but "does the guide deliver on the specific scope it names for itself." Each one has exactly
one internal loose end of that kind:

- **XCP** (Compression Second Careers) — Module 05's exit artifact explicitly asks students to "compare
  fixed and content-defined chunking," but content-defined chunking (Rabin-fingerprint-based CDC) is never
  taught by either lesson in that module: the rsync lesson covers only fixed-size rolling-checksum block
  matching, and the paired Slepian–Wolf lesson is unrelated distributed-coding theory. The module promises a
  comparison it doesn't equip students to make.
- **XSP** (Processes: Second Pass) — Module 04 (Random Matrices) points its conference-extras section at
  Tao's proof of Wigner universality, a proof built on Dyson Brownian motion / stochastic interpolation —
  but Dyson Brownian motion itself (a *process*, in a guide literally titled "Processes") is never
  introduced anywhere in the module's actual lessons, which cover only static ensembles and the semicircle
  law.
- **XDS** (Dynamics: Second Pass) — Module 04 states its own scope as moving "from iteration pictures to
  normal families, Julia sets, and parameter space," but no lesson, lab, or exit artifact in the module ever
  addresses parameter space (Mandelbrot-set-style bifurcation across a parametrized family of maps) —
  everything actually delivered concerns a single fixed map's Julia/Fatou behavior.
- **XFD** (Foundations: Second Pass) — Module 04 bundles several complex variables with Riemann surfaces,
  but the SCV component (a Hartogs's theorem lecture) is the only lesson across all four OPT guides with no
  paired written reference — the module's sole assigned text (Forster) is strictly one-variable
  Riemann-surface theory and doesn't touch several complex variables at all.

*Explicitly not gaps, confirmed by reading full contents rather than titles:* category theory and
scheme-theoretic algebraic geometry are genuinely present in `xfd.html` (Milewski/Riehl for category theory,
Borcherds/Vakil for schemes) despite the guide's generic title giving no hint of it; symplectic geometry and
KAM theory are genuinely present in `xds.html`.

---

## Cross-cutting patterns

1. **"Cites a tool it never teaches"** is the most common failure mode found, and it's more actionable than
   an ordinary omission because the fix location is already identified by the guide itself: SRC's KT
   estimator and STO/SIM's large-deviations dependency (both **fixed 2026-08-29** — see above) were the two
   instances in the core curriculum; XSP's Dyson Brownian motion, XCP's content-defined chunking, and XDS's
   parameter-space dynamics are the same pattern in the lower-priority OPT campus and remain open.
2. **Attack taught, defense left as an exercise**: SCX (padding/length-hiding theory) and, more mildly, TRC
   (CSPRNG construction, taught only by its failure case) both go deep on how something breaks and shallow
   on the formal theory of the fix. Still open.
3. **A topic stranded between two adjacent guides that each assume the other covers it**: global bifurcation
   theory of flows (DYN local-only / DSZ discrete-only), numerical eigenvalue algorithms (ALG
   theory-only / CSF numerics-but-not-this), and formal protocol verification (PLV builds the machinery /
   E2E is the guide that needed it and never gets it). Still open.
4. **Load-bearing "real-world" gaps in otherwise rigorous guides**: TRC's missing password hashing/KDFs
   (**fixed 2026-08-29** — see above) and MPC's missing federated-learning secure aggregation (still open)
   were both cases where a guide covers the elegant theoretical construction in full but skips the version
   of the same idea that most working engineers actually touch day to day.

## Suggested next step

~~If any of these get built out, the highest-leverage fixes are the four "cites a tool it never teaches"
items in SRC/STO/SIM, since closing them doesn't require a new module — just one lesson each, slotted
exactly where the guide already points. The TRC key-derivation/PAKE gap is the highest-leverage *new*
content gap, since it's the guide every other crypto guide assumes is already complete.~~ **Done —
see the "Fixed 2026-08-29" notes under SRC, STO/SPZ, and TRC above.** Of what's left, the next-highest-leverage
items are: closing PLV's Hoare/separation-logic gap (it directly unblocks the E2E formal-verification gap,
the same "stranded between two guides" shape that made SRC/STO worth fixing first), and MPC's missing
federated-learning secure-aggregation lesson (the same "real-world load-bearing gap" shape as the TRC fix).
