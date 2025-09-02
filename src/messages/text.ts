import type { TextPayload } from './types';

/** 构建文本消息 */
export function buildText(text: string): TextPayload {
  return { msg_type: 'text', content: { text } };
}


