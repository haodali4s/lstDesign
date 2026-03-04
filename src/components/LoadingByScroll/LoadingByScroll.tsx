import { useDebounceFn } from "ahooks";
import { Select, Spin } from "antd";
import type { ComponentProps } from "react";
import React, { useMemo, useReducer } from "react";
/**
 * 滚动加载配置选项
 */
interface ScrollLoadOptions {
  /**
   * 滚动加载阈值，支持像素(number/px)和百分比(%) 均为剩余多少时触发加载
   */
  threshold?: number | string;
}

/**
 * 滚动加载配置类型
 */
type ScrollLoadConfig = false | ScrollLoadOptions;

/**
 * 滚动加载选择器属性接口
 */
export interface LoadingByScrollProps<T = any> extends ComponentProps<
  typeof Select
> {
  /**
   * 异步请求函数
   * @param value 搜索框内容
   * @param pageNumber 页码
   * @param pageSize 每页数量
   * @returns 返回数据数组
   */
  request?: (
    value: string,
    pageNumber: number,
    pageSize: number,
  ) => Promise<{ data: T[]; totalCount: number }>;

  /**
   * 处理单条数据，返回选项配置
   * @param data 单条原始数据
   * @returns 包含 value、label 和 detail 的对象
   */
  handleData: (data: T) => {
    value: string | number; // 选项的值
    label: string | number; // 选项的标签
    detail?: Record<string, any>; // 选项的详情如果有其他需要的话可能会用的上
  };

  /**
   * 防抖时间（毫秒）
   */
  debounce?: number;

  /**
   * 分页长度
   */
  pageSize?: number;

  /**
   * 滚动加载配置
   * false: 关闭滚动加载
   * 请确保分页的数据足够多 能出滚动条 不然无法触发滚动加载
   */
  scrollLoad?: ScrollLoadConfig | false;
}

interface OptionItem {
  value: string | number;
  label: string | number;
  detail?: Record<string, any>;
}

interface State {
  options: OptionItem[];
  loading: boolean;
  finish: boolean;

  keyword: string;
  pageNumber: number;
}

type Action =
  | { type: "SEARCH"; payload: string }
  | { type: "RESET" }
  | { type: "START_LOADING" }
  | {
      type: "FETCH_SUCCESS";
      payload: { options: OptionItem[]; hasMore: boolean };
    }
  | { type: "FETCH_EMPTY" }
  | { type: "OPEN_INITIAL_FETCH" }
  | { type: "LOAD_MORE_TRIGGER" };

const initialState: State = {
  options: [],
  loading: false,
  finish: false,

  keyword: "",
  pageNumber: 1,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SEARCH":
      return {
        ...state,
        keyword: action.payload,
        options: [],
        loading: true,
        finish: false,

        pageNumber: 1,
      };
    case "START_LOADING":
      return { ...state, loading: true };
    case "OPEN_INITIAL_FETCH":
      return { ...state, loading: true, pageNumber: 1, options: [] };
    case "LOAD_MORE_TRIGGER":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        options: [...state.options, ...action.payload.options],
        pageNumber: state.pageNumber + 1,
        loading: false,
        finish: !action.payload.hasMore,
      };
    case "FETCH_EMPTY":
      return { ...state, finish: true, loading: false };
    case "RESET":
      return {
        ...state,
        options: [],
        keyword: "",
        finish: false,
        loading: false,

        pageNumber: 1,
      };
    default:
      return state;
  }
}

/**
 * 滚动加载下拉选择组件
 * @template T 列表项即接口返回的数据类型
 * @param props 组件属性
 */
const LoadingByScroll: React.FC<LoadingByScrollProps> = (props) => {
  const {
    request,
    handleData,
    debounce = 1000,
    pageSize = 10,
    scrollLoad = false,
    optionRender,
    ...rest
  } = props;

  const [state, dispatch] = useReducer(reducer, initialState);
  const { options, loading, finish, keyword, pageNumber } = state;
  const { onSelect, ...otherRest } = rest;

  const fetchData = async (value: string, page: number) => {
    if (!request) return;
    try {
      const { data = [], totalCount = 0 } = await request(
        value,
        page,
        pageSize,
      );

      const selectOptions = (data || []).map((item: any) => handleData(item));
      const isFinished = totalCount <= page * pageSize;

      if (selectOptions.length > 0) {
        dispatch({
          type: "FETCH_SUCCESS",
          payload: { options: selectOptions, hasMore: !isFinished },
        });
      } else {
        dispatch({ type: "FETCH_EMPTY" });
      }
    } catch {
      dispatch({ type: "FETCH_EMPTY" });
    }
  };

  const { run } = useDebounceFn(fetchData, { wait: debounce, leading: true });

  const finalOptions = useMemo(
    () => [
      ...options,
      // Load more button / Loading indicator at bottom
      ...(loading
        ? [
            {
              value: "__LOADING__",
              label: (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  className="cursor-default flex justify-center py-2"
                >
                  <Spin size="small" />
                </div>
              ),
              disabled: true,
            },
          ]
        : []),
      ...(!finish && !loading && options.length > 0
        ? [
            {
              value: "__LOAD_MORE__",
              label: (
                <div
                  className="text-center text-gray-500 hover:text-blue-500 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    dispatch({ type: "LOAD_MORE_TRIGGER" });
                    run(keyword, pageNumber);
                  }}
                >
                  加载更多
                </div>
              ),
            },
          ]
        : []),
    ],
    [options, loading, finish, run, keyword, pageNumber],
  );

  return (
    <Select
      options={finalOptions}
      filterOption={false}
      onSelect={(value, option) => {
        if (value === "__LOAD_MORE__" || value === "__LOADING__") {
          return;
        }
        onSelect?.(value, option);
      }}
      {...otherRest}
      popupRender={(menu) => {
        if (loading && options.length === 0) {
          return (
            <div className="p-4 flex justify-center items-center">
              <Spin />
            </div>
          );
        }
        return menu;
      }}
      optionRender={(oriOption, info) => {
        const { value, label } = (oriOption as any) || {};
        if (value === "__LOAD_MORE__" || value === "__LOADING__") {
          return label;
        }
        return optionRender ? optionRender(oriOption, info) : label;
      }}
      onSearch={(value) => {
        dispatch({ type: "SEARCH", payload: value });
        run(value, 1);
      }}
      onOpenChange={(open) => {
        if (open) {
          if (keyword === "") {
            dispatch({ type: "OPEN_INITIAL_FETCH" });
            run("", 1);
          }
        } else {
          dispatch({ type: "RESET" });
        }
      }}
      onPopupScroll={(e) => {
        if (!scrollLoad) return;
        const { clientHeight, scrollHeight, scrollTop } = e.target as any;
        let shouldLoad = false;
        const { threshold } = scrollLoad;

        if (threshold !== undefined) {
          if (typeof threshold === "number") {
            shouldLoad = scrollHeight - scrollTop - clientHeight <= threshold;
          } else if (typeof threshold === "string") {
            if (threshold.endsWith("%")) {
              const percent = parseFloat(threshold) / 100;
              shouldLoad =
                scrollTop + clientHeight >= scrollHeight * (1 - percent);
            } else if (threshold.endsWith("px")) {
              const px = parseFloat(threshold);
              shouldLoad = scrollHeight - scrollTop - clientHeight <= px;
            }
          }
        } else {
          shouldLoad = clientHeight / (scrollHeight - scrollTop) >= 0.9;
        }

        if (shouldLoad && !finish && !loading) {
          dispatch({ type: "LOAD_MORE_TRIGGER" });
          run(keyword, pageNumber);
        }
      }}
    />
  );
};

export default LoadingByScroll;
