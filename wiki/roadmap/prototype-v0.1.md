# Prototype v0.1: Austria RaceFlow Proof of Fun

**Status:** IMPLEMENTED baseline, awaiting hands-on playtest and tuning.

## Objective

Before building championships, career systems, detailed car databases, multiplayer or large-scale simulation, prove that RaceFlow works across a complete lap and supports basic racing against an opponent.

The prototype should answer:

> Does driving a simplified full lap through RaceFlow create enough rhythm, mastery, consequence and tension that the player wants another lap?

The prototype should be deliberately simple visually. Development effort belongs primarily in controls, timing, feedback and gameplay logic.

## Prototype baseline

| Area | v0.1 target |
|---|---|
| Track | Simplified Austria / Red Bull Ring layout |
| Player | One generic Formula-style car |
| Opponents | One optional simple AI car |
| Camera | Top-down or lightly angled 2.5D |
| Desktop input | A / Space / D |
| Mobile input | Three large touch zones |
| Input actions | Tap, hold, release |
| Core gameplay | RaceFlow timing and short corner phrases |
| Evaluation | Continuous score with readable quality bands |
| Simulation | Speed, basic grip, tyre wear and selected mistakes |
| Racing | Basic overtaking at selected opportunities |
| Platforms | Modern desktop browser + Android browser |
| Performance target | Smooth, responsive play; aim for 60 FPS |

## Why Austria

Austria is a good prototype circuit because a relatively short lap contains several distinct driving situations:

- heavy braking
- uphill braking
- slow traction-limited exits
- long acceleration zones
- overtaking opportunities
- medium/high-speed direction changes
- flowing final corners

That diversity lets one small track exercise much of RaceFlow without requiring a large content build.

The initial circuit representation does not need survey-level geometric accuracy. It should preserve the recognizable overall layout and driving character while remaining easy to tune.

See: [Austria RaceFlow prototype track](../tracks/austria-prototype.md)

## Core lap loop

```text
start/finish
   ->
approach
   ->
RaceFlow corner phrase
   ->
car response
   ->
time / tyre / state consequence
   ->
next section
   ->
complete lap
   ->
lap result
   ->
repeat
```

The full lap should develop a recognizable rhythm rather than feel like ten unrelated minigames.

## Required systems

### 1. Visible race scene

At minimum:

- recognizable circuit shape
- track surface
- grass / runoff distinction
- kerbs or clear track edges
- generic Formula-style player car
- optional AI car
- visible movement through braking, apex and exit

Graphics may be extremely simple.

### 2. Track-following simulation

The car normally follows a track/racing-line representation rather than being continuously steered by the player.

RaceFlow execution should modify parameters such as:

- braking distance
- corner-entry speed
- racing-line offset
- apex accuracy
- exit speed
- stability

The player influences *how well the driver executes the corner*, not raw steering coordinates.

### 3. RaceFlow phrases

Each corner may contain roughly 2-4 meaningful events.

Possible phases:

- braking initiation
- hold
- release
- turn-in
- apex
- direction change
- exit / traction

Example:

```text
BRAKE HOLD -> RELEASE -> APEX -> EXIT
```

Different corners should use different phrases where the driving situation warrants it.

### 4. Continuous timing evaluation

Internally, execution should be representable as a continuous normalized value.

Example conceptual range:

```text
0.00 = catastrophic
0.25 = poor
0.50 = acceptable
0.75 = good
1.00 = perfect
```

These values are EXAMPLES, not final thresholds.

The player-facing presentation should use understandable bands such as:

- perfect
- good
- minor mistake
- major mistake
- catastrophic mistake

### 5. Dynamic timing windows

Timing targets should have green/orange/red-style quality regions.

Even in v0.1, selected state changes should be able to alter the window.

At minimum consider:

- tyre wear
- temporary grip loss
- attack state / overtaking context

### 6. Visible car consequences

Execution must change what the player sees.

Required prototype outcomes include:

- optimal line
- slightly compromised line
- run wide
- lock-up
- wheelspin / poor traction
- spin for severe failure

The car must not simply follow the same animation while numbers change invisibly.

### 7. Basic tyre consequences

The tyre model should initially be intentionally small.

Possible internal state:

```text
frontGrip
rearGrip
tyreWear
```

Examples:

**Lock-up**

```text
front grip temporarily reduced
+ tyre wear
+ immediate time loss
```

**Wheelspin**

```text
rear grip temporarily reduced
+ tyre wear
+ poor acceleration
```

**Spin**

```text
large time loss
+ larger tyre penalty
```

Bad driving should make later driving somewhat harder, demonstrating persistent consequences without requiring a complete tyre simulation.

### 8. Cross-platform controls

The same gameplay logic must work through input adapters.

Desktop baseline:

```text
A       SPACE       D
LEFT    COMMIT      RIGHT
```

Mobile baseline:

```text
LEFT ZONE    CENTER ZONE    RIGHT ZONE
```

Supported v0.1 gestures:

- tap
- hold
- release

Do not add swipe or double-tap requirements until the basic vocabulary proves insufficient.

### 9. Lap timing and feedback

The prototype should track at least:

- current lap time
- previous/best lap
- section/corner execution result
- visible time gained/lost where practical
- current tyre state in a simple form

The player should be able to explain why a lap was faster or slower.

### 10. One optional AI opponent

The AI can be simple and parameter-driven.

Candidate parameters:

```text
skill
consistency
risk
```

The AI may internally generate execution quality instead of using player inputs.

It should be sufficient to test whether RaceFlow can support:

- closing a gap
- following another car
- a small number of overtaking opportunities
- side-by-side continuation where applicable

### 11. Basic overtaking

Prototype overtaking should exist only at selected suitable corners.

Initial candidate decisions:

- inside
- outside
- wait / prioritize exit

The choice modifies the upcoming RaceFlow challenge rather than directly awarding the pass.

The first implementation does not need the final overtaking system. It only needs to validate that tactical choice + execution is more interesting than an overtake button.

## Prototype corner vocabulary

Initial conceptual examples:

```text
T1
BRAKE HOLD -> RELEASE -> APEX -> EXIT

T3
BRAKE -> LONG HOLD -> RELEASE -> TRACTION
heavy braking / primary overtake test

T4
BRAKE -> APEX -> EARLY EXIT
secondary overtake test

T6/T7
LEFT -> RIGHT -> FLOW
direction-change / rhythm test

T9/T10
FAST COMMIT -> COMMIT -> EXIT
high-speed precision test
```

These are PROPOSED mappings and should change freely during playtesting.

## Explicitly out of scope for v0.1

Do not build these before the RaceFlow lap is validated:

- career mode
- season/championship
- multiplayer
- full pit-stop strategy
- weather
- detailed ERS management
- setup screen
- qualifying session structure
- real driver/team roster
- official F1/team branding
- detailed vehicle upgrade tree
- extensive menus
- economy
- progression system
- full damage simulation
- safety car / VSC
- full sporting regulations
- twenty-car grid
- high-fidelity 3D art

## Asset / branding constraint

For the prototype:

- use original generic car art
- use original UI
- avoid official F1 logos
- avoid team liveries
- avoid driver likenesses
- avoid copied commercial game assets

A recognizable circuit layout may be used as prototype test data, but public/commercial release requirements should be reviewed separately before relying on real-world names, branding or licensed assets.

## Success criteria

The prototype succeeds if playtesting suggests:

1. Perfect execution is noticeably satisfying.
2. The player understands why they gained or lost time.
3. Mistakes visibly change car behavior.
4. Corners feel meaningfully different.
5. The full lap develops a recognizable rhythm.
6. Repeated practice makes the player measurably faster.
7. Touch controls feel natural on a phone.
8. Keyboard controls feel equally intentional on desktop.
9. Basic tyre consequences are noticeable without dominating play.
10. Attacking an AI car creates tension beyond normal time-trial play.
11. The player wants to start another lap.

## Questions to answer through playtesting

- Does the player watch the car or mostly stare at the timing UI?
- Are three primary inputs enough?
- How many events per corner feel engaging rather than exhausting?
- How much warning does each event need?
- How narrow can timing windows become on touch input?
- Do tyre penalties improve race storytelling or merely feel punitive?
- Does the AI/overtaking layer distract from validating core RaceFlow?
- Is top-down/2.5D sufficient for reading braking, apex and exit behavior?

## Architecture

Keep these layers separate:

```text
Input Adapter
     |
RaceFlow Event Model
     |
Execution Evaluator
     |
Car / Race Simulation
     |
Track Representation
     |
Presentation
```

Touch and keyboard must feed the same RaceFlow model.

The track, car simulation and presentation should also remain sufficiently decoupled that later visual or simulation upgrades do not require redesigning the controls.

## Development order

Recommended order:

1. Render simplified Austria track and one car.
2. Move car around the circuit using an ideal path.
3. Add one RaceFlow corner.
4. Connect execution quality to visible car behavior.
5. Expand RaceFlow to the full lap.
6. Add lap timing and feedback.
7. Add basic tyre state and persistent consequences.
8. Tune mobile and keyboard input.
9. Add one AI car.
10. Add basic overtaking at selected corners.
11. Playtest repeatedly before expanding game scope.

The prototype should remain small enough that mechanics can be discarded or rewritten cheaply.
