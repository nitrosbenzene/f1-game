# RaceFlow Control System

**Status:** DECIDED baseline, with individual parameters still subject to playtesting.

## Purpose

RaceFlow is the core driving interaction model.

The player does **not** continuously steer, brake and accelerate through traditional racing controls. Instead, the car progresses through the circuit while the player executes the important driving actions that determine how well each section is driven.

RaceFlow should translate Formula-style driving into a combination of:

- timing
- rhythm
- short input combinations
- holds and releases
- dynamic precision windows
- situational decisions
- controlled risk

The goal is to make a successful corner feel satisfying on both a phone and a desktop browser.

## Core loop

For each relevant track section:

1. The player approaches a braking/cornering/traction event.
2. The game communicates the upcoming execution challenge.
3. The player performs one or more inputs.
4. Each input is evaluated continuously, not merely pass/fail.
5. The game converts the result into car behavior.
6. The result affects lap time and, where appropriate, tyres, temperatures, wear, damage or the next section.
7. The player immediately sees and feels the consequence.

Conceptually:

```text
car + track + race state
          |
          v
  RaceFlow challenge
          |
          v
     player input
          |
          v
execution quality
          |
          v
car behavior + lap time + consequences
```

## Input vocabulary

The physical control vocabulary should remain small.

### Mobile

Primary target: landscape orientation with large touch regions suitable for two thumbs.

Candidate input vocabulary:

- tap
- hold
- release
- double tap
- swipe left/right

Avoid a permanent virtual steering wheel, tiny brake pedal or tiny throttle pedal.

### Desktop

The same gameplay events must map cleanly to keyboard input.

Initial candidate mapping:

- `A` / left action
- `Space` / central or commit action
- `D` / right action

Arrow keys may be supported as an alternative.

**Important:** Desktop and mobile should share the same gameplay logic. Input devices are adapters, not separate game modes.

## Driving phrases

A corner is not necessarily one button press. It can be a short driving phrase.

### EXAMPLE: simple corner

```text
HOLD brake-action -> RELEASE -> TAP apex -> HOLD exit
```

### EXAMPLE: direction-change sequence

```text
LEFT -> RIGHT -> COMMIT -> LEFT -> COMMIT
```

The sequence represents meaningful phases of driving rather than arbitrary rhythm notes.

Potential phases include:

- braking initiation
- braking pressure / hold
- brake release
- turn-in
- apex
- change of direction
- traction / exit
- kerb handling
- shift or drivetrain events where appropriate

## Dynamic quality window

Inputs are judged using a continuous quality window.

Conceptual scale:

```text
BAD      GOOD       PERFECT       GOOD      BAD
RED      ORANGE      GREEN        ORANGE    RED
 |----------|==========|==========|----------|
                        ^
                     input
```

The exact visualization can change, but the gameplay concept is fundamental.

Possible result bands:

- perfect
- good
- minor error
- major error
- catastrophic error

There should also be continuous scoring inside/between bands where useful. Two "good" inputs do not have to be numerically identical.

## Dynamic difficulty

The ideal window must react to race state.

Possible modifiers include:

- tyre compound
- tyre wear
- tyre temperature
- track temperature
- rain / surface water
- fuel load
- aerodynamic balance
- setup
- floor or wing damage
- dirty air
- car characteristics
- track evolution
- driver/race conditions
- attack/defence state

### EXAMPLE

Fresh tyres may provide a wider traction window.

Worn rear tyres may narrow or destabilize the exit window.

A damaged front wing may make turn-in timing less forgiving.

A wet track may move the optimal target and increase uncertainty.

Exact values are not yet specified.

## Flow / combo

**Status:** PROPOSED, strong candidate.

Consistently strong execution builds a Flow streak.

```text
PERFECT
PERFECT
GOOD
PERFECT

FLOW x4
```

Flow exists primarily to:

- reinforce mastery
- provide immediate feedback
- create rhythm across a lap
- make repeated laps satisfying

Flow should **not** become an arcade speed multiplier detached from racing reality.

Possible subtle effects may include confidence, consistency or reduced execution noise, but any mechanical bonus needs playtesting.

## Risk selection

**Status:** PROPOSED.

For selected corners or sections, the player may choose how aggressively to approach the event.

Conceptual modes:

| Mode | Potential pace | Execution difficulty | Consequence risk |
|---|---:|---:|---:|
| Safe | lower | easier | lower |
| Push | normal/fast | normal | normal |
| Attack | highest | harder | higher |

The key rule is:

> Attack does not grant free speed. It grants the opportunity to gain speed through harder execution.

This allows player skill and race strategy to meet in the same system.

## Avoiding the "Guitar Hero problem"

RaceFlow must not devolve into memorizing abstract symbols while ignoring the race.

The player should be able to understand why an input is required by watching:

- the approaching corner
- braking zone
- racing line
- relative car position
- grip state
- opponent position
- weather / surface state

Prompts are assistance and representation, not a replacement for the racing scene.

As player skill increases, UI assistance may be reduced.

## Track identity

A major long-term goal is for circuits to have recognizable rhythms.

A player should eventually recognize sections through their execution pattern, braking cadence and corner flow.

Fast direction-change sections should feel different from:

- hairpins
- long traction-limited exits
- high-speed sweepers
- chicanes
- street-circuit stop/start sequences

## Design invariants

These should not be changed casually:

1. No requirement for continuous analog steering.
2. No requirement for continuous analog throttle/brake.
3. Input quality is not binary.
4. Car/race state changes the execution challenge.
5. Mistakes create visible driving consequences.
6. The control system must remain viable on phone touch input and desktop keyboard input.
7. The visible race must remain central to play.

## Open questions

- Exact number of primary touch zones.
- Whether directional inputs are literal left/right or contextual actions.
- How early prompts are shown.
- Whether advanced players can hide most prompts.
- Whether Flow has mechanical effects or is primarily scoring/feedback.
- Whether manual shifts are part of normal RaceFlow, an optional advanced layer, or fully automatic.
- How much execution is required on straights.
- Accessibility options for timing windows and input gestures.
