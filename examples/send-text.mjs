// 运行方式：
//   WEBHOOK="https://open.feishu.cn/..." SIGN="your-secret" node examples/send-text.mjs
// 或在 Windows PowerShell：
//   $env:WEBHOOK="https://open.feishu.cn/..."; $env:SIGN="your-secret"; node examples/send-text.mjs

import {
  FeishuBot,
  buildPostZh,
  text,
  link,
  at,
} from "../dist/index.js";

const webhook = process.env.WEBHOOK;
const secret = process.env.SIGN || undefined;

if (!webhook) {
  console.error("Missing env WEBHOOK");
  process.exit(1);
}

const bot = new FeishuBot(webhook, secret);

try {
  //   const resp = await bot.send(buildText('ok'));
  const resp = await bot.send(
    buildPostZh("这是标题", [
      [text("这是内容"), text("这是另一个内容")],
      [text("这里的内容是另一行")],
      [link("这是链接", "https://www.baidu.com")],
    //   [text("这是@某个用户"), at("xxxxxxxx")],
      [text("这是at全体"), at("all")],
    ])
  );
  console.log("resp", resp);
} catch (err) {
  console.error("Send failed:", err);
  process.exit(1);
}
