import dayjs from "dayjs"
import humanFormat from "human-format"
import prettyMilliseconds from "pretty-ms"
import UAParser from "ua-parser-js"
import os from 'os'
export default async function (fastify, options) {
    fastify.get('/', {
        handler: async (request, reply) => {
            // 渲染页面
            // reply.render('index', { title: 'Fastify with Handlebars' });
            let ua = UAParser(request.headers['user-agent']);
            const ret = Object.assign({client: ua}, {
                server: {
                    cpus: os.cpus(),
                    freemem: humanFormat(os.freemem()),
                    machine: os.machine(),
                    frameworkVersion: reply.server.version,
                    onLineTime: prettyMilliseconds(new Date().getTime() - fastify.startTime)
                }
            })
            return reply.send(JSON.stringify(ret, null, '  '))

        },  
        schema: {
            description: '系统信息',
            tags: ['系统信息'],
            summary: '系统信息',
            response: {
            }
        },
    })
}