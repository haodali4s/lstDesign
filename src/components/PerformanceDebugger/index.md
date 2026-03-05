---
title: 个性化性能监控easy-performance
toc: content
---

# 个性化性能监控easy-performance

一个基于 React 的开箱即用的性能监控看板组件，支持个性化选择监控指标和自定义监控阈值，以及监控数据的上报。该组件已经单独发布到 npm，并不在该组件库中。

## 安装

```bash
# npm
npm install easy-performance
# yarn
yarn add easy-performance
# pnpm
pnpm add easy-performance
```

## 组件演示

点击右下角灰色悬浮球进行个性化配置后开始监控，支持拖拽。监控运行时悬浮球会变为绿色，可以随时停止或更改配置。监控运行时，可以通过下方的按钮来触发和模拟不同的性能事件。

```tsx
/**
 * iframe: 750
 * compact: true
 */
import React, { useState } from "react";
import EasyPerformance from "easy-performance";

export default () => {
  const [clsBlock, setClsBlock] = useState(false);

  // 触发网络请求
  const triggerData = () => {
    fetch("https://jsonplaceholder.typicode.com/todos/1");
  };

  // 模拟耗时的交互 (INP)
  const simulateSlowInteraction = () => {
    const start = performance.now();
    while (performance.now() - start < 300) {
      // Block main thread for 300ms to simulate slow INP
    }
    console.log("Slow interaction finished");
  };

  // 触发累计布局偏移 (CLS)
  const triggerCLS = () => {
    // 延迟 1秒，避开 hadRecentInput 判定
    // 浏览器会自动忽略用户交互后 500ms 内发生的布局偏移
    setTimeout(() => {
      setClsBlock((v) => !v);
    }, 1000);
  };

  return (
    <div style={{ padding: 40, border: "1px solid #eee", borderRadius: 8 }}>
      {clsBlock && (
        <div
          style={{
            height: 200,
            background: "orange",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <h1>CLS Block (Layout Shift)</h1>
        </div>
      )}
      <h3 style={{ marginTop: 0 }}>交互测试区</h3>
      <p style={{ color: "#666", marginBottom: 16 }}>
        与页面进行交互（例如点击下方按钮）以生成性能数据指标，然后可以拖拽并点击左下角出现的悬浮图标查看详情。
      </p>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <button
          onClick={triggerData}
          style={{
            padding: "8px 16px",
            border: "1px solid #d9d9d9",
            background: "#fff",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          触发网络请求
        </button>
        <button
          onClick={simulateSlowInteraction}
          style={{
            padding: "8px 16px",
            border: "1px solid #d9d9d9",
            background: "#fff",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          触发慢交互 (INP 阻塞 300ms)
        </button>
        <button
          onClick={triggerCLS}
          style={{
            padding: "8px 16px",
            border: "none",
            background: "#ff9800",
            color: "white",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          触发布局偏移 (CLS 等待1s)
        </button>
      </div>
      <EasyPerformance />
    </div>
  );
};
```

## 🛠 使用方法

`easy-performance` 提供了一个开箱即用的 React 组件，只需将其添加到你的应用根节点即可。

```tsx | pure
import PerformanceMonitor from "easy-performance";

function App() {
  return (
    <div>
      {/* 将监控组件放在应用的最外层 */}
      <PerformanceMonitor />
      {/* 你的其他业务组件 */}
    </div>
  );
}

export default App;
```
