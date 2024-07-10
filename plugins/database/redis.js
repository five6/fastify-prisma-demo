const fp = require("fastify-plugin");
const jwt = require("jsonwebtoken");
const {GLX_ADMIN_AUTH_JWT_PREFIX} = require("../../common/redisKey");
const fastify = require('fastify')()

module.exports = fp(async function (fastify, opts) {
    // fastify.log.info('redis环境变量：' + fastify.config.REDIS_DB_URL);
    // fastify.register(require('@fastify/redis'), {
    //     url: fastify.config.REDIS_DB_URL,
    //     // host: '127.0.0.1',
    //     // password: '***',
    //     // port: 6379, // Redis port
    // })

    // fastify.decorate('redisSet', async function(key, value, seconds) {
    //     value = JSON.stringify(value);
    //     if (seconds) {
    //         await fastify.redis.set(key, value, 'EX', seconds);
    //     } else {
    //         await fastify.redis.set(key, value);
    //     }
    // });
    // fastify.decorate('redisGet', async function(key) {
    //     const data = await fastify.redis.get(key);
    //     if (!data) {
    //         return null;
    //     }
    //     return JSON.parse(data);
    // });
    // fastify.decorate('redisSetHash', async function(hashKey, key, value) {
    //     value = JSON.stringify(value);
    //     await fastify.redis.hset(hashKey, key, value);
    // });

    // fastify.decorate('redisGetHash', async function(hashKey, key) {
    //     const data = await fastify.redis.hget(hashKey, key);
    //     if (!data) {
    //         return null;
    //     }
    //     return JSON.parse(data);
    // });

    // fastify.decorate('redisDel', async function(key) {
    //     await fastify.redis.del(key);
    // });

    // fastify.decorate('redisDelHash', async function(key) {
    //     await fastify.redis.hdel(key);
    // });
})
