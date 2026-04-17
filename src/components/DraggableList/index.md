---
title: 拖拽列表 DraggableList
toc: content
---

# 拖拽列表 DraggableList

一个支持拖拽排序和勾选启用的列表组件。适用于需要动态调整项顺序以及选择性启用/禁用项的场景。

## 基础用法

展示全部选项，并可以通过拖拽调整已启用项的顺序，并且可以通过勾选启用/禁用项。

```tsx
import React, { useState } from "react";
import { DraggableList } from "lstdesign";

const initialItems = [
  { id: "1", name: "姓名" },
  { id: "2", name: "年龄" },
  { id: "3", name: "性别" },
  { id: "4", name: "职业" },
];

export default () => {
  const [value, setValue] = useState(initialItems);

  return (
    <div style={{ padding: 20 }}>
      <DraggableList<{ id: string; name: string }>
        rowKey="id"
        labelKey="name"
        items={initialItems}
        value={value}
        onChange={(newValue) => {
          console.log("排序/状态变化:", newValue);
          setValue(newValue);
        }}
      />
    </div>
  );
};
```

## 自定义渲染

通过 `renderItem` 来自定义每一项的内容。

```tsx
import React, { useState } from "react";
import { DraggableList } from "lstdesign";
import { Tag } from "antd";

const initialItems = [
  { key: "red", label: "红色" },
  { key: "blue", label: "蓝色" },
  { key: "green", label: "绿色" },
];

export default () => {
  const [value, setValue] = useState(initialItems);

  return (
    <DraggableList<{ key: string; label: string }>
      rowKey="key"
      items={initialItems}
      value={value}
      onChange={setValue}
      renderItem={(item) => <Tag color={item.key}>{item.label}</Tag>}
    />
  );
};
```

## API

| 属性名      | 说明                                                                               | 类型                                                    | 默认值  |
| ----------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------- | ------- |
| rowKey      | 必填，列表中每一项的唯一标识对应的字段名或获取函数                                 | `(keyof T & string) \| ((item: T) => string \| number)` | -       |
| labelKey    | 默认显示的字段名（不传 renderItem 时生效）                                         | `keyof T & string`                                      | -       |
| sort        | 初始排序对比函数，如不指定则按value的顺序排列，如果没传入value则按 items的顺序排列 | `(a: T, b: T) => number`                                | -       |
| items       | 所有待排序选项                                                                     | `T[]`                                                   | `[]`    |
| value       | 数据源 (已启用的项)                                                                | `T[]`                                                   | `[]`    |
| onChange    | 排序变化或启用禁用后的回调                                                         | `(items: any[]) => void`                                | -       |
| onTransform | 数据输出转换函数，默认在每一项加入{order：index + 1}                               | `(items: T, index: number) => Record<string, any>`      | -       |
| renderItem  | 自定义渲染每个 item                                                                | `(item: T, index: number) => React.ReactNode`           | -       |
| disabled    | 是否禁用拖拽                                                                       | `boolean`                                               | `false` |
| className   | 外部传入的自定义类名                                                               | `string`                                                | -       |
| style       | 外部传入的内联样式                                                                 | `React.CSSProperties`                                   | -       |
