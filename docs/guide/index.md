---
title: 介绍
order: 1
---

# 介绍

`lstDesign` 是一个基于 `antd` 和 `@ant-design/pro-components` 的组件库，由于业务场景中原有的组件不能满足所以进行了二次封装，为了方便以后有可能复用故写了个组件库，顺便练练手。

## 安装

我们推荐使用 `npm` 进行安装，同时也可以使用 `yarn` 或 `pnpm`。

```bash
npm install lstDesign
# 或者
yarn add lstDesign
# 或者
pnpm add lstDesign
```

## 快速使用

引入即可直接使用，样式默认与 antd 保持一致：

```tsx | pure
import React, { useRef } from "react";
import { Button } from "antd";
import {
  ModalForm,
  ProFormItem,
  type ProFormInstance,
} from "@ant-design/pro-components";
import { LoadingByScroll, DraggableModal, CustomRangePicker } from "lstDesign";

// 这是一个使用示例，展示如何在表单弹窗中结合三种组件
function Demo() {
  const formRef = useRef<ProFormInstance>(null);

  // 模拟分页接口
  const mockRequest = async (keyword: string, page: number, size: number) => {
    return { data: [], totalCount: 0 };
  };

  return (
    <DraggableModal>
      <ModalForm
        title="组合演示"
        formRef={formRef}
        trigger={<Button type="primary">点击打开弹窗</Button>}
      >
        <ProFormItem name="job" label="目标岗位">
          <LoadingByScroll
            placeholder="支持滚动加载的下拉框"
            request={mockRequest}
            handleData={(item) => ({ value: item.id, label: item.name })}
          />
        </ProFormItem>

        <CustomRangePicker
          name="activeTime"
          label="时间跨度"
          formRef={formRef}
        />
      </ModalForm>
    </DraggableModal>
  );
}
```
