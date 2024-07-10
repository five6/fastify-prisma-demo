
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
        MONGO_DB_SESSION_URL: {
            type: 'string'
        },
        GLX_JWT_APP_SECRET: {
            type: 'string'
        },
        GLX_JWT_ADMIN_SECRET: {
            type: 'string'
        },
        GLX_SESSION_SECRET: {
            type: 'string'
        },
        JWT_EXPIRE_TIME: {
            type: 'string'
        },
        MYSQL_DB_URL: {
            type: 'string'
        },
        SESSION_EXPIRES: {
            type: 'number'
        },
        MINIO_ENDPOINT: {
            type: 'string'
        },
        MINIO_ENDPOINT_HOST: {
            type: 'string'
        },
        MINIO_PORT: {
            type: 'integer'
        },
        MINIO_BUCKET: {
            type: 'string'
        },
        MINIO_ACCESS_KEY: {
            type: 'string'
        },
        MINIO_SECRET_KEY: {
            type: 'string'
        }

    }
}

const options = {
    dotenv: true,
    schema: schema,
    data: process.env
}

module.exports = options;