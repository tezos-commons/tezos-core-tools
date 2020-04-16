import { addressToHex } from './common';

describe('#validAddress', () => {
  describe('valid tz1 address', () => {
    let address;

    beforeEach(() => {
      address = 'tz1NhJPtvaewKoRAzZWwMxydApkeDEVP1qyu';
    });

    it('is true', () => {
      var hexed = addressToHex(address);
      expect(hexed.slice(0, 2) === '00').toBe(true);
    });
  });

  describe('valid tz2 address', () => {
    let address;

    beforeEach(() => {
      address = 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m';
    });

    it('is true', () => {
      var hexed = addressToHex(address);
      expect(hexed.slice(0, 2) === '01').toBe(true);
    });
  });

  describe('valid tz3 address', () => {
    let address;

    beforeEach(() => {
      address = 'tz3adcvQaKXTCg12zbninqo3q8ptKKtDFTLv';
    });

    it('is true', () => {
      var hexed = addressToHex(address);
      expect(hexed.slice(0, 2) === '02').toBe(true);
    });
  });

  describe('valid KT1 address', () => {
    let address;

    beforeEach(() => {
      address = 'KT1RfycBPC4V9NJFr7RbUkEGsHbVmSaSJyeH';
    });

    it('is true', () => {
      var hexed = addressToHex(address);
      expect(hexed.slice(0, 2) === '01').toBe(true);
    });
  });

  describe('invalid address', () => {
    let address;

    beforeEach(() => {
      address = 'foobar';
    });

    var hexed = () => {
      addressToHex(address)
    }

    it('is true', () => {
      expect(hexed).toThrowError(new TypeError('Invalid public key hash'));
    });
  });
});
