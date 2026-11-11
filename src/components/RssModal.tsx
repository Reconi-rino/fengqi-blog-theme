import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeafMotif, PeachHeartMotif } from './Motifs';
import { generateRssXml, getDynamicSiteUrl } from '../utils/rssGenerator';
import { MIST_EASE } from '../utils/motion';

interface RssModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const RssModal: React.FC<RssModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [showRaw, setShowRaw] = useState(false);
  const currentBaseUrl = getDynamicSiteUrl();
  const feedUrl = `${currentBaseUrl}/feed.xml`;
  const rssXmlContent = generateRssXml(currentBaseUrl);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(feedUrl);
    onShowToast('RSS 订阅链接已复制 🍃');
  };

  const handleDownloadXml = () => {
    const blob = new Blob([rssXmlContent], { type: 'application/rss+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feed.xml';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('已下载 feed.xml 文件 ✓');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#2F4B4D]/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: MIST_EASE }}
            onClick={(e) => e.stopPropagation()}
            className="card-soft p-8 sm:p-10 max-w-xl w-full border border-[#C7D9D6] shadow-xl relative overflow-hidden space-y-6 max-h-[85vh] overflow-y-auto"
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/60 border border-[#C7D9D6] flex items-center justify-center text-sm hover:bg-white text-[#2F4B4D] focus:outline-none"
            >
              ✕
            </button>

            {/* 标题 */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#8EABA8] tracking-widest uppercase">
                  SUBSCRIBE
                </span>
                <LeafMotif size={14} color="#A7CFC3" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#2F4B4D]">
                RSS 订阅
              </h3>
            </div>

            <p className="font-serif text-sm text-[#5C7A7C] leading-relaxed">
              在这个算法推送与信息过载的时代，欢迎通过 RSS 订阅这个安静的空间。每当有新的随笔与手记发布，你的阅读器将第一时间收到纯净推送。
            </p>

            {/* RSS 链接输入框与复制 */}
            <div className="space-y-2">
              <label className="text-xs font-sans text-[#8EABA8]">订阅源地址 (Feed URL)</label>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-[#C7D9D6]/60">
                <input
                  type="text"
                  readOnly
                  value={feedUrl}
                  className="flex-1 bg-transparent px-2 text-xs font-mono text-[#2F4B4D] focus:outline-none truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg bg-[#2F4B4D] text-[#F3F6F4] text-xs font-sans hover:bg-[#243B3D] transition-colors shrink-0 focus:outline-none"
                >
                  复制链接
                </button>
              </div>
            </div>

            {/* 操作快捷按钮 */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleDownloadXml}
                className="px-3.5 py-1.5 rounded-full border border-[#C7D9D6] bg-white/50 hover:bg-white text-xs font-sans text-[#2F4B4D] transition-all focus:outline-none"
              >
                📥 下载 feed.xml
              </button>
              <button
                onClick={() => setShowRaw((prev) => !prev)}
                className="px-3.5 py-1.5 rounded-full border border-[#C7D9D6] bg-white/50 hover:bg-white text-xs font-sans text-[#5C7A7C] hover:text-[#2F4B4D] transition-all focus:outline-none"
              >
                {showRaw ? '收起 XML 源码' : '📄 查看 XML 源码'}
              </button>
            </div>

            {/* XML 源码折叠预览 */}
            <AnimatePresence>
              {showRaw && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden rounded-xl bg-[#243B3D] text-[#F3F6F4] p-4 text-xs font-mono max-h-48 overflow-y-auto"
                >
                  <pre>{rssXmlContent}</pre>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 推荐阅读器支持 */}
            <div className="pt-4 border-t border-[#C7D9D6]/35 space-y-2 text-xs text-[#5C7A7C]">
              <div className="font-medium text-[#2F4B4D]">推荐的现代化阅读器：</div>
              <div className="flex flex-wrap gap-2 text-[11px] font-sans">
                <span className="px-2.5 py-1 rounded-md bg-[#E6EDEB] text-[#2F4B4D]">NetNewsWire</span>
                <span className="px-2.5 py-1 rounded-md bg-[#E6EDEB] text-[#2F4B4D]">Follow</span>
                <span className="px-2.5 py-1 rounded-md bg-[#E6EDEB] text-[#2F4B4D]">Feedly</span>
                <span className="px-2.5 py-1 rounded-md bg-[#E6EDEB] text-[#2F4B4D]">Inoreader</span>
                <span className="px-2.5 py-1 rounded-md bg-[#E6EDEB] text-[#2F4B4D]">Readwise Reader</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-[#8EABA8] font-sans">
              <span>RSS 2.0 & Atom Supported</span>
              <PeachHeartMotif size={10} color="#F6DCCB" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
