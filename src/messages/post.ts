import type { PostElem, PostPayload } from './types';

/**
 * 构建最小的中文富文本 Post 消息
 * rows 形如：[[text('A')], [text('B'), link('官网','https://...')]]
 */
export function buildPostZh(
  title: string | undefined,
  rows: PostElem[][]
): PostPayload {
  return {
    msg_type: 'post',
    content: {
      post: {
        zh_cn: { title, content: rows }
      }
    }
  };
}

export const text = (s: string): PostElem => ({ tag: 'text', text: s });
export const link = (label: string, href: string): PostElem => ({ tag: 'a', text: label, href });
export const at = (userId: string): PostElem => ({ tag: 'at', user_id: userId });


