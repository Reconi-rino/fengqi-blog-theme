import React from 'react';
import { motion } from 'framer-motion';
import { ViewMode } from '../types';
import { LeafMotif, FlowerMotif, PeachHeartMotif } from './Motifs';
import { SpecimenCorners } from './MistReveal';
import { MIST_EASE } from '../utils/motion';

interface StudentInfoViewProps {
  onNavigateSection?: (section: ViewMode) => void;
}

const INFO_ITEMS = [
  {
    label: 'NAME · 姓名',
    value: '狄伟嘉',
    sub: 'Di Weijia',
  },
  {
    label: 'STUDENT ID · 学号',
    value: '2024214322',
    sub: 'Undergraduate Student Number',
    mono: true,
  },
  {
    label: 'UNIVERSITY · 学校',
    value: '华中师范大学',
    sub: 'Central China Normal University',
  },
];

const TECH_STACK = [
  'React 19',
  'TypeScript',
  'Tailwind CSS v4',
  'Vite 6',
  'Framer Motion',
  'Wouter',
];

export const StudentInfoView: React.FC<StudentInfoViewProps> = ({
  onNavigateSection,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto pt-32 sm:pt-40 pb-28 px-6 sm:px-12">
      {/* 顶部标题区 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: MIST_EASE }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 text-xs font-sans tracking-widest text-[#8EABA8] mb-2 uppercase">
          <span className="font-light">•</span>
          <span>COURSEWORK · WEB ASSIGNMENT</span>
        </div>
        <div className="flex items-baseline flex-wrap gap-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#2F4B4D] tracking-tight">
            Student
          </h1>
          <span className="font-serif text-base sm:text-lg text-[#5C7A7C]">
            课程作业提交信息
          </span>
          <LeafMotif size={18} color="#A7CFC3" />
        </div>
      </motion.div>

      {/* 核心学生信息标本卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.55, ease: MIST_EASE }}
        className="card-soft p-8 sm:p-12 shadow-2xs relative overflow-hidden"
      >
        <SpecimenCorners active />

        {/* 背景柔和呼吸水彩微光 */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#E6EDEB]/70 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#A7CFC3]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* 顶部铭牌 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#C7D9D6]/40">
            <div>
              <p className="text-[11px] font-sans tracking-widest uppercase text-[#8EABA8]">
                ASSIGNMENT ARCHIVE · 作业留档名片
              </p>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-normal text-[#2F4B4D]">
                fengqi. 个人博客系统
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1 rounded-full bg-white/65 border border-[#C7D9D6]/60 text-[11px] font-sans text-[#5C7A7C]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A7CFC3]" />
              Web 课程作业提交
            </span>
          </div>

          {/* 姓名 / 学号 / 学校 信息网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.15fr_1.45fr] gap-4 sm:gap-5">
            {INFO_ITEMS.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.14 + idx * 0.07,
                  duration: 0.45,
                  ease: MIST_EASE,
                }}
                className="rounded-xl border border-[#C7D9D6]/50 bg-white/55 px-5 py-5 flex flex-col justify-between gap-2 hover:border-[#A7CFC3] hover:bg-white/80 transition-colors"
              >
                <span className="text-[10px] font-sans tracking-widest uppercase text-[#8EABA8]">
                  {item.label}
                </span>
                <p
                  className={`text-xl text-[#2F4B4D] tracking-wide whitespace-nowrap ${
                    item.mono ? 'font-mono font-medium' : 'font-serif font-normal'
                  }`}
                >
                  {item.value}
                </p>
                <span className="text-[11px] font-sans text-[#8EABA8]/85">
                  {item.sub}
                </span>
              </motion.div>
            ))}
          </div>

          {/* 作业说明与技术栈 */}
          <div className="pt-2 space-y-4">
            <p className="font-serif text-sm sm:text-base leading-relaxed text-[#5C7A7C]">
              本站点为个人刊物风格静态博客模板（<span className="text-[#2F4B4D]">fengqi-blog-theme</span>
              ），现作为 Web 课程作业提交与留档。站点支持 Markdown 文章归档、影像画廊、项目展示、随记时间线、纸境色调切换与微动态背景生态。
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-[#E6EDEB]/75 text-[#5C7A7C] border border-[#C7D9D6]/40"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 底部快捷导航与落款 */}
          <div className="pt-6 border-t border-[#C7D9D6]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#8EABA8]">
            <div className="flex flex-wrap items-center gap-3">
              {onNavigateSection && (
                <>
                  <button
                    onClick={() => onNavigateSection('landing')}
                    className="px-3.5 py-1.5 rounded-full border border-[#C7D9D6] bg-white/60 text-[#2F4B4D] hover:bg-white hover:border-[#A7CFC3] transition-colors focus:outline-none"
                  >
                    ← 返回首页
                  </button>
                  <button
                    onClick={() => onNavigateSection('writing')}
                    className="px-3.5 py-1.5 rounded-full border border-[#C7D9D6]/70 bg-white/40 text-[#5C7A7C] hover:text-[#2F4B4D] hover:bg-white transition-colors focus:outline-none"
                  >
                    浏览文章
                  </button>
                  <button
                    onClick={() => onNavigateSection('projects')}
                    className="px-3.5 py-1.5 rounded-full border border-[#C7D9D6]/70 bg-white/40 text-[#5C7A7C] hover:text-[#2F4B4D] hover:bg-white transition-colors focus:outline-none"
                  >
                    查看项目
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-sans text-[#8EABA8]">
              <FlowerMotif size={13} color="#F6DCCB" />
              <span>华中师范大学 · 狄伟嘉 · 2024214322</span>
              <PeachHeartMotif size={11} color="#F6DCCB" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
