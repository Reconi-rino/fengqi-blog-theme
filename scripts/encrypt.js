/**
 * 终端一键加密脚本: node scripts/encrypt.js
 * 也可以直接在前端网页的秘密基地「加密新内容」选项卡中生成！
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFile = path.resolve(__dirname, '../content/secret.enc');

// 示例私密 Markdown 内容
const sampleSecretMarkdown = `# 🌙 隐秘之境 (Secret Sanctuary)

> “这里是写给自己的真心话，不设防备的自留地。”

很高兴你找到了这里。这里记录了一些未公开的碎碎念、私密胶片故事与灵感草稿。

### 📌 未公开的思考清单
- [x] 完成风栖主题系统 v1.0 的全套美学打磨与数学级加密
- [ ] 在下一个雨天，带上胶片相机去老茶馆坐一个下午
- [ ] 尝试写一篇关于「数字慢生活与注意力恢复」的长文随笔

> [!NOTE] 密室留言
> 一切从简，留白给呼吸。无论外面的世界多么嘈杂，这里永远有一盏为你保留的灯。
`;

const defaultPassword = process.argv[2] || 'fengqi2026';

function encrypt(text, password) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  const combined = Buffer.concat([salt, iv, encrypted, tag]);
  return combined.toString('base64');
}

const cipherBase64 = encrypt(sampleSecretMarkdown, defaultPassword);
fs.writeFileSync(targetFile, cipherBase64, 'utf8');

console.log(`\n✨ 加密成功！`);
console.log(`📁 密文已保存至: content/secret.enc`);
console.log(`🔑 默认解密密码为: ${defaultPassword}\n`);
