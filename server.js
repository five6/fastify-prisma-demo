'use strict'

import path from 'path'
import { fileURLToPath } from 'url'
import fastifyEnv from '@fastify/env'

import fastifyView from '@fastify/view'
import Fastify from 'fastify'
import pino from 'pino'
import dayjs from 'dayjs'
import fastifyCors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import fastifySocketIO from 'fastify-socket.io'
import fastifySchedule from '@fastify/schedule'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import serverOptions from './server-config-options.js'
import closeWithGrace from 'close-with-grace'
import chalk from 'chalk';
import AutoLoad from '@fastify/autoload';
import Handlebars from 'handlebars';

import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Instantiate Fastify with some config
const app = Fastify({
  logger: pino({
    prettyPrint: false, // 将 prettyPrint 设置为 false 以格式化为 JSON
    level: 'info', // 设置日志级别
    timestamp: () => `,"time":"${dayjs().format('YYYY-MM-DD HH:mm:ss')}"`, // 自定义时间戳
  })
})

// 注册middleware
app.register(fastifyCors)
app.register(fastifyMultipart, {
  limits: {
    files: 1, // 只能传一个文件
    fileSize: 1024 * 1024 * 10 //  文件限制10m
  }
})

app.register(fastifySocketIO, {
  // put your options here
});

app.register(fastifyView, {
  engine: {
    handlebars: Handlebars,
  },
  root: path.join(__dirname, "views"), // Points to `./views` relative to the current file
  // layout:  path.join(__dirname, "templates/layout.hbs"), // Sets the layout to use to `./views/templates/layout.handlebars` relative to the current file.
  viewExt: "html", // Sets the default extension to `.handlebars`
  propertyName: "render", // The template can now be rendered via `reply.render()` and `fastify.render()`
  defaultContext: {
    dev: process.env.NODE_ENV === "dev", // Inside your templates, `dev` will be `true` if the expression evaluates to true
  },
  options: {
    partials: {
      header: 'header.html',
      footer: 'footer.html'
    }
  }, // No options passed to handlebars
});


app.register(fastifySchedule);

app.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Fastify Swagger文档',
      description: 'Fastify swagger Api',
      version: '1.0.0'
    },
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  }
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  exposeRoute: false, // 自动暴露 Swagger JSON 文件的路由
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
  transformSpecificationClone: true
})

// 注册环境变量内容
const initializeEnv = async () => {
  app.register(fastifyEnv, serverOptions)
  // 注册内容
  const dirs = ['plugins', 'jobs', 'routes', 'hooks'];
  for (const dir of dirs) {
    console.log(chalk.greenBright(`加载目录: ${dir}`));
    console.log(chalk.greenBright(`加载目录: ${path.join(__dirname, '.', dir)}`));

    const autoLoadOptions = {
      dir: path.join(__dirname, '.', dir),
      options: {}
    };
    app.register(AutoLoad, autoLoadOptions);
    await app.after()
  }
}

(async () => {
  await initializeEnv();

  // Require library to exit fastify process, gracefully (if possible)
  // delay is the number of milliseconds for the graceful close to finish
  const closeListeners = closeWithGrace({ delay: process.env.FASTIFY_CLOSE_GRACE_DELAY || 500 }, async function ({ signal, err, manual }) {
    if (err) {
      app.log.error(err)
    }
    await app.close()
  })

  app.addHook('onClose', async (instance, done) => {
    closeListeners.uninstall()
    done()
  })

  // Start listening.
  app.listen({ port: app.config.PORT || 3000 }, (err) => {
    app.startTime = new Date().getTime()
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
  })
})();
