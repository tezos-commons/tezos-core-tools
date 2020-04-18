import * as bip39 from 'bip39';
import { blake2b } from 'blakejs';
import { sign as naclSign } from 'tweetnacl';
import { KeyPair, SignedOps } from './interfaces';
import {
  base58encode,
  base58decode,
  mergebuf,
  hex2buf,
  buf2hex,
  prefix as _prefix
} from './common';

const generateMnemonic = (numberOfWords = 15): string => {
  if ([15, 18, 21, 24].indexOf(numberOfWords) !== -1) {
    return bip39.generateMnemonic((numberOfWords * 32) / 3);
  } else {
    throw new Error('InvalidNumberOfWords');
  }
};

const validMnemonic = (mnemonic: string): boolean => {
  return bip39.validateMnemonic(mnemonic);
};

const mnemonic2seed = (mnemonic: string, passphrase = ''): Buffer => {
  if (!validMnemonic(mnemonic)) {
    throw new Error('InvalidMnemonic');
  }
  return bip39.mnemonicToSeedSync(mnemonic, passphrase).slice(0, 32);
};

const seed2keyPair = async (seed: Buffer): Promise<KeyPair> => {
  if (!seed) {
    throw new Error('NullSeed');
  }
  const keyPair = naclSign.keyPair.fromSeed(seed);
  return {
    sk: base58encode(keyPair.secretKey, _prefix.edsk),
    pk: base58encode(keyPair.publicKey, _prefix.edpk),
    pkh: base58encode(blake2b(keyPair.publicKey, null, 20), _prefix.tz1)
  };
};

const deriveContractAddress = async (sopBytes: string, n = 0): Promise<string> => {
  const hash = blake2b(mergebuf(hex2buf(sopBytes)), null, 32);
  const index = new Uint8Array([0, 0, 0, n]);
  const hash2 = blake2b(mergebuf(index, hash), null, 32);
  return base58encode(hash2, _prefix.KT1);
};

const validBase58string = (base58string: string, prefix: string): boolean => {
  try {
    let b58prefix: Uint8Array;
    if (
      base58string.slice(0, prefix.length) === prefix &&
      Object.prototype.hasOwnProperty.call(_prefix, prefix)
    ) {
      b58prefix = _prefix[prefix];
    } else {
      return false;
    }
    base58decode(base58string, b58prefix);
    return true;
  } catch {
    return false;
  }
};

const validImplicitAddress = (address: string): boolean => {
  return (
    address.length === 36 &&
    (validBase58string(address, 'tz1') ||
      validBase58string(address, 'tz2') ||
      validBase58string(address, 'tz3'))
  );
};

const validContractAddress = (address: string): boolean => {
  return address.length === 36 && validBase58string(address, 'KT1');
};

const validAddress = (address: string): boolean => {
  return validImplicitAddress(address) || validContractAddress(address);
};

const validOperationHash = (opHash: string): boolean => {
  return opHash.length === 51 && validBase58string(opHash, 'o');
};

const sign = (bytes: string, sk: string): SignedOps => {
  const hash = blake2b(mergebuf(hex2buf(bytes)), null, 32);
  const sig = naclSign.detached(hash, base58decode(sk, _prefix.edsk));
  const edsig = base58encode(sig, _prefix.edsig);
  const sbytes = bytes + buf2hex(sig);
  return {
    bytes,
    sig,
    edsig,
    sbytes
  };
};

export {
  generateMnemonic,
  mnemonic2seed,
  seed2keyPair,
  validMnemonic,
  validAddress,
  validImplicitAddress,
  validContractAddress,
  validOperationHash,
  validBase58string,
  deriveContractAddress,
  sign
};
