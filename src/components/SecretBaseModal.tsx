import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { rawSecretCiphertext } from '../utils/contentLoader';
import { decryptSecret } from '../utils/crypto';
import { ShadowData } from './ShadowWorld';
import { StarMotif } from './Motifs';

interface SecretBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: (data: ShadowData) => void;
  onShowToast: (msg: string) => void;
}

export const SecretBaseModal: React.FC<SecretBaseModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
  onShowToast,
}) => {
  const [password, setPassword] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShake, setIsShake] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMessage(null);
    }
  }, [isOpen]);

  const handleUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('请输入密钥');
      return;
    }

    setIsDecrypting(true);
    setErrorMessage(null);

    try {
      if (!rawSecretCiphertext) {
        throw new Error('未找到密文数据文件 (content/secret.enc)');
      }
      const plain = await decryptSecret(rawSecretCiphertext, password);
      
      let parsedData: ShadowData;
      try {
        parsedData = JSON.parse(plain);
      } catch {
        parsedData = {
          version: '1.0',
          title: 'fengqi.shadow',
          motto: '墨夜微光，不设防备的自留地',
          articles: [
            {
              id: 'shadow-legacy',
              title: '隐秘之境随笔',
              date: '2026.04.12',
              category: '私密随笔',
              readTime: '3 min read',
              excerpt: '写给自己的真心话与不设防备的自留地。',
              content: plain,
            },
          ],
          notes: [],
        };
      }

      onShowToast('正在进入隐秘之境');
      onUnlockSuccess(parsedData);
      onClose();
    } catch (err: any) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      setErrorMessage(err.message || '解密失败，密码不正确');
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#081011]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-[#A7CFC3]/20 bg-[#121E20]/95 text-[#F3F6F4] shadow-2xl relative overflow-hidden flex flex-col p-8 sm:p-10 text-center space-y-6"
          >
            {/* 环境微光 */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#A7CFC3]/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#F6DCCB]/10 blur-3xl pointer-events-none" />

            {/* 右上角关闭 */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-xs text-[#C7D9D6] transition-all focus:outline-none"
            >
              ✕
            </button>

            {/* 星芒图标与标题 */}
            <div className="space-y-2 relative z-10">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#A7CFC3]/15 border border-[#A7CFC3]/25 flex items-center justify-center mb-3">
                <StarMotif size={20} color="#A7CFC3" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#F3F6F4] tracking-wide">
                隐秘之境
              </h3>
              <p className="font-serif text-xs text-[#8EABA8] leading-relaxed max-w-xs mx-auto">
                输入密钥以开启另一处自留地。
              </p>
            </div>

            {/* 表单输入 */}
            <form onSubmit={handleUnlock} className="space-y-4 relative z-10">
              <motion.div
                animate={isShake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                transition={{ duration: 0.35 }}
              >
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密钥..."
                  autoFocus
                  className="w-full px-5 py-3 rounded-xl bg-black/40 border border-[#A7CFC3]/30 text-sm font-sans text-[#F3F6F4] placeholder-[#8EABA8]/50 focus:outline-none focus:border-[#A7CFC3] transition-all text-center tracking-widest"
                />
              </motion.div>

              {errorMessage && (
                <p className="text-xs text-[#F6DCCB] font-sans">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isDecrypting}
                className="w-full py-3 rounded-xl bg-[#A7CFC3] hover:bg-[#B8DCCF] text-[#0E1819] text-sm font-medium font-sans transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none"
              >
                {isDecrypting ? (
                  <span>正在开启...</span>
                ) : (
                  <span>进入空间 →</span>
                )}
              </button>
            </form>

            <div className="pt-2 text-[11px] text-[#8EABA8]/50 font-sans relative z-10">
              初始密码：<code className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[#A7CFC3]">fengqi2026</code>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
