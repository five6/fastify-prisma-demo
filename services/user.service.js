import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { comparePassword, decodeJwt, generatePassword, makeSalt } from '../common/utils.js'

export const findUser = async (info) => {
    return await prisma.user.findFirst({
        where: {
            OR: [
                { username: info },
                { email: info }
            ]
        }
    });
}

export const createUser = async (body) => {
    const salt = await makeSalt()
    const password = await generatePassword(body.password, salt)
    return await prisma.user.create({
        data: {
            username: body.username,
            password: password,
            salt: salt,
            email: body.email
        }
    })
}