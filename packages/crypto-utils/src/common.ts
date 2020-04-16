import * as libs from 'libsodium-wrappers';
import * as Bs58check from 'bs58check';

const prefix = {
  tz1: new Uint8Array([6, 161, 159]),
  tz2: new Uint8Array([6, 161, 161]),
  tz3: new Uint8Array([6, 161, 164]),
  edpk: new Uint8Array([13, 15, 37, 217]),
  edsk: new Uint8Array([43, 246, 78, 7]),
  edsig: new Uint8Array([9, 245, 205, 134, 18]),
  sig: new Uint8Array([4, 130, 43]),
  o: new Uint8Array([5, 116]),
  B: new Uint8Array([1, 52]),
  TZ: new Uint8Array([3, 99, 29]),
  KT: new Uint8Array([2, 90, 121])
};

const mergebuf = (b, wm = new Uint8Array([3])) => {
  const r = new Uint8Array(wm.length + b.length);
  r.set(wm);
  r.set(b, wm.length);
  return r;
}

const hexToBuf = (hex) => {
  return new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16);
  }));
}

const bufToHex = (buffer) => {
  const byteArray = new Uint8Array(buffer), hexParts = [];
  for (let i = 0; i < byteArray.length; i++) {
    const hex = byteArray[i].toString(16);
    const paddedHex = ('00' + hex).slice(-2);
    hexParts.push(paddedHex);
  }
  return hexParts.join('');
}

const addressToHex = (address) => {
  let pkHex;

  if (address.slice(0, 2) === 'KT') {
    pkHex = ('01' + bufToHex(b58cdecode(address, prefix.KT)) + '00');
  } else if (address.slice(0, 3) === 'tz1') {
    pkHex = '00' + bufToHex(b58cdecode(address, prefix.tz1));
  } else if (address.slice(0, 3) === 'tz2') {
    pkHex = '01' + bufToHex(b58cdecode(address, prefix.tz2));
  } else if (address.slice(0, 3) === 'tz3') {
    pkHex = '02' + bufToHex(b58cdecode(address, prefix.tz3));
  } else {
    throw new TypeError("Invalid public key hash");
  }
  return pkHex;
}

const b58cencode = (payload: any, prefixx?: Uint8Array) => {
  const n = new Uint8Array(prefixx.length + payload.length);
  n.set(prefixx);
  n.set(payload, prefixx.length);
  return Bs58check.encode(Buffer.from(bufToHex(n), 'hex'));
}

const b58cdecode = (enc, prefixx) => {
  let n = Bs58check.decode(enc);
  n = n.slice(prefixx.length);
  return n;
}

const hexToPk = (hex: string): string => {
  return b58cencode(hexToBuf(hex.slice(2, 66)), prefix.edpk);
}

const pk2pkh = (pk: string): string => {
  const pkDecoded = b58cdecode(pk, prefix.edpk);
  return b58cencode(libs.crypto_generichash(20, pkDecoded), prefix.tz1);
}

export {
  b58cencode,
  b58cdecode,
  mergebuf,
  hexToBuf,
  hexToPk,
  pk2pkh,
  bufToHex,
  prefix,
  addressToHex
}
