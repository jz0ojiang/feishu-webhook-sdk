import type { FeishuPayload, MessageLike } from './messages/types';

/**
 * 将 MessageLike 或原生 payload 统一为 FeishuPayload
 */
export async function buildPayload(input: FeishuPayload | MessageLike): Promise<FeishuPayload> {
  const maybe = input as any;
  if (maybe && typeof maybe.toPayload === 'function') {
    return await (input as MessageLike).toPayload();
  }
  return input as FeishuPayload;
}


