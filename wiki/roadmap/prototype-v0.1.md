# Prototype v0.1: RaceFlow Proof of Fun

**Status:** DECIDED development target.

## Objective

Before building championships, career systems, real circuits, detailed car databases or large-scale simulation, prove that the fundamental driving interaction is enjoyable.

The prototype answers one question:

> Is executing a single racing corner with RaceFlow satisfying enough that the player wants to do it again?

## Scope

Build one fictional test section:

```text
straight
  ->
approach / braking zone
  ->
single corner
  ->
corner exit
  ->
result
  ->
reset / repeat
```

The prototype does **not** need a real F1 circuit or licensed content.

## Required systems

### 1. Visible race scene

At minimum:

- car
- track
- braking approach
- corner
- exit

The presentation can be intentionally simple.

### 2. RaceFlow sequence

One corner should contain multiple meaningful phases, for example:

- braking initiation
- brake hold/release
- apex/turn-in
- exit/traction

### 3. Dynamic timing evaluation

Each phase produces continuous quality.

At minimum expose:

- perfect
- good
- mistake
- major mistake

### 4. Visible car response

Results must alter what the player sees.

Examples:

- optimal line
- run wide
- lock-up
- poor exit
- wheelspin
- spin for severe failure

### 5. Lap-time consequence

Execution quality changes completion time.

### 6. Mobile + keyboard controls

The same prototype must be playable with:

- touch in a mobile browser
- keyboard in a desktop browser

### 7. Immediate feedback

The player should understand which phase was good or bad and what it caused.

## Explicitly out of scope for v0.1

Do not build these before the core loop is validated:

- career mode
- season/championship
- multiplayer
- full pit-stop strategy
- real driver/team roster
- full real-world track
- detailed vehicle upgrade tree
- extensive menus
- economy
- progression system
- advanced damage simulation

## Success criteria

The prototype succeeds if playtesting suggests:

1. A perfect execution is noticeably satisfying.
2. The player understands why they gained or lost time.
3. A mistake visibly changes the car's behavior.
4. Repeating the same corner remains interesting for multiple attempts.
5. Touch controls feel natural on a phone.
6. Keyboard controls feel equally intentional on desktop.
7. Better player execution reliably creates better outcomes.

## v0.2 candidate

After the corner loop works, build a **1-v-1 overtaking prototype**.

Suggested test:

```text
corner exit -> slipstream -> braking zone -> tactical choice
-> RaceFlow duel -> side-by-side / pass / defence -> next corner
```

This should validate whether RaceFlow can support racing against opponents, not just time-trial execution.

## Implementation note

Architecture should keep these layers separate:

```text
Input Adapter
     |
RaceFlow Event Model
     |
Execution Evaluator
     |
Car/Race Simulation
     |
Presentation
```

This separation is important because touch and keyboard must feed the same gameplay model and because future simulation complexity should not require redesigning the controls.
