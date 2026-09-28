# Overtaking and Wheel-to-Wheel Combat

**Status:** DECIDED concept, detailed rules still PROPOSED.

## Goal

Overtaking should feel like a tactical and execution-based duel, not a generic "overtake" button or a scripted animation.

The system must consider:

- relative pace
- gap
- slipstream
- DRS or equivalent systems
- ERS/energy state where modeled
- tyres
- grip
- line choice
- attacker intent
- defender response
- player execution
- subsequent corner position

## Opportunity creation

An overtake begins only when race state creates a plausible opportunity.

Possible contributors:

- sufficiently small time/distance gap
- better exit from previous corner
- slipstream
- DRS
- tyre advantage
- energy deployment
- opponent mistake
- car performance difference
- chosen risk level

The game may expose an **Attack Opportunity** when conditions allow a meaningful move.

## Tactical choice

The attacker may choose a line or tactic.

Candidate options include:

- inside attack
- outside attack
- late-braking attempt
- pressure/no immediate move
- switchback
- feint/fake
- energy-assisted attack

Not every option must be available in every corner.

The defender may also make a contextual choice, whether directly for a human player or via AI.

Candidate defensive behavior:

- defend inside
- defend outside
- hold racing line
- brake early for exit
- force attacker to the long way around

## Interaction with RaceFlow

Tactical choices alter the RaceFlow challenge rather than directly deciding the pass.

### EXAMPLE

Attacker chooses **inside**.

Defender covers the inside.

Consequences may include:

- narrower braking window
- later braking target
- compromised apex
- higher lock-up/contact risk
- poorer exit line if the move is forced

A perfect execution can make a difficult move work.

A poor execution can create:

- lock-up
- overshoot
- loss of position
- contact
- spin
- tyre damage
- forced run-off

## Continuous battles

An overtake does not have to resolve within one corner.

Possible outcomes include:

- attacker completes the pass
- defender remains ahead
- cars exit side-by-side
- attacker gets overlap but poor exit
- defender crosses back
- contact changes the battle

If cars remain side-by-side, their relative position becomes input to the next section.

This permits multi-corner battles rather than isolated overtake checks.

## Example hairpin battle

1. Player exits the previous corner within attack range.
2. Slipstream/DRS creates an attack opportunity.
3. Player chooses an inside attack.
4. Defender covers late.
5. Braking window becomes harder.
6. Player brakes well enough to gain overlap.
7. Apex is executed strongly.
8. Compromised inside line makes the traction/exit window harder.
9. Defender gets a better exit.
10. Cars leave the corner side-by-side.
11. The next corner begins with new line ownership and a new duel state.

The system should communicate *why* each phase became harder.

## Defensive play

The same principles should support player defence.

Defending should involve trade-offs:

- covering the inside can compromise exit
- aggressive defence can increase tyre or contact risk
- protecting one corner may expose the next
- spending energy now reduces later options

The goal is to make defence active without requiring direct steering.

## AI requirements

AI opponents should not simply compare hidden ratings and trigger canned results.

Their behavior should expose believable decisions and execution quality.

AI needs at least:

- tactical preference
- risk tolerance
- consistency
- mistake probability
- tyre awareness
- energy awareness
- race-context awareness
- line/position state

The exact AI architecture is OPEN.

## No automatic success

Choosing the "correct" tactical option must not guarantee the pass.

The result emerges from:

```text
opportunity
+ tactical choices
+ car state
+ tyre/grip state
+ relative position
+ execution quality
= battle outcome
```

## Open questions

- How many tactical choices are visible to the player at once?
- Are defender choices explicit for the player, contextual, or partially automatic?
- How is reaction time represented?
- How are illegal blocks / racing rules modeled?
- How should contact responsibility and penalties work?
- Can some passes happen without entering a dedicated duel presentation?
- How should blue flags and lapped traffic interact with the system?
