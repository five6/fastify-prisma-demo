import * as _ from 'lodash'
import { comparePassword, decodeJwt } from '../../common/utils.js'
import { createUser, findUser } from '../../services/user.service.js'
export default async function (fastify, opts) {
  fastify.post('/login', {
    handler: async (request, reply) => {
      const user = await findUser(request.body.username);
      if (!user) {
        return {
          code: -1,
          message: '用户不存在'
        };
      }
      if (!comparePassword(user.password, request.body.password)) {
        return {
          code: -1,
          message: '密码不正确'
        };
      }

      const token = await fastify.token({
        payload: {
          username: user.username,
          userId: user.id
        }
      })
      const data = { data: {} }
      if (token) {
        const jwtDecoded = await decodeJwt(token);
        data.data.expiresTime = jwtDecoded?.exp;
        data.data.accessToken = token;
      } else {
        data.data = null;
        data.success = false;
        data.msg = 'token获取失败';
      }
      
      return reply.send(data)
    },
    schema: {
      description: '用户登录',
      tags: ['用户'],
      summary: '用户登录',
      body: {
        type: 'object',
        properties: {
          username: { type: 'string', description: '当前页数' },
          password: { type: 'string', description: '每页结果数量' },
          captcha: { type: 'string', description: '图形验证码' },
          rememberMe: { type: 'boolean', description: '记住我' }
        }
      },
      response: {
        200: {
          code: { type: 'number', default: 0 },
          success: { type: 'boolean', default: true },
          msg: { type: 'string', default: 'success' },
          data: {
            type: 'object',
            properties: {
              accessToken: { type: 'string', description: 'token' },
              expiresTime: { type: 'number', description: '超时时间' },
              refreshToken: { type: 'string', description: 'refresh token' },
              userId: { type: 'string', description: '用户id' },
            }
          }
        },
      }
    },
  });
  fastify.post('/register', {
    schema: {
      description: '用户注册',
      tags: ['用户'],
      summary: '用户注册',
      body: {
        type: 'object',
        required: ['username', 'password', 'email'],
        properties: {
          username: { type: 'string', description: '用户名' },
          password: { type: 'string', description: '密码' },
          email: { type: 'string', description: '邮箱', format: 'email' },
          sex: { type: 'string', description: '性别' }
        }
      },
      response: {
        409: {
          code: { type: 'number', default: -1 },
          success: { type: 'boolean', default: false },
          msg: { type: 'string', default: 'fail' },
        },
        409: {
          code: { type: 'number', default: -1 },
          success: { type: 'boolean', default: false },
          msg: { type: 'string', default: 'fail' },
        },
        200: {
          code: { type: 'number', default: 0 },
          success: { type: 'boolean', default: true },
          msg: { type: 'string', default: 'success' },
        },
      }
    },
    handler: async (req, reply) => {
      try {
        const user = await createUser(req.body);
        return {
          username: user?.username,
          email: user?.email
        }
      } catch (expction) {
        fastify.log.info(`用户注册失败:${expction.message}`);
        if (expction.code = 'p2002') {
          reply.code(409).send({ msg: '用户名或邮箱重复，请重新注册' });
        } else {
          reply.code(500).send({ msg: '系统异常，注册失败' });
        }
      }
    }
  })
  fastify.route({
    method: 'POST',
    url: '/logout',
    handler: async (request, reply) => {
      let { body } = request;
      return {
        code: 0,
        success: true,
        data: null,
        msg: '退出成功'
      }
    },
    schema: {
      description: '退出登录',
      tags: ['用户'],
      summary: '退出登录',
    },
  });
}