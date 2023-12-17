import * as base62 from 'base62/lib/ascii';

export function generateRandomStr(len: number) {
  let str = '';
  for (let i = 0; i < len; i++) {
    const random = base62.encode(Math.floor(Math.random() * 62));
    str += random;
  }

  return str;
}
