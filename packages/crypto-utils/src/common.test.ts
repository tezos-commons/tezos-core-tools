import {
  hex2buf,
  buf2hex
} from './common';

describe('#hex2buf', () => {
  it('should return buf', () => {
    const buf = hex2buf('01af');
    expect(buf).toBeDefined();
    expect(JSON.stringify(buf)).toBe(JSON.stringify(Uint8Array.from([1, 175])));
  });
});

describe('#buf2hex', () => {
  it('should return buf', () => {
    const hex = buf2hex(Uint8Array.from([1, 175]));
    expect(hex).toBeDefined();
    expect(hex.toString()).toBe('01af');
  });
});
