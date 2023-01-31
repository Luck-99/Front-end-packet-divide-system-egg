const fs = require('fs');
const path = require('path');

const enableEnv = process.env.npm_config_env;


if (enableEnv) {
    const targetPackageJsonFilePath = path.resolve(__dirname, '../package.json');

    // unlink文件
    // fs.unlinkSync(targetPackageJsonFilePath);

    const sourcePackageJsonFilePath = path.resolve(__dirname, `../${enableEnv}.json`);
    // 复制文件
    fs.copyFileSync(sourcePackageJsonFilePath, targetPackageJsonFilePath);

} else {
    console.error('请选择要打包的环境');
}