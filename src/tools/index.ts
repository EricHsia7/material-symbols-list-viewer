export function hasOwnProperty(x: any, property: string): boolean {
  if (x === null || x === undefined || typeof x !== 'object' || Array.isArray(x)) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(x, property);
}

export function booleanToString(x: boolean): 'true' | 'false' | 'unsupported' {
  if (x === true) {
    return 'true';
  } else if (x === false) {
    return 'false';
  } else {
    return 'unsupported';
  }
}
