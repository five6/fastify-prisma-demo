'use strict'

const fastifyEnv = require('@fastify/env')
const { fastifySchedulePlugin } = require('@fastify/schedule');
const dayjs = require('dayjs');
const pino = require('pino');
const path = require('node:path');

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
// Require the framework
const Fastify = require('fastify')

// Instantiate Fastify with some config
const app = Fastify({
  logger: pino({
    prettyPrint: false, // 将 prettyPrint 设置为 false 以格式化为 JSON
    level: 'info', // 设置日志级别
    timestamp: () => `,"time":"${dayjs().format('YYYY-MM-DD HH:mm:ss')}"`, // 自定义时间戳
  })
})
const options = require("./server-config-options");

const fastifyView = require("@fastify/view")

// 注册middleware
app.register(require('@fastify/cors'))
app.register(require('@fastify/multipart', {
  limits: {
    files: 1, // 只能传一个文件
    fileSize: 1024 * 1024 * 10 //  文件限制10m
  }
}))

app.register(require("fastify-socket.io"), {
  // put your options here
});

app.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
  root: path.join(__dirname, "views"), // Points to `./views` relative to the current file
  // layout:  path.join(__dirname, "templates/layout.hbs"), // Sets the layout to use to `./views/templates/layout.handlebars` relative to the current file.
  viewExt: "hbs", // Sets the default extension to `.handlebars`
  propertyName: "render", // The template can now be rendered via `reply.render()` and `fastify.render()`
  defaultContext: {
    dev: process.env.NODE_ENV === "dev", // Inside your templates, `dev` will be `true` if the expression evaluates to true
  },
  options: {
    partials: {
      header: 'header.hbs',
      footer: 'footer.hbs'
    }
  }, // No options passed to handlebars
});


app.register(fastifySchedulePlugin);

app.register(require('@fastify/swagger'), {
  swagger: {
    info: {
      title: 'Swagger Documentation',
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

app.register(require('@fastify/swagger-ui'), {
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
  app.register(fastifyEnv, options)
  await app.after()
  // Register your application as a normal plugin.
  const autoLoad = require('./common/autoLoad')
  app.register(autoLoad)
}

(async () => {
  await initializeEnv();

  // Require library to exit fastify process, gracefully (if possible)
  const closeWithGrace = require('close-with-grace')
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
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
  })
})();
