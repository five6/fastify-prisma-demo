module.exports = {
    listSchema: {
        description: '获取用户列表',
        tags: ['用户'],
        summary: '获取用户列表',
        querystring: {
            type: 'object',
            properties: {
                pageNo: { type: 'integer', minimum: 1, default: 1, description: '当前页数' },
                pageSize: { type: 'integer', minimum: 1, default: 10, description: '每页结果数量' },
                username: { type: 'string',default: null, description: '用户名' },
                mobile: { type: 'string', default: null, description: '手机号码' },
                status: { type: 'integer',nullable: true, default: null, description: '用户状态' },
                deptId: { type: 'string', default: null, description: '部门' },
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
                        total: { type: 'integer', default: 0, description: '总数'},
                        list: { type: 'array', default: [], description: '数据'}
                    }
                }
            }
        }
    },
    loginSchema: {
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
                        accessToken: { type: 'string', description: 'token'},
                        expiresTime: { type: 'number', description: '超时时间'},
                        refreshToken: { type: 'string', description: 'refresh token'},
                        userId: { type: 'string', description: '用户id'},
                    }
                }
            },
        }
    },
    addUserSchema: {
        description: '新增用户',
        tags: ['用户'],
        summary: '新增用户',
        body: {
            type: 'object',
            required: ['username', 'password','mobile', 'email','sex'],
            properties: {
                username: { type: 'string', description: '用户名' },
                password: { type: 'string', description: '密码' },
                email: { type: 'string', description: '邮箱' },
                mobile: { type: 'string', description: '手机' },
                idCard: { type: 'string', description: '身份证' },
                birthday: { type: 'string', description: '生日' },
                avatar: { type: 'string', description: '头像' },
                status: { type: 'integer', nullable: true, default: 1, description: '状态' }
            }
        },
    },
    updateSchema: {
        description: '更新用户信息',
        tags: ['用户'],
        summary: '更新用户信息',
        body: {
            type: 'object',
            required: ['id', 'nickname','mobile', 'email','sex', 'deptId'],
            additionalProperties: false, // 禁用额外参数
            properties: {
              id: { type: 'string' },
              nickname: { type: 'string' },
              mobile: { type: 'string'},
              email: { type: 'string' },
              remark: { type : 'string' }
            }
        }
    },
    updatePasswordSchema: {
        description: '更新用户密码',
        tags: ['用户'],
        summary: '更新用户密码',
        body: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                password: { type : 'string' }
            }
        }
    },
    userDetailSchema: {
        description: '获取用户详情',
        tags: ['用户'],
        summary: '获取用户详情',
        querystring: {
            type: 'string',
            properties: {
                userId: { type: 'string', description: '用户详情' }
            }
        },
        response: {
            200: {
                code: { type: 'number', default: 0 },
                success: { type: 'boolean', default: true },
                message: { type: 'string', default: 'success' },
                data: {
                    type: 'object',
                    properties: {
                        items: {
                            type: 'object',
                            properties: {
                                _id: {type: 'string'},
                                username: { type: 'string' },
                                nickname: { type: 'string' },
                                email: { type: 'string' },
                                mobile: { type: 'string'},
                                createTime: { format: 'date-time' }
                            }
                        },
                        total: { type: 'number' },
                    }
                }
            },
        }
    }
}