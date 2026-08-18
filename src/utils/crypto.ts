/**
 * 客户端标准 AES-256-GCM 密码学加密/解密引擎 (基于浏览器原生 Web Crypto API)
 * 无需任何明文密码硬编码，提供数学级端到端保密性。
 */

// 将 ArrayBuffer 转换为 Base64 字符串
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// 将 Base64 字符串转换为 Uint8Array
function base64ToBuffer(base64: string): Uint8Array {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// 使用 PBKDF2 从密码与盐派生 AES-256 密钥
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * 加密明文内容
 * @param plainText 待加密的明文 Markdown
 * @param password 用户设置的密码
 * @returns 密文 Base64 字符串 (包含 16字节 Salt + 12字节 IV + AES-GCM 密文)
 */
export async function encryptSecret(plainText: string, password: string): Promise<string> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const encoder = new TextEncoder();
  const encodedPlain = encoder.encode(plainText);

  const cipherBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
    },
    key,
    encodedPlain
  );

  // 拼接: Salt (16B) + IV (12B) + Ciphertext (带 16B Auth Tag)
  const combined = new Uint8Array(salt.length + iv.length + cipherBuffer.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(cipherBuffer), salt.length + iv.length);

  return bufferToBase64(combined.buffer);
}

/**
 * 解密密文内容
 * @param encryptedBase64 密文 Base64 字符串
 * @param password 用户输入的密码
 * @throws 密码错误或密文被篡改时抛出解密失败异常
 */
export async function decryptSecret(encryptedBase64: string, password: string): Promise<string> {
  try {
    const combined = base64ToBuffer(encryptedBase64);

    if (combined.length < 28) {
      throw new Error('密文格式不合法');
    }

    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const cipherText = combined.slice(28);

    const key = await deriveKey(password, salt);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as BufferSource,
      },
      key,
      cipherText
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (err) {
    throw new Error('密钥错误或密文损坏，无法开启隐秘之境。');
  }
}
