---
title: 可拖拽弹窗表单 DraggableModal
group:
  title: 组件
  order: 2
toc: content
---

# 可拖拽弹窗表单 DraggableModal

基于`@ant-design/pro-components` 的 [ ModalForm](https://procomponents.ant.design/components/modal-form) 封装的可拖拽弹窗组件。通过给弹窗添加拖拽区域，让用户可以在屏幕上自由移动窗口位置，以防弹窗遮挡底层的重要数据，提升交互体验。

## 基础用法

普通的表单弹窗，带有可拖拽特性。鼠标按住弹窗内部的**头部空白区域**即可进行拖拽。可拖拽区域为Modalform的PaddingTop区域,如果需要调整大小请修改PaddingTop的大小。

```tsx
import React from "react";
import { Button } from "antd";
import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { DraggableModal } from "lstDesign";

export default () => {
  return (
    <DraggableModal>
      <ModalForm
        title="我是可以拖拽的弹窗"
        trigger={<Button type="primary">点击打开弹窗</Button>}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          console.log(values);
          return true;
        }}
      >
        <ProFormText
          name="name"
          label="用户名"
          placeholder="请输入用户名"
          rules={[{ required: true }]}
        />
      </ModalForm>
    </DraggableModal>
  );
};
```

## API

`DraggableModal` 是一个高阶组件，它本身接收的属性，只需传入`@ant-design/pro-components` 提供的 `ModalForm`。

| 属性名   | 说明                                                            | 类型                                                   | 默认值 |
| -------- | --------------------------------------------------------------- | ------------------------------------------------------ | ------ |
| children | 必须是 `@ant-design/pro-components` 提供的 `ModalForm` 组件实例 | `React.ReactElement<ComponentProps<typeof ModalForm>>` | -      |
