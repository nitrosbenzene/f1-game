# Austria Prototype Track

**Status:** PROPOSED prototype content.

## Purpose

Use a simplified Austria / Red Bull Ring-inspired layout as the first complete RaceFlow test circuit.

The goal is not high-fidelity circuit simulation. The goal is to provide a compact lap with enough variation to test:

- heavy braking
- uphill braking
- traction-limited exits
- long acceleration zones
- direction changes
- fast-corner timing
- overtaking
- multi-corner rhythm

## Representation

The first implementation should favor tuning speed over visual fidelity.

Recommended representation:

- top-down or lightly angled 2.5D view
- spline/path-based car movement
- simplified track polygon
- simple grass/runoff
- visible kerbs or track-edge markers
- minimal elevation cues if useful
- one generic Formula-style car

The car should normally follow an ideal path. RaceFlow execution modifies its speed, line and stability around that path.

## Prototype sections

The exact segmentation is open to iteration.

### Start/finish and approach to T1

Purpose:

- establish speed
- introduce upcoming RaceFlow event
- teach braking preparation

### T1

Primary mechanic:

- braking initiation
- hold/release
- apex timing
- traction on exit

Conceptual phrase:

```text
HOLD -> RELEASE -> APEX -> EXIT
```

This should be one of the clearest introductory corners.

### T2 / uphill transition

Use mainly as pacing and preparation rather than forcing a large standalone interaction if that harms flow.

### T3

Primary mechanic:

- heavy uphill braking
- long braking phase
- exit traction
- overtaking

Conceptual phrase:

```text
BRAKE -> HOLD -> RELEASE -> TRACTION
```

T3 is a candidate for the primary overtaking-system test.

Potential mistake outcomes:

- lock-up
- overshoot
- compromised apex
- poor traction
- pass attempt failure
- side-by-side exit

### T4

Primary mechanic:

- braking after acceleration
- apex precision
- exit prioritization
- overtaking/defence

Conceptual phrase:

```text
BRAKE -> APEX -> EARLY EXIT
```

This can test a different overtaking trade-off from T3.

### Middle flowing section

Purpose:

- reduce stop/start feeling
- test rhythm
- make execution feel linked across corners

T6/T7 candidate phrase:

```text
LEFT -> RIGHT -> FLOW
```

The actual input mapping may remain contextual rather than literally representing steering.

### T9/T10

Primary mechanic:

- high-speed commitment
- consecutive timing
- lap-ending pressure

Conceptual phrase:

```text
FAST COMMIT -> COMMIT -> EXIT
```

The final sequence should make a strong lap feel satisfying and make the player immediately want to compare the next lap.

## Overtaking zones

Initial prototype candidates:

- T1
- T3
- T4

Not every opportunity should trigger a dedicated overtake interaction.

The system should only expose tactical choices when the gap and race state make a move plausible.

Initial tactical choices can remain minimal:

- inside
- outside
- wait / prioritize exit

These choices modify upcoming RaceFlow difficulty and line state.

## Track data requirements

The first track format should be data-driven rather than hardcoded into rendering or gameplay.

Likely data categories:

- center/ideal path
- track width
- section boundaries
- corner IDs
- RaceFlow event definitions
- braking/apex/exit markers
- overtaking-enabled zones
- baseline speed profile
- mistake/runoff behavior
- optional visual metadata

The exact schema should be designed during implementation.

## Prototype tuning principle

Accuracy is subordinate to gameplay during v0.1.

If a geometrically accurate corner produces poor RaceFlow gameplay, tune:

- timing
- event placement
- visual scale
- speed
- window widths
- section boundaries

before adding simulation complexity.

## Validation goals

By the end of the Austria prototype, we should know:

1. Whether a complete lap feels coherent.
2. Whether different corners have distinct rhythms.
3. Whether the player watches the circuit as well as the UI.
4. Whether practice creates obvious improvement.
5. Whether persistent tyre/grip consequences affect later corners in an understandable way.
6. Whether basic overtaking integrates naturally with RaceFlow.
7. Whether the same lap works comfortably with touch and keyboard controls.
