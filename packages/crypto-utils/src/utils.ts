import * as libs from 'libsodium-wrappers';
import * as bip39 from 'bip39';
import { Buffer } from 'buffer';

import { KeyPair } from './interfaces';
import { 
  b58cencode,
  b58cdecode,
  mergebuf,
  hex2buf,
  buf2hex,
  prefix
} from './common';

const createKTaddress = (sopBytes: string): string => {
  const hash = libs.crypto_generichash(32, hex2buf(sopBytes));
  const index = new Uint8Array([0, 0, 0, 0]);
  const hash2 = libs.crypto_generichash(20, mergebuf(index, hash));
  return b58cencode(hash2, prefix.KT);
}

const seed2keyPair = (seed: Buffer): KeyPair => {
  if (!seed) {
    throw new Error('NullSeed');
  }
  const keyPair = libs.crypto_sign_seed_keypair(seed);
  return {
    sk: b58cencode(keyPair.privateKey, prefix.edsk),
    pk: b58cencode(keyPair.publicKey, prefix.edpk),
    pkh: b58cencode(libs.crypto_generichash(20, keyPair.publicKey), prefix.tz1)
  };
}

const validMnemonic = (mnemonic: string) => {
  return bip39.validateMnemonic(mnemonic);
}

const mnemonic2seed = (mnemonic: string, passphrase = '') => {
  if (!validMnemonic(mnemonic)) {
    throw new Error('InvalidMnemonic');
  }
  return (bip39.mnemonicToSeedSync(mnemonic, passphrase)).slice(0, 32);
}

const validAddress = (address: string) => {
  try {
    b58cdecode(address, prefix.tz1);
    return true;
  } catch (e) {
    return false;
  }
}

const generateMnemonic = (): string => {
  return bip39.generateMnemonic(160);
}

const sign = (bytes, sk): any => {
  const hash = libs.crypto_generichash(32, mergebuf(hex2buf(bytes)));
  const sig = libs.crypto_sign_detached(hash, b58cdecode(sk, prefix.edsk), 'uint8array');
  const edsig = b58cencode(sig, prefix.edsig);
  const sbytes = bytes + buf2hex(sig);
  return {
    bytes: bytes,
    sig: sig,
    edsig: edsig,
    sbytes: sbytes,
  };
}

const verify = (bytes: string, sig: string, pk: string): boolean => {
  const hash = libs.crypto_generichash(32, mergebuf(hex2buf(bytes)));
  const signature = b58cdecode(sig, prefix.sig);
  const publicKey = b58cdecode(pk, prefix.edpk);
  return libs.crypto_sign_verify_detached(signature, hash, publicKey);
}

const sig2edsig = (sig: string): any => {
  return b58cencode(hex2buf(sig), prefix.edsig);
}

export {
  createKTaddress,
  seed2keyPair,
  mnemonic2seed,
  validMnemonic,
  validAddress,
  generateMnemonic,
  sign,
  verify,
  sig2edsig,
}
