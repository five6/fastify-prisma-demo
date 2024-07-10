'use strict'

const fp = require('fastify-plugin')
const jwt = require("jsonwebtoken")
const { TOKEN_NOT_FOUND, TOKEN_INVALID, PERMISSION_DENIED} = require('../common/errors')
const {GLX_ADMIN_AUTH_JWT_PREFIX, GLX_APP_AUTH_JWT_PREFIX} = require("../common/redisKey");
const {comparePassword, decodeJwt, getAdminAuthJwtPrefix, getAdminPermissionPrefix } = require("../common/utils");

const utils = require('../common/utils');
// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(async function (fastify, opts) {
  fastify.decorate('someSupport', function () {
    return 'hugs'
  })

  fastify.decorate('jwtAdminSign', async function (payload) {
    return jwt.sign(payload, fastify.config.GLX_JWT_ADMIN_SECRET, { expiresIn: fastify.config.JWT_EXPIRE_TIME });
  })

  fastify.decorate('jwtAppSign', async function (payload) {
    return jwt.sign(payload, fastify.config.GLX_JWT_APP_SECRET,   { expiresIn: fastify.config.JWT_EXPIRE_TIME });
  })

  fastify.decorate('jwtAdminAuthenticate', async function (request, reply) {
    try {
      const token = request.headers.authorization && request.headers.authorization.split(' ')[1];
      if (!token) {
        return reply.code(401).send(TOKEN_NOT_FOUND);
      }
      const decoded = await jwt.verify(token, fastify.config.GLX_JWT_ADMIN_SECRET);
      const redisToken = await fastify.redisGet(utils.getSingleAdminAuthJwtPrefix(decoded.username));
      if(!redisToken || token != redisToken) {
        return reply.code(401).send(TOKEN_INVALID);
      }
    } catch (error) {
      return reply.code(401).send(TOKEN_INVALID);
    }
  })

  fastify.decorate('jwtAppAuthenticate', async function (request, reply) {
    try {
      const token = request.headers.authorization && request.headers.authorization.split(' ')[1];
      if (!token) {
        return reply.code(401).send(TOKEN_NOT_FOUND);
      }
      const decoded = await jwt.verify(token, fastify.config.GLX_JWT_APP_SECRET);
      const redisToken = await fastify.redisGet(utils.getSingleMemberAuthJwtPrefix(decoded.openId));
      if (!redisToken) {
        return reply.code(401).send(TOKEN_INVALID);
      }
    } catch (error) {
      return reply.code(401).send(TOKEN_INVALID);
    }
  })

  fastify.decorate('getUser', async function(request) {
    const token = request.headers.authorization && request.headers.authorization.split(' ')[1];
    if (!token) {
      return request?.session?.user;
    }
    return jwt.decode(token);
  });

  /**
   * 校验权限，不存在直接返回403 code
   */
  fastify.decorate('hasPermission', async (needPermissions, username, reply) => {
    try {
      if(!needPermissions?.length) return true;
      const permissions = await fastify.redisGet(getAdminPermissionPrefix(username));
      
      const hasPermission = () => permissions.every((permission) => needPermissions.includes(permission));
      const result = hasPermission();
      if(!result) {
        return reply.code(403).send(PERMISSION_DENIED);
      }
    } catch (error) {
      return reply.code(403).send(PERMISSION_DENIED);
    }
  })
})
