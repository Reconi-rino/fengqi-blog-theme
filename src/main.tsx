/**
 * 应用入口文件
 * 负责将 React 根组件挂载到 index.html 中的 #root 容器，并加载全局样式表。
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 以 React StrictMode 启动根应用，便于在开发阶段提前发现潜在副作用问题
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
