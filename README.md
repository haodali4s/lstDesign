# lstDesign

基于 Ant Design 和 ProComponents 封装的一系列高级业务组件库。旨在解决复杂场景下的交互需求，提升中后台应用开发效率。

## 📦 安装

使用以下任一你喜欢的包管理器进行安装：

```bash
npm install lstDesign
# 或者
yarn add lstDesign
# 或者
pnpm add lstDesign
```

> **依赖提醒 (Peer Dependencies)**
> 请确保你的项目中已安装以下依赖：`react`, `react-dom`, `antd`, `@ant-design/pro-components`, `ahooks`

## ✨ 包含的组件

目前库中包含以下开箱即用的高级组件：

1.  **`DraggableModal` (可拖拽弹窗)**
    - 基于 `ModalForm` 封装，给弹窗添加了能够随意拖拽移动的区域。
    - 防止屏幕空间受限时弹窗意外遮挡底层重要数据，极大提升用户体验。
2.  **`CustomRangePicker` (可定制时间范围选择器)**
    - 带有快捷选项（如：最近30天、最近90天等）的时间范围选择器。
    - 基于 `ProFormDateTimeRangePicker` 封装，需要在表单下使用。
3.  **`LoadingByScroll` (滚动分页加载选择器)**
    - 下拉长列表选项过多导致 DOM 卡顿？这款组件支持触底加载更多数据（分页接口接入）。
    - 完美适配极大数据量的“搜索+拉取更多”的高级场景。支持自定义触底阈值、防抖等。

## 🔨 快速上手演示

下面是一个能够在同一个页面同时跑起以上所有高级特性组件的示例：

```tsx
import React, { useRef, useState } from "react";
import { Button, message } from "antd";
import {
  ModalForm,
  ProForm,
  type ProFormInstance,
} from "@ant-design/pro-components";
import { DraggableModal, CustomRangePicker, LoadingByScroll } from "lstDesign";

const App = () => {
  const formRef = useRef<ProFormInstance>(null as any);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div style={{ padding: "40px", maxWidth: 800, margin: "0 auto" }}>
      <h1>📦 lstDesign 组件展示</h1>

      {/* 1. 可拖拽弹窗与自定义时间范围选择 */}
      <div style={{ marginBottom: 40 }}>
        <DraggableModal>
          <ModalForm
            title="我是可拖拽的弹窗"
            visible={modalVisible}
            onOpenChange={setModalVisible}
            trigger={<Button type="primary">点击打开弹窗</Button>}
            formRef={formRef}
            onFinish={async (values) => {
              message.success("提交成功: " + JSON.stringify(values));
              return true;
            }}
          >
            <CustomRangePicker
              formRef={formRef}
              name="dateRange"
              label="快捷时间筛选"
              rules={[{ required: true, message: "请选择时间" }]}
            />
          </ModalForm>
        </DraggableModal>
      </div>

      {/* 2. 支持触屏滚动的分页下拉选择器 */}
      <div>
        <ProForm
          onFinish={async (values) => {
            message.info("选择的值：" + JSON.stringify(values));
          }}
        >
          <ProForm.Item
            label="请选择一个项目 (向下滚动加载更多)"
            name="scrollItem"
          >
            <LoadingByScroll
              request={async (keyword, current, pageSize) => {
                // 此处替换为真实的后台分页请求接口
                return {
                  data: [
                    { value: 1, label: `项 ${current}-1` },
                    { value: 2, label: `项 ${current}-2` },
                  ],
                  totalCount: 100,
                  success: true,
                };
              }}
              handleData={(item: any) => ({
                label: item.label,
                value: item.value,
              })}
              placeholder="请搜索或向下滚动加载新选项"
            />
          </ProForm.Item>
        </ProForm>
      </div>
    </div>
  );
};

export default App;
```

## 📄 开源协议

MIT License
