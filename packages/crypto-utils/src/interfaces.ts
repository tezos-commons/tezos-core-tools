export interface KeyPair {
  sk: string | null;
  pk: string | null;
  pkh: string;
}

export interface SignedOps {
  bytes: string;
  sig: Uint8Array;
  edsig: string;
  sbytes: string;
}