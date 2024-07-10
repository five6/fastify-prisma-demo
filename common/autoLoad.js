'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')
const _ = require('lodash')
const chalk = require('chalk')
module.exports = async function (fastify, opts) {
  // 加载文件夹模块
  const dirs = ['plugins', 'jobs', 'routes', 'services', 'hooks']
  dirs.forEach(dir => {
    console.log(chalk.greenBright(`加载目录: ${dir}`))
    fastify.register(AutoLoad, {
      dir: path.join(__dirname, '..', dir),
      options: Object.assign({}, opts)
    })
  });
}
