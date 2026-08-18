/**
 * 终端一键加密脚本: node scripts/encrypt.js [password]
 * 生成包含独立 Writing 与 Note 的内在世界结构化加密包 (AES-256-GCM)
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFile = path.resolve(__dirname, '../content/secret.enc');

// 里世界独立数据结构 (对齐 Spec 和设计效果图)
const sampleSecretData = {
  version: "1.0",
  title: "fengqi.shadow",
  motto: "只为书写与思考保留的一方安静之地。",
  articles: [
    {
      id: "shadow-01",
      title: "很久很久的那一天",
      date: "2026.05.12",
      category: "思索",
      readTime: "8 min",
      excerpt: "那天没有风，时间像被按下了暂停键。我坐在窗前，看着光慢慢移动，把影子拉得很长，像是一段被延长的心事……",
      content: `# 很久很久的那一天

> “有些想法，来得很轻，也走得很轻。如果不写下来，它们就会像夜晚的雾气，悄悄散去，不留一点痕迹。”

那天没有风，时间像被按下了暂停键。我坐在窗前，看着光慢慢移动，把影子拉得很长，像是一段被延长的心事。

### 慢下来的缝隙

写作对我来说，不是为了被看见，而是为了看清楚。我把日常的感受、反复的念头、细小的顿悟，一点一点放进文字里，像整理抽屉，也像和自己对话。

在这个喧嚣的世界里，我们被太多声音推着向前，很少有时间停下来，听听内心真实的回应。而写作，恰好提供了这样一个缝隙，让我们与自己重新相遇。

> [!NOTE] 深夜手记
> 你不需要写得多好，也不必有明确的主题。只要是真实的，哪怕只是记录一片云的形状，或一次普通的散步，都是值得的。

愿这个小小的角落，成为你安放思绪的地方。
在内在世界，慢慢写，安心读。`
    },
    {
      id: "shadow-02",
      title: "关于安静的练习",
      date: "2026.05.11",
      category: "笔记",
      readTime: "5 min",
      excerpt: "让注意力慢下来，听见自己。在没有外界评价的空间里，文字才能长出原本的模样。",
      content: `# 关于安静的练习

当代生活最大的奢侈品，或许就是不被干扰的连续时间。

### 如何进入内在节奏
1. **关闭提示**：将即时通讯工具静音，建立专注边界。
2. **留白呼吸**：允许自己发呆、看窗外的树叶摇曳。
3. **真实表达**：不迎合读者预设，只忠于眼前的所思所想。

> [!TIP] 心流提示
> 写作是思维的显影液。在安静中慢慢浸泡，轮廓自会清晰。`
    },
    {
      id: "shadow-03",
      title: "在雾里行走",
      date: "2026.05.08",
      category: "书写",
      readTime: "7 min",
      excerpt: "看不清远处，却逐渐清楚自己要走的方向。脚步所及之处，就是真实的土地。",
      content: `# 在雾里行走

清晨的雾气笼罩着山道。能见度不过十米，但每走一步，前方的路就自然显露出一丈。

生活也是如此。我们往往总想看清十年后的全貌，却忘记了眼前这一步才是唯一能够踏实落下的地面。`
    },
    {
      id: "shadow-04",
      title: "小事也值得被记住",
      date: "2026.05.05",
      category: "笔记",
      readTime: "4 min",
      excerpt: "微小的光，构成生活的全部重量。一朵野花的绽放，并不需要全世界的掌声。",
      content: `# 小事也值得被记住

今天在巷口看见一只晒太阳的橘猫，它把爪子垫在下巴下面，眯着眼睛看落叶飘过。

世界很大，但生活的质感往往藏在这些微不足道的琐碎与片刻里。`
    },
    {
      id: "shadow-05",
      title: "内在世界的边界",
      date: "2026.05.02",
      category: "思索",
      readTime: "6 min",
      excerpt: "我们以为的极限，常常只是习惯的边界。推开门，夜色深处自有光芒。",
      content: `# 内在世界的边界

所谓边界，往往是自我设限的产物。建立这处内在世界的初衷，就是给灵魂保留一个不设防备、可以随时归航的港湾。`
    },
    {
      id: "shadow-06",
      title: "一封写给未来的信",
      date: "2026.04.29",
      category: "书写",
      readTime: "9 min",
      excerpt: "亲爱的未来的你，希望你依然温柔而清醒，依然对世界保有最初的敬畏与热忱。",
      content: `# 一封写给未来的信

如果未来的某一天你重新回到这里，希望你能够记住：无论走得多远，都不要忘记曾经在夜里静静写下文字的自己。`
    },
    {
      id: "shadow-07",
      title: "关于夜晚的一切",
      date: "2026.04.26",
      category: "笔记",
      readTime: "5 min",
      excerpt: "夜晚并不黑暗，它只是另一种光的形态。夜色让杂音消退，让心跳重新被听见。",
      content: `# 关于夜晚的一切

当城市的光线暗下去，星光和月色才会显现。夜晚赋予我们思考的深度，赋予文字温柔的庇护。`
    }
  ],
  notes: [
    {
      id: "note-01",
      date: "2026.05.11",
      tag: "日常",
      content: "雨停了。\n\n傍晚的风很轻，巷口的积水在发光。有人说，城市也会呼吸。"
    },
    {
      id: "note-02",
      date: "2026.05.08",
      tag: "观察",
      content: "一片叶子落在水面上，轻轻转了两圈，最后沉下去，像一个小小的决定。\n\n有些事情不需要答案，只需要时间让它沉下去。"
    },
    {
      id: "note-03",
      date: "2026.05.06",
      tag: "灵感",
      content: "夜晚的对白。\n\n如果月亮会说话，它大概会选择沉默。因为最好的倾听，就是无声的陪伴。"
    },
    {
      id: "note-04",
      date: "2026.05.04",
      tag: "日常",
      content: "地铁里。\n\n人们低头，屏幕发光，像一群安静的萤火虫。在城市的地下通道里穿梭，各自怀着未说出口的梦。"
    },
    {
      id: "note-05",
      date: "2026.05.02",
      tag: "观察",
      content: "猫经过。\n\n它看了我一眼，然后继续走它的路。我想，我们都在赶路，只是它的步调更轻更笃定。"
    },
    {
      id: "note-06",
      date: "2026.04.30",
      tag: "梦境",
      content: "梦里回到旧房子。\n\n门没锁，屋里很暗，但我知道灯在哪里。童年的阳光依然停留在老木桌的裂缝里。"
    },
    {
      id: "note-07",
      date: "2026.04.25",
      tag: "其他",
      content: "雨停之后的气味。\n\n空气变轻。泥土从深处呼吸，带着一点冷意，也带着刚被洗过的树叶的暗香。远处的路灯还亮着，在湿漉漉的地面上开出柔软的光斑。我站了很久。"
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

console.log(`\n✨ 内在世界数据打包加密成功！`);
console.log(`📁 密文已保存至: content/secret.enc`);
console.log(`🔑 默认解密密码为: ${defaultPassword}`);
console.log(`📚 包含: ${sampleSecretData.articles.length} 篇隐秘文章, ${sampleSecretData.notes.length} 条隐秘随记\n`);
