const _ = require("lodash");
const { comparePassword, decodeJwt, getAdminAuthJwtPrefix, getAdminPermissionPrefix } = require("../../common/utils");
const { findUser } = require('../../services/user.service')
module.exports = async function (fastify, options) {
  fastify.post('/login',{
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
      const token = fastify.jwt.sign({
        payload: {
          username: user.username,
          userId: user.id
        }
      })
      return reply.send({ token })
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
    },
    handler: async (req, reply) => {
      const body = req.body;
      const salt = await makeSalt()
      const password = await generatePassword(body.password, salt)
      const user = await prisma.user.create({
        data: {
          username: body.username,
          password: password,
          salt: salt,
          email: body.email
        }
      })
      return {
        username: user?.username,
        email: user?.email
      }
    }
  })
  fastify.route({
    method: 'POST',
    url: '/user/logout',
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