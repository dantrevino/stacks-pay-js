// src/utils.ts

import { bech32m } from "bech32";
import { c32addressDecode } from "c32check";

export function isValidToken(token: string): boolean {
  if (token === "STX") return true;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [address, contractName] = parts;
  return validateStacksAddress(address) && contractName.length > 0;
}

export function isValidAmount(amount: string): boolean {
  return /^[0-9]+(\.[0-9]+)?$/.test(amount);
}

export function isValidISODate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

// Bech32m encoding and decoding
export function bech32mEncode(data: string): string {
  const words = bech32m.toWords(Buffer.from(data, "utf8"));
  return bech32m.encode("stx", words, 512);
}

export function bech32mDecode(bech32mEncoded: string): string {
  const decoded = bech32m.decode(bech32mEncoded, 512);
  console.log("decoded prefix: ", decoded.prefix);
  if (decoded.prefix !== "stx") {
    throw new Error("Invalid HRP in Bech32m encoded string");
  }
  const bytes = Buffer.from(bech32m.fromWords(decoded.words));
  return bytes.toString("utf8");
}

// from @stacks/transactions
export const validateStacksAddress = (address: string): boolean => {
  try {
    c32addressDecode(address);
    return true;
  } catch (e) {
    return false;
  }
};
