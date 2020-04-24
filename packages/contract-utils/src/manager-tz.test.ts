import { getContractDelegation } from './manager-tz';
import { base58decode, bufToHex, prefix } from '../../crypto-utils/src/common';

describe('#getContractDelegation', () => {
  describe('when pkh starts with tz', () => {
    let pkh;

    beforeEach(() => {
      pkh = 'tz1NhJPtvaewKoRAzZWwMxydApkeDEVP1qyu';
    });

    it('returns with hexed tz', () => {
      const pkHex = '00' + bufToHex(base58decode(pkh, prefix.tz1));
      const expected = {
        entrypoint: 'do',
        value: [
          { prim: 'DROP' },
          {
            prim: 'NIL',
            args: [{ prim: 'operation' }],
          },
          {
            prim: 'PUSH',
            args: [
              { prim: 'key_hash' },
              {
                bytes: pkHex,
              },
            ],
          },
          { prim: 'SOME' },
          { prim: 'SET_DELEGATE' },
          { prim: 'CONS' },
        ],
      };
      expect(getContractDelegation(pkh)).toEqual(expected);
    });
  });
  describe('when pkh does not start with tz', () => {
    it('should fail', () => {
      let errorMsg;
      try {
        getContractDelegation('foo');
      } catch (e) {
        errorMsg = e.message;
      }
      expect(errorMsg).toEqual('Invalid address');
    });
  });
});
