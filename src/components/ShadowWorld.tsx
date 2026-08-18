import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeafMotif, StarMotif, PeachHeartMotif } from './Motifs';
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
      onShowToast('请填写完整内容与密码');
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
      onShowToast('新密文数据已生成');
      setNewTitle('');
      setNewContent('');
    } catch (err) {
      onShowToast('生成失败，请重试');
    }
  };

  const handleCopyCipher = () => {
    if (generatedCipher) {
      navigator.clipboard?.writeText(generatedCipher);
      onShowToast('密文已复制到剪贴板');
    }
  };

  return (
    <div className="fixed inset-0 z-50 shadow-background text-[#EDF5F2] flex flex-col overflow-y-auto selection:bg-[#A7CFC3]/30 selection:text-[#F3F6F4]">
      {/* 顶部极简导航栏 */}
      <header className="px-6 sm:px-12 py-6 flex items-center justify-between bg-transparent border-b border-[#A7CFC3]/10 max-w-7xl mx-auto w-full">
        {/* 左侧 Logo */}
        <div className="flex items-baseline gap-2.5">
          <span className="font-serif text-2xl font-semibold tracking-tight text-[#F3F6F4]">
            fengqi.<span className="text-[#A7CFC3] font-sans text-sm font-normal ml-1">shadow</span>
          </span>
          <span className="hidden sm:inline-block text-xs font-sans text-[#8EABA8] tracking-widest pl-2">
            — {data.motto || '墨夜微光，不设防备的自留地'}
          </span>
        </div>

        {/* 右侧：星芒按钮，悬停展开“返回地表” */}
        <button
          onClick={onExitAndLock}
          className="group h-9 rounded-full border border-[#A7CFC3]/30 bg-white/5 hover:bg-[#A7CFC3]/15 text-xs font-sans text-[#E2ECE9] hover:text-[#F3F6F4] transition-all duration-300 flex items-center gap-2 px-2.5 hover:px-4 overflow-hidden focus:outline-none"
          title="返回地表"
        >
          <StarMotif size={15} color="#A7CFC3" className="group-hover:rotate-45 transition-transform duration-300 shrink-0" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[80px] transition-all duration-300 text-xs font-sans opacity-0 group-hover:opacity-100 text-[#E2ECE9]">
            返回地表
          </span>
        </button>
      </header>

      {/* 主布局：左侧导航侧栏 + 右侧主内容 */}
      <div className="max-w-6xl mx-auto w-full px-6 sm:px-12 py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* 左侧：独立侧边栏 (Sidebar) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
          <div className="space-y-2">
            <div className="text-xs font-mono text-[#A7CFC3] tracking-widest uppercase">
              SHADOW REALM
            </div>
            <h2 className="font-serif text-3xl font-normal text-[#F3F6F4]">
              隐秘之境
            </h2>
            <p className="font-serif text-xs text-[#8EABA8] leading-relaxed">
              这里是写给自己的私语，存放未公开的长文随笔与灵感碎片。
            </p>
          </div>

          {/* 板块切换菜单 */}
          <div className="space-y-2 font-sans text-sm">
            <button
              onClick={() => {
                setCurrentTab('writing');
                setSelectedArticle(null);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between focus:outline-none ${
                currentTab === 'writing'
                  ? 'bg-[#162628] border-[#A7CFC3]/50 text-[#F3F6F4] shadow-xs'
                  : 'bg-white/5 border-transparent text-[#8EABA8] hover:text-[#EDF5F2] hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#A7CFC3]">○</span>
                <span>隐秘文章 (Writing)</span>
              </div>
              <span className="font-mono text-xs text-[#8EABA8]">
                {String(activeArticles.length).padStart(2, '0')}
              </span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('notes');
                setSelectedArticle(null);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between focus:outline-none ${
                currentTab === 'notes'
                  ? 'bg-[#162628] border-[#A7CFC3]/50 text-[#F3F6F4] shadow-xs'
                  : 'bg-white/5 border-transparent text-[#8EABA8] hover:text-[#EDF5F2] hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#A7CFC3]">~</span>
                <span>隐秘随记 (Notes)</span>
              </div>
              <span className="font-mono text-xs text-[#8EABA8]">
                {String(activeNotes.length).padStart(2, '0')}
              </span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('studio');
                setSelectedArticle(null);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between focus:outline-none ${
                currentTab === 'studio'
                  ? 'bg-[#162628] border-[#A7CFC3]/50 text-[#F3F6F4] shadow-xs'
                  : 'bg-white/5 border-transparent text-[#8EABA8] hover:text-[#EDF5F2] hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#A7CFC3]">+</span>
                <span>密室工作台 (Studio)</span>
              </div>
              <span className="font-mono text-[10px] text-[#A7CFC3] px-1.5 py-0.5 rounded bg-[#A7CFC3]/10">
                EDIT
              </span>
            </button>
          </div>

          <div className="pt-6 border-t border-[#A7CFC3]/15 flex items-center gap-2 text-xs text-[#8EABA8] font-serif">
            <LeafMotif size={13} color="#A7CFC3" />
            <span>无声记录，留白给呼吸。</span>
          </div>
        </div>

        {/* 右侧：主内容显示区 */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {/* TAB 1: 隐秘文章 (Writing) */}
            {currentTab === 'writing' && (
              <motion.div
                key={selectedArticle ? selectedArticle.id : 'writing-list'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {selectedArticle ? (
                  /* 文章详情阅读态 (高对比度暗夜排版) */
                  <article className="space-y-8">
                    <div className="flex items-center justify-between border-b border-[#A7CFC3]/15 pb-4">
                      <button
                        onClick={() => setSelectedArticle(null)}
                        className="text-xs font-sans text-[#A7CFC3] hover:text-[#EDF5F2] flex items-center gap-1.5 focus:outline-none"
                      >
                        <span>← 返回列表</span>
                      </button>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#8EABA8]">
                        <span>{selectedArticle.date}</span>
                        <span>/</span>
                        <span>{selectedArticle.readTime}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="inline-block text-xs font-sans px-2.5 py-0.5 rounded-full bg-[#A7CFC3]/15 text-[#A7CFC3] border border-[#A7CFC3]/30">
                        {selectedArticle.category}
                      </div>
                      <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#F3F6F4] tracking-tight leading-snug">
                        {selectedArticle.title}
                      </h1>
                    </div>

                    <div className="editorial-prose-dark pt-2">
                      <MarkdownRenderer content={selectedArticle.content} />
                    </div>

                    <div className="pt-10 border-t border-[#A7CFC3]/15 flex items-center justify-between text-xs text-[#8EABA8] font-sans">
                      <div className="flex items-center gap-2">
                        <LeafMotif size={13} color="#A7CFC3" />
                        <span>完篇于隐秘之境</span>
                      </div>
                      <PeachHeartMotif size={12} color="#F6DCCB" />
                    </div>
                  </article>
                ) : (
                  /* 文章列表 */
                  <div className="space-y-4">
                    {activeArticles.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => setSelectedArticle(art)}
                        className="card-dark-soft p-6 group cursor-pointer hover:border-[#A7CFC3]/50 hover:bg-[#162628]/90 transition-all duration-300 space-y-2.5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-[#A7CFC3]">
                              {art.date}
                            </span>
                            <span className="text-[11px] font-sans px-2 py-0.5 rounded-full bg-[#A7CFC3]/15 text-[#A7CFC3]">
                              {art.category}
                            </span>
                            <h3 className="font-serif text-base sm:text-lg text-[#F3F6F4] group-hover:text-[#A7CFC3] transition-colors">
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
                )}
              </motion.div>
            )}

            {/* TAB 2: 隐秘随记 (Notes) */}
            {currentTab === 'notes' && (
              <motion.div
                key="notes-list"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {activeNotes.map((n) => (
                  <div
                    key={n.id}
                    className="card-dark-soft p-6 space-y-4 hover:border-[#A7CFC3]/40 transition-colors"
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
                      <span>private note</span>
                      <PeachHeartMotif size={10} color="#F6DCCB" />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* TAB 3: 密室工作台 (Studio) */}
            {currentTab === 'studio' && (
              <motion.div
                key="studio-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 text-xs font-sans">
                  <button
                    onClick={() => setStudioType('article')}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      studioType === 'article'
                        ? 'bg-[#A7CFC3] text-[#0E1819] font-medium'
                        : 'bg-white/5 text-[#8EABA8] border border-white/10 hover:text-white'
                    }`}
                  >
                    + 新增文章
                  </button>
                  <button
                    onClick={() => setStudioType('note')}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      studioType === 'note'
                        ? 'bg-[#A7CFC3] text-[#0E1819] font-medium'
                        : 'bg-white/5 text-[#8EABA8] border border-white/10 hover:text-white'
                    }`}
                  >
                    + 新增随记
                  </button>
                </div>

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
                      生成全套加密包
                    </button>
                  </div>
                </div>

                {generatedCipher && (
                  <div className="card-dark-soft p-6 border border-[#A7CFC3]/40 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#A7CFC3]">
                      <span className="font-mono">NEW CIPHERTEXT PACKAGE</span>
                      <button
                        onClick={handleCopyCipher}
                        className="px-3 py-1 rounded bg-[#A7CFC3] text-[#0E1819] font-medium hover:bg-[#B8DCCF] transition-colors focus:outline-none"
                      >
                        复制密文
                      </button>
                    </div>
                    <div className="max-h-28 overflow-y-auto text-[11px] font-mono text-[#8EABA8] break-all select-all p-3 rounded-lg bg-black/50">
                      {generatedCipher}
                    </div>
                    <p className="text-xs text-[#8EABA8]">
                      提示：将上述密文复制并完整替换 <code>content/secret.enc</code> 文件内容并提交即可。
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
