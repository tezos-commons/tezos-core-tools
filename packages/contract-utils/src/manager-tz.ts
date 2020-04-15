import { 
  b58cdecode,
  buf2hex,
  prefix
} from '../../crypto-utils/src/common';

const getContractDelegation = (pkh) => {
  let pkHex: string;
  if (pkh.slice(0, 2) === 'tz') {
    pkHex = '00' + buf2hex(b58cdecode(pkh, prefix.tz1));
  } else {
    pkHex = pkh;
  }
  return {
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
}

const getContractPkhTransaction = (to, amount) => {
  return {
    entrypoint: 'do',
    value:
      [{ prim: 'DROP' },
      { prim: 'NIL', args: [{ prim: 'operation' }] },
      {
        prim: 'PUSH',
        args:
          [{ prim: 'key_hash' },
          {
            'bytes': tz2hex(to)
          }]
      },
      { prim: 'IMPLICIT_ACCOUNT' },
      {
        prim: 'PUSH',
        args:
          [{ prim: 'mutez' }, { 'int': amount }]
      },
      { prim: 'UNIT' }, { prim: 'TRANSFER_TOKENS' },
      { prim: 'CONS' }]
  };
}

const getContractKtTransaction = (to, amount) => {
  return {
    entrypoint: 'do',
    value: [{ prim: 'DROP' },
    { prim: 'NIL', args: [{ prim: 'operation' }] },
    {
      prim: 'PUSH',
      args:
        [{ prim: 'address' },
        { 'bytes': kt2hex(to) }]
    },
    { prim: 'CONTRACT', args: [{ prim: 'unit' }] },
    [{
      prim: 'IF_NONE',
      args:
        [[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]],
        []]
    }],
    {
      prim: 'PUSH',
      args: [{ prim: 'mutez' }, { 'int': amount }]
    },
    { prim: 'UNIT' }, { prim: 'TRANSFER_TOKENS' },
    { prim: 'CONS' }]
  };
}

const kt2hex = (kt) => {
  if (kt.slice(0, 2) === 'KT') {
    return ('01' + buf2hex(b58cdecode(kt, prefix.KT)) + '00');
  }
  return kt;
}

const tz2hex = (tz: string) => {
  let pkHex;
  if (tz.slice(0, 3) === 'tz1') {
    pkHex = '00' + buf2hex(b58cdecode(tz, prefix.tz1));
  } else if (tz.slice(0, 3) === 'tz2') {
    pkHex = '01' + buf2hex(b58cdecode(tz, prefix.tz2));
  } else if (tz.slice(0, 3) === 'tz3') {
    pkHex = '02' + buf2hex(b58cdecode(tz, prefix.tz3));
  }
  return pkHex;
}

const getManagerScript = (pkh: string) => {
  let pkHex: string;
  if (pkh.slice(0, 2) === 'tz') {
    pkHex = '00' + buf2hex(b58cdecode(pkh, prefix.tz1));
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
                    prim: 'unit'
                  },
                  {
                    prim: 'list',
                    args: [
                      {
                        prim: 'operation'
                      }
                    ]
                  }
                ],
                annots: [
                  '%do'
                ]
              },
              {
                prim: 'unit',
                annots: [
                  '%default'
                ]
              }
            ]
          }
        ]
      },
      {
        prim: 'storage',
        args: [
          {
            prim: 'key_hash'
          }
        ]
      },
      {
        prim: 'code',
        args: [
          [
            [
              [
                {
                  prim: 'DUP'
                },
                {
                  prim: 'CAR'
                },
                {
                  prim: 'DIP',
                  args: [
                    [
                      {
                        prim: 'CDR'
                      }
                    ]
                  ]
                }
              ]
            ],
            {
              prim: 'IF_LEFT',
              args: [
                [
                  {
                    prim: 'PUSH',
                    args: [
                      {
                        prim: 'mutez'
                      },
                      {
                        'int': '0'
                      }
                    ]
                  },
                  {
                    prim: 'AMOUNT'
                  },
                  [
                    [
                      {
                        prim: 'COMPARE'
                      },
                      {
                        prim: 'EQ'
                      }
                    ],
                    {
                      prim: 'IF',
                      args: [
                        [

                        ],
                        [
                          [
                            {
                              prim: 'UNIT'
                            },
                            {
                              prim: 'FAILWITH'
                            }
                          ]
                        ]
                      ]
                    }
                  ],
                  [
                    {
                      prim: 'DIP',
                      args: [
                        [
                          {
                            prim: 'DUP'
                          }
                        ]
                      ]
                    },
                    {
                      prim: 'SWAP'
                    }
                  ],
                  {
                    prim: 'IMPLICIT_ACCOUNT'
                  },
                  {
                    prim: 'ADDRESS'
                  },
                  {
                    prim: 'SENDER'
                  },
                  [
                    [
                      {
                        prim: 'COMPARE'
                      },
                      {
                        prim: 'EQ'
                      }
                    ],
                    {
                      prim: 'IF',
                      args: [
                        [

                        ],
                        [
                          [
                            {
                              prim: 'UNIT'
                            },
                            {
                              prim: 'FAILWITH'
                            }
                          ]
                        ]
                      ]
                    }
                  ],
                  {
                    prim: 'UNIT'
                  },
                  {
                    prim: 'EXEC'
                  },
                  {
                    prim: 'PAIR'
                  }
                ],
                [
                  {
                    prim: 'DROP'
                  },
                  {
                    prim: 'NIL',
                    args: [
                      {
                        prim: 'operation'
                      }
                    ]
                  },
                  {
                    prim: 'PAIR'
                  }
                ]
              ]
            }
          ]
        ]
      }
    ],
    storage:
      { bytes: pkHex }
  };
}

export {
  getContractDelegation,
  getContractPkhTransaction,
  getContractKtTransaction,
  kt2hex,
  tz2hex,
  getManagerScript
}
