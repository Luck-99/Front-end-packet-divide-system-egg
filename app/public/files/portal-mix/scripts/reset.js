const fs = require('fs');
const path = require('path');

const targetPackageJsonFilePath = path.resolve(__dirname, '../package.json');

// fs.unlinkSync(targetPackageJsonFilePath);

const initPackJsonPath = path.resolve(__dirname, '../init.json');

fs.copyFileSync(initPackJsonPath, targetPackageJsonFilePath);