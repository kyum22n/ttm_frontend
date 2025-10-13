const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  // 포트번호 변경
  devServer: {
    port: 80,
  },
});
