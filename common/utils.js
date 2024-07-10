import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import svgCaptcha from 'svg-captcha';
import * as redisKeys from './redisKey.js';

export async function generatePassword(password, salt) {
   return await bcrypt.hashSync(password, salt);
}
export async function makeSalt(rounds = 10) {
   return await bcrypt.genSaltSync(rounds);
}

export async function comparePassword(password, hash) {
   return await bcrypt.compareSync(password, hash);
}

export async function decodeJwt(token) {
   return jwt.decode(token)
}

export async function getCaptcha(size, width, height) {
   return svgCaptcha.create({
      size: size || 6,
      fontSize: 35,
      noise: 1, // 干扰线数量
      width: width || 110,
      height: height || 38,
      ignoreChars: '0oO1iIlL', // 忽略一些容易混淆的字符
      background: 'transparent',
      // background: '#f0f0f0', // 设置背景颜色
      color: true, // 使用随机颜色
   });
}


export async function getAdminAuthJwtPrefixLength(key) {
   return `${redisKeys.GLX_ADMIN_AUTH_JWT_PREFIX}:${key}:*`;
}

// 单客户端在线
export async function getSingleAdminAuthJwtPrefix(key) {
   return `${redisKeys.GLX_ADMIN_AUTH_JWT_PREFIX}:${key}`;
}

// 多客户端在线
export async function getAdminAuthJwtPrefix(key, nextIndex = 1) {
   return `${redisKeys.GLX_ADMIN_AUTH_JWT_PREFIX}:${key}:${nextIndex}`;
}

// 单客户端在线
export async function getSingleMemberAuthJwtPrefix(key) {
   return `${redisKeys.GLX_APP_AUTH_JWT_PREFIX}:${key}`;
}

// 后台管理员用户权限
export async function getAdminPermissionPrefix(key) {
   return `${redisKeys.GLX_ADMIN_USER_PERMISSION_PREFIX}:${key}`;
}
