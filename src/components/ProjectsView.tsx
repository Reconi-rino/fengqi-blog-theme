import React from 'react';
import { motion } from 'framer-motion';
import { allProjects } from '../utils/contentLoader';
import { LeafMotif } from './Motifs';

export const ProjectsView: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto pt-32 sm:pt-40 pb-28 px-6 sm:px-12 md:px-16">
      {/* 顶部标题与身份标签 */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-xs font-sans tracking-widest text-[#8EABA8] mb-2 uppercase">
          <span className="font-light">+</span>
          <span>PROJECTS</span>
        </div>
        <div className="flex items-baseline gap-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#2F4B4D] tracking-tight">
            Projects
          </h1>
          <span className="font-serif text-base sm:text-lg text-[#5C7A7C]">
            项目与实验
          </span>
          <LeafMotif size={18} color="#A7CFC3" />
        </div>
      </div>

      {/* 项目列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProjects.map((proj, idx) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="card-soft p-6 sm:p-7 border border-[#C7D9D6]/60 flex flex-col justify-between group hover:border-[#A7CFC3] transition-all duration-300 hover:shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#8EABA8] font-mono mb-3">
                <span>{proj.category}</span>
                <span>{proj.year}</span>
              </div>

              <h3 className="font-serif text-xl font-normal text-[#2F4B4D] group-hover:text-[#1F3335] mb-2">
                {proj.title}
              </h3>

              <p className="font-serif text-xs sm:text-sm text-[#5C7A7C] leading-relaxed mb-6">
                {proj.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#C7D9D6]/30 flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {proj.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[#E6EDEB] text-[#5C7A7C]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {proj.github && (
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-sans text-[#2F4B4D] hover:underline underline-offset-4 flex items-center gap-1"
                >
                  GitHub →
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
