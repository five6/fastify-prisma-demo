import chalk from "chalk";


export default async function (fastify, options) {
    console.log(chalk.greenBright(`加载目录[hooks]: 执行package-info.js`))
}
