/**
 * 里世界（ShadowWorld）兼容包装组件
 * 将历史接口代理至 InnerWorld 沉浸式私密空间视图，保持对外类型导出一致。
 */
import React from 'react';
import { InnerWorld, ShadowData, ShadowArticle, ShadowNote } from './inner/InnerWorld';

export type { ShadowData, ShadowArticle, ShadowNote };

interface ShadowWorldProps {
  /** 可选的预解密里世界初始数据 */
  data?: ShadowData | null;
  /** 退出并重新锁定里世界的回调函数 */
  onExitAndLock: () => void;
  /** 轻提示通知回调 */
  onShowToast: (msg: string) => void;
}

export const ShadowWorld: React.FC<ShadowWorldProps> = ({
  data,
  onExitAndLock,
  onShowToast,
}) => {
  return (
    <InnerWorld
      initialData={data}
      onExitToSurface={onExitAndLock}
      onShowToast={onShowToast}
    />
  );
};

export default ShadowWorld;
