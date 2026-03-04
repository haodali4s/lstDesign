import { ProFormDateTimeRangePicker } from "@ant-design/pro-components";
import type { ProFormInstance } from "@ant-design/pro-components";
import { Space, Typography } from "antd";

import dayjs, { Dayjs } from "dayjs";
import React, { useRef } from "react";

type BaseFieldProps = NonNullable<
  React.ComponentProps<typeof ProFormDateTimeRangePicker>["fieldProps"]
>;

type CustomRangeFieldProps = {
  /**
   * 弹出面板/关闭面板的回调
   * @param open 面板状态
   * @param startTime 开始时间 Ref
   */
  onOpenChange?: (
    open: boolean,
    startTime: React.MutableRefObject<dayjs.Dayjs>,
  ) => void;

  /**
   * 待选日期发生变化的回调，通常用于锁定 startTime
   * @param dates 选中的日期
   * @param dateStrings 格式化后的日期字符串
   * @param info 额外信息
   * @param startTime 开始时间 Ref
   */
  onCalendarChange?: (
    dates: any,
    dateStrings: string[],
    info: any,
    startTime: React.MutableRefObject<dayjs.Dayjs>,
  ) => void;

  /**
   * 确定选择的回调
   * @param dates 选中的日期
   * @param dateStrings 格式化后的日期字符串
   * @param startTime 开始时间 Ref
   */
  onChange?: (
    dates: any,
    dateStrings: string[],
    startTime: React.MutableRefObject<dayjs.Dayjs>,
  ) => void;
} & Omit<BaseFieldProps, "onOpenChange" | "onCalendarChange" | "onChange">;

export interface CustomRangePickerProps extends Omit<
  React.ComponentProps<typeof ProFormDateTimeRangePicker>,
  "fieldProps" | "name"
> {
  /** @param formRef 表单实例 Ref */
  formRef: React.RefObject<ProFormInstance>;
  fieldProps?: CustomRangeFieldProps;
  /** @param name 字段名 */
  name: string;
  customTimeRange?: {
    label: string;
    days: number;
  }[];
}

const CustomRangePicker: React.FC<CustomRangePickerProps> = ({
  formRef,
  customTimeRange,
  fieldProps,
  ...rest
}) => {
  const startTime = useRef<Dayjs>(dayjs());
  const { onOpenChange, onCalendarChange, onChange, ...fieldPropsRest } =
    fieldProps || {};

  // 快捷时间选项
  const quickTimeOptions = customTimeRange || [
    { label: "30天", days: 30 },
    { label: "90天", days: 90 },
    { label: "180天", days: 180 },
    { label: "一年", days: 365 },
  ];

  // 处理快捷时间点击
  const handleQuickTimeClick = (days: number) => {
    const origin = formRef?.current?.getFieldValue(rest.name);
    if (!origin) startTime.current = dayjs();
    const endTime = startTime.current.add(days, "day");
    if (formRef?.current) {
      formRef.current.setFieldValue(rest.name, [startTime.current, endTime]);
    }
  };

  return (
    <ProFormDateTimeRangePicker
      {...rest}
      transform={(value) => {
        return {
          effectiveTime: value?.[0],
          expiryTime: value?.[1],
        };
      }}
      fieldProps={{
        showNow: false,
        showTime: true,
        format: "YYYY-MM-DD HH:mm:ss",
        ...fieldPropsRest,
        onOpenChange: (open) => {
          if (onOpenChange) {
            onOpenChange(open, startTime);
          }
        },
        onCalendarChange: (dates, dateStrings, info) => {
          if (onCalendarChange) {
            onCalendarChange(dates, dateStrings, info, startTime);
          } else {
            // 未指定 onCalendarChange 时，默认行为
            startTime.current = dates[0] || dayjs(); //更新起始时间
          }
        },
        onChange: (dates, dateStrings) => {
          if (onChange) {
            onChange(dates, dateStrings, startTime);
          }
        },
        renderExtraFooter: () => (
          <Space size="middle" style={{ padding: "8px 12px" }}>
            {quickTimeOptions.map((option) => (
              <Typography.Link
                key={option.label}
                onClick={() => handleQuickTimeClick(option.days)}
              >
                {option.label}
              </Typography.Link>
            ))}
          </Space>
        ),
      }}
    />
  );
};

export default CustomRangePicker;
