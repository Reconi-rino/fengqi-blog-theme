/**
 * 终端一键加密脚本: node scripts/encrypt.js [password]
 * 生成包含独立 Writing 与 Note 的里世界结构化加密包
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFile = path.resolve(__dirname, '../content/secret.enc');

// 里世界独立数据结构 (Writing 文章 + Notes 随记)
const sampleSecretData = {
  version: "1.0",
  title: "fengqi.shadow",
  motto: "墨夜微光，不设防备的自留地。",
  articles: [
    {
      id: "shadow-01",
      title: "关于未公开的漫长等待与胶片颗粒",
      date: "2026.04.12",
      category: "私密随笔",
      readTime: "4 min read",
      excerpt: "有些照片从未冲洗出来，就像有些话只能在深夜的自留地里完整说给自己听。",
      content: `# 关于未公开的漫长等待与胶片颗粒

> “在无人问津的深夜，真实的自我才慢慢浮出水面。”

去年冬天在杭州的一处旧书店角落，我拍下了半卷未过期的 Kodak Tri-X 400 黑白胶片。直到今天下午，我才在暗室里把它们显影出来。

### 影子的质感
胶片颗粒在放大机下呈现出一种粗糙但极具生命力的质感。没有算法磨皮，没有高饱和的色彩刺激，只有纯粹的光影与灰阶。

> [!NOTE] 密室随笔
> 很多时候，我们不需要被所有人看见。保持沉默和隐秘，反而是保护内心创作敏感度最好的方式。

### 为什么建立这个里世界？
表世界的文字更多是克制的、整理过的、适合公共阅读的；而这个里世界，存放着所有尚未完成的困惑、敏感的草稿、以及只对自己坦白的真实心绪。`
    },
    {
      id: "shadow-02",
      title: "数字极简主义与深夜的不插电漫游",
      date: "2026.03.28",
      category: "隐秘思考",
      readTime: "3 min read",
      excerpt: "关掉所有的推送通知，把手机扔在另一个房间，找回属于自己的专注与呼吸。",
      content: `# 数字极简主义与深夜的不插电漫游

当代互联网的本质是争夺人类的注意力。每一个红点、每一次震动，都是对大脑认知资源的野蛮掠夺。

### 尝试执行的私密法则：
1. **日落后无屏幕**：晚上 10 点后不再打开任何信息流 App。
2. **纯文本写作**：用最极简的编辑器记录，不为排版分心。
3. **物理世界感知**：多去触摸真实的纸张、木头、冷风与水流。

> [!TIP] 灵感记录
> “生活不在屏幕里，而在你关上屏幕的那一刻重新开始。”`
    }
  ],
  notes: [
    {
      id: "sn-01",
      date: "2026.04.18",
      tag: "灵感备忘",
      content: "完成风栖里世界的独立架构：暗夜水彩背景 + 萤火微生态。这种沉浸感比预想中还要让人安心。"
    },
    {
      id: "sn-02",
      date: "2026.04.05",
      tag: "胶片杂记",
      content: "徕卡 M10-R 搭配 35mm 镜头在弱光下的层次感依然无可替代。下周尝试拍一组雨夜霓虹与湿润石板路的微光特写。"
    },
    {
      id: "sn-03",
      date: "2026.03.22",
      tag: "深夜思考",
      content: "不要害怕被遗忘。在这个急躁的时代，愿意花时间慢慢记录、慢慢雕琢的人，终会在自己的宇宙里发光。"
    }
  ]
};

const defaultPassword = process.argv[2] || 'fengqi2026';

function encrypt(dataObj, password) {
  const text = JSON.stringify(dataObj);
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  const combined = Buffer.concat([salt, iv, encrypted, tag]);
  return combined.toString('base64');
}

const cipherBase64 = encrypt(sampleSecretData, defaultPassword);
fs.writeFileSync(targetFile, cipherBase64, 'utf8');

console.log(`\n✨ 里世界数据打包加密成功！`);
console.log(`📁 密文已保存至: content/secret.enc`);
console.log(`🔑 默认解密密码为: ${defaultPassword}`);
console.log(`📚 包含: ${sampleSecretData.articles.length} 篇隐秘文章, ${sampleSecretData.notes.length} 条隐秘随记\n`);
