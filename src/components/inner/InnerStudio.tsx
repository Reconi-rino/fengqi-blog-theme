import React, { useState } from 'react';
import { ShadowData, ShadowArticle, ShadowNote } from '../ShadowWorld';
import { encryptSecret } from '../../utils/crypto';
import { CrescentMoonMotif, StarMotif, LeafMotif } from '../Motifs';

interface InnerStudioProps {
  data: ShadowData;
  onUpdateData: (newData: ShadowData) => void;
  onBackToLanding: () => void;
  onExitToSurface: () => void;
  onShowToast: (msg: string) => void;
}

export const InnerStudio: React.FC<InnerStudioProps> = ({
  data,
  onUpdateData,
  onBackToLanding,
  onExitToSurface,
  onShowToast,
}) => {
  const [studioType, setStudioType] = useState<'article' | 'note'>('article');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('随笔');
  const [tag, setTag] = useState('日常');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [generatedCipher, setGeneratedCipher] = useState<string | null>(null);

  const handleGenerateCipher = async () => {
    if (!content.trim() || !password.trim()) {
      onShowToast('请填写完整正文与加密密码');
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    let updatedArticles = [...(data.articles || [])];
    let updatedNotes = [...(data.notes || [])];

    if (studioType === 'article') {
      if (!title.trim()) {
        onShowToast('请输入文章标题');
        return;
      }
      const newArt: ShadowArticle = {
        id: `inner-art-${Date.now()}`,
        title: title.trim(),
        date: todayStr,
        category: category.trim() || '随笔',
        readTime: `${Math.max(1, Math.ceil(content.length / 300))} min`,
        excerpt: content.split('\n')[0].replace(/^#+\s*/, '') || '暂无摘要',
        content: content,
      };
      updatedArticles = [newArt, ...updatedArticles];
    } else {
      const newN: ShadowNote = {
        id: `inner-note-${Date.now()}`,
        date: todayStr,
        tag: tag.trim() || '日常',
        content: content,
      };
      updatedNotes = [newN, ...updatedNotes];
    }

    const updatedData: ShadowData = {
      ...data,
      articles: updatedArticles,
      notes: updatedNotes,
    };

    try {
      const cipher = await encryptSecret(JSON.stringify(updatedData), password);
      setGeneratedCipher(cipher);
      onUpdateData(updatedData);
      onShowToast('新密文数据已生成并应用');
      setTitle('');
      setContent('');
    } catch (err) {
      onShowToast('密文生成失败，请重试');
    }
  };

  const handleCopy = () => {
    if (generatedCipher) {
      navigator.clipboard?.writeText(generatedCipher);
      onShowToast('密文已复制到剪贴板');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-6 sm:p-12 lg:p-16 relative z-10 select-none">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between w-full max-w-4xl mx-auto pb-8 border-b border-[rgba(215,201,184,0.1)]">
        <div className="flex items-center gap-6">
          <button
            onClick={onBackToLanding}
            className="flex items-baseline gap-2 group text-left focus:outline-none"
          >
            <span className="font-serif text-2xl font-normal text-[#D7C9B8] group-hover:text-[#E8B48C] transition-colors">
              fengqi.
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-[#767E79] tracking-widest pl-2">
              inner world
            </span>
          </button>
          <span className="text-xs text-[#767E79] font-mono">/</span>
          <button
            onClick={onBackToLanding}
            className="text-xs font-sans text-[#A89E91] hover:text-[#D7C9B8] transition-colors flex items-center gap-1 focus:outline-none"
          >
            <span>← 返回索引</span>
          </button>
        </div>

        {/* 右上角：四角星芒按钮 */}
        <button
          onClick={onExitToSurface}
          className="group h-9 rounded-full border border-[rgba(215,201,184,0.18)] bg-[#151E22]/60 hover:bg-[#1E2B33]/80 text-xs font-sans text-[#A89E91] hover:text-[#D7C9B8] transition-all duration-300 flex items-center gap-2 px-2.5 hover:px-4 overflow-hidden focus:outline-none backdrop-blur-md"
          title="返回地表"
        >
          <StarMotif size={14} color="#E8B48C" className="group-hover:rotate-45 transition-transform duration-300 shrink-0" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[70px] transition-all duration-300 text-xs font-sans opacity-0 group-hover:opacity-100 text-[#D7C9B8]">
            返回地表
          </span>
        </button>
      </header>

      {/* 主体工作台 */}
      <main className="max-w-4xl mx-auto w-full py-10 flex-1 space-y-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#E8B48C] tracking-widest uppercase">
            <span>+</span>
            <span>STUDIO</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-[#D7C9B8]">
            密室工作台
          </h1>
          <p className="font-serif text-xs text-[#767E79]">
            在此撰写与更新内在世界的私密文章或随记，生成加密密文包。
          </p>
        </div>

        {/* 类型切换 */}
        <div className="flex items-center gap-3 text-xs font-sans">
          <button
            onClick={() => setStudioType('article')}
            className={`px-4 py-2 rounded-xl transition-all ${
              studioType === 'article'
                ? 'bg-[#E8B48C] text-[#0E1316] font-medium shadow-xs'
                : 'bg-[#151E22]/70 text-[#A89E91] border border-[rgba(215,201,184,0.1)] hover:text-[#D7C9B8]'
            }`}
          >
            + 撰写 Writing 文章
          </button>
          <button
            onClick={() => setStudioType('note')}
            className={`px-4 py-2 rounded-xl transition-all ${
              studioType === 'note'
                ? 'bg-[#E8B48C] text-[#0E1316] font-medium shadow-xs'
                : 'bg-[#151E22]/70 text-[#A89E91] border border-[rgba(215,201,184,0.1)] hover:text-[#D7C9B8]'
            }`}
          >
            + 记录 Notes 随记
          </button>
        </div>

        {/* 编辑表单 */}
        <div className="inner-card-soft p-6 sm:p-8 space-y-5">
          {studioType === 'article' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="文章标题..."
                className="sm:col-span-2 px-4 py-3 rounded-xl bg-[#0E1316]/60 border border-[rgba(215,201,184,0.15)] text-sm text-[#D7C9B8] placeholder-[#767E79] focus:outline-none focus:border-[#E8B48C]"
              />
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="分类 (如: 思索 / 随笔)..."
                className="px-4 py-3 rounded-xl bg-[#0E1316]/60 border border-[rgba(215,201,184,0.15)] text-sm text-[#D7C9B8] placeholder-[#767E79] focus:outline-none focus:border-[#E8B48C]"
              />
            </div>
          ) : (
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="随记标签 (如: 日常 / 观察 / 灵感 / 梦境)..."
              className="w-full px-4 py-3 rounded-xl bg-[#0E1316]/60 border border-[rgba(215,201,184,0.15)] text-sm text-[#D7C9B8] placeholder-[#767E79] focus:outline-none focus:border-[#E8B48C]"
            />
          )}

          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`在此输入 ${studioType === 'article' ? 'Markdown 正文...' : '随记短文...'}`}
            className="w-full p-4 rounded-xl bg-[#0E1316]/60 border border-[rgba(215,201,184,0.15)] text-xs font-mono text-[#D7C9B8] placeholder-[#767E79] focus:outline-none focus:border-[#E8B48C] resize-none leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入解密密码以重新加密整个数据库..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#0E1316]/60 border border-[rgba(215,201,184,0.15)] text-xs font-sans text-[#D7C9B8] placeholder-[#767E79] focus:outline-none focus:border-[#E8B48C]"
            />
            <button
              onClick={handleGenerateCipher}
              className="px-6 py-3 rounded-xl bg-[#E8B48C] text-[#0E1316] text-xs font-medium hover:bg-[#F3C49E] transition-colors focus:outline-none shrink-0"
            >
              生成并应用加密数据
            </button>
          </div>
        </div>

        {/* 密文输出 */}
        {generatedCipher && (
          <div className="inner-card-soft p-6 border border-[#E8B48C]/30 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#E8B48C]">
              <span className="font-mono">NEW CIPHERTEXT PACKAGE</span>
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-lg bg-[#E8B48C] text-[#0E1316] font-medium hover:bg-[#F3C49E] transition-colors focus:outline-none"
              >
                复制密文
              </button>
            </div>
            <div className="max-h-24 overflow-y-auto text-[11px] font-mono text-[#767E79] break-all select-all p-3 rounded-lg bg-black/40">
              {generatedCipher}
            </div>
            <p className="text-xs text-[#767E79] font-serif">
              提示：将上述密文复制并替换 <code>content/secret.enc</code> 的内容提交，即可永久保存更新。
            </p>
          </div>
        )}
      </main>

      {/* 底部 */}
      <footer className="max-w-4xl mx-auto w-full pt-12 border-t border-[rgba(215,201,184,0.08)] flex items-center justify-between text-xs text-[#767E79]">
        <div className="flex items-center gap-2 font-serif">
          <LeafMotif size={12} color="#767E79" />
          <span>静心书写，妥善保管。</span>
        </div>
        <div className="opacity-40">
          <CrescentMoonMotif size={18} color="#E8B48C" />
        </div>
      </footer>
    </div>
  );
};
