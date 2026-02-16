export function generateIdentifier(): string {
  const chars = [
    [48, 10], // 0-9: 48 - 57
    [97, 26], // a-z: 97 - 122
    [65, 26] // A-Z: 65 - 90
  ];

  let randomNumber1 = Math.floor(Math.random() * 0x10000000);
  let randomNumber2 = Math.floor(Math.random() * 0x10000000);

  const result = new Uint8Array(17);
  result[0] = 95;
  for (let i = 16; i > 0; i--) {
    const n = randomNumber2 % 3;
    const range = chars[n];
    const code = range[0] + (randomNumber1 % range[1]);
    result[i] = code;
    randomNumber1 >>>= 1;
    randomNumber2 >>>= 1;
  }

  return String.fromCharCode.apply(null, result);
}

export function getNoCacheParameter(interval: number): string {
  const time = new Date().getTime();
  const number = (time / interval) | 0;
  const string = number.toString(16);
  return string;
}
