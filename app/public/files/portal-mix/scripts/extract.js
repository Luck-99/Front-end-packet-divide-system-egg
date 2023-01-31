const path = require('path')
const fs = require('fs')
const fileHelper = require('./copy.js')

// console.log(fileHelper)

// 提供不打包配置对象 exclude   ['@zglib/md-test-1', '@zglib/md-test-2']
const excludePack = []

const packageJson = require('../package.json')

// console.log(packageJson.dependencies)

const envDir = process.env.npm_config_env ?? 'dist'

const projectEnvs = require('../projectEnvs.json')
function getProjectName(env) {
  if (!projectEnvs) {
    return
  }
  const project = projectEnvs.find((item) => item.key === envDir)
  return project?.description ?? envDir
}

const output = path.resolve(__dirname, `../${getProjectName(envDir)}`)

// 清空文件夹
function clearDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }
  fs.readdirSync(dir).forEach((file) => {
    const curPath = path.join(dir, file)
    if (fs.statSync(curPath).isDirectory()) {
      clearDir(curPath)
      fs.rmdirSync(curPath)
    } else {
      fs.unlinkSync(curPath)
    }
  })
}
// 复制文件夹下所有文件
function copyFiles(src, dest) {
  if (!fs.existsSync(src)) {
    return
  }
  fs.readdirSync(src).forEach((file) => {
    const curPath = path.join(src, file)
    if (fs.statSync(curPath).isDirectory()) {
      copyFiles(curPath, path.join(dest, file))
    } else {
      fs.copyFileSync(curPath, path.join(dest, file))
    }
  })
}

// 判断文件夹是否存在，不存在则创建
function createDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

// 判断dist是否存在
if (!fs.existsSync(output)) {
  fs.mkdirSync(output)
} else {
  // 清空dist下的内容
  clearDir(output)
}

// 遍历依赖。抽取文件，形成依赖
Object.keys(packageJson.dependencies).forEach((key) => {
  console.log(`${key}  ${packageJson.dependencies[key]}`)
  if (excludePack.indexOf(key) === -1) {
    const targetDir = path.join(output, key.replace('@zglib/', ''))
    // console.log(targetDir)

    createDir(targetDir)
    // copyFiles(path.join(__dirname, '../node_modules', key), targetDir);
    fileHelper.copyDir(path.join(__dirname, '../node_modules', key), targetDir)
  }
})
