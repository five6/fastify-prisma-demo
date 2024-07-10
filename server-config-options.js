
// 注册环境变量
const schema = {
    type: 'object',
    required: ['PORT'],
    properties: {
        PORT: {
          type: 'integer',
        },
        REDIS_DB_URL: {
            type: 'string'
        },
        MONGO_DB_URL: {
            type: 'string'
        },
        JWT_SECRET: {
            type: 'string'
        },
        JWT_EXPIRE_TIME: {
            type: 'string'
        },
    }
}

export default {
    dotenv: true,
    schema: schema,
    data: process.env
}
