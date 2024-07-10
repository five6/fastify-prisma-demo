const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const findUser = async (info) => {
    return await prisma.user.findFirst({
       where: {
        OR: [
            { username: info },
            { email: info }
        ]
       }
    });
}

module.exports = {
    findUser
}