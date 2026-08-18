import React, { useState } from 'react';
import { ShadowNote } from '../ShadowWorld';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { CrescentMoonMotif, StarMotif, LeafMotif, PeachHeartMotif } from '../Motifs';

interface InnerNoteDetailProps {
  note: ShadowNote;
  onBackToArchive: () => void;
  onExitToSurface: () => void;
  onShowToast: (msg: string) => void;
}

export const InnerNoteDetail: React.FC<InnerNoteDetailProps> = ({
  note,
  onBackToArchive,
  onExitToSurface,
  onShowToast,
}) => {
  const [likes, setLikes] = useState<number>(18);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const handleToggleLike = () => {
    if (!isLiked) {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
      onShowToast('留下一抹温度 ♡');
    } else {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    onShowToast('随记链接已复制');
  };

  const title = note.content.split('\n')[0].replace(/^[#\s*-_]+/, '') || '随记碎片';

  return (
    <div className="min-h-screen w-full flex flex-col p-6 sm:p-12 lg:p-16 relative z-10 select-none">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between w-full max-w-3xl mx-auto pb-8 border-b border-[rgba(215,201,184,0.1)]">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToArchive}
            className="text-xs font-sans text-[#A89E91] hover:text-[#D7C9B8] transition-colors flex items-center gap-1.5 focus:outline-none"
          >
            <span>← 返回 Notes 随记</span>
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

      {/* 主阅读区域 */}
      <main className="max-w-[650px] mx-auto w-full py-12 flex-1 space-y-10 select-text">
        {/* 头部信息 */}
        <header className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#E8B48C] tracking-widest uppercase">
            <span>~</span>
            <span>NOTES</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#F0E8DD] leading-snug">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#767E79]">
            <span>{note.date}</span>
            <span>·</span>
            <span className="text-[#A89E91] font-sans">{note.tag || '随记'}</span>
          </div>
        </header>

        {/* 随记正文 */}
        <article className="inner-editorial-prose pt-4 border-t border-[rgba(215,201,184,0.08)]">
          <MarkdownRenderer content={note.content} />
        </article>

        {/* 底部轻量标签与互动 */}
        <footer className="pt-10 border-t border-[rgba(215,201,184,0.1)] space-y-6 select-none">
          {/* 标签 */}
          {note.tag && (
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[rgba(215,201,184,0.06)] text-xs font-sans text-[#E8B48C] border border-[rgba(215,201,184,0.1)]">
                #{note.tag}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1.5 text-xs font-sans transition-all focus:outline-none ${
                  isLiked ? 'text-[#E8B48C]' : 'text-[#767E79] hover:text-[#D7C9B8]'
                }`}
              >
                <PeachHeartMotif size={13} color={isLiked ? '#E8B48C' : '#767E79'} />
                <span>{likes}</span>
              </button>

              <button
                onClick={handleShare}
                className="text-xs font-sans text-[#767E79] hover:text-[#D7C9B8] transition-colors focus:outline-none"
              >
                ↗ 分享
              </button>
            </div>

            <button
              onClick={onBackToArchive}
              className="text-xs font-sans text-[#A89E91] hover:text-[#E8B48C] transition-colors focus:outline-none"
            >
              ← 返回随记
            </button>
          </div>
        </footer>
      </main>

      {/* 底部装饰 */}
      <footer className="max-w-3xl mx-auto w-full pt-8 flex items-center justify-between text-xs text-[#767E79]/50 select-none">
        <div className="flex items-center gap-2 font-serif">
          <LeafMotif size={12} color="#767E79" />
          <span>随手记录，无意留存。</span>
        </div>
        <div className="opacity-30">
          <CrescentMoonMotif size={16} color="#E8B48C" />
        </div>
      </footer>
    </div>
  );
};
