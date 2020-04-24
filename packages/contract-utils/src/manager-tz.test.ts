import { getManagerScript, getContractPkhTransaction, getContractKtTransaction, getContractDelegation, getContractUndelegation } from './manager-tz';
import { base58decode, bufToHex, prefix } from '../../crypto-utils/src/common';

describe('#getManagerScript', () => {
  it('should return valid object', () => {
    const pkh = 'tz1aUeHkd33tRrL3nKQNRFJrm2LMTFrqHMMW';
    const expected = {
      code: [
        {
          prim: "parameter",
          args: [
            {
              prim: "or",
              args: [
                {
                  prim: "lambda",
                  args: [
                    {
                      prim: "unit"
                    },
                    {
                      prim: "list",
                      args: [
                        {
                          prim: "operation"
                        }
                      ]
                    }
                  ],
                  annots: ["%do"]
                },
                {
                  prim: "unit",
                  annots: ["%default"]
                }
              ]
            }
          ]
        },
        {
          prim: "storage",
          args: [
            {
              prim: "key_hash"
            }
          ]
        },
        {
          prim: "code",
          args: [
            [
              [
                [
                  {
                    prim: "DUP"
                  },
                  {
                    prim: "CAR"
                  }, {
                    prim: "DIP",
                    args: [
                      [
                        {
                          prim: "CDR"
                        }
                      ]
                    ]
                  }
                ]
              ],
              {
                prim: "IF_LEFT",
                args: [
                  [
                    {
                      prim: "PUSH",
                      args: [
                        {
                          prim: "mutez"
                        },
                        {
                          int: "0"
                        }
                      ]
                    },
                    {
                      prim: "AMOUNT"
                    },
                    [
                      [
                        {
                          prim: "COMPARE"
                        },
                        {
                          prim: "EQ"
                        }
                      ],
                      {
                        prim: "IF",
                        args: [
                          [],
                          [
                            [
                              {
                                prim: "UNIT"
                              },
                              {
                                prim: "FAILWITH"
                              }
                            ]
                          ]
                        ]
                      }
                    ],
                    [
                      {
                        prim: "DIP",
                        args: [
                          [
                            {
                              prim: "DUP"
                            }
                          ]
                        ]
                      },
                      {
                        prim: "SWAP"
                      }
                    ],
                    {
                      prim: "IMPLICIT_ACCOUNT"
                    },
                    {
                      prim: "ADDRESS"
                    },
                    {
                      prim: "SENDER"
                    },
                    [
                      [
                        {
                          prim: "COMPARE"
                        },
                        {
                          prim: "EQ"
                        }
                      ],
                      {
                        prim: "IF",
                        args: [
                          [],
                          [
                            [
                              {
                                prim: "UNIT"
                              },
                              {
                                prim: "FAILWITH"
                              }
                            ]
                          ]
                        ]
                      }
                    ],
                    {
                      prim: "UNIT"
                    },
                    {
                      prim: "EXEC"
                    },
                    {
                      prim: "PAIR"
                    }
                  ],
                  [
                    {
                      prim: "DROP"
                    },
                    {
                      prim: "NIL",
                      args: [
                        {
                          prim: "operation"
                        }
                      ]
                    },
                    {
                      prim: "PAIR"
                    }
                  ]
                ]
              }
            ]
          ]
        }
      ],
      storage: {
        bytes: "00a2c3712f5d62b63ee60fa1ee199972aa8fc408d8"
      }
    };
    expect(getManagerScript(pkh)).toEqual(expected);
  });
});

describe('#getContractPkhTransaction', () => {
  it('should return valid object', () => {
    const pkh = 'tz1aUeHkd33tRrL3nKQNRFJrm2LMTFrqHMMW';
    const amount = '1234570';
    const expected = {
      entrypoint:"do",
      value: [
        {
          prim:"DROP"
        },
        {
          prim:"NIL",
          args: [
            {
              prim:"operation"
            }
          ]
        },
        {
          prim: "PUSH",
          args: [
            {
              prim: "key_hash"
            },
            {
              bytes: "00a2c3712f5d62b63ee60fa1ee199972aa8fc408d8"
            }
          ]
        },
        {
          prim: "IMPLICIT_ACCOUNT"
        },
        {
          prim: "PUSH",
          args: [
            {
              prim: "mutez"
            },
            {
              int: "1234570"
            }
          ]
        },
        {
          prim: "UNIT"
        },
        {
          prim: "TRANSFER_TOKENS"
        },
        {
          prim: "CONS"
        }
      ]
    };
    expect(getContractPkhTransaction(pkh, amount)).toEqual(expected);
  });
});

describe('#getContractKtTransaction', () => {
  it('should return valid object', () => {
    const kt1 = 'KT19AxPuwqtPD91VbfC6fBir7RXRBvTDMRgo';
    const amount = '6356845';
    const expected = {
      entrypoint: "do",
      value: [
        {
          prim: "DROP"
        },
        {
          prim: "NIL",
          args: [
            {
              prim: "operation"
            }
          ]
        },
        {
          prim: "PUSH",
          args: [
            {
              prim: "address"
            },
            {
              bytes: "0106772ee9600d3ec68c346f2f4f1f6e8e8950405c00"
            }
          ]
        },
        {
          prim: "CONTRACT",
          args: [
            {
              prim: "unit"
            }
          ]
        },
        [
          {
            prim: "IF_NONE",
            args: [
              [
                [
                  {
                    prim: "UNIT"
                  },
                  {
                    prim: "FAILWITH"
                  }
                ]
              ],
              []
            ]
          }
        ],
        {
          prim: "PUSH",
          args: [
            {
              prim: "mutez"
            },
            {
              int: "6356845"
            }
          ]
        },
        {
          prim: "UNIT"
        },
        {
          prim: "TRANSFER_TOKENS"
        },
        {
          prim: "CONS"
        }
      ]
    };
    expect(getContractKtTransaction(kt1, amount)).toEqual(expected);
  });
});

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

describe('#getContractUndelegate', () => {
  it('should return valid object', () => {
    const expected = {
      entrypoint: "do",
      value: [
        {
          prim: "DROP"
        },
        {
          prim: "NIL",
          args: [
            {
              prim: "operation"
            }
          ]
        },
        {
          prim: "NONE",
          args: [
            {
              prim: "key_hash"
            }
          ]
        },
        {
          prim: "SET_DELEGATE"
        },
        {
          prim: "CONS"
        }
      ]
    };
    expect(getContractUndelegation()).toEqual(expected);
    expect(getContractDelegation('')).toEqual(expected);
  })
})