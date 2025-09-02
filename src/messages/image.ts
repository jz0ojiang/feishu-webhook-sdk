import type { ImagePayload } from './types';

/** 构建图片消息（需已有 image_key） */
export function buildImage(image_key: string): ImagePayload {
  return { msg_type: 'image', content: { image_key } };
}


