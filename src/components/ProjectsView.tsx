import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { allProjects } from '../utils/contentLoader';
import { LeafMotif } from './Motifs';
import { MIST_EASE, PILL_SPRING } from '../utils/motion';

const ProjectCard: React.FC<{ proj: Project; index: number }> = ({ proj, index }) => {
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.48, ease: MIST_EASE }}
      whileHover={{ y: -3 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setSpot({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
          active: true,
        });
      }}
      onMouseLeave={() => setSpot((prev) => ({ ...prev, active: false }))}
      className="card-soft p-6 sm:p-7 flex flex-col justify-between group hover:border-[#A7CFC3] transition-all duration-300 hover:shadow-xs relative overflow-hidden"
    >
      {/* 鼠标跟随柔和微光 */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: spot.active ? 1 : 0,
          background: `radial-gradient(240px circle at ${spot.x}% ${spot.y}%, rgba(167, 207, 195, 0.2), transparent 65%)`,
        }}
      />

      <div className="relative z-10">
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

      <div className="relative z-10 pt-4 border-t border-[#C7D9D6]/30 flex items-center justify-between gap-2">
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
            className="text-xs font-sans text-[#2F4B4D] hover:underline underline-offset-4 flex items-center gap-1 shrink-0 group/link"
          >
            <span>GitHub</span>
            <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
          </a>
        )}
      </div>
    </motion.div>
  );
};

export const ProjectsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    allProjects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['all', ...Array.from(set)];
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return allProjects;
    return allProjects.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto pt-32 sm:pt-40 pb-28 px-6 sm:px-12 md:px-16">
      {/* 顶部标题与身份标签 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: MIST_EASE }}
        className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-sans tracking-widest text-[#8EABA8] mb-2 uppercase">
            <span className="font-light">+</span>
            <span>PROJECTS · {filteredProjects.length} 项</span>
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

        {/* 分类过滤胶囊 */}
        {categories.length > 2 && (
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full bg-white/45 border border-[#C7D9D6]/50 self-start sm:self-auto">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-3 py-1 rounded-full text-xs font-sans transition-colors focus:outline-none ${
                    active ? 'text-[#F3F6F4]' : 'text-[#5C7A7C] hover:text-[#2F4B4D]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="projects-cat-pill"
                      transition={PILL_SPRING}
                      className="absolute inset-0 rounded-full bg-[#2F4B4D] -z-10"
                    />
                  )}
                  {cat === 'all' ? '全部' : cat}
                </button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* 项目列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj, idx) => (
          <ProjectCard key={proj.id} proj={proj} index={idx} />
        ))}
      </div>
    </div>
  );
};
