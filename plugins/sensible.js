'use strict'

import fp from 'fastify-plugin'
import sensible from '@fastify/sensible'
import { fastifyJwt } from '@fastify/jwt'
import * as errors from '../common/errors.js'
import path from 'path'
import fs from 'node:fs'
/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async (fastify) => {
  fastify.register(sensible)

  fastify.register(fastifyJwt, {
    secret: fastify.config.JWT_SECRET
  })
  // jwt
  fastify.decorate('token', async function (payload) {
    return await fastify.jwt.sign(payload, fastify.config.JWT_SECRET, { expiresIn: +fastify.config.JWT_EXPIRE_TIME });
  })

  fastify.decorate('verify', async function (request, reply) {
    try {
      const token = request.headers.authorization && request.headers.authorization.split(' ')[1];
      if (!token) {
        return reply.code(401).send(errors.TOKEN_NOT_FOUND);
      }
      const decoded = await jwt.verify(token, fastify.config.GLX_JWT_ADMIN_SECRET);
      const redisToken = await fastify.redisGet(utils.getSingleAdminAuthJwtPrefix(decoded.username));
      if (!redisToken || token != redisToken) {
        return reply.code(401).send(errors.TOKEN_INVALID);
      }
    } catch (error) {
      return reply.code(401).send(errors.TOKEN_INVALID);
    }
  })


  // /**
  //  * 校验权限，不存在直接返回403 code
  //  */
  // fastify.decorate('hasPermission', async (needPermissions, username, reply) => {
  //   try {
  //     if (!needPermissions?.length) return true;
  //     const permissions = await fastify.redisGet(utils.getAdminPermissionPrefix(username));

  //     const hasPermission = () => permissions.every((permission) => needPermissions.includes(permission));
  //     const result = hasPermission();
  //     if (!result) {
  //       return reply.code(403).send(errors.PERMISSION_DENIED);
  //     }
  //   } catch (error) {
  //     return reply.code(403).send(errors.PERMISSION_DENIED);
  //   }
  // })
})
