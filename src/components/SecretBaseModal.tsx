import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeafMotif, PeachHeartMotif } from './Motifs';
import { rawSecretCiphertext } from '../utils/contentLoader';
import { decryptSecret, encryptSecret } from '../utils/crypto';
import { MarkdownRenderer } from './MarkdownRenderer';

interface SecretBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const SecretBaseModal: React.FC<SecretBaseModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [password, setPassword] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShake, setIsShake] = useState(false);

  // 加密工作室状态 (用于博主在浏览器端直接加密新内容)
  const [showStudio, setShowStudio] = useState(false);
  const [studioPlaintext, setStudioPlaintext] = useState('');
  const [studioPassword, setStudioPassword] = useState('');
  const [studioResult, setStudioResult] = useState('');

  // 每次打开弹窗时重置错误信息
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
    }
  }, [isOpen]);

  const handleUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('请输入解密密钥');
      return;
    }

    setIsDecrypting(true);
    setErrorMessage(null);

    try {
      if (!rawSecretCiphertext) {
        throw new Error('未找到加密密文文件 (content/secret.enc)');
      }
      const plain = await decryptSecret(rawSecretCiphertext, password);
      setDecryptedContent(plain);
      onShowToast('密室之门已开启 ✦');
    } catch (err: any) {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      setErrorMessage(err.message || '解密失败，密码不正确');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleLock = () => {
    setDecryptedContent(null);
    setPassword('');
    setShowStudio(false);
    onShowToast('隐秘之境已重新上锁 🔒');
  };

  const handleGenerateCiphertext = async () => {
    if (!studioPlaintext.trim() || !studioPassword.trim()) {
      onShowToast('请完整输入待加密内容与新密码');
      return;
    }
    try {
      const cipher = await encryptSecret(studioPlaintext, studioPassword);
      setStudioResult(cipher);
      onShowToast('新密文生成成功！可复制并替换 content/secret.enc');
    } catch (err) {
      onShowToast('加密失败，请重试');
    }
  };

  const handleCopyCipher = () => {
    if (studioResult) {
      navigator.clipboard?.writeText(studioResult);
      onShowToast('密文已复制到剪贴板 ✓');
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
          className="fixed inset-0 z-50 bg-[#142324]/65 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-3xl border border-[#5C7A7C]/40 bg-[#1F3335]/95 text-[#F3F6F4] shadow-2xl relative overflow-hidden flex flex-col max-h-[88vh]"
          >
            {/* 顶部环境光晕 */}
            <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-[#A7CFC3]/15 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-[#F6DCCB]/10 blur-3xl pointer-events-none" />

            {/* 顶栏控制 */}
            <div className="px-7 py-5 border-b border-[#5C7A7C]/30 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-[#A7CFC3]">✦</span>
                <h3 className="font-serif text-lg sm:text-xl text-[#F3F6F4] font-normal tracking-wide">
                  {decryptedContent ? '隐秘之境 · Secret Sanctuary' : '秘密基地 · 密钥验证'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {decryptedContent && (
                  <>
                    <button
                      onClick={() => setShowStudio((prev) => !prev)}
                      className="px-3 py-1 rounded-full text-xs font-sans border border-[#A7CFC3]/40 text-[#A7CFC3] hover:bg-[#A7CFC3]/20 transition-all focus:outline-none"
                    >
                      {showStudio ? '查看密文文章' : '✍️ 加密新内容'}
                    </button>
                    <button
                      onClick={handleLock}
                      className="px-3 py-1 rounded-full text-xs font-sans border border-[#F6DCCB]/40 text-[#F6DCCB] hover:bg-[#F6DCCB]/20 transition-all focus:outline-none"
                    >
                      重新上锁
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-xs text-[#C7D9D6] transition-all focus:outline-none"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 弹窗主体内容 */}
            <div className="p-7 sm:p-10 overflow-y-auto relative z-10 flex-1">
              {!decryptedContent ? (
                /* 未解锁态：密码输入与解密 */
                <div className="max-w-md mx-auto py-8 text-center space-y-7">
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#A7CFC3]/15 border border-[#A7CFC3]/30 flex items-center justify-center text-xl mb-4">
                      🗝️
                    </div>
                    <h4 className="font-serif text-2xl font-normal text-[#F3F6F4]">
                      输入密钥以解密
                    </h4>
                    <p className="font-sans text-xs sm:text-sm text-[#8EABA8] leading-relaxed">
                      这里存放着未向公众开放的私人随笔、未竟想法与胶片故事。
                      <br />
                      基于客户端原生 AES-256-GCM 硬件级端到端加密保护。
                    </p>
                  </div>

                  <form onSubmit={handleUnlock} className="space-y-4">
                    <motion.div
                      animate={isShake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入解密密码..."
                        autoFocus
                        className="w-full px-5 py-3.5 rounded-xl bg-black/30 border border-[#5C7A7C]/60 text-sm font-sans text-[#F3F6F4] placeholder-[#8EABA8]/60 focus:outline-none focus:border-[#A7CFC3] transition-all text-center tracking-widest"
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
                      className="w-full py-3 rounded-xl bg-[#A7CFC3] hover:bg-[#B8DCCF] text-[#1F3335] text-sm font-medium font-sans transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none"
                    >
                      {isDecrypting ? (
                        <>
                          <span className="animate-spin text-xs">🌀</span>
                          <span>正在解密...</span>
                        </>
                      ) : (
                        <span>开启密室 →</span>
                      )}
                    </button>
                  </form>

                  <div className="pt-6 border-t border-[#5C7A7C]/20 text-[11px] text-[#8EABA8]/70 font-sans">
                    💡 默认初始解密密钥：<code className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[#A7CFC3]">fengqi2026</code>
                  </div>
                </div>
              ) : showStudio ? (
                /* 加密新内容工作室 */
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg text-[#F3F6F4]">
                      ✍️ 加密新内容工作室 (Encryption Studio)
                    </h4>
                    <p className="text-xs text-[#8EABA8] font-sans">
                      在此输入你想加密的 Markdown 正文并设置新密码，生成的密文可直接存入 <code>content/secret.enc</code>。
                    </p>
                  </div>

                  <textarea
                    rows={8}
                    value={studioPlaintext}
                    onChange={(e) => setStudioPlaintext(e.target.value)}
                    placeholder="在此输入你要加密的私密 Markdown 内容..."
                    className="w-full p-4 rounded-xl bg-black/30 border border-[#5C7A7C]/40 text-xs font-mono text-[#F3F6F4] focus:outline-none focus:border-[#A7CFC3] resize-none"
                  />

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={studioPassword}
                      onChange={(e) => setStudioPassword(e.target.value)}
                      placeholder="设置解密新密码 (请务必牢记)..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-black/30 border border-[#5C7A7C]/40 text-xs font-sans text-[#F3F6F4] focus:outline-none focus:border-[#A7CFC3]"
                    />
                    <button
                      onClick={handleGenerateCiphertext}
                      className="px-5 py-2.5 rounded-xl bg-[#A7CFC3] text-[#1F3335] text-xs font-medium hover:bg-[#B8DCCF] transition-colors focus:outline-none"
                    >
                      生成 AES-256 密文
                    </button>
                  </div>

                  {studioResult && (
                    <div className="p-4 rounded-xl bg-black/40 border border-[#A7CFC3]/30 space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#A7CFC3]">
                        <span>生成密文 (Base64)</span>
                        <button
                          onClick={handleCopyCipher}
                          className="hover:underline font-medium focus:outline-none"
                        >
                          复制密文 ✓
                        </button>
                      </div>
                      <div className="max-h-24 overflow-y-auto text-[11px] font-mono text-[#8EABA8] break-all select-all">
                        {studioResult}
                      </div>
                      <p className="text-[11px] text-[#8EABA8]/70">
                        提示：将上述密文复制并完整替换 <code>content/secret.enc</code> 文件的内容并提交即可。
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* 已解密展示态 */
                <div className="space-y-6">
                  {/* 解密文章主体 */}
                  <div className="prose-dark font-serif text-[#F3F6F4] leading-relaxed [&_h1]:text-2xl [&_h1]:font-normal [&_h1]:mb-4 [&_h1]:text-[#A7CFC3] [&_h2]:text-xl [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:text-sm sm:[&_p]:text-base [&_p]:text-[#E6EDEB] [&_blockquote]:border-l-2 [&_blockquote]:border-[#A7CFC3] [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-4 [&_blockquote]:bg-white/5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:text-sm">
                    <MarkdownRenderer content={decryptedContent} />
                  </div>

                  <div className="pt-6 border-t border-[#5C7A7C]/30 flex items-center justify-between text-xs text-[#8EABA8]">
                    <div className="flex items-center gap-1.5">
                      <LeafMotif size={13} color="#A7CFC3" />
                      <span>已开启会话保护 · 离开或刷新页面自动锁定</span>
                    </div>
                    <PeachHeartMotif size={12} color="#F6DCCB" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
