// Shared math for drawing a "dome" style semicircle gauge:
// flat baseline through the left/center/right points, arc bulging upward.
// theta = 180 (left) -> 90 (top) -> 0 (right) as progress increases.
export function domePoint(cx, cy, r, thetaDeg) {
  const rad = (thetaDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad),
  };
}

export function describeDomeArc(cx, cy, r, startTheta, endTheta) {
  const start = domePoint(cx, cy, r, startTheta);
  const end = domePoint(cx, cy, r, endTheta);
  const sweep = startTheta - endTheta;
  const largeArcFlag = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

// value/max -> [0, 180] sweep angle, clamped
export function valueToSweep(value, max) {
  const pct = Math.max(0, Math.min(1, max === 0 ? 0 : value / max));
  return pct * 180;
}

// Threshold-based color: calm frost -> amber warning -> danger red
export function thresholdColor(value, max, colors) {
  const pct = max === 0 ? 0 : value / max;
  if (pct >= 0.85) return colors.danger;
  if (pct >= 0.65) return colors.amber;
  return colors.frost;
}
