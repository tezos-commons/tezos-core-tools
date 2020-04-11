import { validAddress } from './utils';

describe('#validAddress', () => {
  describe('valid tz1 address', () => {
    let address;

    beforeEach(() => {
      address = 'tz1NhJPtvaewKoRAzZWwMxydApkeDEVP1qyu';
    });

    it('is true', () => {
      expect(validAddress(address)).toBe(true);
    });
  });

  describe('invalid address', () => {
    let address;

    beforeEach(() => {
      address = 'foobar';
    });

    it('is true', () => {
      expect(validAddress(address)).toBe(false);
    });
  });
});
