import { defineConfig } from "dumi";

export default defineConfig({
  themeConfig: {
    name: "lstdesign",
    nav: [
      { title: "介绍", link: "/guide" },
      { title: "组件", link: "/components/loading-by-scroll" },
    ],
  },
  apiParser: {},
  outputPath: "docs-dist",
  resolve: {
    atomDirs: [{ type: "component", dir: "src/components" }],
    entryFile: "./src/index.ts",
  },
  crossorigin: {},
  plugins: ["@umijs/plugins/dist/tailwindcss"],
  tailwindcss: {},
});
