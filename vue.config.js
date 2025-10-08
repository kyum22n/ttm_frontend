const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  // 포트번호 변경
  devServer: {
    port: 80,
    proxy: {
      // ✅ pet API 프록시
      "/pet": {
        target: "http://localhost:8080", // 백엔드 주소
        changeOrigin: true,
      },
    },
  },
});
