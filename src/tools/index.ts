export function hasOwnProperty(x: any, property: string): boolean {
  if (x === null || x === undefined || typeof x !== 'object' || Array.isArray(x)) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(x, property);
}
