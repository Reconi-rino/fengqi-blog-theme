import React from 'react';
import { InnerWorld, ShadowData, ShadowArticle, ShadowNote } from './inner/InnerWorld';

export type { ShadowData, ShadowArticle, ShadowNote };

interface ShadowWorldProps {
  data?: ShadowData | null;
  onExitAndLock: () => void;
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
