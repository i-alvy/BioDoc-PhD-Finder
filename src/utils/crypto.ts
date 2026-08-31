/**
 * AES-GCM 256-bit Client-Side Encryption with PBKDF2 Key Derivation
 * Ensures all user CVs, research profiles, and application logs can be
 * encrypted at rest and before syncing to the cloud.
 */

const DEFAULT_SALT = new Uint8Array([12, 45, 99, 134, 21, 88, 172, 43, 19, 204, 76, 32, 85, 11, 230, 91]);

export async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptData(data: any, passphrase: string): Promise<string> {
  try {
    const enc = new TextEncoder();
    const jsonString = JSON.stringify(data);
    const encodedData = enc.encode(jsonString);

    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const key = await deriveKey(passphrase, salt);

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encodedData
    );

    const payload = {
      salt: Array.from(salt),
      iv: Array.from(iv),
      ciphertext: Array.from(new Uint8Array(encryptedBuffer)),
      timestamp: new Date().toISOString(),
      algo: "AES-256-GCM",
    };

    return btoa(JSON.stringify(payload));
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt profile data.");
  }
}

export async function decryptData(encryptedBase64: string, passphrase: string): Promise<any> {
  try {
    const jsonStr = atob(encryptedBase64);
    const payload = JSON.parse(jsonStr);

    const salt = new Uint8Array(payload.salt);
    const iv = new Uint8Array(payload.iv);
    const ciphertext = new Uint8Array(payload.ciphertext);

    const key = await deriveKey(passphrase, salt);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    const decryptedJson = dec.decode(decryptedBuffer);
    return JSON.parse(decryptedJson);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Invalid decryption passphrase or corrupted encrypted record.");
  }
}
