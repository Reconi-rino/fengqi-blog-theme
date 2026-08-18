import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeafMotif, PeachHeartMotif } from './Motifs';
import { MarkdownRenderer } from './MarkdownRenderer';
import { encryptSecret } from '../utils/crypto';

export interface ShadowArticle {
  id: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
}

export interface ShadowNote {
  id: string;
  date: string;
  tag?: string;
  content: string;
}

export interface ShadowData {
  version: string;
  title: string;
  motto: string;
  articles: ShadowArticle[];
  notes: ShadowNote[];
}

interface ShadowWorldProps {
  data: ShadowData;
  onExitAndLock: () => void;
  onShowToast: (msg: string) => void;
}

export const ShadowWorld: React.FC<ShadowWorldProps> = ({
  data,
  onExitAndLock,
  onShowToast,
}) => {
  const [currentTab, setCurrentTab] = useState<'writing' | 'notes' | 'studio'>('writing');
  const [selectedArticle, setSelectedArticle] = useState<ShadowArticle | null>(null);

  // 工作室状态 (动态新增文章或随记)
  const [studioType, setStudioType] = useState<'article' | 'note'>('article');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('私密随笔');
  const [newTag, setNewTag] = useState('灵感备忘');
  const [newContent, setNewContent] = useState('');
  const [studioPassword, setStudioPassword] = useState('');
  const [generatedCipher, setGeneratedCipher] = useState<string | null>(null);

  // 本地活跃数据副本
  const [activeArticles, setActiveArticles] = useState<ShadowArticle[]>(data.articles || []);
  const [activeNotes, setActiveNotes] = useState<ShadowNote[]>(data.notes || []);

  const handleCreateNew = async () => {
    if (!newContent.trim() || !studioPassword.trim()) {
      onShowToast('请填写内容并输入加密新密码');
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    let updatedArticles = [...activeArticles];
    let updatedNotes = [...activeNotes];

    if (studioType === 'article') {
      if (!newTitle.trim()) {
        onShowToast('请输入文章标题');
        return;
      }
      const newArt: ShadowArticle = {
        id: `shadow-${Date.now()}`,
        title: newTitle.trim(),
        date: todayStr,
        category: newCategory.trim() || '私密随笔',
        readTime: `${Math.ceil(newContent.length / 300)} min read`,
        excerpt: newContent.split('\n')[0].replace(/^#+\s*/, '') || '暂无摘要',
        content: newContent,
      };
      updatedArticles = [newArt, ...updatedArticles];
      setActiveArticles(updatedArticles);
    } else {
      const newN: ShadowNote = {
        id: `sn-${Date.now()}`,
        date: todayStr,
        tag: newTag.trim() || '随记',
        content: newContent,
      };
      updatedNotes = [newN, ...updatedNotes];
      setActiveNotes(updatedNotes);
    }

    const updatedData: ShadowData = {
      ...data,
      articles: updatedArticles,
      notes: updatedNotes,
    };

    try {
      const cipher = await encryptSecret(JSON.stringify(updatedData), studioPassword);
      setGeneratedCipher(cipher);
      onShowToast('加密数据包已生成！');
      setNewTitle('');
      setNewContent('');
    } catch (err) {
      onShowToast('加密失败，请重试');
    }
  };

  const handleCopyCipher = () => {
    if (generatedCipher) {
      navigator.clipboard?.writeText(generatedCipher);
      onShowToast('密文已复制到剪贴板 ✓');
    }
  };

  return (
    <div className="fixed inset-0 z-50 shadow-background text-[#EDF5F2] flex flex-col overflow-hidden selection:bg-[#A7CFC3]/30 selection:text-[#F3F6F4]">
      {/* 顶部暗夜专属导航栏 */}
      <header className="px-6 sm:px-12 py-5 border-b border-[#A7CFC3]/15 flex items-center justify-between bg-[#0E1819]/80 backdrop-blur-md shrink-0">
        {/* 左侧 Logo */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-[#A7CFC3] animate-pulse">✦</span>
          <span className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#F3F6F4]">
            fengqi.<span className="text-[#A7CFC3] font-sans text-sm font-normal ml-1">shadow</span>
          </span>
          <span className="hidden md:inline-block text-xs font-sans text-[#8EABA8] tracking-widest pl-2">
            — {data.motto || '墨夜微光，不设防备的自留地。'}
          </span>
        </div>

        {/* 中部导航切换 */}
        <div className="flex items-center gap-1.5 sm:gap-3 bg-black/40 p-1 rounded-full border border-[#A7CFC3]/20 text-xs font-sans">
          <button
            onClick={() => {
              setCurrentTab('writing');
              setSelectedArticle(null);
            }}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 focus:outline-none ${
              currentTab === 'writing'
                ? 'bg-[#A7CFC3] text-[#0E1819] font-medium shadow-xs'
                : 'text-[#8EABA8] hover:text-[#EDF5F2]'
            }`}
          >
            ○ 隐秘文章 ({activeArticles.length})
          </button>
          <button
            onClick={() => {
              setCurrentTab('notes');
              setSelectedArticle(null);
            }}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 focus:outline-none ${
              currentTab === 'notes'
                ? 'bg-[#A7CFC3] text-[#0E1819] font-medium shadow-xs'
                : 'text-[#8EABA8] hover:text-[#EDF5F2]'
            }`}
          >
            ~ 隐秘随记 ({activeNotes.length})
          </button>
          <button
            onClick={() => {
              setCurrentTab('studio');
              setSelectedArticle(null);
            }}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 focus:outline-none ${
              currentTab === 'studio'
                ? 'bg-[#A7CFC3] text-[#0E1819] font-medium shadow-xs'
                : 'text-[#8EABA8] hover:text-[#EDF5F2]'
            }`}
          >
            ✍️ 工作台
          </button>
        </div>

        {/* 右侧退出里世界按钮 */}
        <button
          onClick={onExitAndLock}
          className="px-3.5 py-1.5 rounded-full border border-[#F6DCCB]/40 bg-[#F6DCCB]/10 hover:bg-[#F6DCCB]/20 text-xs font-sans text-[#F6DCCB] transition-all flex items-center gap-1.5 focus:outline-none"
          title="退出里世界并立即销毁内存明文"
        >
          <span>返回表世界 ☀️</span>
        </button>
      </header>

      {/* 主视图区域 */}
      <main className="flex-1 overflow-y-auto px-6 sm:px-12 md:px-20 py-10 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* TAB 1: 隐秘文章 (Writing) */}
          {currentTab === 'writing' && (
            <motion.div
              key={selectedArticle ? selectedArticle.id : 'writing-list'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {selectedArticle ? (
                /* 单篇文章阅读态 (高对比度深色刊物排版) */
                <article className="max-w-3xl mx-auto space-y-8 py-6">
                  <div className="flex items-center justify-between border-b border-[#A7CFC3]/20 pb-4">
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="text-xs font-sans text-[#A7CFC3] hover:text-[#EDF5F2] flex items-center gap-1.5 focus:outline-none"
                    >
                      <span>← 返回文章列表</span>
                    </button>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#8EABA8]">
                      <span>{selectedArticle.date}</span>
                      <span>•</span>
                      <span>{selectedArticle.readTime}</span>
                    </div>
                  </div>

                  {/* 文章标题与分类 */}
                  <div className="space-y-3">
                    <div className="inline-block text-xs font-sans px-2.5 py-0.5 rounded-full bg-[#A7CFC3]/15 text-[#A7CFC3] border border-[#A7CFC3]/30">
                      {selectedArticle.category}
                    </div>
                    <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#F3F6F4] tracking-tight leading-snug">
                      {selectedArticle.title}
                    </h1>
                  </div>

                  {/* 文章 Markdown 正文 */}
                  <div className="editorial-prose-dark pt-4">
                    <MarkdownRenderer content={selectedArticle.content} />
                  </div>

                  {/* 篇末标识 */}
                  <div className="pt-10 border-t border-[#A7CFC3]/20 flex items-center justify-between text-xs text-[#8EABA8] font-sans">
                    <div className="flex items-center gap-2">
                      <LeafMotif size={14} color="#A7CFC3" />
                      <span>已开启硬件级端到端加密保护</span>
                    </div>
                    <PeachHeartMotif size={12} color="#F6DCCB" />
                  </div>
                </article>
              ) : (
                /* 文章列表态 */
                <div className="space-y-8">
                  <div className="flex items-baseline justify-between border-b border-[#A7CFC3]/20 pb-4">
                    <div className="flex items-baseline gap-3">
                      <h2 className="font-serif text-3xl font-normal text-[#F3F6F4]">
                        Shadow Writing
                      </h2>
                      <span className="font-serif text-sm text-[#8EABA8]">
                        未公开的长文随笔
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[#A7CFC3]">
                      {activeArticles.length} ENTRIES
                    </span>
                  </div>

                  <div className="space-y-4">
                    {activeArticles.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => setSelectedArticle(art)}
                        className="card-dark-soft p-6 group cursor-pointer hover:border-[#A7CFC3]/50 hover:bg-[#162426]/90 transition-all duration-300 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-[#A7CFC3]">
                              {art.date}
                            </span>
                            <span className="text-[11px] font-sans px-2 py-0.5 rounded-full bg-[#A7CFC3]/15 text-[#A7CFC3] border border-[#A7CFC3]/25">
                              {art.category}
                            </span>
                            <h3 className="font-serif text-lg text-[#F3F6F4] group-hover:text-[#A7CFC3] transition-colors">
                              {art.title}
                            </h3>
                          </div>
                          <span className="text-xs font-sans text-[#8EABA8] shrink-0">
                            {art.readTime}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-serif text-[#C7D9D6] leading-relaxed line-clamp-2">
                          {art.excerpt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: 隐秘随记 (Notes) */}
          {currentTab === 'notes' && (
            <motion.div
              key="notes-list"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="flex items-baseline justify-between border-b border-[#A7CFC3]/20 pb-4">
                <div className="flex items-baseline gap-3">
                  <h2 className="font-serif text-3xl font-normal text-[#F3F6F4]">
                    Shadow Notes
                  </h2>
                  <span className="font-serif text-sm text-[#8EABA8]">
                    深夜灵感、未竟碎片与碎碎念
                  </span>
                </div>
                <span className="font-mono text-xs text-[#A7CFC3]">
                  {activeNotes.length} FRAGMENTS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {activeNotes.map((n) => (
                  <div
                    key={n.id}
                    className="card-dark-soft p-6 space-y-4 hover:border-[#A7CFC3]/40 transition-colors flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-[#8EABA8]">
                      <span>{n.date}</span>
                      {n.tag && (
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[#A7CFC3] font-sans text-[11px] border border-[#A7CFC3]/20">
                          {n.tag}
                        </span>
                      )}
                    </div>
                    <div className="editorial-prose-dark text-sm leading-relaxed text-[#EDF5F2]">
                      <MarkdownRenderer content={n.content} />
                    </div>
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#8EABA8]">
                      <span>✦ private note</span>
                      <PeachHeartMotif size={10} color="#F6DCCB" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: 密室工作台 (Studio) */}
          {currentTab === 'studio' && (
            <motion.div
              key="studio-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="border-b border-[#A7CFC3]/20 pb-4">
                <h2 className="font-serif text-2xl font-normal text-[#F3F6F4]">
                  ✍️ 密室工作台 (Shadow Studio)
                </h2>
                <p className="text-xs font-sans text-[#8EABA8] mt-1">
                  在线撰写新的私密文章或随记，设定新密码并生成加密数据包，存入 <code>content/secret.enc</code> 即可生效。
                </p>
              </div>

              {/* 类型选择 */}
              <div className="flex items-center gap-3 text-xs font-sans">
                <button
                  onClick={() => setStudioType('article')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    studioType === 'article'
                      ? 'bg-[#A7CFC3] text-[#0E1819] font-medium'
                      : 'bg-black/30 text-[#8EABA8] border border-white/10 hover:text-white'
                  }`}
                >
                  + 新增隐秘文章
                </button>
                <button
                  onClick={() => setStudioType('note')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    studioType === 'note'
                      ? 'bg-[#A7CFC3] text-[#0E1819] font-medium'
                      : 'bg-black/30 text-[#8EABA8] border border-white/10 hover:text-white'
                  }`}
                >
                  + 新增隐秘随记
                </button>
              </div>

              {/* 输入区域 */}
              <div className="card-dark-soft p-6 space-y-4">
                {studioType === 'article' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="文章标题..."
                      className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-black/40 border border-[#A7CFC3]/30 text-sm text-[#F3F6F4] focus:outline-none focus:border-[#A7CFC3]"
                    />
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="文章分类 (如: 私密随笔)..."
                      className="px-4 py-2.5 rounded-xl bg-black/40 border border-[#A7CFC3]/30 text-sm text-[#F3F6F4] focus:outline-none focus:border-[#A7CFC3]"
                    />
                  </div>
                )}

                {studioType === 'note' && (
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="随记标签 (如: 灵感备忘 / 胶片随记)..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-[#A7CFC3]/30 text-sm text-[#F3F6F4] focus:outline-none focus:border-[#A7CFC3]"
                  />
                )}

                <textarea
                  rows={8}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder={`在此输入 ${studioType === 'article' ? 'Markdown 文章正文...' : '随记正文...'}`}
                  className="w-full p-4 rounded-xl bg-black/40 border border-[#A7CFC3]/30 text-xs font-mono text-[#F3F6F4] focus:outline-none focus:border-[#A7CFC3] resize-none leading-relaxed"
                />

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <input
                    type="password"
                    value={studioPassword}
                    onChange={(e) => setStudioPassword(e.target.value)}
                    placeholder="输入解密密码（加密整个里世界数据库）..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-[#A7CFC3]/30 text-xs font-sans text-[#F3F6F4] focus:outline-none focus:border-[#A7CFC3]"
                  />
                  <button
                    onClick={handleCreateNew}
                    className="px-6 py-2.5 rounded-xl bg-[#A7CFC3] text-[#0E1819] text-xs font-medium hover:bg-[#B8DCCF] transition-colors focus:outline-none shrink-0"
                  >
                    生成全套加密包 (AES-256)
                  </button>
                </div>
              </div>

              {/* 生成密文展示 */}
              {generatedCipher && (
                <div className="card-dark-soft p-6 border border-[#A7CFC3]/40 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#A7CFC3]">
                    <span className="font-mono">📦 NEW CIPHERTEXT PACKAGE READY</span>
                    <button
                      onClick={handleCopyCipher}
                      className="px-3 py-1 rounded bg-[#A7CFC3] text-[#0E1819] font-medium hover:bg-[#B8DCCF] transition-colors focus:outline-none"
                    >
                      复制密文 ✓
                    </button>
                  </div>
                  <div className="max-h-28 overflow-y-auto text-[11px] font-mono text-[#8EABA8] break-all select-all p-3 rounded-lg bg-black/50">
                    {generatedCipher}
                  </div>
                  <p className="text-xs text-[#8EABA8]">
                    💡 提示：将上述密文复制并完整替换 <code>content/secret.enc</code> 文件内容并提交，即可在下次输入该密码时解密全新内容！
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
