import React from 'react';
import { motion } from 'framer-motion';
import { ShadowArticle, ShadowNote } from '../ShadowWorld';
import { CrescentMoonMotif, StarMotif, LeafMotif, BubbleMotif } from '../Motifs';

interface InnerLandingProps {
  articles: ShadowArticle[];
  notes: ShadowNote[];
  onNavigateSection: (section: 'writing' | 'notes' | 'studio') => void;
  onExitToSurface: () => void;
  onLockSession: () => void;
  onOpenAbout: () => void;
  onShowToast: (msg: string) => void;
}

export const InnerLanding: React.FC<InnerLandingProps> = ({
  articles,
  notes,
  onNavigateSection,
  onExitToSurface,
  onLockSession,
  onOpenAbout,
  onShowToast,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-8 sm:p-14 lg:p-20 relative z-10 select-none">
      {/* 顶部栏 */}
      <header className="flex items-center justify-between w-full">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-2xl font-normal text-[#D7C9B8] tracking-tight">
            fengqi.
          </span>
          <span className="hidden sm:inline-block text-xs font-mono text-[#767E79] tracking-widest pl-2">
            inner world
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* 装饰微符 */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-[#767E79]/50 font-mono">
            <span>○</span>
            <span>~</span>
            <LeafMotif size={12} color="#767E79" />
            <BubbleMotif size={12} color="#767E79" />
          </div>

          {/* 右上角：四角星芒展开按钮 */}
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
        </div>
      </header>

      {/* 主体左锚定内容区 */}
      <main className="max-w-xl w-full my-auto py-12 space-y-12">
        <div className="space-y-3">
          <div className="text-xs font-mono text-[#E8B48C] tracking-widest uppercase">
            INSIDE WORLD
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#D7C9B8] tracking-wide leading-tight">
            内在世界
          </h1>
          <p className="font-sans text-sm text-[#A89E91] tracking-wider">
            inside world
          </p>
          <p className="font-serif text-xs sm:text-sm text-[#767E79] pt-1">
            只为书写与思考保留的一方安静之地。
          </p>
        </div>

        {/* 核心板块入口 */}
        <div className="space-y-6">
          {/* 入口 1: Writing */}
          <motion.div
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
            onClick={() => onNavigateSection('writing')}
            className="group cursor-pointer p-5 -mx-5 rounded-2xl transition-all duration-300 hover:bg-[#151E22]/60 space-y-1.5"
          >
            <div className="flex items-center justify-between text-[#D7C9B8]">
              <div className="flex items-center gap-3 font-serif text-xl sm:text-2xl group-hover:text-[#E8B48C] transition-colors">
                <span className="font-mono text-base text-[#E8B48C]">○</span>
                <span>Writing</span>
                <span className="text-xs font-sans text-[#767E79] font-normal pl-2">写作</span>
              </div>
              <span className="font-mono text-xs text-[#767E79] group-hover:text-[#D7C9B8] transition-colors">
                {String(articles.length).padStart(2, '0')}
              </span>
            </div>
            <p className="text-xs font-serif text-[#767E79] pl-7 group-hover:text-[#A89E91] transition-colors">
              记录思考、草稿与创作。
            </p>
          </motion.div>

          {/* 入口 2: Notes */}
          <motion.div
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
            onClick={() => onNavigateSection('notes')}
            className="group cursor-pointer p-5 -mx-5 rounded-2xl transition-all duration-300 hover:bg-[#151E22]/60 space-y-1.5"
          >
            <div className="flex items-center justify-between text-[#D7C9B8]">
              <div className="flex items-center gap-3 font-serif text-xl sm:text-2xl group-hover:text-[#E8B48C] transition-colors">
                <span className="font-mono text-base text-[#E8B48C]">~</span>
                <span>Notes</span>
                <span className="text-xs font-sans text-[#767E79] font-normal pl-2">随记</span>
              </div>
              <span className="font-mono text-xs text-[#767E79] group-hover:text-[#D7C9B8] transition-colors">
                {String(notes.length).padStart(2, '0')}
              </span>
            </div>
            <p className="text-xs font-serif text-[#767E79] pl-7 group-hover:text-[#A89E91] transition-colors">
              收集碎片、灵感与微小观察。
            </p>
          </motion.div>

          {/* 入口 3: Studio (密室工作台) */}
          <motion.div
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
            onClick={() => onNavigateSection('studio')}
            className="group cursor-pointer p-4 -mx-4 rounded-2xl transition-all duration-300 hover:bg-[#151E22]/40 flex items-center justify-between text-xs font-sans text-[#767E79]"
          >
            <div className="flex items-center gap-3 group-hover:text-[#D7C9B8] transition-colors">
              <span className="font-mono text-xs text-[#E8B48C]">+</span>
              <span>Studio 工作台</span>
              <span className="text-[11px] text-[#767E79]/60 font-serif">· 撰写与密文生成</span>
            </div>
            <span className="font-mono text-[10px] text-[#E8B48C] px-1.5 py-0.5 rounded bg-[#E8B48C]/10 border border-[#E8B48C]/20">
              EDIT
            </span>
          </motion.div>
        </div>
      </main>

      {/* 底部导航链接 */}
      <footer className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-8">
        <div className="flex items-center gap-6 text-xs font-sans text-[#767E79]">
          <button
            onClick={onOpenAbout}
            className="hover:text-[#D7C9B8] transition-colors focus:outline-none"
          >
            About 关于
          </button>
          <button
            onClick={onLockSession}
            className="hover:text-[#E8B48C] transition-colors focus:outline-none"
          >
            Exit 锁定退出
          </button>
          <button
            onClick={() => onShowToast('在宁静中，写下未完的诗行。')}
            className="hover:text-[#D7C9B8] transition-colors focus:outline-none"
          >
            Elsewhere 漫游
          </button>
        </div>

        {/* 右下角弯月 */}
        <div className="opacity-40 hover:opacity-80 transition-opacity duration-500">
          <CrescentMoonMotif size={28} color="#E8B48C" />
        </div>
      </footer>
    </div>
  );
};
