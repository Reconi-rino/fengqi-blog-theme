import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import mermaid from 'mermaid';
import { LeafMotif, PeachHeartMotif } from './Motifs';

// 初始化 Mermaid 主题配置（低饱和雾青与黛青）
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#E6EDEB',
    primaryTextColor: '#2F4B4D',
    primaryBorderColor: '#A7CFC3',
    lineColor: '#5C7A7C',
    secondaryColor: '#F6DCCB',
    tertiaryColor: '#F3F6F4',
    background: '#F3F6F4',
    fontFamily: "'Inter', 'Noto Serif SC', sans-serif",
    fontSize: '14px',
  },
  securityLevel: 'loose',
});

// Mermaid 渲染子组件
const MermaidBlock: React.FC<{ code: string }> = ({ code }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
    mermaid
      .render(id, code.trim())
      .then((res) => {
        setSvg(res.svg);
        setError(null);
      })
      .catch((err) => {
        console.warn('Mermaid rendering error:', err);
        setError('Mermaid 图表渲染失败');
      });
  }, [code]);

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50/70 border border-red-200 text-xs text-red-700 font-mono my-4">
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-8 p-6 rounded-xl bg-white/50 backdrop-blur-xs border border-[#C7D9D6]/60 shadow-2xs overflow-x-auto flex justify-center items-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

// 复制按钮小组件
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-2.5 py-1 rounded text-[11px] font-sans text-[#5C7A7C] hover:text-[#2F4B4D] bg-white/70 hover:bg-white border border-[#C7D9D6]/60 transition-all focus:outline-none"
    >
      {copied ? '已复制 ✓' : '复制'}
    </button>
  );
};

// Remark 插件：自动识别 [!NOTE], [!TIP] 等并在 AST 层彻底移除标识符
function remarkCalloutPlugin() {
  return (tree: any) => {
    function walk(node: any) {
      if (!node) return;
      if (node.type === 'blockquote' && node.children && node.children.length > 0) {
        const firstChild = node.children[0];
        if (firstChild.type === 'paragraph' && firstChild.children && firstChild.children.length > 0) {
          const firstInline = firstChild.children[0];
          if (firstInline.type === 'text') {
            const match = firstInline.value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]([^\n\r]*)/i);
            if (match) {
              const calloutType = match[1].toUpperCase();
              const calloutTitle = match[2]?.trim() || '';

              // 记录到 blockquote 的 HTML 属性中供 React 组件读取
              node.data = node.data || {};
              node.data.hProperties = node.data.hProperties || {};
              node.data.hProperties['data-callout-type'] = calloutType;
              if (calloutTitle) {
                node.data.hProperties['data-callout-title'] = calloutTitle;
              }

              // 从 AST 中彻底剥离 [!NOTE] 标识符和紧随的标题
              firstInline.value = firstInline.value.slice(match[0].length).replace(/^[\r\n]+/, '');

              // 如果该文本节点已经被彻底清空，则将其从段落中移除
              if (!firstInline.value.trim()) {
                firstChild.children.shift();
              }

              // 如果首个段落节点已经没有任何子元素，则将其从 blockquote 中移除
              if (firstChild.children.length === 0) {
                node.children.shift();
              }
            }
          }
        }
      }

      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(walk);
      }
    }

    walk(tree);
  };
}

// 统一半透明质感 Callout 提示框组件 (Translucent Frosted Callout Card)
const BeautifulCallout: React.FC<{ type: string; title?: string; children: React.ReactNode }> = ({
  type,
  title,
  children,
}) => {
  const upperType = type.toUpperCase();

  // 低饱和度半透明水彩微光配色系统
  const configMap: Record<string, {
    bg: string;
    border: string;
    headerBg: string;
    icon: React.ReactNode;
    tag: string;
    tagColor: string;
  }> = {
    NOTE: {
      bg: 'bg-[#EBF3EF]/45 backdrop-blur-xs',
      border: 'border-[#A7CFC3]/45',
      headerBg: 'border-[#A7CFC3]/25 bg-[#EBF3EF]/30',
      icon: <LeafMotif size={14} color="#5C8A7D" />,
      tag: 'NOTE · 随记',
      tagColor: 'text-[#41685D]',
    },
    TIP: {
      bg: 'bg-[#F0F6F2]/45 backdrop-blur-xs',
      border: 'border-[#B8DCCF]/50',
      headerBg: 'border-[#B8DCCF]/25 bg-[#F0F6F2]/30',
      icon: <span className="text-xs">💡</span>,
      tag: 'TIP · 灵感',
      tagColor: 'text-[#3E6B5E]',
    },
    IMPORTANT: {
      bg: 'bg-[#EAF0EE]/45 backdrop-blur-xs',
      border: 'border-[#C7D9D6]/60',
      headerBg: 'border-[#C7D9D6]/30 bg-[#EAF0EE]/30',
      icon: <span className="text-xs">📌</span>,
      tag: 'IMPORTANT · 关键',
      tagColor: 'text-[#2F4B4D]',
    },
    WARNING: {
      bg: 'bg-[#FAF2EB]/50 backdrop-blur-xs',
      border: 'border-[#F6DCCB]/70',
      headerBg: 'border-[#F6DCCB]/35 bg-[#FAF2EB]/35',
      icon: <span className="text-xs">⚠️</span>,
      tag: 'WARNING · 提醒',
      tagColor: 'text-[#7D523B]',
    },
    CAUTION: {
      bg: 'bg-[#FAF0EA]/50 backdrop-blur-xs',
      border: 'border-[#F4D0BD]/70',
      headerBg: 'border-[#F4D0BD]/35 bg-[#FAF0EA]/35',
      icon: <PeachHeartMotif size={12} color="#D48B70" />,
      tag: 'CAUTION · 注意',
      tagColor: 'text-[#8A4A33]',
    },
  };

  const currentConfig = configMap[upperType] || configMap.NOTE;

  return (
    <div
      className={`my-6 rounded-2xl border ${currentConfig.border} ${currentConfig.bg} shadow-2xs overflow-hidden transition-all duration-300`}
    >
      {/* Callout 顶部轻量标题栏 */}
      <div
        className={`px-5 py-2 flex items-center justify-between border-b ${currentConfig.headerBg}`}
      >
        <div className="flex items-center gap-2">
          {currentConfig.icon}
          <span className={`font-sans text-xs font-medium tracking-wider uppercase ${currentConfig.tagColor}`}>
            {title || currentConfig.tag}
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#8EABA8] opacity-60">
          fengqi.callout
        </span>
      </div>

      {/* Callout 内容正文（完全剥离标识符，低饱和半透明排版） */}
      <div className="px-5 sm:px-6 py-3.5 font-serif text-sm sm:text-base leading-relaxed text-[#2F4B4D] [&>p]:mb-0 [&>p+p]:mt-2.5">
        {children}
      </div>
    </div>
  );
};

// 健壮保护：捕获 Markdown 或 Mermaid 渲染异常，避免破坏整页 React 状态
class MarkdownErrorBoundary extends React.Component<
  { children: React.ReactNode; rawContent: string },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('Markdown rendering caught error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-[#E6EDEB]/60 border border-[#A7CFC3]/40 text-xs text-[#5C7A7C] font-sans">
            部分富媒体格式解析暂缓，已切换至纯净正文阅读视图。
          </div>
          <div className="whitespace-pre-wrap font-serif text-base leading-relaxed text-[#2F4B4D]">
            {this.props.rawContent}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  return (
    <MarkdownErrorBoundary rawContent={content}>
      <div className={`editorial-prose ${className}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkCalloutPlugin]}
          rehypePlugins={[rehypeRaw]}
          components={{
            // 剥离外层多余 pre，避免与 code 块中构建的优雅卡片发生标签非法嵌套
            pre({ children }) {
              return <>{children}</>;
            },

            // 代码块与 Mermaid 解析 (浅色优雅雾感风格)
            code({ node, className: codeClass, children, ...props }) {
              const match = /language-(\w+)/.exec(codeClass || '');
              const language = match ? match[1] : '';
              const codeString = String(children).replace(/\n$/, '');

            // Mermaid 流程图/架构图
            if (language === 'mermaid') {
              return <MermaidBlock code={codeString} />;
            }

            // 行内代码
            const isInline = !codeClass && !String(children).includes('\n');
            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-[#E6EDEB]/70 text-[#2F4B4D] text-[0.9em] font-mono border border-[#C7D9D6]/40"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // 浅色优雅雾感多行代码块
            return (
              <div className="relative my-6 rounded-xl overflow-hidden bg-[#EAF1EE]/70 text-[#2F4B4D] border border-[#C7D9D6]/60 shadow-2xs backdrop-blur-xs">
                {/* 顶部浅色代码信息栏 */}
                <div className="flex items-center justify-between px-4 py-2 bg-[#DFEAE6]/40 border-b border-[#C7D9D6]/40 text-xs font-mono text-[#5C7A7C]">
                  <span className="uppercase tracking-wider text-[11px] font-medium">{language || 'text'}</span>
                  <CopyButton text={codeString} />
                </div>
                {/* 浅色代码正文 */}
                <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-[#2F4B4D] selection:bg-[#A7CFC3]/35">
                  <code>{children}</code>
                </pre>
              </div>
            );
          },

          // 自定义 Callout 提示框 (Note / Tip / Important / Warning / Caution) 与文学引用
          blockquote({ node, children, ...props }) {
            const calloutType = (props as any)['data-callout-type'];
            const calloutTitle = (props as any)['data-callout-title'];

            if (calloutType) {
              return (
                <BeautifulCallout type={calloutType} title={calloutTitle || undefined}>
                  {children}
                </BeautifulCallout>
              );
            }

            // 常规文学引用块（统一半透明柔和微边框）
            return (
              <blockquote className="my-6 font-serif text-sm sm:text-base text-[#5C7A7C] border-l-2 border-[#A7CFC3] pl-5 py-3 bg-[#E6EDEB]/30 backdrop-blur-xs rounded-r-lg">
                {children}
              </blockquote>
            );
          },

          // 增强表格排版
          table({ children }) {
            return (
              <div className="my-8 overflow-x-auto rounded-xl border border-[#C7D9D6]/60 bg-white/40 shadow-2xs backdrop-blur-xs">
                <table className="w-full text-left text-sm font-sans border-collapse">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-[#E6EDEB]/60 border-b border-[#C7D9D6]/40 text-xs font-semibold text-[#2F4B4D] uppercase">{children}</thead>;
          },
          th({ children }) {
            return <th className="p-3.5 sm:px-5 sm:py-3.5 border-r last:border-r-0 border-[#C7D9D6]/30">{children}</th>;
          },
          td({ children }) {
            return <td className="p-3.5 sm:px-5 sm:py-3.5 border-t border-r last:border-r-0 border-[#C7D9D6]/30 font-serif text-[#2F4B4D]">{children}</td>;
          },

          // 链接
          a({ href, children }) {
            return (
              <a
                href={href}
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="text-[#2F4B4D] font-medium underline underline-offset-4 decoration-[#A7CFC3] hover:decoration-[#2F4B4D] hover:text-[#1F3335] transition-colors"
              >
                {children}
              </a>
            );
          },

          // 标题层级
          h1({ children }) {
            return <h1 className="font-serif text-3xl sm:text-4xl text-[#2F4B4D] font-normal tracking-tight mt-12 mb-6">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="font-serif text-2xl sm:text-3xl text-[#2F4B4D] font-normal tracking-tight mt-10 mb-5 pb-2 border-b border-[#C7D9D6]/30">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="font-serif text-xl sm:text-2xl text-[#2F4B4D] font-normal tracking-tight mt-8 mb-4">{children}</h3>;
          },

          // 列表
          ul({ children }) {
            return <ul className="list-disc list-outside pl-6 my-5 space-y-2 text-[#2F4B4D] font-serif">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-outside pl-6 my-5 space-y-2 text-[#2F4B4D] font-serif">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
      </div>
    </MarkdownErrorBoundary>
  );
};
