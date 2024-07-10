// this file is for pm2
module.exports = {
    apps : [{
        name: 'fastify-server',
        script: 'server.js',
        instances: 2,
        exec_mode: 'cluster',
        autorestart: true,
        watch: false,
        max_memory_restart: '2G',
        env_dev: {
            NODE_ENV: 'dev',
            PORT:3000,
            REDIS_DB_URL:'localhost:6379',
            MONGO_DB_URL: 'mongodb://localhost:27017/smart-glx',
        },
        env_test: {
            NODE_ENV: 'test',
            PORT: 3000,
            REDIS_DB_URL:'localhost:6379',
            MONGO_DB_URL: 'mongodb://localhost:27017/smart-glx',
        },
        env_gray: {
            NODE_ENV: 'gray',
            PORT: 3000,
            REDIS_DB_URL:'localhost:6379',
            MONGO_DB_URL: 'mongodb://localhost:27017/smart-glx',
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 3000,
            REDIS_DB_URL:'localhost:6379',
            MONGO_DB_URL: 'mongodb://localhost:27017/smart-glx',
        }
    }]
}
