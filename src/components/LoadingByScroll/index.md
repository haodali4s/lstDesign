---
title: 可滚动加载选择器 LoadingByScroll

toc: content
---

# 可滚动加载选择器 LoadingByScroll

基于antd的Select组件封装的，支持搜索和滚动加载更多内容的下拉选择器，适用于数据量较大的场景。

## 基础搜索

利用输入框输入内容，防抖触发后端的 API 获取筛选后的数据。

```tsx
import React from "react";
import { LoadingByScroll } from "lstdesign";

// 模拟 API 请求
const mockSearchRequest = async (
  keyword: string,
  pageNumber: number,
  pageSize: number,
) => {
  return new Promise<{ data: any[]; totalCount: number }>((resolve) => {
    setTimeout(() => {
      // 模拟总数据
      const ALL_DATA = Array.from({ length: 100 }).map((_, index) => ({
        id: index,
        name: `测试用户 ${index}`,
      }));

      // 模拟根据关键词过滤
      const filteredData = ALL_DATA.filter((item) =>
        keyword ? item.name.includes(keyword) : true,
      );

      const startIndex = (pageNumber - 1) * pageSize;
      const paginatedData = filteredData.slice(
        startIndex,
        startIndex + pageSize,
      );

      resolve({
        data: paginatedData,
        totalCount: filteredData.length,
      });
    }, 500);
  });
};

export default () => {
  return (
    <LoadingByScroll
      style={{ width: 300 }}
      placeholder="请输入关键词搜索（如：测试用户 1）"
      request={mockSearchRequest}
      showSearch
      filterOption={false}
      handleData={(item) => ({
        value: item.id,
        label: item.name,
        detail: item,
      })}
    />
  );
};
```

## 滚动加载

通过配置 `scrollLoad` 属性，当下拉列表滚动到底部指定阈值时，自动触发获取下一页数据的请求。

```tsx
import React from "react";
import { LoadingByScroll } from "lstdesign";

// 模拟 API 请求
const mockScrollRequest = async (
  keyword: string,
  pageNumber: number,
  pageSize: number,
) => {
  return new Promise<{ data: any[]; totalCount: number }>((resolve) => {
    setTimeout(() => {
      // 模拟总共 55 条数据
      const TOTAL = 55;
      const data = Array.from({ length: pageSize }).map((_, index) => {
        const id = (pageNumber - 1) * pageSize + index;
        return {
          id: id,
          name: `滚动项 ${id}`,
        };
      });

      // 如果超出了总数，截断返回
      const validData = data.filter((item) => item.id < TOTAL);

      resolve({
        data: validData,
        totalCount: TOTAL,
      });
    }, 800);
  });
};

export default () => {
  return (
    <LoadingByScroll
      style={{ width: 300 }}
      placeholder="滚动到底部加载更多数据"
      request={mockScrollRequest}
      showSearch
      filterOption={false}
      scrollLoad={{ threshold: 20 }}
      handleData={(item) => ({
        value: item.id,
        label: item.name,
      })}
    />
  );
};
```

## 自定义选项渲染

可以通过 `optionRender` 属性自定义下拉列表中每个选项的渲染内容，这在需要展示更丰富信息（如头像、二级描述等）时非常有用。

```tsx
import React from "react";
import { LoadingByScroll } from "lstdesign";

// 模拟 API 请求
const mockOptionRenderRequest = async (
  keyword: string,
  pageNumber: number,
  pageSize: number,
) => {
  return new Promise<{ data: any[]; totalCount: number }>((resolve) => {
    setTimeout(() => {
      const data = Array.from({ length: pageSize }).map((_, index) => {
        const id = (pageNumber - 1) * pageSize + index;
        return {
          id: id,
          name: `员工 ${id}`,
          email: `employee${id}@example.com`,
          department: index % 2 === 0 ? "技术部" : "产品部",
        };
      });

      resolve({
        data,
        totalCount: 50,
      });
    }, 500);
  });
};

export default () => {
  return (
    <LoadingByScroll
      style={{ width: 300 }}
      placeholder="请选择员工"
      request={mockOptionRenderRequest}
      showSearch
      filterOption={false}
      scrollLoad={{ threshold: 20 }}
      handleData={(item) => ({
        value: item.id,
        label: item.name,
        // 将其他需要的数据放入 detail 字段中，供 optionRender 使用
        detail: item,
      })}
      optionRender={(option) => {
        const detail = option.data?.detail;
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "4px 0",
            }}
          >
            <span style={{ fontWeight: 500, lineHeight: 1.2 }}>
              {option.label}
            </span>
            <span style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
              {detail?.department} | {detail?.email}
            </span>
          </div>
        );
      }}
    />
  );
};
```

## API

除了支持antd [Select](https://ant.design/components/select-cn#api) 组件的所有基础属性外，还支持以下扩展属性：

| 属性名     | 说明                                                                                                                                                                                     | 类型                                                                                                  | 默认值  |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------- |
| request    | 获取数据的方法                                                                                                                                                                           | `(value: string, pageNumber: number, pageSize: number) => Promise<{ data: T[]; totalCount: number }>` | -       |
| handleData | 处理原始数据，如果传入了request方法，则为必须传入。必须返回原始数据里作为value、label的字段，剩下的数据如有需要可以放在detail里                                                          | `(data: T) => { value: string \| number; label: string \| number; detail?: Record<string, any>; }`    | -       |
| debounce   | 搜索输入防抖时间（毫秒）                                                                                                                                                                 | `number`                                                                                              | `1000`  |
| pageSize   | 每次请求的分页数量                                                                                                                                                                       | `number`                                                                                              | `10`    |
| scrollLoad | 滚动加载配置。可配置文件触底阈值，传 `false` 为关闭滚动加载,请确保分页的数据足够多,能出滚动条,不然无法触发滚动加载。滚动加载阈值，支持像素(number/px)和百分比(%)，均为剩余多少时触发加载 | `boolean \| { threshold?: number \| string }`                                                         | `false` |
