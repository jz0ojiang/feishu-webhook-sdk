// 四类消息的最小 payload 与统一接口

export type TextPayload = {
  msg_type: 'text';
  content: { text: string };
};

export type PostElem =
  | { tag: 'text'; text: string }
  | { tag: 'a'; text: string; href: string }
  | { tag: 'at'; user_id: string };

export type PostPayload = {
  msg_type: 'post';
  content: {
    post: {
      zh_cn: {
        title?: string;
        content: PostElem[][];
      };
    };
  };
};

export type ShareChatPayload = {
  msg_type: 'share_chat';
  content: { share_chat_id: string };
};

export type ImagePayload = {
  msg_type: 'image';
  content: { image_key: string };
};

export type FeishuPayload =
  | TextPayload
  | PostPayload
  | ShareChatPayload
  | ImagePayload;

export interface MessageLike {
  toPayload(): FeishuPayload | Promise<FeishuPayload>;
}


