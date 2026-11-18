const authorizedFrom = Date.parse('2026-11-18T04:58:38Z');
const authorizedUntil = Date.parse('2027-11-18T04:58:38Z');

export function isPolymakerLogoAuthorized(now = new Date()): boolean {
  const time = now.getTime();
  return time >= authorizedFrom && time < authorizedUntil;
}
