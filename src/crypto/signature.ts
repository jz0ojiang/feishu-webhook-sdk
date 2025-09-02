// src/crypto/signature.ts

/**
 * 生成飞书自定义机器人签名：
 * sign = Base64( HMAC_SHA256( `${timestamp}\n${secret}`, key=secret ) )
 */

const te = new TextEncoder();

function isWebCryptoAvailable(): boolean {
  // 仅在具有 Web 平台特征时启用（需要 subtle 与 btoa）
  return typeof crypto !== 'undefined' && !!(crypto as any).subtle && typeof btoa !== 'undefined';
}

function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

async function hmacSha256Base64WebEmpty(keyString: string): Promise<string> {
  // key = `${timestamp}\n${secret}`, message = ""（空）
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    te.encode(keyString),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", cryptoKey, te.encode(""));
  return arrayBufferToBase64(sigBuf);
}

async function hmacSha256Base64NodeEmpty(keyString: string): Promise<string> {
  // 动态导入，避免在浏览器打包时引入 node:crypto
  const { createHmac } = await import('node:crypto');
  // 对空消息做 HMAC-SHA256
  return createHmac('sha256', keyString).digest('base64');
}

async function hmacSha256Base64Empty(keyString: string): Promise<string> {
  if (isWebCryptoAvailable()) {
    try {
      return await hmacSha256Base64WebEmpty(keyString);
    } catch (_) {
      // 回退到 Node HMAC
    }
  }
  return await hmacSha256Base64NodeEmpty(keyString);
}

/**
 * 飞书 webhook 签名：传入 timestamp（秒）与 secret，返回 { timestamp, sign }
 * - 自动在不同运行时选择 WebCrypto 或 Node HMAC
 */

export async function generateWebhookSign(secret: string): Promise<{ timestamp: string, sign: string }> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const keyString = `${timestamp}\n${secret}`;
  const sign = await hmacSha256Base64Empty(keyString);
  return { timestamp, sign };
}