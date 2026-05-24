export function getIntersection<T>(a: Array<T>, b: Array<T>): Array<T> {
  let result = [];
  if (a.length <= b.length) {
    for (const item of a) {
      if (b.indexOf(item) > -1) {
        result.push(item);
      }
    }
  } else {
    for (const item of b) {
      if (a.indexOf(item) > -1) {
        result.push(item);
      }
    }
  }
  return result;
}
