import type { ShareChatPayload } from './types';

/** 构建群名片消息 */
export function buildShareChat(share_chat_id: string): ShareChatPayload {
  return { msg_type: 'share_chat', content: { share_chat_id } };
}


