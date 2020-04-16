import { getContractDelegation } from './manager-tz';
import { 
  b58cdecode,
  bufToHex,
  prefix
} from '../../crypto-utils/src/common';

describe('#getContractDelegation', () => {
  describe('when pkh starts with tz', () => {
    let pkh;

    beforeEach(() => {
      pkh = 'tz1NhJPtvaewKoRAzZWwMxydApkeDEVP1qyu';
    });

    it('returns with hexed tz', () => {
      var pkHex = '00' + bufToHex(b58cdecode(pkh, prefix.tz1));
      var expected = {
        entrypoint: 'do', 
        value:
          [{ prim: 'DROP' },
          {
            prim: 'NIL',
            args: [{ prim: 'operation' }]
          },
          {
            prim: 'PUSH',
            args:
              [{ prim: 'key_hash' },
              {
                bytes:
                  pkHex
              }]
          },
          { prim: 'SOME' }, { prim: 'SET_DELEGATE' },
          { prim: 'CONS' }]
      };
      expect(getContractDelegation(pkh)).toEqual(expected);
    });
  });

  describe('when pkh does not start with tz', () => {
    let pkh;

    beforeEach(() => {
      pkh = 'foobar';
    });

    it('is true', () => {
      var expected = {
        entrypoint: 'do', 
        value:
          [{ prim: 'DROP' },
          {
            prim: 'NIL',
            args: [{ prim: 'operation' }]
          },
          {
            prim: 'PUSH',
            args:
              [{ prim: 'key_hash' },
              {
                bytes:
                  pkh
              }]
          },
          { prim: 'SOME' }, { prim: 'SET_DELEGATE' },
          { prim: 'CONS' }]
      };
      expect(getContractDelegation(pkh)).toEqual(expected);
    });
  });
});
