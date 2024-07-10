export default {
    TOKEN_NOT_FOUND: {
        code: 401,
        msg: '用户未登录'
    },
    TOKEN_INVALID: {
        code: 401,
        msg: 'token无效，请重新登录'
    },
    PERMISSION_DENIED: {
        code: 403,
        msg: '账号无权限执行此操作'
    },
    USER_CHANGE_SELF_STATUS_DENIED: {
        code: 403,
        msg: '不能修改自己账号的状态'
    },
    USER_CHANGE_SUPER_ADMIN_STATUS_DENIED: {
        code: 403,
        msg: '不能修改超级管理员账号状态'
    },
    USER_DELETE_SUPER_ADMIN_DENIED: {
        code: 403,
        msg: '不能删除超级管理员账号'
    },
    USER_NOT_FOUND: {
        code: 404,
        msg: '用户不存在'
    }
}