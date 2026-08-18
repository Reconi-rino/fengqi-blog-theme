import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { rawSecretCiphertext } from '../../utils/contentLoader';
import { decryptSecret } from '../../utils/crypto';
import { ShadowData } from '../ShadowWorld';
import { CrescentMoonMotif, KeyholeMotif, StarMotif, LeafMotif } from '../Motifs';

interface PasswordGateProps {
  onUnlockSuccess: (data: ShadowData) => void;
  onExitToSurface: () => void;
  onShowToast: (msg: string) => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({
  onUnlockSuccess,
  onExitToSurface,
  onShowToast,
}) => {
  const [password, setPassword] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShake, setIsShake] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('请输入密钥');
      setIsShake(true);
      setTimeout(() => setIsShake(false), 400);
      return;
    }

    setIsDecrypting(true);
    setErrorMessage(null);

    try {
      if (!rawSecretCiphertext) {
        throw new Error('未找到密文文件 (content/secret.enc)');
      }
      const plain = await decryptSecret(rawSecretCiphertext, password);
      
      let parsedData: ShadowData;
      try {
        parsedData = JSON.parse(plain);
      } catch {
        parsedData = {
          version: '1.0',
          title: 'fengqi.shadow',
          motto: '只为书写与思考保留的一方安静之地。',
          articles: [
            {
              id: 'shadow-essay-1',
              title: '很久很久的那一天',
              date: '2026.05.12',
              category: '思索',
              readTime: '8 min read',
              excerpt: '那天没有风，时间像被按下了暂停键。我坐在窗前，看着光慢慢移动……',
              content: plain,
            },
          ],
          notes: [
            {
              id: 'shadow-note-1',
              date: '2026.05.08',
              tag: '观察',
              content: '落在水面上，轻轻转了两圈，最后沉下去，像一个小小的决定。\n\n有些事情不需要答案，只需要时间让它沉下去。',
            },
          ],
        };
      }

      onShowToast('正在进入内在世界');
      onUnlockSuccess(parsedData);
    } catch (err: any) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      setErrorMessage('好像不是这里。');
      setTimeout(() => {
        setErrorMessage(null);
      }, 2400);
    } finally {
      setIsDecrypting(false);
    }
  };

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

        {/* 右上角：四角星芒按钮，悬停展开“返回地表” */}
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

      {/* 主体左锚定内容区 (占据左侧约 10%~45% 空间) */}
      <main className="max-w-xl w-full my-auto py-12 space-y-10">
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

        {/* 密码验证区域 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#A89E91] font-sans">
            <KeyholeMotif size={14} color="#A89E91" />
            <span>输入密码后进入</span>
          </div>

          <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
            <motion.div
              animate={isShake ? { x: [-6, 6, -4, 4, -2, 2, 0] } : {}}
              transition={{ duration: 0.35 }}
              className="relative flex items-center"
            >
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="• • • • • • •"
                autoFocus
                className={`w-full h-12 pl-5 pr-14 rounded-xl bg-[#151E22]/80 border text-sm font-sans text-[#D7C9B8] placeholder-[#767E79]/50 focus:outline-none transition-all duration-300 tracking-widest backdrop-blur-md ${
                  errorMessage
                    ? 'border-[#E8B48C] text-[#E8B48C]'
                    : 'border-[rgba(215,201,184,0.18)] focus:border-[#E8B48C]/70'
                }`}
              />

              {/* 嵌入右侧的杏雾色圆钮 */}
              <button
                type="submit"
                disabled={isDecrypting}
                className="absolute right-1.5 w-9 h-9 rounded-lg bg-[#E8B48C] hover:bg-[#F3C49E] text-[#0E1316] flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50 focus:outline-none"
                title="进入"
              >
                {isDecrypting ? (
                  <span className="text-xs animate-pulse">…</span>
                ) : (
                  <span className="font-mono text-sm leading-none font-bold">→</span>
                )}
              </button>
            </motion.div>

            {/* 错误提示文案 */}
            {errorMessage ? (
              <p className="text-xs text-[#E8B48C] font-serif pt-2 transition-all">
                {errorMessage}
              </p>
            ) : (
              <p className="text-[11px] text-[#767E79] font-serif pt-2">
                这是你的空间，轻声进入，温柔写下。
              </p>
            )}
          </form>
        </div>

        {/* 极低优先级入口提示 */}
        <div className="space-y-1.5 pt-4 text-xs font-sans text-[#767E79]/70">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-[#E8B48C]/70">○</span>
            <span>Writing 写作</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-[#E8B48C]/70">~</span>
            <span>Notes 随记</span>
          </div>
        </div>
      </main>

      {/* 底部与右下角弯月 */}
      <footer className="w-full flex items-end justify-between pt-8">
        <div className="flex items-center gap-2 text-xs font-serif text-[#767E79]/60">
          <LeafMotif size={12} color="#767E79" />
          <span>在内在世界里，慢慢写，安心读。</span>
        </div>

        {/* 右下角弯月装饰 */}
        <div className="opacity-40 hover:opacity-80 transition-opacity duration-500">
          <CrescentMoonMotif size={28} color="#E8B48C" />
        </div>
      </footer>
    </div>
  );
};
