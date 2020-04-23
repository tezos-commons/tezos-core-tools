import * as bip39 from 'bip39';
import { blake2b } from 'blakejs';
import { sign as naclSign } from 'tweetnacl';
import { KeyPair, SignedOps } from './interfaces';
import {
  base58encode,
  base58decode,
  mergebuf,
  hexToBuf,
  bufToHex,
  prefix as _prefix,
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

const mnemonic2seed = (mnemonic: string, passphrase = '', bip32Seed = false): Buffer => {
  if (!validMnemonic(mnemonic)) {
    throw new Error('InvalidMnemonic');
  }
  return bip39.mnemonicToSeedSync(mnemonic, passphrase).slice(0, bip32Seed ? 64 : 32);
};

const seed2keyPair = (seed: Buffer): KeyPair => {
  if (!seed) {
    throw new Error('NullSeed');
  }
  const keyPair = naclSign.keyPair.fromSeed(seed);
  return {
    sk: base58encode(keyPair.secretKey, _prefix.edsk),
    pk: base58encode(keyPair.publicKey, _prefix.edpk),
    pkh: base58encode(blake2b(keyPair.publicKey, null, 20), _prefix.tz1),
  };
};

const deriveContractAddress = (
  sopBytes: string,
  n = 0
): string => {
  const hash = blake2b(mergebuf(hexToBuf(sopBytes)), null, 32);
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
    address && address.length === 36 &&
    (validBase58string(address, 'tz1') ||
      validBase58string(address, 'tz2') ||
      validBase58string(address, 'tz3'))
  );
};

const validContractAddress = (address: string): boolean => {
  return address && address.length === 36 &&
    validBase58string(address, 'KT1');
};

const validAddress = (address: string): boolean => {
  return validImplicitAddress(address) || validContractAddress(address);
};

const validOperationHash = (opHash: string): boolean => {
  return opHash.length === 51 && validBase58string(opHash, 'o');
};

const addressToHex = (address: string): string => {
  if (!validAddress(address)) {
    throw new TypeError('Invalid address');
  } else if (address.slice(0, 2) === 'KT') {
    return '01' + bufToHex(base58decode(address, _prefix.KT1)) + '00';
  } else if (address.slice(0, 3) === 'tz1') {
    return '00' + bufToHex(base58decode(address, _prefix.tz1));
  } else if (address.slice(0, 3) === 'tz2') {
    return '01' + bufToHex(base58decode(address, _prefix.tz2));
  } else if (address.slice(0, 3) === 'tz3') {
    return '02' + bufToHex(base58decode(address, _prefix.tz3));
  } else {
    throw new Error('Base58DecodingError');
  }
};

const sign = (bytes: string, sk: string): SignedOps => {
  const hash = blake2b(mergebuf(hexToBuf(bytes)), null, 32);
  const sig = naclSign.detached(hash, base58decode(sk, _prefix.edsk));
  const edsig = base58encode(sig, _prefix.edsig);
  const sbytes = bytes + bufToHex(sig);
  return {
    bytes,
    sig,
    edsig,
    sbytes,
  };
};

const sigToEdsig = (sig: string): string => {
  return base58encode(hexToBuf(sig), _prefix.edsig);
};

const pkToPkh = (pk: string): string => {
  const pkDecoded = base58decode(pk, _prefix.edpk);
  return base58encode(blake2b(pkDecoded, null, 20), _prefix.tz1);
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
  sign,
  sigToEdsig,
  addressToHex,
  pkToPkh,
};
