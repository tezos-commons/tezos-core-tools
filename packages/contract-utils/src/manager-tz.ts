import { base58decode, bufToHex, prefix } from '../../crypto-utils/src/common';
import { addressToHex } from '../../crypto-utils/src/utils';

const getContractDelegation = (pkh: string) => {
  let pkHex: string;
  if (pkh.slice(0, 2) === 'tz') {
    pkHex = '00' + bufToHex(base58decode(pkh, prefix.tz1));
  } else {
    pkHex = pkh;
  }
  return {
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
};

const getContractPkhTransaction = (to: string, amount: string) => {
  return {
    entrypoint: 'do',
    value: [
      { prim: 'DROP' },
      { prim: 'NIL', args: [{ prim: 'operation' }] },
      {
        prim: 'PUSH',
        args: [
          { prim: 'key_hash' },
          {
            bytes: addressToHex(to),
          },
        ],
      },
      { prim: 'IMPLICIT_ACCOUNT' },
      {
        prim: 'PUSH',
        args: [{ prim: 'mutez' }, { int: amount }],
      },
      { prim: 'UNIT' },
      { prim: 'TRANSFER_TOKENS' },
      { prim: 'CONS' },
    ],
  };
};

const getContractKtTransaction = (to: string, amount: string) => {
  return {
    entrypoint: 'do',
    value: [
      { prim: 'DROP' },
      { prim: 'NIL', args: [{ prim: 'operation' }] },
      {
        prim: 'PUSH',
        args: [{ prim: 'address' }, { bytes: addressToHex(to) }],
      },
      { prim: 'CONTRACT', args: [{ prim: 'unit' }] },
      [
        {
          prim: 'IF_NONE',
          args: [[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]], []],
        },
      ],
      {
        prim: 'PUSH',
        args: [{ prim: 'mutez' }, { int: amount }],
      },
      { prim: 'UNIT' },
      { prim: 'TRANSFER_TOKENS' },
      { prim: 'CONS' },
    ],
  };
};

const getManagerScript = (pkh: string) => {
  let pkHex: string;
  if (pkh.slice(0, 2) === 'tz') {
    pkHex = '00' + bufToHex(base58decode(pkh, prefix.tz1));
  } else {
    pkHex = pkh;
  }
  return {
    code: [
      {
        prim: 'parameter',
        args: [
          {
            prim: 'or',
            args: [
              {
                prim: 'lambda',
                args: [
                  {
                    prim: 'unit',
                  },
                  {
                    prim: 'list',
                    args: [
                      {
                        prim: 'operation',
                      },
                    ],
                  },
                ],
                annots: ['%do'],
              },
              {
                prim: 'unit',
                annots: ['%default'],
              },
            ],
          },
        ],
      },
      {
        prim: 'storage',
        args: [
          {
            prim: 'key_hash',
          },
        ],
      },
      {
        prim: 'code',
        args: [
          [
            [
              [
                {
                  prim: 'DUP',
                },
                {
                  prim: 'CAR',
                },
                {
                  prim: 'DIP',
                  args: [
                    [
                      {
                        prim: 'CDR',
                      },
                    ],
                  ],
                },
              ],
            ],
            {
              prim: 'IF_LEFT',
              args: [
                [
                  {
                    prim: 'PUSH',
                    args: [
                      {
                        prim: 'mutez',
                      },
                      {
                        int: '0',
                      },
                    ],
                  },
                  {
                    prim: 'AMOUNT',
                  },
                  [
                    [
                      {
                        prim: 'COMPARE',
                      },
                      {
                        prim: 'EQ',
                      },
                    ],
                    {
                      prim: 'IF',
                      args: [
                        [],
                        [
                          [
                            {
                              prim: 'UNIT',
                            },
                            {
                              prim: 'FAILWITH',
                            },
                          ],
                        ],
                      ],
                    },
                  ],
                  [
                    {
                      prim: 'DIP',
                      args: [
                        [
                          {
                            prim: 'DUP',
                          },
                        ],
                      ],
                    },
                    {
                      prim: 'SWAP',
                    },
                  ],
                  {
                    prim: 'IMPLICIT_ACCOUNT',
                  },
                  {
                    prim: 'ADDRESS',
                  },
                  {
                    prim: 'SENDER',
                  },
                  [
                    [
                      {
                        prim: 'COMPARE',
                      },
                      {
                        prim: 'EQ',
                      },
                    ],
                    {
                      prim: 'IF',
                      args: [
                        [],
                        [
                          [
                            {
                              prim: 'UNIT',
                            },
                            {
                              prim: 'FAILWITH',
                            },
                          ],
                        ],
                      ],
                    },
                  ],
                  {
                    prim: 'UNIT',
                  },
                  {
                    prim: 'EXEC',
                  },
                  {
                    prim: 'PAIR',
                  },
                ],
                [
                  {
                    prim: 'DROP',
                  },
                  {
                    prim: 'NIL',
                    args: [
                      {
                        prim: 'operation',
                      },
                    ],
                  },
                  {
                    prim: 'PAIR',
                  },
                ],
              ],
            },
          ],
        ],
      },
    ],
    storage: { bytes: pkHex },
  };
};

export {
  getContractDelegation,
  getContractPkhTransaction,
  getContractKtTransaction,
  getManagerScript,
};
