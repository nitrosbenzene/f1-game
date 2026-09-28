# Mistakes, Wear and Consequences

**Status:** DECIDED principle, detailed simulation values OPEN.

## Principle

Mistakes must have consequences that make physical and racing sense.

A missed input should not arbitrarily subtract health from unrelated components.

The player should be able to understand:

> What did I do wrong, what happened to the car, and why does it matter now?

## Execution severity

RaceFlow results should be continuous but can be presented in understandable bands.

Conceptual bands:

| Quality | Typical immediate result |
|---|---|
| Perfect | optimal or near-optimal execution |
| Good | small time loss |
| Minor mistake | visible understeer/oversteer/traction loss |
| Major mistake | large lock-up, run wide, severe wheelspin, missed line |
| Catastrophic | spin, contact, off-track or major loss |

Exact time penalties are track- and situation-dependent. Fixed numbers in early examples are not specifications.

## Cause-and-effect examples

### Braking mistakes

Possible chain:

```text
brake too late / poor release
        |
        v
lock-up or overshoot
        |
        +--> immediate time loss
        +--> tyre temperature
        +--> additional wear
        +--> possible flat spot
        +--> harder future execution
```

### Exit mistakes

Possible chain:

```text
too aggressive / badly timed traction input
        |
        v
wheelspin / oversteer
        |
        +--> poor acceleration
        +--> rear tyre temperature
        +--> rear tyre degradation
        +--> spin risk
```

### Kerb / track-limit mistakes

Possible consequences:

- unstable car
- floor damage
- suspension damage
- tyre damage
- track-limit warning/penalty
- poor next-corner setup

Only consequences appropriate to the actual event should be applied.

### Contact

Possible consequences depend on location and severity:

- front-wing damage
- floor/bodywork damage
- suspension damage
- puncture
- spin
- loss of aerodynamic performance

## Power unit and gearbox

Engine or gearbox wear should not be a generic punishment for corner mistakes.

Relevant causes could include:

- aggressive operating modes
- overheating
- excessive revs
- poorly executed shift events, if shifts are player-controlled
- repeated drivetrain abuse
- accumulated race distance
- component-specific failures or damage

The simulation model will be defined later.

## Persistent consequences

A mistake should often influence later gameplay.

Examples:

- worn tyres narrow or shift future control windows
- overheated tyres temporarily reduce grip
- front-wing damage makes turn-in harder
- floor damage reduces high-speed performance
- flat spots can make braking sections less stable
- energy overuse reduces future overtaking/defending capability

This creates race stories instead of isolated minigames.

## Feedback requirements

Consequences must be communicated through a combination of:

- car animation/behavior
- sound
- UI
- timing-window changes
- lap/sector loss
- telemetry summaries where useful

Avoid invisible punishment.

## Simulation philosophy

The game does not need a full real-time motorsport physics engine to produce coherent racing behavior.

A higher-level simulation can calculate parameters such as:

- braking capability
- turn-in stability
- mid-corner grip
- traction
- high-speed balance
- tyre state
- aero efficiency
- component condition

These parameters then modify RaceFlow challenges and race outcomes.

This lets the game support meaningful setup, tyres, weather and damage while keeping the player-facing controls simple.

## Open questions

- Exact tyre model.
- Flat-spot representation.
- Damage granularity.
- Mechanical failure frequency.
- Whether failures can be random or must always have traceable causes.
- Repair behavior in pit stops.
- How strongly persistent damage modifies RaceFlow windows.
