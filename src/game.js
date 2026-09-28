(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const canvas = $("raceCanvas");
  const ctx = canvas.getContext("2d");

  const ui = {
    lap: $("lap"),
    lapTime: $("lapTime"),
    bestLap: $("bestLap"),
    speed: $("speed"),
    tyres: $("tyres"),
    flow: $("flow"),
    cueText: $("cueText"),
    cueAction: $("cueAction"),
    timingCursor: $("timingCursor"),
    raceMessage: $("raceMessage"),
    cornerBadge: $("cornerBadge"),
    cornerName: $("cornerName"),
    cornerRole: $("cornerRole"),
    resultToast: $("resultToast"),
    resultLabel: $("resultLabel"),
    resultDetail: $("resultDetail"),
    overtakePanel: $("overtakePanel"),
    aiToggle: $("aiToggle"),
    startOverlay: $("startOverlay"),
    startButton: $("startButton"),
    resetButton: $("resetButton")
  };

  const ACTION_LABEL = {
    left: "A / LEFT",
    center: "SPACE",
    right: "D / RIGHT"
  };

  const TRACK_CONTROLS = [
    [0.69, 0.81],
    [0.80, 0.73],
    [0.82, 0.60],
    [0.71, 0.43],
    [0.55, 0.27],
    [0.36, 0.19],
    [0.22, 0.28],
    [0.18, 0.45],
    [0.27, 0.61],
    [0.40, 0.70],
    [0.53, 0.73],
    [0.64, 0.68],
    [0.75, 0.66],
    [0.82, 0.73]
  ];

  const CORNERS = [
    { name: "T1", p: 0.10, min: 0.47, width: 0.032 },
    { name: "T3", p: 0.27, min: 0.30, width: 0.040 },
    { name: "T4", p: 0.40, min: 0.34, width: 0.038 },
    { name: "T6", p: 0.58, min: 0.60, width: 0.030 },
    { name: "T7", p: 0.66, min: 0.62, width: 0.028 },
    { name: "T9", p: 0.81, min: 0.78, width: 0.025 },
    { name: "T10", p: 0.91, min: 0.55, width: 0.030 }
  ];

  const CUES = [
    { corner: "T1", p: 0.078, action: "center", kind: "hold", hold: 0.44, role: "BRAKE", effect: "brake", window: 0.010 },
    { corner: "T1", p: 0.105, action: "right", kind: "tap", role: "APEX", effect: "apex", window: 0.009 },
    { corner: "T1", p: 0.128, action: "center", kind: "tap", role: "EXIT", effect: "exit", window: 0.010 },

    { corner: "T3", p: 0.238, action: "center", kind: "hold", hold: 0.64, role: "HEAVY BRAKE", effect: "brake", window: 0.009 },
    { corner: "T3", p: 0.272, action: "right", kind: "tap", role: "APEX", effect: "apex", window: 0.008 },
    { corner: "T3", p: 0.305, action: "center", kind: "tap", role: "TRACTION", effect: "exit", window: 0.009 },

    { corner: "T4", p: 0.365, action: "center", kind: "tap", role: "BRAKE", effect: "brake", window: 0.009 },
    { corner: "T4", p: 0.398, action: "right", kind: "tap", role: "APEX", effect: "apex", window: 0.008 },
    { corner: "T4", p: 0.427, action: "center", kind: "hold", hold: 0.36, role: "EARLY EXIT", effect: "exit", window: 0.009 },

    { corner: "T6", p: 0.557, action: "left", kind: "tap", role: "TURN-IN", effect: "direction", window: 0.008 },
    { corner: "T6", p: 0.585, action: "right", kind: "tap", role: "CHANGE DIRECTION", effect: "direction", window: 0.008 },
    { corner: "T7", p: 0.632, action: "left", kind: "tap", role: "FLOW LEFT", effect: "direction", window: 0.0075 },
    { corner: "T7", p: 0.661, action: "right", kind: "tap", role: "FLOW RIGHT", effect: "direction", window: 0.0075 },

    { corner: "T9", p: 0.786, action: "center", kind: "tap", role: "FAST COMMIT", effect: "commit", window: 0.007 },
    { corner: "T9", p: 0.812, action: "right", kind: "tap", role: "APEX", effect: "commit", window: 0.007 },
    { corner: "T10", p: 0.875, action: "center", kind: "tap", role: "COMMIT", effect: "commit", window: 0.0075 },
    { corner: "T10", p: 0.905, action: "right", kind: "tap", role: "APEX", effect: "apex", window: 0.0075 },
    { corner: "T10", p: 0.938, action: "center", kind: "hold", hold: 0.32, role: "FINAL EXIT", effect: "exit", window: 0.009 }
  ];

  const OVERTAKE_ZONES = [
    { corner: "T1", start: 0.055, end: 0.105 },
    { corner: "T3", start: 0.205, end: 0.270 },
    { corner: "T4", start: 0.335, end: 0.395 }
  ];

  const state = {
    running: false,
    lastTs: 0,
    elapsed: 0,
    lapTimeMs: 0,
    bestLapMs: null,
    lap: 1,
    progress: 0,
    previousProgress: 0,
    speedKph: 0,
    pacePenalty: 1,
    tyreWear: 0,
    lineOffset: 0,
    lineOffsetTarget: 0,
    spinTimer: 0,
    spinAngle: 0,
    flow: 0,
    cueDone: CUES.map(() => false),
    activeHold: null,
    resultTimer: 0,
    effect: "",
    effectTimer: 0,
    aiProgress: 0.012,
    aiLap: 1,
    aiEnabled: true,
    duel: null,
    duelOffered: new Set(),
    message: "Press Start to begin.",
    messageTimer: 0
  };

  let cssWidth = 1000;
  let cssHeight = 600;
  let trackPoints = [];
  let trackWidth = 46;
  let currentCueIndex = -1;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function wrap01(value) {
    value %= 1;
    return value < 0 ? value + 1 : value;
  }

  function circularDistance(a, b) {
    let d = a - b;
    if (d > 0.5) d -= 1;
    if (d < -0.5) d += 1;
    return d;
  }

  function catmullRom(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;
    return {
      x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2*p0.x - 5*p1.x + 4*p2.x - p3.x) * t2 + (-p0.x + 3*p1.x - 3*p2.x + p3.x) * t3),
      y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2*p0.y - 5*p1.y + 4*p2.y - p3.y) * t2 + (-p0.y + 3*p1.y - 3*p2.y + p3.y) * t3)
    };
  }

  function rebuildTrack() {
    const padX = cssWidth * 0.04;
    const padY = cssHeight * 0.03;
    const usableW = cssWidth - padX * 2;
    const usableH = cssHeight - padY * 2;

    const controls = TRACK_CONTROLS.map(([x, y]) => ({
      x: padX + x * usableW,
      y: padY + y * usableH
    }));

    trackPoints = [];
    const count = controls.length;
    const subdivisions = 24;

    for (let i = 0; i < count; i++) {
      const p0 = controls[(i - 1 + count) % count];
      const p1 = controls[i];
      const p2 = controls[(i + 1) % count];
      const p3 = controls[(i + 2) % count];

      for (let s = 0; s < subdivisions; s++) {
        trackPoints.push(catmullRom(p0, p1, p2, p3, s / subdivisions));
      }
    }

    trackWidth = clamp(Math.min(cssWidth, cssHeight) * 0.085, 30, 58);
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    cssWidth = Math.max(320, rect.width);
    cssHeight = Math.max(260, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuildTrack();
  }

  function pointAt(progress) {
    const n = trackPoints.length;
    const raw = wrap01(progress) * n;
    const i = Math.floor(raw) % n;
    const j = (i + 1) % n;
    const f = raw - Math.floor(raw);
    const x = trackPoints[i].x + (trackPoints[j].x - trackPoints[i].x) * f;
    const y = trackPoints[i].y + (trackPoints[j].y - trackPoints[i].y) * f;

    const prev = trackPoints[(i - 2 + n) % n];
    const next = trackPoints[(i + 2) % n];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;

    return {
      x,
      y,
      tx: dx / len,
      ty: dy / len,
      nx: -dy / len,
      ny: dx / len,
      angle: Math.atan2(dy, dx)
    };
  }

  function speedProfile(progress) {
    let factor = 1;
    for (const corner of CORNERS) {
      const d = circularDistance(progress, corner.p);
      const gaussian = Math.exp(-(d * d) / (2 * corner.width * corner.width));
      const local = 1 - (1 - corner.min) * gaussian;
      factor = Math.min(factor, local);
    }
    return factor;
  }

  function tyreGrip() {
    return clamp(1 - state.tyreWear / 180, 0.64, 1);
  }

  function duelWindowModifier() {
    if (!state.duel) return 1;
    if (state.duel.choice === "inside") return 0.78;
    if (state.duel.choice === "outside") return 0.88;
    if (state.duel.choice === "wait") return 1.12;
    return 1;
  }

  function cueWindow(cue) {
    return cue.window * tyreGrip() * duelWindowModifier();
  }

  function getNextCueIndex() {
    for (let i = 0; i < CUES.length; i++) {
      if (!state.cueDone[i]) return i;
    }
    return -1;
  }

  function getActiveCueIndex() {
    if (state.activeHold) return state.activeHold.index;

    const i = getNextCueIndex();
    if (i < 0) return -1;

    const cue = CUES[i];
    const ahead = cue.p - state.progress;
    const late = cueWindow(cue) * 1.45;
    const preview = 0.034;

    if (ahead <= preview && ahead >= -late) return i;
    return -1;
  }

  function formatTime(ms) {
    if (ms == null) return "--:--.---";
    const total = Math.max(0, ms);
    const minutes = Math.floor(total / 60000);
    const seconds = Math.floor((total % 60000) / 1000);
    const millis = Math.floor(total % 1000);
    return `${minutes}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
  }

  function setMessage(text, seconds = 2.1) {
    state.message = text;
    state.messageTimer = seconds;
  }

  function showResult(label, detail, klass) {
    ui.resultLabel.textContent = label;
    ui.resultDetail.textContent = detail;
    ui.resultToast.className = `result-toast ${klass}`;
    ui.resultToast.hidden = false;
    state.resultTimer = 1.5;
  }

  function qualityBand(score) {
    if (score >= 0.86) return { label: "PERFECT", klass: "perfect" };
    if (score >= 0.68) return { label: "GOOD", klass: "good" };
    if (score >= 0.46) return { label: "MINOR ERROR", klass: "minor" };
    if (score >= 0.18) return { label: "MAJOR ERROR", klass: "major" };
    return { label: "CATASTROPHIC", klass: "catastrophic" };
  }

  function detailForEffect(cue, score) {
    if (score >= 0.86) {
      if (cue.effect === "brake") return "Braking point nailed";
      if (cue.effect === "apex") return "Clean apex";
      if (cue.effect === "exit") return "Strong traction";
      return "Car placed perfectly";
    }
    if (score >= 0.68) return "Small time loss";

    if (cue.effect === "brake") return score < 0.18 ? "Huge lock-up / overshoot" : "Lock-up";
    if (cue.effect === "exit") return score < 0.18 ? "Big wheelspin" : "Wheelspin";
    if (cue.effect === "apex") return score < 0.18 ? "Spin at the apex" : "Ran wide";
    if (cue.effect === "direction") return score < 0.18 ? "Lost the rear" : "Unstable direction change";
    return score < 0.18 ? "Spin" : "Car unsettled";
  }

  function applyConsequence(cue, score) {
    const error = 1 - score;
    const direction = cue.action === "left" ? -1 : cue.action === "right" ? 1 : 0.65;

    if (score >= 0.86) {
      state.pacePenalty = Math.min(1, state.pacePenalty + 0.02);
      return;
    }

    if (score >= 0.68) {
      state.pacePenalty *= 0.992;
      state.tyreWear += 0.02;
      return;
    }

    if (score >= 0.46) {
      state.pacePenalty *= 0.96;
      state.tyreWear += 0.18 + error * 0.12;
      state.lineOffsetTarget += direction * 0.22 * error;
      state.effect = cue.effect;
      state.effectTimer = 0.65;
      return;
    }

    if (score >= 0.18) {
      state.pacePenalty *= cue.effect === "brake" ? 0.82 : 0.86;
      state.tyreWear += 0.55 + error * 0.35;
      state.lineOffsetTarget += direction * 0.62 * error;
      state.effect = cue.effect;
      state.effectTimer = 1.0;
      return;
    }

    state.pacePenalty *= 0.48;
    state.tyreWear += 1.4 + error * 0.8;
    state.lineOffsetTarget += direction * 1.0;
    state.effect = cue.effect;
    state.effectTimer = 1.6;

    if (cue.effect === "apex" || cue.effect === "direction" || cue.effect === "commit") {
      state.spinTimer = 1.5;
    }
  }

  function resolveDuelIfReady() {
    if (!state.duel || state.duel.scores.length < state.duel.requiredScores) return;

    const avg = state.duel.scores.reduce((a, b) => a + b, 0) / state.duel.scores.length;
    const choice = state.duel.choice;
    let success = false;

    if (choice === "inside") success = avg >= 0.70;
    if (choice === "outside") success = avg >= 0.76;

    if (choice === "wait") {
      state.pacePenalty = Math.min(1, state.pacePenalty + 0.05);
      setMessage(`Exit prioritized · execution ${Math.round(avg * 100)}%`, 2.3);
    } else if (success) {
      state.progress = wrap01(state.progress + (choice === "inside" ? 0.010 : 0.012));
      setMessage(`PASS! ${choice.toUpperCase()} move completed · ${Math.round(avg * 100)}%`, 2.7);
    } else {
      state.pacePenalty *= 0.90;
      setMessage(`Move failed · ${Math.round(avg * 100)}% execution`, 2.5);
    }

    state.duel = null;
    ui.overtakePanel.hidden = true;
  }

  function resolveCue(index, score, reason = "") {
    if (index < 0 || state.cueDone[index]) return;

    const cue = CUES[index];
    state.cueDone[index] = true;
    state.activeHold = null;

    const band = qualityBand(score);
    const detail = reason || detailForEffect(cue, score);
    showResult(band.label, detail, band.klass);
    applyConsequence(cue, score);

    if (score >= 0.68) {
      state.flow += 1;
    } else {
      state.flow = 0;
    }

    if (state.duel) {
      state.duel.scores.push(score);
      resolveDuelIfReady();
    }

    setMessage(`${cue.corner} · ${cue.role}: ${band.label}`, 1.8);
  }

  function timingScore(cue, progress) {
    const window = cueWindow(cue);
    const error = Math.abs(progress - cue.p);
    return clamp(1 - error / (window * 1.28), 0, 1);
  }

  function handleActionDown(action) {
    if (!state.running) return;
    if (state.activeHold) return;

    const i = getActiveCueIndex();
    if (i < 0) {
      setMessage("No RaceFlow input needed yet.", 0.8);
      return;
    }

    const cue = CUES[i];

    if (cue.action !== action) {
      resolveCue(i, 0.06, `Wrong input · expected ${ACTION_LABEL[cue.action]}`);
      return;
    }

    const startScore = timingScore(cue, state.progress);

    if (cue.kind === "hold") {
      state.activeHold = {
        index: i,
        action,
        startedAt: performance.now(),
        startScore
      };
      setMessage(`${cue.corner} · HOLD ${ACTION_LABEL[action]}...`, 1.2);
      return;
    }

    resolveCue(i, startScore);
  }

  function handleActionUp(action) {
    const hold = state.activeHold;
    if (!hold || hold.action !== action) return;

    const cue = CUES[hold.index];
    const elapsed = (performance.now() - hold.startedAt) / 1000;
    const durationScore = clamp(1 - Math.abs(elapsed - cue.hold) / Math.max(0.18, cue.hold * 0.8), 0, 1);
    const score = hold.startScore * 0.56 + durationScore * 0.44;
    resolveCue(hold.index, score);
  }

  function resetLapCues() {
    state.cueDone.fill(false);
    state.activeHold = null;
    currentCueIndex = -1;
  }

  function completeLap() {
    if (state.lapTimeMs > 5000) {
      if (state.bestLapMs == null || state.lapTimeMs < state.bestLapMs) {
        state.bestLapMs = state.lapTimeMs;
        setMessage(`New best lap: ${formatTime(state.bestLapMs)}`, 3);
      } else {
        setMessage(`Lap ${state.lap}: ${formatTime(state.lapTimeMs)}`, 2.4);
      }
    }

    state.lap += 1;
    state.lapTimeMs = 0;
    resetLapCues();
  }

  function updateAI(dt) {
    if (!state.aiEnabled) return;

    const profile = speedProfile(state.aiProgress);
    const kph = Math.max(65, 320 * profile * 0.985);
    const rate = (kph / 220) / 65;
    const previous = state.aiProgress;
    state.aiProgress = wrap01(state.aiProgress + rate * dt);

    if (state.aiProgress < previous) state.aiLap += 1;
  }

  function playerAbsolutePosition() {
    return (state.lap - 1) + state.progress;
  }

  function aiAbsolutePosition() {
    return (state.aiLap - 1) + state.aiProgress;
  }

  function updateOvertaking() {
    if (!state.aiEnabled || state.duel || !state.running) return;

    const gap = aiAbsolutePosition() - playerAbsolutePosition();
    if (gap <= 0 || gap > 0.030) {
      ui.overtakePanel.hidden = true;
      return;
    }

    const zone = OVERTAKE_ZONES.find(z => state.progress >= z.start && state.progress <= z.end);
    if (!zone) {
      ui.overtakePanel.hidden = true;
      return;
    }

    const key = `${state.lap}-${zone.corner}`;
    if (state.duelOffered.has(key)) return;

    state.duelOffered.add(key);
    state.pendingOvertakeZone = zone;
    ui.overtakePanel.hidden = false;
    setMessage(`${zone.corner}: rival ahead by ~${Math.round(gap * 65 * 1000) / 1000}s track-equivalent`, 2);
  }

  function chooseOvertake(choice) {
    if (ui.overtakePanel.hidden || !state.pendingOvertakeZone) return;

    const zone = state.pendingOvertakeZone;
    state.duel = {
      choice,
      corner: zone.corner,
      scores: [],
      requiredScores: 3
    };

    ui.overtakePanel.hidden = true;
    state.pendingOvertakeZone = null;

    if (choice === "inside") setMessage("INSIDE ATTACK · smaller timing windows, high reward", 2.4);
    if (choice === "outside") setMessage("OUTSIDE ATTACK · precision required", 2.4);
    if (choice === "wait") setMessage("WAIT · prioritize the exit and protect tyres", 2.4);
  }

  function updateCues() {
    if (state.activeHold) return;

    const i = getNextCueIndex();
    if (i < 0) return;

    const cue = CUES[i];
    const late = cueWindow(cue) * 1.45;
    if (state.progress - cue.p > late) {
      resolveCue(i, 0, "Missed input");
    }
  }

  function update(dt) {
    if (!state.running) return;

    state.elapsed += dt;
    state.lapTimeMs += dt * 1000;
    state.tyreWear = clamp(state.tyreWear + dt * 0.004, 0, 35);

    state.pacePenalty += (1 - state.pacePenalty) * Math.min(1, dt * 0.72);
    state.lineOffsetTarget *= Math.exp(-dt * 1.25);
    state.lineOffset += (state.lineOffsetTarget - state.lineOffset) * Math.min(1, dt * 4.4);

    if (state.spinTimer > 0) {
      state.spinTimer = Math.max(0, state.spinTimer - dt);
      state.spinAngle += dt * 8.5;
    } else {
      state.spinAngle *= Math.exp(-dt * 8);
    }

    if (state.effectTimer > 0) {
      state.effectTimer = Math.max(0, state.effectTimer - dt);
    } else {
      state.effect = "";
    }

    if (state.resultTimer > 0) {
      state.resultTimer -= dt;
      if (state.resultTimer <= 0) ui.resultToast.hidden = true;
    }

    if (state.messageTimer > 0) state.messageTimer -= dt;

    const profile = speedProfile(state.progress);
    const spinPenalty = state.spinTimer > 0 ? 0.42 : 1;
    const gripPenalty = 0.88 + tyreGrip() * 0.12;
    state.speedKph = Math.max(58, 320 * profile * state.pacePenalty * spinPenalty * gripPenalty);

    const rate = (state.speedKph / 220) / 65;
    state.previousProgress = state.progress;
    state.progress = wrap01(state.progress + rate * dt);

    if (state.progress < state.previousProgress) completeLap();

    updateAI(dt);
    updateCues();
    updateOvertaking();
  }

  function drawClosedPath(points) {
    if (!points.length) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.closePath();
  }

  function drawTrack() {
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const grass = ctx.createLinearGradient(0, 0, cssWidth, cssHeight);
    grass.addColorStop(0, "#1a4928");
    grass.addColorStop(1, "#10361e");
    ctx.fillStyle = grass;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.strokeStyle = "#8bd28d";
    ctx.lineWidth = 1;
    for (let x = -cssHeight; x < cssWidth; x += 34) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + cssHeight, cssHeight);
      ctx.stroke();
    }
    ctx.restore();

    drawClosedPath(trackPoints);
    ctx.strokeStyle = "rgba(245,248,250,.86)";
    ctx.lineWidth = trackWidth + 7;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    drawClosedPath(trackPoints);
    ctx.strokeStyle = "#2e333a";
    ctx.lineWidth = trackWidth;
    ctx.stroke();

    drawClosedPath(trackPoints);
    ctx.setLineDash([7, 10]);
    ctx.strokeStyle = "rgba(255,255,255,.12)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);

    for (const corner of CORNERS) {
      const p = pointAt(corner.p);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,.72)";
      ctx.fill();
      ctx.font = "700 10px system-ui";
      ctx.fillStyle = "rgba(255,255,255,.76)";
      ctx.fillText(corner.name, p.x + 7, p.y - 7);
    }

    const start = pointAt(0);
    ctx.save();
    ctx.translate(start.x, start.y);
    ctx.rotate(start.angle);
    ctx.fillStyle = "#f4f7fb";
    const stripe = 4;
    for (let i = -3; i <= 3; i++) {
      if (i % 2 === 0) ctx.fillRect(-2, i * stripe, 4, stripe);
    }
    ctx.restore();
  }

  function drawCar(progress, options = {}) {
    const p = pointAt(progress);
    const size = clamp(Math.min(cssWidth, cssHeight) * 0.018, 9, 16);
    const offset = options.offset || 0;
    const x = p.x + p.nx * offset * trackWidth * 0.40;
    const y = p.y + p.ny * offset * trackWidth * 0.40;
    const angle = p.angle + (options.spin || 0);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#000";
    ctx.fillRect(-size * 0.85, -size * 0.36 + 3, size * 1.7, size * 0.72);
    ctx.globalAlpha = 1;

    const body = options.body || "#ff4056";
    ctx.fillStyle = "#11151a";
    ctx.fillRect(-size * 0.72, -size * 0.62, size * 0.38, size * 0.28);
    ctx.fillRect(-size * 0.72, size * 0.34, size * 0.38, size * 0.28);
    ctx.fillRect(size * 0.28, -size * 0.62, size * 0.38, size * 0.28);
    ctx.fillRect(size * 0.28, size * 0.34, size * 0.38, size * 0.28);

    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(size * 0.95, 0);
    ctx.lineTo(size * 0.32, -size * 0.28);
    ctx.lineTo(-size * 0.76, -size * 0.24);
    ctx.lineTo(-size * 0.88, size * 0.24);
    ctx.lineTo(size * 0.32, size * 0.28);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#d9e4ed";
    ctx.fillRect(size * 0.16, -size * 0.12, size * 0.28, size * 0.24);

    ctx.fillStyle = body;
    ctx.fillRect(size * 0.75, -size * 0.43, size * 0.14, size * 0.86);
    ctx.fillRect(-size * 0.84, -size * 0.48, size * 0.10, size * 0.96);

    ctx.restore();

    if (options.label) {
      ctx.font = "800 9px system-ui";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,.88)";
      ctx.fillText(options.label, x, y - size * 1.25);
      ctx.textAlign = "start";
    }
  }

  function drawEffects() {
    if (!state.effect || state.effectTimer <= 0) return;

    const p = pointAt(state.progress);
    ctx.save();
    ctx.globalAlpha = clamp(state.effectTimer, 0, 1) * 0.65;
    ctx.strokeStyle = state.effect === "brake" ? "#16191d" : "#dbe5ed";
    ctx.lineWidth = 2;

    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const spread = (i - 1) * 5;
      ctx.moveTo(p.x - p.tx * 7 + p.nx * spread, p.y - p.ty * 7 + p.ny * spread);
      ctx.lineTo(p.x - p.tx * (20 + i * 7) + p.nx * spread, p.y - p.ty * (20 + i * 7) + p.ny * spread);
      ctx.stroke();
    }

    ctx.restore();
  }

  function draw() {
    drawTrack();

    if (state.aiEnabled) {
      drawCar(state.aiProgress, {
        body: "#57d8ff",
        offset: -0.16,
        label: "RIVAL"
      });
    }

    drawEffects();
    drawCar(state.progress, {
      body: "#ff4056",
      offset: state.lineOffset,
      spin: state.spinAngle,
      label: "YOU"
    });
  }

  function updateRaceflowUI() {
    ui.lap.textContent = state.lap;
    ui.lapTime.textContent = formatTime(state.lapTimeMs);
    ui.bestLap.textContent = formatTime(state.bestLapMs);
    ui.speed.textContent = `${Math.round(state.speedKph)} km/h`;
    ui.tyres.textContent = `${Math.round(100 - state.tyreWear)}%`;
    ui.flow.textContent = `x${state.flow}`;
    ui.raceMessage.textContent = state.messageTimer > 0 ? state.message : "Read the car, then hit the timing window.";

    const i = state.activeHold ? state.activeHold.index : getNextCueIndex();
    currentCueIndex = i;

    if (i < 0) {
      ui.cueText.textContent = "Lap complete · keep pushing";
      ui.cueAction.textContent = "—";
      ui.timingCursor.style.left = "100%";
      ui.cornerBadge.hidden = true;
      return;
    }

    const cue = CUES[i];
    const ahead = cue.p - state.progress;
    const active = getActiveCueIndex() === i;

    ui.cueAction.textContent = ACTION_LABEL[cue.action];
    ui.cornerName.textContent = cue.corner;
    ui.cornerRole.textContent = cue.role;
    ui.cornerBadge.hidden = !active;

    if (state.activeHold) {
      const elapsed = (performance.now() - state.activeHold.startedAt) / 1000;
      const ratio = elapsed / cue.hold;
      const cursor = clamp(ratio * 50, 0, 100);
      ui.timingCursor.style.left = `${cursor}%`;
      ui.cueText.textContent = `${cue.corner} · HOLD, then release in green`;
      return;
    }

    if (ahead > 0.034) {
      ui.timingCursor.style.left = "0%";
      ui.cueText.textContent = `${cue.corner} · Prepare: ${cue.role}`;
      return;
    }

    const late = cueWindow(cue) * 1.45;
    let cursor;
    if (ahead >= 0) {
      cursor = 50 * (1 - ahead / 0.034);
    } else {
      cursor = 50 + 50 * (-ahead / late);
    }

    ui.timingCursor.style.left = `${clamp(cursor, 0, 100)}%`;
    ui.cueText.textContent = cue.kind === "hold"
      ? `${cue.corner} · HOLD ${cue.role}`
      : `${cue.corner} · ${cue.role}`;
  }

  function frame(ts) {
    if (!state.lastTs) state.lastTs = ts;
    const dt = Math.min(0.033, (ts - state.lastTs) / 1000 || 0);
    state.lastTs = ts;

    update(dt);
    draw();
    updateRaceflowUI();

    requestAnimationFrame(frame);
  }

  function resetSession() {
    state.running = false;
    state.lastTs = performance.now();
    state.elapsed = 0;
    state.lapTimeMs = 0;
    state.bestLapMs = null;
    state.lap = 1;
    state.progress = 0;
    state.previousProgress = 0;
    state.speedKph = 0;
    state.pacePenalty = 1;
    state.tyreWear = 0;
    state.lineOffset = 0;
    state.lineOffsetTarget = 0;
    state.spinTimer = 0;
    state.spinAngle = 0;
    state.flow = 0;
    state.effect = "";
    state.effectTimer = 0;
    state.aiProgress = 0.012;
    state.aiLap = 1;
    state.duel = null;
    state.duelOffered = new Set();
    state.pendingOvertakeZone = null;
    state.resultTimer = 0;
    ui.resultToast.hidden = true;
    ui.overtakePanel.hidden = true;
    resetLapCues();
    setMessage("Press Start to begin.", 999);
    ui.startOverlay.hidden = false;
  }

  function startSession() {
    state.running = true;
    state.lastTs = performance.now();
    state.messageTimer = 0;
    state.message = "Build rhythm. Perfect inputs preserve momentum.";
    ui.startOverlay.hidden = true;
  }

  function bindControlButton(button) {
    const action = button.dataset.action;

    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      button.setPointerCapture?.(event.pointerId);
      button.classList.add("active");
      handleActionDown(action);
    });

    const release = (event) => {
      event.preventDefault();
      button.classList.remove("active");
      handleActionUp(action);
    };

    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
  }

  document.querySelectorAll("[data-action]").forEach(bindControlButton);

  document.querySelectorAll("[data-overtake]").forEach(button => {
    button.addEventListener("click", () => chooseOvertake(button.dataset.overtake));
  });

  const heldKeys = new Set();

  window.addEventListener("keydown", (event) => {
    const key = event.code;

    if (key === "Digit1") chooseOvertake("inside");
    if (key === "Digit2") chooseOvertake("outside");
    if (key === "Digit3") chooseOvertake("wait");

    const action =
      key === "KeyA" || key === "ArrowLeft" ? "left" :
      key === "Space" ? "center" :
      key === "KeyD" || key === "ArrowRight" ? "right" :
      null;

    if (!action) return;

    event.preventDefault();
    if (heldKeys.has(key)) return;
    heldKeys.add(key);
    handleActionDown(action);
  });

  window.addEventListener("keyup", (event) => {
    const key = event.code;
    const action =
      key === "KeyA" || key === "ArrowLeft" ? "left" :
      key === "Space" ? "center" :
      key === "KeyD" || key === "ArrowRight" ? "right" :
      null;

    if (!action) return;

    event.preventDefault();
    heldKeys.delete(key);
    handleActionUp(action);
  });

  ui.aiToggle.addEventListener("change", () => {
    state.aiEnabled = ui.aiToggle.checked;
    if (!state.aiEnabled) {
      state.duel = null;
      state.pendingOvertakeZone = null;
      ui.overtakePanel.hidden = true;
    }
  });

  ui.startButton.addEventListener("click", startSession);
  ui.resetButton.addEventListener("click", resetSession);
  window.addEventListener("resize", resizeCanvas);

  state.aiEnabled = ui.aiToggle.checked;
  resizeCanvas();
  resetSession();
  requestAnimationFrame(frame);
})();
