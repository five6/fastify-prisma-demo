const { v4: uuidv4 } = require('uuid');

module.exports = async function (fastify, options) {
    fastify.get('/', options, function (request, reply) {
        reply.render('index', { title: 'Fastify with Handlebars', uid: uuidv4() });
    })
}