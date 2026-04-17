import { Checkbox } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./DraggableList.module.less";

// ==================== 组件 Props ====================

export interface DraggableListProps<T> {
  /** 唯一标识对应的字段名或获取函数 */
  rowKey: (keyof T & string) | ((item: T) => string | number);
  /** 默认显示的字段名（不传 renderItem 时生效） */
  labelKey?: keyof T & string;
  /** 初始排序对比函数 (返回 >0, <0 或 =0) */
  sort?: (a: T, b: T) => number;
  /** 所有待排序的项 */
  items?: T[];
  /** 数据源 (已启用的项) */
  value?: T[];
  /** 排序变化或启用禁用后的回调 */
  onChange?: (items: any[]) => void;
  /** 自定义数据输出转换函数 */
  onTransform?: (items: T, index: number) => Record<string, any>;
  /** 自定义渲染每个 item */
  renderItem?: (item: T, index: number) => React.ReactNode;
  /** 是否禁用拖拽 */
  disabled?: boolean;
  /** 外部传入的自定义类名 */
  className?: string;
  /** 外部传入的内联样式 */
  style?: React.CSSProperties;
}

/** 辅助函数：获取项的唯一 Key */
const getItemKey = <T,>(
  item: T,
  rowKey: (keyof T & string) | ((item: T) => string | number),
): string | number => {
  return typeof rowKey === "function" ? rowKey(item) : (item[rowKey] as any);
};

const DraggableList = <T extends Record<string, any>>({
  rowKey,
  labelKey,
  sort = () => 0,
  items = [],
  value = [],
  onChange,
  onTransform,
  renderItem,
  disabled = false,
  className,
  style,
}: DraggableListProps<T>) => {
  // -------- 状态管理 --------
  const [enabledItems, setEnabledItems] = useState<T[]>([]);
  const [disabledItems, setDisabledItems] = useState<T[]>(items);

  // 同步外部 value
  useEffect(() => {
    if (Array.isArray(value)) {
      const sortedValue = [...value].sort(sort);
      setEnabledItems(sortedValue);
      const enabledIds = new Set(value.map((i) => getItemKey(i, rowKey)));
      const filteredDisabled = items.filter(
        (i) => !enabledIds.has(getItemKey(i, rowKey)),
      );
      setDisabledItems(filteredDisabled);
    }
  }, [value, items, rowKey, sort]);

  const triggerChange = useCallback(
    (newEnabled: T[]) => {
      const itemsWithOrder = newEnabled.map(
        (item, index) =>
          onTransform?.(item, index) || {
            ...item,
            order: index + 1,
          },
      );
      onChange?.(itemsWithOrder);
    },
    [onChange, onTransform],
  );

  const toggleItem = useCallback(
    (item: T, currentlyEnabled: boolean) => {
      const targetKey = getItemKey(item, rowKey);
      if (currentlyEnabled) {
        // 禁用：从启用移到禁用
        const newEnabled = enabledItems.filter(
          (i) => getItemKey(i, rowKey) !== targetKey,
        );
        setEnabledItems(newEnabled);
        setDisabledItems([...disabledItems, item]);
        triggerChange(newEnabled);
      } else {
        // 启用：从禁用移到启用
        const newDisabled = disabledItems.filter(
          (i) => getItemKey(i, rowKey) !== targetKey,
        );
        const newEnabled = [...enabledItems, item];
        setDisabledItems(newDisabled);
        setEnabledItems(newEnabled);
        triggerChange(newEnabled);
      }
    },
    [enabledItems, disabledItems, triggerChange, rowKey],
  );

  // -------- 拖拽状态相关 --------
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  // -------- 事件处理逻辑 --------

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      if (disabled || index >= enabledItems.length) return;
      dragIndexRef.current = index;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
      setTimeout(() => setDragIndex(index), 0);
    },
    [disabled, enabledItems.length],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      if (disabled || index >= enabledItems.length) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "none";
        return;
      }
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    },
    [disabled, enabledItems.length],
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      if (disabled || index >= enabledItems.length) return;
      e.preventDefault();
      if (dragIndexRef.current !== index) {
        setOverIndex(index);
      }
    },
    [disabled, enabledItems.length],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
      if (disabled || dropIndex >= enabledItems.length) return;
      e.preventDefault();

      const fromIndex = dragIndexRef.current;
      if (
        fromIndex === null ||
        fromIndex === dropIndex ||
        fromIndex >= enabledItems.length
      ) {
        setDragIndex(null);
        setOverIndex(null);
        dragIndexRef.current = null;
        return;
      }

      const newEnabled = [...enabledItems];
      const [draggedItem] = newEnabled.splice(fromIndex, 1);
      newEnabled.splice(dropIndex, 0, draggedItem);

      setDragIndex(null);
      setOverIndex(null);
      dragIndexRef.current = null;

      setEnabledItems(newEnabled);
      triggerChange(newEnabled);
    },
    [disabled, enabledItems, triggerChange],
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
    dragIndexRef.current = null;
  }, []);

  // -------- 容器渲染 --------

  return (
    <div
      className={`${styles.draggableList} lst-draggable-list ${
        className || ""
      }`}
      style={style}
    >
      {[...enabledItems, ...disabledItems].map((item, index) => {
        const isEnabled = index < enabledItems.length;
        const key = getItemKey(item, rowKey);
        return (
          <div
            key={key}
            className={`${styles.dragItem} lst-draggable-item ${
              dragIndex === index ? styles.dragging : ""
            } ${overIndex === index ? styles.over : ""} ${
              disabled || !isEnabled ? styles.disabled : ""
            }`}
            draggable={!disabled && isEnabled}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className={styles.dragMain}>
              {isEnabled && !disabled && (
                <span className={`${styles.dragHandle} lst-draggable-handle`}>
                  <span className={styles.orderBadge}>{index + 1}</span>
                </span>
              )}
              <span className={`${styles.dragContent} lst-draggable-content`}>
                {renderItem
                  ? renderItem(item, index)
                  : labelKey
                    ? (item[labelKey] as any)
                    : String(key)}
              </span>
            </div>

            <div className={styles.checkboxArea}>
              <Checkbox
                disabled={disabled}
                checked={isEnabled}
                onChange={() => toggleItem(item, isEnabled)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DraggableList;
