import {
  addressToHex,
  validImplicitAddress,
  validContractAddress,
} from '../../crypto-utils/src/utils';
import { ContractCall, ContractOrigination } from './interfaces';

const getContractUndelegation = (): ContractCall => {
  return {
    entrypoint: 'do',
    value: [
      { prim: 'DROP' },
      {
        prim: 'NIL',
        args: [{ prim: 'operation' }],
      },
      {
        prim: 'NONE',
        args: [{ prim: 'key_hash' }],
      },
      { prim: 'SET_DELEGATE' },
      { prim: 'CONS' },
    ],
  };
};

const getContractDelegation = (address: string): ContractCall => {
  return address === ''
    ? getContractUndelegation()
    : {
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
              bytes: addressToHex(address).slice(2),
            },
          ],
        },
        { prim: 'SOME' },
        { prim: 'SET_DELEGATE' },
        { prim: 'CONS' },
      ],
    };
};

const getContractPkhTransaction = (
  to: string,
  amount: string
): ContractCall => {
  if (!validImplicitAddress(to)) {
    throw new Error('Expected tz address');
  }
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
            bytes: addressToHex(to).slice(2),
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

const getContractKtTransaction = (to: string, amount: string): ContractCall => {
  if (!validContractAddress(to)) {
    throw new Error('Expected KT1 address');
  }
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

const getManagerScript = (pkh: string): ContractOrigination => {
  if (!validImplicitAddress(pkh)) {
    throw new Error('Expected tz address');
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
    storage: { bytes: addressToHex(pkh).slice(2) },
  };
};

export {
  getContractDelegation,
  getContractUndelegation,
  getContractPkhTransaction,
  getContractKtTransaction,
  getManagerScript,
};
