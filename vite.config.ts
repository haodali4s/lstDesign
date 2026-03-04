import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "tsconfig.app.json",
      include: ["src/**/*.ts", "src/**/*.tsx"],
      // 排除掉不希望被打包出类型的内部本地测试文件
      exclude: ["src/App.tsx", "src/main.tsx"],
      outDir: ["dist/es", "dist/lib"],
    }),
  ],

  build: {
    // 开启保留模块目录结构后一般不压缩混淆，确保对使用者友好
    minify: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
    },
    rollupOptions: {
      // 确保包含所有源码但明确排除独立启动页
      external: [
        "react",
        "react-dom",
        "antd",
        "@ant-design/pro-components",
        "react/jsx-runtime",
        "ahooks",
      ],
      output: [
        {
          format: "es", // ES Modules 格式
          dir: "dist/es", // 输出到 dist 目录下
          preserveModules: true, // 开启保留模块树结构
          preserveModulesRoot: "src",
          entryFileNames: "[name].js",
        },
        {
          format: "cjs", // CommonJS 格式
          dir: "dist/lib", // 输出到 dist 目录下
          preserveModules: true, // 开启保留模块树结构
          preserveModulesRoot: "src",
          entryFileNames: "[name].cjs",
          exports: "named",
        },
      ],
    },
  },
});
