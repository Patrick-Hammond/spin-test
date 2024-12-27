export function lerp(start: number, end: number, t: number): number {
  return start + t * (end - start);
}

export function lerpExp(start: number, end: number, t: number): number {
  return start + (end - start) * (1 - Math.pow(2, -10 * t));
}