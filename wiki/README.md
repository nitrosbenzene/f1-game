# F1 Game Wiki

This directory is the **source of truth for game design and development specifications**.

The wiki should be updated whenever a gameplay decision changes. Implementation should follow the current wiki unless a newer explicit decision supersedes it.

## Product vision

Create an accessible but deep browser-based Formula racing game that feels meaningfully connected to racing without relying on conventional direct steering, throttle and brake controls.

The core experience should translate driving into:

- timing and precision
- short rhythmic input sequences
- car-control windows
- risk versus reward
- tactical racing decisions
- tyre, component and damage consequences
- wheel-to-wheel duels

The same underlying gameplay must work naturally on both touch devices and desktop browsers.

## Design principles

1. **Racing, not virtual steering.** The player should feel that they are executing a racing car through a corner, not dragging a mobile joystick.
2. **Easy inputs, deep outcomes.** The physical input vocabulary should remain small while the simulation behind it can be rich.
3. **Mistakes must make sense.** Consequences should follow the type of mistake made.
4. **Skill should matter.** Better execution should produce measurable but believable advantages.
5. **Risk must be chosen.** Faster potential performance should generally require harder execution.
6. **Overtaking is a duel.** Passing another car should not reduce to a single button press.
7. **Mobile and desktop are peers.** Neither platform should feel like a compromised port of the other.
8. **The car remains visible and meaningful.** Prompts should support reading the track and car, not turn the race into a disconnected rhythm overlay.

## Gameplay specifications

- [RaceFlow controls](gameplay/raceflow-controls.md)
- [Overtaking and wheel-to-wheel combat](gameplay/overtaking.md)
- [Mistakes, wear and consequences](gameplay/consequences.md)

## Development roadmap

- [Prototype v0.1](roadmap/prototype-v0.1.md)

## Specification status

The wiki uses these labels:

- **DECIDED**: baseline direction unless deliberately changed.
- **PROPOSED**: strong candidate that still needs playtesting or explicit confirmation.
- **OPEN**: unresolved design question.
- **EXAMPLE**: illustrative value or scenario, not a fixed implementation requirement.

## Maintenance rule

When implementation and wiki disagree, either:

1. change the implementation to match the wiki, or
2. explicitly update the wiki with the new design decision.

Do not allow undocumented gameplay behavior to become the specification by accident.
