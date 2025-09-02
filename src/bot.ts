import { buildPayload } from './buildPayload';
import type { FeishuPayload, MessageLike } from './messages/types';
import { generateWebhookSign } from './crypto/signature';

export type BotOptions = { fetchImpl?: typeof fetch };

export class FeishuBot {
  private fetchImpl: typeof fetch;

  constructor(private webhookUrl: string, private secret?: string, opts: BotOptions = {}) {
    if (!webhookUrl) throw new Error('webhookUrl is required');
    this.fetchImpl = opts.fetchImpl ?? fetch;
  }

  private async buildAuth() {
    if (!this.secret) {
      const ts = String(Math.floor(Date.now() / 1000));
      return { timestamp: ts };
    }
    return await generateWebhookSign(this.secret);
  }

  /** 发送任意 Feishu 消息（原生 payload 或实现 MessageLike 的对象） */
  async send(msg: FeishuPayload | MessageLike): Promise<unknown> {
    const payload = await buildPayload(msg);
    const auth = await this.buildAuth();
    const body = JSON.stringify({ ...auth, ...payload });

    const res = await this.fetchImpl(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    try { return await res.json(); } catch { return await res.text(); }
  }
}


