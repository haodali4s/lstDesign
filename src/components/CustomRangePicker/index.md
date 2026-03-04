---
title: 带快捷选项的时间范围选择器 CustomRangePicker
group:
  title: 组件
  order: 3
toc: content
---

# 带快捷选项的时间范围选择器 CustomRangePicker

基于 `@ant-design/pro-components` 的 [ProFormDateTimeRangePicker](https://procomponents.ant.design/components/form-date-time-range-picker) 封装的时间范围选择器。内置快捷时间选项（如：30天、90天等），并支持自定义快捷项。需要在`ProForm`等表单项下使用。

## 基础用法

提供了快捷选择天数的面板。

```tsx
import React, { useRef } from "react";
import { ProForm, ProFormInstance } from "@ant-design/pro-components";
import { CustomRangePicker } from "lstDesign";

export default () => {
  const formRef = useRef<ProFormInstance>(null);

  return (
    <ProForm
      formRef={formRef}
      onFinish={async (values) => {
        console.log("表单值：", values);
        return true;
      }}
    >
      <CustomRangePicker name="timeRange" label="有效期" formRef={formRef} />
    </ProForm>
  );
};
```

## 自定义快捷项

通过 `customTimeRange` 属性自定义快捷时间跨度。

```tsx
import React, { useRef } from "react";
import { ProForm, ProFormInstance } from "@ant-design/pro-components";
import { CustomRangePicker } from "lstDesign";

export default () => {
  const formRef = useRef<ProFormInstance>(null);

  return (
    <ProForm
      formRef={formRef}
      onFinish={async (values) => {
        console.log(values);
        return true;
      }}
    >
      <CustomRangePicker
        name="timeRange2"
        label="试用期"
        formRef={formRef}
        customTimeRange={[
          { label: "7天", days: 7 },
          { label: "14天", days: 14 },
        ]}
      />
    </ProForm>
  );
};
```

## API

除了支持 [ProFormDateTimeRangePicker](https://procomponents.ant.design/components/form-date-time-range-picker#proformdatetimerangepicker) 组件的所有基础属性外，还支持以下定制化扩展属性：

| 属性名          | 说明                                                                                                           | 类型                                            | 默认值                    |
| --------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------- |
| formRef         | 必传。表单实例的Ref，不传则功能无法生效。                                                                      | `React.RefObject<ProFormInstance \| undefined>` | -                         |
| name            | 必传。即ProFormFields表单项的name，区别是如不传则功能无法生效                                                  | `string`                                        | -                         |
| customTimeRange | 自定义快捷时间跨度选项数，目前number只支持天数，如果是几年需要自己计算n\*365                                   | `{ label: string; days: number }[]`             | `30天，90天，180天，一年` |
| fieldProps      | 扩展的底层属性配置，主要用于覆盖重写内部的时间变更回调 `onOpenChange`、`onCalendarChange` 等钩子。一般不传即可 | `FieldProps`                                    | -                         |

### FieldProps

`fieldProps`除了重写了下面三个回调以外其他的和`ProFormDateTimeRangePicker`的`fieldProps`一致

| 属性名           | 说明                                                                                                                                           | 类型                                                                                                     |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| onOpenChange     | 弹出/关闭面板的回调，最后一个参数为组件内部维护的 `startTime`的ref，通过startTime.current获取其值，如果没有指定初始值，默认startTime为当前时间 | `(open: boolean, startTime: React.MutableRefObject<dayjs.Dayjs>) => void`                                |
| onCalendarChange | 待选日期发生变化的回调                                                                                                                         | `(dates: any, dateStrings: string[], info: any, startTime: React.MutableRefObject<dayjs.Dayjs>) => void` |
| onChange         | 确定选择日期的回调ref                                                                                                                          | `(dates: any, dateStrings: string[], startTime: React.MutableRefObject<dayjs.Dayjs>) => void`            |
