module.exports = {
// jwt验证路由白名单
 WHITE_LIST: [
     '/admin/user/login',
     '/admin/user/captcha',
 ],
 // 初始化密码
 INITIAL_PASSWORD: '123456',
  MAIL_CONF: {
    host: 'smtp.qq.com',
    port: 465,
    account: 'xiangzhong1122@qq.com',
    grantedKey: 'daarsntmgmbobcad'
  }
}