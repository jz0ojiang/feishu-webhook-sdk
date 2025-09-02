## feishu-webhook-sdk

轻量、零依赖的 TypeScript SDK，用于通过飞书（Lark）自定义机器人 Webhook 发送消息。支持 Node 18+、Bun、Deno、Cloudflare Workers。仅覆盖四种最常用消息：text、post(zh_cn)、share_chat、image。

### 安装

```bash
pnpm add feishu-webhook-sdk
```

### 快速开始

```ts
import { FeishuBot, buildText } from 'feishu-webhook-sdk';

const bot = new FeishuBot(process.env.WEBHOOK!, process.env.SIGN);
await bot.send(buildText('ok'));
```

说明：
- 若构造时提供了 `secret`（即 SIGN），SDK 会自动计算签名并在请求体中携带 `timestamp` 与 `sign`。
- 请求体最终形如：`{ timestamp, sign, msg_type, content }`。

### 发送四种消息

```ts
import {
  buildText,
  buildPostZh, text, link, at,
  buildShareChat,
  buildImage,
} from 'feishu-webhook-sdk';

// 文本
await bot.send(buildText('部署完成 ✅'));

// 富文本（最小：二维数组 + 行内元素）
await bot.send(buildPostZh('发布说明', [
  [ text('版本：v1.2.3') ],
  [ text('变更：'), link('详情', 'https://example.com/changelog'), text(' '), at('ou_xxx') ],
]));

// 群名片（需已知 share_chat_id）
await bot.send(buildShareChat('oc_abcdefg123456'));

// 图片（需已有 image_key）
await bot.send(buildImage('img_ecbefa09-xxxxxx'));
```

### 直接生成签名并自行发送（可选）

```ts
import { generateWebhookSign } from 'feishu-webhook-sdk';

async function sendFeishuMessage(webhook: string, secret: string, textMsg: string) {
  const { timestamp, sign } = await generateWebhookSign(secret);
  const body = { timestamp, sign, msg_type: 'text', content: { text: textMsg } };
  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  try { return await res.json(); } catch { return await res.text(); }
}
```

### 运行示例脚本

仓库内提供了一个最小示例（会自动从 `.env` 读取 `WEBHOOK` 与 `SIGN`）：

```bash
pnpm build
pnpm run example:send-text
```

`.env` 示例：

```
WEBHOOK=https://open.feishu.cn/xxx
SIGN=your-secret
```

### 设计原则与特性

- 零依赖：使用原生 fetch 与 Web Crypto/Node Crypto。
- 强类型：TypeScript 严格模式，提供最小且清晰的类型定义与 helpers。
- 多运行时：自动选择 WebCrypto 或 Node HMAC 计算签名。
- 简单易用：统一 `buildPayload()` + `bot.send()` 思路，同时保留原始 payload 直传。

### 文档与参考

- 飞书开放平台文档：自定义机器人与消息格式（请在开放平台搜索“自定义机器人 Webhook”“消息结构体 post/text/image/share_chat”）。
- 签名算法：HMAC-SHA256，key 为 `${timestamp}\n${secret}`，对空消息签名，结果 Base64。

### 许可证

MIT


